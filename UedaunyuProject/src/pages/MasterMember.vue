<template>
    <div>
        <el-card>
            <div slot='header'>
                <span>社員マスタ</span>
            </div>
            <div slot='default'>
                <el-form :model="data.search.model" :rules="data.search.validation" ref="searchForm" label-width="120px">
                    <div class="row">
                        <div class='col-md-3'>
                            <label for='社員検索' class='col-form-label px-1' style='width:100%;'>社員名検索</label>
                            <el-form-item label-width="0" prop="syoriKubun">
                                <el-input type='text'
                                          style='width:100%;'
                                          v-model="data.search.model.memberName"></el-input>

                            </el-form-item>
                        </div>
                        <div class="col-3">
                                <el-button style='margin-left:2%;margin-top:13%;' type='warning' icon="el-icon-search">検索</el-button>
                        </div>
                    </div>
                </el-form>
                <div class="row" style="margin-top:4%;">
                    <div class="col-12">
                        <div style="text-align:right;">
                            <el-button style='margin-left:2%;width:10%;' type='danger'>保存</el-button>
                        </div>
                        <el-form :model="data.master.model" :rules="data.master.validation" ref="masterForm" label-width="120px">
                            <div style="text-align:center;">
                                <el-button type='primary'
                                           style='width:40%;display:inline;'
                                           @click="addMeisai(0,'','',1,false,false,1)">明細を追加</el-button>
                            </div>
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>
                                            社員コード
                                        </th>
                                        <th>
                                            社員名
                                        </th>
                                        <th>
                                            デフォルト車両
                                        </th>
                                        <th>
                                            点呼者
                                        </th>
                                        <th>
                                            運航者
                                        </th>
                                        <th>
                                            管理者
                                        </th>

                                    </tr>
                                </thead>
                                <tr v-for="meisai_data in data.master.model.meisai">
                                    <td>
                                        <el-form-item label-width="0"
                                                      prop="MemberCode"
                                                      :rules="{
                                                              required: true, message: '社員コードが入力されていません', trigger: 'blur'
                                                              }">
                                            <el-input type='text'
                                                      style='width:100%;'
                                                      v-model="meisai_data.MemberCode"
                                                      @change="masterCodeOverLap(meisai_data)"></el-input>
                                        </el-form-item>
                                    </td>
                                    <td>
                                        <el-form-item label-width="0"
                                                      prop="MemberName"
                                                      :rules="{
                                                              required: true, message: '社員名が入力されていません', trigger: 'blur'
                                                              }">
                                            <el-input type='text'
                                                      style='width:100%;'
                                                      v-model="meisai_data.MemberName"
                                                      ></el-input>
                                        </el-form-item>
                                    </td>
                                    <td>
                                        <el-select name="name" v-model="meisai_data.VehicleID">
                                            <el-option :value="1" label="石川 1005"></el-option>
                                            <el-option :value="2" label="石川 1006"></el-option>

                                        </el-select>
                                    </td>
                                    <td>
                                        <el-checkbox v-model="meisai_data.IsDriver"></el-checkbox>
                                    </td>
                                    <td>
                                        <el-checkbox v-model="meisai_data.IsRollCaller"></el-checkbox>
                                    </td>
                                    <td>
                                        <el-select name="name" v-model="meisai_data.RoleID">
                                            <el-option :value="1" label="一般"></el-option>
                                            <el-option :value="2" label="社内管理者"></el-option>
                                            <el-option :value="3" label="全体管理者"></el-option>
                                        </el-select>
                                    </td>
                                </tr>
                            </table>
                            <div style="text-align:center;">
                                <el-button type='primary'
                                           style='width:40%;display:inline;'
                                           @click="addMeisai(0,'','',1,false,false,1)">明細を追加</el-button>
                            </div>
                        </el-form>
                        <div style="text-align:right;">
                            <el-button style='margin-left:2%;width:10%;' type='danger'>保存</el-button>
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
                            memberName:""
                        },
                        validation: {
                            memberName: [
                                { required: true, message: '社員名が入力されていません', trigger: 'blur' },
                            ],
                        }
                    },
                    master: {
                        model: {
                            meisai: [],
                        },
                    },
                    updateButton: "",
                },
            }
        },
        methods: {
            finish: function () {
                alert("終了");
            },
            masterCodeOverLap: function (meisai) {
                
                //※dbと接続したらここを記述
                
                axios.get(url.meisyoMaster)
                    .then(response => {

                        if (arrayFunction.isCodeOverLap(meisai.MemberCode, "MemberCode", response.data)) {

                            alert("入力されたコードは既に存在します");
                            meisai.MemberCode = "";

                        } 

                    })
                    .catch(response => console.log(response))
                    

            },
            createMeisaiData: function (ID, MemberCode, MemberName, VehicleID, IsDriver, IsRollCaller, RoleID) {

                return {
                    ID: ID,
                    MemberCode: MemberCode,
                    MemberName: MemberName,
                    VehicleID: VehicleID,
                    IsDriver: IsDriver,
                    IsRollCaller: IsRollCaller,
                    RoleID: RoleID,
                }
            },
            addMeisai: function (ID,MemberCode,MemberName,VehicleID,IsDriver,IsRollCaller,RoleID) {

                var meisai = this.createMeisaiData(ID, MemberCode, MemberName, VehicleID, IsDriver, IsRollCaller, RoleID);
                this.data.master.model.meisai.push(meisai);
            },
            submit: function () {

                this.$refs['masterForm'].validate((valid) => {

                    if (valid) {

                        
                        //※axiosによる更新処理
                        /*
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


                            
                        }
                        */
                    }
                })

            }
        },
        created: function () {


            //ID,MemberCode,MemberName,VehicleID,IsDriver,IsRollCaller,RoleIDの順に記載
            this.addMeisai(0, 'member1', '畠中慎一', 1, false, true, 2);
 
        },
        mounted: function () {

        },
        watch: {
    
        }
    }
</script>
