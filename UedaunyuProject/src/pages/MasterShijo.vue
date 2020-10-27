<template>
    <div>
        <keyboard-events v-on:keydown="keyboardEvent"></keyboard-events>
        <el-card>
            <div slot='header'>
                <span>市場マスタ</span>
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
                            <label for='市場' class='col-form-label px-1' style='width:100%;'>市場</label>
                            <el-form-item label-width="0" prop="seisansyaCode">

                                <el-increment-search v-model="data.search.model.shijoCode"
                                                     :display="[{key:'shijyomei',name:'名前'}]"
                                                     :autoComplete="['shijyoCD','shijyomei','shijyoChikuCD','shijyomeiRyakusyo','tesuryoKbn','tesuryoRate','unchinRank']"
                                                     :kind="'市場'"
                                                     :required="true"
                                                     :disabled="data.confirmFlag"
                                                     :autofocus="data.autofocus.shijoCodeSearch"
                                                     @update="autoCompleteShijo"></el-increment-search>
                                <el-input type='text'
                                          style='width:50%;'
                                          readonly
                                          :placeholder="'市場名'"
                                          :disabled="data.confirmFlag"
                                          v-model="data.search.model.shijoName"></el-input>
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
                        <el-form :model="data.shijo.model" :rules="data.shijo.validation" ref="shijoForm" label-width="120px">

                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>
                                            市場コード
                                        </th>
                                        <th>
                                            市場名
                                        </th>
                                        <th>
                                            市場名略称
                                        </th>
                                        <th>
                                            市場地区コード
                                        </th>
                                        <th>
                                            手数料区分
                                        </th>
                                        <th>
                                            手数料率
                                        </th>
                                        <th>
                                            運賃ランク
                                        </th>
                                    </tr>
                                </thead>
                                <tr>
                                    <td>
                                        <el-form-item label-width="0" prop="shijyoCD">
                                            <el-input type='text'
                                                      style='width:100%;'
                                                      :disabled="data.search.model.syoriKubun != 0"
                                                      v-model="data.shijo.model.shijyoCD"
                                                      @change="shijoCodeOverLap"
                                                      :autofocus="data.autofocus.shijoCodeShijo"></el-input>

                                        </el-form-item>
                                    </td>
                                    <td>
                                        <el-form-item label-width="0" prop="shijyomei">
                                            <el-input type='text'
                                                      style='width:100%;'
                                                      v-model="data.shijo.model.shijyomei"></el-input>

                                        </el-form-item>
                                    </td>
                                    <td>
                                        <el-form-item label-width="0" prop="shijyomeiRyakusyo">
                                            <el-input type='text'
                                                      style='width:100%;'
                                                      v-model="data.shijo.model.shijyomeiRyakusyo"></el-input>

                                        </el-form-item>
                                    </td>
                                    <td>
                                        <el-form-item label-width="0" prop="shijyoChikuCD">
                                            <el-select v-model="data.shijo.model.shijyoChikuCD" style="width: 100%;">
                                                <el-option v-for="shijochiku in data.shijochiku" :value='shijochiku.atai' :label="shijochiku.meisyo" :key="shijochiku.number"></el-option>
                                               </el-select>

                                        </el-form-item>
                                    </td>
                                    <td>
                                        <el-form-item label-width="0" prop="tesuryoKbn">
                                            <el-select v-model="data.shijo.model.tesuryoKbn" style="width: 100%;" >
                                                <el-option value='0' :label="'0'"></el-option>
                                                <el-option value='1' :label="'1'"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </td>
                                    <td>
                                        <el-form-item label-width="0" prop="tesuryoRate">
                                            <el-input-number type='text'
                                                             style='width:100%;'
                                                             controls-position="right"
                                                             :disabled="data.shijo.model.tesuryoKbn == 1"
                                                             v-model="data.shijo.model.tesuryoRate"></el-input-number>

                                        </el-form-item>
                                    </td>
                                    <td>
                                        <el-form-item label-width="0" prop="unchinRank">
                                            <el-select v-model="data.shijo.model.unchinRank" style="width: 100%;">
                                                <el-option v-for="unchin in data.unchin" :value='unchin' :label="unchin" :key="unchin"></el-option>
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
                            shijoCode: "",
                            shijoName: ""
                        },
                        validation: {
                            syoriKubun: [
                                { required: true, message: '処理区分が入力されていません', trigger: 'blur' },
                            ],
                            shijoCode: [
                                { required: true, message: '市場コードが入力されていません' },
                            ]

                        }
                    },
                    shijo: {
                        model: {
                            shijyoCD: "",
                            shijyomei: "",
                            shijyoChikuCD: "",
                            shijyomeiRyakusyo: "",
                            tesuryoKbn: "",
                            tesuryoRate: "",
                            unchinRank: "",
                        },
                        validation: {
                            shijyoCD: [
                                { required: true, message: '市場コードが入力されていません', trigger: 'blur' },
                            ],
                            shijyomei: [
                                { required: true, message: '市場名が入力されていません', trigger: 'blur' },
                            ],
                        }
                    },
                    autoComplete: {
                        shijyoCD: "",
                        shijyomei: "",
                        shijyoChikuCD: "",
                        shijyomeiRyakusyo: "",
                        tesuryoKbn: "",
                        tesuryoRate: "",
                        unchinRank: "",
                    },
                    confirmFlag: false,
                    updateButton: "",
                    autofocus: {
                        shijoCodeSearch: false,
                        shijoCodeShijo: false,
                    },
                    unchin: [],
                    shijochiku:[],

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

                for (var i in this.data.shijo.model) {
                    this.data.shijo.model[i] = ""
                }
                this.data.updateButton = "";
                this.data.autofocus.shijoCodeSearch = true;
            },
            finish: function () {
                alert("終了");
            },
            autoCompleteShijo: function (autoComplete) {

                this.data.search.model.shijoName = autoComplete.shijyomei;

                for (var i in this.data.autoComplete) {
                    if (i == "shijyoCD") {
                        this.data.autoComplete[i] = String(autoComplete[i]);

                    } else {
                        this.data.autoComplete[i] = autoComplete[i];

                    }
                }

            },
            confirm: function () {

                this.$refs['searchForm'].validate((valid) => {

                    if (valid) {

                        this.data.confirmFlag = true;

                        if (this.data.search.model.syoriKubun != 0) {

                            for (var i in this.data.shijo.model) {

                                this.data.shijo.model[i] = this.data.autoComplete[i];

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
            shijoCodeOverLap: function (new_value) {


                axios.get(url.shijoMaster)
                    .then(response => {

                        for (var i in response.data) {

                            if (new_value == response.data[i].shijyoCD) {
                                alert("入力したコードは既に存在します");
                                this.data.shijo.model.shijyoCD = "";
                            }

                        }

                    })
                    .catch(response => console.log(response))


            },
            submit: function () {

                this.$refs['shijoForm'].validate((valid) => {

                    if (valid) {


                        //※axiosによる更新処理

                        var shijo = this.data.shijo.model

                        var postArray = {
                            shijyoCD: shijo.shijyoCD,
                            shijyomei: shijo.shijyomei,
                            shijyoChikuCD: shijo.shijyoChikuCD,
                            shijyomeiRyakusyo: shijo.shijyomeiRyakusyo,
                            tesuryoKbn: shijo.tesuryoKbn,
                            tesuryoRate: shijo.tesuryoRate,
                            unchinRank: shijo.unchinRank,
                            userCode: this.$store.state.login.userCode
                        }

                        if (this.data.search.model.syoriKubun == 0) {

                            axios.post(url.shijoMaster, postArray)
                                .then(response => {
                                    console.log("成功");
                                })
                                .catch(response => console.log(response))


                            for (var i in this.data.shijo.model) {
                                this.data.shijo.model[i] = ""
                            }
                            this.data.autofocus.shijoCodeSeisansya = true;


                        } else {

                            if (this.data.search.model.syoriKubun == 1) {

                                axios.put(url.shijoMaster, postArray)
                                    .then(response => {
                                        console.log("成功");
                                    })
                                    .catch(response => console.log(response))

                            } else if (this.data.search.model.syoriKubun == 2) {

                                axios.delete(url.shijoMaster, postArray)
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


            axios.get(url.unchinMaster)
                .then(response => {

                    for (var i = 0; i < response.data.length; i++) {

                        var is_overlap = false;

                        for (var k = 0; k < this.data.unchin.length; k++) {

                            if (response.data[i].unchinRank == this.data.unchin[k]) {
                                is_overlap = true;
                            }

                        }

                        if (!is_overlap) {

                            this.data.unchin.push(response.data[i].unchinRank);

                        }
                        
                    }
                    
                })
                .catch(response => console.log(response))

            axios.get(url.meisyoMaster)
                .then(response => {

                    for (var i = 0; i < response.data.length; i++) {
                        if (response.data[i].meisyoCD == "7") {
                            this.data.shijochiku.push(response.data[i]);
                        }
                    }                  
                })
                .catch(response => console.log(response))



        },
        mounted: function () {

        },
        watch: {
            "data.search.model.syoriKubun": function (new_value) {

                if (new_value == 0) {
                    this.data.search.validation.shijoCode[0].required = false;
                } else {
                    this.data.search.validation.shijoCode[0].required = true;
                }
            },
            "data.shijo.model.tesuryoKbn": function (new_value) {

                if (new_value == 1) {

                    this.data.shijo.model.tesuryoRate = 0;
                }

            }

        }
    }
</script>
