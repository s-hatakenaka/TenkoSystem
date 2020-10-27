<template>
    <div>
        <keyboard-events v-on:keydown="keyboardEvent"></keyboard-events>
        <el-card>
            <div slot='header'>
                <span>振替明細書</span>
            </div>
            <div slot='default'>
                <el-form :model="data.model" :rules="data.validation" ref="Form" label-width="120px">
                    <div class="row">
                        <div class='col-md-5' style="margin-right:2%;">
                            <label for='荷受日付' class='col-form-label px-1' style='width:100%;'>処理日付</label>
                            <el-form-item label-width="0" prop="syoriDate">
                                <el-input v-model="data.model.syoriDate"
                                          type='date'
                                          min='1000-01-01'
                                          max='9999-12-31'></el-input>
                            </el-form-item>
                        </div>
                        <div class='col-md-6'>
                            <label for='現在集計回数' class='col-form-label px-1' style='width:100%;'>現在集計回数</label>
                            <el-form-item label-width="0" prop="frequencyBottom" style='width:30%;margin-right:2%; float:left;'>
                                <el-input type='text'
                                          style="width:100%;"
                                          v-model='data.model.frequencyBottom'
                                          readonly></el-input>
                            </el-form-item>
                            <span style='margin-right:2%; margin-top:0.5%;display:block;float:left;'>から</span>
                            <el-form-item label-width="0" prop="frequencyTop" style='width:30%;margin-right:2%; float:left;'>
                                <el-input type='text'
                                          style="width:100%;"
                                          v-model='data.model.frequencyTop'
                                          readonly></el-input>
                            </el-form-item>
                        </div>
                    </div>
                    <div class='row' style="margin-top:2%;">
                        <div class='col-md-12'>
                            <!--インクリメントサーチ-->
                            <label for='支所範囲' class='col-form-label px-1' style='width:100%;'>支所範囲</label>
                            <el-form-item label-width="0" prop="shisyoCodeBottom" style='width:40%;margin-right:1%; float:left;'>

                                <el-increment-search v-model="data.model.shisyoCodeBottom"
                                                     :display="[{key:'name',name:'名前'}]"
                                                     :autoComplete="['name']"
                                                     :kind="'支所'"
                                                     :required="true"
                                                     style='width:50%; margin-right:0.5%;'
                                                     @update="(r) => data.model.shisyoNameBottom = r[0]"></el-increment-search>
                                <el-input type='text'
                                          style='width:47%;margin-right:2%;'
                                          readonly
                                          :placeholder="'支所名'"
                                          v-model="data.model.shisyoNameBottom"></el-input>
                            </el-form-item>
                            <span style="margin-top: 0.5%;float:left;display:block;margin-right:2%;">～</span>
                            <el-form-item label-width="0" prop="shisyoCodeTop" style='width:40%;margin-right:2%; float:left;'>

                                <el-increment-search v-model="data.model.shisyoCodeTop"
                                                     :display="[{key:'name',name:'名前'}]"
                                                     :autoComplete="['name']"
                                                     :kind="'支所'"
                                                     :required="true"
                                                     style='width:40%; margin-right:0.5%;'
                                                     @update="(r) => data.model.shisyoNameTop = r[0]"></el-increment-search>
                                <el-input type='text'
                                          style='width:40%;margin-right:2%;'
                                          readonly
                                          :placeholder="'支所名'"
                                          v-model="data.model.shisyoNameTop"></el-input>
                            </el-form-item>
                        </div>
                    </div>
                    <el-form-item label-width="0" prop="syoriKubun">
                        <div class='row' style="margin-top:2%;">
                            <div class="col-md-12">
                                <p>明細区分</p>
                            </div>

                            <div class='col-md-2'>
                                <el-radio v-model="data.model.meisaiKubun" :label="0">通常</el-radio>
                            </div>
                            <div class='col-md-2'>
                                <el-radio v-model="data.model.meisaiKubun" :label="1">送金欄</el-radio>
                            </div>

                            <div class='col-md-2'>
                                <el-radio v-model="data.model.meisaiKubun" :label="2">売上欄</el-radio>
                            </div>
                        </div>
                    </el-form-item>
                    <el-form-item label-width="0" prop="syoriKubun">
                        <div class='row' style="margin-top:2%;">
                            <div class="col-md-12">
                                <p>出力区分</p>
                            </div>

                            <div class='col-md-2'>
                                <el-radio v-model="data.model.syutsuryokuKubun" :label="0">通常</el-radio>
                            </div>
                            <div class='col-md-2'>
                                <el-radio v-model="data.model.syutsuryokuKubun" :label="1">正のみ</el-radio>
                            </div>
                            <div class='col-md-2'>
                                <el-radio v-model="data.model.syutsuryokuKubun" :label="2">負のみ</el-radio>
                            </div>
                        </div>
                    </el-form-item>

                </el-form>
                <div class='row' style="margin-top:5%;">
                    <div class='col-md-12'>
                        <div style='text-align:right;width:100%;'>
                            <el-button style='margin-left:2%;' type='success' v-on:click="print">実行(F9)</el-button>
                            <el-button style='margin-left:2%;' type='primary' v-on:click="print">印刷(F10)</el-button>
                            <el-button style='margin-left:2%;' type='danger' v-on:click="preview">表示(F11)</el-button>
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
    import ElIncrementSearch from '@/components/IncrementSearch.vue'
    import time from '@/js/status/time.js'



    export default {
        name: 'niukeMonitorList',
        components: {
            KeyboardEvents, ElIncrementSearch
        },
        data: function () {
            return {
                data: {
                    model: {
                        syoriDate: 0,
                        meisaiKubun: 0,
                        syutsuryokuKubun: 0,
                        shisyoCodeTop: "",
                        shisyoNameTop: "",
                        shisyoCodeBottom: "",
                        shisyoNameBottom: "",
                        frequencyTop: null,
                        frequencyBottom: null,

                    },
                    validation: {
                        syoriDate: [
                            { required: true, message: '処理日付が入力されていません' },
                        ],
                        shisyoCodeTop: [
                            { required: true, message: '支所コードが入力されていません' },
                        ],
                        shisyoCodeBottom: [
                            { required: true, message: '支所コードが入力されていません' },
                        ],


                    },
                },
            }
        },
        methods: {
            keyboardEvent(e) {
                if (e.keyCode == config.KEY_CODES.F9) {
                    this.carryout()
                }

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
            nyuryokuCheck: function () {

                var model = this.data.model;
                if (Number(model.shisyoCodeTop) < Number(model.shisyoCodeBottom)) {

                    alert("支所区分の上限が下限よりも下回っています");
                    return false;

                }
                this.$refs['Form'].validate((valid) => {
                    if (valid) {
                        return true;
                    } else {
                        return false;
                    }
                });



            },
            carryout: function () {
                if (!this.nyuryokuCheck()) {
                    return false;
                }
                alert("実行");

            },
            print: function () {

                if (!this.nyuryokuCheck()) {
                    return false;
                }
                alert("印刷");
            },
            preview: function () {
                if (!this.nyuryokuCheck()) {
                    return false;
                }

                alert("プレビュー");
            },
            finish: function () {

                alert("終了");
            }
        },
        created: function () {

            var model = this.data.model;

            //※axiosから取ってくる
            model.syoriDate = time.nowJapanDateInput();

            //model.shisyoCodeTop = "99";
            //model.shisyoCodeBottom = "0";
            model.frequencyTop = 99;
            model.frequencyBottom = 0;



        },
        mounted: function () {


        }

    }
</script>
