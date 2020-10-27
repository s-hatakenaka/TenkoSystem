<template>
    <div>
        <keyboard-events v-on:keydown="keyboardEvent"></keyboard-events>
        <el-card>
            <div slot='header'>
                <span>支払明細書</span>
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
                            <label for='生産者範囲' class='col-form-label px-1' style='width:100%;'>生産者範囲</label>
                            <el-form-item label-width="0" prop="seisansyaCodeBottom" style='width:40%;margin-right:1%; float:left;'>

                                <el-increment-search v-model="data.model.seisansyaCodeBottom"
                                                     :display="[{key:'name',name:'名前'}]"
                                                     :autoComplete="['name']"
                                                     :kind="'生産者'"
                                                     :required="true"
                                                     style='width:50%; margin-right:0.5%;'
                                                     @update="(r) => data.model.seisansyaNameBottom = r[0]"></el-increment-search>
                                <el-input type='text'
                                          style='width:47%;margin-right:2%;'
                                          readonly
                                          :placeholder="'生産者名'"
                                          v-model="data.model.seisansyaNameBottom"></el-input>
                            </el-form-item>
                            <span style="margin-top: 0.5%;float:left;display:block;margin-right:2%;">～</span>
                            <el-form-item label-width="0" prop="seisansyaCodeTop" style='width:40%;margin-right:2%; float:left;'>

                                <el-increment-search v-model="data.model.seisansyaCodeTop"
                                                     :display="[{key:'name',name:'名前'}]"
                                                     :autoComplete="['name']"
                                                     :kind="'生産者'"
                                                     :required="true"
                                                     style='width:40%; margin-right:0.5%;'
                                                     @update="(r) => data.model.seisansyaNameTop = r[0]"></el-increment-search>
                                <el-input type='text'
                                          style='width:40%;margin-right:2%;'
                                          readonly
                                          :placeholder="'生産者名'"
                                          v-model="data.model.seisansyaNameTop"></el-input>
                            </el-form-item>
                        </div>
                    </div>
                    <div class="row">
                        <div class='col-md-3'>
                            <label for='手数料' class='col-form-label px-1' style='width:100%;'>手数料</label>
                            <el-form-item label-width="0" prop="tesuryou">

                                <el-input-number style='width:100%;'
                                                 v-model='data.model.tesuryou'
                                                 controls-position="right"
                                                 :min="0"
                                                 :precision="1"
                                                 :step="0.1"></el-input-number>
                            </el-form-item>
                        </div>
                    </div>
                    <div class="row">
                        <div class='col-md-3'>
                            <label for='資材取込回数' class='col-form-label px-1' style='width:100%;'>資材取込回数</label>
                            <el-form-item label-width="0" prop="shizaiTorikomiKaisu">

                                <el-input-number style='width:100%;'
                                                 v-model='data.model.shizaiTorikomiKaisu'
                                                 controls-position="right"
                                                 :min="0"></el-input-number>
                            </el-form-item>
                        </div>

                    </div>
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
                        syouhinCode: "",
                        syouhinName: "",
                        tesuryou: null,
                        shizaiTorikomiKaisu: 0,
                        seisansyaCodeTop: "",
                        seisansyaNameTop: "",
                        seisansyaCodeBottom: "",
                        seisansyaNameBottom: "",
                        frequencyTop: null,
                        frequencyBottom: null,

                    },
                    validation: {
                        syoriDate: [
                            { required: true, message: '処理日付が入力されていません' },
                        ],
                        ryouritsu: [
                            { required: true, message: '料率が入力されていません' },
                        ],
                        shizaiTorikomiKaisu: [
                            { required: true, message: '資材取込回数が入力されていません' },
                        ],
                        seisansyaCodeTop: [
                            { required: true, message: '生産者コードが入力されていません' },
                        ],
                        seisansyaCodeBottom: [
                            { required: true, message: '生産者コードが入力されていません' },
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
                if (Number(model.seisansyaCodeTop) < Number(model.seisansyaCodeBottom)) {

                    alert("生産者区分の上限が下限よりも下回っています");
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

            model.tesuryou = 1.9;
            //model.seisansyaCodeTop = "99";
            //model.seisansyaCodeBottom = "0";
            model.frequencyTop = 99;
            model.frequencyBottom = 0;



        },
        mounted: function () {


        }

    }
</script>
