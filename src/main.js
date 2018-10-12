import Vue from 'vue';
import browser from 'webextension-polyfill';
import App from './App.vue';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

if (!window.$Vue) {
  Vue.prototype.store = store;
  window.$Vue = new Vue({
    router,
    store,
    render: h => h(App),
  }).$mount('#app');
  browser.runtime.getBackgroundPage().then((win) => {
    win.vuestore = store;
    // tab
    browser.storage.local.get('tabstore').then((items) => {
      if (items.tabstore) {
        win.vuestore.commit('changeTabStore', items.tabstore);
      }
    });
    // todo
    browser.storage.local.get('todoVal').then((items) => {
      win.vuestore.commit('changeTodoVal', items.todoVal);
    });
  });
}

