<template>
    <div>
        <keyboard-events v-on:keydown="keyboardEvent"></keyboard-events>
        <el-card>
            <div slot='header'>
                <span>精算明細Ecxelデータ出力</span>
            </div>
            <div slot='default'>
                <el-form :model="data.model" :rules="data.validation" ref="Form" label-width="120px">
                    <div class="row">
                        <div class='col-md-12'>
                            <label for='年度' class='col-form-label px-1' style='width:100%;'>年度</label>
                            <el-form-item label-width="0" prop="yearBottom" style='width:30%;margin-right:2%; float:left;'>
                                <el-input-number type='text'
                                                 style="width:100%;"
                                                 v-model='data.model.yearBottom'
                                                 controls-position="right"
                                                 :min="0"
                                                 ></el-input-number>
                            </el-form-item>
                            <span style='margin-right:2%; margin-top:0.5%;display:block;float:left;'>から</span>
                            <el-form-item label-width="0" prop="yearTop" style='width:30%;margin-right:2%; float:left;'>
                                <el-input-number type='text'
                                                 style="width:100%;"
                                                 v-model='data.model.yearTop'
                                                 controls-position="right"
                                                 :min="0"
                                                 ></el-input-number>
                            </el-form-item>
                            <span style="margin-top: 0.5%;float:left;display:block;">まで</span>
                        </div>
                    </div>
                    <div class='row'>
                        <div class='col-md-6'>
                            <label for='出力パス' class='col-form-label px-1' style="width:100%;">出力パス</label>
                            <el-form-item label-width="0" prop="syutsuryokuPass">
                                <el-input type='text'
                                          style='width:80%;margin-right:2%;'
                                          v-model="data.model.syutsuryokuPass"></el-input>
                            </el-form-item>
                        </div>
                    </div>

                    <el-form-item label-width="0" prop="excelKubun">
                        <div class='row' style="margin-top:2%;">
                            <div class="col-md-12">
                                <p>Excel区分</p>
                            </div>

                            <div class='col-md-2'>
                                <el-radio v-model="data.model.excelKubun" :label="0">数量</el-radio>
                            </div>
                            <div class='col-md-2'>
                                <el-radio v-model="data.model.excelKubun" :label="1">金額</el-radio>
                            </div>
                            <div class='col-md-2'>
                                <el-radio v-model="data.model.excelKubun" :label="2">両方</el-radio>
                            </div>

                        </div>
                    </el-form-item>

                    <div class='row'>
                        <div class='col-md-6'>
                            <label for='出力件数' class='col-form-label px-1' style="width:100%;">出力件数</label>
                            <el-input type='text'
                                      style='width:80%;margin-right:2%;'
                                      v-model="data.model.syutsuryokuKensu"
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
    import config from '@/config.js'


    export default {
        name: 'niukeSyukei',
        components: {
            Card, KeyboardEvents
        },
        data: function () {
            return {
                data: {
                    model: {
                        syutsuryokuPass: "",
                        excelKubun: 2,
                        yearTop: null,
                        yearBottom: null,
                        syutsuryokuKensu: "",
                    },
                    transactions: "",
                    validation: {
                        syutsuryokuPass: [
                            { required: true, message: '出力パスが入力されていません', trigger: 'blur' },
                        ],
                        yearTop: [
                            { required: true, message: '年度が入力されていません', trigger: 'blur' },
                        ],
                        yearBottom: [
                            { required: true, message: '年度が入力されていません', trigger: 'blur' },
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

                        var model = this.data.model;

                        if (model.yearBottom > model.yearTop) {
                            alert("年度の下限が上限を上回っています");
                            return false;
                        }

                        if (model.yearBottom < model.yearTop - 5) {
                            alert("年度範囲の上限は五年間までです。");
                            return false;
                        }


                        if (!window.confirm("出力を行います。よろしいですか？")) {

                            return false;
                        }

                        //※ここでaxiosでpostする

                        alert("実行");
                    }
                });



            },
        },
        created: function () {

            var model = this.data.model;

            //※後で取ってくる
            model.syutsuryokuPass = "C:\HGK\Excel\精算明細書.xls";

            model.syutsuryokuKensu = 2;
        },
        mounted: function () {
   
        },

    }
</script>
