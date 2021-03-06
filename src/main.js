import Vue from 'vue'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueLazyLoad from 'vue-lazyload' //懒加载
import VueCookies from 'vue-cookies'
import store from './store'
import { Message } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'

//mock开关
const mock = false;
if(mock) {
  require('./mock/api');
}

//设置默认请求地址
axios.defaults.baseURL = '/api';
//请求最长时间
axios.defaults.timeout = 8000;

//所有接口的错误拦截
axios.interceptors.response.use(function(response) {
  let res = response.data;
  // let path = location.hash;//获取当前路由的hash值
  if(res.status == 0) {//拦截业务接口错误异常
    return res.data;
  }else if(res.status == 10) {//status:10,表示未登录状态
    Message.warning(res.msg);
    window.location.href = '/#/login';
    return Promise.reject(res);
  }else {
    Message.warning(res.msg);
    return Promise.reject(res);
  }
},(error) => {//拦截服务器错误 状态码500(服务器异常)
  let res = error.response;
  Message.error(res.data.message);
  return Promise.reject(error)
})


Vue.use(VueAxios,axios)
Vue.use(VueCookies)
//图片懒加载
Vue.use(VueLazyLoad, {
  loading:'/imgs/loading-svg/loading-bars.svg'
})

Vue.prototype.$message = Message; //激活插件

Vue.config.productionTip = false

new Vue({
  store,
  router,
  render: h => h(App),//渲染函数相当于
  // render:function(createElement) {
  //   return createElement(App) //<App/>
  // }
  //代替了
  // components: {
  //   App
  // },
  // template:'<App/>',
}).$mount('#app')

