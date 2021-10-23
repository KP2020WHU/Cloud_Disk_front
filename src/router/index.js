import Vue from 'vue';
import VueRouter from 'vue-router';
import LoginPage from '@/pages/login'
import RegisterPage from '@/pages/register'
import HomePage from '@/pages/home'
import DiskComponent from '@/pages/disk'
import NotFound from '@/pages/not-found'

import DiskInfoComponent from '@/pages/disk-info'
import UserComponent from '@/pages/settings'


Vue.use(VueRouter)

export default new VueRouter({
    mode: "history",
    routes: [{
        path: '/login',
        name: 'login',
        component: LoginPage,
    }, {
        path: '/register',
        name: 'register',
        component: RegisterPage,
    }, {
        path: '/home',
        name: 'home',
        component: HomePage,
        props: true,
        children: [{
            path: '/disk',
            name: 'disk',
            component: DiskComponent
        }, {
            path: '/info',
            component: DiskInfoComponent,
        }, {
            path: '/user',
            component: UserComponent,
        }]
    }, {
        path: '*',
        component: NotFound,
    }]
});