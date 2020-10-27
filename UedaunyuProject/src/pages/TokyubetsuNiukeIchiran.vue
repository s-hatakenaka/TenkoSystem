<template>
    <div>
        <keyboard-events v-on:keydown="keyboardEvent"></keyboard-events>
        <el-card>
            <div slot='header'>
                <span>等級別荷受一覧表</span>
            </div>
            <div slot='default'>
                <form id="niukeNyuryokuForm" v-focus-first-on-load v-focus-next-on-enter class='vld-parent'>
                    <div class='row'>
                        <div class='col-md-6'>
                            <label for='集計対象回数' class='col-form-label px-1' style='width:100%;'>集計対象回数</label>
                            <el-input-number style='width:40%;margin-right:2%;'
                                             v-model='data.syukeiNumber.bottom'
                                             :max="data.syukeiNumber.top"
                                             ></el-input-number>
                            <span style='margin-right:2%;'>～</span>
                            <el-input-number style='width:40%;margin-right:2%;'
                                             :min="data.syukeiNumber.bottom"
                                             v-model='data.syukeiNumber.top'></el-input-number>
                        </div>
                    </div>
                    <div class="row">
                        <div class='col-md-8' style="margin-top:2%;">
                            <!--インクリメントサーチ-->
                            <label for='商品区分' class='col-form-label px-1' style='width:100%;'>商品区分</label>

                            <el-increment-search v-model="data.syouhinKubun.code.bottom"
                                                 :display="[{key:'syohinmei',name:'名前'}]"
                                                 :autoComplete="['syohinmei']"
                                                 :kind="'商品'"
                                                 :required="true"
                                                 style='width:15%; margin-right:0.5%;'
                                                 @update="(r) => data.syouhinKubun.name.bottom = r[0]"></el-increment-search>
                            <el-input type='text'
                                      style='width:30%;margin-right:2%;'
                                      readonly
                                      :placeholder="'商品名'"
                                      v-model="data.syouhinKubun.name.bottom"></el-input>

                            <span style='margin-right:2%;'>～</span>
                            <el-increment-search v-model="data.syouhinKubun.code.top"
                                                 :display="[{key:'syohinmei',name:'名前'}]"
                                                 :autoComplete="['syohinmei']"
                                                 :kind="'商品'"
                                                 :required="true"
                                                 style='width:15%; margin-right:0.5%;'
                                                 @update="(r) => data.syouhinKubun.name.top = r[0]"></el-increment-search>
                            <el-input type='text'
                                      style='width:30%;margin-right:2%;'
                                      readonly
                                      :placeholder="'商品名'"
                                      v-model="data.syouhinKubun.name.top"></el-input>


                        </div>
                    </div>
                    <div class='row' style="margin-top:2%;">
                        <div class='col-md-8'>
                            <!--インクリメントサーチ-->
                            <label for='等級範囲' class='col-form-label px-1' style='width:100%;'>等級範囲</label>
                            <el-increment-search v-model="data.tokyu.code.bottom"
                                                 :display="[{key:'name',name:'名前'}]"
                                                 :autoComplete="['name']"
                                                 :kind="'等級'"
                                                 :required="true"
                                                 style='width:15%; margin-right:0.5%;'
                                                 @update="(r) => data.tokyu.name.bottom = r[0]"></el-increment-search>
                            <el-input type='text'
                                      style='width:30%;margin-right:2%;'
                                      readonly
                                      :placeholder="'等級名'"
                                      v-model="data.tokyu.name.bottom"></el-input>

                            <span style='margin-right:2%;'>～</span>
                            <el-increment-search v-model="data.tokyu.code.top"
                                                 :display="[{key:'name',name:'名前'}]"
                                                 :autoComplete="['name']"
                                                 :kind="'等級'"
                                                 :required="true"
                                                 style='width:15%; margin-right:0.5%;'
                                                 @update="(r) => data.tokyu.name.top = r[0]"></el-increment-search>
                            <el-input type='text'
                                      style='width:30%;margin-right:2%;'
                                      readonly
                                      :placeholder="'等級名'"
                                      v-model="data.tokyu.name.top"></el-input>
                        </div>
                    </div>
                    <div class='row' style="margin-top:2%;">
                        <div class='col-md-4'>
                            <label for='金額印字' class='col-form-label px-1' style="margin-right:2%;">金額を印字する</label>
                            <el-checkbox v-model="data.kingakuInji"></el-checkbox>
                        </div>
                    </div>
                    <div class='row' style="margin-top:2%;">
                        <div class="col-md-12">
                            <p>自家用集計</p>
                        </div>
                        <div class='col-md-2'>
                            <el-radio v-model="data.jikayouSyukei" :label="0">荷受総数</el-radio>
                        </div>
                        <div class='col-md-2'>
                            <el-radio v-model="data.jikayouSyukei" :label="1">干柿精算個数</el-radio>
                        </div>
                        <div class='col-md-2'>
                            <el-radio v-model="data.jikayouSyukei" :label="2">自家使用数</el-radio>
                        </div>
                    </div>
                    <div class='row' style="margin-top:2%;">
                        <div class='col-md-12'>
                            <div style='text-align:right;width:100%;'>
                                <el-button style='margin-left:2%;' type='primary' v-on:click="print">印刷(F10)</el-button>
                                <el-button style='margin-left:2%;' type='danger' v-on:click="preview">表示(F11)</el-button>
                                <el-button style='margin-left:2%;' type='warning' v-on:click="finish">終了(F12)</el-button>
                            </div>
                        </div>
                    </div>
                </form>

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
            KeyboardEvents,ElIncrementSearch
        },
        data: function () {
            return {
                data: {
                    syukeiNumber: {
                        top: null,
                        bottom:null
                    },
                    syouhinKubun: {
                        code: {
                            top: "",
                            bottom: "",
                        },
                        name: {
                            top: "",
                            bottom: "",
                        }
                    },
                    tokyu: {
                        code: {
                            top: "",
                            bottom: "",
                        },
                        name: {
                            top: "",
                            bottom: "",
                        }
                    },
                    kingakuInji: false,
                    jikayouSyukei: 0,
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

      
                var syouhinKubunCode = this.data.syouhinKubun.code;

                if (Number(syouhinKubunCode.top) < Number(syouhinKubunCode.bottom)) {

                    alert("商品区分の上限が下限よりも下回っています");
                    return false;

                }

                var tokyuKubunCode = this.data.tokyuKubun.code;

                if (Number(tokyuKubunCode.top) < Number(tokyuKubunCode.bottom)) {

                    alert("等級範囲の上限が下限よりも下回っています");
                    return false;

                }

                return true;

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

            //※M管理/荷受け集計回数上限と下限の取得

            this.data.syukeiNumber.top = 99;
            this.data.syukeiNumber.bottom = 0;

            //※商品区分と等級に初期値代入
            this.data.syouhinKubun.code.top = "9";
            this.data.syouhinKubun.code.bottom = "0";
            this.data.syouhinKubun.name.top = "等外";
            this.data.syouhinKubun.name.bottom = "干柿";


            this.data.tokyu.code.top = "99";
            this.data.tokyu.code.bottom = "0";
            this.data.tokyu.name.top = "特上";
            this.data.tokyu.name.bottom = "特下";

        },
        mounted: function () {


        }

    }
</script>
