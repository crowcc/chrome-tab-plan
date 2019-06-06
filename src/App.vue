<template>
  <div id="app">
    <div id="nav">
      <Menu
        router
        mode="horizontal"
        :default-active="$route.path"
        text-color="#fff"
        class="nav-menu"
      >
        <div class="main-icon">
          <img :src="imgsrc">
        </div>
        <MenuItem index="/">Tabs</MenuItem>
        <MenuItem index="/Todo">Todo</MenuItem>
      </Menu>
      <div class="asy-action">
        <Button size="mini" type="text" @click="exportTab">export</Button>
        <Button size="mini" type="text" class="import-new">
          import
          <input
            id="file"
            class="import-old"
            @change="importFile"
            type="file"
            accept="application/json"
          >
        </Button>
        <Button size="mini" type="text" @click="syncUpload" :loading="uploading">upload</Button>
        <Button size="mini" type="text" @click="syncDownload" :loading="downloading">download</Button>
        <Button size="mini" type="text" @click="editToken">gist token</Button>
        <Input
          :style="{width:'200px',marginLeft:'10px'}"
          v-show="changeTokenV"
          ref="gitTokenRef"
          v-model="gitToken"
          focus
          size="mini"
          @blur="saveGitToken"
          @keyup.enter.native="saveGitToken"
        />
      </div>
    </div>
    <div class="main-container">
      <router-view/>
    </div>
  </div>
</template>
<script>
import { Button, Input, Message, Menu, MenuItem, MessageBox } from 'element-ui';
import browser from 'webextension-polyfill';
import imgsrc from 'public/img/icon32.png';

let description = 'tabs plan sync data';
const gistUrl = 'https://api.github.com/gists';

export default {
  name: 'home',
  data() {
    return {
      uploading: false,
      downloading: false,
      changeTokenV: false,
      gitToken: undefined,
      imgsrc,
    };
  },
  components: {
    Button,
    Menu,
    MenuItem,
    Input,
  },
  mounted() {
    browser.identity.getProfileUserInfo((info) => {
      description = `tabs plan sync data for ${info.email}`;
    });

    browser.storage.local.get('gitToken').then((d) => {
      this.gitToken = d.gitToken;
    });
  },
  methods: {
    editToken() {
      this.changeTokenV = true;
      this.$nextTick(() => {
        this.$refs.gitTokenRef.focus();
      });
    },
    getTabsObj() {
      return {
        tabstore: this.$store.state.tabstore,
        todoVal: this.$store.state.todoVal,
        todoTodayVal: this.$store.state.todoTodayVal,
      };
    },
    importTabsObj(obj) {
      browser.runtime.sendMessage({
        key: 'changeTabStore',
        payload: obj.tabstore,
      });
      browser.runtime.sendMessage({
        key: 'changeTodoVal',
        payload: obj.todoVal,
      });
      browser.runtime.sendMessage({
        key: 'changeTodoTodayVal',
        payload: obj.todoTodayVal,
      });
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
    async initSync() {
      if (!this.gitToken) {
        Message.error('Need to input a gist token first');
        this.downloading = false;
        this.uploading = false;
        return;
      }
      return this.axios({
        method: 'GET',
        url: gistUrl,
        headers: { Authorization: `Bearer ${this.gitToken}` },
      })
        .then((response) => {
          const syncdata = response.data.filter(item => item.description === description);
          if (syncdata.length) {
            return syncdata[0];
          }
          return this.axios({
            method: 'POST',
            url: gistUrl,
            headers: { Authorization: `Bearer ${this.gitToken}` },
            data: {
              description,
              public: false,
              files: {
                tabsplan: {
                  content: JSON.stringify(this.getTabsObj()),
                },
              },
            },
          }).then(() => {
            this.downloading = false;
            this.uploading = false;
          });
        })
        .catch(() => {
          Message.error('Invalid token');
          this.downloading = false;
          this.uploading = false;
      });
    },
    syncUpload() {
      MessageBox.confirm(
        'This will replace remote data with local, continue?',
        'Warn',
        {
          confirmButtonText: 'confirm',
          cancelButtonText: 'cancel',
          type: 'warning',
        },
      ).then(async () => {
        this.uploading = true;
        const syncdata = await this.initSync();
        if (syncdata.id) {
          this.axios({
            method: 'PATCH',
            url: `${gistUrl}/${syncdata.id}`,
            headers: { Authorization: `Bearer ${this.gitToken}` },
            data: {
              files: {
                tabsplan: {
                  content: JSON.stringify(this.getTabsObj()),
                },
              },
            },
          }).then(() => {
            this.uploading = false;
          });
        }
      });
    },
    syncDownload() {
      MessageBox.confirm(
        'This will replace local data with remote, continue?',
        'Warn',
        {
          confirmButtonText: 'confirm',
          cancelButtonText: 'cancel',
          type: 'warning',
        },
      ).then(async () => {
        this.downloading = true;
        const syncdata = await this.initSync();
        if (syncdata === 'OK') {
          return;
        }
        if (syncdata.id) {
          this.axios({
            method: 'GET',
            url: `${gistUrl}/${syncdata.id}`,
            headers: { Authorization: `Bearer ${this.gitToken}` },
          }).then((response) => {
            this.asyncing = false;
            this.importTabsObj(JSON.parse(response.data.files.tabsplan.content));
            this.downloading = false;
          });
        }
      });
    },
    saveGitToken() {
      this.changeTokenV = false;
      browser.runtime.sendMessage({
        key: 'saveToken',
        payload: this.gitToken,
      });
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
<style lang="scss">
body {
  margin: 0;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  font-size: 14px;
  padding-bottom: 0;
  background-color: #ddd;
}
#nav {
  position: relative;
}
</style>
<style lang="scss" scoped>
@import "~ui/element-variables";
.main-icon {
  float: left;
  padding: 0 60px;
  display: flex;
  align-items: center;
  height: 60px;
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
  cursor: pointer;
}
.nav-menu {
  background-color: darken($--color-primary, 40%);
  border-color: lighten($--color-primary, 30%) !important;
}
.asy-action {
  position: absolute;
  right: 20px;
  top: 0;
  line-height: 61px;
  button {
    min-width: 50px;
    line-height: 60px;
    padding: 0 8px;
    color: #fff;
  }
}
.main-container {
  min-height: calc(100vh - 100px);
  padding: 20px;
}
.el-menu--horizontal > .el-menu-item {
  &:hover {
    background-color: darken($--color-primary, 20%) !important;
  }
  &:focus {
    background-color: rgba(0, 0, 0, 0) !important;
  }
}
.el-menu--horizontal > .el-menu-item.is-active {
  color: $--color-primary !important;
  background-color: darken($--color-primary, 30%) !important;
}
</style>
