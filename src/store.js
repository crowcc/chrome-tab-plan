import Vue from 'vue';
import Vuex from 'vuex';
import browser from 'webextension-polyfill';

Vue.use(Vuex);
let inited = false;
const syncLocalStorage = (storeMap) => {
  if (!inited) return;
  browser.storage.local.set(storeMap);
};

const debug = process.env.NODE_ENV !== 'production';

const state = {
  inited: false,
  token: '',
  tabstore: [{
    identity: 'temptabs',
    collapse: false,
    list: [],
  }],
  todoVal: '',
  todoTodayVal: '',
};

const mutations = {
  inited(state, payload) {
    state.inited = payload;
    inited = payload;
  },
  changeTodoTodayVal(state, payload) {
    state.todoTodayVal = payload;
    syncLocalStorage({ todoTodayVal: payload });
  },
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
    if (payload === 0) {
      state.tabstore[0].list = [];
      state.tabstore = [...state.tabstore];
    } else {
      state.tabstore.splice(payload, 1);
      state.tabstore = [...state.tabstore];
    }
    syncLocalStorage({ tabstore: state.tabstore });
  },
};

const store = new Vuex.Store({
  namespaced: true,
  state,
  mutations,
  strict: debug,
});
export default store;
