<template>
    <div>
        <keyboard-events v-on:keydown="keyboardEvent"></keyboard-events>
        <el-card>
            <div slot='header'>
                <span>出荷予定入力</span>
            </div>
            <div slot='default'
                 v-loading="loading"
                 element-loading-text="保存中"
                 element-loading-spinner="el-icon-loading"
                 element-loading-background="rgba(0, 0, 0, 0.8)">
                <form id="niukeNyuryokuForm">
                    <div class='row'>
                        <el-form :model="model" :rules="validation" ref="searchForm" label-width="120px">

                            <div class='col-md-12'>
                                <label for='商品' class='col-form-label px-1' style='width:100%;'>商品</label>
                                <el-form-item label-width="0" prop="selectedSyouhin" style='width:100%;'>
                                    <el-select id="syoriKubun" v-model="model.selectedSyouhin" @change="changeMeisai" style="width:100%; display:block;">
                                        <el-option v-for="(syouhin ,index) in syouhin" v-bind:key="syouhin.number" :value='syouhin.syohinCD' :label="syouhin.syohinmei"></el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                            <div class='col-md-12'>
                                <label for='日付' class='col-form-label px-1' style='width:100%;'>日付</label>
                                <el-form-item label-width="0" prop="nyuryokuDate">
                                    <el-input type='date'
                                              v-model="model.nyuryokuDate"
                                              style="width:100%; display:block;"
                                              @change="changeMeisai"></el-input>
                                </el-form-item>

                            </div>
                        </el-form>
                    </div>
                    <div class="row">
                        <div class='col-md-12' v-for="chiku in chiku" :key="chiku.number" style='margin-top:2%;white-space:nowrap;overflow-x:scroll;'>
                            <p>地区:{{chiku.meisyo}}</p>
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th></th>
                                        <th v-for="shijoData in getShijoByChiku(chiku.atai)" :key="shijoData.number" v-bind:colspan="shijoData.visible ? shijoColspan():1"><el-button type="danger" round v-on:click=" $set(shijoData, 'visible', !shijoData.visible)">{{shijoData.visible ? "非表示":"表示"}}</el-button>　{{shijoData.shijyomei}}</th>
                                    </tr>
                                    <tr>
                                        <th>サイズ</th>
                                        <th>等級</th>
                                        <th v-for="housou_pattern in housouPatternThead(chiku.atai)" :key="housou_pattern.number" v-bind:colspan="housou_pattern.colspan">{{housou_pattern.name}}</th>
                                    </tr>
                                    <tr>
                                        <th></th>
                                        <th></th>
                                        <th v-for="input_kind in getTdKind(chiku.atai)" :key="input_kind.number">{{input_kind}}</th>
                                    </tr>
                                </thead>
                                <tbody v-for="(size,size_index) in size" :key="size.number">
                                    <tr v-for="tokyu_key in size.tokyu" :key="tokyu_key.number">
                                        <td>{{size.sizeHyojimei}}</td>
                                        <td>{{tokyu[tokyuIndex[tokyu_key]].tokyuHyojimei}}</td>
                                        <td v-for="(table_data,table_data_index) in getTableData(chiku.atai,size.size,tokyu_key)" :key="table_data.number" v-bind:class="!shijo[shijoIndex[table_data.shijyo]].visible && Number(table_data_index)%housouPattern.length != 0 ? 'unvisible' : ''" v-bind:colspan="shijo[shijoIndex[table_data.shijyo]].visible ? 2 : 1">
                                            <el-input-number v-model="table_data.oobako"
                                                             style="margin-right:0.5%;"
                                                             v-if="shijo[shijoIndex[table_data.shijyo]].visible"
                                                             :controls="false"></el-input-number>
                                            <el-input-number v-model="table_data.kobako"
                                                             v-if="shijo[shijoIndex[table_data.shijyo]].visible"
                                                             :controls="false"></el-input-number>

                                        </td>

                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div class="row" style="margin-top:3%;">
                        <div class='col-md-6'>

                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>サイズ</th>
                                        <th>等級</th>
                                        <th colspan="3">市場計</th>
                                    </tr>
                                    <tr>
                                        <th></th>
                                        <th></th>
                                        <th>大箱出荷数</th>
                                        <th>小箱出荷数</th>
                                        <th>在庫数</th>
                                    </tr>
                                </thead>
                                <tbody v-for="(size,size_index) in size" :key="size.number">

                                    <tr v-for="tokyu_key in size.tokyu" :key="tokyu_key.number">
                                        <th>{{size.sizeHyojimei}}</th>
                                        <th>{{tokyu[tokyuIndex[tokyu_key]].tokyuHyojimei}}</th>
                                        <th>{{getOobakoTotal(size.size,tokyu_key)}}</th>
                                        <th>{{getKobakoTotal(size.size,tokyu_key)}}</th>
                                        <th>{{getZaiko(size.size,tokyu_key)}}</th>
                                    </tr>

                                </tbody>
                            </table>
                        </div>
                    </div>
                </form>
                <div class='row'>
                    <div class='col-md-12'>
                        <div style='text-align:right;width:100%;'>
                            <el-button style='margin-left:2%;' type='primary' v-on:click="update">更新(F5)</el-button>
                            <el-button style='margin-left:2%;' type='warning' v-on:click="finish">終了(F12)</el-button>
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
    import time from '@/js/status/time.js'
    import url from '@/js/api_url.js'

    export default {
        name: 'niukeNyuryokuSyoki',
        components: {
            Card, KeyboardEvents
        },
        data: function () {
            return {
                loading: false,
                model: {
                    nyuryokuDate: "",
                    selectedSyouhin: "",
                },
                validation: {
                    nyuryokuDate: [
                        { required: true, message: '出荷日付が入力されていません', trigger: 'blur' },
                    ],
                    selectedSyouhin: [
                        { required: true, message: '商品が入力されていません', trigger: 'blur' },
                    ],

                },
                syouhin: [
                ],
                tableData: [
                ],
                tableDataIndex: {

                },
                //一次元がサイズ、二次元が等級
                zaiko: {
                },
                chiku: [
                ],
                shijo: [
                ],
                shijoIndex: {
                },
                size: [

                ],
                tokyu: [

                ],
                tokyuIndex: {
                },
                housouPattern: [

                ],


            }
        },
        methods: {
            keyboardEvent(e) {
                if (e.keyCode == config.KEY_CODES.F5) {
                    this.update()
                }
                if (e.keyCode == config.KEY_CODES.F12) {
                    this.finish()
                }
            },
            changeSyouhin: function () {


            },
            shijoColspan: function () {

                var length = 0;
                for (var i in this.housouPattern) {
                    length++;
                }
                return length * 2;
            },
            housouPatternThead: function (chiku_code) {

                var result = [];
                var shijo = this.getShijoByChiku(chiku_code);
                for (var i in shijo) {

                    if (shijo[i].visible) {
                        for (var k in this.housouPattern) {
                            result.push({ name: this.housouPattern[k].hyojimei, colspan: 2 });
                        }

                    } else {
                        result.push({ name: "", colspan: 1 });
                    }

                }
                return result;
            },
            getShijoByChiku: function (chiku_code) {
                var result = [];
                for (var i in this.shijo) {
                    if (this.shijo[i].shijyoChikuCD == chiku_code) {

                        result.push(this.shijo[i]);
                    }
                }

                return result;
            },
            getTableData: function (chiku_key, size_key, tokyu_key) {

                var result = [];

                var shijo = this.getShijoByChiku(chiku_key);

                for (var i = 0; i < shijo.length; i++) {

                    for (var k = 0; k < this.housouPattern.length; k++) {

                        var Index = this.tableDataIndex[chiku_key][shijo[i].shijyoCD][size_key][tokyu_key][this.housouPattern[k].hosoPatternID];

                        if (this.tableData[Index] != undefined) {
                            result.push(this.tableData[Index]);

                        }

                    }

                }

                return result;
            },
            getTdKind: function (chiku_key) {

                var shijo = this.getShijoByChiku(chiku_key);

                var housou_pattern_length = Object.keys(this.housouPattern).length;


                var result = [];

                for (var i in shijo) {

                    if (shijo[i].visible) {

                        for (var k = 0; k < housou_pattern_length; k++) {

                            result.push("大箱");
                            result.push("小箱");
                        }

                    } else {
                        result.push("");

                    }


                }

                return result;
            },
            getOobakoTotal: function (size_key, tokyu_key) {

                var result = 0;
                for (var i in this.tableData) {

                    var data = this.tableData[i];

                    if (data.size == size_key) {

                        if (data.tokyu == tokyu_key) {
                            result += data.oobako;
                        }
                    }
                }

                return result;

            },
            getKobakoTotal: function (size_key, tokyu_key) {

                var result = 0;
                for (var i in this.tableData) {

                    var data = this.tableData[i];

                    if (data.size == size_key) {

                        if (data.tokyu == tokyu_key) {
                            result += data.kobako;
                        }
                    }
                }
                return result;

            },
            createTableDataIndex: function () {

                for (var i = 0; i < this.chiku.length; i++) {

                    var chikuCD = this.chiku[i].atai

                    this.tableDataIndex[chikuCD] = {};

                    var shijo = this.getShijoByChiku(chikuCD);

                    for (var k in shijo) {
                        var shijoCD = shijo[k].shijyoCD;

                        this.tableDataIndex[chikuCD][shijoCD] = {};

                        for (var l = 0; l < this.size.length; l++) {

                            var sizeCD = this.size[l].size;

                            this.tableDataIndex[chikuCD][shijoCD][sizeCD] = {};

                            for (var m = 0; m < this.size[l].tokyu.length; m++) {

                                var tokyuCD = this.size[l].tokyu[m]
                                this.tableDataIndex[chikuCD][shijoCD][sizeCD][tokyuCD] = {};

                                for (var n = 0; n < this.housouPattern.length; n++) {

                                    var housouPatternCD = this.housouPattern[n].hosoPatternID

                                    this.tableDataIndex[chikuCD][shijoCD][sizeCD][tokyuCD][housouPatternCD] = null;

                                }

                            }

                        }


                    }

                }
                console.log(this.tableDataIndex);

            },
            update: function () {


                var postArray = {
                    "SyouhinCode": this.model.selectedSyouhin,
                    "SyukkaDate": this.model.nyuryokuDate,
                    "NyuryokuTantosyaCD": this.$store.state.login.userCode,
                    "PostData": [],

                }


                for (var i = 0; i < this.tableData.length; i++) {

                    var data = this.tableData[i];
                    if (data.oobako == undefined) {
                        data.oobako = 0
                    }
                    if (data.kobako == undefined) {
                        data.kobako = 0
                    }

                    postArray.PostData.push(data);
                }

                console.log(postArray);
                this.loading = true;
                axios.post(url.syukkayoteinyuryoku, postArray)
                    .then(response => {
                        this.$message({
                            message: '保存に成功しました',
                            type: 'success'
                        });
                        this.loading = false;
                        this.changeMeisai();


                    })
                    .catch(response => {
                        this.$message({
                            message: '通信に失敗しました',
                            type: 'error'
                        });
                        this.loading = false;
                        console.log(response)
                    })



            },
            finish: function () {
                this.$router.push('/hoshigaki/');
            },
            changeMeisai: function () {
                this.$refs['searchForm'].validate((valid) => {

                    if (valid) {


                        this.tableData = [];

                        this.size = [];

                        this.tokyu = [];


                        axios.get(url.syohinSizeTokyuPatternMaster)
                            .then(response => {
                                var Data = [];
                                for (var i = 0; i < response.data.length; i++) {
                                    if (response.data[i].syohinCD == this.model.selectedSyouhin) {
                                        Data.push(response.data[i]);
                                    }
                                }
                                for (var i = 0; i < Data.length; i++) {
                                    var is_exsist = false;

                                    for (var k = 0; k < this.tokyu.length; k++) {

                                        if (this.tokyu[k].tokyu == Data[i].tokyu) {

                                            is_exsist = true;

                                        }

                                    }

                                    if (!is_exsist) {

                                        this.tokyu.push(Data[i]);
                                        this.tokyuIndex[Data[i].tokyu] = this.tokyu.length - 1;


                                    }

                                }

                                axios.get(url.syohinSizeTokyuPatternMaster)
                                    .then(response => {
                                        var Data = [];
                                        for (var i = 0; i < response.data.length; i++) {
                                            if (response.data[i].syohinCD == this.model.selectedSyouhin) {
                                                Data.push(response.data[i]);
                                            }
                                        }

                                        for (var i = 0; i < Data.length; i++) {

                                            var is_exsist = false;
                                            var size;
                                            for (var k = 0; k < this.size.length; k++) {

                                                if (this.size[k].size == Data[i].size) {

                                                    is_exsist = true;
                                                    size = this.size[k];

                                                }

                                            }

                                            if (is_exsist) {

                                                size.tokyu.push(Data[i].tokyu);

                                            } else {
                                                var tokyu = Data[i].tokyu;

                                                Data[i].tokyu = [tokyu];

                                                this.size.push(Data[i]);

                                            }
                                        }

                                        axios.get(url.SyohinHinsyuHosoPatternMaster)
                                            .then(response => {
                                                var Data = [];
                                                for (var i = 0; i < response.data.length; i++) {
                                                    if (response.data[i].syohinCD == this.model.selectedSyouhin) {
                                                        Data.push(response.data[i]);
                                                    }
                                                }
                                                this.housouPattern = Data;

                                                this.createTableDataIndex();

                                                var postArray = [
                                                    { key: "SyukkaDate", value: this.model.nyuryokuDate },
                                                    { key: "SyouhinCode", value: this.model.selectedSyouhin },
                                                ]
                                                var getUrl = url.createGetUrl(url.syukkayoteinyuryoku, postArray);

                                                axios.get(getUrl)
                                                    .then(response => {
                                                        console.log(response.data);
                                                        for (var i = 0; i < response.data.length; i++) {
                                                            var data = response.data[i];

                                                            this.tableDataIndex[data.chiku][data.shijyo][data.size][data.tokyu][data.hosoPattern] = i;

                                                        }

                                                        this.tableData = response.data;



                                                        var getUrl = url.createGetUrl(url.zaikohyoji, [{ key: "Syohincd", value: this.model.selectedSyouhin }]);

                                                        axios.get(getUrl)
                                                            .then(response => {
                                                                console.log("在庫", response.data);

                                                                this.zaiko = response.data;
                                                            })
                                                            .catch(response => console.log(response))


                                                    })
                                                    .catch(response => console.log(response))



                                            })
                                            .catch(response => console.log(response))



                                    })
                                    .catch(response => console.log(response))



                            })
                            .catch(response => console.log(response))





                    }
                });


            },
            getZaiko: function (size, tokyu) {

                var firstIndex;
                for (var i = 0; i < this.zaiko.length; i++) {

                    if (size == this.zaiko[i].sizecd) {
                        firstIndex = i;
                    }
                }

                if (this.zaiko[firstIndex] == undefined) {
                    return "";
                }

                var secondIndex;
                for (var i = 0; i < this.zaiko[firstIndex].tokyuData.length; i++) {

                    if (tokyu == this.zaiko[firstIndex].tokyuData[i].tokyucd) {
                        secondIndex = i;
                    }
                }

                if (firstIndex == undefined || secondIndex == undefined) {

                    return "データがありません";
                }

                return this.zaiko[firstIndex].tokyuData[secondIndex].value;


            },
        },
        created: function () {

            this.model.nyuryokuDate = time.nowJapanDateInput();

            axios.get(url.syouhinMaster)
                .then(response => {
                    console.log(response.data);
                    for (var i = 0; i < response.data.length; i++) {
                        if (response.data[i].syohinCD == 0 || response.data[i].syohinCD == 1) {

                            this.syouhin.push(response.data[i]);
                        }
                    }


                })
                .catch(response => {
                    console.log(response)
                }

                )



            axios.get(url.meisyoMaster)
                .then(response => {
                    for (var i = 0; i < response.data.length; i++) {
                        if (response.data[i].meisyoCD == "7") {
                            this.chiku.push(response.data[i]);
                        }
                    }
                    console.log(this.chiku);
                })
                .catch(response => console.log(response))

            axios.get(url.shijoMaster)
                .then(response => {
                    for (var i = 0; i < response.data.length; i++) {

                        if (response.data[i].hyojiFlg == 1) {
                            this.shijo.push(response.data[i]);
                        }

                    }

                    for (var i = 0; i < this.shijo.length; i++) {
                        this.$set(this.shijo[i], 'visible', true);
                        this.shijoIndex[this.shijo[i].shijyoCD] = i;
                    }
                })
                .catch(response => console.log(response))



        },
        watch: {


        },
    }
</script>
<style>

    .unvisible {
        display: none;
    }
</style>