<template>
  <div class="home">
    <Button @click='savetabs'>save all in this window</Button>
    <Button @click='newlist'>new list</Button>
    <Button @click='exportTab'>export</Button>
    <Button class="import-new">import
      <input id="file" class="import-old" @change="importFile" type="file" accept="application/json">
    </Button>
    <Button @click='syncRemote'>sync</Button>
    <Tablist class="tab-card" :blockItem="$store.state.temptabs" :changelist='changeTemp' isStatic></Tablist>
    <Draggable  v-model="tabstore" :options="{group:'tabstore'}" @start="drag=true" @end="drag=false">
      <div v-for="(value, index) in tabstore" :key="index" class='tab-group tab-card'>
        <Tablist :blockItem="value" :changelist='(key,val)=>changeTabEX(key,val,index)' :deleteTabList='()=>deleteTabList(index)'></Tablist>
      </div>
    </Draggable>
  </div>
</template>

<script>
import Draggable from 'vuedraggable';
import browser from 'webextension-polyfill';
import { saveAllCurrentWIndowTabs } from 'background/utils';
import { Button } from 'element-ui';
import Tablist from './tablist';

export default {
  name: 'home',
  components: {
    Draggable,
    Tablist,
    Button,
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
  methods: {
    savetabs() {
      saveAllCurrentWIndowTabs();
    },
    newlist() {
      this.$store.commit('newTablist');
    },
    changeTemp(key, val) {
      this.$store.commit('changeTemp', { key, val });
    },
    changeTabEX(key, val, index) {
      this.$store.commit('changeTabEX', {
        key,
        val,
        index,
      });
    },
    deleteTabList(index) {
      this.$store.commit('deleteTabList', index);
    },
    exportTab() {
      const tabsObj = {
        temptabs: this.$store.state.temptabs,
        tabstore: this.$store.state.tabstore,
        todoVal: this.$store.state.todoVal,
      };
      this.download('tabs-plan.json', JSON.stringify(tabsObj));
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
      this.$store.commit('changeTemp', { val: obj.temptabs });
      this.$store.commit('changeTabStore', obj.tabstore);
      this.$store.commit('changeTodoVal', obj.todoVal);
    },
    async syncRemote() {
      const localData = await browser.storage.local.get();
      console.log(localData);
    //   browser.storage.sync.set(localData).then((items) => {
    //     console.log(items);
    //   });
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
</style>

