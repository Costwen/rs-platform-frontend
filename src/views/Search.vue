<template>
  <div>
  <project-header></project-header>
  <el-container class="contain">
        <el-container v-loading="is_loading">
            <el-card class="card">
                <el-form ref="form" :model="center" label-width="50px" class="form">
                    <el-form-item label="经度" prop="longitude" :rules="[
                    { required: true, message: '请输入经度' },
                    { pattern: /^[-\+]?\d+(\.\d+)?$/, message: '请输入正确的经度' },
                    { validator: validateLongitude }
                    ]">
                        <el-input v-model="center.longitude" placeholder="请输入经度"></el-input>
                    </el-form-item>
                    <el-form-item label="纬度" prop="latitude" :rules="[
                    {required: true, message: '请输入纬度'},
                    {pattern: /^[-\+]?\d+(\.\d+)?$/, message: '请输入正确的纬度'},
                    {validator: validateLatitude}
                    ]">
                        <el-input v-model="center.latitude" placeholder="请输入纬度"></el-input>
                    </el-form-item>
                </el-form>
                <el-button @click="search" type="primary" >搜索</el-button>
            </el-card>
            <div id="map" class="map">

            </div>
            <div class="ol-mouse-position">
                <span> 经度: {{ lon }}</span>
                <span> 维度: {{ lat }}</span>
            </div>
        </el-container>
            <div id="popup" class="ol-popup" v-show="show">
                <div id="popup-content" class="popup-content">
                    <el-button @click="uploadCoordinate">上传</el-button>
                    <el-button type="primary" @click="cancle">取消</el-button>
                </div>

            </div>
    </el-container>
  </div>
