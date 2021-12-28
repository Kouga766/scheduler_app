<template>
    <v-data-table
        :headers="headers"
        :items="notes"
        :items-per-page="-1"
        :loading="loading"
        hide-default-footer
        disable-sort
        class="elevation-1">

        <template v-slot:top>
            <!-- ヘッダー上部のbar全体 -->
            <!-- template部分ではthis.は使わない -->
            <v-toolbar flat> 
                
                <v-spacer></v-spacer>

                <v-dialog
                v-model="dialog" 
                max_width="500px"
                v-on:keydown.esc="close"> <!-- Escapeキー押したときもcloseイベントを発火させる -->

                    <!-- Add Noteボタン設定部分（ボタンはdialogの中に入れる） -->
                    <template v-slot:activator="{on,attrs}"> <!-- templateはすぐ上のv-**のslotに対してコンポーネントを入れに行く activatorはこのダイアログの呼び出し方法 -->
                        <v-btn
                        color="primary"
                        :autofocus=true
                        dark
                        class="mb-2"
                        @click="addItem"
                        v-bind="attrs"
                        v-on="on">Add Note</v-btn>
                    </template>

                    <!-- ボタン押下時のカード部分 -->
                    <v-card>
                        <v-card-title>
                        <span class="text-h5">Note</span>
                        </v-card-title>
                        <v-card-text>

                        <v-container>
                            <v-row align="center">

                                <v-col cols="12">
                                    <v-textarea
                                    v-model="editNote.notebody"
                                    v-on:keyup.ctrl.enter="save"
                                    label="ノート"
                                    rows=8
                                    ></v-textarea>
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
                        <span class="text-h5">Destroy this note?</span>
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

        <!-- detailは改行するようオーバーライド -->
        <template #item.detail="{ item }">
            <div style="white-space: pre;" >{{ item.notebody }}</div>
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
            loading: false,
            dialogComplete: false,

            // headerの順序を規定する
            headers:[
                { text: '選択', value: 'select', width: "10%"},
                { text: '詳細', value: 'detail'},
                { text: '編集', value: 'actions', width: "10%"},
            ],

            notes:[], // これがないとinitializeしてもデータが入らない 定義みたいなもの？

            editNote: {
                notebody:  '',
            },

            editedIndex: -1,
        }
    },

    mounted: async function () { // mountedだけ、methodsの外に書かないと開始時に実行されない
        await this.initialize()
    },

    methods: {

        initialize: async function(){

            console.log("execute initialize")
            this.loading = true;
            
            let url = `https://35.76.246.150:8000/notes/get_notes_for_user/?id=hironov120`
            let result = await accessApi.getApi(url) // awaitを書いて、待たせる？
            this.notes = result.data

            this.loading = false;
            
        },

        getbtnName(){
            if (this.editedIndex === -1) return 'Add'
            else return 'Save'
        },

        save: async function() {

            let url = 'https://35.76.246.150:8000/notes/'; // postメソッドの中に書かない 外で定義したら動いた あと:つける！

            if (this.editedIndex > -1) { // 更新の場合
                
                url = url + this.editedIndex + '/'
                const putNote = { // postメソッドの中に書かない 外で定義したら動いた
                    id: this.editedIndex,
                    notebody: this.editNote.notebody,
                    user: "hironov120",
                };
                await accessApi.putApi(url, putNote)

            } else { // 追加の場合
                
                const postNote = { // postメソッドの中に書かない 外で定義したら動いた
                    notebody: this.editNote.notebody,
                    user: "hironov120",
                };
                await accessApi.postApi(url, postNote)

            }

            this.close();
        },
        
        executeComplete: async function() {

            let url = 'https://35.76.246.150:8000/notes/' + this.editedIndex + '/';
            await accessApi.deleteApi(url)

            this.closeComplete();
            this.$emit('parent-event')
        },

        addItem () {
            this.editNote = Object.assign({}, this.defaultItem);
            this.dialog = true;
        },
        
        editItem (item) {
            console.log(item)
            this.editedIndex = item.id; // 保存用のパラメータをもつ
            this.editNote = Object.assign({}, item);
            this.dialog = true;
        },

        close () {
            this.dialog = false;
            this.postNote = Object.assign({}, this.defaultItem);
            this.editedIndex = -1;
            this.$nextTick(() =>  (this.initialize()))
        },

        completeItem (item) {
            this.editedIndex = item.id
            this.editNote = Object.assign({}, item) // パラメータごとにアサインするときはこれ使うっぽい
            this.dialogComplete = true
        },

        closeComplete () {
            this.dialogComplete = false;
            this.editNote = Object.assign({}, this.defaultItem);
            this.editedIndex = -1;
        },
    },
});
</script>
    

