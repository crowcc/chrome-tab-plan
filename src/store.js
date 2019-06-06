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
  timestamp: 0,
};
const actions = {
  init({ commit }) {
    browser.storage.local.get('tabstore').then((items) => {
      if (items.tabstore) {
        commit('saveState', { key: 'tabstore', val: items.tabstore });
      }
    });
    // todo
    browser.storage.local.get('todoVal').then((items) => {
      commit('saveState', { key: 'todoVal', val: items.todoVal });
    });
    browser.storage.local.get('todoTodayVal').then((items) => {
      commit('saveState', { key: 'todoTodayVal', val: items.todoTodayVal });
    });
    browser.storage.local.get('timestamp').then((items) => {
      commit('saveState', { key: 'timestamp', val: items.timestamp });
    });
    browser.storage.onChanged.addListener((field) => {
      Object.keys(field).forEach((key) => {
        commit('saveState', { key, val: field[key].newValue });
      });
    });
  },
};
const mutations = {
  saveState(state, payload) {
    state[payload.key] = payload.val;
  },
};


export default new Vuex.Store({
  namespaced: true,
  state,
  mutations,
  actions,
  strict: debug,
});
