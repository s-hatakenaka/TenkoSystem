<template>
    <div>
        <el-card>
            <div slot='header'>
                <span>点呼記録入力</span>
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
                        <div class='col-md-9' style="text-align:right;">
                            <label class='col-form-label px-1' style='width:100%;'></label>
                            <el-button style='width: 40%;' type='warning' @click="$router.push('/rollCallLogInput')">戻る</el-button>
                        </div>

                    </div>
                    <div class="row">
                        <div class='col-md-3'>
                            <label for='社員選択' class='col-form-label px-1' style='width:100%;'>社員選択</label>
                            <el-form-item label-width="0" prop="syoriKubun">
                                <el-select name="name" v-model="data.search.model.MemberID">
                                    <el-option :value="1" label="畠中慎一"></el-option>
                                    <el-option :value="2" label="畠中慎一"></el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                        <div class='col-md-9' style="text-align:right;">
                            <label class='col-form-label px-1' style='width:100%;'></label>
                            <el-button style='width:40%;' type='danger'>保存</el-button>
                        </div>

                    </div>
                </el-form>
                <el-form :model="data.log" ref="logForm" label-width="120px">

                    <div class="row" style="margin-top:4%;">

                        <div class="col-12" v-for="(serviceLog ,serviceLogIndex) in data.log.service">
                            <el-card>
                                <div class="row">
                                        <div class="col-2">
                                            <label for='行先選択' class='col-form-label px-1' style='width:100%;'>行先選択</label>
                                            <el-select name="name" v-model="serviceLog.DestinationID">
                                                <el-option :value="1" label="石川県"></el-option>
                                                <el-option :value="2" label="富山県"></el-option>
                                            </el-select>
                                        </div>
                                        <div class="col-2">
                                            <label for='車両選択' class='col-form-label px-1' style='width:100%;'>車両選択</label>
                                            <el-select name="name" v-model="serviceLog.VehicleID">
                                                <el-option :value="1" label="石川 1005"></el-option>
                                                <el-option :value="2" label="石川 1006"></el-option>
                                            </el-select>
                                        </div>
                                    <div class="col-12" v-for="(rollCallLog ,rollCallLogIndex) in serviceLog.rollCallLog">
                                        <el-card style="margin-top:2%;">
                                            <table class="table">
                                                <thead>
                                                    <tr>
                                                        <th>
                                                            点呼時間
                                                        </th>
                                                        <th>
                                                            点呼方法
                                                        </th>
                                                        <th>
                                                            アルコール検知器の有無
                                                        </th>
                                                        <th>
                                                            酒気帯びの有無
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tr style="border-bottom:solid 0.5px #d3d3d3;">
                                                    <td>
                                                        <el-input type='datetime-local'
                                                                  style='width:100%;'
                                                                  v-model="rollCallLog.RollCallTime"
                                                                  @change="masterCodeOverLap(meisai_data)"></el-input>
                                                    </td>
                                                    <td>
                                                        <el-select name="name" v-model="rollCallLog.RollCallMethodID" style="width:100%;">
                                                            <el-option :value="1" label="対面"></el-option>
                                                            <el-option :value="2" label="TEL"></el-option>
                                                            <el-option :value="3" label="その他"></el-option>
                                                        </el-select>
                                                    </td>
                                                    <td>
                                                        <el-select name="name" v-model="rollCallLog.IsUseAlcoholDetector" style="width:100%;">
                                                            <el-option :value="true" label="有"></el-option>
                                                            <el-option :value="false" label="無"></el-option>
                                                        </el-select>
                                                    </td>
                                                    <td>
                                                        <el-select name="name" v-model="rollCallLog.IsDrinking" style="width:100%;">
                                                            <el-option :value="false" label="無"></el-option>
                                                            <el-option :value="true" label="有"></el-option>
                                                        </el-select>
                                                    </td>
                                                </tr>
                                                <thead>
                                                    <tr>
                                                        <th>
                                                            疾病・疲労等の有無
                                                        </th>
                                                        <th>
                                                            詳細
                                                        </th>
                                                        <th colspan="2">
                                                            備考
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tr style="border-bottom:solid 0.5px #d3d3d3;">
                                                    <td>
                                                        <el-select name="name" v-model="rollCallLog.IsDisease" style="width:100%;">
                                                            <el-option :value="true" label="有"></el-option>
                                                            <el-option :value="false" label="無"></el-option>
                                                        </el-select>
                                                    </td>
                                                    <td>
                                                        <el-select name="name" v-model="rollCallLog.DiseasesID" style="width:100%;">
                                                            <el-option :value="1" label="発熱"></el-option>
                                                            <el-option :value="2" label="腹痛"></el-option>
                                                            <el-option :value="3" label="寝不足"></el-option>
                                                            <el-option :value="4" label="その他"></el-option>

                                                        </el-select>
                                                    </td>
                                                    <td colspan="2">
                                                        <el-input type='text'
                                                                  style='width:100%;'
                                                                  :disabled="rollCallLog.DiseasesID != 4"
                                                                  v-model="rollCallLog.NoteOfDiseases"></el-input>
                                                    </td>
                                                </tr>
                                                <thead>
                                                    <tr>
                                                        <th>
                                                            日常点検の有無
                                                        </th>
                                                        <th>
                                                            点呼執行者
                                                        </th>
                                                        <th>
                                                            指示事項
                                                        </th>
                                                        <th>
                                                            点呼種類
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tr style="border-bottom:solid 0.5px #d3d3d3;">
                                                    <td>
                                                        <el-select name="name" v-model="rollCallLog.IsPerformedDailyCheck" style="width:100%;">
                                                            <el-option :value="true" label="有"></el-option>
                                                            <el-option :value="false" label="無"></el-option>
                                                        </el-select>
                                                    </td>
                                                    <td>
                                                        <el-select name="name" v-model="rollCallLog.RollCallerID" style="width:100%;">
                                                            <el-option :value="1" label="畠中慎一"></el-option>
                                                            <el-option :value="2" label="畠中慎一"></el-option>
                                                        </el-select>
                                                    </td>
                                                    <td>
                                                        <el-select name="name" v-model="rollCallLog.InstructionID" style="width:100%;">
                                                            <el-option :value="1" label="始業点検の完全徹底"></el-option>
                                                            <el-option :value="2" label="STOP あおり運転"></el-option>
                                                        </el-select>
                                                    </td>
                                                    <td>
                                                        <el-select name="name" v-model="rollCallLog.RollCallKind" style="width:100%;">
                                                            <el-option :value="0" label="乗務前点呼"></el-option>
                                                            <el-option :value="1" label="乗務後点呼"></el-option>
                                                            <el-option :value="2" label="途中点呼"></el-option>
                                                        </el-select>
                                                    </td>
                                                </tr>

                                            </table>
                                            <div class="col-12" style="text-align:right;margin-top:2%;">
                                                <el-button type='info'
                                                           style='width:20%;display:inline;'
                                                           @click="removeRollCallMeisai(serviceLogIndex,rollCallLogIndex)">点呼を削除</el-button>
                                            </div>
                                        </el-card>
                                    </div>
                                    <div class="col-12" style="text-align:center;margin-top:2%;">
                                        <el-button type='warning'
                                                   style='width:40%;display:inline;'
                                                   @click="addRollCallMeisai(serviceLogIndex)">点呼を追加</el-button>
                                    </div>
                                    <div class="col-12" style="text-align:right;margin-top:2%;">
                                        <el-button type='info'
                                                   style='width:20%;display:inline;'
                                                   @click="remobeServiceMeisai(serviceLogIndex)">運行を削除</el-button>
                                    </div>
                                </div>
                            </el-card>
                        </div>
                        <div class="col-12" style="text-align:center;margin-top:2%;">
                            <el-button type='primary'
                                       style='width:40%;display:inline;'
                                       @click="addServiceMeisai()">運行を追加</el-button>
                        </div>
                    </div>

                </el-form>

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
                    log: {
                        service: [{ rollCallLog: [{}]}],
                    },
                    meisai: [],
                    updateButton: "",
                },
            }
        },
        methods: {
            addServiceMeisai: function () {

                //※とりあえずこれで置いておく
                this.data.log.service.push({ rollCallLog: [{}] });
            },
            remobeServiceMeisai: function (serviceLogIndex) {

                this.data.log.service.splice(serviceLogIndex, 1);

            },
            addRollCallMeisai: function (serviceLogIndex) {

                //※とりあえずこれで置いておく
                this.data.log.service[serviceLogIndex].rollCallLog.push({});

            },
            removeRollCallMeisai: function (serviceLogIndex, rollCallLogIndex) {

                this.data.log.service[serviceLogIndex].rollCallLog.splice(rollCallLogIndex, 1);

            }

        },
        created: function () {

            this.data.log.service = [
                {
                    DestinationID: 1, VehicleID: 1,
                    rollCallLog: [{
                        RollCallTime: "2020-10-26 T11:22",
                        RollCallMethodID: 1,
                        IsUseAlcoholDetector: true,
                        IsDrinking: false,
                        IsDisease: true,
                        DiseasesID: 4,
                        NoteOfDiseases: "だるい",
                        IsPerformedDailyCheck: true,
                        RollCallerID: 1,
                        InstructionID: 1,
                        RollCallKind:1,
                    }]
                },
            ]
        },
        mounted: function () {

        },
        watch: {

        }
    }
</script>
