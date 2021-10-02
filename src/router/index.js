import Vue from 'vue';
import VueRouter from 'vue-router';
import LoginComponent from '@/pages/login'
import RegisterComponent from '@/pages/register'
import HomeComponent from '@/pages/home'
import DiskComponent from '@/pages/disk'


Vue.use(VueRouter)

export default new VueRouter({
    routes: [{
        path: '/login',
        component: LoginComponent,
    }, {
        path: '/register',
        component: RegisterComponent,
    }, {
        path: '/home',
        component: HomeComponent,
    }, {
        path: '/disk',
        component: DiskComponent,
    }]
});