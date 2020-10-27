<template>
    <div class="wrapper">
        <el-container>
            <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
                <el-menu>
                    <el-menu-item>
                        <router-link to="/uedaunyu/" style="color:black;">HOME</router-link>
                    </el-menu-item>
                    <el-menu-item>
                        <router-link to="/uedaunyu/rollCallStatus" style="color:black;">点呼状況</router-link>
                    </el-menu-item>
                    <el-menu-item>
                        <router-link to="/uedaunyu/rollCallLogInput" style="color:black;">点呼記録入力</router-link>
                    </el-menu-item>
                    <el-menu-item>
                        <router-link to="/uedaunyu/rollCallLogFormOutput" style="color:black;">点呼記録簿出力</router-link>
                    </el-menu-item>
                    <el-submenu>
                        <template slot="title">
                            マスタ
                        </template>
                        <el-menu-item v-for="sidebar in sidebarmenu" v-bind:key="sidebar.number" v-if="displayFlag(sidebar)">
                            <router-link :to="sidebar.link" style="color:black;">{{sidebar.name}}</router-link>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <el-container>
                <el-header style="background-color:#93C5F9;color:white;">Header<span style="display:block;float:right;"><el-button type="info" @click="logout">ログアウト</el-button></span></el-header>
                <el-main>
                    <router-view></router-view>
                </el-main>
                <el-footer style="background-color:#C0C4CC;color:white;"></el-footer>
            </el-container>
        </el-container>
    </div>

</template>
<style>
    .el-aside {
        color: #333;
    }
</style>
<script>
    import login from '@/js/status/login.js'

    export default {

        data: function () {
            return {
                sidebarmenu: [
                ],
            };
        },
        methods: {

            logout: function () {

                //※とりあえずログイン画面に戻す

                //login.logout(this)

                this.$router.push('/');  
            },
            displayFlag: function (sidebar) {

                return true;
            }
        },
        created: function () {

            //Ｍメニュー/メニューコード = Ｍ担当/権限よりＭメニューのメニュー名称とメニューパスを取ってくる
            this.sidebarmenu = [
                        { name: "社員マスタ", link: "/uedaunyu/masterMember" },  
            ];

        }

    }
</script>