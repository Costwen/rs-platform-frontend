<template>
  <el-container class="contain">
      <el-header class="body">
        <div style=" margin-left: 0px; text-decoration-color: #e6e6e6">
          <p>类型：地物分类</p>
        </div>
      </el-header>
    <el-container>
    <el-main class="main" v-loading="is_loading">
        <div id="map1" class="map1">
        </div>
        <div id="map2" class="map2">
        </div>
    </el-main >
      <el-aside class="right" v-if="rightshow">
    <div>
        <div class="body">
          <div style=" margin-left: 0px; text-decoration-color: #e6e6e6">
            <p>图斑统计</p>
          </div>
        </div>
    </div>
      <div id="chart-1" style="width: 600px;height:400px; margin: auto"></div>
      </el-aside>
    </el-container>

  </el-container>
</template>

<script>
import 'ol/ol.css'
import View from 'ol/View'
import Projection from 'ol/proj/Projection'
import { getCenter } from 'ol/extent'
import ImageLayer from 'ol/layer/Image'
import Static from 'ol/source/ImageStatic'
import Map from 'ol/Map'
export default {
  name: 'Result',
  data () {
    return {
      map1url: require('../assets/original.png'),
      map2url: require('../assets/processed.png'),
      map: {
        map1: null,
        map2: null
      },
      view: null,
      is_loading: true,
      rightshow: true
    }
  },
  methods: {
    rightdisappear () {
      this.rightshow = !this.rightshow
      this.$nextTick(
        () => {
          this.map.map1.updateSize()
          this.map.map2.updateSize()
        })
    },
    mapInit (url, target) {
      const img = new Image()
      img.src = url
      const _that = this
      img.onload = () => {
        const extent = [0, 0, img.width, img.height]
        const projection = new Projection({
          code: 'xkcd-image',
          units: 'pixels',
          extent: extent
        })
        var view
        if (_that.view) {
          view = _that.view
        } else {
          view = new View({
            projection: projection,
            center: getCenter(extent),
            zoom: 2,
            maxZoom: 8
          })
          _that.view = view
        }

        _that.map[target] = new Map({
          layers: [
            new ImageLayer({
              source: new Static({
                url: url,
                projection: projection,
                imageExtent: extent
              })
            })
          ],
          target: target,
          view: view
        })
        // 是否能够裁剪
        _that.is_loading = false
      }
    },
    genChart () {
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
    this.mapInit(this.map1url, 'map1')
    this.mapInit(this.map2url, 'map2')
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
.right{
  width: 20% !important;
  background-color: #2f3238;
  color: white;
}

.contain{
  margin-left: 10%;
  height: 80%;
}

.main{
  /*background-color: #393E46;*/
  background: #e6e6e6;
  border-radius: 15px;
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

}
.map1{
  width: 49%;
  height: 100%;
  float: left;

}
.map2{
  width: 49%;
  height: 100%;
  float: right;
}

</style>
