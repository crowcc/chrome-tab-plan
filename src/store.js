import Vue from 'vue';
import Vuex from 'vuex';
import browser from 'webextension-polyfill';

Vue.use(Vuex);

const syncLocalStorage = (storeMap) => {
  browser.storage.local.set(storeMap);
};

const debug = process.env.NODE_ENV !== 'production';

const state = {
  tabstore: [{
    identity: 'temptabs',
    collapse: false,
    list: [],
  }],
  todoVal: '',
};

const mutations = {
  changeTodoVal(state, payload) {
    state.todoVal = payload;
    syncLocalStorage({ todoVal: payload });
  },
  changeTabStore(state, payload) {
    state.tabstore = payload;
    syncLocalStorage({ tabstore: payload });
  },
  changeTabBlock(state, payload) {
    const { key, val, index } = payload;
    state.tabstore[index][key] = val;
    state.tabstore = [...state.tabstore];
    syncLocalStorage({ tabstore: state.tabstore });
  },
  newTablist(state) {
    state.tabstore.push({ title: 'new list', list: [] });
    syncLocalStorage({ tabstore: state.tabstore });
  },
  deleteTabList(state, payload) {
    state.tabstore.splice(payload, 1);
    state.tabstore = [...state.tabstore];
    syncLocalStorage({ tabstore: state.tabstore });
  },
  // clearData(state) {
  //   state = { ...state };
  // },
};

const store = new Vuex.Store({
  namespaced: true,
  state,
  mutations,
  strict: debug,
});
if (!window.vuexStore) {
  window.vuexStore = store;
}
export default window.vuexStore;
