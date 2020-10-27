<template>
    <div>
        <keyboard-events v-on:keydown="keyboardEvent"></keyboard-events>
        <el-card>
            <div slot='header'>
                <span>等級別在庫一覧表</span>
            </div>
            <div slot='default'>
                <form id="niukeNyuryokuForm" v-focus-first-on-load v-focus-next-on-enter class='vld-parent'>
                    <div class='row' style="margin-top:2%;">
                        <div class='col-md-3'>
                            <label for='年度' class='col-form-label px-1' style='width:100%;'>年度</label>
                            <el-input-number v-model="data.selected.year"
                                             controls-position="right"
                                             @change="searchZaiko"
                                             :min="0"
                                             :max="Infinity"
                                             ></el-input-number>
                        </div>
                    </div>
                    <div class='row' style="margin-top:2%;">
                        <div class='col-md-4'>
                            <label for='商品区分' class='col-form-label px-1' style='width:100%;'>商品区分</label>
                            <el-select style='width:100%; margin-right:2%;' @change="searchZaiko" v-model="data.selected.syouhinKubun">
                                <el-option v-for="syouhin in data.syouhin" :value='syouhin.code' :label="syouhin.name" :key="syouhin.number"></el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class='row' style="margin-top:2%;">
                        <div class='col-md-4'>
                            <label for='品種' class='col-form-label px-1' style='width:100%;'>品種</label>
                            <el-select style='width:100%; margin-right:2%;' @change="searchZaiko" v-model="data.selected.hinsyu">
                                <el-option v-for="hinsyu in data.hinsyu" :value='hinsyu.code' :label="hinsyu.name" :key="hinsyu.number"></el-option>
                            </el-select>
                        </div>
                        <div class='col-md-4'>
                            <label for='等級' class='col-form-label px-1' style='width:100%;'>等級</label>
                            <el-select style='width:100%; margin-right:2%;' @change="searchZaiko" v-model="data.selected.tokyu" multiple>
                                <el-option v-for="tokyu in data.tokyu" :value='tokyu.code' :label="tokyu.name" :key="tokyu.number"></el-option>
                            </el-select>
                        </div>
                        <div class='col-md-4'>
                            <label for='回数' class='col-form-label px-1' style='width:100%;'>回数</label>
                            <el-input-number v-model="data.selected.kaisu"
                                             style='width:100%;'
                                             controls-position="right"
                                             @change="searchZaiko"
                                             :min="0"></el-input-number>
                        </div>

                    </div>
                </form>
                <div class='row' style="margin-top:2%;">
                    <div class='col-md-12'>
                        <div style='text-align:right;width:100%;'>
                            <el-button style='margin-left:2%;' type='primary' @click="search">検索</el-button>
                            <el-button style='margin-left:2%;' type='success' @click="print">印刷</el-button>
                            <el-button style='margin-left:2%;' type='info' @click="finish">終了</el-button>
                        </div>
                    </div>
                </div>
                <div class='row' style="margin-top:2%;">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>等級</th>
                                <th>区分</th>
                                <th v-for="size in data.size" v-bind:key="size.number">{{size.name}}</th>
                            </tr>
                        </thead>
                        <tbody v-for="tokyu in data.selected.tokyu" v-bind:key="tokyu.number">
                            <tr>
                                <td>{{getTokyu(tokyu).name}}</td>
                                <td>受入</td>
                                <td v-for="size in data.size" v-bind:key="size.number">{{getMeisai(tokyu,size.code) != undefined ? getMeisai(tokyu,size.code).NumberOfNiuke : "" }}</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>払出</td>
                                <td v-for="size in data.size" v-bind:key="size.number">{{getMeisai(tokyu,size.code) != undefined ? getMeisai(tokyu,size.code).NumberOfSyukka : ""}}</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>在庫</td>
                                <td v-for="size in data.size" v-bind:key="size.number">{{getMeisai(tokyu,size.code) != undefined ? getMeisai(tokyu,size.code).NumberOfZaiko : ""}}</td>
                            </tr>
                        </tbody>
                        <tbody>
                            <tr>
                                <td>合計</td>
                                <td>受入</td>
                                <td v-for="size in data.size" v-bind:key="size.number">{{returnNiukeTotal(size.code)}}</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>払出</td>
                                <td v-for="size in data.size" v-bind:key="size.number">{{returnSyukkaTotal(size.code)}}</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>在庫</td>
                                <td v-for="size in data.size" v-bind:key="size.number">{{returnZaikoTotal(size.code)}}</td>
                            </tr>
                        </tbody>
                    </table>
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


    export default {
        name: 'niukeNyuryokuSyoki',
        components: {
            Card, KeyboardEvents
        },
        data: function () {
            return {
                //端末番号持ってくる
                //methodsで使う際のnodeをmountedで登録し、取得する手間を省く
                element: {
                    syoriKubun: null,
                    niukeNyuryokuForm: null,
                },
                data: {
                    selected: {
                        year: 2020,
                        kaisu: 0,
                        syouhinKubun: "0",
                        hinsyu: "0",
                        tokyu: [],
                    },
                    checked: {
                        zaiko:false,
                    },
                    searchedFlag: false,
                    syouhin: [
                    ],
                    hinsyu: [
                    ],
                    size: [
                    ],
                    tokyu: [
                    ],
                    tokyuIchiran: [
                        
                    ],
                    meisaiIndex: {},


      
                },
            }
        },
  
        methods: {
            keyboardEvent(e) {
                if (e.keyCode == config.KEY_CODES.F5) {
                    return false;
                }
                if (e.keyCode == config.KEY_CODES.F12) {
                    return false;
                }
            },
            getTokyu: function (tokyuCode) {

                for (var i in this.data.tokyu) {

                    if (tokyuCode == this.data.tokyu[i].code) {
                        return this.data.tokyu[i];
                    }

                }

            },
            returnNiukeTotal: function (sizeCode) {

                var result = 0;

                for (var i = 0; i < this.data.tokyuIchiran.length; i++) {

                    var meisai = this.data.tokyuIchiran[i]

                    if (meisai.sizeCode == sizeCode) {

                        result += meisai.NumberOfNiuke;
                    }

                }
                return result;

            },
            returnSyukkaTotal: function (sizeCode) {

                var result = 0;

                for (var i = 0; i < this.data.tokyuIchiran.length; i++) {

                    var meisai = this.data.tokyuIchiran[i]

                    if (meisai.sizeCode == sizeCode) {

                        result += meisai.NumberOfSyukka;
                    }

                }
                return result;

            },
            returnZaikoTotal: function (sizeCode) {

                var result = 0;

                for (var i = 0; i < this.data.tokyuIchiran.length; i++) {

                    var meisai = this.data.tokyuIchiran[i]

                    if (meisai.sizeCode == sizeCode) {

                        result += meisai.NumberOfZaiko;
                    }

                }
                return result;

            },
            getMeisai: function (tokyuCode, sizeCode) {

                var index = this.data.meisaiIndex[tokyuCode][sizeCode];


                return this.data.tokyuIchiran[index];
            },
            createMeisaiIndex: function () {

                for (var i in this.data.tokyu) {

                    var tokyu_code = this.data.tokyu[i].code
                    this.data.meisaiIndex[tokyu_code] = {};

                    for (var k in this.data.size) {

                        var size_code = this.data.size[k].code;

                        this.data.meisaiIndex[tokyu_code][size_code] = null;

                    }

                }

                for (var l in this.data.tokyuIchiran) {
                    var meisai = this.data.tokyuIchiran[l];

                    this.data.meisaiIndex[meisai.tokyuCode][meisai.sizeCode] = l;
                }

            },
            getTokyuIchiran: function () {

                //※axiosで明細データを取ってくる
                this.data.tokyuIchiran = [
                    { year: "2020", syouhinCode: "1", hinsyuCode: "1", tokyuCode: "1", sizeCode: "1", kaisu: 0, NumberOfNiuke: 2, NumberOfSyukka: 1, NumberOfZaiko: 1, ConfirmFlag: 0 },
                    { year: "2020", syouhinCode: "1", hinsyuCode: "1", tokyuCode: "1", sizeCode: "2", kaisu: 0, NumberOfNiuke: 2, NumberOfSyukka: 1, NumberOfZaiko: 1, ConfirmFlag: 0 },
                    { year: "2020", syouhinCode: "1", hinsyuCode: "1", tokyuCode: "1", sizeCode: "3", kaisu: 0, NumberOfNiuke: 2, NumberOfSyukka: 1, NumberOfZaiko: 1, ConfirmFlag: 0 },
                    { year: "2020", syouhinCode: "1", hinsyuCode: "1", tokyuCode: "1", sizeCode: "4", kaisu: 0, NumberOfNiuke: 2, NumberOfSyukka: 1, NumberOfZaiko: 1, ConfirmFlag: 0 },
                    { year: "2020", syouhinCode: "1", hinsyuCode: "1", tokyuCode: "1", sizeCode: "5", kaisu: 0, NumberOfNiuke: 2, NumberOfSyukka: 1, NumberOfZaiko: 1, ConfirmFlag: 0 },
                    { year: "2020", syouhinCode: "1", hinsyuCode: "1", tokyuCode: "1", sizeCode: "6", kaisu: 0, NumberOfNiuke: 2, NumberOfSyukka: 1, NumberOfZaiko: 1, ConfirmFlag: 0 },
                    { year: "2020", syouhinCode: "1", hinsyuCode: "1", tokyuCode: "1", sizeCode: "7", kaisu: 0, NumberOfNiuke: 2, NumberOfSyukka: 1, NumberOfZaiko: 1, ConfirmFlag: 0 },
                    { year: "2020", syouhinCode: "1", hinsyuCode: "1", tokyuCode: "2", sizeCode: "1", kaisu: 0, NumberOfNiuke: 2, NumberOfSyukka: 1, NumberOfZaiko: 1, ConfirmFlag: 0 },
                    { year: "2020", syouhinCode: "1", hinsyuCode: "1", tokyuCode: "2", sizeCode: "2", kaisu: 0, NumberOfNiuke: 2, NumberOfSyukka: 1, NumberOfZaiko: 1, ConfirmFlag: 0 },
                    { year: "2020", syouhinCode: "1", hinsyuCode: "1", tokyuCode: "2", sizeCode: "3", kaisu: 0, NumberOfNiuke: 2, NumberOfSyukka: 1, NumberOfZaiko: 1, ConfirmFlag: 0 },
                    { year: "2020", syouhinCode: "1", hinsyuCode: "1", tokyuCode: "2", sizeCode: "4", kaisu: 0, NumberOfNiuke: 2, NumberOfSyukka: 1, NumberOfZaiko: 1, ConfirmFlag: 0 },
                    { year: "2020", syouhinCode: "1", hinsyuCode: "1", tokyuCode: "2", sizeCode: "5", kaisu: 0, NumberOfNiuke: 2, NumberOfSyukka: 1, NumberOfZaiko: 1, ConfirmFlag: 0 },
                    { year: "2020", syouhinCode: "1", hinsyuCode: "1", tokyuCode: "2", sizeCode: "6", kaisu: 0, NumberOfNiuke: 2, NumberOfSyukka: 1, NumberOfZaiko: 1, ConfirmFlag: 0 },
                    { year: "2020", syouhinCode: "1", hinsyuCode: "1", tokyuCode: "2", sizeCode: "7", kaisu: 0, NumberOfNiuke: 2, NumberOfSyukka: 1, NumberOfZaiko: 1, ConfirmFlag: 0 },
                    { year: "2020", syouhinCode: "1", hinsyuCode: "1", tokyuCode: "3", sizeCode: "1", kaisu: 0, NumberOfNiuke: 2, NumberOfSyukka: 1, NumberOfZaiko: 1, ConfirmFlag: 0 },
                    { year: "2020", syouhinCode: "1", hinsyuCode: "1", tokyuCode: "3", sizeCode: "2", kaisu: 0, NumberOfNiuke: 2, NumberOfSyukka: 1, NumberOfZaiko: 1, ConfirmFlag: 0 },
                    { year: "2020", syouhinCode: "1", hinsyuCode: "1", tokyuCode: "3", sizeCode: "3", kaisu: 0, NumberOfNiuke: 2, NumberOfSyukka: 1, NumberOfZaiko: 1, ConfirmFlag: 0 },
                    { year: "2020", syouhinCode: "1", hinsyuCode: "1", tokyuCode: "3", sizeCode: "4", kaisu: 0, NumberOfNiuke: 2, NumberOfSyukka: 1, NumberOfZaiko: 1, ConfirmFlag: 0 },
                    { year: "2020", syouhinCode: "1", hinsyuCode: "1", tokyuCode: "3", sizeCode: "5", kaisu: 0, NumberOfNiuke: 2, NumberOfSyukka: 1, NumberOfZaiko: 1, ConfirmFlag: 0 },
                    { year: "2020", syouhinCode: "1", hinsyuCode: "1", tokyuCode: "3", sizeCode: "6", kaisu: 0, NumberOfNiuke: 2, NumberOfSyukka: 1, NumberOfZaiko: 1, ConfirmFlag: 0 },
                    { year: "2020", syouhinCode: "1", hinsyuCode: "1", tokyuCode: "3", sizeCode: "7", kaisu: 0, NumberOfNiuke: 2, NumberOfSyukka: 1, NumberOfZaiko: 1, ConfirmFlag: 0 },
                    { year: "2020", syouhinCode: "1", hinsyuCode: "1", tokyuCode: "4", sizeCode: "1", kaisu: 0, NumberOfNiuke: 2, NumberOfSyukka: 1, NumberOfZaiko: 1, ConfirmFlag: 0 },
                    { year: "2020", syouhinCode: "1", hinsyuCode: "1", tokyuCode: "4", sizeCode: "2", kaisu: 0, NumberOfNiuke: 2, NumberOfSyukka: 1, NumberOfZaiko: 1, ConfirmFlag: 0 },
                    { year: "2020", syouhinCode: "1", hinsyuCode: "1", tokyuCode: "4", sizeCode: "3", kaisu: 0, NumberOfNiuke: 2, NumberOfSyukka: 1, NumberOfZaiko: 1, ConfirmFlag: 0 },
                    { year: "2020", syouhinCode: "1", hinsyuCode: "1", tokyuCode: "4", sizeCode: "4", kaisu: 0, NumberOfNiuke: 2, NumberOfSyukka: 1, NumberOfZaiko: 1, ConfirmFlag: 0 },
                    { year: "2020", syouhinCode: "1", hinsyuCode: "1", tokyuCode: "4", sizeCode: "5", kaisu: 0, NumberOfNiuke: 2, NumberOfSyukka: 1, NumberOfZaiko: 1, ConfirmFlag: 0 },
                    { year: "2020", syouhinCode: "1", hinsyuCode: "1", tokyuCode: "4", sizeCode: "6", kaisu: 0, NumberOfNiuke: 2, NumberOfSyukka: 1, NumberOfZaiko: 1, ConfirmFlag: 0 },
                    { year: "2020", syouhinCode: "1", hinsyuCode: "1", tokyuCode: "4", sizeCode: "7", kaisu: 0, NumberOfNiuke: 2, NumberOfSyukka: 1, NumberOfZaiko: 1, ConfirmFlag: 0 },
                    { year: "2020", syouhinCode: "1", hinsyuCode: "1", tokyuCode: "5", sizeCode: "1", kaisu: 0, NumberOfNiuke: 2, NumberOfSyukka: 1, NumberOfZaiko: 1, ConfirmFlag: 0 },
                    { year: "2020", syouhinCode: "1", hinsyuCode: "1", tokyuCode: "5", sizeCode: "2", kaisu: 0, NumberOfNiuke: 2, NumberOfSyukka: 1, NumberOfZaiko: 1, ConfirmFlag: 0 },
                    { year: "2020", syouhinCode: "1", hinsyuCode: "1", tokyuCode: "5", sizeCode: "3", kaisu: 0, NumberOfNiuke: 2, NumberOfSyukka: 1, NumberOfZaiko: 1, ConfirmFlag: 0 },
                    { year: "2020", syouhinCode: "1", hinsyuCode: "1", tokyuCode: "5", sizeCode: "4", kaisu: 0, NumberOfNiuke: 2, NumberOfSyukka: 1, NumberOfZaiko: 1, ConfirmFlag: 0 },
                    { year: "2020", syouhinCode: "1", hinsyuCode: "1", tokyuCode: "5", sizeCode: "5", kaisu: 0, NumberOfNiuke: 2, NumberOfSyukka: 1, NumberOfZaiko: 1, ConfirmFlag: 0 },
                    { year: "2020", syouhinCode: "1", hinsyuCode: "1", tokyuCode: "5", sizeCode: "6", kaisu: 0, NumberOfNiuke: 2, NumberOfSyukka: 1, NumberOfZaiko: 1, ConfirmFlag: 0 },
                    { year: "2020", syouhinCode: "1", hinsyuCode: "1", tokyuCode: "5", sizeCode: "7", kaisu: 0, NumberOfNiuke: 2, NumberOfSyukka: 1, NumberOfZaiko: 1, ConfirmFlag: 0 },
                ];


            },
            initMeisai: function () {
                this.data.tokyuIchiran = [];
            },
            selectedJudge: function () {

                if (this.data.selected.year == "" || (this.data.selected.kaisu == "" && this.data.selected.kaisu != 0)) {

                    alert("入力されてない値があります");
                    this.initMeisai();
                    return false;

                }
                return true;
            },
            searchZaiko: function () {

                if (!this.data.searchedFlag) {
                    return false;
                }

                if (this.selectedJudge) {

                    this.getTokyuIchiran();

                    this.createMeisaiIndex();

                }
              

            },
            search: function () {
                
                if (this.selectedJudge()) {

                    this.getTokyuIchiran();

                    this.createMeisaiIndex();

                    this.data.searchedFlag = true;

                }

            },
            print: function () {
                if (!window.confirm("印刷しますか？")) {
                    return false;
                }
                alert("印刷");
            },
            finish: function () {
                alert("終了");
            }
        },
        created: function () {

            //※商品、品種、サイズ、等級を取ってくる
            this.data.syouhin = [
                { code: "0", name: "干柿" },
                { code: "1", name: "柿ごのみ" },
                { code: "2", name: "あんぽ" },
                { code: "3", name: "等外" },
            ];
            this.data.hinsyu = [
                { code: "0", name: "三社" },
                { code: "1", name: "平核" },
            ];
            this.data.size = [
                { code: "1", name: "5L" },
                { code: "2", name: "4L" },
                { code: "3", name: "3L" },
                { code: "4", name: "2L" },
                { code: "5", name: "L" },
                { code: "6", name: "M" },
                { code: "7", name: "S" },

            ];
            this.data.tokyu = [
                { code: "1", name: "上" },
                { code: "2", name: "□上" },
                { code: "3", name: "〇上" },
                { code: "4", name: "中" },
                { code: "5", name: "並" },
            ];

            this.createMeisaiIndex();

        },
    }
</script>
