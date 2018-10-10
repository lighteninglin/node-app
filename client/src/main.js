import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/css/reset.css'
import ElementUI from 'element-ui'
import Moment from 'moment'
import 'element-ui/lib/theme-chalk/index.css'
import 'font-awesome/css/font-awesome.css'
import Axios from 'axios'
import HeadNav from './components/Common/HeadNav'
import LeftMenu from './components/Common/LeftMenu'
import Dialog from './components/Common/Dialog'

// 请求拦截
Axios.interceptors.request.use(function (config) {
  ElementUI.Loading.service({ fullscreen: true, text: "正在加载中..." });

  if (localStorage.eleToken) {
    config.headers.Authorization = localStorage.eleToken;
  }

  return config;
})

// 响应拦截
Axios.interceptors.response.use(function (response) {
  // response.config类似上面config
  ElementUI.Loading.service({ fullscreen: true }).close();
  return response;
}, function (err) {
  ElementUI.Loading.service({ fullscreen: true }).close();
  ElementUI.Message.error(err.response.data);

  const { status } = err.response;

  if (status == 401) {
    ElementUI.Message.error('token失效，请重新登录！');
    localStorage.removeItem("eleToken");
  }

  router.push({ name: 'login' });

  return Promise.reject(err);
})

Moment.locale('zh-cn')

Vue.filter('convertTime', function (data, formatStr) {
  return Moment(data).format(formatStr);
})
Vue.filter('relativeTime', function (previousTime) {
  return Moment(previousTime).fromNow();
})
Vue.filter('convertStr', function(str, count) {
  return str.substring(0, count) + '...';
})

Vue.use(ElementUI)

Vue.component(HeadNav.name, HeadNav)
Vue.component(LeftMenu.name, LeftMenu)
Vue.component(Dialog.name, Dialog)

Vue.prototype.$axios = Axios

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
