<template>
    <div>
        <keyboard-events v-on:keydown="keyboardEvent"></keyboard-events>
        <el-card>
            <div slot='header'>
                <span>サイズ別市場販売表</span>
            </div>
            <div slot='default'>
                <el-form :model="data.model" :rules="data.validation" ref="Form" label-width="120px">
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

                        <div class='col-md-12'>
                            <!--インクリメントサーチ-->
                            <label for='包装範囲' class='col-form-label px-1' style='width:100%;'>包装範囲</label>
                            <el-form-item label-width="0" prop="hosoCodeBottom" style='width:40%;margin-right:1%; float:left;'>

                                <el-increment-search v-model="data.model.hosoCodeBottom"
                                                     :display="[{key:'name',name:'名前'}]"
                                                     :autoComplete="['name']"
                                                     :kind="'包装'"
                                                     :required="true"
                                                     style='width:50%; margin-right:0.5%;'
                                                     @update="(r) => data.model.hosoNameBottom = r[0]"></el-increment-search>
                                <el-input type='text'
                                          style='width:47%;margin-right:2%;'
                                          readonly
                                          :placeholder="'包装名'"
                                          v-model="data.model.hosoNameBottom"></el-input>
                            </el-form-item>
                            <span style="margin-top: 0.5%;float:left;display:block;margin-right:2%;">～</span>
                            <el-form-item label-width="0" prop="hosoCodeTop" style='width:40%;margin-right:2%; float:left;'>

                                <el-increment-search v-model="data.model.hosoCodeTop"
                                                     :display="[{key:'name',name:'名前'}]"
                                                     :autoComplete="['name']"
                                                     :kind="'包装'"
                                                     :required="true"
                                                     style='width:40%; margin-right:0.5%;'
                                                     @update="(r) => data.model.hosoNameTop = r[0]"></el-increment-search>
                                <el-input type='text'
                                          style='width:40%;margin-right:2%;'
                                          readonly
                                          :placeholder="'包装名'"
                                          v-model="data.model.hosoNameTop"></el-input>
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
                        shijoCodeTop: "",
                        shijoNameTop: "",
                        shijoCodeBottom: "",
                        shijoNameBottom: "",
                        hosoCodeTop: "",
                        hosoNameTop: "",
                        hosoCodeBottom: "",
                        hosoNameBottom: "",
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
                        shijoCodeTop: [
                            { required: true, message: '市場コードが入力されていません' },
                        ],
                        shijoCodeBottom: [
                            { required: true, message: '市場コードが入力されていません' },
                        ],

                        hosoCodeTop: [
                            { required: true, message: '包装コードが入力されていません' },
                        ],
                        hosoCodeBottom: [
                            { required: true, message: '包装コードが入力されていません' },
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
                        if (Number(model.hosoCodeTop) < Number(model.hosoCodeBottom)) {

                            alert("包装区分の上限が下限よりも下回っています");
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

            var model = this.data.model;

            //※axiosから取ってくる

            model.frequencyTop = 99;
            model.frequencyBottom = 0;



        },
        mounted: function () {


        }

    }
</script>
