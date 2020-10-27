<template>
    <div>

        <keyboard-events v-on:keydown="keyboardEvent"></keyboard-events>
        <el-dialog title="伝票検索"
                   :visible.sync="data.dialogVisible"
                   width="90%">
            <div class="row">
                <div class='col-md-8'>
                    <label for='請求先CD' class='col-form-label px-1' style='width:100%;'>請求先CD</label>
                    <el-increment-search v-model="data.search.syouhinCode"
                                         :display="[{key:'syohinmei',name:'名前'}]"
                                         :autoComplete="['syohinmei']"
                                         :kind="'市場'"
                                         :required="true"
                                         @update="(r) => data.search.syouhinName = r.syohinmei"></el-increment-search>
                    <el-input type='text'
                              style='width:50%;'
                              readonly
                              :placeholder="'請求先名'"
                              v-model="data.search.syouhinName"></el-input>
                </div>
            </div>
            <div class="row">
                <div class='col-md-4'>
                    <label for='入金日付' class='col-form-label px-1' style='width:100%;'>入金日付</label>
                    <el-input type='date'
                              style='margin-right:2%;'
                              :max="data.search.dateEnd"
                              v-model='data.search.nyukinDate'></el-input>
                </div>
            </div>
            <div class="row">
                <div class='col-md-12'>
                    <label for='備考' class='col-form-label px-1' style='width:100%;'>備考</label>
                    <el-input type="textarea"
                              :rows="2"
                              v-model="data.bikou">
                    </el-input>
                </div>
            </div>
            <div class="row" style="margin-top:2%;">
                <div class="col-12" style="text-align:right;">
                    <el-button @click="data.dialogVisible = false">終了</el-button>
                    <el-button type="primary" v-on:click="nyukinSearch">検索</el-button>
                </div>
            </div>
            <el-card style="margin-top:1%;">
                <div slot='header'>
                    <span>検索結果</span>
                </div>
                <div slot='default' class="row">
                    <div class="col-12">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th width="4%"></th>
                                    <th>入金番号</th>
                                    <th>入金日</th>
                                    <th>顧客名</th>
                                    <th>金額</th>
                                    <th>備考</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(search_result, index) in data.search.result" v-bind:key="search_result.number" v-bind:class="data.search.selectedIndex == index && 'search-selected'" v-on:click="searchSelectedTr(index)">
                                    <td><el-button type="success" name="name" v-on:click="searchResultSelect(search_result)">選択</el-button></td>
                                    <td>{{search_result.reception_number}}</td>
                                    <td>{{search_result.date}}</td>
                                    <td>{{getShijoName(search_result.shijo)}}</td>
                                    <td>{{search_result.kingaku}}</td>
                                    <td>{{search_result.bikou}}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </el-card>
        </el-dialog>
        <el-card>
            <div slot='header'>
                <span>入金入力</span>
            </div>
            <div slot='default'>
                <el-form :model="data.nyukinModel" ref="nyukinForm" label-width="120px">
                    <div class='row'>
                        <div class='col-md-12'>

                            <el-card>
                                <template slot='default'>
                                    <div class='row'>
                                        <div class='col-md-4'>
                                            <label for='処理区分' class='col-form-label px-1' style='width:100%;'>処理区分</label>
                                            <el-select v-model="data.syoriKubun" style="width: 100%;" :disabled="data.disabled.nyukinConfirm">
                                                <el-option :value='0' :label="'0:新規'"></el-option>
                                                <el-option :value='1' :label="'1:修正'"></el-option>
                                                <el-option :value='2' :label="'2:削除'"></el-option>
                                            </el-select>
                                        </div>
                                        <div class='col-md-4'>
                                            <label for='伝票番号' class='col-form-label px-1' style='width:100%;'>伝票番号</label>
                                            <el-input id="receptionNumber"
                                                      type='text'
                                                      style='width:60%; margin-right:2%;'
                                                      v-model="data.receptionNumber"
                                                      :disabled="data.syoriKubun == 0 || data.disabled.nyukinConfirm"></el-input>
                                            <el-button id="receptionNumberSearch"
                                                       type='danger'
                                                       icon="el-icon-search"
                                                       style='width:20%;display:inline;'
                                                       @click="data.dialogVisible = true"
                                                       :disabled="data.syoriKubun == 0 || data.disabled.nyukinConfirm">検索</el-button>

                                        </div>

                                    </div>
                                    <div class="row" style="margin-top:2%;">
                                        <div class="col-md-6">
                                            <label for='請求先CD' class='col-form-label px-1' style='width:100%;'>請求先CD</label>
                                            <el-form-item label-width="0"
                                                          prop="shijoCode"
                                                          :rules="{
                                                              required: false, message: '請求先CDが選択されていません', trigger: 'blur'
                                                              }"
                                                          style="margin:0;">
                                                <!--※とりあえずrequired:false;-->
                                                <el-increment-search v-model="data.nyukinModel.shijoCode"
                                                                     :display="[{key:'syohinmei',name:'名前'}]"
                                                                     :autoComplete="['syohinmei']"
                                                                     :kind="'市場'"
                                                                     :required="true"
                                                                     @update="(r) => data.nyukinModel.shijoName = r.shijomei"></el-increment-search>
                                                <el-input type='text'
                                                          style='width:50%;'
                                                          readonly
                                                          :placeholder="'請求先名'"
                                                          v-model="data.nyukinModel.shijoName"></el-input>
                                            </el-form-item>
                                        </div>
                                    </div>
                                    <div class='row' style="margin-top:2%;">
                                        <div class='col-md-6'>
                                            <label for='入金日付' class='col-form-label px-1'>入金日付</label>
                                            <el-form-item label-width="0"
                                                          prop="nyukinDate"
                                                          :rules="{
                                                              required: true, message: '入金日付が入力されていません', trigger: 'blur'
                                                              }"
                                                          style="margin:0;">
                                                <el-input id="nyukinDate"
                                                          type="date"
                                                          v-model="data.nyukinModel.nyukinDate" v-bind:disabled="data.disabled.nyukinConfirm"></el-input>
                                            </el-form-item>
                                        </div>

                                    </div>

                                    <div class="row">
                                        <div class='col-md-8' style="margin-top:2%;">
                                            <label for='備考' class='col-form-label px-1' style='width:100%;'>備考</label>
                                            <el-input type="textarea"
                                                      :rows="4"
                                                      v-model="data.nyukinModel.bikou"
                                                      :disabled="data.disabled.nyukinConfirm">
                                            </el-input>
                                        </div>
                                        <div class='col-md-4'>
                                            <label for='確認' class='col-form-label px-1'>確認</label>
                                            <el-button type='primary'
                                                       style="display:block;"
                                                       :disabled="data.disabled.nyukinConfirm"
                                                       v-on:click="nyukinConfirm">確認</el-button>
                                        </div>
                                    </div>
                                </template>
                            </el-card>
                        </div>
                    </div>
                    <el-card style="margin-top:3%;">
                        <div slot='header'>
                            <span>明細</span>
                        </div>
                        <div class="row">
                            <div class="col-8">
                                <label for='入金' class='col-form-label px-1' style='width:100%;'>入金</label>
                                <table class="table">
                                    <thead>
                                        <tr>
                                            <th width="4%"></th>
                                            <th>削除</th>
                                            <th>入金区分</th>
                                            <th>入金区分名</th>
                                            <th>金額</th>
                                            <th>備考</th>
                                            <th>キャンセル</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(meisai_data, index) in data.nyukinModel.meisai" v-bind:key="meisai_data.number" style="margin-bottom:10px;">
                                            <td>{{index}}</td>
                                            <td><el-button type="primary" name="name" v-on:click="meisaiRemove(index)" v-bind:disabled="data.syoriKubun == 3">削除</el-button></td>
                                            <td>
                                                <el-form-item label-width="0"
                                                              :prop="'meisai[' + index + '].nyukinkubunCode'"
                                                              :rules="{
                                                              required: true, message: '入金区分が入力されていません', trigger: 'blur'
                                                              }"
                                                              style="margin:0;">
                                                    <el-increment-search v-model="meisai_data.nyukinkubunCode"
                                                                         style='width:100%;'
                                                                         :display="[{key:'nyukinkubunmei',name:'名前'}]"
                                                                         :autoComplete="['nyukinkubunmei']"
                                                                         :kind="'入金'"
                                                                         :required="true"
                                                                         :disabled="data.syoriKubun == 2 || data.syoriKubun == 3"
                                                                         @change="changeMeisaiData(index)"
                                                                         @update=""></el-increment-search>
                                                </el-form-item>
                                            </td>
                                            <td>
                                                <el-input type='text'
                                                          style='width:100%;'
                                                          readonly
                                                          :placeholder="'入金区分名'"
                                                          :disabled="data.syoriKubun == 2 || data.syoriKubun == 3"
                                                          @change="changeMeisaiData(index)"
                                                          v-model="meisai_data.nyukinkubunName"></el-input>
                                            </td>
                                            <td>
                                                <el-form-item label-width="0"
                                                              :prop="'meisai[' + index + '].kingaku'"
                                                              :rules="{
                                                              required: true, message: '金額が入力されていません', trigger: 'blur'
                                                              }"
                                                              style="margin:0;">

                                                    <el-input-number name="name" v-model="meisai_data.kingaku" :disabled="data.syoriKubun == 2 || data.syoriKubun == 3" @change="changeMeisaiData(index)"></el-input-number>
                                                </el-form-item>
                                            </td>
                                            <td>
                                                <el-input name="name" v-model="meisai_data.bikou" :disabled="data.syoriKubun == 2 || data.syoriKubun == 3" @change="changeMeisaiData(index)"></el-input>
                                            </td>

                                            <td><el-button type="warning" name="name" v-on:click="meisaiReturn(meisai_data.row,index)" :disabled="data.syoriKubun == 2 || data.syoriKubun == 3">キャンセル</el-button></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div class="col-4">
                                <label for='売上' class='col-form-label px-1' style='width:100%;'>売上</label>
                                <table class="table">
                                    <thead>
                                        <tr>
                                            <th width="4%"></th>
                                            <th>削除</th>
                                            <th>消込F</th>
                                            <th>伝票番号</th>
                                            <th>出荷日付</th>
                                            <th>金額</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(meisai_data, index) in data.nyukinModel.uriage" v-bind:key="meisai_data.number" style="margin-bottom:10px;">
                                            <td>{{index}}</td>
                                            <td><el-button type="primary" name="name" v-on:click="meisaiRemove(index)" v-bind:disabled="data.syoriKubun == 3">削除</el-button></td>
                                            <td>
                                                <el-checkbox v-model="meisai_data.keshikomiFlag" :disabled="data.syoriKubun == 2 || data.syoriKubun == 3"></el-checkbox>
                                            </td>
                                            <td>
                                                {{meisai_data.reception_number}}
                                            </td>
                                            <td>
                                                {{meisai_data.syukkaDate}}
                                            </td>
                                            <td>
                                                {{meisai_data.kingaku}}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div>

                            <div style='text-align:right;width:100%;'>
                                <el-button id="updateButton" type='success' v-bind:disabled="!data.disabled.nyukinConfirm || data.syoriKubun == 3" v-on:click="update">{{data.updateButton}}(F9)</el-button>
                                <el-button style='margin-left:2%;' type='warning' v-on:click="init">画面クリア(F10)</el-button>
                                <el-button style='margin-left:2%;' type='primary' v-on:click="finish">終了(F12)</el-button>
                            </div>
                        </div>
                    </el-card>
                </el-form>
            </div>
        </el-card>

    </div>
