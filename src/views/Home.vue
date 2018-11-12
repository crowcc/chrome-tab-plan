<template>
  <div class="home">
    <Button @click='savetabs'>save all in this window</Button>
    <Button @click='newlist'>new list</Button>
    <!-- <Button @click='exportTab'>export</Button>
    <Button class="import-new">import
      <input id="file" class="import-old" @change="importFile" type="file" accept="application/json" />
    </Button> -->
    <Button @click='()=>{uploading=true;uploadToDropbox()}' :loading="uploading" :style="{width:'100px'}">upload</Button>
    <!-- <Button @click='downloadDropbox'>download</Button> -->
    <Button @click='asyncDropbox' :loading="asyncing" :style="{width:'100px'}">async</Button>
    <Button @click='resetDropbox' :loading="asyncing" :style="{width:'100px'}">reset dropbox</Button>
    <!-- <Button @click='debug'>debug</Button> -->
    <Input
      class='filter-input'
      placeholder="搜索"
      v-model="filterVal" />
    <Tablist class="tab-card" :filterVal="filterVal" :blockItem="tabstore[0]" :changelist='(key,val)=>changeTabBlock(key,val,0)' :deleteTabList='()=>deleteTabList(0)' isStatic></Tablist>
    <Draggable  v-model="tabstore" :options="{group:'tabstore'}">
      <template v-for="(value, index) in tabstore" >
        <Tablist v-if='index!==0' class='tab-group tab-card' :filterVal="filterVal" :key="index" :blockIndex='index' :blockItem="value" :changelist='(key,val)=>changeTabBlock(key,val,index)' :deleteTabList='()=>deleteTabList(index)'></Tablist>
      </template>
    </Draggable>
  </div>
</template>

<script>
import Draggable from 'vuedraggable';
import browser from 'webextension-polyfill';
import { Dropbox } from 'dropbox';
import { saveAllCurrentWIndowTabs } from 'background/utils';
import { Button, Input } from 'element-ui';
import Tablist from './tablist';

let dbx;
let usrMail = '';
const CLIENT_ID = 'sthrhiwr4d6qyfw';

export default {
  name: 'home',
  data() {
    return {
      filterVal: '',
      asyncing: false,
      uploading: false,
    };
  },
  components: {
    Draggable,
    Tablist,
    Button,
    Input,
  },
  computed: {
    tabstore: {
      get() {
        return this.$store.state.tabstore;
      },
      set(value) {
        this.$store.commit('changeTabStore', value);
      },
    },
  },
  mounted() {
    browser.identity.getProfileUserInfo((info) => { usrMail = info.email; });
  },
  watch: {
    '$store.state.token'() {
      dbx = new Dropbox({ accessToken: this.$store.state.token });
    },
  },
  methods: {
    savetabs() {
      saveAllCurrentWIndowTabs();
    },
    newlist() {
      this.$store.commit('newTablist');
    },
    changeTabBlock(key, val, index) {
      this.$store.commit('changeTabBlock', {
        key,
        val,
        index,
      });
    },
    deleteTabList(index) {
      this.$store.commit('deleteTabList', index);
    },
    getTabsObj() {
      return {
        tabstore: this.$store.state.tabstore,
        todoVal: this.$store.state.todoVal,
        todoTodayVal: this.$store.state.todoTodayVal,
      };
    },
    importTabsObj(obj) {
      this.$store.commit('changeTabStore', obj.tabstore);
      this.$store.commit('changeTodoVal', obj.todoVal);
      this.$store.commit('changeTodoTodayVal', obj.todoTodayVal);
    },
    exportTab() {
      this.download('tabs-plan.json', JSON.stringify(this.getTabsObj()));
    },
    download(filename, content, contentType) {
      if (!contentType) contentType = 'application/octet-stream';
      const a = document.createElement('a');
      const blob = new Blob([content], {
        type: contentType,
      });
      a.href = window.URL.createObjectURL(blob);
      a.download = filename;
      a.click();
    },
    importFile(event) {
      const reader = new FileReader();
      reader.onload = this.onReaderLoad;
      reader.readAsText(event.target.files[0]);
    },
    onReaderLoad(event) {
      const obj = JSON.parse(event.target.result);
      this.importTabsObj(obj);
    },
    asyncDropbox() {
      this.asyncing = true;
      if (!dbx) {
        dbx = new Dropbox({ accessToken: this.$store.state.token });
      }
      this.downloadDropbox();
    },
    uploadToDropbox(obj) {
      if (!dbx) {
        dbx = new Dropbox({ accessToken: this.$store.state.token });
      }
      dbx.filesUpload({
        contents: JSON.stringify(obj || this.getTabsObj()),
        path: `/${usrMail}.json`,
        mode: 'overwrite',
        autorename: true,
        mute: true,
        strict_conflict: false,
      }).then(() => { this.asyncing = false; this.uploading = false; }).catch(() => { this.getToken(); });
    },
    getToken() {
      this.asyncing = false;
      this.uploading = false;
      dbx = new Dropbox({ clientId: CLIENT_ID });
      const authUrl = dbx.getAuthenticationUrl('https://crowcc.buttercup.com');
      window.open(authUrl);
    },
    downloadDropbox() {
      dbx.filesDownload({
        path: `/${usrMail}.json`,
      }).then((e) => {
        const blob = e.fileBlob;
        const reader = new FileReader();
        reader.addEventListener('loadend', () => {
          const obj = JSON.parse(reader.result);
          // diff预定
          this.importTabsObj(obj);
          this.uploadToDropbox(obj);
        });
        reader.readAsText(blob);
      }).catch(() => { this.getToken(); });
    },
    resetDropbox() {
      this.$store.commit('changeToken', '');
      this.getToken();
    },
    async debugStorage() {
      console.log(this.$store.state);
      browser.storage.local.clear();
      const localData = await browser.storage.local.get();
      console.log(localData);
    },
  },
};
</script>
<style lang="scss" scoped>
.tab-card {
  margin: 20px 0;
}
.import-new {
  position: relative;
}
.import-old {
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
  height: 100%;
  width: 100%;
}
.filter-input{
    margin-top:20px;
}
</style>

