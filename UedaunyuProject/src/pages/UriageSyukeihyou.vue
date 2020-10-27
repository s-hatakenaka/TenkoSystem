<template>
    <div>
        <keyboard-events v-on:keydown="keyboardEvent"></keyboard-events>
        <el-card>
            <div slot='header'>
                <span>売上集計表</span>
            </div>
            <div slot='default'>
                <el-form :model="data.model" :rules="data.validation" ref="Form" label-width="120px">
                    <div class="row">
                        <div class='col-md-12'>
                            <label for='荷受日付' class='col-form-label px-1' style='width:100%;'>出荷日付</label>
                            <el-form-item label-width="0" prop="dateStart" style='width:30%;margin-right:2%; float:left;'>
                                <el-input type='date'
                                          style='width:100%;margin-right:2%;'
                                          :max="data.model.dateEnd"
                                          v-model='data.model.dateStart'></el-input>
                            </el-form-item>
                            <span style='margin-right:2%; margin-top:0.5%;display:block;float:left;'>～</span>
                            <el-form-item label-width="0" prop="dateEnd" style='width:30%;margin-right:2%; float:left;'>
                                <el-input type='date'
                                          style='width:100%;margin-right:2%;'
                                          :min="data.model.dateStart"
                                          v-model='data.model.dateEnd'></el-input>
                            </el-form-item>
                        </div>
                    </div>
                    <div class="row">
                        <div class='col-md-4'>
                            <label for='荷受日付' class='col-form-label px-1' style='width:100%;'>発行日</label>
                            <el-form-item label-width="0" prop="hakkouDate">
                                <el-input v-model="data.model.hakkouDate"
                                          type='date'
                                          min='1000-01-01'
                                          max='9999-12-31'></el-input>
                            </el-form-item>
                        </div>
                    </div>
                    <div class='row' style="margin-top:2%;">
                        <div class='col-md-12'>
                            <!--インクリメントサーチ-->
                            <label for='市場コード' class='col-form-label px-1' style='width:100%;'>市場コード</label>
                            <el-form-item label-width="0" prop="shijoCodeBottom" style='width:40%;margin-right:1%; float:left;'>

                                <el-increment-search v-model="data.model.shijoCodeBottom"
                                                     :display="[{key:'name',name:'名前'}]"
                                                     :autoComplete="['name']"
                                                     :kind="'市場'"
                                                     :required="true"
                                                     style='width:50%; margin-right:0.5%;'
                                                     @update="(r) => data.model.shijoNameBottom = r[0]"></el-increment-search>
                                <el-input type='text'
                                          style='width:47%;margin-right:2%;'
                                          readonly
                                          :placeholder="'市場名'"
                                          v-model="data.model.shijoNameBottom"></el-input>
                            </el-form-item>
                            <span style="margin-top: 0.5%;float:left;display:block;margin-right:2%;">～</span>
                            <el-form-item label-width="0" prop="shijoCodeTop" style='width:40%;margin-right:2%; float:left;'>

                                <el-increment-search v-model="data.model.shijoCodeTop"
                                                     :display="[{key:'name',name:'名前'}]"
                                                     :autoComplete="['name']"
                                                     :kind="'市場'"
                                                     :required="true"
                                                     style='width:40%; margin-right:0.5%;'
                                                     @update="(r) => data.model.shijoNameTop = r[0]"></el-increment-search>
                                <el-input type='text'
                                          style='width:40%;margin-right:2%;'
                                          readonly
                                          :placeholder="'市場名'"
                                          v-model="data.model.shijoNameTop"></el-input>
                            </el-form-item>
                        </div>
                    </div>
        
                </el-form>
                <div class='row' style="margin-top:5%;">
                    <div class='col-md-12'>
                        <div style='text-align:right;width:100%;'>
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
                        dateStart: "",
                        dateEnd: "",
                        hakkouDate: "",
                        shijoCodeTop: "",
                        shijoNameTop: "",
                        shijoCodeBottom: "",
                        shijoNameBottom: "",
                    },
                    validation: {
                        hakkouDate: [
                            { required: true, message: '日付が入力されていません' },
                        ],
                        dateStart: [
                            { required: true, message: '日付が入力されていません' },
                        ],
                        dateEnd: [
                            { required: true, message: '日付が入力されていません' },
                        ],
                        shijoCodeTop: [
                            { required: true, message: '市場コードが入力されていません' },
                        ],
                        shijoCodeBottom: [
                            { required: true, message: '市場コードが入力されていません' },
                        ],



                    },
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
            nyuryokuCheck: function () {

                this.$refs['Form'].validate((valid) => {
                    if (valid) {
                        var model = this.data.model;

                        if (new Date(model.shijoCodeEnd).getTime() < new Date(model.dateStart).getTime()) {

                            alert("出力日付の上限が下限よりも下回っています");
                            return false;

                        }

                        if (Number(model.shijoCodeTop) < Number(model.shijoCodeBottom)) {

                            alert("市場区分の上限が下限よりも下回っています");
                            return false;

                        }

                        return true;
                    } else {
                        return false;
                    }
                });



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
            var now_date = time.nowJapanDate();
            this.data.model.dateStart = time.time_edit(new Date(now_date.getFullYear(), now_date.getMonth(), 1), 4);
            this.data.model.dateEnd = time.nowJapanDateInput();
            this.data.model.hakkouDate = time.nowJapanDateInput();


        },
        mounted: function () {


        }

    }
</script>