</template>
<script>
import Map from 'ol/Map'
import View from 'ol/View'
import XYZ from 'ol/source/XYZ'
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer'
import 'ol/ol.css'
import Overlay from 'ol/Overlay'
import { Vector as VectorSource } from 'ol/source'
import Draw, {
  createBox
} from 'ol/interaction/Draw'
import TileDebug from 'ol/source/TileDebug'
import ProjectHeader from '../components/ProjectHeader.vue'
export default {
  components: { ProjectHeader },
  data () {
    return {
      view: null,
      lon: 0,
      center: {
        longitude: '',
        latitude: ''
      },
      lat: 0,
      map: null,
      container: null,
      draw: null,
      source: null,
      coordinate: null,
      overlay: null,
      is_loading: false,
      show: false
    }
  },
  methods: {
    validateLongitude (rule, value, callback) {
      // string to float
      value = parseFloat(value)
      if (value < -180 || value > 180) {
        callback(new Error('请输入正确的经度'))
      } else {
        callback()
      }
    },
    validateLatitude (rule, value, callback) {
      value = parseFloat(value)
      if (value < -90 || value > 90) {
        callback(new Error('请输入正确的纬度'))
      } else {
        callback()
      }
    },
    addInteraction () {
      const value = 'Circle'
      const geometryFunction = createBox()
      this.draw = new Draw({
        source: this.source,
        type: value,
        geometryFunction: geometryFunction
      })
      this.map.addInteraction(this.draw)
      const _that = this
      this.draw.on('drawstart', function (evt) {
        _that.source.clear()
        _that.show = false
      })
    },
    uploadCoordinate () {
      var data = new FormData()
      data.append('coordinate', JSON.stringify(this.coordinate))
      this.$api.image.postImage(data).then(res => {
        this.$notify.success('上传成功')
      }).catch(err => {
        console.log(err)
        this.$notify.error('上传失败')
      })
    },
    popUpInit () {
      // 获取到弹框的节点DOM
      var container = document.getElementById('popup')

      // 创建一个弹窗 Overlay 对象
      this.overlay = new Overlay({
        element: container, // 绑定 Overlay 对象和 DOM 对象的
        autoPan: true, // 定义弹出窗口在边缘点击时候可能不完整 设置自动平移效果
        autoPanAnimation: {
          duration: 250 // 自动平移效果的动画时间 9毫秒
        }
      })

      this.map.addOverlay(this.overlay)
      const _that = this
      this.draw.on('drawend', function (e) {
        var event = e.feature.getGeometry().getExtent()
        const mid = [(event[0] + event[2]) / 2, (event[1] + event[3]) / 2]
        // get tile coordinate for click event
        var tl = [Math.min(event[0], event[2]), Math.min(event[1], event[3])]
        var br = [Math.max(event[0], event[2]), Math.max(event[1], event[3])]
        var coordinate = {
          tl: tl,
          br: br
        }
        _that.coordinate = coordinate
        _that.overlay.setPosition(mid) // 把 overlay 显示到指定的 x,y坐标
        _that.show = true
      })

      this.map.on('pointermove', (e) => {
      // 获取瓦片坐标)
        var lonlat = this.map.getCoordinateFromPixel(e.pixel)
        this.lon = lonlat[0].toFixed(6)
        this.lat = lonlat[1].toFixed(6)
      })
    },
    cancle () {
      this.overlay.setPosition(undefined)
      this.source.clear()
      this.show = false
    },
    drawInit () {
      const source = new VectorSource({ wrapX: false })
      const vector = new VectorLayer({
        source: source
      })
      this.map.addLayer(vector)
      this.source = source
      this.addInteraction()
    },
    back () {
      this.$router.push('/')
    },
    search () {
      this.$refs.form.validate(valid => {
        if (valid) {
          document.getElementById('map').innerHTML = ''
          // this.is_loading = true
          var lon = parseFloat(this.center.longitude)
          var lat = parseFloat(this.center.latitude)
          this.init(lon, lat)
          this.drawInit()

          this.map.addOverlay(this.overlay)
          const _that = this
          this.draw.on('drawend', function (e) {
            var event = e.feature.getGeometry().getExtent()
            const mid = [(event[0] + event[2]) / 2, (event[1] + event[3]) / 2]
            // get tile coordinate for click event
            var tl = [Math.min(event[0], event[2]), Math.min(event[1], event[3])]
            var br = [Math.max(event[0], event[2]), Math.max(event[1], event[3])]
            var coordinate = {
              tl: tl,
              br: br
            }
            _that.coordinate = coordinate
            _that.overlay.setPosition(mid) // 把 overlay 显示到指定的 x,y坐标
            _that.show = true
          })

          this.map.on('pointermove', (e) => {
            // 获取瓦片坐标)
            var lonlat = this.map.getCoordinateFromPixel(e.pixel)
            this.lon = lonlat[0].toFixed(6)
            this.lat = lonlat[1].toFixed(6)
          })
        } else {
          return false
        }
      })
    },
    init (lon, lan) {
      const imgLayer = new TileLayer({
        source: new XYZ({
          url: 'https://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}&scl=1',
          wrapX: true
        })
      })
      const labelLayer = new TileLayer({
        source: new XYZ({
          url: 'https://wprd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=8&x={x}&y={y}&z={z}&scl=1&ltype=4',
          wrapX: true
        })
      })
      const debugLayer = new TileLayer({
        source: new TileDebug({
          template: 'x:{x} y:{y} z:{z}',
          projection: imgLayer.getSource().getProjection(),
          tileGrid: imgLayer.getSource().getTileGrid(),
          zDirection: 1
        })
      })
      const view = new View({
        projection: 'EPSG:4326', // 使用这个坐标系
        center: [lon, lan], // 北京
        maxZoom: 18,
        zoom: 16
      })
      const map = new Map({
        target: 'map',
        layers: [
          imgLayer,
          labelLayer,
          debugLayer
        ],
        view: view
      })
      this.map = map
      this.view = view
    }
  },
  mounted () {
    this.init(116.397468, 39.908816)
    this.drawInit()
    this.popUpInit()
  }
}
</script>

<style scoped>
.header{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 50px;
  background: #fff;
  z-index: 100;
}
.map{
    width: 100%;
    height: 100%;
}
.contain{
  height: 100%;
  width: 100%;
  z-index: 0;
  position: fixed;
}
.popup{
    position: fixed;
}
.ol-mouse-position {
  position: absolute;
  float: right;
  bottom: 10px;
  right: 10px;
  height: 20px;
  margin-top: 60px;
  background-color: rgba(255, 255, 255, 0.85);
  z-index: 9;
}
.ol-zoom ol-unselectable ol-control{
  position: absolute;
  bottom: 10px !important;
  right: 10px !important;
  z-index: 9 !important;
}
.el-icon-back{
  font-size: 20px;
  cursor: pointer;
}
.el-dropdown{
  cursor: pointer;
}
.tip{
    position: absolute;
}
.card{
    position: fixed;
    margin-top: 60px;
    z-index: 1;
    margin-left: 10px;
    background-color: rgba(255, 255, 255, 0.95);
    width: 300px;
}
</style>
