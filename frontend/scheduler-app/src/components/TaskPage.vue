<template>
    <v-data-table
        :headers="headers"
        :items="tasks"
        :items-per-page="-1"
        :loading="loading"
        hide-default-footer
        disable-sort
        class="elevation-1">

        <template v-slot:top>
            <!-- ヘッダー上部のbar全体 -->
            <!-- template部分ではthis.は使わない -->
            <v-toolbar flat> 
                
                <!-- ソート種別選択ボタン -->
                <v-btn
                :color="(sortState===0) ? 'red' : 'green'" 
                class="mb-2"
                dark
                @click="changeSort"
                width="100px"
                >{{getSortString()}}</v-btn>

                <v-spacer></v-spacer>

                <v-dialog
                v-model="dialog" 
                max_width="500px"
                v-on:keydown.esc="close"> <!-- Escapeキー押したときもcloseイベントを発火させる -->

                <!-- Add Tackボタン設定部分（ボタンはdialogの中に入れる） -->
                <template v-slot:activator="{on,attrs}"> <!-- templateはすぐ上のv-**のslotに対してコンポーネントを入れに行く activatorはこのダイアログの呼び出し方法 -->
                    <v-btn
                    color="primary"
                    :autofocus=true
                    dark
                    class="mb-2"
                    @click="addItem"
                    v-bind="attrs"
                    v-on="on">Add Task</v-btn>
                </template>

                <!-- ボタン押下時のカード部分 -->
                <v-card>
                    <v-card-title>
                    <span class="text-h5">Task</span>
                    </v-card-title>
                    <v-card-text>
                    <v-container>
                        <v-row align="center">

                        <v-col cols="12" md="8">
                            <v-text-field 
                            :autofocus=true
                            v-model="editTask.tasktitle" 
                            v-on:keyup.ctrl.enter="save"
                            label="タスク"></v-text-field>
                        </v-col>

                        <v-col cols="12" md="4">
                            <v-select
                            v-model="editTask.priority"
                            :items="select_items"
                            item-text="priority"
                            item-value="priority_id"
                            label="優先度"
                            return-object
                            single-line
                            ></v-select>
                        </v-col>

                        <v-col cols="12">
                            <v-textarea
                            v-model="editTask.detail"
                            v-on:keyup.ctrl.enter="save"
                            label="詳細"
                            rows=8
                            ></v-textarea>
                        </v-col>

                        <v-col cols="12" md="6">
                            <v-dialog
                            ref="dialog"
                            v-model="modal"
                            :return-value.sync="editTask.deadline"
                            >
                            <!-- カレンダー 上部に表示するテキストボックス部分 -->
                            <template v-slot:activator="{ on, attrs }"> <!-- ここなんでtemplateに入ってるのか v-slotを設定したいからか -->
                                <v-text-field
                                v-model="editTask.deadline"
                                label="期限"
                                prepend-icon="mdi-calendar"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                                ></v-text-field>
                                
                            </template>

                            <!-- カレンダー ボタンを押したときのダイアログ部分 -->
                            <v-date-picker
                                v-model="editTask.deadline"
                                scrollable
                            >
                                <v-spacer></v-spacer>
                                <v-btn
                                    text
                                    color="primary"
                                    @click="modal = false"
                                    >
                                    Cancel
                                    </v-btn>
                                    <v-btn
                                    text
                                    color="primary"
                                    @click="$refs.dialog.save(editTask.deadline)" 
                                    > <!-- refs.dialog はref="dialog" と設定したところを見に行く -->
                                    OK
                                </v-btn>
                            </v-date-picker>
                            
                            </v-dialog>
        
                        </v-col>

                        <v-col cols="12" md="6">
                            <v-btn color="primary" dark @click="editTask.deadline = null">期限クリア</v-btn>
                        </v-col>
                        
                        </v-row>
                    </v-container>
                    </v-card-text>

                    <!-- ボタン -->
                    <v-card-actions class="justify-center">
                    <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                    <v-btn color="blue darken-1" text @click="save">{{getbtnName()}}</v-btn>
                    </v-card-actions>

                </v-card>
                </v-dialog>
                
                <!-- 完了ボタン押下時のカード部分 -->
                <v-dialog v-model="dialogComplete" max-width="500px">
                <v-card>
                    <v-card-title>
                    <span class="text-h5">Complete this task?</span>
                    </v-card-title>
                    <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="closeComplete">Cancel</v-btn>
                    <v-btn color="blue darken-1" text @click="executeComplete">OK</v-btn>
                    </v-card-actions>
                </v-card>
                </v-dialog>
            </v-toolbar>
        </template>

        <!-- priorityは文字列で表示するようオーバーライド -->
        <template #item.priority="{ item }" >
            <div>
            <v-chip @click="completeItem(item)"
                :color="getColor(item.priority)"
                dark
            >{{getPriorityString(item.priority)}}
            </v-chip>
            </div>
        </template>
            
        <!-- tasktitleの最大値を指定するようオーバーライド -->
        <template #item.tasktitle="{ item }">
            <div max-width="200px">{{ item.tasktitle }}</div>
        </template>

        <!-- detailは改行するようオーバーライド -->
        <template #item.detail="{ item }">
            <div style="white-space: pre;" >{{ item.detail }}</div>
        </template>

        <!-- deadlineが未定の場合はオーバーライド -->
        <template #item.deadline="{ item }" >
            <div>{{getDeadlineString(item.deadline)}}</div>
        </template>

        <!-- Actions列をオーバーライド -->
        <template v-slot:item.actions="{ item }"> <!-- tableのv-slotのitem.<name>に対して作動する -->
            <v-btn small class="mr-2" @click="editItem(item)">🖊</v-btn>
        </template>

        <!-- データがない状態 -->
        <template v-slot:no-data>
            <v-btn color="primary" @click="initialize">Reset</v-btn>
        </template>

    </v-data-table>

