<template>
    <div>
        <keyboard-events v-on:keydown="keyboardEvent"></keyboard-events>
        <el-card>
            <div slot='header'>
                <span>在庫更新処理</span>
            </div>
            <div slot='default'>
                <el-form :model="data.model" :rules="data.validation" ref="Form" label-width="120px">
                    <div class="row">
                        <div class='col-md-3'>
                            <label for='在庫更新日' class='col-form-label px-1' style='width:100%;'>在庫更新日</label>
                            <el-form-item label-width="0" prop="zaikoKoushinDate">
                                <el-input v-model="data.model.zaikoKoushinDate"
                                          type='date'
                                          min='1000-01-01'
                                          max='9999-12-31'></el-input>
                            </el-form-item>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-4">
                            <label for='回数' class='col-form-label px-1' style='width:100%;'>回数</label>
                            <el-form-item label-width="0" prop="kaisu">

                                <el-select v-model="data.model.kaisu" style='width:100%;'>
                                    <el-option v-for="kaisu in data.kaisu" v-bind:key="kaisu.number" :label="kaisu" :value="kaisu"></el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                    </div>
                </el-form>

                <div class="row">
                    <div class="col-12">
                        <div style='text-align:right;width:100%;'>
                            <el-button style='margin-left:2%;' type='primary' v-on:click="submit">更新(F9)</el-button>
                            <el-button type='success' v-on:click="finish">終了(F12)</el-button>
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
    import AddMethods from '@/js/add/add.js'
    import config from '@/config.js'
    import time from '@/js/status/time.js'


    export default {
        name: 'niukeSyukei',
        components: {
            Card, KeyboardEvents
        },
        data: function () {
            return {
                data: {
                    model: {
                        zaikoKoushinDate: "",
                        kaisu: "",
                    },
                    validation: {
                        zaikoKoushinDate: [
                            { required: true, message: '在庫更新日が入力されていません' },
                        ],
                        kaisu: [
                            { required: true, message: '回数が入力されていません' },
                        ],

                    },
                    kaisu: [],
                },
            }
        },
        methods: {
            keyboardEvent(e) {
                if (e.keyCode == config.KEY_CODES.F9) {
                    this.submit()
                }
                if (e.keyCode == config.KEY_CODES.F12) {
                    this.finish()
                }
            },
            finish: function () {
                alert("終了");
            },
            submit: function () {

                this.$refs['Form'].validate((valid) => {
                    if (valid) {
                        alert("更新");
                        return true;
                    } else {
                        return false;
                    }
                });



                //submitのスクリプト
                //this.element.niukeSyukeiForm.submit();
            },
        },
        created: function () {

            //※axiosで取ってくる
            this.data.model.zaikoKoushinDate = "2020-09-02";

            this.data.kaisu = [
                1, 2, 4, 6, 7
            ];
        },
        mounted: function () {

        },

    }
</script>
