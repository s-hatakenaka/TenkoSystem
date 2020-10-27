<template>
    <div>
        <keyboard-events v-on:keydown="keyboardEvent"></keyboard-events>
        <el-card v-if="data.pageNumber == 1">
            <div slot='header'>
                <span>出荷単価修正</span>
            </div>
            <div slot='default'>
                <el-form :model="data.firstForm.model" :rules="data.firstForm.validation" ref="firstForm" label-width="120px">
                    <div class='row'>
                        <div class='col-md-3'>
                            <label for='処理区分' class='col-form-label px-1' style='width:100%;'>処理区分</label>
                            <el-form-item label-width="0" prop="syoriKubun">
                                <el-select v-model="data.firstForm.model.syoriKubun">
                                    <el-option :value='1' label="1:単価集計"></el-option>
                                    <el-option :value='2' label="2:単価修正"></el-option>
                                    <el-option :value='3' label="3:作表"></el-option>
                                    <el-option :value='4' label="4:単価集計エラーリスト"></el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                    </div>
                    <div class="row">
                        <div class='col-md-8' style="margin-top:2%;">
                            <!--インクリメントサーチ-->
                            <label for='商品区分' class='col-form-label px-1' style='width:100%;'>商品区分</label>
                            <el-form-item label-width="0" prop="syouhinCode">
                                <el-increment-search v-model="data.firstForm.model.syouhinCode"
                                                     style='width:15%; margin-right:0.5%;'
                                                     :display="[{key:'syohinmei',name:'名前'}]"
                                                     :autoComplete="['syohinmei']"
                                                     :kind="'商品'"
                                                     :required="true"
                                                     :disabled="data.firstForm.model.syoriKubun == 4"
                                                     @update="(r) => data.firstForm.model.syouhinName = r.syohinmei"></el-increment-search>

                                <el-input type='text'
                                          style='width:30%;margin-right:2%;'
                                          v-model="data.firstForm.model.syouhinName"
                                          readonly></el-input>
                            </el-form-item>
                        </div>
                    </div>
                    <div class='row' style="margin-top:2%;">
                        <div class='col-md-6'>
                            <label for='' class='col-form-label px-1' style='width:100%;'>作表範囲(回数)</label>
                            <el-form-item label-width="0" prop="sakuhyouHaniKaisuBottom" style='width:40%;margin-right:2%;display:inline-block;'>
                                <el-input-number style="width:100%;display:block;"
                                                 controls-position="right"
                                                 v-model='data.firstForm.model.sakuhyouHaniKaisuBottom' :disabled="data.firstForm.model.syoriKubun != 3" :min="0" :max="data.firstForm.model.sakuhyouHaniKaisuTop"></el-input-number>
                            </el-form-item>
                            <span style='margin-right:2%;'>～</span>
                            <el-form-item label-width="0" prop="sakuhyouHaniKaisuTop" style='width:40%;margin-right:2%;display:inline-block;'>

                                <el-input-number style="width:100%;display:block;"
                                                 controls-position="right"
                                                 v-model='data.firstForm.model.sakuhyouHaniKaisuTop' :disabled="data.firstForm.model.syoriKubun != 3" :min="data.firstForm.model.sakuhyouHaniKaisuBottom" :max="99"></el-input-number>
                            </el-form-item>
                        </div>
                    </div>
                    <div class='row' style="margin-top:2%;">
                        <div class='col-md-6'>
                            <label for='作表範囲(処理日)' class='col-form-label px-1'>作表範囲(処理日)</label>
                        </div>
                    </div>
                    <div class='row'>
                        <div class='col-md-6'>
                            <label for='抽出開始日' class='col-form-label px-1' style='width:100%;'>抽出開始日</label>
                            <el-form-item label-width="0" prop="sakuhyouHaniDateBottom">
                                <el-input type='date'
                                          v-model="data.firstForm.model.sakuhyouHaniDateBottom" :disabled="data.firstForm.model.syoriKubun != 4" :min="'0001-01-01'" :max="data.firstForm.model.sakuhyouHaniDateTop"></el-input>
                            </el-form-item>
                        </div>
                    </div>
                    <div class='row' style="margin-top:0.5%;">
                        <div class='col-md-6'>
                            <label for='抽出終了日' class='col-form-label px-1' style='width:100%;'>抽出終了日</label>
                            <el-form-item label-width="0" prop="sakuhyouHaniDateTop">
                                <el-input type='date'
                                          v-model="data.firstForm.model.sakuhyouHaniDateTop" :disabled="data.firstForm.model.syoriKubun != 4" :min="data.firstForm.model.sakuhyouHaniDateBottom" :max="'9999-12-31'"></el-input>
                            </el-form-item>
                        </div>
                    </div>

                    <div class='row' style="margin-top:2%;">
                        <div class='col-md-12'>
                            <div style='text-align:right;width:100%;'>
                                <el-button style='margin-left:2%;' type='warning' v-on:click="syukei" :disabled="data.firstForm.model.syoriKubun != 1">集計実行(F9)</el-button>
                                <el-button style='margin-left:2%;' type='danger' v-on:click="print" :disabled="!(data.firstForm.model.syoriKubun == 3 || data.firstForm.model.syoriKubun == 4)">印刷(F10)</el-button>
                                <el-button style='margin-left:2%;' type='success' v-on:click="preview" :disabled="!(data.firstForm.model.syoriKubun == 3 || data.firstForm.model.syoriKubun == 4)">表示(F11)</el-button>
                                <el-button style='margin-left:2%;' type='primary' v-on:click="confirm" :disabled="data.firstForm.model.syoriKubun != 2">確認(F5)</el-button>
                                <el-button style='margin-left:2%;' type='info' v-on:click="finish">終了(F12)</el-button>
                            </div>
                        </div>
                    </div>
                </el-form>
            </div>
        </el-card>
        <el-card v-if="data.pageNumber == 2">
            <div slot='header'>
                <span>単価修正</span>
            </div>
            <div slot='default'>
                <form id="niukeNyuryokuForm" v-focus-first-on-load v-focus-next-on-enter class='vld-parent'>
                    <div class="row">
                        <div class='col-md-3'>
                            <!--インクリメントサーチ-->
                            <label for='商品区分' class='col-form-label px-1' style='width:100%;'>商品区分</label>
                            <el-select style='width:40%; margin-right:0.5%;' v-model="data.firstForm.syouhinCode" readonly>
                                <el-option value='1' label="1"></el-option>
                                <el-option value='9' label="9"></el-option>
                            </el-select>
                            <el-input type='text'
                                      style='width:55%;margin-right:2%;'
                                      v-model="data.firstForm.syouhinName"
                                      readonly></el-input>
                        </div>
                        <div class='col-md-4'>
                            <label for='処理区分' class='col-form-label px-1' style='width:100%;'>処理回数</label>
                            <el-input-number
                                      v-model="data.syoriKaisu"
                                      @change="syoriKaisuChange"
                                      @focus="updateCheck($event.target)"
                                      ></el-input-number>

                       </div>
                    </div>
                    <div class='row' style="margin:2%;white-space:nowrap;overflow-x:scroll;">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>品種</th>
                                    <th>等級</th>
                                    <th v-for="size in data.size" v-bind:key="size.number">{{size.SizeMei}}</th>
                                </tr>
                            </thead>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th></th>
                                    <th v-for="size in data.size" v-bind:key="size.number">{{size.Size}}</th>
                                </tr>
                            </thead>
                            <tbody v-for="hinsyu in data.hinsyu" v-bind:key="hinsyu.number">
                                <tr v-for="(tokyu,tokyu_index) in getTokyuTr()" v-bind:key="tokyu.number">
                                    <td><span v-if="tokyu_index % 2 == 0">{{hinsyu.HinsyuMei}}</span></td>
                                    <td><span v-if="tokyu_index % 2 == 0">{{tokyu.TokyuMei}}</span></td>
                                    <td v-for="size in data.size" v-bind:key="size.number">
                                        <span v-if="tokyu_index % 2 == 0">{{getMeisaiData(hinsyu.Hinsyu,tokyu.Tokyu,size.Size) != null ? getMeisaiData(hinsyu.Hinsyu,tokyu.Tokyu,size.Size).SyukeiTanka : ""}}</span>
                                        <el-input-number v-if="tokyu_index % 2 == 1 && getMeisaiData(hinsyu.Hinsyu,tokyu.Tokyu,size.Size) != null"
                                                         v-model="getMeisaiData(hinsyu.Hinsyu,tokyu.Tokyu,size.Size).Tanka"
                                                         type="text"
                                                         @change="data.updateFlag = 1"
                                                         :precision="2" :step="0.1"
                                                         controls-position="right">
                                        </el-input-number>

                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class='row' style="margin-top:2%;">
                        <div class='col-md-12'>
                            <div style='text-align:right;width:100%;'>
                                <el-button style='margin-left:2%;' type='warning' v-on:click="update">更新(F9)</el-button>
                                <el-button style='margin-left:2%;' type='danger' v-on:click="clear" >画面クリア(F10)</el-button>
                                <el-button style='margin-left:2%;' type='info' v-on:click="finish">終了(F12)</el-button>
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
    import url from '@/js/api_url.js'
    import ElIncrementSearch from '@/components/IncrementSearch.vue'
    export default {
        name: 'niukeMonitorList',
        components: {
            KeyboardEvents, ElIncrementSearch
        },
        data: function () {
            return {
                data: {
                    pageNumber: 1,
                    firstForm: {
                        model: {
                            syoriKubun: 1,
                            syouhinCode: "",
                            syouhinName: "",
                            sakuhyouHaniKaisuTop: 0,
                            sakuhyouHaniKaisuBottom: 99,
                            sakuhyouHanidateTop: "",
                            sakuhyouHanidateBottom: "",
                        },
                        validation: {
                          syoriKubun: [
                                { required: true, message: '処理区分が入力されていません', trigger: 'blur' },
                            ],
                            syouhinCode: [
                                { required: true, message: '商品区分が入力されていません' },
                            ],
                            sakuhyouHaniKaisuTop: [
                                { required: false, message: '作表範囲(回数)が入力されていません' },
                            ],
                            sakuhyouHaniKaisuBottom: [
                                { required: false, message: '作表範囲(回数)が入力されていません' },
                            ],
                            sakuhyouHaniDateTop: [
                                { required: false, message: '抽出終了日が入力されていません' },
                            ],
                            sakuhyouHaniDateBottom: [
                                { required: false, message: '抽出開始日が入力されていません' },
                            ]

                        },
                    },
                    year: null,
                    syoriKaisu: 0,
                    updateFlag: 0,
                    size: [
                    ],
                    tokyu: [

                    ],
                    hinsyu: [

                    ],
                    meisai: [

                    ],
                    meisaiIndex: {

                    },



                },
            }
        },
        methods: {
            keyboardEvent(e) {
                if (e.keyCode == config.KEY_CODES.F5) {
                    if (this.data.firstForm.syoriKubun == 2) {
                        this.data.pageNumber = 2;
                    }
                }
                if (e.keyCode == config.KEY_CODES.F9) {
                    if (this.data.pageNumber == 1) {
                        if (this.data.firstForm.syoriKubun == 1) {
                            this.syukei()
                        }
                    } else if (this.data.pageNumber == 2) {
                        this.update();
                    }
                    
                }
                if (e.keyCode == config.KEY_CODES.F10) {
                    if (this.data.pageNumber == 1) {

                        if (this.data.firstForm.syoriKubun == 3 || this.data.firstForm.syoriKubun == 4) {
                            this.print()
                        }
                    } else if (this.data.pageNumber == 2) {
                        this.clear();
                    }
                 
                }
                if (e.keyCode == config.KEY_CODES.F11) {
                    if (this.data.firstForm.syoriKubun == 3 || this.data.firstForm.syoriKubun == 4) {
                        this.preview()
                    }
                }
                if (e.keyCode == config.KEY_CODES.F12) {
                    this.finish()
                }
            },
           //処理回数の変更、ここでjsonを取ってくる処理
            syoriKaisuChange: function () {


                //axios.get(url.tankaSyusei,
                    //{
                  //      paramProcKbn:1,
                  //      paramNendo: this.data.year,
                  //      paramSyohin: this.data.firstForm.syouhinCode,
                  //      paramKaisu: this.data.syoriKaisu,
                  //      paramHinsyu:this.data.,
                  //      paramTokyu = 1
                  //  })
                  //  .then(response => {
                  //      console.log(response.data);
                  //  })
                  //  .catch(response => console.log(response))

                //※明細の取得
                this.data.meisai = [
                    { Hinsyu: '1', Hinsyumei: "三社", Tokyu: "1", Tokyumei: "上", Size: "1", Sizemei: "5L", Irisu: 5, Tanka: 100.2, SyukeiTanka: 1000 },
                    { Hinsyu: '1', Hinsyumei: "三社", Tokyu: "1", Tokyumei: "上", Size: "2", Sizemei: "4L", Irisu: 5, Tanka: 100.2, SyukeiTanka: 1000 },
                    { Hinsyu: '1', Hinsyumei: "三社", Tokyu: "1", Tokyumei: "上", Size: "3", Sizemei: "4L", Irisu: 5, Tanka: 100.2, SyukeiTanka: 1000 },
                    { Hinsyu: '1', Hinsyumei: "三社", Tokyu: "1", Tokyumei: "上", Size: "4", Sizemei: "4L", Irisu: 5, Tanka: 100.2, SyukeiTanka: 1000 },
                    { Hinsyu: '1', Hinsyumei: "三社", Tokyu: "1", Tokyumei: "上", Size: "5", Sizemei: "4L", Irisu: 5, Tanka: 100.2, SyukeiTanka: 1000 },
                    { Hinsyu: '1', Hinsyumei: "三社", Tokyu: "1", Tokyumei: "上", Size: "6", Sizemei: "4L", Irisu: 5, Tanka: 100.2, SyukeiTanka: 1000 },
                    { Hinsyu: '1', Hinsyumei: "三社", Tokyu: "2", Tokyumei: "上", Size: "2", Sizemei: "4L", Irisu: 5, Tanka: 100.2, SyukeiTanka: 1000 },
                    { Hinsyu: '1', Hinsyumei: "三社", Tokyu: "2", Tokyumei: "上", Size: "3", Sizemei: "4L", Irisu: 5, Tanka: 100.2, SyukeiTanka: 1000 },
                    { Hinsyu: '1', Hinsyumei: "三社", Tokyu: "2", Tokyumei: "上", Size: "4", Sizemei: "4L", Irisu: 5, Tanka: 100.2, SyukeiTanka: 1000 },
                    { Hinsyu: '1', Hinsyumei: "三社", Tokyu: "2", Tokyumei: "上", Size: "5", Sizemei: "4L", Irisu: 5, Tanka: 100.2, SyukeiTanka: 1000 },
                    { Hinsyu: '1', Hinsyumei: "三社", Tokyu: "2", Tokyumei: "上", Size: "6", Sizemei: "4L", Irisu: 5, Tanka: 100.2, SyukeiTanka: 1000 },
                    { Hinsyu: '1', Hinsyumei: "三社", Tokyu: "2", Tokyumei: "上", Size: "7", Sizemei: "5L", Irisu: 5, Tanka: 100.2, SyukeiTanka: 1000 },
                    { Hinsyu: '2', Hinsyumei: "三社", Tokyu: "1", Tokyumei: "上", Size: "1", Sizemei: "5L", Irisu: 5, Tanka: 100.2, SyukeiTanka: 1000 },
                    { Hinsyu: '2', Hinsyumei: "三社", Tokyu: "1", Tokyumei: "上", Size: "2", Sizemei: "4L", Irisu: 5, Tanka: 100.2, SyukeiTanka: 1000 },
                    { Hinsyu: '2', Hinsyumei: "三社", Tokyu: "1", Tokyumei: "上", Size: "3", Sizemei: "4L", Irisu: 5, Tanka: 100.2, SyukeiTanka: 1000 },
                    { Hinsyu: '2', Hinsyumei: "三社", Tokyu: "1", Tokyumei: "上", Size: "4", Sizemei: "4L", Irisu: 5, Tanka: 100.2, SyukeiTanka: 1000 },
                    { Hinsyu: '2', Hinsyumei: "三社", Tokyu: "1", Tokyumei: "上", Size: "5", Sizemei: "4L", Irisu: 5, Tanka: 100.2, SyukeiTanka: 1000 },
                    { Hinsyu: '2', Hinsyumei: "三社", Tokyu: "1", Tokyumei: "上", Size: "6", Sizemei: "4L", Irisu: 5, Tanka: 100.2, SyukeiTanka: 1000 },
                    { Hinsyu: '2', Hinsyumei: "三社", Tokyu: "2", Tokyumei: "上", Size: "2", Sizemei: "4L", Irisu: 5, Tanka: 100.2, SyukeiTanka: 1000 },
                    { Hinsyu: '2', Hinsyumei: "三社", Tokyu: "2", Tokyumei: "上", Size: "3", Sizemei: "4L", Irisu: 5, Tanka: 100.2, SyukeiTanka: 1000 },
                    { Hinsyu: '2', Hinsyumei: "三社", Tokyu: "2", Tokyumei: "上", Size: "4", Sizemei: "4L", Irisu: 5, Tanka: 100.2, SyukeiTanka: 1000 },
                    { Hinsyu: '2', Hinsyumei: "三社", Tokyu: "2", Tokyumei: "上", Size: "5", Sizemei: "4L", Irisu: 5, Tanka: 100.2, SyukeiTanka: 1000 },
                    { Hinsyu: '2', Hinsyumei: "三社", Tokyu: "2", Tokyumei: "上", Size: "6", Sizemei: "4L", Irisu: 5, Tanka: 100.2, SyukeiTanka: 1000 },
                    { Hinsyu: '2', Hinsyumei: "三社", Tokyu: "2", Tokyumei: "上", Size: "7", Sizemei: "5L", Irisu: 5, Tanka: 100.2, SyukeiTanka: 1000 },

                ];
                this.createmeisaiIndex();

                //updateFlagをもとに戻す
                this.data.updateFlag = 0;
            },
            createmeisaiIndex: function () {
               
                for (var i in this.data.hinsyu) {
                    var hinsyuCode = this.data.hinsyu[i].Hinsyu

                    this.data.meisaiIndex[hinsyuCode] = {};

                    for (var k in this.data.tokyu) {

                        var tokyuCode = this.data.tokyu[k].Tokyu
                        this.data.meisaiIndex[hinsyuCode][tokyuCode] = {};

                        for (var l in this.data.size) {
                            var sizeCode = this.data.size[l].Size;
                            this.data.meisaiIndex[hinsyuCode][tokyuCode][sizeCode] = null;

                        }

                    }
                }

                for (var i = 0; i < this.data.meisai.length; i++) {

                    var meisai = this.data.meisai[i];

                    this.data.meisaiIndex[meisai.Hinsyu][meisai.Tokyu][meisai.Size] = i;
                        
                    

                }

            },
            getTokyuTr: function () {
                var result = [];
                for (var i in this.data.tokyu) {

                    result.push(this.data.tokyu[i]);
                    result.push(this.data.tokyu[i]);
                }
                return result;
            },
            getMeisaiData: function (hinsyu, tokyu, size) {

                var meisaiIndex = this.data.meisaiIndex[hinsyu][tokyu][size];
                if (meisaiIndex != null) {
                    return this.data.meisai[meisaiIndex];
                } else {
                    return null;
                }

                
            },
            updateCheck: function (input) {

                if (this.data.updateFlag == 1) {

                    if (!window.confirm("変更が保存されていませんがよろしいですか？")) {
                        input.blur();
                    }
                }
            },
            syukei: function () {
                this.$refs['firstForm'].validate((valid) => {

                    if (valid) {
                        if (!window.confirm("単価集計を実行しますか？")) {
                            return false;
                        }


                        var postArray = {
                                "paramProcKbn": 1,
                               "Computername":"",
                                "InputTanto": this.$store.state.login.userCode,
                                "InputTantoNm": this.$store.state.login.userName,
                                "PrintFlg": false,
                                "Nendo": this.data.year,
                                "SyohinKbn": this.data.syouhinCode,
                                "SyohinNm": this.data.syouhinName,
                                "Henkobi": "2020/09/18",
                                "KaisiKaisu": "",
                                "SyuryoKaisu": "",
                                "KaisiY": "",
                                "KaisiM": "",
                                "KaisiD": "",
                                "SyuryoY": "",
                                "SyuryoM": "",
                                "SyuryoD": ""
                        }

                        axios.post(url.tankaSyusei, postArray)
                            .then(response => {
                                console.log(response.data);
                            })
                            .catch(response => console.log(response))

                        alert("集計処理");

                    } 
                });


  
            },
            afterCreatedData: function () {

                if (this.data.size.length != 0 && this.data.hinsyu.length != 0 && this.data.tokyu.length != 0) {

                    this.createmeisaiIndex();

                    console.log(this.data.meisaiIndex);

                }


            },
            confirm: function () {
                this.$refs['firstForm'].validate((valid) => {

                    if (valid) {

                        this.data.pageNumber = 2;

                    } 
                });



            },
            print: function () {

                this.$refs['firstForm'].validate((valid) => {

                    if (valid) {
                        if (!window.confirm("印刷しますか？")) {
                            return false;
                        }


                        var postArray;
                            if (this.data.firstForm.model.syoriKubun == 3) {
                                
                                 postArray = {
                                     "paramProcKbn": 2,
                                     "Computername": "",
                                     "InputTanto": this.$store.state.login.userCode,
                                     "InputTantoNm": this.$store.state.login.userName,
                                     "PrintFlg": true,
                                     "Nendo": this.data.year,
                                     "SyohinKbn": this.data.firstForm.model.syouhinCode,
                                     "SyohinNm": this.data.firstForm.model.syouhinName,
                                     "Henkobi": "2020/09/18",
                                     "KaisiKaisu": this.data.firstForm.model.sakuhyouHaniKaisuBottom,
                                     "SyuryoKaisu": this.data.firstForm.model.sakuhyouHaniKaisuTop,
                                     "KaisiY": "",
                                     "KaisiM": "",
                                     "KaisiD": "",
                                     "SyuryoY": "",
                                     "SyuryoM": "",
                                     "SyuryoD": ""

                                }


                            } else if (this.data.firstForm.model.syoriKubun == 4) {

                                var startDate = this.data.firstForm.model.sakuhyouHaniDateBottom.split("-");

                                var endDate = this.data.firstForm.model.sakuhyouHaniDateTop.split("-");

                                 postArray = {
                                     "paramProcKbn": 3,
                                     "Computername": "",
                                     "InputTanto": this.$store.state.login.userCode,
                                     "InputTantoNm": this.$store.state.login.userName,
                                     "PrintFlg": true,
                                     "Nendo": this.data.year,
                                     "SyohinKbn": this.data.firstForm.model.syouhinCode,
                                     "SyohinNm": this.data.firstForm.model.syouhinName,
                                     "Henkobi": "2020/09/18",
                                     "KaisiKaisu": "",
                                     "SyuryoKaisu": "",
                                     "KaisiY": startDate[0],
                                     "KaisiM": startDate[1],
                                     "KaisiD": startDate[2],
                                     "SyuryoY": endDate[0],
                                     "SyuryoM": endDate[1],
                                     "SyuryoD": endDate[2]

                                 }
                     
                            }

                            

                        console.log(postArray);

                        axios.post(url.tankaSyusei, postArray)
                            .then(response => {
                                console.log(response.data);
                            })
                            .catch(response => console.log(response))

                        alert("印刷");
                    } 
                });

            },
            preview: function () {
                this.$refs['firstForm'].validate((valid) => {

                    if (valid) {
                                                var postArray;
                            if (this.data.firstForm.model.syoriKubun == 3) {
                                
                                 postArray = {
                                     "paramProcKbn": 2,
                                     "Computername": "",
                                     "InputTanto": this.$store.state.login.userCode,
                                     "InputTantoNm": this.$store.state.login.userName,
                                     "PrintFlg": true,
                                     "Nendo": this.data.year,
                                     "SyohinKbn": this.data.firstForm.model.syouhinCode,
                                     "SyohinNm": this.data.firstForm.model.syouhinName,
                                     "Henkobi": "2020/09/18",
                                     "KaisiKaisu": this.data.firstForm.model.sakuhyouHaniKaisuBottom,
                                     "SyuryoKaisu": this.data.firstForm.model.sakuhyouHaniKaisuTop,
                                     "KaisiY": "",
                                     "KaisiM": "",
                                     "KaisiD": "",
                                     "SyuryoY": "",
                                     "SyuryoM": "",
                                     "SyuryoD": ""

                                }


                            } else if (this.data.firstForm.model.syoriKubun == 4) {

                                var startDate = this.data.firstForm.model.sakuhyouHaniDateBottom.split("-");

                                var endDate = this.data.firstForm.model.sakuhyouHaniDateTop.split("-");

                                 postArray = {
                                     "paramProcKbn": 3,
                                     "Computername": "",
                                     "InputTanto": this.$store.state.login.userCode,
                                     "InputTantoNm": this.$store.state.login.userName,
                                     "PrintFlg": true,
                                     "Nendo": this.data.year,
                                     "SyohinKbn": this.data.firstForm.model.syouhinCode,
                                     "SyohinNm": this.data.firstForm.model.syouhinName,
                                     "Henkobi": "2020/09/18",
                                     "KaisiKaisu": "",
                                     "SyuryoKaisu": "",
                                     "KaisiY": startDate[0],
                                     "KaisiM": startDate[1],
                                     "KaisiD": startDate[2],
                                     "SyuryoY": endDate[0],
                                     "SyuryoM": endDate[1],
                                     "SyuryoD": endDate[2]

                                 }
                     
                            }

                            

                        axios.post(url.tankaSyusei, postArray)
                            .then(response => {
                                console.log(response.data);
                            })
                            .catch(response => console.log(response))


                            alert("プレビュー");
                    } 
                });
            },
            clear: function () {

                if (this.data.updateFlag == 1) {

                    if (!window.confirm("変更が保存されていませんがよろしいですか？")) {
                        return false;
                    }
                }

                this.data.meisai = [];


            },
            update: function () {

                if (!window.confirm("更新しますか？")) {
                    return false;
                }
                alert("アップデート");

            },
            finish: function () {
                alert("終了");
            },
        
        },
        watch: {
            "data.firstForm.model.syoriKubun": function (new_value) {
                
                if (new_value == 4) {
                    this.data.firstForm.validation.syouhinCode[0].required = false;
                } else {
                    this.data.firstForm.validation.syouhinCode[0].required = true;
                }

                if (new_value == 3) {
                    this.data.firstForm.validation.sakuhyouHaniKaisuBottom[0].required = true;
                    this.data.firstForm.validation.sakuhyouHaniKaisuTop[0].required = true;
                } else {
                    this.data.firstForm.validation.sakuhyouHaniKaisuBottom[0].required = false;
                    this.data.firstForm.validation.sakuhyouHaniKaisuTop[0].required = false;
                }


               if (new_value == 4) {
                    this.data.firstForm.validation.sakuhyouHaniDateBottom[0].required = true;
                    this.data.firstForm.validation.sakuhyouHaniDateTop[0].required = true;
                } else {
                    this.data.firstForm.validation.sakuhyouHaniDateBottom[0].required = false;
                    this.data.firstForm.validation.sakuhyouHaniDateTop[0].required = false;
                }

            },
        },
        created: function () {

            //※axiosでとってくる
            this.data.year = 2020;

            axios.get(url.meisyoMaster)
                .then(response => {
                    for (var i = 0; i < response.data.length; i++) {
                        if (response.data[i].meisyoCD == "3") {
                            this.data.size.push({ SizeMei: response.data[i].meisyo, Size: response.data[i].atai });

                        }
                    }


                    this.afterCreatedData();

                })
                .catch(response => console.log(response))

            axios.get(url.meisyoMaster)
                .then(response => {
                    for (var i = 0; i < response.data.length; i++) {
                        if (response.data[i].meisyoCD == "2") {
                            this.data.hinsyu.push({ HinsyuMei: response.data[i].meisyo, Hinsyu: response.data[i].atai });

                        }
                    }

                    this.afterCreatedData();

                })
                .catch(response => console.log(response))

            axios.get(url.meisyoMaster)
                .then(response => {
                    for (var i = 0; i < response.data.length; i++) {
                        if (response.data[i].meisyoCD == "4") {
                            this.data.tokyu.push({ TokyuMei: response.data[i].meisyo, Tokyu: response.data[i].atai });

                        }
                    }

                    this.afterCreatedData();

                })
                .catch(response => console.log(response))

        }
    }
</script>
<style>

    .blue input{
        color:blue
    }
    .pink input{
        color:magenta
    }

</style>