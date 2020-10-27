<template>
    <div>
        <keyboard-events v-on:keydown="keyboardEvent"></keyboard-events>
        <el-card>
            <div slot='header'>
                <span>等級外データ一括変更</span>
            </div>
            <div slot='default'>
                <el-form :model="data.model" :rules="data.validation" ref="Form" label-width="120px">
                    <div class='row'>
                        <div class='col-md-6'>
                            <label for='年度' class='col-form-label px-1' style="width:100%;">年度</label>
                            <el-form-item label-width="0" prop="year">
                                <el-input-number type='text'
                                                 controls-position="right"
                                                 style='width:80%;margin-right:2%;'
                                                 v-model="data.model.year"></el-input-number>
                            </el-form-item>
                        </div>
                        <div class="col-4">
                            <h2 style="background-color:red;font-weight:bold;">
                               実行前にデータを保存してください 
                            </h2>
                        </div>

                    </div>
                    <div class='row'>
                        <div class='col-md-6'>
                            <label for='変更前回数' class='col-form-label px-1' style="width:100%;">変更前回数</label>
                            <el-form-item label-width="0" prop="kaisu">
                                <el-input-number type='text'
                                                 controls-position="right"
                                                 style='width:80%;margin-right:2%;'
                                                 v-model="data.model.kaisu"></el-input-number>
                            </el-form-item>
                        </div>
                    </div>
                </el-form>
                <div class="row">
                    <div class="col-8">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>等級</th>
                                    <th>等級名</th>
                                    <th></th>
                                    <th>変更後の回数</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="tokyu in data.tokyu">
                                    <!--※ここは生データを取ってきたら変える-->
                                    <td>
                                        {{tokyu.tokyuCD}}
                                    </td>
                                    <td>
                                        {{tokyu.tokyumei}}
                                    </td>
                                    <td>
                                        ⇒
                                    </td>
                                    <td>
                                        {{tokyu.kaisu}}
                                    </td>
                                </tr>
                            </tbody>

                        </table>
                    </div>
                    <div class="col-4">
                        <p style="color:blue;font-weight:bold;">
                            等級外の荷受データ、在庫データの回数を<br/>「変更後の回数」に変更します
                        </p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12">
                        <div style='text-align:right;width:100%;'>
                            <el-button style='margin-left:2%;' type='primary' v-on:click="submit">実行(F9)</el-button>
                            <el-button type='success' v-on:click="finish">終了(F12)</el-button>
                        </div>
                    </div>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script>
    // @ is an alias to /src
    import Card from '@/components/Card/Card.vue'
    import KeyboardEvents from '@/components/KeyboardEvents.vue'
    import config from '@/config.js'
    import time from '@/js/status/time.js'


    export default {
        name: 'niukeSyukei',
        components: {
            Card, KeyboardEvents
        },
        data: function () {
            return {
                //端末番号持ってくる
                //methodsで使う際のnodeをmountedで登録し、取得する手間を省く
                element: {
                    syoriKubun: null,
                    niukeNyuryokuForm: null,
                },
                data: {
                    model: {
                        year: null,
                        kaisu: null,
                    },
                    transactions: "",
                    validation: {
                        year: [
                            { required: true, message: '年度が入力されていません', trigger: 'blur' },
                        ],
                        kaisu: [
                            { required: true, message: '変更前回数が入力されていません', trigger: 'blur' },
                        ]
                    },
                    tokyu: [
                    ],

                },
            }
        },
        methods: {
            keyboardEvent(e) {
                if (e.keyCode == config.KEY_CODES.F9) {
                    this.submit()
                }
                if (e.keyCode == config.KEY_CODES.F12) {
                    this.finish()
                }
            },
            finish: function () {
                alert("終了");
            },
            submit: function () {


                this.$refs['Form'].validate((valid) => {

                    if (valid) {

                        if (!window.confirm("回数変更を行います。よろしいですか？")) {

                            return false;
                        }

                        //※ここでaxiosでpostする
                        alert("実行")
                      
                    }
                });



            },
        },
        created: function () {

            //※データを取ってくる
            this.data.model.year = 2022;
            this.data.tokyu = [
                { tokyuCD: "11", tokyumei: "特上", kaisu: 2 },
                { tokyuCD: "12", tokyumei: "上", kaisu: 3 },
                { tokyuCD: "13", tokyumei: "普通", kaisu: 4 },
                { tokyuCD: "14", tokyumei: "下", kaisu: 5 },
                { tokyuCD: "15", tokyumei: "特下", kaisu: 6 },
            ]
        },
        mounted: function () {

        },

    }
</script>
