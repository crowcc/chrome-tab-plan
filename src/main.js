import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
// import './registerServiceWorker';

Vue.config.productionTip = false;
Vue.prototype.store = store;

if (!window.$vue) {
  window.$vue = new Vue({
    router,
    store,
    render: h => h(App),
  }).$mount('#app');
}

