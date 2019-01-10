import Vue from 'vue';
import axios from 'axios';
import App from './App.vue';
import router from './router';
import store from './store';

import './element-variables.scss';


Vue.config.productionTip = false;

if (!window.init) {
  window.init = true;
  Vue.prototype.store = store;
  Vue.prototype.axios = axios;
  store.commit('init');
  new Vue({
    router,
    store,
    render: h => h(App),
  }).$mount('#app');
}
