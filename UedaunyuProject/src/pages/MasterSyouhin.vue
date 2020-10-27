<template>
    <div>
        <keyboard-events v-on:keydown="keyboardEvent"></keyboard-events>
        <el-card>
            <div slot='header'>
                <span>商品マスタ</span>
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
                            <label for='商品' class='col-form-label px-1' style='width:100%;'>商品</label>
                            <el-form-item label-width="0" prop="syohinCode">

                                <el-increment-search v-model="data.search.model.syohinCode"
                                                     :display="[{key:'syohinmei',name:'名前'}]"
                                                     :autoComplete="['syohinCD','syohinmei','tujyoKbn','niukeTani','kayoibakoIrisuSize1','kayoibakoIrisuSize2','kayoibakoIrisuSize3','kayoibakoIrisuSize4','kayoibakoIrisuSize5','kayoibakoIrisuSize6','kayoibakoIrisuSize7','kayoibakoIrisuSize8','kayoibakoIrisuSize9']"
                                                     :kind="'商品'"
                                                     :required="true"
                                                     :disabled="data.confirmFlag"
                                                     :autofocus="data.autofocus.syohinCodeSearch"
                                                     @update="autoCompleteSyohin"></el-increment-search>
                                <el-input type='text'
                                          style='width:50%;'
                                          readonly
                                          :placeholder="'商品名'"
                                          :disabled="data.confirmFlag"
                                          v-model="data.search.model.syohinName"></el-input>
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
                        <el-form :model="data.syohin.model" :rules="data.syohin.validation" ref="syohinForm" label-width="120px">

                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>
                                            商品コード
                                        </th>
                                        <th>
                                            商品名
                                        </th>
                                        <th>
                                            荷受単位
                                        </th>
                                        <th>
                                            通常区分
                                        </th>
                                    </tr>
                                </thead>
                                <tr>
                                    <td>
                                        <el-form-item label-width="0" prop="syohinCD">
                                            <el-input type='text'
                                                      style='width:100%;'
                                                      :disabled="data.search.model.syoriKubun != 0"
                                                      v-model="data.syohin.model.syohinCD"
                                                      @change="syohinCodeOverLap"
                                                      :autofocus="data.autofocus.syohinCodeSyohin"></el-input>

                                        </el-form-item>
                                    </td>
                                    <td>
                                        <el-form-item label-width="0" prop="syohinmei">
                                            <el-input type='text'
                                                      style='width:100%;'
                                                      v-model="data.syohin.model.syohinmei"></el-input>

                                        </el-form-item>
                                    </td>
                                    <td>
                                        <el-form-item label-width="0" prop="niukeTani">
                                            <el-select v-model="data.syohin.model.niukeTani" style="width: 100%;">
                                                <el-option value='0' :label="'0'"></el-option>
                                                <el-option value='1' :label="'1'"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </td>
                                    <td>
                                        <el-form-item label-width="0" prop="tujyoKbn">
                                            <el-select v-model="data.syohin.model.tujyoKbn" style="width: 100%;">
                                                <el-option value='0' :label="'0'"></el-option>
                                                <el-option value='1' :label="'1'"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </td>

                                </tr>
                            </table>
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>
                                            通箱入数サイズ1
                                        </th>
                                        <th>
                                            通箱入数サイズ2
                                        </th>
                                        <th>
                                            通箱入数サイズ3
                                        </th>
                                        <th>
                                            通箱入数サイズ4
                                        </th>
                                        <th>
                                            通箱入数サイズ5
                                        </th>
                                        <th>
                                            通箱入数サイズ6
                                        </th>
                                        <th>
                                            通箱入数サイズ7
                                        </th>
                                        <th>
                                            通箱入数サイズ8
                                        </th>
                                        <th>
                                            通箱入数サイズ9
                                        </th>
                                    </tr>
                                </thead>
                                <tr>
                                    <td>
                                        <el-form-item label-width="0" prop="kayoibakoIrisuSize1">
                                            <el-input-number type='text'
                                                             style='width:100%;'
                                                             controls-position="right"
                                                             v-model="data.syohin.model.kayoibakoIrisuSize1"></el-input-number>

                                        </el-form-item>
                                    </td>
                                    <td>
                                        <el-form-item label-width="0" prop="kayoibakoIrisuSize2">
                                            <el-input-number type='text'
                                                             style='width:100%;'
                                                             controls-position="right"
                                                             v-model="data.syohin.model.kayoibakoIrisuSize2"></el-input-number>

                                        </el-form-item>
                                    </td>
                                    <td>
                                        <el-form-item label-width="0" prop="kayoibakoIrisuSize3">
                                            <el-input-number type='text'
                                                             style='width:100%;'
                                                             controls-position="right"
                                                             v-model="data.syohin.model.kayoibakoIrisuSize3"></el-input-number>

                                        </el-form-item>
                                    </td>
                                    <td>
                                        <el-form-item label-width="0" prop="kayoibakoIrisuSize4">
                                            <el-input-number type='text'
                                                             style='width:100%;'
                                                             controls-position="right"
                                                             v-model="data.syohin.model.kayoibakoIrisuSize4"></el-input-number>

                                        </el-form-item>
                                    </td>
                                    <td>
                                        <el-form-item label-width="0" prop="kayoibakoIrisuSize5">
                                            <el-input-number type='text'
                                                             style='width:100%;'
                                                             controls-position="right"
                                                             v-model="data.syohin.model.kayoibakoIrisuSize5"></el-input-number>

                                        </el-form-item>
                                    </td>
                                    <td>
                                        <el-form-item label-width="0" prop="kayoibakoIrisuSize6">
                                            <el-input-number type='text'
                                                             style='width:100%;'
                                                             controls-position="right"
                                                             v-model="data.syohin.model.kayoibakoIrisuSize6"></el-input-number>

                                        </el-form-item>
                                    </td>
                                    <td>
                                        <el-form-item label-width="0" prop="kayoibakoIrisuSize7">
                                            <el-input-number type='text'
                                                             style='width:100%;'
                                                             controls-position="right"
                                                             v-model="data.syohin.model.kayoibakoIrisuSize7"></el-input-number>

                                        </el-form-item>
                                    </td>
                                    <td>
                                        <el-form-item label-width="0" prop="kayoibakoIrisuSize8">
                                            <el-input-number type='text'
                                                             style='width:100%;'
                                                             controls-position="right"
                                                             v-model="data.syohin.model.kayoibakoIrisuSize8"></el-input-number>

                                        </el-form-item>
                                    </td>
                                    <td>
                                        <el-form-item label-width="0" prop="kayoibakoIrisuSize9">
                                            <el-input-number type='text'
                                                             style='width:100%;'
                                                             controls-position="right"
                                                             v-model="data.syohin.model.kayoibakoIrisuSize9"></el-input-number>

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
                            syohinCode: "",
                            syohinName: ""
                        },
                        validation: {
                            syoriKubun: [
                                { required: true, message: '処理区分が入力されていません', trigger: 'blur' },
                            ],
                            syohinCode: [
                                { required: true, message: '商品コードが入力されていません' },
                            ]

                        }
                    },
                    syohin: {
                        model: {
                            syohinCode: "",
                            syohinCD: "",
                            syohinmei: "",
                            tujyoKbn: "",
                            niukeTani: "",
                            kayoibakoIrisuSize1: "",
                            kayoibakoIrisuSize2: "",
                            kayoibakoIrisuSize3: "",
                            kayoibakoIrisuSize4: "",
                            kayoibakoIrisuSize5: "",
                            kayoibakoIrisuSize6: "",
                            kayoibakoIrisuSize7: "",
                            kayoibakoIrisuSize8: "",
                            kayoibakoIrisuSize9: "",


                        },
                        validation: {
                            syohinCD: [
                                { required: true, message: '商品コードコードが入力されていません', trigger: 'blur' },
                            ],
                            syohinmei: [
                                { required: true, message: '商品名が入力されていません', trigger: 'blur' },
                            ],
                            tel: [
                                { validator: this.is_tel, trigger: 'blur' },
                            ],

                        }
                    },
                    autoComplete: {
                        syohinCD: "",
                        syohinmei: "",
                        tujyoKbn: "",
                        niukeTani: "",
                        kayoibakoIrisuSize1: "",
                        kayoibakoIrisuSize2: "",
                        kayoibakoIrisuSize3: "",
                        kayoibakoIrisuSize4: "",
                        kayoibakoIrisuSize5: "",
                        kayoibakoIrisuSize6: "",
                        kayoibakoIrisuSize7: "",
                        kayoibakoIrisuSize8: "",
                        kayoibakoIrisuSize9: "",
                    },
                    confirmFlag: false,
                    updateButton: "",
                    autofocus: {
                        syohinCodeSearch: false,
                        syohinCodeSyohin: false,

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
            clear: function () {

                this.data.confirmFlag = false;

                for (var i in this.data.syohin.model) {
                    this.data.syohin.model[i] = ""
                }
                this.data.updateButton = "";
                this.data.autofocus.syohinCodeSearch = true;
            },
            finish: function () {
                alert("終了");
            },
            autoCompleteSyohin: function (autoComplete) {

                this.data.search.model.syohinName = autoComplete.syohinmei;

                for (var i in autoComplete) {
                    if (i == "syohinCD") {
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

                            for (var i in this.data.autoComplete) {

                                this.data.syohin.model[i] = this.data.autoComplete[i];

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
            syohinCodeOverLap: function (new_value) {


                axios.get(url.syouhinMaster)
                    .then(response => {

                        for (var i in response.data) {

                            if (new_value == response.data[i].syohinCD) {
                                alert("入力したコードは既に存在します");
                                this.data.syohin.model.syohinCode = "";
                            }

                        }

                    })
                    .catch(response => console.log(response))


            },
            submit: function () {

                this.$refs['syohinForm'].validate((valid) => {

                    if (valid) {


                        //※axiosによる更新処理

                        var syohin = this.data.syohin.model

                        var postArray = {
                            syohinCD: syohin.syohinCD,
                            syohinmei: syohin.syohinmei,
                            tujyoKbn: syohin.tujyoKbn,
                            niukeTani: syohin.niukeTani,
                            kayoibakoIrisuSize1: syohin.kayoibakoIrisuSize1,
                            kayoibakoIrisuSize2: syohin.kayoibakoIrisuSize2,
                            kayoibakoIrisuSize3: syohin.kayoibakoIrisuSize3,
                            kayoibakoIrisuSize4: syohin.kayoibakoIrisuSize4,
                            kayoibakoIrisuSize5: syohin.kayoibakoIrisuSize5,
                            kayoibakoIrisuSize6: syohin.kayoibakoIrisuSize6,
                            kayoibakoIrisuSize7: syohin.kayoibakoIrisuSize7,
                            kayoibakoIrisuSize8: syohin.kayoibakoIrisuSize8,
                            kayoibakoIrisuSize9: syohin.kayoibakoIrisuSize9,
                            userCode: this.$store.state.login.userCode
                        }

                        console.log(postArray);

                        if (this.data.search.model.syoriKubun == 0) {

                            axios.post(url.syohinMaster, postArray)
                                .then(response => {
                                    console.log("成功");
                                })
                                .catch(response => console.log(response))


                            for (var i in this.data.syohin.model) {
                                this.data.syohin.model[i] = ""
                            }
                            this.data.autofocus.syohinCodeSyohin = true;


                        } else {

                            if (this.data.search.model.syoriKubun == 1) {

                                axios.put(url.syohinMaster, postArray)
                                    .then(response => {
                                        console.log("成功");
                                    })
                                    .catch(response => console.log(response))

                            } else if (this.data.search.model.syoriKubun == 2) {

                                axios.delete(url.syohinMaster, postArray)
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
                    this.data.search.validation.syohinCode[0].required = false;
                } else {
                    this.data.search.validation.syohinCode[0].required = true;
                }
            }

        }
    }
</script>
