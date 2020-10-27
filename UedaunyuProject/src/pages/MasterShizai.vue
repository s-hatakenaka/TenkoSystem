<template>
    <div>
        <keyboard-events v-on:keydown="keyboardEvent"></keyboard-events>
        <el-card>
            <div slot='header'>
                <span>資材マスタ</span>
            </div>
            <div slot='default'>
                <el-form :model="data.search.model" :rules="data.search.validation" ref="searchForm" label-width="120px">
                    <div class="row">
                        <div class='col-md-3'>
                            <label for='処理区分' class='col-form-label px-1' style='width:100%;'>処理区分</label>
                            <el-form-item label-width="0" prop="syoriKubun">
                                <el-select id="syoriKubun" v-model="data.search.model.syoriKubun" style="width: 100%;" :disabled="data.confirmFlag" :autofocus="data.syoriKubunFocus">
                                    <el-option value='0' :label="'0:新規'"></el-option>
                                    <el-option value='1' :label="'1:修正'"></el-option>
                                    <el-option value='2' :label="'2:削除'"></el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                        <div class='col-md-8'>
                            <label for='資材' class='col-form-label px-1' style='width:100%;'>資材</label>
                            <el-form-item label-width="0" prop="shizaiCode">

                                <el-increment-search v-model="data.search.model.shizaiCode"
                                                     :display="[{key:'shizaimei',name:'名前'}]"
                                                     :autoComplete="['shizaiCD','shizaimei','taniCD','mekaCD','tanka','yoyakuTanka','shiireIrisu','nohinsyoSyuturyokuFlg']"
                                                     :kind="'資材'"
                                                     :required="true"
                                                     :disabled="data.confirmFlag"
                                                     :autofocus="data.autofocus.shizaiCodeSearch"
                                                     @update="autoCompleteShizai"></el-increment-search>
                                <el-input type='text'
                                          style='width:50%;'
                                          readonly
                                          :placeholder="'資材名'"
                                          :disabled="data.confirmFlag"
                                          v-model="data.search.model.shizaiName"></el-input>
                            </el-form-item>
                        </div>
                    </div>

                </el-form>
                <div class="row">
                    <div class="col-12">
                        <div style='text-align:right;width:100%;'>
                            <el-button style='margin-left:2%;' type='warning' v-on:click="confirm" :disabled="data.confirmFlag">確定(F5)</el-button>
                            <el-button style='margin-left:2%;' type='primary' v-on:click="finish">終了(F12)</el-button>

                        </div>
                    </div>
                </div>
                <div class="row" style="margin-top:4%;" v-if="data.confirmFlag">
                    <div class="col-12">
                        <el-form :model="data.shizai.model" :rules="data.shizai.validation" ref="shizaiForm" label-width="120px">

                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>
                                            資材コード
                                        </th>
                                        <th>
                                            資材名
                                        </th>
                                        <th>
                                            単位コード
                                        </th>
                                        <th>
                                            メーカーコード
                                        </th>
                                        <th>
                                            単価
                                        </th>
                                        <th>
                                            予約単価
                                        </th>
                                        <th>
                                            仕入入数
                                        </th>
                                        <th>
                                            納品出力F
                                        </th>
                                    </tr>
                                </thead>
                                <tr>
                                    <td>
                                        <el-form-item label-width="0" prop="shizaiCD">
                                            <el-input-number type='text'
                                                             style='width:100%;'
                                                             :disabled="data.search.model.syoriKubun != 0"
                                                             v-model="data.shizai.model.shizaiCD"
                                                             @change="shizaiCodeOverLap"
                                                             controls-position="right"
                                                             :autofocus="data.autofocus.shizaiCodeShizai"></el-input-number>

                                        </el-form-item>
                                    </td>
                                    <td>
                                        <el-form-item label-width="0" prop="shizaimei">
                                            <el-input type='text'
                                                      style='width:100%;'
                                                      :disabled="data.search.model.syoriKubun == 2"
                                                      v-model="data.shizai.model.shizaimei"></el-input>

                                        </el-form-item>
                                    </td>
                                    <td>
                                        <el-form-item label-width="0" prop="taniCode">
                                            <el-select v-model="data.shizai.model.taniCode" style="width: 100%;">
                                                <el-option v-for="tani in data.tani" :value='tani.taniCD' :label="tani.tanimei" :key="tani.number"></el-option>
                                            </el-select>

                                        </el-form-item>
                                    </td>
                                    <td>
                                        <el-form-item label-width="0" prop="mecaCode">
                                            <el-select v-model="data.shizai.model.mecaCode" style="width: 100%;">
                                                <el-option v-for="meca in data.meca" :value='meca.mecaCD' :label="meca.mecamei" :key="meca.number"></el-option>
                                            </el-select>


                                        </el-form-item>
                                    </td>
                                    <td>
                                        <el-form-item label-width="0" prop="tanka">
                                            <el-input-number type='text'
                                                             style='width:100%;'
                                                             :placeholder="'単価'"
                                                             controls-position="right"
                                                             v-model="data.shizai.model.tanka"></el-input-number>

                                        </el-form-item>
                                    </td>
                                    <td>
                                        <el-form-item label-width="0" prop="yoyakuTanka">
                                            <el-input-number type='text'
                                                             style='width:100%;'
                                                             :placeholder="'予約単価'"
                                                             controls-position="right"
                                                             v-model="data.shizai.model.yoyakuTanka"></el-input-number>

                                        </el-form-item>
                                    </td>
                                    <td>
                                        <el-form-item label-width="0" prop="shiireIrisu">
                                            <el-input-number type='text'
                                                             style='width:100%;'
                                                             :placeholder="'仕入入数'"
                                                             controls-position="right"
                                                             v-model="data.shizai.model.shiireIrisu"></el-input-number>

                                        </el-form-item>
                                    </td>
                                    <td>
                                        <el-form-item label-width="0" prop="nohinsyoSyuturyokuFlg">
                                            <el-select v-model="data.shizai.model.nohinsyoSyuturyokuFlg" style="width: 100%;">
                                                <el-option value='0' :label="'出力しない'"></el-option>
                                                <el-option value='1' :label="'出力する'"></el-option>
                                            </el-select>

                                        </el-form-item>
                                    </td>
          
                                </tr>
                            </table>
                        </el-form>
                    </div>
                    <div class="col-12">
                        <div style='text-align:right;width:100%;'>
                            <el-button style='margin-left:2%;' type='primary' v-on:click="clear">画面クリア(F10)</el-button>
                            <el-button style='margin-left:2%;' type='warning' v-on:click="submit">{{data.updateButton}}(F9)</el-button>
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
    import ElIncrementSearch from '@/components/IncrementSearch.vue'
    import url from '@/js/api_url.js'
    import validation from '@/js/status/validation.js'

    export default {
        name: 'niukeSyukei',
        components: {
            Card, KeyboardEvents, ElIncrementSearch
        },
        data: function () {
            return {
                data: {
                    search: {
                        model: {
                            syoriKubun: "",
                            shizaiCode: "",
                            shizaiName: ""
                        },
                        validation: {
                            syoriKubun: [
                                { required: true, message: '処理区分が入力されていません', trigger: 'change' },
                            ],
                            shizaiCode: [
                                { required: false, message: '資材コードが入力されていません', trigger: 'change' },
                            ]

                        }
                    },
                    shizai: {
                        model: {
                            shizaiCD: null,
                            shizaimei: "",
                            mekaCD: "",
                            nohinsyoSyuturyokuFlg: null,
                            shiireIrisu: null,
                            taniCD: "",
                            tanka: null,
                            yoyakuTanka: null,
                         },
                        validation: {
                            shizaiCD: [
                                { required: true, message: '資材コードが入力されていません', trigger: 'blur' },
                            ],
                            shizaimei: [
                                { required: true, message: '資材名が入力されていません', trigger: 'blur' },
                            ],

                        }
                    },
                    autoComplete: {
                        shizaiCD: null,
                        shizaimei: "",
                        mekaCD: "",
                        nohinsyoSyuturyokuFlg: null,
                        shiireIrisu: null,
                        taniCD: "",
                        tanka: null,
                        yoyakuTanka: null,
                    },
                    confirmFlag: false,
                    updateButton: "",
                    autofocus: {
                        shizaiCodeSearch: false,
                        shizaiCodeShizai: false,
                    },
                    tani: [],
                    meca: [],

                },
            }
        },
        methods: {
            keyboardEvent(e) {
                if (e.keyCode == config.KEY_CODES.F5) {
                    if (!this.data.confirmFlag) {
                        this.confirm()
                    }
                }
                if (e.keyCode == config.KEY_CODES.F9) {
                    if (this.data.confirmFlag) {
                        this.submit()
                    }

                }

                if (e.keyCode == config.KEY_CODES.F10) {
                    if (this.data.confirmFlag) {
                        this.clear()
                    }

                }
                if (e.keyCode == config.KEY_CODES.F12) {
                    this.finish()
                }
            },
   
            clear: function () {

                this.data.confirmFlag = false;

                for (var i in this.data.shizai.model) {
                    this.data.shizai.model[i] = ""
                }
                this.data.updateButton = "";
                this.data.autofocus.shizaiCodeSearch = true;
            },
            finish: function () {
                alert("終了");
            },
            autoCompleteShizai: function (autoComplete) {


                this.data.search.model.shizaiName = autoComplete.shizaimei;

                for (var i in this.data.autoComplete) {
                        this.data.autoComplete[i] = autoComplete[i];
                }


                console.log(this.data.autoComplete, autoComplete);


            },
            confirm: function () {

                this.$refs['searchForm'].validate((valid) => {

                    if (valid) {

                        this.data.confirmFlag = true;

                        if (this.data.search.model.syoriKubun != 0) {

                            if (this.data.search.model.syoriKubun != 0) {

                                for (var i in this.data.shizai.model) {

                                    this.data.shizai.model[i] = this.data.autoComplete[i];

                                }

                            }

                        }

                        if (this.data.search.model.syoriKubun == 0) {
                            this.data.updateButton = "登録";
                        } else if (this.data.search.model.syoriKubun == 1) {
                            this.data.updateButton = "更新";
                        } else if (this.data.search.model.syoriKubun == 2) {
                            this.data.updateButton = "削除";
                        }
                    }
                });

            },
            shizaiCodeOverLap: function (new_value) {


                axios.get(url.shizaiMaster)
                    .then(response => {

                        for (var i in response.data) {

                            if (new_value == response.data[i].shizaicd) {
                                alert("入力したコードは既に存在します");
                                this.data.shizai.model.shizaiCode = "";
                            }

                        }

                    })
                    .catch(response => console.log(response))


            },
            submit: function () {

                this.$refs['shizaiForm'].validate((valid) => {

                    if (valid) {


                        //※axiosによる更新処理

                        var shizai = this.data.shizai.model

                        var postArray = {
                            "shizaiCD": shizai.shizaiCD,
                            "shizaimei": shizai.shizaimei,
                            "mekaCD": shizai.mecaCD,
                            "nohinsyoSyuturyokuFlg": shizai.nohinsyoSyuturyokuFlg,
                            "shiireIrisu": shizai.shiireIrisu,
                            "taniCD": shizai.taniCD,
                            "tanka": shizai.tanka,
                            "yoyakuTanka": shizai.yoyakuTanka,
                            "Nyuryokutantocd": this.$store.state.login.userCode
                        }

                        console.log(postArray);

                        if (this.data.search.model.syoriKubun == 0) {

                            console.log(postArray);
                            axios.post(url.shizaiMaster, postArray)
                                .then(response => {
                                    console.log("成功");
                                })
                                .catch(response => console.log(response))


                            for (var i in this.data.shizai.model) {
                                this.data.shizai.model[i] = ""
                            }
                            this.data.autofocus.shizaiCodeShizai = true;


                        } else {

                            if (this.data.search.model.syoriKubun == 1) {

                                axios.put(url.shizaiMaster, postArray)
                                    .then(response => {
                                        console.log("成功");
                                    })
                                    .catch(response => console.log(response))

                            } else if (this.data.search.model.syoriKubun == 2) {

                                axios.delete(url.shizaiMaster, { params: postArray })
                                    .then(response => {
                                        console.log("成功");
                                    })
                                    .catch(response => console.log(response))


                            }


                            this.clear()
                        }

                    }
                })

            }
        },
        created: function () {



            //※とりあえず定数データを入れる

            this.data.tani = [
                { taniCD: 1, tanimei: "あ" },
                { taniCD: 2, tanimei: "い" },
                { taniCD: 3, tanimei: "う" },
            ]

            this.data.meca = [
               { mecaCD: 1, mecamei: "あ" },
               { mecaCD: 2, mecamei: "い" },
               { mecaCD: 3, mecamei: "う" },
            ]

            //axios.get(url.taniMaster)
                //.then(response => {

                  //  this.data.tani = response.data;

                //})
                //.catch(response => console.log(response))
            
            //axios.get(url.mecaMaster)
              //  .then(response => {

                //    this.data.meca = response.data;

                //})
                //.catch(response => console.log(response))





        },
        mounted: function () {

        },
        watch: {
            "data.search.model.syoriKubun": function (new_value) {

                if (new_value == 0) {
                    this.data.search.validation.shizaiCode[0].required = false;
                } else {
                    this.data.search.validation.shizaiCode[0].required = true;
                }
            }

        }
    }
</script>
