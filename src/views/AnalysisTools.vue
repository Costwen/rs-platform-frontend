<template>
  <div style="background-color: #222831">

    <el-container class="main">
      <el-container>
        <el-aside width="23%" style="height: fit-content;">

          <el-container class="class">
            <div @click="$router.push({path: '/create'})" style=" margin-left: 0px">
<!--              <el-button class="button" circle>-->
<!--                <i class="el-icon-edit"></i>-->
<!--              </el-button>-->
              <p>分析工具</p>
            </div>
          </el-container>

          <el-container class="class">
            <div @click="$router.push({path: '/create'})" style=" margin-left: 0px">
              <p>历史项目</p>
            </div>
          </el-container>
        </el-aside>
        <el-main>
            <el-container class="body">
              <div @click="$router.push({path: '/map'})" style=" margin-left: 0px">
                <p>目标提取</p>
              </div>
            </el-container>
            <el-container class="body">
              <div @click="$router.push({path: '/create'})" style=" margin-left: 0px">
                <p>变化检测</p>
              </div>
            </el-container>
            <el-container class="body">
              <div @click="$router.push({path: '/create'})" style=" margin-left: 0px">
                <p>目标检测</p>
              </div>
            </el-container>
            <el-container class="body">
              <div @click="$router.push({path: '/create'})" style=" margin-left: 0px">
                <p>地物分类</p>
              </div>
            </el-container>
<!--          <router-view/>-->
        </el-main>
      </el-container>
    </el-container>
    <div id="chart-1" style="width: 600px;height:400px;"></div>
  </div>
</template>

<script>

export default {
  name: 'AnalysisTools',
  methods: {
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
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
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
              { value: 1048, name: 'Search Engine' },
              { value: 735, name: 'Direct' },
              { value: 580, name: 'Email' },
              { value: 484, name: 'Union Ads' },
              { value: 300, name: 'Video Ads' }
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

.main{
  /*background-color: #393E46;*/
  width: 90%;
  margin: 40px auto 40px;
  /*height: 770px;*/
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
  margin-right: 20px;
  text-align: center;
  justify-content: center;
  width: 22%;
  float: left;
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
