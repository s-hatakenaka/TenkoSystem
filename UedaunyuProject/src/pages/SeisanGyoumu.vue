<template>
    <div>
        <keyboard-events v-on:keydown="keyboardEvent"></keyboard-events>
        <el-card>
            <div slot='header'>
                <span>精算業務</span>
            </div>
            <div slot='default'>
                <form id="niukeNyuryokuForm" v-focus-first-on-load v-focus-next-on-enter class='vld-parent'>
                    <div class='row' style="margin-top:2%;">
                        <div class="col-md-8">
                            <div class="row">
                                <div class="col-md-12">
                                    <p>処理区分</p>
                                </div>
                            </div>
                            <div class="row" style="margin-top:1%;">
                                <div class='col-md-4'>
                                    <el-radio v-model="data.syoriKubun" :label="0" @change="syoriKubunChange">精算集計</el-radio>
                                </div>
                                <div class='col-md-4'>
                                    <el-radio v-model="data.syoriKubun" :label="1" @change="syoriKubunChange">生産者精算明細書</el-radio>
                                </div>
                                <div class='col-md-4'>
                                    <el-radio v-model="data.syoriKubun" :label="2" @change="syoriKubunChange">精算分送金明細書</el-radio>
                                </div>
                            </div>
                            <div class="row" style="margin-top:1%;">
                                <div class='col-md-4'>
                                </div>
                                <div class='col-md-4'>
                                    <el-radio v-model="data.syoriKubun" :label="3" @change="syoriKubunChange">生産者精算明細書(支所別)</el-radio>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4" style="margin-top:1%;">
                            <label for='年度' class='col-form-label px-1' style='width:100%;'>年度</label>
                            <el-input-number :min='1'
                                             :max='9999'
                                             controls-position="right"
                                             v-model="data.year"
                                             ></el-input-number>
                        </div>

                    </div>
                    <div class="row" style="margin-top:3%;">
                        <div class="col-md-7">
                            <div class="row">
                                <div class="col-md-12">
                                    <p>集計条件</p>
                                </div>
                            </div>
                            <div class="row" style="margin-top:2%;">
                                <div class='col-md-11'>
                                    <label for='集計回数範囲' class='col-form-label px-1' style='width:100%;'>集計回数範囲</label>
                                    <el-input-number style='width:40%;margin-right:2%;'
                                                     v-model='data.syukeiNumber.bottom'
                                                     controls-position="right"
                                                     :max="data.syukeiNumber.top"
                                                     :min="0"
                                                     :disabled="data.disabled.syukei"></el-input-number>
                                    <span style='margin-right:2%;'>～</span>
                                    <el-input-number style='width:40%;margin-right:2%;'
                                                     v-model='data.syukeiNumber.top'
                                                     controls-position="right"
                                                     :max="99"
                                                     :min="data.syukeiNumber.bottom"
                                                     :disabled="data.disabled.syukei"></el-input-number>
                                </div>
                            </div>
                            <div class="row" style="margin-top:2%;">
                                <div class='col-md-11'>
                                    <label for='手数料率' class='col-form-label px-1' style='width:100%;'>手数料率</label>
                                    <table class="table">
                                        <thead>
                                            <tr>
                                                <th>区分</th>
                                                <th>商品名</th>
                                                <th>実行</th>
                                                <th>手数料%</th>
                                                <th>売上精算金%</th>
                                                <th>数量精算金</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="syouhin in data.syouhin" v-bind:key="syouhin.number">
                                                <td>{{syouhin.code}}</td>
                                                <td>{{syouhin.name}}</td>
                                                <td>
                                                    <el-checkbox v-model="syouhin.jikkou" :disabled="data.disabled.syukei">実行する</el-checkbox>
                                                </td>
                                                <td>
                                                    <el-input-number 
                                                                     v-model='syouhin.tesuryou'
                                                                     controls-position="right"
                                                                     :disabled="data.disabled.syukei"></el-input-number>
                                                </td>
                                                <td>
                                                    <el-input-number v-model='syouhin.uriageseisan'
                                                                     controls-position="right"
                                                                     :precision="2" :step="0.1"
                                                                     :disabled="data.disabled.syukei"></el-input-number>

                                                </td>
                                                <td>
                                                    <el-input-number v-model='syouhin.suryouseisan'
                                                                     controls-position="right"
                                                                     :precision="2" :step="0.1"
                                                                     :disabled="data.disabled.syukei"></el-input-number>

                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div class="row" style="margin-top:2%;">
                                <div class="col-md-6">
                                    <div class="row">
                                        <div class="col-md-12" style="margin-top:1%;">
                                            <label for='生産者助成金配当条件' class='col-form-label px-1' style='width:100%;'>生産者助成金配当条件</label>
                                            <el-input-number style='width:80%;'
                                                             :min='0'
                                                             controls-position="right"
                                                             v-model="data.seisanHaitouJouken"
                                                             :disabled="data.disabled.syukei"
                                                             ></el-input-number>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="row">
                                        <div class='col-md-12'>
                                            <el-checkbox v-model="data.checked.syukei[0]" :disabled="data.disabled.syukei">①～⑥生産金額～中期前渡金の表示</el-checkbox>
                                        </div>
                                        <div class='col-md-12'>
                                            <el-checkbox v-model="data.checked.syukei[1]" :disabled="data.disabled.syukei">⑦⑧精算金の集計を行う。</el-checkbox>
                                        </div>
                                        <div class='col-md-12'>
                                            <el-checkbox v-model="data.checked.syukei[2]" :disabled="data.disabled.syukei">⑨生産助成金の集計を行う。</el-checkbox>
                                        </div>
                                        <div class='col-md-12'>
                                            <el-checkbox v-model="data.checked.syukei[3]" :disabled="data.disabled.syukei">⑩預り金の集計を行う。</el-checkbox>
                                        </div>
                                        <div class='col-md-12'>
                                            <el-checkbox v-model="data.checked.syukei[4]" :disabled="data.disabled.syukei">⑪出資金の集計を行う。</el-checkbox>
                                        </div>
                                        <div class='col-md-12'>
                                            <el-checkbox v-model="data.checked.syukei[5]" :disabled="data.disabled.syukei">⑫給与の集計を行う。</el-checkbox>
                                        </div>
                                        <div class='col-md-12'>
                                            <el-checkbox v-model="data.checked.syukei[6]" :disabled="data.disabled.syukei">⑬前年精算金集計を行う。</el-checkbox>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-5">
                            <div class="row">
                                <div class="col-md-12">
                                    <p>印刷条件</p>
                                </div>
                            </div>
                            <div class="row">
                                <div class='col-md-8' style="margin-top:2%;">
                                    <label for='生産者' class='col-form-label px-1' style='width:100%;'>生産者</label>
                                    <el-increment-search v-model="data.seisansya.code.bottom"
                                                         :display="[{key:'seisansyamei',name:'名前'}]"
                                                         :autoComplete="['seisansyamei']"
                                                         :kind="'生産者'"
                                                         :required="true"
                                                         style='width:30%; margin-right:0.5%;'
                                                         :disabled="data.syoriKubun != 1"
                                                         @update="(r) => data.seisansya.name.bottom = r[0]"></el-increment-search>
                                    <el-input type='text'
                                              style='width:60%;margin-right:2%;'
                                              readonly
                                              :placeholder="'生産者名'"
                                              :disabled="data.syoriKubun != 1"
                                              v-model="data.seisansya.name.bottom"></el-input>

                                    <span style='margin-right:2%;'>～</span>
                                    <el-increment-search v-model="data.seisansya.code.top"
                                                         :display="[{key:'seisansyamei',name:'名前'}]"
                                                         :autoComplete="['seisansyamei']"
                                                         :kind="'生産者'"
                                                         :required="true"
                                                         style='width:30%; margin-right:0.5%;'
                                                         :disabled="data.syoriKubun != 1"
                                                         @update="(r) => data.seisansya.name.top = r[0]"></el-increment-search>
                                    <el-input type='text'
                                              style='width:60%;margin-right:2%;'
                                              readonly
                                              :placeholder="'生産者名'"
                                              :disabled="data.syoriKubun != 1"
                                              v-model="data.seisansya.name.top"></el-input>


                                </div>
                            </div>
                            <div class='row' style="margin-top:2%;">
                                <div class='col-md-8'>
                                    <!--インクリメントサーチ-->
                                    <label for='支所' class='col-form-label px-1' style='width:100%;'>支所</label>
                                    <el-increment-search v-model="data.sisyo.code.bottom"
                                                         :display="[{key:'name',name:'名前'}]"
                                                         :autoComplete="['name']"
                                                         :kind="'支所'"
                                                         :required="true"
                                                         style='width:30%; margin-right:0.5%;'
                                                         :disabled="data.syoriKubun != 3"
                                                         @update="(r) => data.sisyo.name.bottom = r[0]"></el-increment-search>
                                    <el-input type='text'
                                              style='width:60%;margin-right:2%;'
                                              readonly
                                              :placeholder="'支所'"
                                              :disabled="data.syoriKubun != 3"
                                              v-model="data.sisyo.name.bottom"></el-input>

                                    <span style='margin-right:2%;'>～</span>
                                    <el-increment-search v-model="data.sisyo.code.top"
                                                         :display="[{key:'name',name:'名前'}]"
                                                         :autoComplete="['name']"
                                                         :kind="'支所'"
                                                         :required="true"
                                                         style='width:30%; margin-right:0.5%;'
                                                         :disabled="data.syoriKubun != 3"
                                                         @update="(r) => data.sisyo.name.top = r[0]"></el-increment-search>
                                    <el-input type='text'
                                              style='width:60%;margin-right:2%;'
                                              readonly
                                              :placeholder="'支所'"
                                              :disabled="data.syoriKubun != 3"
                                              v-model="data.sisyo.name.top"></el-input>

                                </div>
                            </div>
                            <div class='row' style="margin-top:2%;">
                                <div class="col-md-12">
                                    <p>プリント区分</p>
                                </div>
                                <div class='col-md-4'>
                                    <el-radio v-model="data.printKubun" label="total" :disabled="data.syoriKubun != 2">合計</el-radio>
                                </div>
                                <div class='col-md-4'>
                                    <el-radio v-model="data.printKubun" label="seisankin" :disabled="data.syoriKubun != 2">精算金</el-radio>
                                </div>
                                <div class='col-md-4'>
                                    <el-radio v-model="data.printKubun" label="box" :disabled="data.syoriKubun != 2">箱代</el-radio>
                                </div>
                            </div>
                            <div class="row" style="margin-top:2%;">
                                <div class='col-md-11'>
                                    <label for='資材代集計回数範囲' class='col-form-label px-1' style='width:100%;'>資材代集計回数範囲</label>
                                    <el-input-number style='width:40%;margin-right:2%;'
                                                     v-model='data.shizaidaiSyukeiNumber.bottom'
                                                     controls-position="right"
                                                     :min="0"
                                                     :max="data.shizaidaiSyukeiNumber.top"
                                                     :disabled="data.syoriKubun != 1"></el-input-number>
                                    <span style='margin-right:2%;'>～</span>
                                    <el-input-number style='width:40%;margin-right:2%;'
                                                     v-model='data.shizaidaiSyukeiNumber.top'
                                                     controls-position="right"
                                                     :min="data.shizaidaiSyukeiNumber.bottom"
                                                     :max="99"
                                                     :disabled="data.syoriKubun != 1"></el-input-number>
                                </div>
                            </div>
                        </div>

                    </div>
                </form>
                <div class='row'>
                    <div class='col-md-12'>
                        <div style='text-align:right;width:100%;'>
                            <el-button style='margin-left:2%;' type='primary' v-on:click="syukei" :disabled="data.syoriKubun != 0">集計実行(F9)</el-button>
                            <el-button style='margin-left:2%;' type='warning' v-on:click="print" :disabled="data.syoriKubun == 0">印刷(F10)</el-button>
                            <el-button style='margin-left:2%;' type='success' v-on:click="preview" :disabled="data.syoriKubun == 0">表示(11)</el-button>
                            <el-button style='margin-left:2%;' type='info' v-on:click="finish">終了(F12)</el-button>
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
    import time from '@/js/status/time.js'
    import ElIncrementSearch from '@/components/IncrementSearch.vue'


    export default {
        name: 'niukeNyuryokuSyoki',
        components: {
            Card, KeyboardEvents, ElIncrementSearch
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
                    syoriKubun: 0,
                    syukeiNumber: {
                        top: 99,
                        bottom: 0
                    },
                    year:null,
                    tax: null,
                    tax2: null,
                    checked: {
                        syukei: {
                            0: true,
                            1: false,
                            2: false,
                            3: false,
                            4: false,
                            5: false,
                            6: false,
                        },
                        jikayou: false,
                        niukeHyou: true,
                        niukeHyouHikae: true
                    },
                    disabled: {
                        syukei: false,
                        print: true,
                    },
                    syouhin: [
 
                    ],
                    seisanHaitouJouken: 0,
                    seisansya: {
                        code: {
                            top: "",
                            bottom: "",
                        },
                        name: {
                            top: "",
                            bottom: "",
                        }
                    },
                    sisyo: {
                        code: {
                            top: "",
                            bottom: "",
                        },
                        name: {
                            top: "",
                            bottom: "",
                        }
                    },
                    printKubun:"",
                    shizaidaiSyukeiNumber: {
                        top: 99,
                        bottom: 0,
                    }

                },
            }
        },
        methods: {
            keyboardEvent(e) {
                if (e.keyCode == config.KEY_CODES.F9) {
                    if (this.data.syoriKubun == 0) {
                        this.syukei()
                    }
                }
                if (e.keyCode == config.KEY_CODES.F10) {
                    if (this.data.syoriKubun != 0) {
                        this.print()
                    }
                }
                if (e.keyCode == config.KEY_CODES.F11) {
                    if (this.data.syoriKubun != 0) {
                        this.preview()
                    }
                }
                if (e.keyCode == config.KEY_CODES.F12) {
                    this.finish()
                }
            },
            syoriKubunChange: function () {
                if (this.data.syoriKubun == 0) {
                    this.data.disabled.syukei = false;
                } else {
                    this.data.disabled.syukei = true;

                }
            },
            syukei: function () {
                
                if (!window.confirm("精算集計を実行しますか？")) {
                    return false;
                }
                alert("精算集計");

            },
            print: function () {

                if (!window.confirm("印刷しますか？")) {
                    return false;
                }

                alert("印刷");
            },
            preview: function () {
                alert("プレビュー");
            },
            finish: function () {
                alert("終了");
            }
        },
        created: function () {

            this.data.year = time.nowJapanYear();

            //※消費税率の取得
            this.data.tax = 0.1;
            this.data.tax2 = 0.08;

            //※商品の取得
            this.data.syouhin = [
                { code: "0", name: "干柿", jikkou: true, tesuryou: 6, uriageseisan: 0.00, suryouseisan: 0.00 },
                { code: "1", name: "あんぽ", jikkou: true, tesuryou: 6, uriageseisan: 0.00, suryouseisan: 0.00 },
                { code: "2", name: "柿ごのみ", jikkou: true, tesuryou: 6, uriageseisan: 0.00, suryouseisan: 0.00 },
                { code: "9", name: "等外", jikkou: true, tesuryou: 6, uriageseisan: 0.00, suryouseisan: 0.00 },
                { code: "8", name: "あんぽP", jikkou: true, tesuryou: 6, uriageseisan: 0.00, suryouseisan: 0.00 },
            ];

            //※商品区分と等級に初期値代入
            this.data.sisyo.code.top = "9";
            this.data.sisyo.code.bottom = "0";
            this.data.sisyo.name.top = "富山";
            this.data.sisyo.name.bottom = "札幌";


            this.data.seisansya.code.top = "9999";
            this.data.seisansya.code.bottom = "0000";
            this.data.seisansya.name.top = "小川巧真";
            this.data.seisansya.name.bottom = "畠中慎一";



        }
       }
</script>