</template>

<script>
import Vue from 'vue';
import accessApi from '../utils/accessApi.js'


export default Vue.extend({
    data() {
        return{

            dialog: false,
            dialogComplete: false,
            sortState: 0,
            loading: false,
            modal: false,
            tasks:[], // これがないとinitializeしてもデータが入らない 定義みたいなもの？

            headers:[ // headerの順序を規定する
                { text: '優先度', value: 'priority', width: "10%"},
                { text: 'タスク', value:'tasktitle'}, // 小文字指定しよう！！！（別物として扱われる）
                { text: '詳細', value: 'detail'},
                { text: '期限', value: 'deadline'},
                { text: '編集', value: 'actions'},
                ],

            editTask: {
                tasktitle:  '',
                detail: '',
                priority: 1,
                deadline: '',
            },

            defaultItem: {
                tasktitle:  '',
                detail: '',
                priority: 1,
                deadline: '1900-01-01',
            },

            select: { priority: '重要緊急', priority_id: 1 },

            select_items: [
                { priority: '重要緊急', priority_id: 1 },
                { priority: '待ち作業', priority_id: 2 },
                { priority: '不要不急', priority_id: 3 },
            ],

            editedIndex: -1,

        }
    },

    mounted () { // mountedだけ、methodsの外に書かないと開始時に実行されない
        this.initialize()
    },

    methods: {

        initialize: async function(){ // 連鎖させたい処理はasync function!

            console.log("execute initialize")
            this.loading = true;

            let url = `https://35.76.246.150:8000/tasks/get_tasks_for_user/?id=hironov120&sort_state=${this.sortState}&display_state=${Vue.prototype.$displayState}`
            let result = await accessApi.getApi(url); // awaitを書いて、待たせる？
            this.tasks = result.data.tasks;
            Vue.prototype.$dueTodayCount = result.data.due_today_count;

            // Add Taskダイアログ内の期限日付をtodayに設定
            let today = new Date();
            this.defaultItem.deadline = today.getFullYear() + "-" + ("00" + (today.getMonth() + 1)).slice(-2) + "-" + ("00" + (today.getDate())).slice(-2);
            
            this.loading = false;
            
            this.$emit('update-nav'); //drawbarの数字を最新化
        },

        save: async function () {
            this.loading = true;

            let url = 'https://35.76.246.150:8000/tasks/'; // postメソッドの中に書かない 外で定義したら動いた あと:つける！

            if ((this.editTask.deadline === null ) || (this.editTask.deadline === '' )) {
                this.editTask.deadline = "2099-12-31";
            }

            if (this.editedIndex > -1) { // 更新の場合
                url = url + this.editedIndex + '/'

                const putTask = { // postメソッドの中に書かない 外で定義したら動いた
                    id: this.editedIndex,
                    tasktitle: this.editTask.tasktitle,
                    detail: this.editTask.detail,
                    priority: this.editTask.priority.priority_id, 
                    deadline: this.editTask.deadline,
                    user: "hironov120",
                };
                await accessApi.putApi(url, putTask)
                
            } else { // 追加の場合
                const postTask = {
                    tasktitle: this.editTask.tasktitle,
                    detail: this.editTask.detail,
                    priority: this.editTask.priority.priority_id, 
                    deadline: this.editTask.deadline,
                    user: "hironov120",
                };
                await accessApi.postApi(url, postTask);
            }

            this.close();
            await this.initialize();

            this.loading = false;
        },

        close () {
            this.dialog = false;
            this.editTask = Object.assign({}, this.defaultItem);
            this.editedIndex = -1;
        },

        closeComplete () {
            this.dialogComplete = false;
            this.editTask = Object.assign({}, this.defaultItem);
            this.editedIndex = -1;
        },

        completeItem (item) {
            this.editedIndex = item.id
            this.editTask = Object.assign({}, item) // パラメータごとにアサインするときはこれ使うっぽい
            this.dialogComplete = true
        },

        executeComplete: async function() {
            this.loading = true;

            let url = 'https://35.76.246.150:8000/tasks/' + this.editedIndex + '/';
            await accessApi.deleteApi(url)

            this.closeComplete();
            await this.initialize();
            
            this.$emit('completed')
            this.loading = false;
        },
        
        changeSort: async function(){
            this.sortState = (1 - this.sortState);
            await this.initialize()
        },

        getColor (priority) {
            if (priority == 1) return 'red'
            else if (priority == 2) return 'orange'
            else return 'green'
        },

        getPriorityString(priority){
            if (priority == 1) return '重要緊急'
            else if (priority == 2) return '待ち作業'
            else return '不要不急'
        },

        getSortString(){
            if (this.sortState === 0) return '優先度順'
            else return '期限順'
        },

        getbtnName(){
            if (this.editedIndex === -1) return 'Add'
            else return 'Save'
        },

        getDeadlineString(deadline){
            if (deadline === '2099-12-31') return '未定'
            else return deadline
        },

        addItem () {
            this.editTask = Object.assign({}, this.defaultItem);
            if (this.editTask.deadline === "2099-12-31") {
                this.editTask.deadline = null;
            }
            this.dialog = true;
        },
        
        editItem (item) {
            console.log(item)
            this.editedIndex = item.id; // 保存用のパラメータをもつ
            this.editTask = Object.assign({}, item);
            if (this.editTask.deadline === "2099-12-31") {
                this.editTask.deadline = null;
            }
            this.dialog = true;
        },
    },
});
</script>
    

