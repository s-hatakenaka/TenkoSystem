<template>
    <div>
        <keyboard-events v-on:keydown="keyboardEvent"></keyboard-events>
        <el-card>
            <div slot='header'>
                <span>生産者マスタ</span>
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
                            <label for='生産者' class='col-form-label px-1' style='width:100%;'>生産者</label>
                            <el-form-item label-width="0" prop="seisansyaCode">

                                <el-increment-search v-model="data.search.model.seisansyaCode"
                                                     :display="[{key:'seisansyamei',name:'名前'}]"
                                                     :autoComplete="['seisansyacd','seisansyamei','sisyocd','kyuyo','azukarikin','syussikin','zennenseisankin','kouzabangou','tel']"
                                                     :kind="'生産者'"
                                                     :required="true"
                                                     :disabled="data.confirmFlag"
                                                     :autofocus="data.autofocus.seisansyaCodeSearch"
                                                     @update="autoCompleteSeisansya"></el-increment-search>
                                <el-input type='text'
                                          style='width:50%;'
                                          readonly
                                          :placeholder="'生産者名'"
                                          :disabled="data.confirmFlag"
                                          v-model="data.search.model.seisansyaName"></el-input>
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
                        <el-form :model="data.seisansya.model" :rules="data.seisansya.validation" ref="seisansyaForm" label-width="120px">

                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>
                                            生産者コード
                                        </th>
                                        <th>
                                            生産者名
                                        </th>
                                        <th>
                                            支所コード
                                        </th>
                                        <th>
                                            支所名
                                        </th>
                                        <th>
                                            給与
                                        </th>
                                        <th>
                                            預り金
                                        </th>
                                        <th>
                                            出資金
                                        </th>
                                        <th>
                                            前年精算金
                                        </th>
                                        <th>
                                            口座番号
                                        </th>
                                        <th>
                                            電話番号(ハイフン無し)
                                        </th>

                                    </tr>
                                </thead>
                                <tr>
                                    <td>
                                        <el-form-item label-width="0" prop="seisansyaCode">
                                            <el-input-number type='text'
                                                             style='width:100%;'
                                                             :disabled="data.search.model.syoriKubun != 0"
                                                             v-model="data.seisansya.model.seisansyaCode"
                                                             @change="seisansyaCodeOverLap"
                                                             controls-position="right"
                                                             :autofocus="data.autofocus.seisansyaCodeSeisansya"></el-input-number>

                                        </el-form-item>
                                    </td>
                                    <td>
                                        <el-form-item label-width="0" prop="seisansyaName">
                                            <el-input type='text'
                                                      style='width:100%;'
                                                      v-model="data.seisansya.model.seisansyaName"></el-input>

                                        </el-form-item>
                                    </td>
                                    <td>
                                        <el-form-item label-width="0" prop="sisyoCode">
                                            <el-increment-search v-model="data.seisansya.model.sisyoCode"
                                                                 style="width:100%;"
                                                                 :display="[{key:'shisyomei',name:'名前'}]"
                                                                 :autoComplete="['shisyomei']"
                                                                 :kind="'支所'"
                                                                 :required="true"
                                                                 @update="(r) => data.seisansya.model.sisyoName = r['shisyomei']"></el-increment-search>
                                        </el-form-item>
                                    </td>
                                    <td>
                                        <el-form-item label-width="0" prop="sisyoName">
                                            <el-input type='text'
                                                      style='width:100%;'
                                                      readonly
                                                      :placeholder="'支所名'"
                                                      v-model="data.seisansya.model.sisyoName"></el-input>

                                        </el-form-item>
                                    </td>
                                    <td>
                                        <el-form-item label-width="0" prop="kyuyo">
                                            <el-input-number type='text'
                                                             style='width:100%;'
                                                             :placeholder="'給与'"
                                                             controls-position="right"
                                                             v-model="data.seisansya.model.kyuyo"></el-input-number>

                                        </el-form-item>
                                    </td>
                                    <td>
                                        <el-form-item label-width="0" prop="azukariKin">
                                            <el-input-number type='text'
                                                             style='width:100%;'
                                                             :placeholder="'預金'"
                                                             controls-position="right"
                                                             v-model="data.seisansya.model.azukariKin"></el-input-number>

                                        </el-form-item>
                                    </td>
                                    <td>
                                        <el-form-item label-width="0" prop="syussiKin">
                                            <el-input-number type='text'
                                                             style='width:100%;'
                                                             :placeholder="'出資金'"
                                                             controls-position="right"
                                                             v-model="data.seisansya.model.syussiKin"></el-input-number>

                                        </el-form-item>
                                    </td>
                                    <td>
                                        <el-form-item label-width="0" prop="zennenSeisankin">
                                            <el-input-number type='text'
                                                             style='width:100%;'
                                                             :placeholder="'前年精算金'"
                                                             controls-position="right"
                                                             v-model="data.seisansya.model.zennenSeisankin"></el-input-number>

                                        </el-form-item>
                                    </td>
                                    <td>
                                        <el-form-item label-width="0" prop="kouzaBangou">
                                            <el-input-number type='text'
                                                             style='width:100%;'
                                                             :placeholder="'口座番号'"
                                                             controls-position="right"
                                                             v-model="data.seisansya.model.kouzaBangou"></el-input-number>

                                        </el-form-item>
                                    </td>
                                    <td>
                                        <el-form-item label-width="0" prop="tel">
                                            <el-input type='text'
                                                             style='width:100%;'
                                                             :placeholder="'電話番号'"
                                                             v-model="data.seisansya.model.tel"></el-input>

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
                            seisansyaCode: "",
                            seisansyaName: ""
                        },
                        validation: {
                            syoriKubun: [
                                { required: true, message: '処理区分が入力されていません', trigger: 'change' },
                            ],
                            seisansyaCode: [
                                { required: false, message: '生産者コードが入力されていません', trigger: 'change' },
                            ]

                        }
                    },
                    seisansya: {
                        model: {
                            seisansyaCode: "",
                            seisansyaName: "",
                            sisyoCode: "",
                            sisyoName: "",
                            kyuyo: "",
                            azukariKin: "",
                            syussiKin: "",
                            zennenSeisankin: "",
                            kouzaBangou: "",
                            tel: "",

                            

                        },
                        validation: {
                            seisansyaCode: [
                                { required: true, message: '生産者コードが入力されていません', trigger: 'blur' },
                            ],
                            seisansyaName: [
                                { required: true, message: '生産者名が入力されていません', trigger: 'blur' },
                            ],

                        }
                    }, 
                    autoComplete: {
                        seisansyaCode: "",
                        seisansyaName: "",
                        sisyoCode: "",
                        kyuyo: "",
                        azukarikin:"",
                        syussikin: "",
                        zennenSeisankin: "",
                        kouzabangou: "",
                        tel: "",
                    },
                    confirmFlag: false,
                    updateButton: "",
                    autofocus: {
                        seisansyaCodeSearch: false,
                        seisansyaCodeSeisansya: false,
                    },

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
            is_tel: function (rule, value, callback) {

                if (validation.validation.is_tel_nonhyphen(value)) {

                    callback();
                } else {
                    callback(new Error("電話番号の形式が間違っています"));
                }
                
            },

            clear: function () {

                this.data.confirmFlag = false;

                for (var i in this.data.seisansya.model) {
                    this.data.seisansya.model[i] = ""
                }
                this.data.updateButton = "";
                this.data.autofocus.seisansyaCodeSearch = true;
            },
            finish: function () {
                alert("終了");
            },
            autoCompleteSeisansya: function (autoComplete) {


                this.data.search.model.seisansyaName = autoComplete.seisansyamei;
                this.data.autoComplete.seisansyaCode = autoComplete.seisansyacd;
                this.data.autoComplete.seisansyaName = autoComplete.seisansyamei;
                this.data.autoComplete.sisyoCode = String(autoComplete.sisyocd);

                this.data.autoComplete.kyuyo = autoComplete.kyuyo;
                this.data.autoComplete.azukariKin = autoComplete.azukarikin;
                this.data.autoComplete.syussKin = autoComplete.syusikin;
                this.data.autoComplete.zennenSeisanKin = autoComplete.zennenseisankin;
                this.data.autoComplete.kouzaBangou = autoComplete.kouzabangou;
                this.data.autoComplete.tel = autoComplete.tel;


            },
            confirm: function () {

                this.$refs['searchForm'].validate((valid) => {

                    if (valid) {

                        this.data.confirmFlag = true;

                        if (this.data.search.model.syoriKubun != 0) {

                            this.data.seisansya.model.seisansyaCode = this.data.autoComplete.seisansyaCode;
                            this.data.seisansya.model.seisansyaName = this.data.autoComplete.seisansyaName;
                            this.data.seisansya.model.sisyoCode = this.data.autoComplete.sisyoCode;

                            this.data.seisansya.model.kyuyo = this.data.autoComplete.kyuyo;
                            this.data.seisansya.model.azukarikin = this.data.autoComplete.azukarikin;
                            this.data.seisansya.model.syusikin = this.data.autoComplete.syusikin;
                            this.data.seisansya.model.zennenseisankin = this.data.autoComplete.zennenseisankin;
                            this.data.seisansya.model.kouzabangou = this.data.autoComplete.kouzabangou;
                            this.data.seisansya.model.tel = this.data.autoComplete.tel;

                            console.log(this.data.autoComplete.sisyoCode, this.data.seisansya.model.sisyoCode);

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
            seisansyaCodeOverLap: function (new_value) {


                axios.get(url.seisansyaMaster)
                    .then(response => {

                        for (var i in response.data) {

                            if (new_value == response.data[i].seisansyacd) {
                                alert("入力したコードは既に存在します");
                                this.data.seisansya.model.seisansyaCode = "";
                            }

                        }

                    })
                    .catch(response => console.log(response))


            },
            submit: function () {

                this.$refs['seisansyaForm'].validate((valid) => {

                    if (valid) {


                        //※axiosによる更新処理

                        var seisansya = this.data.seisansya.model

                        var postArray = {
                            "Seisansyacd": seisansya.seisansyaCode,
                            "Seisansyamei": seisansya.seisansyaName,
                            "Sisyocd": Number(seisansya.sisyoCode),
                            "kyuyo": seisansya.kyuyo,
                            "azukariKin": seisansya.azukariKin,
                            "syussiKin": seisansya.syussiKin,
                            "zennenSeisankin": seisansya.zennenSeisankin,
                            "kouzaBangou": seisansya.kouzaBangou,
                            "tel": seisansya.tel,
                            "Nyuryokutantocd": this.$store.state.login.userCode
                        }

                        console.log(postArray);

                        if (this.data.search.model.syoriKubun == 0) {

                            console.log(postArray);
                            axios.post(url.seisansyaMaster, postArray)
                                .then(response => {
                                    console.log("成功");
                                })
                                .catch(response => console.log(response))


                            for (var i in this.data.seisansya.model) {
                                this.data.seisansya.model[i] = ""
                            }
                            this.data.autofocus.seisansyaCodeSeisansya = true;


                        } else {

                            if (this.data.search.model.syoriKubun == 1) {

                                axios.put(url.seisansyaMaster, postArray)
                                    .then(response => {
                                        console.log("成功");
                                    })
                                    .catch(response => console.log(response))

                            } else if (this.data.search.model.syoriKubun == 2) {

                                axios.delete(url.seisansyaMaster, { params: postArray })
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


        },
        mounted: function () {

        },
        watch: {
            "data.search.model.syoriKubun": function (new_value) {

                if (new_value == 0) {
                    this.data.search.validation.seisansyaCode[0].required = false;
                } else {
                    this.data.search.validation.seisansyaCode[0].required = true;
                }
            }

        }
    }
</script>
