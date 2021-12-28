<template>
  <apexchart
    type="bar"
    height="400"
    :options="chartOptions"
    :series="series"
  ></apexchart>
</template>

<script>
import Vue from 'vue';
import VueApexCharts from 'vue-apexcharts';

Vue.use(VueApexCharts);

export default Vue.extend({

  components: {
    apexchart: VueApexCharts,
  },

  data: function() {
    
    return { // ここのreturnで設定している値はデフォルト値っぽい 内部で使う関数を全て最初に定義する（mount前にreturnされるデータっぽい）
      
      chartOptions: {
        chart: {
          type: 'bar',
          height: 350,
          stacked: true,
          toolbar: {
            show: true
          },
          zoom: {
            enabled: false
          }
        },
        yaxis: {
          labels: {
            formatter: function (value) {
              return Math.round(value);
            },
          }
        },
        
        responsive: [{
          breakpoint: 480,
          options: {
            legend: {
              position: 'bottom',
              offsetX: -10,
              offsetY: 0
            }
          }
        }],
        
        plotOptions: {
          bar: {
            horizontal: false,
            borderRadius: 10
          },
        },
        
        xaxis: {
          type: 'datetime',
          categories: ['01/01/2011 GMT', '01/02/2011 GMT', '01/03/2011 GMT', '01/04/2011 GMT',
            '01/05/2011 GMT', '01/06/2011 GMT',' 01/07/2011 GMT'
          ],
        },
        
        colors:['#FF0000', '#FF9800', '#4CAF50'],
        
        legend: {
          position: 'right',
          offsetY: 40
        },
        
        fill: {
          opacity: 1
        }
      },
    };
  },
  
  props: {
      series: Array,
  },
  
  
  methods: {
    
  },

});
</script>
