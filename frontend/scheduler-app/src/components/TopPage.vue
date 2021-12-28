<template>
  <v-container>
    <v-row xs>
      <v-col cols="9">
        <v-card height="400">
          <taskgraph
          v-if='showGraph'
          :series='series'
          />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Vue from 'vue';
import accessApi from '../utils/accessApi.js';
import VueApexCharts from 'vue-apexcharts';
import TaskGraph from './TaskGraph.vue';

Vue.use(VueApexCharts);

export default Vue.extend({

  components: {
    taskgraph: TaskGraph,
  },

  data: function() {
    
    //let url = `https://35.76.38.95:8000/tasks/get_tasks_count_for_user/?id=hironov120`;
    //let result = await accessApi.getApi(url); // awaitを書いて、待たせる？
    
    
    return { // ここのreturnで設定している値はデフォルト値っぽい 内部で使う関数を全て最初に定義する（mount前にreturnされるデータっぽい）
      
      showGraph: true,
      
      series: [{
            name: '重要緊急',
            data: [0, 0, 0, 0, 0, 0, 0]
          }, {
            name: '待ち作業',
            data: [0, 0, 0, 0, 0, 0, 0]
          }, {
            name: '不要不急',
            data: [0, 0, 0, 0, 0, 0, 0]
          }, 
      ],
    };
  },
  
  mounted(){
    this.initialize();
  },
  
  methods: {
    
    initialize: async function(){ // 連鎖させたい処理はasync function!

      console.log("execute initialize");

      let url = `https://35.76.246.150:8000/tasks/get_tasks_count_for_user/?id=hironov120`;
      let result = await accessApi.getApi(url); // awaitを書いて、待たせる？
      
      this.series[0].data = result.data.priority_1_count;
      this.series[1].data = result.data.priority_2_count;
      this.series[2].data = result.data.priority_3_count;
      
      this.showGraph = false;
      this.$nextTick(() => (this.showGraph = true));
      
      url = `https://35.76.246.150:8000/tasks/get_tasks_for_user/?id=hironov120&sort_state=${this.sortState}&display_state=${Vue.prototype.$displayState}`;
      result = await accessApi.getApi(url); // awaitを書いて、待たせる？
      Vue.prototype.$dueTodayCount = result.data.due_today_count;
      
      this.$emit('update-nav'); //drawbarの数字を最新化
    },
  },

});
</script>
