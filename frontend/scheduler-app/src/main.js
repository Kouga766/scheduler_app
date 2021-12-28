import Vue from 'vue';
import App from './App.vue'; // ルートコンポーネント
import vuetify from './plugins/vuetify';
import axios from 'axios';
import VueAxios from 'vue-axios';
import router from './router';

Vue.config.productionTip = false;

Vue.use(VueAxios, axios);

new Vue({
  el: '#app',

  router,

  vuetify,

  data:() =>({
  }),

  methods: {
  },
  
  render: h => h(App)

}).$mount('#app');
