<template>
    <div>
        <el-card v-if="data.pageNumber == 1">
            <div slot='header'>
                <span>荷受伝票検索</span>
            </div>
            <div slot='default'>
                <el-form :model="data.first.model" :rules="data.first.validation" ref="firstForm" label-width="120px" class="demo-ruleForm">
                    <div class="row">
                        <div class='col-md-3'>
                            <label for='処理区分' class='col-form-label px-1' style='width:100%;'>処理区分</label>
                            <el-form-item label-width="0" prop="syoriKubun">
                                <el-select id="syoriKubun" v-model="data.first.model.syoriKubun" style="width: 100%;">
                                    <el-option :value='1' label="1:実行"></el-option>
                                    <el-option :value='9' label="9:資材代"></el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                        <div class='col-md-3'>
                            <label for='荷受日付' class='col-form-label px-1' style='width:100%;'>荷受日付</label>
                            <el-form-item label-width="0" prop="niukeDate">
                                <el-input v-model="data.first.model.niukeDate"
                                          type='date'
                                          min='1000-01-01'
                                          max='9999-12-31'></el-input>
                            </el-form-item>
                        </div>
                        <div class='col-md-3'>
                            <label for='回数' class='col-form-label px-1' style='width:100%;'>回数</label>
                            <el-form-item label-width="0" prop="kaisu">
                                <el-input style="width:100%;"
                                                 v-model="data.first.model.kaisu"
                                                 readonly></el-input>
                            </el-form-item>

                        </div>
                        <div class='col-md-3'>
                            <label for='端末番号' class='col-form-label px-1' style='width:100%;'>端末番号</label>
                            <el-input type='text'
                                      v-model="data.numberOfTerminal"
                                      readonly></el-input>
                        </div>
                    </div>
                    <div class='row'>
                        <div class='col-md-6'>
                            <label for='商品区分' class='col-form-label px-1' style='width:100%;'>商品区分</label>
                            <el-form-item label-width="0" prop="syouhinCode">
                                <el-increment-search v-model="data.first.model.syouhinCode"
                                                     :display="[{key:'syohinmei',name:'名前'}]"
                                                     :autoComplete="['syohinmei']"
                                                     :kind="'商品'"
                                                     :required="true"
                                                     @update="(r) => data.first.model.syouhinName = r.syohinmei"></el-increment-search>
                                <el-input type='text'
                                          style='width:50%;'
                                          readonly
                                          :placeholder="'商品名'"
                                          v-model="data.first.model.syouhinName"></el-input>
                            </el-form-item>

                        </div>
                    </div>
                    <div class='row'>
                        <div class='col-md-4'>
                            <label for='自家用' class='col-form-label px-1' style="margin-right:2%;">自家用</label>
                            <el-checkbox v-model="data.first.model.jikayouChecked" :disabled="data.first.model.syoriKubun == 9"></el-checkbox>
                        </div>
                        <div class='col-md-4'>
                            <label for='荷受表印刷' class='col-form-label px-1' style="margin-right:2%;">荷受表を印刷する</label>
                            <el-checkbox v-model="data.first.model.niukeHyouChecked" :disabled="data.first.model.syoriKubun == 9"></el-checkbox>
                        </div>
                        <div class='col-md-4'>
                            <label for='荷受表控印刷' class='col-form-label px-1' style="margin-right:2%;">荷受表(控)を印刷する</label>
                            <el-checkbox v-model="data.first.model.niukeHyouHikaeChecked" :disabled="data.first.model.syoriKubun == 9"></el-checkbox>
                        </div>
                    </div>

                </el-form>
                <div class='row'>
                    <div class='col-md-12'>
                        <div style='text-align:right;width:100%;'>
                            <el-button style='margin-left:2%;' type='primary' v-on:click="searchCheck">検索(F5)</el-button>
                            <el-button style='margin-left:2%;' type='warning' v-on:click="finish">終了(F12)</el-button>
                        </div>
                    </div>
                </div>

            </div>
        </el-card>

        <keyboard-events v-on:keydown="keyboardEvent"></keyboard-events>
        <el-dialog title="荷受データ検索"
                   :visible.sync="data.dialogVisible"
                   width="90%">
            <div class="row">
                <div class='col-md-12'>
                    <label for='荷受日付' class='col-form-label px-1' style='width:100%;'>荷受日付</label>
                    <el-input type='date'
                              style='width:40%;margin-right:2%;'
                              :max="data.search.dateEnd"
                              v-model='data.search.dateStart'></el-input>
                    <span>～</span>
                    <el-input type='date'
                              style='width:40%;margin-right:2%;'
                              :min="data.search.dateStart"
                              v-model='data.search.dateEnd'></el-input>
                </div>
            </div>
            <div class="row">
                <div class='col-md-8'>
                    <label for='生産者' class='col-form-label px-1' style='width:100%;'>生産者</label>
                    <el-increment-search v-model="data.search.seisansya.code"
                                         :display="[{key:'seisansyamei',name:'名前'}]"
                                         :autoComplete="['seisansyamei']"
                                         :kind="'生産者'"
                                         :required="true"
                                         @update="(r) => data.search.seisansya.name = r.seisansyamei"></el-increment-search>
                    <el-input type='text'
                              style='width:50%;'
                              readonly
                              :placeholder="'生産者名'"
                              v-model="data.search.seisansya.name"></el-input>
                </div>
            </div>
            <div class="row">
                <div class="col-12" style="text-align:right;">
                    <el-button @click="data.dialogVisible = false">終了</el-button>
                    <el-button type="primary" v-on:click="niukeSearch">検索</el-button>
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
                                <tr class="bold-border-bottom">
                                    <th width="4%"></th>
                                    <th>日付</th>
                                    <th>受付番号</th>
                                    <th>生産者</th>
                                    <th>商品</th>
                                    <th>品種</th>
                                    <th>回数</th>
                                    <th>通箱合計</th>
                                    <th>資材代</th>
                                    <th>前渡金</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(search_result, index) in data.search.result" v-bind:key="search_result.number" v-bind:class="data.search.selectedIndex == index ? 'bold-border-bottom search-selected' : 'bold-border-bottom'" v-on:click="searchSelectedTr(index)">
                                    <td><el-button type="success" name="name" v-on:click="searchResultSelect(search_result)">選択</el-button></td>
                                    <td>{{search_result.date}}</td>
                                    <td>{{search_result.reception_number}}</td>
                                    <td>{{search_result.seisansya}}</td>
                                    <td>{{search_result.syouhin}}</td>
                                    <td>{{search_result.hinsyu}}</td>
                                    <td>{{search_result.frequency}}</td>
                                    <td>{{search_result.total}}</td>
                                    <td>{{search_result.shizai}}</td>
                                    <td>{{search_result.zentokin}}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </el-card>
        </el-dialog>
        <el-card v-if="data.pageNumber == 2">
            <div slot='header'>
                <span>荷受伝票</span>
            </div>
            <div slot='default'>
                <el-form :model="data.second.model" ref="secondForm" label-width="120px" class="demo-ruleForm">
                    <div class='row'>
                        <div class='col-md-12'>

                            <el-card>
                                <template slot='default'>
                                    <div class='row'>
                                        <div class='col-md-4'>
                                            <label for='処理区分' class='col-form-label px-1' style='width:100%;'>処理区分</label>
                                            <el-select id="syoriKubun" v-model="data.syoriKubun.second" style='width:100%;' :disabled="data.disabled.niukeConfirm">
                                                <el-option value='0' label="0: 新規"></el-option>
                                                <el-option value='1' label="1: 修正"></el-option>
                                                <el-option value='2' label="2: 削除"></el-option>
                                            </el-select>
                                        </div>
                                        <div class='col-md-4'>
                                            <label for='荷受日付' class='col-form-label px-1' style='width:100%;'>受付番号</label>
                                            <el-input id="receptionNumber"
                                                      type='text'
                                                      style='width:60%; margin-right:2%;'
                                                      v-model="data.receptionNumber"
                                                      :disabled="data.syoriKubun.second == 0 || data.disabled.niukeConfirm"></el-input>
                                            <el-button id="receptionNumberSearch"
                                                       type='danger'
                                                       icon="el-icon-search"
                                                       style='width:20%;display:inline;'
                                                       @click="data.dialogVisible = true"
                                                       :disabled="data.syoriKubun.second == 0 || data.disabled.niukeConfirm">検索</el-button>

                                        </div>
                                        <div class='col-md-4'>
                                            <label for='回数' class='col-form-label px-1'>確認</label>
                                            <el-button type='primary'
                                                       style="display:block;"
                                                       v-on:click="niukeConfirm">確認</el-button>
                                        </div>
                                    </div>
                                </template>
                            </el-card>
                        </div>
                    </div>
                    <div class='row' style="margin-top:3%;">
                        <div class='col-md-6'>
                            <label for='荷受日付' class='col-form-label px-1'>荷受日付</label>
                            <el-form-item label-width="0"
                                          prop="niukeDate"
                                          :rules="{
                                                              required: true, message: '荷受日付が入力されていません', trigger: 'blur'
                                                              }"
                                          style="margin:0;">
                                <el-input id="niukeDate"
                                          type="date"
                                          v-model="data.second.model.niukeDate" v-bind:disabled="!data.disabled.niukeConfirm || data.syoriKubun.second != 1"></el-input>
                            </el-form-item>
                        </div>
                    </div>
                    <div class='row'>
                        <div class='col-md-4'>
                            <label for='生産者' class='col-form-label px-1' style='width:100%;'>生産者</label>
                            <el-form-item label-width="0"
                                          prop="seisansyaCode"
                                          :rules="{
                                                              required: true, message: '生産者が入力されていません', trigger: 'change'
                                                              }"
                                          style="margin:0;">
                                <el-increment-search v-model="data.second.model.seisansyaCode"
                                                     :display="[{key:'seisansyamei',name:'名前'}]"
                                                     :autoComplete="['seisansyamei']"
                                                     :kind="'生産者'"
                                                     :required="true"
                                                     @update="(r) => data.second.model.seisansyaName = r.seisansyamei"
                                                     :disabled="!data.disabled.niukeConfirm || data.syoriKubun.second == 2"></el-increment-search>
                                <el-input type='text'
                                          style='width:50%;'
                                          readonly
                                          :placeholder="'生産者名'"
                                          :disabled="!data.disabled.niukeConfirm || data.syoriKubun.second == 2"
                                          v-model="data.second.model.seisansyaName"></el-input>
                            </el-form-item>


                        </div>
                        <div class='col-md-4'>
                            <label for='商品名' class='col-form-label px-1' style='width:100%;'>商品名</label>
                            <el-input id="syouhinName"
                                      type='text'
                                      v-model="data.syouhin.second.name"
                                      readonly
                                      v-bind:disabled="!data.disabled.niukeConfirm || data.syoriKubun.second == 2"></el-input>
                        </div>
                        <div class='col-md-4' v-if="data.first.model.syoriKubun == 1">
                            <label for='品種' class='col-form-label px-1' style='width:100%;'>品種</label>
                            <el-form-item label-width="0"
                                          prop="hinsyuCode"
                                          :rules="{
                                                              required: true, message: '品種が入力されていません', trigger: 'blur'
                                                              }"
                                          style="margin:0;">
                                <el-select name="name" v-model="data.second.model.hinsyuCode" v-bind:disabled="data.syoriKubun.second == 2 || data.first.model.syoriKubun != 1 || !data.disabled.niukeConfirm">
                                    <el-option v-for="hinsyu in data.hinsyu" :key="hinsyu.number" :value="hinsyu.hinsyu" :label="hinsyu.hinsyuName"></el-option>
                                </el-select>
                            </el-form-item>


                        </div>
                    </div>
                    <el-card style="margin-top:3%;">
                        <div slot='header'>
                            <span>明細</span>
                        </div>
                        <div>
                            <table class="table">
                                <thead>
                                    <tr class="bold-border-bottom">
                                        <th width="4%"></th>
                                        <th>削除</th>
                                        <th>コード</th>
                                        <th>サイズ</th>
                                        <th>等級</th>
                                        <th>箱数</th>
                                        <th>バラ</th>
                                        <th width="10%">数量</th>
                                        <th width="10%">備考</th>
                                        <th width="10%">返品理由</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(meisai_data, index) in data.second.model.meisai" v-bind:key="meisai_data.number" class="bold-border-bottom">
                                        <td>{{index}}</td>
                                        <td><el-button type="primary" name="name" v-on:click="meisaiRemove(index)" v-bind:disabled="data.syoriKubun.second == 2">削除</el-button></td>
                                        <td>
                                            <el-form-item label-width="0"
                                                          :prop="'meisai[' + index + '].code'"
                                                          :rules="{
                                                              required: true, message: 'コードが入力されていません', trigger: 'blur'
                                                              }"
                                                          style="margin:0;">

                                                <input class="form-control" type="text" name="name" v-bind:value="meisai_data.code" v-on:change="meisaiCodeCheck(meisai_data,$event.target,index)" v-bind:disabled="data.syoriKubun.second == 2" />
                                            </el-form-item>
                                        </td>
                                        <td>
                                            <el-input :value="data.size[meisai_data.size]"
                                                      :disabled="data.syoriKubun.second == 2"
                                                      readonly></el-input>
                                        </td>
                                        <td>
                                            <el-input :value="data.tokyu[meisai_data.tokyu]"
                                                      :disabled="data.syoriKubun.second == 2"
                                                      readonly></el-input>
                                        </td>
                                        <td>
                                            <el-form-item label-width="0"
                                                          :prop="'meisai[' + index + '].number_of_box'"
                                                          :rules="{
                                                              required: true, message: '箱数が入力されていません', trigger: 'blur'
                                                              }"
                                                          style="margin:0;">
                                                <el-input-number :min="0" name="name" controls-position="right" v-model="meisai_data.number_of_box" @change="numberChange(meisai_data,$event.target,'箱数')" :disabled="data.syoriKubun.second == 2"></el-input-number>
                                            </el-form-item>
                                        </td>
                                        <td>
                                            <el-form-item label-width="0"
                                                          :prop="'meisai[' + index + '].bara'"
                                                          :rules="{
                                                              required: true, message: 'バラが入力されていません', trigger: 'blur'
                                                              }"
                                                          style="margin:0;">

                                                <el-input-number :min="0" name="name" controls-position="right" v-bind:disabled="data.syouhin.second.niuke_unit != 0 || data.syoriKubun.second == 2" v-model="meisai_data.bara" @change="numberChange(meisai_data,$event.target,'バラ')"></el-input-number>
                                            </el-form-item>
                                        </td>
                                        <td><el-input name="name" v-model="meisai_data.number" readonly v-bind:disabled="data.syoriKubun.second == 2"></el-input></td>
                                        <td>
                                            <el-select name="name" v-model="meisai_data.note" v-bind:disabled="data.syoriKubun.second == 2">
                                                <el-option v-for="(note_option,index_key) in data.note" :key="note_option.number" :value="Number(index_key)" :label="note_option"></el-option>
                                            </el-select>
                                        </td>
                                        <td>
                                            <el-select name="name" v-model="meisai_data.reason_of_return" v-bind:disabled="data.syoriKubun.second == 2">
                                                <el-option v-for="(reason_option,index_key) in data.reason_of_return" :key="reason_option.number" :value="Number(index_key)" :label="reason_option"></el-option>
                                            </el-select>
                                        </td>

                                    </tr>
                                </tbody>
                                <tr>
                                    <td colspan="10" style="text-align:center;">
                                        <el-button type='primary'
                                                   style='width:40%;display:inline;'
                                                   @click="addMeisai('', null, null, 0, 0,0, 0, 0)"
                                                   :disabled="!data.disabled.niukeConfirm || data.syoriKubun.second == 2 || data.first.model.syoriKubun != 1">明細を追加</el-button>
                                    </td>
                                </tr>
                                <tbody>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td>合計</td>
                                        <td><el-input v-model="data.total.number_of_box" readonly :disabled="!data.disabled.niukeConfirm || data.syoriKubun.second == 2"></el-input></td>
                                        <td><el-input v-model="data.total.bara" readonly :disabled="!data.disabled.niukeConfirm || data.syoriKubun.second == 2"></el-input></td>
                                        <td><el-input v-model="data.total.number" readonly :disabled="!data.disabled.niukeConfirm || data.syoriKubun.second == 2"></el-input></td>
                                    </tr>
                                    <tr>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td>通箱合計</td>
                                        <td><el-input-number v-model="data.total.kayoibako" 
                                                             v-bind:disabled="!data.disabled.niukeConfirm || data.syoriKubun.second == 2 || data.first.model.syoriKubun != 1"
                                                             controls-position="right"
                                                             ></el-input-number></td>
                                    </tr>
                                </tbody>
                            </table>
                            <div class='row'>
                                <div class='col-md-4'>
                                    <label for='資材代' class='col-form-label px-1' style='width:100%;'>資材代</label>
                                    <el-input-number type='text'
                                                     v-model="data.shizaidai"
                                                     readonly
                                                     v-bind:disabled="!data.disabled.niukeConfirm || data.syoriKubun.second == 2 || data.first.model.syoriKubun != 9"
                                                     controls-position="right"
                                                     :min="0"
                                                     style='width:100%;'></el-input-number>
                                </div>
                                <div class='col-md-4'>
                                    <label for='前渡金' class='col-form-label px-1' style='width:100%;'>前渡金</label>
                                    <el-input-number type='text'
                                                     v-model="data.zentokin"
                                                     readonly
                                                     v-bind:disabled="!data.disabled.niukeConfirm || data.syoriKubun.second == 2 || data.first.model.syoriKubun != 9"
                                                     controls-position="right"
                                                     :min="0"
                                                     style='width:100%;'></el-input-number>
                                </div>
                            </div>
                            <div style='text-align:right;width:100%;'>
                                <el-button id="updateButton" type='success' v-bind:disabled="!data.disabled.niukeConfirm" v-on:click="update">{{data.updateButton}}(F9)</el-button>
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
    import url from '@/js/api_url.js'

    export default {
        name: 'niukeNyuryoku',
        components: {
            KeyboardEvents, ElIncrementSearch
        },
        data: function () {
            return {
                state1: "",
                //methodsで使う際のnodeをmountedで登録し、取得する手間を省く
                element: {
                    niukeDate: null,
                    syoriKubun: null,
                    receptionNumber: null,
                    receptionNumberSearch: null,
                    syouhinName: null,
                    hinsyuCode: null,
                    updateButton: null,
                },
                data: {
                    pageNumber: 1,
                    numberOfTerminal: null,
                    search: {
                        dateStart: "",
                        dateEnd: "",
                        seisansya: {
                            code: "",
                            name: "",
                        },
                        result: [
                        ],
                        selectedIndex: null,
                    },
                    first: {
                        model: {
                            syoriKubun: 1,
                            niukeDate: "",
                            kaisu: 0,
                            syouhinName: "",
                            syouhinCode: "",
                            jikayouChecked: false,
                            niukeHyouChecked: true,
                            niukeHyouHikaeChecked: true,
                        },
                        validation: {
                            syoriKubun: [
                                { required: true, message: '処理区分が入力されていません', trigger: 'blur' },
                            ],
                            niukeDate: [
                                { required: true, message: '荷受日付が入力されていません', trigger: 'blur' },
                            ],
                            kaisu: [
                                { required: true, message: '回数が入力されていません', trigger: 'blur' },
                            ],
                            syouhinCode: [
                                { required: true, message: '商品コードが入力されていません', trigger: 'change' },
                            ]
                        }
                    },
                    second: {
                        model: {
                            niukeDate: "",
                            seisansyaCode: "",
                            seisansyaName: "",
                            hinsyuCode: "",
                            meisai: [],
                        },
                    },
                    //更新ボタンの文字
                    updateButton: "更新",
                    disabled: {
                        niukeConfirm: false,
                    },
                    shizaidai: 0,
                    zentokin: 0,
                    dialogVisible: false,
                    total: {
                        number_of_box: 0,
                        bara: 0,
                        number: 0,
                        kayoibako: 0,
                    },
                    //処理区分、第一画面の処理区分はfirst、第二画面はsecond
                    syoriKubun: {
                        first: "0",
                        second: "0"
                    },
                    syouhin: {
                        first: {
                            name: "",
                            code: "",
                        },
                        second: {
                            code: "",
                            name: "",
                            niuke_unit: "",
                            //キーをサイズコードにして、サイズ毎の入数を呼び出す
                            number_per_box: {
                            }
                            ,
                        },

                    },
                    receptionNumber: "",
                    //荷受日付、フォーマットはinputのdateに格納できるstringの形で、
                    niukeDate: {
                        first: '',
                        second: ""
                    },
                    seisansya: {
                        code: "",
                        name: ""
                    },
                    note: {},
                    reason_of_return: {},
                    size: {
                    },
                    tokyu: {
                    },
                    hinsyu: [
                    ],

                },
            }
        },
        methods: {
            keyboardEvent(e) {
                if (e.keyCode == config.KEY_CODES.F5) {
                    if (this.data.pageNumber == 1) {
                        this.searchCheck();
                    }

                }

                if (e.keyCode == config.KEY_CODES.F9) {

                    if (this.data.pageNumber == 2) {
                        this.update()
                    }

                }
                if (e.keyCode == config.KEY_CODES.F10) {
                    if (this.data.pageNumber == 2) {
                        this.init()
                    }
                }
                if (e.keyCode == config.KEY_CODES.F12) {
                    this.finish()
                }
            },
            searchCheck: function () {

                this.$refs['firstForm'].validate((valid) => {

                    if (valid) {
                        this.data.pageNumber = 2;
                    }
                });

            },

            createMeisaiData: function (code, size, tokyu, number_of_box, bara, number, note, reason_of_return) {

                return {
                    code: code,
                    size: size,
                    tokyu: tokyu,
                    number_of_box: number_of_box,
                    bara: bara,
                    number: number,
                    note: note,
                    reason_of_return: reason_of_return
                };

            },
            addMeisai: function (code, size, tokyu, number_of_box, bara, number, note, reason_of_return) {

                var data = this.createMeisaiData(code, size, tokyu, number_of_box, bara, number, note, reason_of_return);

                this.data.second.model.meisai.push(data);


            },
            createSearchResultData: function (date, reception_number, seisansya, syouhin, hinsyu, frequency, total, shizai, zentokin) {

                return {
                    date: date,
                    reception_number: reception_number,
                    seisansya: seisansya,
                    syouhin: syouhin,
                    hinsyu: hinsyu,
                    frequency: frequency,
                    total: total,
                    shizai: shizai,
                    zentokin: zentokin,
                };

            },
            addSearchResult: function (date, reception_number, seisansya, syouhin, hinsyu, frequency, total, shizai, zentokin) {

                var data = this.createSearchResultData(date, reception_number, seisansya, syouhin, hinsyu, frequency, total, shizai, zentokin);

                this.data.search.result.push(data);


            },
            niukeConfirm: function () {
                //仕様書を見た感じ提出前にチェックする必要性が無いように感じるが、もし入力チェックがある場合はここに追加

                var select_value = this.data.syoriKubun.second;

                if (select_value == 0) {
                    //新規の時

                    //第一画面の荷受け日付を第二画面の荷受け日付に変える
                    this.data.second.model.niukeDate = this.data.first.model.niukeDate;

                    //第一画面の商品区分を元に商品名プロパティに入れる。そのデータを取ってくる。とりあえず定数を入れておくので変えてください。
                    this.data.syouhin.second.code = this.data.first.model.syouhinCode;
                    this.data.syouhin.second.name = this.data.first.model.syouhinName;

                    this.getHinsyuSelect()

                    //更新ボタンの中身編集
                    this.data.updateButton = "新規"

                    this.getMasterData(true);


                } else if (select_value == 1 || select_value == 2) {

                    if (this.data.receptionNumber == "") {
                        alert("受付番号を検索してください");
                        return false;
                    }



                    //※ここでaxiosで荷受け番号をもとにT荷受けからデータを取ってくる


                    axios.get(url.niukeNyuryoku + "?reception_number=" + this.data.receptionNumber)
                        .then(response => {

                            console.log(response.data);

                            var data = response.data[0];

                            if (data.meisaiData.length == 0) {

                                alert("データがありません");
                                return false;
                            }

                            //検索で選択したデータを明細に追加する。とりあえずは適当なデータを明細に入れるので、後にdbから取ってくる
                            //明細の行を初期化
                            this.data.second.model.meisai = [];

                            this.data.second.model.niukeDate = data.date;
                            this.data.second.model.seisansyaCode = String(data.seisansyacd);
                            this.data.second.model.seisansyaName = data.seisansya;
                            this.data.syouhin.second.name = data.syohin;
                            this.data.syouhin.second.code = data.syohincd;

                            this.data.total.kayoibako = data.total;
                            this.data.shizaidai = data.shizai;
                            this.data.zentokin = data.zentokin;

                            console.log("商品コード:", this.data.syouhin.second.code);
                            this.getHinsyuSelect()

                            this.data.second.model.hinsyuCode = data.hinsyucd;

                            console.log(this.data.second.model.hinsyuCode);

                            if (select_value == 2) {
                                //更新ボタンの中身編集
                                this.data.updateButton = "削除"

                            } else if (select_value == 1) {
                                this.data.updateButton = "編集"
                            }

                            this.getMasterData(false, data.meisaiData);

                        })
                        .catch(response => console.log(response))

                }



            },
            meisaiRemove: function (index) {

                if (this.data.second.model.meisai.length > 1) {

                    //明細の削除
                    this.data.second.model.meisai.splice(index, 1);

                }
            },
            //明細のコードの入力チェック
            meisaiCodeCheck: function (meisai_data, input, index) {

                var input_code = input.value;

                //数値バリデーション
                if (!validation.validation.is_intager_filling_zero(input_code)) {

                    alert(validation.error_message.is_intager_filling_zero("コード"));

                    input.value = meisai_data.code;
                    return false;

                }


                if (input_code.length != 4) {

                    alert("文字数は4桁である必要があります。");
                    input.value = meisai_data.code;
                    return false;
                }

                var size_code = input_code.substr(0, 2);
                var tokyu_code = input_code.substr(2, 2);

                var size_name = this.sizeSearch(size_code);
                var tokyu_name = this.tokyuSearch(tokyu_code);

                if (size_name == undefined) {

                    alert("サイズがありません");
                    input.value = meisai_data.code;
                    return false;
                }

                if (tokyu_name == undefined) {

                    alert("等級がありません");
                    input.value = meisai_data.code;
                    return false;
                }

                meisai_data.size = size_code;
                meisai_data.tokyu = tokyu_code;
                meisai_data.code = input.value;

                this.numberChange(meisai_data);


            },
            sizeSearch: function (size) {



                //検索して、ものがあれば名称を返し、無ければundefinedで返す
                var result;

                var is_exist = false;
                var key;
                for (var i in this.data.size) {

                    if (i == size) {

                        is_exist = true;
                        key = i;

                    }

                }
                if (is_exist) {
                    result = this.data.size[key];
                }

                return result

            },
            tokyuSearch: function (tokyu) {


                //検索して、ものがあれば名称を返し、無ければundefinedで返す
                var result;

                var is_exist = false;
                var key;
                for (var i in this.data.tokyu) {

                    if (i == tokyu) {

                        is_exist = true;
                        key = i;
                    }

                }

                if (is_exist) {
                    result = this.data.tokyu[key];
                }

                return result;

            },
            //箱数またはバラの値を変化させた時の処理,paramは箱数かバラかのパラメーター
            numberChange: function (meisai_data) {


                if (this.data.syouhin.second.niuke_unit == 0) {
  
                    if (meisai_data.number_of_box == undefined || meisai_data.size == null || meisai_data.bara == undefined) {

                        meisai_data.number = 0;

                        return false;
                    }
                    meisai_data.number = Number(this.data.syouhin.second.number_per_box[meisai_data.size] * meisai_data.number_of_box) + Number(meisai_data.bara);

                } else if (this.syouhin.second.niuke_unit == 1) {

                    if (meisai_data.number_of_box == undefined) {
                        meisai_data.number = 0;
                        return false;
                    }

                    meisai_data.number = meisai_data.number_of_box;
                }


                var total_of_box = this.totalCount("number_of_box");
                var total_of_bara = this.totalCount("bara");
                var total_number = this.totalCount("number");

                this.data.total.number_of_box = total_of_box;
                this.data.total.bara = total_of_bara;
                this.data.total.number = total_number;

            },
            totalCount: function (param) {

                var result = 0;

                for (var i = 0; i < this.data.second.model.meisai.length; i++) {

                    var target_number = this.data.second.model.meisai[i][param];

                    result += target_number;

                }
                return result;
            },
            niukeSearch: function () {


                if (this.data.search.dateStart == "" || this.data.search.dateEnd == "") {

                    alert("日付が入力されていません");

                    return false;
                }
                if (new Date(this.data.search.dateStart).getTime() > new Date(this.data.search.dateEnd).getTime()) {

                    alert("日付の関係が逆になっています");

                    return false;
                }

                //検索を更新するときはresultを初期化
                this.data.search.result = [];


                var postUrl = url.niukeNyuryokuKensaku + "?dateKagen=" + this.data.search.dateStart + "&dateJyogen=" + this.data.search.dateEnd + "&Syorikbn=" + this.data.first.model.syoriKubun;

                if (this.data.search.seisansya.code != "") {

                    postUrl += "&seisansya=" + this.data.search.seisansya.code;
                } else {
                    postUrl += "&seisansya=null";
                }


                axios.get(postUrl)
                    .then(response => {

                        console.log(response.data);
                        for (var i = 0; i < response.data.length; i++) {

                            var data = response.data[i];

                            this.addSearchResult(data.date, data.reception_number, data.seisansya, data.syouhin, data.hinsyu, data.frequency, data.total, data.shizai, data.zentokin);

                        }


                    })
                    .catch(response => console.log(response))


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
            getSyouhinData: function () {
                //※ここで商品コードを元に商品データを取ってきてdata.syouhin.secondの中に入れる

            },
            init: function () {
                //初期化
                this.data.second.model.meisai = [];
                this.data.search.result = [];
                this.data.hinsyu = [];
                this.data.second.model.niukeDate = "";
                this.data.second.model.seisansyaCode = "";
                this.data.second.model.seisansyaName = "";
                this.data.syouhin.second.name = "";
                this.data.second.model.hinsyuCode = "";
                this.data.second.model.hinsyuName = "";
                this.data.receptionNumber = "";
                this.data.syoriKubun.second = "0";
                this.data.total.kayoibako = 0;
                this.data.disabled.niukeConfirm = false;
                this.data.total.number_of_box = 0;
                this.data.total.bara = 0;
                this.data.total.number = 0;
                this.data.shizaidai = 0;
                this.data.zentokin = 0;

   
            },
            update: function () {

                this.$refs['secondForm'].validate((valid) => {

                    if (valid) {

                        if (this.data.syoriKubun.second == 0 && this.data.first.model.syoriKubun == 1) {

                            if (this.data.second.model.meisai.length == 0) {
                                alert("追加する行がありません");
                                return false;
                            }
                        }

                        var message;
                        if (this.data.syoriKubun.second == 0) {
                            message = "登録しますか？";
                        } else if (this.data.syoriKubun.second == 1) {
                            message = "更新しますか？";
                        } else if (this.data.syoriKubun.second == 2) {
                            message = "削除しますか？";
                        }

                        if (window.confirm(message)) {

                            var postArray = {
                                "Reception_number": 0,
                                "Seisansyacd": Number(this.data.second.model.seisansyaCode),
                                "SyoriKbn": this.data.first.model.syoriKubun,
                                "Date": this.data.second.model.niukeDate,
                                "Kaisu": this.$store.state.login.kaisu,
                                "Syohin": Number(this.data.syouhin.second.code),
                                "Hinsyu": this.data.second.model.hinsyuCode,
                                "Nyuryokutantocd": this.$store.state.login.userCode,
                                "Hakogoukei": this.data.total.kayoibako,
                                "ShizaiDai": this.data.shizaidai,
                                "MaewatasiKin": this.data.zentokin,
                                "Nendo": Number(this.data.second.model.niukeDate.split("-")[0]),
                                "JikayoFlg": 0,
                                "Data": [],
                            }
                            if (this.data.first.model.jikayouChecked) {
                                postArray.JikayoFlg = 1
                            } 


                            if (this.data.first.model.syoriKubun == 9) {
                                postArray.Hinsyu = 0;
                            }

                            if (this.data.receptionNumber != "") {
                                postArray.Reception_number = Number(this.data.receptionNumber);
                            }

                       

                            for (var i = 0; i < this.data.second.model.meisai.length; i++) {

                                var data = this.data.second.model.meisai[i];

                                if (data.number == "") {
                                    data.number = 0;
                                }

                                postArray.Data.push({
                                    "Row": i,
                                    "Size": data.size,
                                    "Tokyu": data.tokyu,
                                    "Hako": data.number_of_box,
                                    "Bara": data.bara,
                                    "Suryo": data.number,
                                    "BikouCD": data.note,
                                    "HenpinRiyu": data.reason_of_return,

                                })



                            }

                            console.log(postArray);

                            if (this.data.syoriKubun.second == 0) {

                                axios.post(url.niukeNyuryoku, postArray)
                                    .then(response => {

                                        this.$message({
                                            message: '登録に成功しました',
                                            type: 'success'
                                        });

                                        if (this.data.first.model.syoriKubun == 1) {

                                            window.open(response.data.url)

                                        } 

                                        this.init();
                                    })
                                    .catch(response => {

                                        this.$message({
                                            message: '通信に失敗しました',
                                            type: 'error'
                                        });
                                        console.log(response)
                                    })


                            } else if (this.data.syoriKubun.second == 1) {

                                axios.put(url.niukeNyuryoku, postArray)
                                    .then(response => {
                                       this.$message({
                                            message: '修正に成功しました',
                                            type: 'success'
                                       });

                                        if (this.data.first.model.syoriKubun == 1) {

                                            if (window.confirm("再印刷しますか？")) {
                                                window.open(response.data.url)
                                            }

                                        } 


                                        this.init();
                                     })
                                    .catch(response => {

                                        this.$message({
                                            message: '通信に失敗しました',
                                            type: 'error'
                                        });
                                        console.log(response)
                                    })

                            } else if (this.data.syoriKubun.second == 2) {

                                postArray = {
                                    "Reception_number": this.data.receptionNumber 
                                }

                                axios.delete(url.niukeNyuryoku, { params: postArray })
                                    .then(response => {
                                        
                                       this.$message({
                                            message: '削除に成功しました',
                                            type: 'success'
                                       });

                                        this.init();
                                     })
                                    .catch(response => {

                                        this.$message({
                                            message: '通信に失敗しました',
                                            type: 'error'
                                        });
                                        console.log(response)
                                    })

                            }


                        }

                    }
                });

            },
            finish: function () {
                this.$router.push('/hoshigaki/');  
            },
            getHinsyuSelect: function () {

                var getUrl = url.createGetUrl(url.syohinHinsyuTokyuPatternMaster, [{ key: "paramSyohin", value: this.data.syouhin.second.code }, { key: "paramNendo", value: this.data.second.model.niukeDate.split("-")[0] }]);
                console.log(getUrl);
                axios.get(getUrl)
                    .then(response => {

                        for (var i = 0; i < response.data.length; i++) {

                            var data = response.data[i];

                            var is_exsist = false;

                            for (var k = 0; k < this.data.hinsyu.length; k++) {

                                if (data.hinsyuName == this.data.hinsyu[k].hinsyuName) {
                                    is_exsist = true;
                                }
                            }

                            if (!is_exsist) {
                                this.data.hinsyu.push(data);
                            }

                        }
                        console.log(response.data);
                    })
                    .catch(response => console.log(response))


            },
            getMasterData: function (is_new, meisaiData) {
                //各種必要なマスタデータを取ってくる

                //※等級を取ってくる
                axios.get(url.syohinSizeTokyuPatternMasterNiuke)
                    .then(response => {

                        var Data = [];
                        var syouhinCode = this.data.syouhin.second.code;

                        for (var i = 0; i < response.data.length; i++) {
                            var data = response.data[i];

                            if (syouhinCode == data.syohinCD) {

                                Data.push(data);
                            }

                        }


                        var sizeData = [];
                        var tokyuData = [];



                        for (var i = 0; i < Data.length; i++) {

                            var data = Data[i];


                            var is_size_exsist = false;

                            for (var k = 0; k < sizeData.length; k++) {

                                if (sizeData[k].size == data.size) {
                                    is_size_exsist = true;
                                }

                            }

                            if (!is_size_exsist) {
                                sizeData.push(data);
                            }


                            var is_tokyu_exsist = false;

                            for (var k = 0; k < tokyuData.length; k++) {
                                if (tokyuData[k].tokyu == data.tokyu) {

                                    is_tokyu_exsist = true;
                                }

                            }

                            if (!is_tokyu_exsist) {
                                tokyuData.push(data);
                            }
                        }


                        for (var i = 0; i < sizeData.length; i++) {

                            var size = sizeData[i];

                            if (Number(size.size) < 10) {

                                this.data.size["0" + size.size] = size.sizeHyojimei;

                            } else {

                                this.data.size[size.size] = size.sizeHyojimei;

                            }

                        }


                        for (var i = 0; i < tokyuData.length; i++) {

                            var tokyu = tokyuData[i];
                            if (Number(size.size) < 10) {

                                this.data.tokyu["0" + tokyu.tokyu] = tokyu.tokyuHyojimei

                            } else {

                                this.data.tokyu[tokyu.tokyu] = tokyu.tokyuHyojimei

                            }
                        }


                        console.log(this.data.size, this.data.tokyu);


                        var getUrl = url.createGetUrl(url.sizeWaritukeMaster, [{ key: "paramSyohin", value: this.data.syouhin.second.code }]);



                        axios.get(getUrl)
                            .then(response => {
                                console.log("商品:", response.data);
                                for (var i = 0; i < response.data.length; i++) {
                                    var data = response.data[i]
                                    this.data.syouhin.second.number_per_box["0" + data.code] = data.irisu
                                }





                                axios.get(url.syouhinMaster)
                                    .then(response => {
                                        for (var i in response.data) {
                                            if (this.data.syouhin.second.code == response.data[i].syohinCD) {

                                                this.data.syouhin.second.niuke_unit = response.data[i].niukeTani;
                                            }
                                        }


                                        if (is_new) {


                                        } else {


                                            for (var i in meisaiData) {

                                                this.addMeisai(meisaiData[i].code, meisaiData[i].size, meisaiData[i].tokyu, meisaiData[i].number_of_box, meisaiData[i].bara, meisaiData[i].number, meisaiData[i].note, meisaiData[i].henpinRiyu);

                                            }

                                        }

                                        var total_of_box = this.totalCount("number_of_box");
                                        var total_of_bara = this.totalCount("bara");
                                        var total_number = this.totalCount("number");

                                        this.data.total.number_of_box = total_of_box;
                                        this.data.total.bara = total_of_bara;
                                        this.data.total.number = total_number;

                                        this.data.disabled.niukeConfirm = true;



                                    })
                                    .catch(response => console.log(response))


                            })
                            .catch(response => console.log(response))




                    })
                    .catch(response => console.log(response))






            },

        },
        created: function () {


            //※返品理由を取ってくる

            axios.get(url.henpinRiyuMaster)
                .then(response => {

                    console.log(response.data);

                    for (var i = 0; i < response.data.length; i++) {

                        var data = response.data[i];

                        this.data.reason_of_return[data.key] = data.value;

                    }

                    console.log(this.data.reason_of_return);

                })
                .catch(response => console.log(response))


            //※備考を取ってくる


            axios.get(url.bikouMaster)
                .then(response => {

                    console.log(response.data);

                    for (var i = 0; i < response.data.length; i++) {

                        var data = response.data[i];

                        this.data.note[data.key] = data.value;
                    }

                    console.log(this.data.note);

                })
                .catch(response => console.log(response))


        },
        mounted: function () {

            //※荷受け日付(システム日付)
            this.data.first.model.niukeDate = time.nowJapanDateInput();

            //※端末番号
            this.data.numberOfTerminal = this.$store.state.login.userCode;

            //※荷受回数
            this.data.first.model.kaisu = this.$store.state.login.kaisu;

            this.data.search.dateStart = time.nowJapanDateInput();

            this.data.search.dateEnd = time.nowJapanDateInput();

        },
        watch: {
            'data.first.model.syoriKubun': function () {


                if (this.data.first.model.syoriKubun == 9) {

                    for (var i in this.data.checked) {
                        this.data.first.model.jikayouChecked = false;
                        this.data.first.model.niukeHyouChecked = false;
                        this.data.first.model.niukeHyouHikaeChecked = false;

                    }
                    this.data.first.validation.syouhinCode[0].required = false;


                } else {
                    this.data.first.validation.syouhinCode[0].required = true;
                }

            },


            "data.syoriKubun.second": function (new_value) {

                if (new_value == 0) {

                    this.data.receptionNumber = "";
                    this.data.disabled.receptionNumber = true;
                    this.data.disabled.receptionNumberSearch = true;


                } else if (new_value == 1 || new_value == 2) {

                    this.data.disabled.receptionNumber = false;
                    this.data.disabled.receptionNumberSearch = false;

                }
            },


        }

    }
</script>

<style scoped>
    .search-selected {
        background-color: blue;
        color: white;
    }
    .bold-border-bottom {
        border-bottom: solid 2px #000000;
    }

    th {
        font-size: 1.1rem !important;
        font-weight: bold !important;
        color: black !important;
    }
</style>