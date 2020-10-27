<template>
    <div>
        <keyboard-events v-on:keydown="keyboardEvent"></keyboard-events>
        <el-card>
            <div slot='header'>
                <span>資材管理マスタ</span>
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
                        <div class='col-md-5'>
                            <label for='回数' class='col-form-label px-1' style='width:100%;'>回数</label>
                            <el-form-item label-width="0" prop="kaisu">
                                <el-select v-model="data.shizaikanri.model.kaisu" style="width: 100%;" :disabled="data.confirmFlag" @change="autoCompleteShijo">
                                    <el-option v-for="kaisu in data.kaisu" :value='kaisu.kaisu' :label="kaisu.kaisu" :key="kaisu.number"></el-option>
                                </el-select>

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
                        <el-form :model="data.shizaikanri.model" :rules="data.shizaikanri.validation" ref="shizaikanriForm" label-width="120px">

                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>
                                            回数
                                        </th>
                                        <th>
                                            期間
                                        </th>
                                        <th>
                                            年度
                                        </th>
                                    </tr>
                                </thead>
                                <tr>
                                    <td>
                                        <el-form-item label-width="0" prop="kaisu">
                                            <el-input-number type='text'
                                                             style='width:100%;'
                                                             :disabled="data.search.model.syoriKubun != 0"
                                                             v-model="data.shizaikanri.model.kaisu"
                                                             controls-position="right"
                                                             @change="shizaikanriCodeOverLap"
                                                             :autofocus="data.autofocus.shizaikanriCodeShijo"></el-input-number>

                                        </el-form-item>
                                    </td>
                                    <td>
                                        <el-form-item label-width="0" prop="kikan">
                                            <el-input type='date'
                                                      style='width:100%;'
                                                      v-model="data.shizaikanri.model.kikan"></el-input>

                                        </el-form-item>
                                    </td>
                                    <td>
                                        <el-form-item label-width="0" prop="nendo">
                                            <el-input-number type='text'
                                                             style='width:100%;'
                                                             :disabled="data.search.model.syoriKubun != 0"
                                                             v-model="data.shizaikanri.model.nendo"
                                                             controls-position="right"
                                                             :autofocus="data.autofocus.shizaikanriCodeShijo"></el-input-number>

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
                            kaisu: "",
                        },
                        validation: {
                            syoriKubun: [
                                { required: true, message: '処理区分が入力されていません', trigger: 'blur' },
                            ],
                            kaisu: [
                                { required: true, message: '回数が入力されていません' },
                            ]

                        }
                    },
                    shizaikanri: {
                        model: {
                            kaisu: "",
                            kikan: "",
                            nendo: "",
                        },
                        validation: {
                            kaisu: [
                                { required: true, message: '回数が入力されていません', trigger: 'blur' },
                            ],
                            kikan: [
                                { required: true, message: '期間が入力されていません', trigger: 'blur' },
                            ],
                            nendo: [
                                { required: true, message: '年度が入力されていません', trigger: 'blur' },
                            ]
                        }
                    },
                    autoComplete: {
                        kaisu: "",
                        kikan: "",
                        nendo: "",
                    },
                    confirmFlag: false,
                    updateButton: "",
                    autofocus: {
                        shizaikanriCodeSearch: false,
                        shizaikanriCodeShijo: false,
                    },
                    kaisu: [],

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

                for (var i in this.data.shizaikanri.model) {
                    this.data.shizaikanri.model[i] = ""
                }
                this.data.updateButton = "";
                this.data.autofocus.shizaikanriCodeSearch = true;
            },
            finish: function () {
                alert("終了");
            },
            autoCompleteShijo: function (select_value) {

                var autocomplete;

                axios.get(url.shizaikanriMaster)
                    .then(response => {

                        for (var i in response.data) {

                            if (select_value == response.data[i].kaisu) {

                                autocomplete = response.data[i];

                            }

                        }

                    })
                    .catch(response => console.log(response))

                if (autocomplete != undefined) {

                    for (var i in this.data.autoComplete) {

                        this.data.autoComplete[i] = autoComplete[i];

                    }

                }


            },
            confirm: function () {

                this.$refs['searchForm'].validate((valid) => {

                    if (valid) {

                        this.data.confirmFlag = true;

                        if (this.data.search.model.syoriKubun != 0) {

                            for (var i in this.data.shizaikanri.model) {

                                this.data.shizaikanri.model[i] = this.data.autoComplete[i];

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
            shizaikanriCodeOverLap: function (new_value) {


                axios.get(url.shizaikanriMaster)
                    .then(response => {

                        for (var i in response.data) {

                            if (new_value == response.data[i].kaisu) {
                                alert("入力したコードは既に存在します");
                                this.data.shizaikanri.model.kaisu = "";
                            }

                        }

                    })
                    .catch(response => console.log(response))


            },
            submit: function () {

                this.$refs['shizaikanriForm'].validate((valid) => {

                    if (valid) {


                        //※axiosによる更新処理

                        var shizaikanri = this.data.shizaikanri.model

                        var postArray = {
                            Kaisu: shizaikanri.kaisu,
                            Year: shizaikanri.year,
                            Nendo: shizaikanri.nendo,
                            userCode: this.$store.state.login.userCode
                        }

                        if (this.data.search.model.syoriKubun == 0) {

                            axios.post(url.shizaikanriMaster, postArray)
                                .then(response => {
                                    console.log("成功");
                                })
                                .catch(response => console.log(response))


                            for (var i in this.data.shizaikanri.model) {
                                this.data.shizaikanri.model[i] = ""
                            }
                            this.data.autofocus.shizaikanriCodeSeisansya = true;


                        } else {

                            if (this.data.search.model.syoriKubun == 1) {

                                axios.put(url.shizaikanriMaster, postArray)
                                    .then(response => {
                                        console.log("成功");
                                    })
                                    .catch(response => console.log(response))

                            } else if (this.data.search.model.syoriKubun == 2) {

                                axios.delete(url.shizaikanriMaster, postArray)
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


            axios.get(url.shizaiKanriMaster)
                .then(response => {

                    this.data.kaisu = response.data;

                })
                .catch(response => console.log(response))

            this.data.kaisu = [
                { kaisu: "1" },
                { kaisu: "2" },
                { kaisu: "3" },
                { kaisu: "4" },
                { kaisu: "5" },
            ];


            axios.get(url.meisyoMaster)
                .then(response => {

                    for (var i = 0; i < response.data.length; i++) {
                        if (response.data[i].meisyoCD == "7") {
                            this.data.shizaikanrichiku.push(response.data[i]);
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
                    this.data.search.validation.kaisu[0].required = false;
                } else {
                    this.data.search.validation.kaisu[0].required = true;
                }
            },

        }
    }
</script>
