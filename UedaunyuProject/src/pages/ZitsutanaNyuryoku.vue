<template>
    <div>

        <keyboard-events v-on:keydown="keyboardEvent"></keyboard-events>
        <el-dialog title="伝票検索"
                   :visible.sync="data.dialogVisible"
                   width="90%">
            <div class="row">
                <div class='col-md-4'>
                    <label for='荷受日付' class='col-form-label px-1' style='width:100%;'>実棚日付</label>
                    <el-input type='date'
                              style='margin-right:2%;'
                              :max="data.search.dateEnd"
                              v-model='data.search.zitsutanaDate'></el-input>
                </div>
                <div class='col-md-8'>
                    <label for='商品' class='col-form-label px-1' style='width:100%;'>商品</label>
                    <el-increment-search v-model="data.search.syouhinCode"
                                         :display="[{key:'syohinmei',name:'名前'}]"
                                         :autoComplete="['syohinmei']"
                                         :kind="'商品'"
                                         :required="true"
                                         @update="(r) => data.search.syouhinName = r.syohinmei"></el-increment-search>
                    <el-input type='text'
                              style='width:50%;'
                              readonly
                              :placeholder="'商品名'"
                              v-model="data.search.syouhinName"></el-input>
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
                    <el-button type="primary" v-on:click="zitsutanaSearch">検索</el-button>
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
                                    <th>受付番号</th>
                                    <th>実棚日</th>
                                    <th>商品</th>
                                    <th>備考</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(search_result, index) in data.search.result" v-bind:key="search_result.number" v-bind:class="data.search.selectedIndex == index && 'search-selected'" v-on:click="searchSelectedTr(index)">
                                    <td><el-button type="success" name="name" v-on:click="searchResultSelect(search_result)">選択</el-button></td>
                                    <td>{{search_result.reception_number}}</td>
                                    <td>{{search_result.date}}</td>
                                    <td>{{getSyouhinName(search_result.syouhin)}}</td>
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
                <span>実棚入力</span>
            </div>
            <div slot='default'>
                <el-form :model="data.zitsutanaModel" ref="zitsutanaForm" label-width="120px">
                    <div class='row'>
                        <div class='col-md-12'>

                            <el-card>
                                <template slot='default'>
                                    <div class='row'>
                                        <div class='col-md-4'>
                                            <label for='処理区分' class='col-form-label px-1' style='width:100%;'>処理区分</label>
                                            <el-select v-model="data.syoriKubun" style="width: 100%;" :disabled="data.disabled.zitsutanaConfirm">
                                                <el-option :value='0' :label="'0:新規'"></el-option>
                                                <el-option :value='1' :label="'1:修正'"></el-option>
                                                <el-option :value='2' :label="'2:削除'"></el-option>
                                                <el-option :value='3' :label="'3:照会'"></el-option>
                                            </el-select>
                                        </div>
                                        <div class='col-md-4'>
                                            <label for='荷受日付' class='col-form-label px-1' style='width:100%;'>伝票番号</label>
                                            <el-input id="receptionNumber"
                                                      type='text'
                                                      style='width:60%; margin-right:2%;'
                                                      v-model="data.receptionNumber"
                                                      :disabled="data.syoriKubun == 0 || data.disabled.zitsutanaConfirm"></el-input>
                                            <el-button id="receptionNumberSearch"
                                                       type='danger'
                                                       icon="el-icon-search"
                                                       style='width:20%;display:inline;'
                                                       @click="data.dialogVisible = true"
                                                       :disabled="data.syoriKubun == 0 || data.disabled.zitsutanaConfirm">検索</el-button>

                                        </div>
                                        <div class='col-md-4'>
                                            <label for='回数' class='col-form-label px-1'>確認</label>
                                            <el-button type='primary'
                                                       style="display:block;"
                                                       :disabled="data.disabled.zitsutanaConfirm"
                                                       v-on:click="zitsutanaConfirm">確認</el-button>
                                        </div>
                                    </div>
                                </template>
                            </el-card>
                        </div>
                    </div>
                    <div class='row' style="margin-top:3%;">
                        <div class='col-md-6'>
                            <label for='実棚日付' class='col-form-label px-1'>実棚日付</label>
                            <el-form-item label-width="0"
                                          prop="zitsutanaDate"
                                          :rules="{
                                                              required: true, message: '実棚日付が入力されていません', trigger: 'blur'
                                                              }"
                                          style="margin:0;">
                                <el-input id="zitsutanaDate"
                                          type="date"
                                          v-model="data.zitsutanaModel.zitsutanaDate" v-bind:disabled="!data.disabled.zitsutanaConfirm || data.syoriKubun == 2 || data.syoriKubun == 3"></el-input>    
                            </el-form-item>
                        </div>
                        <div class="col-md-4">
                            <label for='商品' class='col-form-label px-1' style='width:100%;'>商品</label>
                            <el-form-item label-width="0"
                                          prop="syouhin"
                                          :rules="{
                                                              required: true, message: '商品が選択されていません', trigger: 'blur'
                                                              }"
                                          style="margin:0;">

                                <el-select v-model="data.zitsutanaModel.syouhin" style='width:100%;' :disabled="!data.disabled.zitsutanaConfirm || data.syoriKubun == 2 || data.syoriKubun == 3">
                                    <el-option v-for="syouhin in data.syouhinData" v-bind:key="syouhin.number" :label="syouhin.syohinmei" :value="syouhin.syohinCD"></el-option>
                                </el-select>
                            </el-form-item>
                        </div>

                    </div>
                    <div class='row' style="margin-top:2%;">
                        <div class='col-md-12'>
                            <label for='備考' class='col-form-label px-1' style='width:100%;'>備考</label>
                            <el-input type="textarea"
                                      :rows="4"
                                      v-model="data.zitsutanaModel.bikou"
                                      :disabled="!data.disabled.zitsutanaConfirm || data.syoriKubun == 2 || data.syoriKubun == 3">
                            </el-input>
                        </div>
                    </div>
                    <el-card style="margin-top:3%;">
                        <div slot='header'>
                            <span>明細</span>
                        </div>
                        <div>
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th width="4%"></th>
                                        <th>削除</th>
                                        <th>品種</th>
                                        <th>品種名</th>
                                        <th>サイズ</th>
                                        <th>サイズ名</th>
                                        <th>等級</th>
                                        <th>等級名</th>
                                        <th>実棚数</th>
                                        <th>キャンセル</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(meisai_data, index) in data.zitsutanaModel.meisai" v-bind:key="meisai_data.number" style="margin-bottom:10px;">
                                        <td>{{index}}</td>
                                        <td><el-button type="primary" name="name" v-on:click="meisaiRemove(index)" v-bind:disabled="data.syoriKubun == 3">削除</el-button></td>
                                        <td>
                                            <el-form-item label-width="0"
                                                          :prop="'meisai[' + index + '].hinsyuCode'"
                                                          :rules="{
                                                              required: true, message: '品種コードが入力されていません', trigger: 'blur'
                                                              }"
                                                          style="margin:0;">
                                                <el-increment-search v-model="meisai_data.hinsyuCode"
                                                                     style='width:100%;'
                                                                     :display="[{key:'hinsyumei',name:'名前'}]"
                                                                     :autoComplete="['hinsyumei']"
                                                                     :kind="'品種'"
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
                                                      :placeholder="'品種名'"
                                                      :disabled="data.syoriKubun == 2 || data.syoriKubun == 3"
                                                      @change="changeMeisaiData(index)"
                                                      v-model="meisai_data.hinsyuName"></el-input>
                                        </td>
                                        <td>
                                            <el-form-item label-width="0"
                                                          :prop="'meisai[' + index + '].sizeCode'"
                                                          :rules="{
                                                              required: true, message: 'サイズコードが入力されていません', trigger: 'blur'
                                                              }"
                                                          style="margin:0;">

                                                <el-increment-search v-model="meisai_data.sizeCode"
                                                                     :display="[{key:'name',name:'名前'}]"
                                                                     style='width:100%;'
                                                                     :autoComplete="['name']"
                                                                     :kind="'サイズ'"
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
                                                      :placeholder="'サイズ名'"
                                                      :disabled="data.syoriKubun == 2 || data.syoriKubun == 3"
                                                      @change="changeMeisaiData(index)"
                                                      v-model="meisai_data.hinsyuName"></el-input>
                                        </td>
                                        <td>
                                            <el-form-item label-width="0"
                                                          :prop="'meisai[' + index + '].tokyuCode'"
                                                          :rules="{
                                                              required: true, message: '等級コードが入力されていません', trigger: 'blur'
                                                              }"
                                                          style="margin:0;">

                                                <el-increment-search v-model="meisai_data.tokyuCode"
                                                                     :display="[{key:'syohinmei',name:'名前'}]"
                                                                     style='width:100%;'
                                                                     :autoComplete="['syohinmei']"
                                                                     :kind="'等級'"
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
                                                      :placeholder="'等級名'"
                                                      :disabled="data.syoriKubun == 2 || data.syoriKubun == 3"
                                                      @change="changeMeisaiData(index)"
                                                      v-model="meisai_data.tokyuName"></el-input>
                                        </td>
                                        <td>
                                            <el-form-item label-width="0"
                                                          :prop="'meisai[' + index + '].zitsutanasu'"
                                                          :rules="{
                                                              required: true, message: '実棚数が入力されていません', trigger: 'blur'
                                                              }"
                                                          style="margin:0;">

                                                <el-input-number name="name" v-model="meisai_data.zitsutanasu" :disabled="data.syoriKubun == 2 || data.syoriKubun == 3" @change="changeMeisaiData(index)"></el-input-number>
                                            </el-form-item>
                                        </td>
                                        <td><el-button type="warning" name="name" v-on:click="meisaiReturn(meisai_data.row,index)" :disabled="data.syoriKubun == 2 || data.syoriKubun == 3">キャンセル</el-button></td>
                                    </tr>
                                </tbody>
                            </table>
                            <div style='text-align:right;width:100%;'>
                                <el-button id="updateButton" type='success' v-bind:disabled="!data.disabled.zitsutanaConfirm || data.syoriKubun == 3" v-on:click="update">{{data.updateButton}}(F9)</el-button>
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
        name: 'zitsutanaNyuryoku',
        components: {
            KeyboardEvents, ElIncrementSearch
        },
        data: function () {
            return {
                data: {
                    syoriKubun: 0,
                    zitsutanaDate: "",
                    search: {
                        zitsutanaDate: "",
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
                        zitsutanaConfirm: false,
                    },
                　　syouhinData:[],
                    dialogVisible: false,
                    receptionNumber: "",
                    zitsutanaModel: {
                        meisai: [],
                        zitsutanaDate: "",
                        syouhin: "",
                        bikou: "",
                    },
                    
                },
            }
        },
        methods: {
            keyboardEvent(e) {
                if (e.keyCode == config.KEY_CODES.F4) {

                    if (!this.data.disabled.zitsutanaConfirm && this.data.syoriKubun != 0) {
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
            createMeisaiData: function (hinsyuCode, hinsyuName, sizeCode, sizeName, tokyuCode, tokyuName, zitsutanasu, row) {


                return {
                    hinsyuCode: hinsyuCode,
                    hinsyuName: hinsyuName,
                    sizeCode: sizeCode,
                    siceName: sizeName,
                    tokyuCode: tokyuCode,
                    tokyuName: tokyuName,
                    zitsutanasu: zitsutanasu,
                    row: row,
                };

            },
            addMeisai: function (hinsyuCode, hinsyuName, sizeCode, sizeName, tokyuCode, tokyuName, zitsutanasu, row) {

                var data = this.createMeisaiData(hinsyuCode, hinsyuName, sizeCode, sizeName, tokyuCode, tokyuName, zitsutanasu, row);

                this.data.zitsutanaModel.meisai.push(data);


            },
            createSearchResultData: function (reception_number, date, syouhin, bikou) {

                return {
                    reception_number: reception_number,
                    date: date,
                    syouhin: syouhin,
                    bikou: bikou,
                };

            },
            addSearchResult: function (reception_number, date, syouhin, bikou) {

                var data = this.createSearchResultData(reception_number, date, syouhin, bikou);

                this.data.search.result(data);


            },
            zitsutanaConfirm: function () {
                //仕様書を見た感じ提出前にチェックする必要性が無いように感じるが、もし入力チェックがある場合はここに追加

                var select_value = this.data.syoriKubun;

                if (select_value == 0) {
                    //新規の時


                    //更新ボタンの中身編集
                    this.data.updateButton = "新規"

                    this.addMeisai("", "", "", "", "", "", 0, this.data.zitsutanaModel.meisai.length);



                } else {

                    if (this.data.receptionNumber == "") {
                        alert("受付番号を検索してください");
                        return false;
                    }



                    //※ここでaxiosで荷受け番号をもとにT荷受けからデータを取ってくる

                    //検索で選択したデータを明細に追加する。とりあえずは適当なデータを明細に入れるので、後にdbから取ってくる
                    //明細の行を初期化
                    this.data.zitsutanaModel.meisai = [];

                    this.data.zitsutanaModel.zitsutanaDate = "2020-06-08";
                    this.data.zitsutanaModel.syouhin = "0";
                    this.data.bikou = "あああいいいううううえええおおお";

                    for (var i = 0; i < 4; i++) {
                        var sample_meisai = this.createMeisaiData("", "", "", "", "", "", i, this.data.zitsutanaModel.meisai.length);

                        this.data.zitsutanaModel.meisai.push(sample_meisai);

                    }
                    this.addMeisai("", "", "", "", "", "", 0, this.data.zitsutanaModel.meisai.length);

                    if (select_value == 2) {
                        //更新ボタンの中身編集
                        this.data.updateButton = "削除"

                    }
                }

                this.data.disabled.zitsutanaConfirm = true;

            },
            meisaiRemove: function (index) {

                if (this.data.zitsutanaModel.meisai.length > 1) {

                    //明細の削除
                    this.data.zitsutanaModel.meisai.splice(index, 1);

                }
            },
            meisaiReturn: function (row,index) {

                
                if (this.data.syoriKubun == 0) {

                    var meisai = this.data.zitsutanaModel.meisai[index];

                    console.log(row,meisai);

                    meisai.hinsyuCode = "";
                    meisai.sizeCode = "";
                    meisai.tokyuCode = "";
                    meisai.zitsutanasu = "";


                } else if (this.data.syoriKubun == 1) {

                    //※処理区分が1の時axiosでとってきて戻す処理

                }


            },
            changeMeisaiData: function (index) {

                console.log(index);
                if (index == this.data.zitsutanaModel.meisai.length -1) {

                    this.addMeisai("", "", "", "", "", "", 0, this.data.zitsutanaModel.meisai.length);
                }
                
            },
            zitsutanaSearch: function () {


                //検索を更新するときはresultを初期化
                this.data.search.result = [];


                //※ここでaxiosで検索データを取ってくる
                //とりあえずのデータ、サーバーとつないだらここはajaxx
                var sample_data = this.createSearchResultData("101010", "2020-10-10", 2, "あああああ");


                for (var i = 0; i < 4; i++) {

                    this.data.search.result.push(sample_data);

                }

            },
            getSyouhinName: function (code) {

                var result = "";

                for (var i = 0; i < this.data.syouhinData.length; i++) {

                    if (this.data.syouhinData[i].syohinCD == code) {

                        result = this.data.syouhinData[i].syohinmei;
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
                this.data.zitsutanaModel.meisai = [];
                this.data.search.result = [];
                this.data.zitsutanaModel.zitsutanaDate = "";
                this.data.zitsutanaModel.syouhin = "";
                this.data.receptionNumber = "";
                this.data.syoriKubun = 0;

                this.data.disabled.zitsutanaConfirm = false;



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

                    this.$refs['zitsutanaForm'].validate((valid) => {
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
            this.data.syouhinData = [
                { syohinCD: "0", syohinmei: "干柿" },
                { syohinCD: "1", syohinmei: "柿ごのみ" },
                { syohinCD: "2", syohinmei: "あんぽ" },
                { syohinCD: "9", syohinmei: "等外" },
            ]

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