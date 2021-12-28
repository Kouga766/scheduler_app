<template>
    <v-card class="pa-4">
        <v-card-title>不要不急、時期未定タスクの非表示</v-card-title>
        <v-btn outlined rounded :color="getBtnColor_False(this.displayState)" @click="disableHidePriority3State">Disabled</v-btn>
        <v-btn outlined rounded :color="getBtnColor_True(this.displayState)" @click="enableHidePriority3State">Enabled</v-btn>
    </v-card>
</template>

<script>
import Vue from 'vue';

export default Vue.extend({

  components: {
    
  },

  mounted(){
    
  },

  data: function() {
    if (Vue.prototype.$displayState === undefined) Vue.prototype.$displayState = '0';
    if (Vue.prototype.$displayState === undefined) this.displayState = '0';

    return { // ここのreturnで設定している値はデフォルト値っぽい 内部で使う関数を全て最初に定義する（mount前にreturnされるデータっぽい）
      displayState: Vue.prototype.$displayState,
    }
  },
  
  methods: {

    disableHidePriority3State() {
      Vue.prototype.$displayState = '0';
      this.$emit('update-self'); //自分自身を更新する
      console.log('displayState変更:' + Vue.prototype.$displayState)
    },

    enableHidePriority3State() {
      Vue.prototype.$displayState = '1';
      this.$emit('update-self');
      console.log('displayState変更:' + Vue.prototype.$displayState)
    },

    getBtnColor_False(state) {
      if (state == '0') return 'red'
      else return 'grey'
    },

    getBtnColor_True(state) {
      if (state == '1') return 'red'
      else return 'grey'
    },
    
  },

});
</script>
