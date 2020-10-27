<template>
    <div>
        <keyboard-events v-on:keydown="keyboardEvent"></keyboard-events>
        <el-card>
            <div slot='header'>
                <span>販売集計</span>
            </div>
            <div slot='default'>
                <form id="niukeSyukeiForm" v-focus-first-on-load v-focus-next-on-enter class='vld-parent'>
                    <div class="row">
                        <div class='col-md-8'>
                            <label for='集計対象回数' class='col-form-label px-1' style='width:100%;'>集計対象回数</label>
                            <el-input-number type='text'
                                             style='width:35%;margin-right:2%;'
                                             v-model='data.frequencyBottom'
                                             :min="0"
                                             :max="data.frequencyTop"       
                                             controls-position="right"
                                             ></el-input-number>
                            <span style='margin-right:2%;'>から</span>
                            <el-input-number type='text'
                                             style='width:35%;margin-right:2%;'
                                             v-model='data.frequencyTop'
                                             :min="data.frequencyBottom"       
                                             controls-position="right"
                                             ></el-input-number>
                            <span>まで</span>
                        </div>
                        <div class="col-md-4">
                            <label for='対象商品' class='col-form-label px-1' style='width:100%;'>対象商品</label>
                            <el-select v-model="data.taisyouSyouhin" multiple style='width:100%;'>
                                <el-option  v-for="syouhin in data.syouhin" v-bind:key="syouhin.number" :label="syouhin.name" :value="syouhin.code"></el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class='row'>
                        <div class='col-md-6'>
                            <label for='処理件数' class='col-form-label px-1' style="width:100%;">処理件数</label>
                            <el-input id="syouhinName"
                                      type='text'
                                      style='width:80%;margin-right:2%;'
                                      v-model="data.transactions"
                                      readonly></el-input>

                            <span>件</span>
                        </div>
                    </div>
                </form>
                <div class="row">
                    <div class="col-12">
                        <div style='text-align:right;width:100%;'>
                            <el-button style='margin-left:2%;' type='primary' v-on:click="submit">実行(F9)</el-button>
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

    export default {
        name: 'niukeSyukei',
        components: {
            Card, KeyboardEvents
        },
        data: function () {
            return {
                data: {
                    frequencyTop: 0,
                    frequencyBottom: 99,
                    transactions: "",
                    syouhin: [
                    ],
                    taisyouSyouhin: [],

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

   
                if (!window.confirm("販売集計を行います。よろしいですか？")) {

                    return false;
                }



                //submitのスクリプト
                //this.element.niukeSyukeiForm.submit();
            },
        },
        created: function () {

            //※商品の取得
            this.data.syouhin = [
                { name: "干柿", code: "0" },
                { name: "あんぽ", code: "1" },
                { name: "柿ごのみ", code: "2" },
                { name: "等外", code: "3" },
            ];
        },
        mounted: function () {
   
        },

    }
</script>
