<template>
    <div>
        <keyboard-events v-on:keydown="keyboardEvent"></keyboard-events>
        <el-card>
            <div slot='header'>
                <span>地区生産者別精算表</span>
            </div>
            <div slot='default'>
                <el-form :model="data.model" :rules="data.validation" ref="Form" label-width="120px">
                    <el-form-item label-width="0" prop="syoriKubun">
                        <div class='row' style="margin-top:2%;">
                            <div class="col-md-12">
                                <p>出力区分</p>
                            </div>

                            <div class='col-md-2'>
                                <el-radio v-model="data.model.syoriKubun" :label="0">地区別</el-radio>
                            </div>
                            <div class='col-md-2'>
                                <el-radio v-model="data.model.syoriKubun" :label="1">生産者別</el-radio>
                            </div>
                        </div>
                    </el-form-item>
                    <div class="row">
                        <div class='col-md-8'>
                            <label for='商品' class='col-form-label px-1' style='width:100%;'>商品</label>
                            <el-form-item label-width="0" prop="syohinCode">

                                <el-increment-search v-model="data.model.syouhinCode"
                                                     :display="[{key:'syohinmei',name:'名前'}]"
                                                     :autoComplete="['syohinmei']"
                                                     :kind="'商品'"
                                                     :required="true"
                                                     @update="(r) => data.model.syouhinName = r.syohinmei"></el-increment-search>
                                <el-input type='text'
                                          style='width:50%;'
                                          readonly
                                          :placeholder="'商品名'"
                                          :disabled="data.confirmFlag"
                                          v-model="data.model.syohinName"></el-input>
                            </el-form-item>
                        </div>
                    </div>
                    <div class="row">
                        <div class='col-md-3'>
                            <label for='料率' class='col-form-label px-1' style='width:100%;'>料率</label>
                            <el-form-item label-width="0" prop="ryouritsu">

                                <el-input-number style='width:100%;'
                                                 v-model='data.model.ryouritsu'
                                                 controls-position="right"
                                                 :min="0"
                                                 :precision="1"
                                                 :step="0.1"></el-input-number>
                            </el-form-item>
                        </div>
                        <div class='col-md-3'>
                            <label for='料率名' class='col-form-label px-1' style='width:100%;'>料率名</label>
                            <el-form-item label-width="0" prop="ryouritsuName">

                                <el-input style='width:100%;'
                                          v-model='data.model.ryouritsuName'
                                          readonly
                                          type="text"></el-input>
                            </el-form-item>
                        </div>

                    </div>
                    <div class='row' style="margin-top:2%;">
                        <div class='col-md-12'>
                            <!--インクリメントサーチ-->
                            <label for='地区範囲' class='col-form-label px-1' style='width:100%;'>地区範囲</label>
                            <el-form-item label-width="0" prop="chikuCodeBottom" style='width:40%;margin-right:1%; float:left;'>

                                <el-increment-search v-model="data.model.chikuCodeBottom"
                                                     :display="[{key:'name',name:'名前'}]"
                                                     :autoComplete="['name']"
                                                     :kind="'地区'"
                                                     :required="true"
                                                     style='width:50%; margin-right:0.5%;'
                                                     @update="(r) => data.model.chikuNameBottom = r[0]"></el-increment-search>
                                <el-input type='text'
                                          style='width:47%;margin-right:2%;'
                                          readonly
                                          :placeholder="'地区名'"
                                          v-model="data.model.chikuNameBottom"></el-input>
                            </el-form-item>
                            <span style="margin-top: 0.5%;float:left;display:block;margin-right:2%;">～</span>
                            <el-form-item label-width="0" prop="chikuCodeTop" style='width:40%;margin-right:2%; float:left;'>

                                <el-increment-search v-model="data.model.chikuCodeTop"
                                                     :display="[{key:'name',name:'名前'}]"
                                                     :autoComplete="['name']"
                                                     :kind="'地区'"
                                                     :required="true"
                                                     style='width:40%; margin-right:0.5%;'
                                                     @update="(r) => data.model.chikuNameTop = r[0]"></el-increment-search>
                                <el-input type='text'
                                          style='width:40%;margin-right:2%;'
                                          readonly
                                          :placeholder="'地区名'"
                                          v-model="data.model.chikuNameTop"></el-input>
                            </el-form-item>
                        </div>
                    </div>
                    <div class='col-md-12'>
                        <label for='集計対象回数' class='col-form-label px-1' style='width:100%;'>現在集計回数</label>
                        <el-form-item label-width="0" prop="frequencyBottom" style='width:30%;margin-right:2%; float:left;'>
                            <el-input type='text'
                                      style="width:100%;"
                                      v-model='data.model.frequencyBottom'
                                      readonly
                                      controls-position="right"></el-input>
                        </el-form-item>
                        <span style='margin-right:2%; margin-top:0.5%;display:block;float:left;'>から</span>
                        <el-form-item label-width="0" prop="frequencyTop" style='width:30%;margin-right:2%; float:left;'>
                            <el-input type='text'
                                      style="width:100%;"
                                      v-model='data.model.frequencyTop'
                                      controls-position="right"
                                      readonly></el-input>
                        </el-form-item>
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



    export default {
        name: 'niukeMonitorList',
        components: {
            KeyboardEvents, ElIncrementSearch
        },
        data: function () {
            return {
                data: {
                    model: {
                        syoriKubun: 0,
                        syouhinCode: "",
                        syouhinName: "",
                        ryouritsu: null,
                        ryouritsuName: "",
                        chikuCodeTop: "",
                        chikuNameTop: "",
                        chikuCodeBottom: "",
                        chikuNameBottom: "",
                        frequencyTop: null,
                        frequencyBottom: null,

                    },
                    validation: {
                        syohinCode: [
                            { required: true, message: '商品コードが入力されていません' },
                        ],
                        ryouritsu: [
                            { required: true, message: '料率が入力されていません' },
                        ],
                        chikuCodeTop: [
                            { required: true, message: '地区コードが入力されていません' },
                        ],
                        chikuCodeBottom: [
                            { required: true, message: '地区コードが入力されていません' },
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
                        if (Number(model.chikuCodeTop) < Number(model.chikuCodeBottom)) {

                            alert("地区区分の上限が下限よりも下回っています");
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

            var model = this.data.model;

            //※axiosから取ってくる

            model.ryouritsu = 1.9;
            model.ryouritsuName = "手数料"
            model.chikuCodeTop = "99";
            model.chikuCodeBottom = "0";
            model.frequencyTop = 99;
            model.frequencyBottom = 0;



        },
        mounted: function () {


        }

    }
</script>
