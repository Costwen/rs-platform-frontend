<template>
  <el-container>
    <div class="contain">
      <div id="map" class="map">
        <div class="ol-mouse-position">
        <span> 经度: {{ lon }}</span>
        <span> 维度: {{ lat }}</span>
        </div>
      </div>
    </div>
    <div id="popup" class="ol-popup" v-show="map">
       <div id="popup-content" class="popup-content"></div>
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
export default {
  data () {
    return {
      view: null,
      lon: 0,
      lat: 0,
      map: null,
      container: null,
      draw: null,
      source: null,
      coordinate: null,
      overlay: null,
      task_image_list: [],
      task_image_extent: [],
      layers: {}
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
      }).catch(_ => {
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
        var tl = [Math.min(event[0], event[2]), Math.min(event[1], event[3])]
        var br = [Math.max(event[0], event[2]), Math.max(event[1], event[3])]
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
        this.lon = lonlat[0].toFixed(6)
        this.lat = lonlat[1].toFixed(6)
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
    setVisibility (idx, visible) {
      this.layers['mask' + idx].setVisible(visible)
    },
    mapInit (project, mode) {
      var image = project.imageA
      const extent = [0, 0, image.H, image.W]
      console.log(project)
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
      for (var i = 0; i < project.tasks.length; i++) {
        this.task_image_list.push(project.tasks[i].mask.url)
        var coordinate = project.tasks[i].coordinate
        var tl = [coordinate.tl[0], coordinate.tl[1]]
        var br = [coordinate.br[0], coordinate.br[1]]
        var _extent = [tl[0], tl[1], br[0], br[1]]
        this.task_image_extent.push(_extent)
      }
      this.map = new Map({
        target: 'map',
        view: view
      })
      this.map.addLayer(new ImageLayer({
        source: new Static({
          url: image.url,
          projection: projection,
          imageExtent: extent
        })
      }))
      for (i = 0; i < this.task_image_list.length; i++) {
        this.layers['mask' + i] = new ImageLayer({
          source: new Static({
            url: this.task_image_list[i],
            projection: projection,
            imageExtent: this.task_image_extent[i]
          }),
          opacity: 0.5
        })
        this.map.addLayer(this.layers['mask' + i])
      }
      // 是否能够裁剪
      if (mode === 'move') {
        this.drawInit()
        this.popUpInit()
      }
    }
  }
}
</script>

<style scoped>
.map {
  width: 100%;
  height: 100%;
    overflow: hidden;
}
.contain{
  height: 100%;
  width: 100%;
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
  height: 20px;
  background-color: rgba(255, 255, 255, 0.85);
  z-index: 9;
}
.ol-zoom ol-unselectable ol-control{
  position: absolute;
  bottom: 10px !important;
  right: 10px !important;
  z-index: 9 !important;
}
</style>
