import Vue from 'vue';
import Router from 'vue-router';
import Home from './components/Home.vue';
import NiukeNyuryoku from './pages/NiukeNyuryoku.vue'
import NiukeSyukei from './pages/NiukeSyukei.vue'
import NiukeMonitorList from './pages/NiukeMonitorList.vue'
import NiukeZisseki from './pages/NiukeZisseki.vue'
import UriageSyukeihyou from './pages/UriageSyukeihyou.vue'
import SizebetsuShijoHanbaihyou from './pages/SizebetsuShijoHanbaihyou.vue'
import ShijobetsuHanbaiSyukeihyou from './pages/ShijobetsuHanbaiSyukeihyou.vue'
import SeisanMeisaiDataExcelSytsuryoku from './pages/SeisanMeisaiDataExcelSytsuryoku.vue'
import TokyugaiDataIkkatsuHenkou from './pages/TokyugaiDataIkkatsuHenkou.vue'
import TokyubetsuNiukeIchiran from './pages/TokyubetsuNiukeIchiran.vue'
import TankaSyusei from './pages/TankaSyusei.vue'
import ShiharaiMeisaisyo from './pages/ShiharaiMeisaisyo.vue'
import HurikaeMeisaisyo from './pages/HurikaeMeisaisyo.vue'
import SeisanGyoumu from './pages/SeisanGyoumu.vue'
import TokyubetsuZaikoIchiran from './pages/TokyubetsuZaikoIchiran.vue'
import ChikuSeisansyaBetsuSeisanhyou from './pages/ChikuSeisansyaBetsuSeisanhyou.vue'
import HanbaiSyukei from './pages/HanbaiSyukei.vue'
import SyukkaKakutei from './pages/SyukkaKakutei.vue'
import SyukkaNyuryoku from './pages/SyukkaNyuryoku.vue'
import SyukkaYoteiNyuryoku from './pages/SyukkaYoteiNyuryoku.vue'
import MasterSeisansya from './pages/MasterSeisansya.vue'
import MasterShijo from './pages/MasterShijo.vue'
import MasterSyouhin from './pages/MasterSyouhin.vue'
import MasterHousou from './pages/MasterHousou.vue'
import MasterUnchin from './pages/MasterUnchin.vue'
import MasterShisyo from './pages/MasterShisyo.vue'
import MasterMeisyo from './pages/MasterMeisyo.vue'
import MasterShizai from './pages/MasterShizai.vue'
//import MasterShizaiKanri from './pages/MasterShizaiKanri.vue'
import ZaikoKoushin from './pages/ZaikoKoushin.vue'
import ZitsutanaNyuryoku from './pages/ZitsutanaNyuryoku.vue'
import HaraidashiTyouseiNyuryoku from './pages/HaraidashiTyouseiNyuryoku.vue'
import NyukinNyuryoku from './pages/NyukinNyuryoku.vue'


import MasterMember from './pages/MasterMember.vue'

import RollCallStatus from './pages/RollCallStatus.vue'
import RollCallLogInput from './pages/RollCallLogInput.vue'
import RollCallLogFormOutput from './pages/RollCallLogFormOutput.vue'
import Login from './pages/Login.vue'
import DashboardLayout from './layout/DashboardLayout.vue';




import Sample from './pages/Sample.vue'






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