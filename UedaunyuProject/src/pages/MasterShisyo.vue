<template>
    <div>
        <keyboard-events v-on:keydown="keyboardEvent"></keyboard-events>
        <el-card>
            <div slot='header'>
                <span>支所マスタ</span>
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
                            <label for='支所' class='col-form-label px-1' style='width:100%;'>支所</label>
                            <el-form-item label-width="0" prop="seisansyaCode">

                                <el-increment-search v-model="data.search.model.shisyoCode"
                                                     :display="[{key:'shisyomei',name:'名前'}]"
                                                     :autoComplete="['shisyoCD','shisyomei','shisyomeiRyakusyo','seisanSyoreikin','zenkiSeisanSyoreikin']"
                                                     :kind="'支所'"
                                                     :required="true"
                                                     :disabled="data.confirmFlag"
                                                     :autofocus="data.autofocus.shisyoCodeSearch"
                                                     @update="autoCompleteShisyo"></el-increment-search>
                                <el-input type='text'
                                          style='width:50%;'
                                          readonly
                                          :placeholder="'支所名'"
                                          :disabled="data.confirmFlag"
                                          v-model="data.search.model.shisyoName"></el-input>
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
                        <el-form :model="data.shisyo.model" :rules="data.shisyo.validation" ref="shisyoForm" label-width="120px">

                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>
                                            支所コード
                                        </th>
                                        <th>
                                            支所名
                                        </th>
                                        <th>
                                            支所名略称
                                        </th>
                                        <th>
                                            生産奨励金
                                        </th>
                                        <th>
                                            前期生産奨励金
                                        </th>
                                    </tr>
                                </thead>
                                <tr>
                                    <td>
                                        <el-form-item label-width="0" prop="shisyoCD">
                                            <el-input-number type='text'
                                                             style='width:100%;'
                                                             controls-position="right"
                                                             :disabled="data.search.model.syoriKubun != 0"
                                                             v-model="data.shisyo.model.shisyoCD"
                                                             @change="shisyoCodeOverLap"
                                                             :autofocus="data.autofocus.shisyoCodeShisyo"></el-input-number>

                                        </el-form-item>
                                    </td>
                                    <td>
                                        <el-form-item label-width="0" prop="shisyomei">
                                            <el-input type='text'
                                                      style='width:100%;'
                                                      :disabled="data.search.model.syoriKubun == 2"
                                                      v-model="data.shisyo.model.shisyomei"></el-input>

                                        </el-form-item>
                                    </td>
                                    <td>
                                        <el-form-item label-width="0" prop="shisyomeiRyakusyo">
                                            <el-input type='text'
                                                      style='width:100%;'
                                                      :disabled="data.search.model.syoriKubun == 2"
                                                      v-model="data.shisyo.model.shisyomeiRyakusyo"></el-input>

                                        </el-form-item>
                                    </td>
                                    <td>
                                        <el-form-item label-width="0" prop="seisanSyoreikin">
                                            <el-input-number type='text'
                                                             style='width:100%;'
                                                             controls-position="right"
                                                             :disabled="data.search.model.syoriKubun == 2"
                                                             v-model="data.shisyo.model.seisanSyoreikin"></el-input-number>
                                        </el-form-item>
                                    </td>
                                    <td>
                                        <el-form-item label-width="0" prop="zenkiSeisanSyoreikin">
                                            <el-input-number type='text'
                                                             style='width:100%;'
                                                             controls-position="right"
                                                             :disabled="data.search.model.syoriKubun == 2"
                                                             v-model="data.shisyo.model.zenkiSeisanSyoreikin"></el-input-number>
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
                            shisyoCode: "",
                            shisyoName: ""
                        },
                        validation: {
                            syoriKubun: [
                                { required: true, message: '処理区分が入力されていません', trigger: 'blur' },
                            ],
                            shisyoCode: [
                                { required: true, message: '支所コードが入力されていません' },
                            ]

                        }
                    },
                    shisyo: {
                        model: {
                            shisyoCD: "",
                            shisyomei: "",
                            shisyomeiRyakusyo: "",
                            seisanSyoreikin: "",
                            zenkiSeisanSyoreikin: "",
                        },
                        validation: {
                            shisyoCD: [
                                { required: true, message: '支所コードが入力されていません', trigger: 'blur' },
                            ],
                            shisyomei: [
                                { required: true, message: '支所名が入力されていません', trigger: 'blur' },
                            ],
                        }
                    },
                    autoComplete: {
                        shisyoCD: "",
                        shisyomei: "",
                        shisyomeiRyakusyo: "",
                        seisanSyoreikin: "",
                        zenkiSeisanSyoreikin: "",
                    },
                    confirmFlag: false,
                    updateButton: "",
                    autofocus: {
                        shisyoCodeSearch: false,
                        shisyoCodeShisyo: false,
                    },
                    unchin: [],
                    shisyochiku: [],

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

                for (var i in this.data.shisyo.model) {
                    this.data.shisyo.model[i] = ""
                }
                this.data.updateButton = "";
                this.data.autofocus.shisyoCodeSearch = true;
            },
            finish: function () {
                alert("終了");
            },
            autoCompleteShisyo: function (autoComplete) {

                this.data.search.model.shisyoName = autoComplete.shisyomei;

                for (var i in this.data.autoComplete) {
                    if (i == "shisyoCD") {
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

                            for (var i in this.data.shisyo.model) {

                                this.data.shisyo.model[i] = this.data.autoComplete[i];

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
            shisyoCodeOverLap: function (new_value) {


                axios.get(url.shisyoMaster)
                    .then(response => {

                        for (var i in response.data) {

                            if (new_value == response.data[i].shisyoCD) {
                                alert("入力したコードは既に存在します");
                                this.data.shisyo.model.shisyoCD = "";
                            }

                        }

                    })
                    .catch(response => console.log(response))


            },
            submit: function () {

                this.$refs['shisyoForm'].validate((valid) => {

                    if (valid) {

                        var shisyo = this.data.shisyo.model

                        var postArray = {
                            "shisyoCD": shisyo.shisyoCD,
                            "shisyomei": shisyo.shisyomei,
                            "shisyomeiRyakusyo": shisyo.shisyomeiRyakusyo,
                            "seisanSyoreikin": shisyo.seisanSyoreikin,
                            "zenkiSeisanSyoreikin": shisyo.zenkiSeisanSyoreikin,
                            "Nyuryokutantocd": this.$store.state.login.userCode
                        }

                        if (this.data.search.model.syoriKubun == 0) {

                            axios.post(url.shisyoMaster, postArray)
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

                                axios.put(url.shisyoMaster, postArray)
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

                                axios.delete(url.shisyoMaster, { params: postArray })
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
                            this.data.shisyochiku.push(response.data[i]);
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
                    this.data.search.validation.shisyoCode[0].required = false;
                } else {
                    this.data.search.validation.shisyoCode[0].required = true;
                }
            },
            "data.shisyo.model.tesuryoKbn": function (new_value) {

                if (new_value == 1) {

                    this.data.shisyo.model.tesuryoRate = 0;
                }

            }

        }
    }
</script>
