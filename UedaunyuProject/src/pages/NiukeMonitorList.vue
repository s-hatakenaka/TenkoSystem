<template>
    <div>
        <keyboard-events v-on:keydown="keyboardEvent"></keyboard-events>
        <el-card>
            <div slot='header'>
                <span>荷受モニターリスト</span>
            </div>
            <div slot='default'>
                <el-form :model="data.form.model" :rules="data.form.validation" ref="form" label-width="120px">
                    <div class='row'>
                        <div class='col-md-12'>
                            <label for='回数' class='col-form-label px-1' style='width:100%;'>回数</label>
                            <el-form-item label-width="0" prop="kaisu">
                                <el-input-number name="name"
                                                 v-model="data.form.model.kaisu"
                                                 controls-position="right"></el-input-number>
                            </el-form-item>
                        </div>
                    </div>
                    <div class="row">
                        <div class='col-md-12'>
                            <label for='荷受日付' class='col-form-label px-1' style='width:100%;'>荷受日付</label>
                            <el-form-item label-width="0" prop="niukeDateStart" style='width:40%;margin-right:2%;display:inline-block;'>
                                <el-input type='date'
                                          style="width:100%;display:block;"
                                          v-model='data.form.model.niukeDateStart'></el-input>
                            </el-form-item>
                            <span style='margin-right:2%;'>～</span>
                            <el-form-item label-width="0" prop="niukeDateEnd" style='width:40%;margin-right:2%;display:inline-block;'>

                                <el-input type='date'
                                          style="width:100%;display:block;"
                                          v-model='data.form.model.niukeDateEnd'></el-input>
                            </el-form-item>
                        </div>
                    </div>
                    <div class="row">
                        <div class='col-md-12'>
                            <label for='入力日付' class='col-form-label px-1' style='width:100%;'>入力日付</label>
                            <el-form-item label-width="0" prop="inputDateStart" style='width:40%;margin-right:2%;display:inline-block;'>
                                <el-input type='date'
                                          style="width:100%;display:block;"
                                          v-model='data.form.model.inputDateStart'></el-input>
                            </el-form-item>
                            <span style='margin-right:2%;'>～</span>
                            <el-form-item label-width="0" prop="inputDateEnd" style='width:40%;margin-right:2%;display:inline-block;'>

                                <el-input type='date'
                                          style="width:100%;display:block;"
                                          v-model='data.form.model.inputDateEnd'></el-input>
                            </el-form-item>
                        </div>
                    </div>
                    <div class='row'>
                        <div class='col-md-8'>
                            <label for='生産者' class='col-form-label px-1' style='width:100%;'>生産者コード</label>
                            <el-form-item label-width="0" prop="seisansyaCodeBottom" style='width:40%;margin-right:2%;display:inline-block;'>
                                <el-input-number name="name"
                                                 v-model="data.form.model.seisansyaCodeBottom"
                                                 style="width:100%;display:block;"
                                                 :max="data.form.model.seisansyaCodeTop"
                                                 controls-position="right"></el-input-number>
                            </el-form-item>
                            <span style='margin-right:2%;'>～</span>
                            <el-form-item label-width="0" prop="seisansyaCodeTop" style='width:40%;margin-right:2%;display:inline-block;'>
                                <el-input-number name="name"
                                                 v-model="data.form.model.seisansyaCodeTop"
                                                 style="width:100%;display:block;"
                                                 :min="data.form.model.seisansyaCodeBottom"
                                                 controls-position="right"></el-input-number>
                            </el-form-item>
                        </div>
                    </div>
                    <div class='row' style="margin-top:2%;">
                        <div class='col-md-12'>
                            <div style='text-align:right;width:100%;'>
                                <el-button style='margin-left:2%;' type='primary' v-on:click="print">印刷(F10)</el-button>
                                <el-button style='margin-left:2%;' type='success' v-on:click="confirm">表示(F11)</el-button>
                                <el-button style='margin-left:2%;' type='warning' v-on:click="finish">終了(F12)</el-button>
                            </div>
                        </div>
                    </div>
                </el-form>

            </div>
        </el-card>
    </div>
</template>

