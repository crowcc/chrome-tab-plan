import Vue from 'vue';
import browser from 'webextension-polyfill';
import axios from 'axios';
import App from './App.vue';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

if (!window.init) {
  window.init = true;
  Vue.prototype.store = store;
  Vue.prototype.axios = axios;
  browser.runtime.getBackgroundPage().then((win) => {
    win.vuestore = store;
    // tab
    const t = browser.storage.local.get('tabstore').then((items) => {
      if (items.tabstore) {
        win.vuestore.commit('changeTabStore', items.tabstore);
      } else {
        win.vuestore.commit('changeTabStore', [{
          identity: 'temptabs',
          collapse: false,
          list: [],
        }]);
      }
    });
    // todo
    const a = browser.storage.local.get('todoVal').then((items) => {
      win.vuestore.commit('changeTodoVal', items.todoVal);
    });
    const b = browser.storage.local.get('todoTodayVal').then((items) => {
      win.vuestore.commit('changeTodoTodayVal', items.todoTodayVal);
    });
    Promise.all([t, a, b]).then(() => {
      win.vuestore.commit('inited', true);
      new Vue({
        router,
        store,
        render: h => h(App),
      }).$mount('#app');
    }).catch((error) => {
      console.log(error);
    });
  });
}
