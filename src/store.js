import Vue from 'vue';
import Vuex from 'vuex';
import browser from 'webextension-polyfill';
// import VuexWebExtensions from 'vuex-webextensions';

Vue.use(Vuex);

const syncLocalStorage = (storeMap) => {
  browser.storage.local.set(storeMap);
};

const debug = process.env.NODE_ENV !== 'production';

const state = {
  temptabs: {},
  tabstore: [],
  todoVal: '',
};

const mutations = {
  changeTodoVal(state, payload) {
    state.todoVal = payload;
    syncLocalStorage({ todoVal: payload });
  },
  changeTemp(state, payload) {
    const { key, val } = payload;
    if (key) {
      state.temptabs[key] = val;
    } else {
      state.temptabs = val;
    }
    state.temptabs = { ...state.temptabs };
    // console.log(state.temptabs)
    syncLocalStorage({ temptabs: state.temptabs });
  },
  changeTabStore(state, payload) {
    state.tabstore = payload;
    syncLocalStorage({ tabstore: payload });
  },
  changeTabEX(state, payload) {
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
export default new Vuex.Store({
  namespaced: true,
  state,
  mutations,
  strict: debug,
//   plugins: [VuexWebExtensions()],
});

