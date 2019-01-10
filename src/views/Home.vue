<template>
  <div class="home">
    <Button @click="savetabs" size="mini" type="primary">save all in this window</Button>
    <Button @click="newlist" size="mini" type="primary">new list</Button>

    <div class="home-container">
      <div class="tabs-nav">
        <Tablist
          :filterVal="filterVal"
          :blockItem="tabstore[0]"
          :changelist="(key,val)=>changeTabBlock(key,val,0)"
          :deleteTabList="()=>deleteTabList(0)"
          showTitleOnly
        ></Tablist>
        <Draggable v-model="tabstore" :options="{group:'tabstore'}" class="tabs-nav-drag">
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
        <Input class="filter-input" placeholder="搜索" v-model="filterVal"/>
        <div class="tab-list-scroll">
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
  </div>
</template>

<script>
import Draggable from 'vuedraggable';
import { saveAllCurrentWIndowTabs } from 'background/utils';
import { Button, Input } from 'element-ui';
import browser from 'webextension-polyfill';
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
        browser.runtime.sendMessage({
          key: 'changeTabStore',
          payload: value,
        });
      },
    },
  },
  methods: {
    savetabs() {
      saveAllCurrentWIndowTabs();
    },
    newlist() {
      browser.runtime.sendMessage({
        key: 'newTablist',
      });
    },
    changeTabBlock(key, val, index) {
      browser.runtime.sendMessage({
        key: 'changeTabBlock',
        payload: {
          key,
          val,
          index,
        },
      });
    },
    deleteTabList(index) {
      browser.runtime.sendMessage({
        key: 'deleteTabList',
        payload: index,
      });
    },
  },
};
</script>
<style lang="scss" scoped>
@import "~ui/element-variables";

.home-container {
  display: flex;
  align-items: flex-start;
}
.tabs-list {
  position: relative;
  flex: auto;
  overflow: auto;
  margin-top: 20px;
  margin-left: 20px;
  max-height: calc(100vh - 150px);
  overflow: hidden;
}
.tab-list-scroll {
  margin-top: 60px;
  max-height: calc(100vh - 210px);
  overflow: auto;
}
.tabs-nav {
  flex: none;
  margin-top: 20px;
  width: 150px;
  font-size: 12px;
  border-top: 1px solid #333;
  max-height: calc(100vh - 150px);
  border-radius: 3px;
  overflow: auto;
  background-color: darken($--color-primary, 40%);
  color: #ebebeb;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.tab-card {
  margin-bottom: 20px;
}
.filter-input {
  position: fixed;
  width:calc(100% - 210px);
}
</style>

