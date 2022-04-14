import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import * as qiniu from 'qiniu-js'

Vue.config.productionTip = false

new Vue({
  vuetify,
  qiniu,
  render: h => h(App)
}).$mount('#app')
