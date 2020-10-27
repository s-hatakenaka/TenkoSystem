<template>
    <div>
        <keyboard-events v-on:keydown="keyboardEvent"></keyboard-events>
        <el-card>
            <div slot='header'>
                <span>出荷確定処理</span>
            </div>
            <div slot='default'>
                <el-form :model="data.model" :rules="data.validation" ref="form" label-width="120px">
                    <div class='row'>
                        <div class='col-md-3'>
                            <label for='出荷日付' class='col-form-label px-1' style='width:100%;'>出荷日付</label>
                            <el-form-item label-width="0" prop="syukkaDate">
                                <el-input v-model="data.model.syukkaDate"
                                          type='date'
                                          min='1000-01-01'
                                          max='9999-12-31'></el-input>
                            </el-form-item>
                        </div>
                    </div>

                </el-form>
                <div class='row'>
                    <div class='col-md-12'>
                        <div style='text-align:right;width:100%;'>
                            <el-button style='margin-left:2%;' type='primary' v-on:click="confirm">確定</el-button>
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
    import Card from '@/components/Card/Card.vue'
    import KeyboardEvents from '@/components/KeyboardEvents.vue'
    import AddMethods from '@/js/add/add.js'
    import config from '@/config.js'
    import time from '@/js/status/time.js'
    import url from '@/js/api_url.js'

    export default {
        name: 'niukeNyuryokuSyoki',
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
                        syukkaDate: "",
                    },
                    validation: {
                        syukkaDate: [
                            { required: true, message: '出荷日付が入力されていません', trigger: 'blur' },
                        ],
                    }
                },
            }
        },
        methods: {
            keyboardEvent(e) {

                if (e.keyCode == config.KEY_CODES.F12) {
                    this.finish()
                }
            },
            confirm: function () {
                this.$refs['form'].validate((valid) => {

                    if (valid) {

                        var postArray = {
                            "SyukkaDate": this.data.model.syukkaDate
                        };

                        console.log(postArray);
                        axios.post(url.syukkaKakutei, postArray)
                            .then(response => {

                                var key = response.data[0].key;
                                console.log(key);
                                axios.post(url.syukkaKakuteiSyori_SyukkaDenpyo, { "key": key })
                                    .then(response => {

                                        var url = response.data.url;
                                        if (url != undefined) {
                                            window.open(url)
                                        }

                                    })
                                    .catch(response => console.log(response))

                                axios.post(url.syukkaKakuteiSyori_SyukkaShijisyo, { "key": key })
                                    .then(response => {

                                        var url = response.data.url;

                                        if (url != undefined) {
                                            window.open(url)
                                        }
                                    })
                                    .catch(response => console.log(response))

                                axios.post(url.syukkaKakuteiSyori_SyukkaNikkeihyo, { "key": key })
                                    .then(response => {

                                        var url = response.data.url;

                                        if (url != undefined) {
                                            window.open(url)
                                        }
                                    })
                                    .catch(response => console.log(response))


                                console.log(response.data);
                                console.log("成功");

                            })
                            .catch(response => console.log(response))


                    }

                });


            },
            finish: function () {
                alert("終了");
            }
        },
        created: function () {

            this.data.model.syukkaDate = time.nowJapanDateInput();

        }
    }
</script>
