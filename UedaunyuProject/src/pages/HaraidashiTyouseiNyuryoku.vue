<template>
    <div>

        <keyboard-events v-on:keydown="keyboardEvent"></keyboard-events>
        <el-dialog title="伝票検索"
                   :visible.sync="data.dialogVisible"
                   width="90%">
            <div class="row">
                <div class='col-md-4'>
                    <label for='荷受日付' class='col-form-label px-1' style='width:100%;'>伝票日付</label>
                    <el-input type='date'
                              style='margin-right:2%;'
                              :max="data.search.dateEnd"
                              v-model='data.search.denpyouDate'></el-input>
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
                    <el-button type="primary" v-on:click="haraidashiTyouseiSearch">検索</el-button>
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
                                    <td>{{search_result.kaisu}}</td>
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
                <span>払出調整入力</span>
            </div>
            <div slot='default'>
                <el-form :model="data.haraidashiTyouseiModel" ref="haraidashiTyouseiForm" label-width="120px">
                    <div class='row'>
                        <div class='col-md-12'>

                            <el-card>
                                <template slot='default'>
                                    <div class='row'>
                                        <div class='col-md-4'>
                                            <label for='処理区分' class='col-form-label px-1' style='width:100%;'>処理区分</label>
                                            <el-select v-model="data.syoriKubun" style="width: 100%;" :disabled="data.disabled.haraidashiTyouseiConfirm">
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
                                                      :disabled="data.syoriKubun == 0 || data.disabled.haraidashiTyouseiConfirm"></el-input>
                                            <el-button id="receptionNumberSearch"
                                                       type='danger'
                                                       icon="el-icon-search"
                                                       style='width:20%;display:inline;'
                                                       @click="data.dialogVisible = true"
                                                       :disabled="data.syoriKubun == 0 || data.disabled.haraidashiTyouseiConfirm">検索</el-button>

                                        </div>
                                        <div class='col-md-4'>
                                            <label for='回数' class='col-form-label px-1'>確認</label>
                                            <el-button type='primary'
                                                       style="display:block;"
                                                       :disabled="data.disabled.haraidashiTyouseiConfirm"
                                                       v-on:click="haraidashiTyouseiConfirm">確認</el-button>
                                        </div>
                                    </div>
                                </template>
                            </el-card>
                        </div>
                    </div>
                    <div class='row' style="margin-top:3%;">
                        <div class='col-md-3'>
                            <label for='伝票日付' class='col-form-label px-1'>伝票日付</label>
                            <el-form-item label-width="0"
                                          prop="denpyouDate"
                                          :rules="{
                                                              required: true, message: '伝票日付が入力されていません', trigger: 'blur'
                                                              }"
                                          style="margin:0;">
                                <el-input id="denpyouDate"
                                          type="date"
                                          v-model="data.haraidashiTyouseiModel.denpyouDate" v-bind:disabled="!data.disabled.haraidashiTyouseiConfirm || data.syoriKubun == 2 || data.syoriKubun == 3"></el-input>
                            </el-form-item>
                        </div>
                        <div class="col-md-3">
                            <label for='商品' class='col-form-label px-1' style='width:100%;'>商品</label>
                            <el-form-item label-width="0"
                                          prop="syouhin"
                                          :rules="{
                                                              required: true, message: '商品が選択されていません', trigger: 'blur'
                                                              }"
                                          style="margin:0;">

                                <el-select v-model="data.haraidashiTyouseiModel.syouhin" style='width:100%;' :disabled="!data.disabled.haraidashiTyouseiConfirm || data.syoriKubun == 2 || data.syoriKubun == 3">
                                    <el-option v-for="syouhin in data.syouhinData" v-bind:key="syouhin.number" :label="syouhin.syohinmei" :value="syouhin.syohinCD"></el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                        <div class="col-md-3">
                            <label for='伝票区分' class='col-form-label px-1' style='width:100%;'>伝票区分</label>
                            <el-form-item label-width="0"
                                          prop="denpyouKubun"
                                          :rules="{
                                                              required: true, message: '伝票区分が選択されていません', trigger: 'blur'
                                                              }"
                                          style="margin:0;">

                                <el-select v-model="data.haraidashiTyouseiModel.denpyouKubun" style='width:100%;' :disabled="!data.disabled.haraidashiTyouseiConfirm || data.syoriKubun == 2 || data.syoriKubun == 3">
                                    <el-option v-for="denpyou in data.denpyouKubun" v-bind:key="denpyou.number" :label="denpyou.syohinmei" :value="denpyou.syohinCD"></el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                        <div class="col-md-3">
                            <label for='回数' class='col-form-label px-1' style='width:100%;'>回数</label>
                            <el-form-item label-width="0"
                                          prop="kaisu"
                                          :rules="{
                                                              required: true, message: '回数が選択されていません', trigger: 'blur'
                                                              }"
                                          style="margin:0;">

                                <el-select v-model="data.haraidashiTyouseiModel.kaisu" style='width:100%;' :disabled="!data.disabled.haraidashiTyouseiConfirm || data.syoriKubun == 2 || data.syoriKubun == 3">
                                    <el-option v-for="kaisu in data.kaisu" v-bind:key="kaisu.number" :label="kaisu.syohinmei" :value="kaisu.syohinCD"></el-option>
                                </el-select>
                            </el-form-item>
                        </div>

                    </div>
                    <div class='row' style="margin-top:2%;">
                        <div class='col-md-12'>
                            <label for='備考' class='col-form-label px-1' style='width:100%;'>備考</label>
                            <el-input type="textarea"
                                      :rows="4"
                                      v-model="data.haraidashiTyouseiModel.bikou"
                                      :disabled="!data.disabled.haraidashiTyouseiConfirm || data.syoriKubun == 2 || data.syoriKubun == 3">
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
                                        <th>数量</th>
                                        <th>単価</th>
                                        <th>金額</th>
                                        <th>キャンセル</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(meisai_data, index) in data.haraidashiTyouseiModel.meisai" v-bind:key="meisai_data.number" style="margin-bottom:10px;">
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
                                                          :prop="'meisai[' + index + '].suryou'"
                                                          :rules="{
                                                              required: true, message: '数量が入力されていません', trigger: 'blur'
                                                              }"
                                                          style="margin:0;">

                                                <el-input-number name="name" v-model="meisai_data.suryou" :disabled="data.syoriKubun == 2 || data.syoriKubun == 3" @change="changeMeisaiKingaku(index)"></el-input-number>
                                            </el-form-item>
                                        </td>
                                        <td>
                                            <el-form-item label-width="0"
                                                          :prop="'meisai[' + index + '].tanka'"
                                                          :rules="{
                                                              required: true, message: '単価が入力されていません', trigger: 'blur'
                                                              }"
                                                          style="margin:0;">

                                                <el-input-number name="name" v-model="meisai_data.tanka" :disabled="data.syoriKubun == 2 || data.syoriKubun == 3" @change="changeMeisaiKingaku(index)"></el-input-number>
                                            </el-form-item>
                                        </td>
                                        <td>
                                            <el-input name="name" v-model="meisai_data.kingaku" :disabled="data.syoriKubun == 2 || data.syoriKubun == 3" readonly></el-input>
                                        </td>

                                        <td><el-button type="warning" name="name" v-on:click="meisaiReturn(meisai_data.row,index)" :disabled="data.syoriKubun == 2 || data.syoriKubun == 3">キャンセル</el-button></td>
                                    </tr>
                                </tbody>
                            </table>
                            <div style='text-align:right;width:100%;'>
                                <el-button id="updateButton" type='success' v-bind:disabled="!data.disabled.haraidashiTyouseiConfirm || data.syoriKubun == 3" v-on:click="update">{{data.updateButton}}(F9)</el-button>
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
        name: 'haraidashiTyouseiNyuryoku',
        components: {
            KeyboardEvents, ElIncrementSearch
        },
        data: function () {
            return {
                data: {
                    syoriKubun: 0,
                    search: {
                        denpyouDate: "",
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
                        haraidashiTyouseiConfirm: false,
                    },
                    syouhinData: [],
                    denpyouKubun: [],
                    kaisu: [],
                    dialogVisible: false,
                    receptionNumber: "",
                    haraidashiTyouseiModel: {
                        meisai: [],
                        denpyouDate: "",
                        syouhin: "",
                        denpyouKubun: "",
                        kaisu: "",
                        bikou: "",
                    },

                },
            }
        },
        methods: {
            keyboardEvent(e) {
                if (e.keyCode == config.KEY_CODES.F4) {

                    if (!this.data.disabled.haraidashiTyouseiConfirm && this.data.syoriKubun != 0) {
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
            createMeisaiData: function (hinsyuCode, hinsyuName, sizeCode, sizeName, tokyuCode, tokyuName, suryou, tanka, kingaku, row) {


                return {
                    hinsyuCode: hinsyuCode,
                    hinsyuName: hinsyuName,
                    sizeCode: sizeCode,
                    siceName: sizeName,
                    tokyuCode: tokyuCode,
                    tokyuName: tokyuName,
                    suryou: suryou,
                    tanka: tanka,
                    kingaku: kingaku,
                    row: row,
                };

            },
            addMeisai: function (hinsyuCode, hinsyuName, sizeCode, sizeName, tokyuCode, tokyuName, suryou, tanka, kingaku,row) {

                var data = this.createMeisaiData(hinsyuCode, hinsyuName, sizeCode, sizeName, tokyuCode, tokyuName, suryou, tanka, kingaku,row);

                this.data.haraidashiTyouseiModel.meisai.push(data);


            },
            createSearchResultData: function (reception_number, date, syouhin, kaisu, bikou) {

                return {
                    reception_number: reception_number,
                    date: date,
                    syouhin: syouhin,
                    kaisu:kaisu,
                    bikou: bikou,
                };

            },
            addSearchResult: function (reception_number, date, syouhin, kaisu, bikou) {

                var data = this.createSearchResultData(reception_number, date, syouhin, kaisu, bikou);

                this.data.search.result(data);


            },
            haraidashiTyouseiConfirm: function () {
                //仕様書を見た感じ提出前にチェックする必要性が無いように感じるが、もし入力チェックがある場合はここに追加

                var select_value = this.data.syoriKubun;

                if (select_value == 0) {
                    //新規の時


                    //更新ボタンの中身編集
                    this.data.updateButton = "新規"

                    this.addMeisai("", "", "", "", "", "", 0, 0, 0, this.data.haraidashiTyouseiModel.meisai.length);



                } else {

                    if (this.data.receptionNumber == "") {
                        alert("受付番号を検索してください");
                        return false;
                    }



                    //※ここでaxiosで荷受け番号をもとにT荷受けからデータを取ってくる

                    //検索で選択したデータを明細に追加する。とりあえずは適当なデータを明細に入れるので、後にdbから取ってくる
                    //明細の行を初期化
                    this.data.haraidashiTyouseiModel.meisai = [];

                    this.data.haraidashiTyouseiModel.denpyouDate = "2020-06-08";
                    this.data.haraidashiTyouseiModel.syouhin = "0";
                    this.data.bikou = "あああいいいううううえええおおお";

                    for (var i = 0; i < 4; i++) {
                        var sample_meisai = this.createMeisaiData("", "", "", "", "", "", i, 100, i * 100, this.data.haraidashiTyouseiModel.meisai.length);


                        this.data.haraidashiTyouseiModel.meisai.push(sample_meisai);

                    }
                    this.addMeisai("", "", "", "", "", "", 0, 0, 0, this.data.haraidashiTyouseiModel.meisai.length);


                    if (select_value == 2) {
                        //更新ボタンの中身編集
                        this.data.updateButton = "削除"

                    }
                }

                this.data.disabled.haraidashiTyouseiConfirm = true;

            },
            meisaiRemove: function (index) {

                if (this.data.haraidashiTyouseiModel.meisai.length > 1) {

                    //明細の削除
                    this.data.haraidashiTyouseiModel.meisai.splice(index, 1);

                }
            },
            meisaiReturn: function (row,index) {


                if (this.data.syoriKubun == 0) {

                    var meisai = this.data.haraidashiTyouseiModel.meisai[row,index];

                    console.log(row, meisai);

                    meisai.hinsyuCode = "";
                    meisai.sizeCode = "";
                    meisai.tokyuCode = "";
                    meisai.suryou = 0;
                    meisai.tanka = 0;
                    meisai.kingaku = 0;


                } else if (this.data.syoriKubun == 1) {

                    //※処理区分が1の時axiosでとってきて戻す処理

                }


            },
            changeMeisaiData: function (index) {

                if (index == this.data.haraidashiTyouseiModel.meisai.length - 1) {

                    this.addMeisai("", "", "", "", "", "", 0, 0, 0, this.data.haraidashiTyouseiModel.meisai.length);

                }

            },
            changeMeisaiKingaku: function (index) {

                var meisai = this.data.haraidashiTyouseiModel.meisai[index];

                meisai.kingaku = meisai.suryou * meisai.tanka;

                this.changeMeisaiData(index);

            },
            haraidashiTyouseiSearch: function () {


                //検索を更新するときはresultを初期化
                this.data.search.result = [];


                //※ここでaxiosで検索データを取ってくる
                //とりあえずのデータ、サーバーとつないだらここはajaxx
                var sample_data = this.createSearchResultData("101010", "2020-10-10", 0, 33,"あああああ");


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
                this.data.haraidashiTyouseiModel.meisai = [];
                this.data.search.result = [];
                this.data.haraidashiTyouseiModel.denpyouDate = "";
                this.data.haraidashiTyouseiModel.syouhin = "";
                this.data.receptionNumber = "";
                this.data.syoriKubun = 0;

                this.data.disabled.haraidashiTyouseiConfirm = false;



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

                    this.$refs['haraidashiTyouseiForm'].validate((valid) => {
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

            this.data.denpyouKubun = [
                
            ]

            this.data.kaisu = [

            ];

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