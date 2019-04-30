import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home'
import Journals from './views/Journals'
import Articles from './views/Articles'
import Faq from './views/Faq'
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
            path: '/subscriptions',
            component: Journals
        },
        {
            path: '/faq',
            component: Faq
        },
        {
            path: '/',
            component: Home
        }
    ]
})
