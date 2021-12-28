import Vue from 'vue';
import Router from 'vue-router';
import TopPage from './components/TopPage.vue';
import TaskPage from './components/TaskPage.vue';
import NotePage from './components/NotePage.vue';
import Settings from './components/Settings.vue';

Vue.use(Router);

export default new Router({
    mode: 'history',

    routes: [
        {
            path: '/',
            name: 'topPage',
            component: TopPage,
        },
        {
            path: '/tasks',
            name: 'taskPage',
            component: TaskPage,
        },
        {
            path: '/notes',
            name: 'notePage',
            component: NotePage,
        },
        {
            path: '/settings',
            name: 'settings',
            component: Settings,
        },
    ]
})