<script>
    // @ is an alias to /src
    import KeyboardEvents from '@/components/KeyboardEvents.vue'
    import ElIncrementSearch from '@/components/IncrementSearch.vue'
    import config from '@/config.js'
    import url from '@/js/api_url.js'
    import time from '@/js/status/time.js'


    export default {
        name: 'niukeMonitorList',
        components: {
            KeyboardEvents, ElIncrementSearch
        },
        data: function () {
            return {
                data: {
                    form: {
                        model: {
                            kaisu: "",
                            niukeDateStart: "",
                            niukeDateEnd: "",
                            inputDateStart: "",
                            inputDateEnd: "",
                            seisansyaCodeTop: 9999,
                            seisansyaCodeBottom: 0,
                        },
                        validation: {
                            kaisu: [
                                { required: true, message: '回数が入力されていません', trigger: 'blur' },
                            ],
                            niukeDateStart: [
                                { required: true, message: '荷受日付が入力されていません', trigger: 'blur' },
                                { validator: this.validateniukeDate, trigger: 'blur' }
                            ],
                            niukeDateEnd: [
                                { required: true, message: '荷受日付が入力されていません', trigger: 'blur' },
                                { validator: this.validateniukeDate, trigger: 'blur' }
                            ],
                            inputDateStart: [
                                { required: true, message: '入力日付が入力されていません', trigger: 'blur' },
                                { validator: this.validateinputDate, trigger: 'blur' }
                            ],
                            inputDateEnd: [
                                { required: true, message: '入力日付が入力されていません', trigger: 'blur' },
                                { validator: this.validateinputDate, trigger: 'blur' }
                            ],
                            seisansyaCodeBottom: [
                                { required: true, message: '生産者コードが入力されていません', trigger: 'blur' },

                            ],
                            seisansyaCodeTop: [
                                { required: true, message: '生産者コードが入力されていません', trigger: 'blur' },

                            ],
                        },
                    },
                },
            }
        },
        methods: {
            keyboardEvent(e) {
                if (e.keyCode == config.KEY_CODES.F10) {
                    this.print()
                }
                if (e.keyCode == config.KEY_CODES.F11) {
                    this.confirm()
                }
                if (e.keyCode == config.KEY_CODES.F12) {
                    this.finish()
                }
            },
            validateniukeDate: function (rule, value, callback) {
                var model = this.data.form.model
                if (!time.compareDate(model.niukeDateStart, model.niukeDateEnd)) {
                    callback(new Error('日付の上下関係に誤りがあります'));
                } else {
                    callback();
                }
            },
            validateinputDate: function (rule, value, callback) {
                var model = this.data.form.model
                if (!time.compareDate(model.inputDateStart, model.inputDateEnd)) {
                    callback(new Error('日付の上下関係に誤りがあります'));
                } else {
                    callback();
                }
            },
            createPostArray: function (print_flag) {
                var model = this.data.form.model;

                var niukeDateStart_ = model.niukeDateStart.split("-");
                var niukeDateStart = String(niukeDateStart_[0] + niukeDateStart_[1] + niukeDateStart_[2]);
                var niukeDateEnd_ = model.niukeDateEnd.split("-");
                var niukeDateEnd = String(niukeDateEnd_[0] + niukeDateEnd_[1] + niukeDateEnd_[2]);

                var inputDateStart_ = model.inputDateStart.split("-");
                var inputDateStart = String(inputDateStart_[0] + inputDateStart_[1] + inputDateStart_[2]);
                var inputDateEnd_ = model.inputDateEnd.split("-");
                var inputDateEnd = String(inputDateEnd_[0] + inputDateEnd_[1] + inputDateEnd_[2]);


                return {
                    "kaisu": model.kaisu,
                    "niukeDATEdown": niukeDateStart,
                    "niukeDATEup": niukeDateEnd,
                    "inputDATEdown": inputDateStart,
                    "inputDATEup": inputDateEnd,
                    "seisansyaCDdown": model.seisansyaCodeBottom,
                    "seisansyaCDup": model.seisansyaCodeTop,
                    "PrintFlg": print_flag,
                };
      


            },
            print: function () {
                this.$refs['form'].validate((valid) => {

                    if (valid) {
                        var postArray = this.createPostArray(true);

                        axios.post(url.niukeMonitorList, postArray)
                            .then(response => {
                                console.log(response.data);
                                if (response.data.url == undefined) {
                                    alert("データが無い又はデータが多すぎます");
                                } else {

                                    window.open(response.data.url);

                                }
                            })
                            .catch(response => console.log(response))

                    }

                });
            },
            confirm: function () {

                this.$refs['form'].validate((valid) => {

                    if (valid) {

                        axios.post(url.niukeMonitorList, this.createPostArray(false))
                            .then(response => {
                                console.log(response.data);
                                window.open(response.data.url);
                            })
                            .catch(response => console.log(response))

                    }

                });
             },
            finish: function () {

              this.$router.push('/hoshigaki/');  

            }
        },
        created: function () {
            this.data.form.model.niukeDateStart = time.nowJapanDateInput();
            this.data.form.model.niukeDateEnd = time.nowJapanDateInput();
            this.data.form.model.inputDateStart = time.nowJapanDateInput();
            this.data.form.model.inputDateEnd = time.nowJapanDateInput();


        }

    }
</script>
\