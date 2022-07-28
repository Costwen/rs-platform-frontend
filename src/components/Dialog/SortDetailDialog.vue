<template>
<div>
    <v-dialog
      v-model="dialog"
      width="650"
      height="500"
    >
      <v-card>
        <v-card-title class="text-h5 title">
            <div >
              任务详情
          </div>
            <v-icon right @click="close">
                mdi-close
            </v-icon>
        </v-card-title>
        <v-card-text class="content">
          <div class="left-content" v-if="task">
              <div class="subtitle">
                类型: &nbsp;  地物分类
              </div>
              <div  class="subsubtitle" v-for="item, idx in task.analysis.categories" :key="idx">
                {{item.name}}像素: {{item.value}}
              </div>
              <div class="subtitle">
                推理用时: {{toFixed(task.analysis.time, 2)}}s
              </div>
          </div>
        <div id="chart" class="chart"></div>
        </v-card-text>
      </v-card>

    </v-dialog>

    </div>
</template>

<script>
export default {

  data () {
    return {
      dialog: false,
      task: null
    }
  },
  methods: {
    toFixed (num, n) {
      return parseFloat(num).toFixed(n)
    },
    init (task) {
      this.dialog = true
      this.task = task
      console.log(task)
      this.$nextTick(() => {
        this.genChart()
      })
    },
    close () {
      this.dialog = false
    },
    genChart () {
      var dom = document.getElementById('chart')
      var myChart = this.$echarts.init(dom)
      var data = []
      this.task.analysis.categories.forEach(item => {
        data.push({
          name: item.name,
          value: item.value
        })
      })
      var option = {
        backgroundColor: '#FFF',
        tooltip: {
          trigger: 'item'
        },
        color: ['#d9a146', '#525e71', '#2ec4b6', '#343a40', '#73a942', '#90e0ef'],
        legend: {
          top: '1%',
          left: 'center',
          textStyle: {
            color: '#000'
          }
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  position: 'outer',
                  fontSize: 12,
                  fontWeight: 'bold',
                  align: 'left',
                  formatter: '{d}%'
                },
                labelLine: { // 指示线状态
                  show: true,
                  smooth: 0.2,
                  length: 10,
                  length2: 20
                }
              }
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '20',
                fontWeight: 'lighter'
              }
            },
            labelLine: {
              show: false
            },
            data: data
          }
        ]
      }

      // 使用刚指定的配置项和数据显示图
      myChart.setOption(option)
    }

  },
  mounted () {
  }
}
</script>

<style scoped>
.contain {
   margin-top: 30px;
}
.title{
    display: flex;
    justify-content: space-between;
}
.subtitle{
  margin: 20px 20px 20px 10px;
  font-size: 15px;
  transform: translateY(-50%);
}
.subsubtitle{
  margin: 5px 10px 5px 10px;
  font-size: 15px;
  transform: translateY(-50%);
}
.chart{
  width: 400px;
  height: 300px;
}
.content{
  display: flex;
  justify-content: space-between;
}
.left-content{
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
