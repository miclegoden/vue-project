import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Staked from '../views/Staked'
import ApiService from '../services'
import mainView from '../components/Main'
const routes = [{
        path: '/',
        redirect: '/dashboard',
        component: mainView,
        // dashboard auth guard
        beforeEnter(to, from, next) {
            if (!isLogin()) {
                next('/login')
            } else {
                next()
            }
        },
        children: [{
            path: '/dashboard',
            name: 'dashboard',
            props: true,
            component: Home,
            meta: { sideBarKey: 'Dashboard' }
        }]
    },
    {
        path: '/staked',
        component: mainView,
        // dashboard auth guard
        beforeEnter(to, from, next) {
            if (!isLogin()) {
                next('/login')
            } else {
                next()
            }
        },
        children: [{
            path: '/staked',
            name: 'staked',
            component: Staked,
            meta: { sideBarKey: 'staked' }
        }]
    },
    {
        path: '/login',
        name: 'Login',
        // props: false,
        component: Login
    }
]
const isLogin = function() {
    return ApiService.isLogin()
}
const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router