import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

// 导入router
import router from './router'
// 引入树形下拉框
import wl from "wl-vue-select";
import "wl-vue-select/lib/wl-vue-select.css";

// 引入文件管理器
import WlExplorer from "wl-explorer";
import "wl-explorer/lib/wl-explorer.css"
Vue.use(WlExplorer);
Vue.use(router);
Vue.use(wl);
Vue.use(ElementUI);


Vue.config.productionTip = false
new Vue({
    el: "#app",
    router,
    render: h => h(App),
})