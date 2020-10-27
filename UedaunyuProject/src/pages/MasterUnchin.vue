<template>
    <div>
        <keyboard-events v-on:keydown="keyboardEvent"></keyboard-events>
        <el-card>
            <div slot='header'>
                <span>運賃マスタ</span>
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
                            <label for='運賃' class='col-form-label px-1' style='width:100%;'>運賃</label>
                            <el-form-item label-width="0" prop="unchin">
                                <el-select v-model="data.search.model.unchin" style="width: 100%;" @change="autoCompleteUnchin" :disabled="data.confirmFlag">
                                    <el-option v-for="(unchin, index) in data.unchinData" :value='index' :label="'コード:' + unchin.unchinCD + 'ランク:' + unchin.unchinRank"  :key="unchin.number"></el-option>
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
                        <el-form :model="data.unchin.model" :rules="data.unchin.validation" ref="unchinForm" label-width="120px">

                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>
                                            運賃コード
                                        </th>
                                        <th>
                                            運賃ランク
                                        </th>
                                        <th>
                                            運賃
                                        </th>
                                    </tr>
                                </thead>
                                <tr>
                                    <td>
                                        <el-form-item label-width="0" prop="unchinCD">
                                            <el-input-number type='text'
                                                             style='width:100%;'
                                                             :disabled="data.search.model.syoriKubun != 0"
                                                             controls-position="right"
                                                             v-model="data.unchin.model.unchinCD"
                                                             @change="unchinCodeOverLap('code')"
                                                             :autofocus="data.autofocus.unchinCodeUnchin"></el-input-number>
                                        </el-form-item>
                                    </td>
                                    <td>
                                        <el-form-item label-width="0" prop="unchinRank">
                                            <el-input-number type='text'
                                                             style='width:100%;'
                                                             :disabled="data.search.model.syoriKubun != 0"
                                                             controls-position="right"
                                                             @change="unchinCodeOverLap('rank')"
                                                             v-model="data.unchin.model.unchinRank"></el-input-number>

                                        </el-form-item>
                                    </td>
                                    <td>
                                        <el-form-item label-width="0" prop="unchin">
                                            <el-input-number type='text'
                                                             style='width:100%;'
                                                             controls-position="right"
                                                             :disabled="data.search.model.syoriKubun == 2"
                                                             v-model="data.unchin.model.unchin"></el-input-number>

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
                            unchin: "",
                        },
                        validation: {
                            syoriKubun: [
                                { required: true, message: '処理区分が入力されていません', trigger: 'blur' },
                            ],
                            unchin: [
                                { required: true, message: '運賃が入力されていません' },
                            ]

                        }
                    },
                    unchin: {
                        model: {
                            unchinCD: null,
                            unchinRank: null,
                            unchin: null,
                        },
                        validation: {
                            unchinCD: [
                                { required: true, message: '運賃コードが入力されていません', trigger: 'blur' },
                            ],
                            unchinRank: [
                                { required: true, message: '運賃ランクが入力されていません', trigger: 'blur' },
                            ],
                            unchin: [
                                { required: true, message: '運賃がされていません', trigger: 'blur' },
                            ],
                        }
                    },
                    autoComplete: {
                        unchinCD: null,
                        unchinRank: null,
                        unchin: null,
                    },
                    confirmFlag: false,
                    updateButton: "",
                    autofocus: {
                        unchinCodeSearch: false,
                        unchinCodeUnchin: false,
                    },
                    unchinData: [],
                    unchinchiku: [],

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

                for (var i in this.data.unchin.model) {
                    this.data.unchin.model[i] = ""
                }
                this.data.updateButton = "";
                this.data.autofocus.unchinCodeSearch = true;
            },
            finish: function () {
                alert("終了");
            },
            autoCompleteUnchin: function (index) {

                var autoComplete = this.data.unchinData[index];

                for (var i in autoComplete) {
                    this.data.autoComplete[i] = autoComplete[i];
                }

            },
            confirm: function () {

                this.$refs['searchForm'].validate((valid) => {

                    if (valid) {


                        this.data.confirmFlag = true;

                        if (this.data.search.model.syoriKubun != 0) {
                            for (var i in this.data.unchin.model) {

                                this.data.unchin.model[i] = this.data.autoComplete[i];

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
            unchinCodeOverLap: function (kind) {


                axios.get(url.unchinMaster)
                    .then(response => {

                        var unchin = this.data.unchin.model;
                        for (var i in response.data) {

                            if (unchin.unchinCD == response.data[i].unchinCD && unchin.unchinRank == response.data[i].unchinRank) {
                                alert("入力した行は既に存在します");
                                if (kind == "code") {

                                    this.data.unchin.model.unchinCD = "";

                                } else if (kind == "rank") {

                                    this.data.unchin.model.unchinRank = "";

                                }

                            }

                        }

                    })
                    .catch(response => console.log(response))


            },
            submit: function () {

                this.$refs['unchinForm'].validate((valid) => {

                    if (valid) {


                        //※axiosによる更新処理

                        var unchin = this.data.unchin.model

                        var postArray = {
                            "unchinCD": unchin.unchinCD,
                            "unchinRank": unchin.unchinRank,
                            "unchin": unchin.unchin,
                            "Nyuryokutantocd": this.$store.state.login.userCode
                        }

                        if (this.data.search.model.syoriKubun == 0) {

                            axios.post(url.unchinMaster, postArray)
                                .then(response => {
                                    this.$message({
                                        message: '登録に成功しました',
                                        type: 'success'
                                    });
                                })
                                .catch(response => {
                                    this.$message({
                                        message: '登録に失敗しました',
                                        type: 'error'
                                    });
                                });


                            for (var i in this.data.unchin.model) {
                                this.data.unchin.model[i] = ""
                            }
                            this.data.autofocus.unchinCodeSeisansya = true;


                        } else {

                            if (this.data.search.model.syoriKubun == 1) {

                                axios.put(url.unchinMaster, postArray)
                                    .then(response => {
                                        this.$message({
                                            message: '修正に成功しました',
                                            type: 'success'
                                        });
                                    })
                                    .catch(response => {
                                        this.$message({
                                            message: '修正に失敗しました',
                                            type: 'error'
                                        });
                                    });

                            } else if (this.data.search.model.syoriKubun == 2) {

                                axios.delete(url.unchinMaster, { params: postArray })
                                    .then(response => {
                                        this.$message({
                                            message: '削除に成功しました',
                                            type: 'success'
                                        });

                                    })
                                    .catch(response => {
                                        this.$message({
                                            message: '削除に失敗しました',
                                            type: 'error'
                                        });
                                    })


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

                    console.log(response.data);
                    this.data.unchinData = response.data;

                })
                .catch(response => console.log(response))




            axios.get(url.meisyoMaster)
                .then(response => {

                    for (var i = 0; i < response.data.length; i++) {
                        if (response.data[i].meisyoCD == "7") {
                            this.data.unchinchiku.push(response.data[i]);
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
                    this.data.search.validation.unchin[0].required = false;
                } else {
                    this.data.search.validation.unchin[0].required = true;
                }
            },
   
        }
    }
</script>
