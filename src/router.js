import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home'
import Journals from './views/Journals'
import Articles from './views/Articles'
import Meta from 'vue-meta'


Vue.use(Router)
Vue.use(Meta)


export default new Router({
    mode: "history",
    routes: [
        {
            path: '/articles',
            component: Articles
        },
        {
            path: '/journals',
            component: Journals
        },
        {
            path: '/',
            component: Home
        }
    ]
})
