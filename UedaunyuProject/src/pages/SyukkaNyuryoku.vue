<template>
    <div>
        <keyboard-events v-on:keydown="keyboardEvent"></keyboard-events>

        <el-card v-if="data.pageNumber == 1">
            <div slot='header'>
                <span>出荷伝票</span>
            </div>
            <div slot='default'>
                <el-form :model="data.first.model" :rules="data.first.validation" ref="firstForm" label-width="120px">
                    <div class='row'>
                        <div class='col-md-3'>
                            <el-form-item label-width="0" prop="syukkaDate">

                                <label for='出荷日付' class='col-form-label px-1' style='width:100%;'>出荷日付</label>
                                <el-input v-model="data.first.model.syukkaDate"
                                          type='date'></el-input>
                            </el-form-item>
                        </div>
                    </div>
                    <div class='row' style="margin-top:2%;margin-left:1%;">
                        <div class='col-md-12' style="margin-top:1%;">
                            <el-checkbox v-model="data.first.model.syukkaDenpyouChecked">出荷伝票(控)印刷する</el-checkbox>
                        </div>
                        <div class='col-md-12' style="margin-top:1%;">
                            <el-checkbox v-model="data.first.model.syukkaKeisansyoChecked">出荷計算書印刷する</el-checkbox>
                        </div>
                        <div class='col-md-12' style="margin-top:1%;">
                            <el-checkbox v-model="data.first.model.nouninsyoChecked">納品書印刷する</el-checkbox>
                        </div>
                    </div>

                </el-form>
                <div class='row'>
                    <div class='col-md-12'>
                        <div style='text-align:right;width:100%;'>
                            <el-button style='margin-left:2%;' type='primary' v-on:click="confirm">確認(F5)</el-button>
                            <el-button style='margin-left:2%;' type='warning' v-on:click="finish">終了(F12)</el-button>
                        </div>
                    </div>
                </div>

            </div>
        </el-card>

        <el-dialog title="出荷データ検索"
                   :visible.sync="data.dialogVisible"
                   width="90%">
            <div class="row">
                <div class='col-md-12'>
                    <label for='出荷日付' class='col-form-label px-1' style='width:100%;'>出荷日付</label>
                    <el-input type='date'
                              style='width:40%;margin-right:2%;'
                              v-model='data.search.dateStart'
                              :max="data.search.dateEnd"></el-input>
                    <span>～</span>
                    <el-input type='date'
                              style='width:40%;margin-right:2%;'
                              :min="data.search.dateStart"
                              v-model='data.search.dateEnd'></el-input>
                </div>
            </div>
            <div class="row">
                <div class='col-md-8'>
                    <label for='市場' class='col-form-label px-1' style='width:100%;'>市場</label>
                    <el-increment-search v-model="data.search.shijoCode"
                                         :display="[{key:'shijyomei',name:'市場名'}]"
                                         :autoComplete="['shijyomei']"
                                         :kind="'市場'"
                                         :required="true"
                                         @update="(r) => data.search.shijoName = r.shijyomei"></el-increment-search>
                    <el-input type='text'
                              style='width:50%;'
                              readonly
                              :placeholder="'市場名'"
                              v-model="data.search.shijoName"></el-input>

                </div>
            </div>
            <div class="row">
                <div class="col-12" style="text-align:right;">
                    <el-button @click="data.dialogVisible = false">終了</el-button>
                    <el-button type="primary" v-on:click="syukkaSearch">検索</el-button>
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
                                    <th>日付</th>
                                    <th>出荷番号</th>
                                    <th>行</th>
                                    <th>市場</th>
                                    <th>商品</th>
                                    <th>品種</th>
                                    <th>サイズ</th>
                                    <th>包装</th>
                                    <th>等級</th>
                                    <th>引</th>
                                    <th>枚数</th>
                                    <th>単価</th>
                                    <th>金額</th>
                                    <th>運賃</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(search_result, index) in data.search.result" v-bind:key="search_result.number" v-bind:class="data.search.selectedIndex == index && 'search-selected'" v-on:click="searchSelectedTr(index)">
                                    <td><el-button type="success" name="name" v-on:click="searchResultSelect(search_result)">選択</el-button></td>
                                    <td>{{search_result.date}}</td>
                                    <td>{{search_result.bill_number}}</td>
                                    <td>{{search_result.row}}</td>
                                    <td>{{search_result.shijo}}</td>
                                    <td>{{search_result.syouhin}}</td>
                                    <td>{{search_result.hinsyu}}</td>
                                    <td>{{search_result.size}}</td>
                                    <td>{{search_result.housou}}</td>
                                    <td>{{search_result.tokyu}}</td>
                                    <td>{{search_result.hiki}}</td>
                                    <td>{{search_result.maisu}}</td>
                                    <td>{{search_result.tanka}}</td>
                                    <td>{{search_result.price}}</td>
                                    <td>{{search_result.unchin}}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </el-card>
        </el-dialog>

        <el-card v-if="data.pageNumber == 2">
            <div slot='header'>
                <span>出荷伝票</span>
            </div>
            <div slot='default'>
                <el-form :model="data.second.model" ref="secondForm" label-width="120px">
                    <div class='row'>
                        <div class='col-md-12'>

                            <el-card>
                                <template slot='default'>
                                    <div class='row'>
                                        <div class='col-md-4'>
                                            <label for='処理区分' class='col-form-label px-1' style='width:100%;'>処理区分</label>
                                            <el-select id="syoriKubun" v-model="data.syoriKubun" style='width:100%;' :disabled="data.disabled.syukkaConfirm">
                                                <el-option :value='0' label="0: 新規"></el-option>
                                                <el-option :value='1' label="1: 修正"></el-option>
                                                <el-option :value='2' label="2: 削除"></el-option>
                                            </el-select>
                                        </div>
                                        <div class='col-md-4'>
                                            <label for='伝票番号' class='col-form-label px-1' style='width:100%;'>伝票番号</label>
                                            <el-input id="billNumber"
                                                      type='text'
                                                      style='width:60%; margin-right:2%;'
                                                      v-model="data.billNumber"
                                                      :disabled="data.syoriKubun == 0 || data.disabled.syukkaConfirm"></el-input>
                                            <el-button id="billNumberSearch"
                                                       type='danger'
                                                       icon="el-icon-search"
                                                       style='width:20%;display:inline;'
                                                       @click="data.dialogVisible = true"
                                                       :disabled="data.syoriKubun == 0 || data.disabled.syukkaConfirm">検索</el-button>

                                        </div>
                                        <div class='col-md-4'>
                                            <label for='確認' class='col-form-label px-1'>確認</label>
                                            <el-button type='primary'
                                                       style="display:block;"
                                                       v-on:click="syukkaConfirm"
                                                       :disabled="data.disabled.syukkaConfirm">確認</el-button>
                                        </div>
                                    </div>
                                </template>
                            </el-card>
                        </div>
                    </div>
                    <div class='row' style="margin-top:3%;">
                        <div class='col-md-6' style="margin-bottom:2%;">
                            <label for='出荷日付' class='col-form-label px-1'>出荷日付</label>
                            <el-form-item label-width="0"
                                          prop="syukkaDate"
                                          :rules="{
                                                              required: true, message: '出荷日付が入力されていません', trigger: 'blur'
                                                              }"
                                          style="margin:0;">

                                <el-input type="date"
                                          v-model="data.second.model.syukkaDate" v-bind:disabled="data.syoriKubun == 0 || !data.disabled.syukkaConfirm"></el-input>
                            </el-form-item>
                        </div>
                    </div>
                    <div class='row'>
                        <div class='col-md-6' style="margin-bottom:2%;">
                            <!--インクリメントサーチ-->
                            <label for='市場' class='col-form-label px-1' style='width:100%;'>市場</label>
                            <el-form-item label-width="0"
                                          prop="shijyoCode"
                                          :rules="{
                                                              required: true, message: '市場コードが入力されていません', trigger: 'change'
                                                              }"
                                          style="margin:0;">

                                <el-increment-search v-model="data.second.model.shijyoCode"
                                                     :display="[{key:'shijyomei',name:'名前'}]"
                                                     :autoComplete="['shijyomei','tesuryoKbn','tesuryoRate']"
                                                     :kind="'市場'"
                                                     :required="true"
                                                     :disabled="!data.disabled.syukkaConfirm"
                                                     @update="changeShijyoCD"></el-increment-search>
                                <el-input type='text'
                                          style='width:50%;'
                                          readonly
                                          :placeholder="'市場名'"
                                          :disabled="!data.disabled.syukkaConfirm"
                                          v-model="data.second.model.shijyoName"></el-input>
                            </el-form-item>
                        </div>
                        <div class='col-md-6' style="margin-bottom:2%;">
                            <label for='部門' class='col-form-label px-1' style='width:100%;'>部門</label>
                            <el-form-item label-width="0"
                                          prop="bumonCode"
                                          :rules="{
                                                              required: true, message: '部門コードが入力されていません', trigger: 'change'
                                                              }"
                                          style="margin:0;">

                                <el-increment-search v-model="data.second.model.bumonCode"
                                                     :display="[{key:'bumonmei',name:'名前'}]"
                                                     :autoComplete="['bumonmei']"
                                                     :kind="'部門'"
                                                     :required="true"
                                                     :disabled="!data.disabled.syukkaConfirm"
                                                     @update="(r) => data.second.model.bumonName = r.bumonmei"></el-increment-search>
                                <el-input type='text'
                                          style='width:50%;'
                                          readonly
                                          :placeholder="'部門名'"
                                          :disabled="!data.disabled.syukkaConfirm"
                                          v-model="data.second.model.bumonName"></el-input>
                            </el-form-item>
                        </div>
                        <div class='col-md-4' style="margin-bottom:2%;">
                            <label for='手数料' class='col-form-label px-1' style='width:100%;'>手数料</label>
                            <el-form-item label-width="0"
                                          prop="tesuryou"
                                          :rules="{
                                                              required: true, message: '手数料が入力されていません', trigger: 'blur'
                                                              }"
                                          style="margin:0;">

                                <el-input-number style='width:80%;'
                                                 controls-position="right"
                                                 type='text'
                                                 :min="0"
                                                 v-model="data.second.model.tesuryou"
                                                 :disabled="!data.disabled.syukkaConfirm"></el-input-number>
                            </el-form-item>
                        </div>
                    </div>
                    <el-card style="margin-top:3%;">
                        <div slot='header'>
                            <span>明細</span>
                        </div>
                        <div class="row">
                            <div class="" style="white-space:nowrap;overflow-x:scroll;">
                                <table class="table" style="max-width:200%;width:130%;">
                                    <thead>
                                        <tr>
                                            <th style="width:3%;"></th>
                                            <th style="width:4%;">削除</th>
                                            <th style="width:10%;">コード</th>
                                            <th style="width:5%;">商品</th>
                                            <th style="width:5%;">品種</th>
                                            <th style="width:5%;">サイズ</th>
                                            <th style="width:7%;">包装</th>
                                            <th style="width:7%;">入数</th>
                                            <th style="width:8%;">市場等級</th>
                                            <th style="width:8%;">組合等級</th>
                                            <th style="width:5%;">甲入数</th>
                                            <th style="width:5%;">甲数</th>
                                            <th style="width:8%;">枚数</th>
                                            <th style="width:5%;">単価</th>
                                            <th style="width:7%;">金額</th>
                                            <th style="width:7%;">運賃</th>
                                            <th style="width:7%;">単価</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(meisai_data, index) in data.second.model.meisai" v-bind:key="meisai_data.number">
                                            <td>{{index}}</td>
                                            <td><el-button type="primary" name="name" v-on:click="meisaiRemove(index)" v-bind:disabled="data.syoriKubun == 2">削除</el-button></td>
                                            <td>
                                                <el-form-item label-width="0"
                                                              :prop="'meisai[' + index + '].code'"
                                                              :rules="{
                                                              required: true, message: 'コードが入力されていません', trigger: 'blur'
                                                              }"
                                                              style="margin:0;"
                                                              >

                                                    <input class="form-control" type="text" name="name" v-bind:value="meisai_data.code" v-on:change="meisaiCodeCheck(meisai_data,$event.target,index)" v-bind:disabled="data.syoriKubun == 2" />
                                                </el-form-item>
                                            </td>
                                            <td>
                                                {{data.syouhin[meisai_data.syouhin]}}
                                            </td>
                                            <td>
                                                {{hinsyuSearch(meisai_data.hinsyu, meisai_data.syouhin) == undefined ? "" : hinsyuSearch(meisai_data.hinsyu, meisai_data.syouhin).hinsyumei}}
                                            </td>
                                            <td>
                                                {{sizeSearch(meisai_data.size, meisai_data.syouhin) == undefined ? "" : sizeSearch(meisai_data.size, meisai_data.syouhin).sizemei}}
                                           </td>
                                            <td>
                                                {{housouSearch(meisai_data.housou, meisai_data.syouhin) == undefined ? "" : housouSearch(meisai_data.housou, meisai_data.syouhin).hosomei}}
                                            </td>
                                            <td>
                                                <el-form-item label-width="0"
                                                              :prop="'meisai[' + index + '].irisu'"
                                                              :rules="{
                                                              required: true, message: '入数が入力されていません', trigger: 'blur'
                                                              }"
                                                              style="margin:0;">

                                                    <el-input-number name="name"
                                                                     v-model="meisai_data.irisu" :disabled="meisai_data.sainyuryokukbn == 0  || data.syoriKubun == 2"
                                                                     :min="0"
                                                                     controls-position="right"></el-input-number>

                                                </el-form-item>
                                            </td>
                                            <td>
                                                <el-form-item label-width="0"
                                                              :prop="'meisai[' + index + '].sijotokyu'"
                                                              :rules="{
                                                              required: true, message: '市場等級が入力されていません', trigger: 'blur'
                                                              }"
                                                              style="margin:0;">
                                                    <el-select name="name" v-model="meisai_data.sijotokyu" v-bind:disabled="data.syoriKubun == 2">
                                                        <el-option v-for="(shijotokyu_option, index_key) in data.shijoTokyu" v-bind:key="shijotokyu_option.number" :value="shijotokyu_option.shijyotokyu" :label="shijotokyu_option.tokyuHyojimei" v-if="correspondingWithSyouhinCD(meisai_data,shijotokyu_option)"></el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </td>
                                            <td>
                                                <el-form-item label-width="0"
                                                              :prop="'meisai[' + index + '].kumiaitokyu'"
                                                              :rules="{
                                                              required: true, message: '組合等級が入力されていません', trigger: 'blur'
                                                              }"
                                                              style="margin:0;">

                                                    <el-select name="name" v-model="meisai_data.kumiaitokyu" v-bind:disabled="data.syoriKubun == 2">
                                                        <el-option v-for="(kumiaitokyu_option, index_key) in data.kumiaiTokyu" v-bind:key="kumiaitokyu_option.number" :value="kumiaitokyu_option.kumiaitokyu" :label="kumiaitokyu_option.tokyuHyojimei" v-if="correspondingWithSyouhinCD(meisai_data,kumiaitokyu_option)"></el-option>
                                                    </el-select>

                                                </el-form-item>
                                            </td>
                                            <td>
                                                <el-form-item label-width="0"
                                                              :prop="'meisai[' + index + '].kouirisu'"
                                                              :rules="{
                                                              required: true, message: '甲入数が入力されていません', trigger: 'blur'
                                                              }"
                                                              style="margin:0;">

                                                    <el-input-number name="name"
                                                                     v-model="meisai_data.kouirisu" :disabled="data.syoriKubun == 2"
                                                                     controls-position="right"
                                                                     :min="0"
                                                                     @change="changeMeisaiMaisu(meisai_data),changeMeisaiPrice(meisai_data)"></el-input-number>
                                                </el-form-item>
                                            </td>
                                            <td>
                                                <el-form-item label-width="0"
                                                              :prop="'meisai[' + index + '].kousu'"
                                                              :rules="{
                                                              required: true, message: '甲数が入力されていません', trigger: 'blur'
                                                              }"
                                                              style="margin:0;">

                                                    <el-input-number name="name"
                                                                     v-model="meisai_data.kousu" :disabled="data.syoriKubun == 2"
                                                                     @change="changeMeisaiMaisu(meisai_data),changeMeisaiPrice(meisai_data)"
                                                                     :min="0"
                                                                     controls-position="right"></el-input-number>

                                                </el-form-item>
                                            </td>
                                            <td>
                                                <el-form-item label-width="0"
                                                              :prop="'meisai[' + index + '].maisu'"
                                                              :rules="{
                                                              required: true, message: '枚数が入力されていません', trigger: 'blur'
                                                              }"
                                                              style="margin:0;">


                                                    <el-input v-model="meisai_data.maisu"
                                                              :disabled="data.syoriKubun == 2"
                                                              readonly></el-input>

                                                </el-form-item>
                                            </td>
                                            <td>
                                                <el-form-item label-width="0"
                                                              :prop="'meisai[' + index + '].tanka'"
                                                              :rules="{
                                                              required: true, message: '単価が入力されていません', trigger: 'blur'
                                                              }"
                                                              style="margin:0;">


                                                    <el-input-number name="name"
                                                                     v-model="meisai_data.tanka" :disabled="data.syoriKubun == 2"
                                                                     :precision="2" :step="0.1"
                                                                     :min="0"
                                                                     @change="changeMeisaiPrice(meisai_data)"
                                                                     controls-position="right"></el-input-number>
                                                </el-form-item>
                                            </td>
                                            <td>
                                                <el-form-item label-width="0"
                                                              :prop="'meisai[' + index + '].price'"
                                                              :rules="{
                                                              required: true, message: '金額が入力されていません', trigger: 'blur'
                                                              }"
                                                              style="margin:0;">


                                                    <el-input v-model="meisai_data.price"
                                                              :disabled="data.syoriKubun == 2"
                                                              readonly></el-input>

                                                </el-form-item>
                                            </td>
                                            <td>
                                                <el-form-item label-width="0"
                                                              :prop="'meisai[' + index + '].unchin'"
                                                              :rules="{
                                                              required: true, message: '運賃が入力されていません', trigger: 'blur'
                                                              }"
                                                              style="margin:0;">


                                                    <el-input v-model="meisai_data.unchin"
                                                              :disabled="data.syoriKubun == 2"
                                                              readonly></el-input>

                                                </el-form-item>
                                            </td>
                                            <td><el-button type="success" name="name" v-on:click="bunkatsuTankaNyuryoku(meisai_data,index)" v-bind:disabled="data.syoriKubun == 2">単価</el-button></td>

                                        </tr>
                                    </tbody>
                                    <tr>
                                        <td colspan="17" style="text-align:center;">
                                            <el-button type='primary'
                                                       style='width:40%;display:inline;'
                                                       @click="addMeisai('', null, '', '', '', 0, 1,'', '', 0, 0, 0, 0, 0, '','',[])"
                                                       :disabled="data.syoriKubun == 2 || !data.disabled.syukkaConfirm">明細を追加</el-button>
                                        </td>
                                    </tr>
                                    <tbody>
                                        <tr>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td>合計</td>
                                            <td>
                                                <el-input :value="returnTotalKousu()"
                                                          readonly></el-input>
                                            </td>
                                            <td>
                                                <el-input :value="returnTotalMaisu()"
                                                          readonly></el-input>
                                            </td>
                                            <td></td>
                                            <td>
                                                <el-input :value="returnTotalPrice()"
                                                          readonly></el-input>
                                            </td>
                                            <td>
                                                <el-input :value="returnTotalUnchin()"
                                                          readonly></el-input>
                                            </td>
                                            <td></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div class="row" style="margin-top:3%;">
                            <div class='col-md-4'>
                                <el-checkbox v-model="data.checked.goukeiInji">合計印字する</el-checkbox>
                            </div>
                        </div>
                        <div style='text-align:right;width:100%;'>
                            <el-button id="updateButton" type='success' :disabled="!data.disabled.syukkaConfirm" v-on:click="update">{{data.updateButton}}(F9)</el-button>
                            <el-button style='margin-left:2%;' type='warning' v-on:click="init">画面クリア(F10)</el-button>
                            <el-button style='margin-left:2%;' type='primary' v-on:click="finish">終了(F12)</el-button>
                        </div>
                    </el-card>
                </el-form>
            </div>
        </el-card>
        <el-card v-if="data.pageNumber == 3">
            <div slot='header'>
                <span>出荷伝票(分割単価入力)</span>
            </div>
            <div slot='default'>
                <form id="niukeNyuryokuForm" v-focus-first-on-load v-focus-next-on-enter class='vld-parent'>
                    <div class='row'>
                        <div class='col-md-3'>
                            <label for='出荷日付' class='col-form-label px-1' style='width:100%;'>出荷日付</label>
                            <el-input v-model="data.first.model.syukkaDate"
                                      type='date'
                                      readonly></el-input>
                        </div>
                    </div>
                    <div class='row' style="margin-top:2%;">
                        <div class='col-md-12' style="margin-top:1%;">
                            <label for='市場' class='col-form-label px-1' style='width:100%;'>市場</label>
                            <el-input v-model="data.second.model.shijyoName"
                                      type='text'
                                      style='width:30%;'
                                      readonly></el-input>
                        </div>
                    </div>
                    <div class='row' style="margin-top:2%;">
                        <div class='col-md-2' style="margin-top:1%;">
                            <label for='商品' class='col-form-label px-1' style='width:100%;'>商品</label>
                            <el-input :value="data.syouhin[data.second.model.meisai[data.selectedBunkatsuTankaIndex].syouhin]"
                                      type='text'
                                      readonly></el-input>
                        </div>
                        <div class='col-md-2' style="margin-top:1%;">
                            <label for='品種' class='col-form-label px-1' style='width:100%;'>品種</label>
                            <el-input :value="data.hinsyu[data.second.model.meisai[data.selectedBunkatsuTankaIndex].hinsyu] == undefined ? '' : data.hinsyu[data.second.model.meisai[data.selectedBunkatsuTankaIndex].hinsyu].hinsyumei"
                                      type='text'
                                      readonly></el-input>
                        </div>
                        <div class='col-md-2' style="margin-top:1%;">
                            <label for='サイズ' class='col-form-label px-1' style='width:100%;'>サイズ</label>
                            <el-input :value="data.size[data.second.model.meisai[data.selectedBunkatsuTankaIndex].size] == undefined ? '' : data.size[data.second.model.meisai[data.selectedBunkatsuTankaIndex].size].sizemei"
                                      type='text'
                                      readonly></el-input>
                        </div>
                        <div class='col-md-2' style="margin-top:1%;">
                            <label for='品種' class='col-form-label px-1' style='width:100%;'>包装</label>
                            <el-input :value="data.housou[data.second.model.meisai[data.selectedBunkatsuTankaIndex].housou] == undefined ? '' : data.housou[data.second.model.meisai[data.selectedBunkatsuTankaIndex].housou].hosomei"
                                      type='text'
                                      readonly></el-input>
                        </div>

                        <div class='col-md-3' style="margin-top:1%;">
                            <label for='等級' class='col-form-label px-1' style='width:100%;'>等級</label>
                            <el-input :value="getShijyoTokyuByShijyoTokyuCD(data.second.model.meisai[data.selectedBunkatsuTankaIndex].shijotokyu) == undefined ? '' : getShijyoTokyuByShijyoTokyuCD(data.second.model.meisai[data.selectedBunkatsuTankaIndex].shijotokyu).tokyuHyojimei"
                                      type='text'
                                      readonly></el-input>
                        </div>

                    </div>
                    <div class='row' style="margin-top:2%;">
                        <div class='col-md-12' style="margin-top:1%;">
                            <label for='合計枚数' class='col-form-label px-1' style='width:100%;'>合計枚数</label>
                            <el-input v-model="data.second.model.meisai[data.selectedBunkatsuTankaIndex].maisu"
                                      type='text'
                                      style='width:30%;'
                                      readonly></el-input>
                        </div>
                    </div>
                    <div class="row">
                        <div class='col-md-12' style="margin-top:2%;">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>削除</th>
                                        <th>枚数</th>
                                        <th>単価</th>
                                        <th>金額</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(meisai_data, index) in data.second.model.meisai[data.selectedBunkatsuTankaIndex].meisaibunkatuData" v-bind:key="meisai_data.number">
                                        <td>{{index}}</td>
                                        <td><el-button type="primary" name="name" v-on:click="removeBunkatsuMeisai(index)">削除</el-button></td>
                                        <td>
                                            <el-input-number v-model="meisai_data.maisu"
                                                             controls-position="right"
                                                             style="width:100%;"
                                                             :min="0"
                                                             @change="bunkatsuMeisaiKingaku(meisai_data)"></el-input-number>
                                        </td>
                                        <td>
                                            <el-input-number name="name"
                                                             v-model="meisai_data.tanka" :disabled="data.syoriKubun == 2"
                                                             :precision="2" :step="0.1"
                                                             style="width:100%;"
                                                             :min="0"
                                                             @change="bunkatsuMeisaiKingaku(meisai_data)"
                                                             controls-position="right"></el-input-number>
                                        </td>
                                        <td>
                                            <el-input :value="meisai_data.kingaku"
                                                      style="width:100%;"
                                                      readonly></el-input>
                                        </td>

                                    </tr>
                                </tbody>
                                <tr>
                                    <td colspan="5" style="text-align:center;">
                                        <el-button type='primary'
                                                   style='width:40%;display:inline;'
                                                   @click="addBunkatsuMeisai()"
                                                   :disabled="data.syoriKubun == 2 || !data.disabled.syukkaConfirm">明細を追加</el-button>
                                    </td>
                                </tr>

                                <tbody>
                                    <tr>
                                        <td></td>
                                        <td>合計</td>
                                        <td>
                                            <el-input :value="returnBunkatsuTotalMaisu()"
                                                      readonly></el-input>
                                        </td>
                                        <td></td>
                                        <td>
                                            <el-input :value="returnBunkatsuTotalPrice()"
                                                      readonly></el-input>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                        </div>
                    </div>
                </form>
                <div class='row'>
                    <div class='col-md-12'>
                        <div style='text-align:right;width:100%;'>
                            <el-button style='margin-left:2%;' type='primary' v-on:click="bunkatsuTankaNyuryokuUpdate">更新(F5)</el-button>
                            <el-button style='margin-left:2%;' type='warning' v-on:click="data.pageNumber = 2">戻る(F12)</el-button>
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
    import exsist from '@/js/status/exsist.js'
    import time from '@/js/status/time.js'
    import ElIncrementSearch from '@/components/IncrementSearch.vue'
    import url from '@/js/api_url.js'

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
                    pageNumber: 1,
                    first: {
                        model: {
                            syukkaDate: "",
                            syukkaDenpyouChecked: false,
                            syukkaKeisansyoChecked: false,
                            nouninsyoChecked: false,

                        },
                        validation: {
                            syukkaDate: [
                                { required: true, message: '出荷日付が入力されていません', trigger: 'blur' },
                            ],

                        }

                    },
                    syukkaDate: {
                        first: "",
                        second: "",
                    },
                    checked: {
                        goukeiInji: false,
                    },
                    disabled: {
                        updateButton: true,
                        meisaiIrisu: false,
                        syukkaConfirm: false,

                    },
                    second: {
                        model: {
                            syukkaDate: "",
                            shijyoCode: "",
                            shijyoName: "",
                            bumonCode: "",
                            bumonName: "",
                            tesuryou: "",
                            meisai: []
                        }

                    },
                    selectedBunkatsuTankaIndex: null,
                    billNumber: "",
                    syoriKubun: 0,
                    dialogVisible: false,
                    search: {
                        dateStart: "0001-01-01",
                        dateEnd: "9999-12-31",
                        shijoCode: "",
                        shijoName: "",
                        result: [
                        ],
                        selectedIndex: null,
                    },
                    shijo: {
                        code: "",
                        name: ""
                    },
                    bumon: {
                        code: "",
                        name: ""
                    },
                    tesuryou: 0,
                    meisai: [
                    ],
                    updateButton: "登録",
                    syouhin: {
                    },
                    hinsyu: [
                    ],
                    size: [
                    ],
                    housou: [
                    ],
                    shijoTokyu: [
                    ],
                    kumiaiTokyu: [
                    ],
                    unchin: [
                    ],
                    shijyo: [
                    ],
                    bunkatsuTankaNyuryoku: {
                        index: null,
                        syouhin: "",
                        hinsyu: "",
                        size: "",
                        housou: "",
                        tokyu: "",
                        totalMaisu: "",
                        meisai: [
                            { maisu: 0, tanka: 0 },

                        ],

                    }




                },
            }
        },
        methods: {
            keyboardEvent(e) {
                if (e.keyCode == config.KEY_CODES.F5) {

                    if (this.data.pageNumber == 1) {
                        this.confirm()
                    }
                }
                if (e.keyCode == config.KEY_CODES.F9) {
                    if (this.data.pageNumber == 2) {
                        if (this.data.disabled.syukkaConfirm) {
                            this.update()
                        }
                    }
                    if (this.data.pageNumber == 3) {

                        this.bunkatsuTankaNyuryokuUpdate()
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
            confirm: function () {
                this.$refs['firstForm'].validate((valid) => {

                    if (valid) {

                        this.data.pageNumber = 2;

                    }

                });
            },
            syukkaConfirm: function () {
                //仕様書を見た感じ提出前にチェックする必要性が無いように感じるが、もし入力チェックがある場合はここに追加

                var select_value = this.data.syoriKubun;

                if (select_value == 0) {
                    //新規の時
                    //第一画面の荷受け日付を第二画面の荷受け日付に変えて、disabledにする
                    this.data.second.model.syukkaDate = this.data.first.model.syukkaDate;

                    this.addMeisai('', null, '', '', '', 0, 1, '', '', 0, 0, 0, 0, 0, '', '',[]);


                } else if (select_value == 1 || select_value == 2) {

                    if (this.data.billNumber == "") {
                        alert("伝票番号を検索してください");
                        return false;
                    }

                    var getUrl = url.createGetUrl(url.syukkaNyuryoku, [{ key: "paramSyukkaBango", value: this.data.billNumber }]);



                    axios.get(getUrl)
                        .then(response => {

                            console.log(response.data);

                            var data = response.data[0];

                            if (data.meisaiData.length == 0) {

                                alert("データがありません");
                                return false;
                            }

                            //※検索で選択したデータを明細に追加する。とりあえずは適当なデータを明細に入れるので、後にdbから取ってくる
                            //明細の行を初期化
                            this.data.second.model.meisai = [];

                            this.data.second.model.syukkaDate = data.syukkaDate;
                            this.data.second.model.shijyoCode = data.shijouCode;
                            this.data.second.model.shijyoName = data.shijouName;
                            this.data.second.model.tesuryou = data.tesuryou;
                            this.data.second.model.bumonCode = data.bumonCode;
                            this.data.second.model.bumonName = data.bumonName;

                            for (var i = 0; i < data.meisaiData.length; i++) {

                                var meisai = data.meisaiData[i];

                                this.addMeisai(meisai.code, meisai.syouhin, meisai.hinsyu, meisai.size, meisai.housou, meisai.sainyuryokukbn, meisai.irisu, meisai.shijotokyu, meisai.kumiaitokyu, meisai.kouirisu, meisai.kousu, meisai.maisu, meisai.tanka, meisai.price, meisai.unchin, meisai.unchincd, meisai.meisaibunkatuData);


                            }





                            if (select_value == 2) {
                                //更新ボタンの中身編集
                                this.data.updateButton = "削除"

                            } else if (select_value == 1) {
                                this.data.updateButton = "編集"
                            }


                        })
                        .catch(response => console.log(response))



                }
                this.data.disabled.syukkaConfirm = true;
            },
            createMeisaiData: function (code, syouhin, hinsyu, size, housou, irisu, sainyuryokukbn, sijotokyu, kumiaitokyu, kouirisu, kousu, maisu, tanka, price, unchin, unchincd, meisaibunkatuData) {

                return {
                    code: code,
                    syouhin: syouhin,
                    hinsyu: hinsyu,
                    size: size,
                    housou: housou,
                    irisu: irisu,
                    sainyuryokukbn: sainyuryokukbn,
                    sijotokyu: sijotokyu,
                    kumiaitokyu: kumiaitokyu,
                    kouirisu: kouirisu,
                    kousu: kousu,
                    maisu: maisu,
                    tanka: tanka,
                    price: price,
                    unchin: unchin,
                    unchincd: unchincd,
                    meisaibunkatuData: meisaibunkatuData,
                };

            },
            addMeisai: function (code, syouhin, hinsyu, size, housou, irisu, sainyuryokukbn, sijotokyu, kumiaitokyu, kouirisu, kousu, maisu, tanka, price, unchin, unchincd, meisaibunkatuData) {

                var data = this.createMeisaiData(code, syouhin, hinsyu, size, housou, irisu, sainyuryokukbn, sijotokyu, kumiaitokyu, kouirisu, kousu, maisu, tanka, price, unchin, unchincd, meisaibunkatuData);

                this.data.second.model.meisai.push(data);


            },
            //クリックした検索結果を青くする
            searchSelectedTr: function (index) {

                this.data.search.selectedIndex = index;
            },
            searchResultSelect(search_result) {

                this.data.billNumber = search_result.bill_number;
                //モーダルを閉じる
                this.data.dialogVisible = false;


            },
            createSearchResultData: function (date, bill_number, row, shijo, syouhin, hinsyu, size, housou, tokyu, hiki, maisu, tanka, price, unchin) {

                return {
                    date: date,
                    bill_number: bill_number,
                    row: row,
                    shijo: shijo,
                    syouhin: syouhin,
                    hinsyu: hinsyu,
                    size: size,
                    housou: housou,
                    tokyu: tokyu,
                    hiki: hiki,
                    maisu: maisu,
                    tanka: tanka,
                    price: price,
                    unchin: unchin,
                };

            },
            addSearchResult: function (date, bill_number, row, shijo, syouhin, hinsyu, size, housou, tokyu, hiki, maisu, tanka, price, unchin) {

                var data = this.createSearchResultData(date, bill_number, row, shijo, syouhin, hinsyu, size, housou, tokyu, hiki, maisu, tanka, price, unchin);

                this.data.search.result.push(data);


            },
            syukkaSearch: function () {


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

                var getArray = [
                    { key: "paramKaisiSyukkaHiduke", value: this.data.search.dateStart },
                    { key: "paramSyuryoShukkaHiduke", value: this.data.search.dateEnd },
                ];

                if (this.data.search.shijoCode != "") {
                    getArray.push({ key: "paramSijoCd", value: this.data.search.shijoCode });

                } else {
                    getArray.push({ key: "paramSijoCd", value: null });
                }

                var getUrl = url.createGetUrl(url.syukkaNyuryokuKensaku, getArray);


                axios.get(getUrl)
                    .then(response => {

                        console.log(response.data);
                        for (var i = 0; i < response.data.length; i++) {

                            var data = response.data[i];


                            this.addSearchResult(data.date, data.bill_number, data.row, data.shijo, data.syouhin, data.hinsyu, data.size, data.housou, data.tokyu, data.hiki, data.maisu, data.tanka, data.price, data.unchin);

                        }


                    })
                    .catch(response => console.log(response))

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


                if (input_code.length != 5) {

                    alert("文字数は5桁である必要があります。");
                    input.value = meisai_data.code;
                    return false;
                }

                var syouhin_code = Number(input_code.substr(0, 1));
                var hinsyu_code = Number(input_code.substr(1, 1));
                var size_code = Number(input_code.substr(2, 2));
                var housou_code = input_code.substr(4, 1);

                var syouhin_name = this.syouhinSearch(syouhin_code);
                var hinsyu = this.hinsyuSearch(hinsyu_code, syouhin_code);
                var size = this.sizeSearch(size_code, syouhin_code);
                var housou = this.housouSearch(housou_code, syouhin_code);

                var alert_name;

                if (syouhin_name == undefined) {
                    alert_name = "商品";
                }
                if (hinsyu == undefined) {
                    alert_name = "品種";
                }
                if (size == undefined) {
                    alert_name = "サイズ";
                }
                if (housou == undefined) {
                    alert_name = "包装";
                }

                if (alert_name != undefined) {
                    alert(alert_name + "がありません");
                    input.value = meisai_data.code;
                    return false;
                }


                //入数と入数再入力区分、運賃コードの取得
                meisai_data.sainyuryokukbn = housou.sainyuryokukbn;
                meisai_data.irisu = housou.datas[size_code];
                meisai_data.unchincd = housou.unchincd;


                this.calculateUnchin(meisai_data);

                meisai_data.syouhin = syouhin_code;
                meisai_data.hinsyu = hinsyu_code;
                meisai_data.size = size_code;
                meisai_data.housou = housou_code;

                meisai_data.code = input.value;
                console.log(this.data.hinsyu);

            },
            getHinsyuArrrayBySyouhinCode: function (syouhinCode) {

                var result = [];

                for (var i = 0; i < this.data.hinsyu.length; i++) {

                    if (this.data.hinsyu[i].syohincd == syouhinCode) {

                        result.push(this.data.hinsyu[i]);
                    }

                }
                return result;
            },
            getSizeArrrayBySyouhinCode: function (syouhinCode) {

                var result = [];

                for (var i = 0; i < this.data.size.length; i++) {

                    if (this.data.size[i].syohincd == syouhinCode) {

                        result.push(this.data.size[i]);
                    }

                }
                return result;
            },
            getHousouArrrayBySyouhinCode: function (syouhinCode) {

                var result = [];
                for (var i = 0; i < this.data.housou.length; i++) {

                    if (this.data.housou[i].syohincd == syouhinCode) {

                        result.push(this.data.housou[i]);
                    }

                }
                return result;
            },
            //とりあえずdataから検索してます。検索をリアルタイムで行う場合は、ここにajax式を入れてdataの該当するプロパティを変えます
            syouhinSearch: function (syouhin) {

                return exsist.is_exsist_by_key(syouhin, this.data.syouhin);


            },
            hinsyuSearch: function (hinsyu, syouhin) {

                return exsist.is_exsist_by_object_value(hinsyu, this.getHinsyuArrrayBySyouhinCode(syouhin), "hinsyucd");
            },
            sizeSearch: function (size, syouhin) {

                return exsist.is_exsist_by_object_value(size, this.getSizeArrrayBySyouhinCode(syouhin), "sizecd");

            },
            housouSearch: function (housou, syouhin) {

                return exsist.is_exsist_by_object_value(housou, this.getHousouArrrayBySyouhinCode(syouhin), "hosocd");

            },
            getShijyoTokyuByShijyoTokyuCD: function (shijyoTokyuCD) {

                var result
                for (var i = 0; i < this.data.shijoTokyu.length; i++) {

                    if (this.data.shijoTokyu[i].shijyotokyu == shijyoTokyuCD) result = this.data.shijoTokyu[i];
                }

                return result


            },
            getShijyoByShijyoCD: function (shijyoCD) {

                var result
                for (var i = 0; i < this.data.shijyo.length; i++) {

                    if (this.data.shijyo[i].shijyoCD == shijyoCD) result = this.data.shijyo[i];
                }

                return result
            },
            getUnchin: function (unchinCD, unchinRank) {

                var unchin;

                for (var i = 0; i < this.data.unchin.length; i++) {

                    var data = this.data.unchin[i];

                    if (data.unchinCD == unchinCD && data.unchinRank == unchinRank) {
                        unchin = data.unchin;
                    }

                }

                return unchin;
            },
            calculateUnchin: function (meisai) {

                if (meisai.unchincd == "" || meisai.maisu == undefined || this.data.second.model.shijyoCode == undefined || this.data.second.model.shijyoCode == "") {


                    meisai.unchin = "";

                } else {

                    var shijyo = this.getShijyoByShijyoCD(Number(this.data.second.model.shijyoCode));
                    var unchin = this.getUnchin(meisai.unchincd, shijyo.unchinRank);

                    meisai.unchin = unchin * meisai.maisu;

                }

            },
            changeShijyoCD: function (new_value) {

                this.data.second.model.shijyoName = new_value.shijyomei

                if (new_value.tesuryoKbn == 1) {
                    this.data.second.model.tesuryou = 0
                } else {
                    this.data.second.model.tesuryou = new_value.tesuryoRate
                }

                for (var i = 0; i < this.data.second.model.meisai.length; i++) {

                    this.calculateUnchin(this.data.second.model.meisai[i]);
                }

            },
            changeMeisaiMaisu: function (meisai_data) {

                console.log(meisai_data);

                if (meisai_data.kouirisu == undefined || meisai_data.kousu == undefined) {

                    meisai_data.maisu = "";

                } else {
                    meisai_data.maisu = meisai_data.kouirisu * meisai_data.kousu;

                }
                this.calculateUnchin(meisai_data);

            },
            changeMeisaiPrice: function (meisai_data) {


                if (meisai_data.maisu == undefined || meisai_data.tanka == undefined) {

                    meisai_data.price = "";

                } else {
                    meisai_data.price = Math.floor(meisai_data.maisu * meisai_data.tanka);

                }


            },
            returnTotalKousu: function () {

                var result = 0;
                for (var i in this.data.second.model.meisai) {
                    result += this.data.second.model.meisai[i].kousu;
                }
                return result;
            },
            returnTotalMaisu: function () {

                var result = 0;
                for (var i in this.data.second.model.meisai) {
                    result += this.data.second.model.meisai[i].maisu;
                }
                return result;
            },
            returnTotalPrice: function () {

                var result = 0;
                for (var i in this.data.second.model.meisai) {
                    result += this.data.second.model.meisai[i].price;
                }
                return Math.floor(result);
            },
            returnTotalUnchin: function () {

                var result = 0;
                for (var i in this.data.second.model.meisai) {
                    result += this.data.second.model.meisai[i].unchin;
                }
                return result;
            },
            bunkatsuTankaNyuryoku: function (meisai_data, index) {

                this.data.selectedBunkatsuTankaIndex = index;

                this.data.pageNumber = 3;
            },
            returnBunkatsuTotalMaisu: function () {

                var result = 0;
                for (var i in this.data.second.model.meisai[this.data.selectedBunkatsuTankaIndex].meisaibunkatuData) {
                    result += this.data.second.model.meisai[this.data.selectedBunkatsuTankaIndex].meisaibunkatuData[i].maisu;
                }
                return result;
            },
            returnBunkatsuTotalPrice: function () {

                var result = 0;
                for (var i in this.data.second.model.meisai[this.data.selectedBunkatsuTankaIndex].meisaibunkatuData) {
                    result += this.data.second.model.meisai[this.data.selectedBunkatsuTankaIndex].meisaibunkatuData[i].kingaku;
                }
                return Math.floor(result);
            },
            bunkatsuMeisaiKingaku: function (meisai) {

                if (meisai.tanka == undefined || meisai.maisu == undefined) {

                    meisai.kingaku = 0;
                } else {

                    meisai.kingaku = Math.floor(meisai.tanka * meisai.maisu);
                }

            },
            addBunkatsuMeisai: function () {

                this.data.second.model.meisai[this.data.selectedBunkatsuTankaIndex].meisaibunkatuData.push(
                    {
                        "edaban": this.data.second.model.meisai[this.data.selectedBunkatsuTankaIndex].meisaibunkatuData.length,
                        "maisu": 0,
                        "tanka": 0,
                        "kingaku": 0,
                    }
                )
            },
            removeBunkatsuMeisai: function (index) {


                //明細の削除

                this.data.second.model.meisai[this.data.selectedBunkatsuTankaIndex].meisaibunkatuData.splice(index, 1);


            },
            bunkatsuTankaNyuryokuUpdate: function () {


                if (this.data.second.model.meisai[this.data.selectedBunkatsuTankaIndex].maisu != this.returnBunkatsuTotalMaisu()) {
                    alert("合計枚数が異なります");
                    return false;

                }

                var meisai_data = this.data.second.model.meisai[this.data.selectedBunkatsuTankaIndex];

                meisai_data.tanka = this.returnBunkatsuTotalPrice() / this.returnBunkatsuTotalMaisu();

                this.data.pageNumber = 2;
            },
            correspondingWithSyouhinCD: function (meisai, option) {


                if (meisai.syouhin == option.syohinCD) {

                    return true;
                }

                return false;


            },
            getMasterData: function () {

                //各種必要なマスタデータを取ってくる

                //市場等級
                axios.get(url.syohinShijyoTokyuPatternMaster)
                    .then(response => {

                        this.data.shijoTokyu = response.data;
                    })
                    .catch(response => console.log(response))


                //組合等級
                axios.get(url.syohinKumiaiTokyuPatternMaster)
                    .then(response => {
                        this.data.kumiaiTokyu = response.data;
                        console.log(this.data.kumi)
                    })
                    .catch(response => console.log(response))


                axios.get(url.syouhinMaster)
                    .then(response => {

                        for (var i = 0; i < response.data.length; i++) {

                            var data = response.data[i];

                            this.$set(this.data.syouhin, String(data.syohinCD), data.syohinmei);

                        }

                    })
                    .catch(response => console.log(response))

                axios.get(url.syohinSizeMaster)
                    .then(response => {

                        this.$set(this.data, "size", response.data);

                    })
                    .catch(response => console.log(response))

                axios.get(url.syohinHosoMaster)
                    .then(response => {

                        this.$set(this.data, "housou", response.data);

                    })
                    .catch(response => console.log(response))

                axios.get(url.syohinHinsyuMaster)
                    .then(response => {

                        this.$set(this.data, "hinsyu", response.data);

                    })
                    .catch(response => console.log(response))


                axios.get(url.unchinMaster)
                    .then(response => {

                        this.$set(this.data, "unchin", response.data);

                        console.log(this.data.unchin);

                    })
                    .catch(response => console.log(response))

                axios.get(url.shijoMaster)
                    .then(response => {

                        this.$set(this.data, "shijyo", response.data);

                        console.log("市場",this.data.shijyo);

                    })
                    .catch(response => console.log(response))


            },
            init: function () {
                //初期化
                this.data.second.model.meisai = [];
                this.data.search.result = [];
                this.data.second.model.syukkaDate = "";
                this.data.second.model.shijyoCode = "";
                this.data.second.model.shijyoName = "";
                this.data.second.model.tesuryou = "";
                this.data.second.model.bumonCode = "";
                this.data.second.model.bumonName = "";
                this.data.billNumber = "";
                this.data.syoriKubun = 0;
                this.data.disabled.syukkaConfirm = false;


            },
            update: function () {

                this.$refs['secondForm'].validate((valid) => {

                    if (valid) {

                        if (this.data.syoriKubun == 0) {

                            if (this.data.second.model.meisai.length == 0) {
                                alert("追加する行がありません");
                                return false;
                            }
                        }

                        var message;
                        if (this.data.syoriKubun == 0) {
                            message = "登録しますか？";
                        } else if (this.data.syoriKubun == 1) {
                            message = "更新しますか？";
                        } else if (this.data.syoriKubun == 2) {
                            message = "削除しますか？";
                        }




                        if (window.confirm(message)) {

                            var postArray = {
                                "ProcKbn": 1,
                                "SyukkaBango": Number(this.data.billNumber),
                                "ComputerName": this.$store.state.login.userName,
                                "InputTanto": this.$store.state.login.userCode,
                                "GokeiFlg": 0,
                                "PrintFlg": false,
                                "PrintSyukkaDenpyoHikae": false,
                                "PrintSyukkaKeisansyo": false,
                                "PrintNohinsyo": false,
                                "MeisaiData": [],
                                "HanbaiData": [],
                              }

                            if (this.data.checked.goukeiInji) {
                                postArray.GokeiFlg = 1
                            }


                            for (var i = 0; i < this.data.second.model.meisai.length; i++) {

                                var meisai_data = this.data.second.model.meisai[i];


                                postArray.HanbaiData.push({
                                    "SyukkaBango": Number(this.data.billNumber),
                                    "GyoBango": i+1,
                                    "BumonCd": Number(this.data.second.model.bumonCode),
                                    "SijoCd": Number(this.data.second.model.shijyoCode),
                                    "SyukkaHiduke": this.data.second.model.syukkaDate,
                                    "DataKbn": 0,
                                    "Kaisu": this.$store.state.login.kaisu,
                                    "Syohin": meisai_data.syouhin,
                                    "Hinsyu": meisai_data.hinsyu,
                                    "Size": meisai_data.size,
                                    "Hoso": meisai_data.housou,
                                    "TokyuSijo": Number(meisai_data.sijotokyu),
                                    "TokyuKumiai": Number(meisai_data.kumiaitokyu),
                                    "HakoIriSu": meisai_data.irisu,
                                    "KoriIriSu": meisai_data.kouirisu,
                                    "KoriSu": meisai_data.kousu,
                                    "MaiSu": meisai_data.maisu,
                                    "Tanka": meisai_data.tanka,
                                    "Kingaku": meisai_data.price,
                                    "Untin": meisai_data.unchin,
                                    "InputTantoCd": this.$store.state.login.userCode,
                                    "TesuryoRitu": this.data.second.model.tesuryou,
                                    "Nendo": Number(this.data.second.model.syukkaDate.split("-")[0]),
 
                                })

                                for (var k = 0; k < this.data.second.model.meisai[i].meisaibunkatuData.length; k++) {


                                    var hanbai_data = this.data.second.model.meisai[i].meisaibunkatuData[k];

                                    postArray.MeisaiData.push({

                                        "SyukkaBango": Number(this.data.billNumber),
                                        "GyoBango": i+1,
                                        "EdaBango": k+1,
                                        "MaiSu": hanbai_data.maisu,
                                        "Tanka": hanbai_data.tanka,
                                        "Kingaku": hanbai_data.kingaku,
                                        "InputTantoCd": this.$store.state.login.userCode,

                                    })

                                }



                            }

                            console.log(postArray);


                            if (this.data.syoriKubun == 0) {

                                axios.post(url.syukkaNyuryoku, postArray)
                                    .then(response => {

                                        this.$message({
                                            message: '登録に成功しました',
                                            type: 'success'
                                        });
                                        console.log(response.data);

                                        if (this.data.syoriKubun == 0) {

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


                            } else if (this.data.syoriKubun == 1) {

                                axios.put(url.syukkaNyuryoku, postArray)
                                    .then(response => {
                                        this.$message({
                                            message: '修正に成功しました',
                                            type: 'success'
                                        });

                                        if (this.data.syoriKubun == 1) {

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

                            } else if (this.data.syoriKubun == 2) {

                                postArray = {
                                    "SyukkaBango": this.data.billNumber
                                }

                                axios.delete(url.syukkaNyuryoku, { params: postArray })
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
                alert("終了");
            },


        },
        created: function () {

            this.data.first.model.syukkaDate = time.nowJapanDateInput();

            this.getMasterData();
            //※dataから取ってくる

        },
        mounted: function () {


        },
        watch: {
            'data.syoriKubun': function (new_value) {


                if (new_value == 0) {

                    this.data.updateButton = "登録";
                } else if (new_value == 1) {

                    this.data.updateButton = "更新";
                } else if (new_value == 2) {

                    this.data.updateButton = "削除";
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
</style>