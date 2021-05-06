import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
//引入需要使用的组件并且在下方使用
import router from './router'
import axios from 'axios'
import moment from 'moment'
import local from './lib/until'

//获取登录名

Vue.use(local)
Vue.prototype.$axios = axios;
moment.locale('zh-cn'); //设置语言 或 moment.lang('zh-cn'); 
Vue.prototype.$moment = moment;//赋值使用
Vue.use(ElementUI)





new Vue({
  router,
  el: '#app',
  render: h => h(App)
})