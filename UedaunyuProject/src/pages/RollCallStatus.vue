<template>
    <div>
        <el-card>
            <div slot='header'>
                <span>点呼状況</span>
            </div>
            <div slot='default'>
                <el-form :model="data.search.model" :rules="data.search.validation" ref="searchForm" label-width="120px">
                    <div class="row">
                        <div class='col-md-3'>
                            <label for='運行日' class='col-form-label px-1' style='width:100%;'>運行日</label>
                            <el-form-item label-width="0" prop="ServiceDate">
                                <el-input type="date"
                                          style='width:100%;'
                                          v-model="data.search.model.ServiceDate"></el-input>

                            </el-form-item>
                        </div>
                        <div class="col-3">
                            <label for='運行形態選択' class='col-form-label px-1' style='width:100%;'>運行形態選択</label>
                            <el-form-item label-width="0" prop="IsLongDistance">
                                <el-select name="name" v-model="data.search.model.IsLongDistance" placeholder="選択してください">
                                    <el-option :value="true" label="長距離"></el-option>
                                    <el-option :value="false" label="地場"></el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                        <div class="col-3">
                            <el-button style='margin-top:13%;width:80%;' type='primary'>更新</el-button>
                        </div>
                    </div>
                    <div class="row">
                        <div class='col-md-3'>
                            <label for='アラートのみ' class='col-form-label px-1' style='width:100%;'></label>
                            <el-checkbox style="margin-left:5%;" v-model="data.search.model.IsAlert">アラートのみ</el-checkbox>
                        </div>
                        <div class='col-md-3'>
                            <label for='社員検索' class='col-form-label px-1' style='width:100%;'>社員名検索</label>
                            <el-form-item label-width="0" prop="syoriKubun">
                                <el-input type='text'
                                          style='width:100%;'
                                          v-model="data.search.model.memberName"></el-input>

                            </el-form-item>
                        </div>
                    </div>
                    <div class="row">
                        <div class='col-md-3'>
                            <el-radio style="margin-left:5%;" v-model="data.search.model.NarrowDestination" label="decided">行先決定済みのみ</el-radio>
                        </div>
                        <div class='col-md-3'>
                            <el-radio style="margin-left:5%;" v-model="data.search.model.NarrowDestination" label="unDecided">行先未決定のみ</el-radio>
                        </div>
                        <div class='col-md-3'>
                            <el-radio style="margin-left:5%;" v-model="data.search.model.NarrowDestination" label="all">すべて</el-radio>
                        </div>

                    </div>

                </el-form>
                <div class="row" style="margin-top:4%;">
                    <div class="col-12">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>
                                        社員名
                                    </th>
                                    <th>
                                        行先
                                    </th>
                                    <th>
                                        乗務前点呼時間
                                    </th>
                                    <th>
                                        最終電話点呼時間
                                    </th>
                                    <th>
                                        乗務後点呼時間
                                    </th>
                                    <th>
                                        点呼内容を表示
                                    </th>

                                </tr>
                            </thead>
                            <tr v-for="meisai_data in data.meisai" v-bind:key="meisai_data.index" style="border-bottom:solid 0.5px #d3d3d3;">
                                <td>
                                    {{meisai_data.MemberName}}
                                </td>
                                <td>
                                    {{meisai_data.DestinationName}}
                                </td>
                                <td>
                                    {{meisai_data.BeforDrivingRollCallTime}}
                                </td>
                                <td>
                                    {{meisai_data.LastRollCallTime}}
                                </td>
                                <td>
                                    {{meisai_data.AfterDrivingRollCallTime}}
                                </td>
                                <td>
                                    <el-button type='success' @click="moveRollCallInput(meisai_data.MemberID)">点呼記録入力</el-button>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>



            </div>
        </el-card>
    </div>
</template>

<script>
    // @ is an alias to /src
    import Card from '@/components/Card/Card.vue'
    import config from '@/config.js'
    import ElIncrementSearch from '@/components/IncrementSearch.vue'
    import arrayFunction from '@/js/array.js'
    import url from '@/js/api_url.js'

    export default {
        name: 'niukeSyukei',
        components: {
            Card, ElIncrementSearch
        },
        data: function () {
            return {
                data: {
                    search: {
                        model: {
                            memberName: "",
                            ServiceDate: "",
                            IsLongDistance: "",
                            IsAlert: false,
                            NarrowDestination: "all",

                        },
                        validation: {
                            memberName: [
                                { required: true, message: '社員名が入力されていません', trigger: 'blur' },
                            ],
                        }
                    },
                    meisai: [],
                    updateButton: "",
                },
            }
        },
        methods: {

            moveRollCallInput: function (memberID) {

                //※メンバーIDをvuexに保存して、遷移時にaxiosで検索をかける
                this.$router.push('/rollCallLogInput');
            },

        },
        created: function () {

            this.data.meisai = [
                { MemberID: 1, MemberName: "畠中慎一", DestinationName: "石川県", BeforDrivingRollCallTime: "10:26", LastRollCallTime: "12:20", AfterDrivingRollCallTime: "20:30" },
                { MemberID: 2, MemberName: "畠中慎一", DestinationName: "石川県", BeforDrivingRollCallTime: "10:26", LastRollCallTime: "12:20", AfterDrivingRollCallTime: "20:30" },
            ]

        },
        mounted: function () {

        },
        watch: {

        }
    }
</script>
