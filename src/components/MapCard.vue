<template>
  <el-container>
    <div class="contain">
      <div id="map" class="map">
        <div class="ol-mouse-position">
        <span style="margin-right: 10px"> X: {{ lon }}</span>
        <span> Y: {{ lat }}</span>
        </div>
      </div>
    </div>
      <div class="select">
        <div></div>
        <div class="icon">
      <el-tooltip class="item" effect="dark" content="放大" placement="top-start">
        <v-icon @click="zoomin">mdi-magnify-plus-outline</v-icon>
    </el-tooltip>
        <el-tooltip class="item" effect="dark" content="缩小" placement="top-start">
        <v-icon @click="zoomout">mdi-magnify-minus-outline</v-icon>
      </el-tooltip>
          <el-tooltip class="item" effect="dark" :content="popShow ? '取消选取':'选取区域' " placement="top-start">
        <v-icon @click="select"> mdi-select-search</v-icon>
    </el-tooltip>

        </div>
      </div>
    <div id="popup" class="ol-popup" v-show="popShow">
      <div id="popup-closer" class="ol-popup-closer">
        <el-button size="small" type="primary">取消</el-button>
      </div>
    </div>
  </el-container>
</template>

<script>
import 'ol/ol.css'
import Overlay from 'ol/Overlay'
import { Vector as VectorSource } from 'ol/source'
import { Vector as VectorLayer } from 'ol/layer'
import Draw, {
  createBox
} from 'ol/interaction/Draw'
import Map from 'ol/Map'
import View from 'ol/View'
import Projection from 'ol/proj/Projection'
import { getCenter } from 'ol/extent'
import ImageLayer from 'ol/layer/Image'
import Static from 'ol/source/ImageStatic'
import { ScaleLine, defaults as defaultControls } from 'ol/control'
import { asArray } from 'ol/color'
import { Fill, Style, Stroke } from 'ol/style'
import GeoJSON from 'ol/format/GeoJSON'
export default {
  data () {
    return {
      lon: 0, // 经度
      lat: 0, // 纬度
      map: null, // 地图
      draw: null, // 绘制矩形
      source: null, // 显示图层
      coordinate: null, // 坐标
      overlay: null, // 弹出框
      layers: {}, // 图层
      projection: null, // 地图投影
      raw_extent: null, // 尺寸
      popShow: false // 弹出框显示
    }
  },
  methods: {
    submit (id) {
      var data = {
        project_id: id,
        coordinate: this.coordinate
      }
      this.$api.task.postTask(data).then(res => {
        this.$notify.success('提交成功')
        this.$emit('addTask', res.data)
        this.coordinate = null
        if (this.overlay) {
          this.overlay.setPosition(null)
          this.source.clear()
        }
      }).catch(err => {
        console.log(err)
        this.$notify.error('提交失败')
      })
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
      })
    },
    uploadCoordinate () {
      var data = new FormData()
      data.append('mode', this.mode)
      data.append('type', 'sort')
      data.append('imageA', this.imgA)
      data.append('coordinate', JSON.stringify(this.coordinate))
      const _that = this
      this.$api.map.uploadCoordinate(data).then(res => {
        _that.url = res.data.mask
        _that.userMapInit(res.data.mask, 'mask')
        // 刷新地图
      })
    },
    zoomin () {
      var zoom = this.map.getView().getZoom()
      if (zoom < 18) {
        this.map.getView().setZoom(zoom + 1)
      }
    },
    zoomout () {
      var zoom = this.map.getView().getZoom()
      if (zoom > 1) {
        this.map.getView().setZoom(zoom - 1)
      }
    },
    popUpInit () {
      // 获取到弹框的节点DOM
      var container = document.getElementById('popup')
      var closer = document.getElementById('popup-closer')
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
      // 监听singleclick事件
      this.draw.on('drawend', function (e) {
        var event = e.feature.getGeometry().getExtent()
        const mid = [(event[0] + event[2]) / 2, (event[1] + event[3]) / 2]
        // get tile coordinate for click event
        var maxH = _that.raw_extent[3]
        var maxW = _that.raw_extent[2]
        var tl = [Math.min(event[0], event[2]), Math.min(maxH - event[1], maxH - event[3])]
        var br = [Math.max(event[0], event[2]), Math.max(maxH - event[1], maxH - event[3])]
        if (tl[0] < 0) {
          tl[0] = 0
        }
        if (tl[1] < 0) {
          tl[1] = 0
        }
        if (br[0] > maxW) {
          br[0] = maxW
        }
        if (br[1] > maxH) {
          br[1] = maxH
        }
        var coordinate = {
          tl: tl,
          br: br
        }
        _that.coordinate = coordinate
        _that.overlay.setPosition(mid) // 把 overlay 显示到指定的 x,y坐标
      })
      closer.onclick = function () {
        _that.overlay.setPosition(undefined)
        _that.source.clear()
        closer.blur()
        return false
      }
      this.map.on('pointermove', (e) => {
      // 获取瓦片坐标)
        var lonlat = this.map.getCoordinateFromPixel(e.pixel)
        lonlat[1] = this.raw_extent[3] - lonlat[1]
        this.lon = lonlat[0].toFixed(6)
        this.lat = lonlat[1].toFixed(6)
      })
    },
    select () {
      this.popShow = !this.popShow
      this.$nextTick(() => {
        if (this.popShow) {
          this.drawInit()
          this.popUpInit()
        } else {
          this.map.removeInteraction(this.draw)
        }
      })
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
    setVisibility (task, visible) {
      this.layers['mask' + task.id].setVisible(visible)
    },
    addLayer (task, opacity = 0.5) {
      var coordinate = task.coordinate
      var extent = this.raw_extent
      if (coordinate) {
        var maxH = extent[3]
        var tl = [coordinate.tl[0], maxH - coordinate.br[1]]
        var br = [coordinate.br[0], maxH - coordinate.tl[1]]
        extent = [tl[0], tl[1], br[0], br[1]]
      }
      this.layers['mask' + task.id] = new ImageLayer({
        source: new Static({
          url: task.mask.url,
          projection: this.projection,
          imageExtent: extent
          // crossOrigin: 'anonymous'
        }),
        opacity: opacity
      })
      this.map.addLayer(this.layers['mask' + task.id])
    },
    removeLayer (task) {
      this.map.removeLayer(this.layers['mask' + task.id])
    },
    selectAdd () {
      this.drawInit()
      this.popUpInit()
    },
    addFeatures () {
      var style = new Style({
        stroke: new Stroke({
          color: 'red',
          width: 3
        }),
        fill: new Fill({
          color: 'rgba(0, 0, 0, 0)'
        })
      })
      var data = {
        type: 'FeatureCollection',
        features: []
      }
      const vectorLayer = new VectorLayer({
        source: new VectorSource({
          features: (new GeoJSON()).readFeatures(data)
        }),
        style: function (feature) {
          const color = feature.get('COLOR') || 'rgba(0, 0, 0, 0)'
          style.getFill().setColor(color)
          return style
        }
      })
      var map = this.map
      map.addLayer(vectorLayer)
      let highlight
      const featureOverlay = new VectorLayer({
        source: new VectorSource(),
        map: map,
        style: new Style({
          stroke: new Stroke({
            color: 'rgba(255, 255, 255, 0.7)',
            width: 2
          })
        })
      })

      const displayFeatureInfo = function (pixel) {
        const feature = map.forEachFeatureAtPixel(pixel, function (feature) {
          return feature
        })

        if (feature !== highlight) {
          if (highlight) {
            featureOverlay.getSource().removeFeature(highlight)
          }
          if (feature) {
            featureOverlay.getSource().addFeature(feature)
          }
          highlight = feature
        }
      }

      map.on('pointermove', function (evt) {
        if (evt.dragging) {
          return
        }
        const pixel = map.getEventPixel(evt.originalEvent)
        displayFeatureInfo(pixel)
      })

      map.on('click', function (evt) {
        displayFeatureInfo(evt.pixel)
      })
    },
    selectRemove () {
      this.map.removeInteraction(this.draw)
      this.map.removeOverlay(this.overlay)
    },
    init (project) {
      if (!project) return
      var image = project.imageA
      const extent = [0, 0, image.H, image.W]
      this.raw_extent = extent
      const projection = new Projection({
        code: 'xkcd-image',
        units: 'pixels',
        extent: extent
      })
      this.projection = projection
      var view = new View({
        projection: projection,
        center: getCenter(extent),
        zoom: 2,
        maxZoom: 8
      })
      const style = new Style({
        fill: new Fill({
          color: '#eeeeee'
        })
      })

      this.map = new Map({
        target: 'map',
        view: view,
        controls: defaultControls({
          zoom: false,
          rotate: false,
          attribution: false
        }).extend([
          new ScaleLine({
            // 设置比例尺单位，degrees、imperial、us、nautical、metric（度量单位）
            units: 'metric'
          })
        ]),
        background: 'gray',
        style: function (feature) {
          const color = asArray(feature.get('COLOR_NNH') || '#eeeeee')
          color[3] = 0.75
          style.getFill().setColor(color)
          return style
        }
      })
      this.map.addLayer(new ImageLayer({
        source: new Static({
          url: image.url,
          projection: projection,
          imageExtent: extent
          // crossOrigin: 'anonymous'
        })
      }))
      var opacity = 0.5
      if (project.type === 'detection') {
        opacity = 1
      }
      for (var i = 0; i < project.tasks.length; i++) {
        this.addLayer(project.tasks[i], opacity)
      }
      this.addFeatures()
    }
  }
}
</script>

