<template>
<div>
    <v-dialog
      v-model="dialog"
      width="550"
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
                类型: &nbsp;  变化检测
              </div>
              <div class="subtitle">
                变化区域像素: {{task.analysis.fg}}
              </div>
              <div class="subtitle">
                未变化区域像素: {{task.analysis.bg}}
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
      // 指定图表的配置项和数据
      var option = {
        backgroundColor: '#FFF',
        tooltip: {
          trigger: 'item'
        },
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
            data: [
              { value: this.task.analysis.bg, name: '未变化区域' },
              { value: this.task.analysis.fg, name: '变化区域' }
            ]
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
.chart{
  width: 300px;
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
