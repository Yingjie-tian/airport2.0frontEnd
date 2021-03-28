import Vue from 'vue';
import App from './App.vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题

import router from './router';
import './assets/css/icon.css';
import './components/common/directives';
import 'babel-polyfill';
// 导入vuex
import store from './store'
// 导入resource
import VueResource from 'vue-resource'
// 安装vue-resource
Vue.use(VueResource)

// 导入格式化时间的插件
import moment from 'moment'
// 定义全局时间过滤器
Vue.filter('dateFormat', function (dataStr, pattern = "YYYY-MM-DD HH:mm:ss") {
  return moment(dataStr).format(pattern)
})
Vue.filter('atimeFormat', function (dataStr, pattern = "HHmm(DD)") {
  return moment(dataStr).format(pattern)
})
Vue.filter('data_DateFormat', function (dataStr, pattern = "YYYY/MM/DD") {
  return moment(dataStr).format(pattern)
})
Vue.filter('OnlyDateFormat', function (dataStr, pattern = "YYYY-MM-DD") {
  return moment(dataStr).format(pattern)
})

//导入发送请求axios
import axios from 'axios'
Vue.prototype.$axios = axios

// 导入画图的插件
import echarts from 'echarts'
Vue.prototype.$echarts = echarts

import 'default-passive-events'

Vue.config.productionTip = false;
Vue.use(ElementUI, {
    size: 'small'
});

// //使用钩子函数对路由进行权限跳转
// router.beforeEach((to, from, next) => {
//     document.title = `${to.meta.title} | vue-manage-system`;
//     const role = localStorage.getItem('ms_username');
//     if (!role && to.path !== '/login') {
//         next('/login');
//     } else if (to.meta.permission) {
//         // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
//         role === 'admin' ? next() : next('/403');
//     } else {
//         // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
//         if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
//             Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
//                 confirmButtonText: '确定'
//             });
//         } else {
//             next();
//         }
//     }
// });

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