<style scoped>
.map {
  width: 100%;
  height: 100%;
  overflow: hidden;
  /* background-color:black; */
}
.contain{
  height: 100%;
  width: 100%;
  background-color:rgb(36, 39, 47);
  /* background: url("../assets/bg.png"); */
  background-repeat: no-repeat;
  background-size: cover;
}
/*隐藏ol的一些自带元素*/
.popup-content {
  width: 100px;
  cursor: pointer;
}
.ol-viewport{
  overflow: unset !important;
}
.ol-popup{
  display: flex;
}
.ol-popup-closer {
  transform: translate(-50%, -50%);
}
.ol-mouse-position {
  position: relative;
  float: right;
  bottom: 10px;
  right: 10px;
  height: 30px;
  padding: 3px 10px;
  border-radius: 5px;
  background-color: rgba(255, 255, 255, 0.85);
  z-index: 9;
}

.ol-control {
  display: none;
}
.select{
  margin: 5px;
  display: flex;
  flex-direction: column;
  font-size: 15px;
  justify-content: space-between;
}
.icon{
  display: flex;
  flex-direction: column;
  margin: 0 0 20px 0;
}
.item{
  cursor: pointer;
  width: 22pt;
  height: 22pt;
  margin: 1px 0 0 1px;
  border-radius: 3px;
  background-color: rgba(0,60,136,0.7);
  color: rgb(242, 250, 250);
}
</style>
