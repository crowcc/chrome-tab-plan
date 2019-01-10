import Vue from 'vue';
import Vuex from 'vuex';
import browser from 'webextension-polyfill';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

const state = {
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
  init(state) {
    browser.storage.local.get('tabstore').then((items) => {
      if (items.tabstore) {
        state.tabstore = items.tabstore;
      }
    });
    // todo
    browser.storage.local.get('todoVal').then((items) => {
      state.todoVal = items.todoVal;
    });
    browser.storage.local.get('todoTodayVal').then((items) => {
      state.todoTodayVal = items.todoTodayVal;
    });
    browser.storage.onChanged.addListener((field) => {
      Object.keys(field).forEach((key) => {
        state[key] = field[key].newValue;
      });
    });
  },
};


export default new Vuex.Store({
  namespaced: true,
  state,
  mutations,
  strict: debug,
});
