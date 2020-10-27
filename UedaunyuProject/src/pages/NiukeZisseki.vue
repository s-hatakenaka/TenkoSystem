<template>
    <div>
        <keyboard-events v-on:keydown="keyboardEvent"></keyboard-events>
        <el-card>
            <div slot='header'>
                <span>荷受実績表</span>
            </div>
            <div slot='default'>
                <el-form :model="data.model" :rules="data.validation" ref="form" label-width="120px">
                    <div class="row">
                        <div class='col-md-3'>
                            <label for='処理区分' class='col-form-label px-1' style='width:100%;'>処理区分</label>
                            <el-form-item label-width="0" prop="syoriKubun">
                                <el-select id="syoriKubun" v-model="data.model.syoriKubun">
                                    <el-option :value='1' :label="'回数'"></el-option>
                                    <el-option :value='2' :label="'前年同日比'"></el-option>
                                    <el-option :value='3' :label="'日計比較'"></el-option>
                                    <el-option :value='4' :label="'累計比較'"></el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                    </div>
                    <div class='row'>
                        <div class='col-md-8' v-if="data.model.syoriKubun == 2">
                            <label for='対象日付' class='col-form-label px-1' style='width:100%;'>対象日付</label>
                            <el-form-item label-width="0" prop="date">
                                <el-input type='date'
                                          min='1000-01-01'
                                          max='9999-12-31'
                                          v-model="data.model.date"></el-input>
                            </el-form-item>

                        </div>
                    </div>
                    <div class="row">
                        <div class='col-md-10' v-if="data.model.syoriKubun == 1 || data.model.syoriKubun == 3 ||data.model.syoriKubun == 4">
                            <label for='対象年度' class='col-form-label px-1' style="width:100%;">対象年度</label>
                            <el-form-item label-width="0" prop="year">
                                <el-input-number type='text'
                                                 style='width:80%;margin-right:2%;'
                                                 v-model="data.model.year"
                                                 controls-position="right"
                                                 readonly></el-input-number>
                                <span>年度</span>
                            </el-form-item>
                        </div>
                    </div>
                </el-form>
                <div class="row">
                    <div class="col-12">
                        <div style='text-align:right;width:100%;'>
                            <el-button style='margin-left:2%;' type='primary' v-on:click="print">印刷(F10)</el-button>
                            <el-button style='margin-left:2%;' type='success' v-on:click="preview">表示(F11)</el-button>
                            <el-button style='margin-left:2%;' type='warning' v-on:click="finish">終了(F12)</el-button>
                        </div>
                    </div>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script>
    // @ is an alias to /src
    import KeyboardEvents from '@/components/KeyboardEvents.vue'
    import config from '@/config.js'
    import time from '@/js/status/time.js'
    import url from '@/js/api_url.js'

    export default {
        name: 'niukeSyukei',
        components: {
            KeyboardEvents
        },
        data: function () {
            return {
                data: {
                    model: {
                        syoriKubun: 1,
                        year: "",
                        date: "",
                    },
                    validation: {
                        syoriKubun: [
                            { required: true, message: '処理区分が入力されていません', trigger: 'change' },
                        ],
                        year: [
                            { required: true, message: '年度が入力されていません', trigger: 'change' },
                        ],
                        date: [
                            { required: true, message: '日付が入力されていません', trigger: 'change' },
                        ],
                    }

                },
            }
        },
        methods: {
            keyboardEvent(e) {
                if (e.keyCode == config.KEY_CODES.F10) {
                    this.print()
                }
                if (e.keyCode == config.KEY_CODES.F11) {
                    this.confirm()
                }
                if (e.keyCode == config.KEY_CODES.F12) {
                    this.finish()
                }
            },
            createPostData: function (printFlag) {

                var postArray;

                var postUrl;

                if (this.data.model.syoriKubun == 1) {
                    postArray = {
                        //"PrintFlg": printFlag,
                        "nendo": this.data.model.year,
                    }
                    postUrl = url.niukeZissekiHyou.kaisu

                } else if (this.data.model.syoriKubun == 2) {

                    var date = this.data.model.date.split("-");

                    postArray = {
                        //"PrintFlg": printFlag,
                        "year": date[0],
                        "month": date[1],
                        "day": date[2],
                    }

                    postUrl = url.niukeZissekiHyou.dozitsuZennenhi
                } else if (this.data.model.syoriKubun == 3) {

                    postArray = {
                        //"PrintFlg": printFlag,
                        "nendo": this.data.model.year,
                    }
                    postUrl = url.niukeZissekiHyou.nikkeiHikaku

                } else if (this.data.model.syoriKubun == 4) {

                    postArray = {
                        //"PrintFlg": printFlag,
                        "nendo": this.data.model.year,
                    }

                    postUrl = url.niukeZissekiHyou.ruikeiHikaku

                }

                return { postArray: postArray, url: postUrl };

            },
            print: function () {

                this.$refs['form'].validate((valid) => {

                    if (!valid) {

                        return false;

                    }
                    if (!window.confirm("印刷しますか？")) {
                        return false
                    }

                    var postData = this.createPostData(true);
                    console.log(postData);


                    axios.post(postData.url, postData.postArray)
                        .then(response => {
                            console.log(response.data);
                            window.open(response.data.url);
                        })
                        .catch(response => console.log(response));



                });


            },
            preview: function () {

                this.$refs['form'].validate((valid) => {

                    if (!valid) {

                        return false;

                    }

                    var postData = this.createPostData(false);

                    console.log(postData)
                    axios.post(postData.url, postData.postArray)
                        .then(response => {
                            console.log(response.data);
                            window.open(response.data.url);
                        })
                        .catch(response => console.log(response));



                });

            },
            finish: function () {
                this.$router.push('/hoshigaki/');
            },
        },
        mounted: function () {
        },
        created: function () {

            this.data.model.year = time.nowJapanYear();
            this.data.model.date = time.nowJapanDateInput();
        },
        watch: {

        }

    }
</script>
