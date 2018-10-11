import Vue from 'vue';
import browser from 'webextension-polyfill';
import App from './App.vue';
import router from './router';
import store from 'background/background';
import './registerServiceWorker';

Vue.config.productionTip = false;
Vue.prototype.store = store;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
