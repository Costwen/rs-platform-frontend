<template>
  <div>
    <div>
      <el-container class="body">
        <div style=" margin-left: 0px; text-decoration-color: #e6e6e6">
          <p>类型：地物分类</p>
        </div>
      </el-container>
    </div>
    <div style="display: inline-block">
      <map-card id="original" ref="original" class="mid" />
      <map-card id="processed" ref="processed" class="mid" />
    </div>
    <div>
        <el-container class="body">
          <div style=" margin-left: 0px; text-decoration-color: #e6e6e6">
            <p>图斑统计</p>
          </div>
        </el-container>
    </div>
      <div id="chart-1" style="width: 600px;height:400px; margin: auto"></div>
  </div>
</template>

<script>
import MapCard from '../components/MapCard.vue'
import View from 'ol/View'
import { getCenter } from 'ol/extent'
import Projection from 'ol/proj/Projection'
export default {
  name: 'Result',
  components: {
    MapCard
  },
  data () {
    return {
      originalUrl: require('../assets/original.png'),
      processedUrl: require('../assets/processed.png'),
      imc: null,
      img_ctx: null
    }
  },
  methods: {
    changeImg () {
      this.$refs.original.isResult = true
      this.$refs.processed.isResult = true
      const extent = [0, 0, 600, 400]
      const projection = new Projection({
        code: 'xkcd-image',
        units: 'pixels',
        extent: extent
      })
      var view = new View({
        projection: projection,
        center: getCenter(extent),
        zoom: 2,
        maxZoom: 8
      })
      this.$refs.original.view = view
      this.$refs.processed.view = view
      this.$refs.original.mapInit(this.originalUrl)
      this.$refs.processed.mapInit(this.processedUrl)
    },
    genChart () {
      console.log('111')
      var myChart = this.$echarts.init(document.getElementById('chart-1'))

      // 指定图表的配置项和数据
      var option = {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          top: '5%',
          left: 'center',
          textStyle: {
            color: '#FFF'
          }
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 5,
              fontColor: '#FFF',
              borderWidth: 2
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
              { value: 2080, name: '未知' },
              { value: 293, name: '耕地' },
              { value: 276, name: '园地' },
              { value: 1072, name: '林地' },
              { value: 1891, name: '草地' },
              { value: 1316, name: '房屋建筑' },
              { value: 120, name: '道路' },
              { value: 135, name: '水域' }
            ]
          }
        ]
      }

      // 使用刚指定的配置项和数据显示图
      myChart.setOption(option)
    }
  },
  mounted () {
    this.genChart()
    this.changeImg()
  },
  beforeRouteEnter (to, from, next) {
    // 添加背景色 style="background-color: #222831"
    document.querySelector('body').setAttribute('style', 'background-color:#222831')
    next()
  },
  beforeRouteLeave (to, from, next) {
    // 去除背景色
    document.querySelector('body').setAttribute('style', '')
    next()
  }
}
</script>

<style scoped>
.mid{
  /*z-index: -1;*/
  width: 400px;
  height: 300px;
  /*display: inline-block !important;*/
}
.main{
  /*background-color: #393E46;*/
  width: 90%;
  margin: 40px auto 40px;
  height: 770px;
}

.el-icon-reading, .el-icon-edit{
  font-size: 30px;
}
.questionnaire {
  background-color:transparent;
  color: #393E46;
  padding-top:0 !important;
  padding-bottom:30px;
  border-radius: 10px;
  opacity: 0.9;
}
.button {
  background-image: linear-gradient(to right, #0250c5, #d43f8d);
  color: white;
  opacity: 0.6;
  height: 60px;
  width: 60px;
  margin: 10px;
  /*border-radius : 50%;*/
}

.body:hover{
  background-color: #00ADB5;
}

.button:hover{
  background-color: #d43f8d;
}

.el-aside{
  background-color:transparent;
  color: #393E46;
  padding-top:0 !important;
  padding-bottom:30px;
}

.el-main {
  background-color: transparent;
  margin: 0 20px 0;
  border-radius: 15px;
  opacity: 1;
  color: #333;
  height: 100%;
  padding-top: 0 !important;
  padding-bottom: 0;
}

.el-button--mini, .el-button--small {
  font-size: 20px !important;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}

.class:hover{
  background-color: #2D4059;
}
.class {
  background-color: #393E46;
  /*color: #e6e6e6;*/
  opacity: 0.9;
  border-radius: 10px;
  padding: 25px 0px 20px;
  margin-top: 20px;
  text-align: center;
  justify-content: center;
}

.body {
  background-color: #393E46;
  /*color: #e6e6e6;*/
  opacity: 0.9;
  border-radius: 10px;
  padding: 25px 0px 20px;
  margin-top: 20px;
  margin-left: 20px;
  margin-bottom: 20px;
  text-align: center;
  justify-content: center;
  width: 16%;
  /*float: right;*/
  color: #e6e6e6;
  /*display: inline;*/
  /*height: 100%;*/
}
.el-icon-reading, .el-icon-edit{
  font-size: 30px;
}

.el-menu {
  padding-top: 10px;
  margin-top: 10px !important;
  border-radius: 10px;
  padding-bottom: 10px;
}
.el-card {
  border-radius: 10px;
}

.el-aside {
  background-color: transparent;
  color: #EEEEEE;
  padding-top:0 !important;
  padding-bottom:30px;
  /*border-radius: 15px;*/
  opacity: 0.9;
  /*line-height: 200px;*/
}
.el-main {
  /*background-color: black;*/
  margin: 0 20px 0;
  color: #EEEEEE;
  border-radius: 10px;
  opacity: 1;
  display: inline-block;
  padding-top: 0 !important;
  padding-bottom: 0;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
</style>
