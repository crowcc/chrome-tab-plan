<template>
  <div class="home">
    <Button @click="savetabs" size="mini" round>save all in this window</Button>
    <Button @click="newlist" size="mini" round>new list</Button>
    <Input class="filter-input" placeholder="搜索" v-model="filterVal"/>
    <div class="main-container">
      <div class="tabs-nav">
        <Tablist
          :filterVal="filterVal"
          :blockItem="tabstore[0]"
          :changelist="(key,val)=>changeTabBlock(key,val,0)"
          :deleteTabList="()=>deleteTabList(0)"
          showTitleOnly
        ></Tablist>
        <Draggable
          v-model="tabstore"
          :options="{group:'tabstore'}"
          class="tabs-nav-drag"
        >
          <template v-for="(value, index) in tabstore">
            <Tablist
              v-if="index!==0"
              :filterVal="filterVal"
              :key="index"
              :blockIndex="index"
              :blockItem="value"
              :changelist="(key,val)=>changeTabBlock(key,val,index)"
              :deleteTabList="()=>deleteTabList(index)"
              showTitleOnly
            ></Tablist>
          </template>
        </Draggable>
      </div>
      <div class="tabs-list">
        <Tablist
          class="tab-card"
          :filterVal="filterVal"
          :blockItem="tabstore[0]"
          :changelist="(key,val)=>changeTabBlock(key,val,0)"
          :deleteTabList="()=>deleteTabList(0)"
          isStatic
        ></Tablist>
        <Draggable v-model="tabstore" :options="{group:'tabstore'}">
          <template v-for="(value, index) in tabstore">
            <Tablist
              v-if="index!==0"
              class="tab-group tab-card"
              :filterVal="filterVal"
              :key="index"
              :blockIndex="index"
              :blockItem="value"
              :changelist="(key,val)=>changeTabBlock(key,val,index)"
              :deleteTabList="()=>deleteTabList(index)"
            ></Tablist>
          </template>
        </Draggable>
      </div>
    </div>
  </div>
</template>

<script>
import Draggable from 'vuedraggable';
import { saveAllCurrentWIndowTabs } from 'background/utils';
import { Button, Input } from 'element-ui';
import Tablist from './tablist';

export default {
  name: 'home',
  data() {
    return {
      filterVal: '',
      uploading: false,
      downloading: false,
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
  methods: {
    savetabs() {
      saveAllCurrentWIndowTabs();
    },
    newlist() {
      this.$store.commit('newTablist');
    },
    changeTabBlock(key, val, index) {
      //   console.log(key, val, index);
      this.$store.commit('changeTabBlock', {
        key,
        val,
        index,
      });
    },
    deleteTabList(index) {
      this.$store.commit('deleteTabList', index);
    },
    // async debugStorage() {
    //   console.log(this.$store.state);
    //   browser.storage.local.clear();
    //   const localData = await browser.storage.local.get();
    //   console.log(localData);
    // },
  },
};
</script>
<style lang="scss" scoped>
.main-container {
  display: flex;
}
.tabs-list {
  flex: auto;
  overflow: hidden;
  margin-left: 170px;
}
.tabs-nav {
  position: fixed;
  top:195px;
  width: 150px;
  font-size: 12px;
  border-top: 1px solid #ebeef5;
  border-bottom: 1px solid #ebeef5;
  height: calc(100vh - 220px);
  overflow: auto;
}
.tab-nav-item {
  border: 1px solid #ebeef5;
  padding: 15px 10px;
}
.tab-card {
  margin: 20px 0;
}
.filter-input {
  margin-top: 20px;
}
</style>