</template>

<script>
    // @ is an alias to /src
    import KeyboardEvents from '@/components/KeyboardEvents.vue'
    import config from '@/config.js'
    import validation from '@/js/status/validation.js'
    import ElIncrementSearch from '@/components/IncrementSearch.vue'
    import time from '@/js/status/time.js'


    export default {
        name: 'nyukinNyuryoku',
        components: {
            KeyboardEvents, ElIncrementSearch
        },
        data: function () {
            return {
                data: {
                    syoriKubun: 0,
                    nyukinDate: "",
                    search: {
                        nyukinDate: "",
                        syouhinCode: "",
                        syouhinName: "",
                        bikou: "",
                        result: [
                        ],
                        selectedIndex: null,
                    },
                    //更新ボタンの文字
                    updateButton: "更新",
                    disabled: {
                        nyukinConfirm: false,
                    },
                    shijoData: [],
                    dialogVisible: false,
                    receptionNumber: "",
                    nyukinModel: {
                        meisai: [],
                        uriage: [],
                        nyukinDate: "",
                        shijoCode: "",
                        shijoName:"",
                        bikou: "",
                    },

                },
            }
        },
        methods: {
            keyboardEvent(e) {
                if (e.keyCode == config.KEY_CODES.F4) {

                    if (!this.data.disabled.nyukinConfirm && this.data.syoriKubun != 0) {
                        this.data.dialogVisible = true;
                    }

                }

                if (e.keyCode == config.KEY_CODES.F9) {

                    this.update()

                }
                if (e.keyCode == config.KEY_CODES.F10) {
                    this.init()
                }
                if (e.keyCode == config.KEY_CODES.F12) {
                    this.finish()
                }
            },
            createMeisaiData: function (nyukinkubunCode, nyukinkubunName, kingaku, bikou, row) {

                return {
                    nyukinkubunCode: nyukinkubunCode,
                    nyukinkubunName: nyukinkubunName,
                    kingaku: kingaku,
                    bikou: bikou,
                    row: row,
                };

            },
            addMeisai: function (nyukinkubunCode, nyukinkubunName, kingaku, bikou, row) {

                var data = this.createMeisaiData(nyukinkubunCode, nyukinkubunName, kingaku, bikou, row);

                this.data.nyukinModel.meisai.push(data);


            },
            createUriageData: function (keshikomiFlag, reception_number, syukkaDate, kingaku, row) {

                return {
                    keshikomiFlag: keshikomiFlag,
                    reception_number: reception_number,
                    syukkaDate: syukkaDate,
                    kingaku: kingaku,
                    row: row,
                };

            },
            addUriage: function (keshikomiFlag, reception_number, syukkaDate, kingaku, row) {

                var data = this.createUriageData(keshikomiFlag, reception_number, syukkaDate, kingaku, row);

                this.data.nyukinModel.uriage.push(data);


            },
            createSearchResultData: function (reception_number, date, shijo, kingaku, bikou) {

                return {
                    reception_number: reception_number,
                    date: date,
                    shijo: shijo,
                    kingaku: kingaku,
                    bikou: bikou,
                };

            },
            addSearchResult: function (reception_number, date, shijo, kingaku, bikou) {

                var data = this.createSearchResultData(reception_number, date, shijo, kingaku, bikou);

                this.data.search.result(data);


            },
            nyukinConfirm: function () {


                this.$refs['nyukinForm'].validate((valid) => {
                    if (valid) {



                        var select_value = this.data.syoriKubun;

                        if (select_value == 0) {
                            //新規の時


                            //更新ボタンの中身編集
                            this.data.updateButton = "新規"

                            this.addMeisai("", "", 0, "", this.data.nyukinModel.meisai.length);

                            //※axiosから取ってくる
                            this.addUriage(false, "10000", "2020-08-10", 0, this.data.nyukinModel.uriage.length);


                        } else {

                            if (this.data.receptionNumber == "") {
                                alert("受付番号を検索してください");
                                return false;
                            }



                            //※ここでaxiosで荷受け番号をもとにT荷受けからデータを取ってくる

                            //検索で選択したデータを明細に追加する。とりあえずは適当なデータを明細に入れるので、後にdbから取ってくる
                            //明細の行を初期化
                            this.data.nyukinModel.meisai = [];
                            this.data.nyukinModel.uriage = [];

                            for (var i = 0; i < 4; i++) {
                                var sample_meisai = this.createMeisaiData("", "", i * 100, "", this.data.nyukinModel.meisai.length);

                                this.data.nyukinModel.meisai.push(sample_meisai);

                                //※axiosから取ってくる
                                this.addUriage(false, "10000", "2020-08-10", i * 100, this.data.nyukinModel.uriage.length);
                            }

                            this.addMeisai("", "", 0, "", this.data.nyukinModel.meisai.length);

                            if (select_value == 2) {
                                //更新ボタンの中身編集
                                this.data.updateButton = "削除"

                            }
                        }

                        this.data.disabled.nyukinConfirm = true;

                        console.log(this.data.nyukinModel.uriage);




                    } else {
                        return false;
                    }
                });



            },
            meisaiRemove: function (index) {

                if (this.data.nyukinModel.meisai.length > 1) {

                    //明細の削除
                    this.data.nyukinModel.meisai.splice(index, 1);

                }
            },
            meisaiReturn: function (row,index) {


                if (this.data.syoriKubun == 0) {

                    var meisai = this.data.nyukinModel.meisai[index];

                    console.log(row, meisai);

                    meisai.nyukinkubunCode = "";
                    meisai.nyukinkubunName = "";
                    meisai.kingaku = "";
                    meisai.bikou = "";


                } else if (this.data.syoriKubun == 1) {

                    //※処理区分が1の時axiosでとってきて戻す処理

                }


            },
            changeMeisaiData: function (index) {

                console.log(index);
                if (index == this.data.nyukinModel.meisai.length - 1) {

                    this.addMeisai("", "", 0, "", this.data.nyukinModel.meisai.length);
                }

            },
            nyukinSearch: function () {


                //検索を更新するときはresultを初期化
                this.data.search.result = [];


                //※ここでaxiosで検索データを取ってくる
                //とりあえずのデータ、サーバーとつないだらここはajaxx
                var sample_data = this.createSearchResultData("101010", "2020-10-10", 2, 1000, "あああああ");


                for (var i = 0; i < 4; i++) {

                    this.data.search.result.push(sample_data);

                }

            },
            getShijoName: function (code) {

                var result = "";

                //※ここでaxiosでデータを取ってくる
                for (var i = 0; i < this.data.shijoData.length; i++) {

                    if (this.data.shijoData[i].shijoCD == code) {

                        result = this.data.shijoData[i].shijomei;
                    }
                }

                return result;
            },
            //クリックした検索結果を青くする
            searchSelectedTr: function (index) {

                this.data.search.selectedIndex = index;
            },
            searchResultSelect(search_result) {

                this.data.receptionNumber = search_result.reception_number;
                //モーダルを閉じる
                this.data.dialogVisible = false;


            },
            init: function () {
                //初期化
                this.data.nyukinModel.meisai = [];
                this.data.nyukinModel.uriage = [];
                this.data.search.result = [];
                this.data.nyukinModel.nyukinDate = "";
                this.data.nyukinModel.shijoCode = "";
                this.data.nyukinModel.shijoName = "";
                this.data.receptionNumber = "";
                this.data.syoriKubun = 0;

                this.data.disabled.nyukinConfirm = false;



            },
            update: function () {

                var message;
                if (this.data.syoriKubun == 0) {
                    message = "登録しますか？";
                } else if (this.data.syoriKubun == 1) {
                    message = "更新しますか？";
                } else if (this.data.syoriKubun == 2) {
                    message = "削除しますか？";
                }

                if (this.data.syoriKubun == 0 || this.data.syoriKubun == 1) {

                    this.$refs['nyukinForm'].validate((valid) => {
                        if (valid) {

                            if (window.confirm(message)) {
                                alert("実行");
                            }

                        } else {
                            return false;
                        }
                    });


                } else {

                    if (window.confirm(message)) {
                        alert("実行");
                    }


                }



            },
            finish: function () {
                alert("終了");
            },

        },
        created: function () {


            //※axiosでとってくる
            this.data.shijoData = [
                { shijoCD: "0", shijomei: "高岡" },
                { shijoCD: "1", shijomei: "富山" },
                { shijoCD: "2", shijomei: "丸果" },
                { shijoCD: "3", shijomei: "福井" },
            ]
            this.data.nyukinModel.nyukinDate = time.nowJapanDateInput();

        },
        mounted: function () {



        },
        watch: {


        }

    }
</script>

<style scoped>
    .search-selected {
        background-color: blue;
        color: white;
    }
</style>