<template>
    <div>
        <keyboard-events v-on:keydown="keyboardEvent"></keyboard-events>
        <el-card>
            <div slot='header'>
                <span>荷受集計</span>
            </div>
            <div slot='default'>
                <el-form :model="data.model" :rules="data.validation" ref="Form" label-width="120px">
                    <div class="row">
                        <div class='col-md-12'>
                            <label for='集計対象回数' class='col-form-label px-1' style='width:100%;'>集計対象回数</label>
                            <el-form-item label-width="0" prop="frequencyBottom" style='width:30%;margin-right:2%; float:left;'>
                                <el-input-number type='text'
                                                 style="width:100%;"
                                                 v-model='data.model.frequencyBottom'
                                                 :max="data.model.frequencyTop"></el-input-number>
                            </el-form-item>
                            <span style='margin-right:2%; margin-top:0.5%;display:block;float:left;'>から</span>
                            <el-form-item label-width="0" prop="frequencyTop" style='width:30%;margin-right:2%; float:left;'>
                                <el-input-number type='text'
                                                 style="width:100%;"
                                                 v-model='data.model.frequencyTop'
                                                 :min="data.model.frequencyBottom"></el-input-number>
                            </el-form-item>
                            <span style="margin-top: 0.5%;float:left;display:block;">まで</span>
                        </div>
                    </div>
                    <div class='row'>
                        <div class='col-md-6'>
                            <label for='処理件数' class='col-form-label px-1' style="width:100%;">処理件数</label>
                            <el-input id="syouhinName"
                                      type='text'
                                      style='width:80%;margin-right:2%;'
                                      v-model="data.transactions"
                                      readonly></el-input>

                            <span>件</span>
                        </div>
                    </div>

                </el-form>
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
    import AddMethods from '@/js/add/add.js'
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
                        frequencyTop: 31,
                        frequencyBottom: 0,
                    },
                    transactions: "",
                    validation: {
                        frequencyTop: [
                            { required: true, message: '集計対象回数上限が入力されていません', trigger: 'blur' },
                        ],
                        frequencyBottom: [
                            { required: true, message: '集計対象回数下限が入力されていません', trigger: 'blur' },
                        ]
                    }

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

                        if (!window.confirm("荷受集計を行います。よろしいですか？")) {

                            return false;
                        }


                        axios.post('http://52.185.145.173:5001/api/Niukesyukei', {
                            Nyuryokutantocd:Number(this.$store.state.login.userCode),
                            Nendo: Number(time.nowJapanYear()),
                            Kaisukagen: this.data.frequencyBottom,
                            Kaisujyogen: this.data.frequencyTop,

                        })
                            .then(response => {
                                colnsole.log(response);
                            })
                            .catch(response => console.log(response))

                    }
                });



            },
        },
        mounted: function () {
            //Vueオブジェクトに要素の登録
            AddMethods.add.elementRegisterByID(this, "element", ["niukeSyukeiForm"]);

        },

    }
</script>
