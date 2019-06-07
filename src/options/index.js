 import Vue from 'vue';
 import App from './App.vue'

 window.vApp = new Vue({
     render: h => h(App),
 }).$mount('#appConfig');