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
                类型: &nbsp;  目标检测
              </div>
              <div v-for="(value,key, index) in category" class="subsubtitle" :key="key">
                {{key}}: {{value}} {{index ? '':''}}
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
// f94144, f3722c, f8961e, f9844a, f9c74f, 90be6d,43aa8b, 4d908e,577590,277da1, 0d3082, 88dae7, 76cd65, ffc247, ff8133, eb5133
var colorList = ['#f94144', '#f3722c', '#f8961e', '#f9844a', '#f9c74f', '#90be6d', '#43aa8b', '#4d908e', '#577590', '#277da1', '#0d3082', '#88dae7', '#76cd65', '#ffc247', '#ff8133', '#eb5133']
// plane, ship, storage tank, baseball diamond, tennis court, basketball court, ground track field, harbor, bridge, large vehicle, small vehicle, helicopter, roundabout, soccer ball field, swimming pool , container crane
// 飞机、船舶、储罐、棒球场、网球场、篮球场、地面田径场、港口、桥梁、大型车辆、小型车辆、直升机、环岛、足球场、游泳池、集装箱起重机]
var nameList = ['飞机', '船舶', '储罐', '棒球场', '网球场', '篮球场', '地面田径场', '港口', '桥梁', '大型车辆', '小型车辆', '直升机', '环岛', '足球场', '游泳池', '集装箱起重机']
export default {
  data () {
    return {
      dialog: false,
      task: null,
      category: {}
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
      var data = []
      this.task.analysis.categories.forEach(item => {
        if (item > 0) {
          data.push({
            name: nameList[item],
            value: item
          })
          this.category[nameList[item]] = item
        }
      })
      console.log(this.category)
      var dom = document.getElementById('chart')
      var myChart = this.$echarts.init(dom)
      // 指定图表的配置项和数据
      var option = {
        color: colorList,
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
  margin: 5px 20px 5px 20px;
  font-size: 15px;
  transform: translateY(-50%);
}
.subsubtitle{
  margin: 5px 20px 5px 20px;
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
