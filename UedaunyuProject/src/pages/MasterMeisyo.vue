<template>
    <div>
        <keyboard-events v-on:keydown="keyboardEvent"></keyboard-events>
        <el-card>
            <div slot='header'>
                <span>名称マスタ</span>
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
                            <label for='名称' class='col-form-label px-1' style='width:100%;'>名称</label>
                            <el-form-item label-width="0" prop="meisyo">
                                <el-select v-model="data.search.model.meisyo" style="width: 100%;" @change="autoCompleteMeisyo" :disabled="data.confirmFlag">
                                    <el-option v-for="(meisyo, index) in data.meisyoData" :value='index' :label="'コード:' + meisyo.meisyoCD + '　名前:' + meisyo.meisyo" :key="meisyo.number"></el-option>
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
                        <el-form :model="data.meisyo.model" :rules="data.meisyo.validation" ref="meisyoForm" label-width="120px">

                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>
                                            名称コード
                                        </th>
                                        <th>
                                            値
                                        </th>
                                        <th>
                                            名称
                                        </th>
                                        <th>
                                            説明
                                        </th>
                                        <th>
                                            項目説明
                                        </th>
                                    </tr>
                                </thead>
                                <tr>
                                    <td>
                                        <el-form-item label-width="0" prop="meisyoCD">
                                            <el-input type='text'
                                                      style='width:100%;'
                                                      :disabled="data.search.model.syoriKubun != 0"
                                                      v-model="data.meisyo.model.meisyoCD"
                                                      @change="meisyoCodeOverLap('code')"
                                                      :autofocus="data.autofocus.meisyoCodeMeisyo"></el-input>
                                        </el-form-item>
                                    </td>
                                    <td>
                                        <el-form-item label-width="0" prop="atai">
                                            <el-input-number type='text'
                                                             style='width:100%;'
                                                             :disabled="data.search.model.syoriKubun != 0"
                                                             controls-position="right"
                                                             @change="meisyoCodeOverLap('atai')"
                                                             v-model="data.meisyo.model.atai"></el-input-number>

                                        </el-form-item>
                                    </td>
                                    <td>
                                        <el-form-item label-width="0" prop="meisyo">
                                            <el-input type='text'
                                                      style='width:100%;'
                                                      :disabled="data.search.model.syoriKubun == 2"
                                                      v-model="data.meisyo.model.meisyo"></el-input>

                                        </el-form-item>
                                    </td>
                                    <td>
                                        <el-input type='text'
                                                  style='width:100%;'
                                                  :disabled="data.search.model.syoriKubun == 2"
                                                  v-model="data.meisyo.model.setumei"></el-input>

                                    </td>
                                    <td>
                                        <el-input type='text'
                                                  style='width:100%;'
                                                  :disabled="data.search.model.syoriKubun == 2"
                                                  v-model="data.meisyo.model.komokuSetumei"></el-input>

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
                            meisyo: "",
                        },
                        validation: {
                            syoriKubun: [
                                { required: true, message: '処理区分が入力されていません', trigger: 'blur' },
                            ],
                            meisyo: [
                                { required: true, message: '名称が入力されていません' },
                            ]

                        }
                    },
                    meisyo: {
                        model: {
                            meisyoCD: null,
                            atai: null,
                            meisyo: null,
                            setumei: "",
                            komokuSetumei: "",
                        },
                        validation: {
                            meisyoCD: [
                                { required: true, message: '名称コードが入力されていません', trigger: 'blur' },
                            ],
                            meisyoRank: [
                                { required: true, message: '値が入力されていません', trigger: 'blur' },
                            ],
                            meisyo: [
                                { required: true, message: '名称がされていません', trigger: 'blur' },
                            ],
                        }
                    },
                    autoComplete: {
                        meisyoCD: null,
                        atai: null,
                        meisyo: null,
                        setumei: "",
                        komokuSetumei: "",
                    },
                    confirmFlag: false,
                    updateButton: "",
                    autofocus: {
                        meisyoCodeSearch: false,
                        meisyoCodeMeisyo: false,
                    },
                    meisyoData: [],
                    meisyochiku: [],

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

                for (var i in this.data.meisyo.model) {
                    this.data.meisyo.model[i] = ""
                }
                this.data.updateButton = "";
                this.data.autofocus.meisyoCodeSearch = true;
            },
            finish: function () {
                alert("終了");
            },
            autoCompleteMeisyo: function (index) {

                var autoComplete = this.data.meisyoData[index];

                for (var i in autoComplete) {
                    this.data.autoComplete[i] = autoComplete[i];
                }

            },
            confirm: function () {

                this.$refs['searchForm'].validate((valid) => {

                    if (valid) {


                        this.data.confirmFlag = true;

                        if (this.data.search.model.syoriKubun != 0) {
                            for (var i in this.data.meisyo.model) {

                                this.data.meisyo.model[i] = this.data.autoComplete[i];

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
            meisyoCodeOverLap: function (kind) {


                axios.get(url.meisyoMaster)
                    .then(response => {

                        var meisyo = this.data.meisyo.model;
                        for (var i in response.data) {

                            if (meisyo.meisyoCD == response.data[i].meisyoCD && meisyo.atai == response.data[i].atai) {
                                alert("入力した行は既に存在します");
                                if (kind == "code") {

                                    this.data.meisyo.model.meisyoCD = "";

                                } else if (kind == "atai") {

                                    this.data.meisyo.model.atai = "";

                                }

                            }

                        }

                    })
                    .catch(response => console.log(response))


            },
            submit: function () {

                this.$refs['meisyoForm'].validate((valid) => {

                    if (valid) {


                        //※axiosによる更新処理

                        var meisyo = this.data.meisyo.model

                        var postArray = {
                            "meisyoCD": meisyo.meisyoCD,
                            "atai": meisyo.atai,
                            "meisyo": meisyo.meisyo,
                            "setumei": meisyo.setumei,
                            "komokuSetumei": meisyo.komokuSetumei,
                            "Nyuryokutantocd": this.$store.state.login.userCode

                        }

                        console.log(postArray)

                        if (this.data.search.model.syoriKubun == 0) {

                            axios.post(url.meisyoMaster, postArray)
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


                            for (var i in this.data.meisyo.model) {
                                this.data.meisyo.model[i] = ""
                            }
                            this.data.autofocus.meisyoCodeSeisansya = true;


                        } else {

                            if (this.data.search.model.syoriKubun == 1) {

                                axios.put(url.meisyoMaster, postArray)
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

                                axios.delete(url.meisyoMaster, { params: postArray })
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


            axios.get(url.meisyoMaster)
                .then(response => {

                    this.data.meisyoData = response.data;

                })
                .catch(response => console.log(response))



        },
        mounted: function () {

        },
        watch: {
            "data.search.model.syoriKubun": function (new_value) {

                if (new_value == 0) {
                    this.data.search.validation.meisyo[0].required = false;
                } else {
                    this.data.search.validation.meisyo[0].required = true;
                }
            },

        }
    }
</script>
