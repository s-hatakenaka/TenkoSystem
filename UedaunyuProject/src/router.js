import Vue from 'vue';
import Router from 'vue-router';
import Home from './components/Home.vue';
import MasterMember from './pages/MasterMember.vue'
import RollCallStatus from './pages/RollCallStatus.vue'
import RollCallLogInput from './pages/RollCallLogInput.vue'
import RollCallLogFormOutput from './pages/RollCallLogFormOutput.vue'
import Login from './pages/Login.vue'
import DashboardLayout from './layout/DashboardLayout.vue';




Vue.use(Router);

export default new Router({
    routes: [
        { path: '/', component: Login },
        {
            path: '/uedaunyu', component: DashboardLayout,
            children: [
                { path: '/', component: Home },
                { path: 'masterMember', component: MasterMember },
                { path: 'rollCallStatus', component: RollCallStatus },
                { path: 'rollCallLogInput', component: RollCallLogInput },
                { path: 'rollCallLogFormOutput', component: RollCallLogFormOutput },
    
            ]
        }


    ]
});