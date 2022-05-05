<template>
  <div>
    <div class="contain">
      <div class="ol-mouse-position">
        <span> 经度: {{ lon }}</span>
        <span> 维度: {{ lat }}</span>
      </div>
      <div id="imgA" :class="img_count===2?'imgA1':'imgA2'">
      </div>
      <div id="mask" class="mask">
      </div>
    </div>
    <div id="popup" class="ol-popup">
      <a href="#" id="popup-closer" class="ol-popup-closer">X</a>
      <div id="popup-content" class="popup-content" @click="uploadCoordinate"></div>
    </div>
  </div>
</template>

<script>
import 'ol/ol.css'
import Overlay from 'ol/Overlay'
import { Vector as VectorSource } from 'ol/source'
import { Vector as VectorLayer } from 'ol/layer'
import Draw, {
  createBox
} from 'ol/interaction/Draw'
import { gaodeMapInit, userMapInit } from '@/utils/map'
export default {
  data () {
    return {
      lon: 0,
      lat: 0,
      map: null,
      overlay: null,
      container: null,
      draw: null,
      source: null,
      coordinate: null,
      imgA: null,
      imgB: null,
      mode: null,
      view: null,
      img_count: 0
    }
  },
  methods: {
    show () {
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
    toRad (Value) {
    /** Converts numeric degrees to radians */
      return Value * Math.PI / 180
    },
    getTileURL (lat, lon, zoom) {
      var xtile = Math.floor((lon + 180) / 360 * (1 << zoom))
      var ytile = Math.floor((1 - Math.log(Math.tan(this.toRad(lat)) + 1 / Math.cos(this.toRad(lat))) / Math.PI) / 2 * (1 << zoom))
      return [xtile, ytile, zoom]
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
      var content = document.getElementById('popup-content')
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
        content.innerHTML = '<span>上传</span>'
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
    userMapInit (file, target) {
      if (target === 'imgA') {
        this.imgA = file.raw
        this.map = userMapInit(this, file.url, target)
      }
      if (target === 'mask') {
        this.map = userMapInit(this, file, target)
      }
    },
    gaodeMapInit () {
      this.map = gaodeMapInit()
      this.drawInit()
      this.popUpInit()
    }
  },
  mounted () {
    this.mode = this.$route.path.split('/')[1]
    if (this.mode === 'map') {
      this.gaodeMapInit()
    }
  }
}
</script>

<style scoped>
.imgA1 {
  width: 100%;
  height: 100%;
}
.imgA2 {
  width: 50%;
  height: 100%;
}
.mask{
  width: 50%;
  height: 100%;
}
.contain{
  display: flex;
  height: 100%;
  width: 100%;
}
/*隐藏ol的一些自带元素*/
.ol-popup {
  position: absolute;
  background-color: white;
  border: 1px solid #cccccc;
  transform: translateX(-50%);
}
.popup-content {
  width: 100px;
  cursor: pointer;

}
.ol-viewport{
  overflow: unset !important;
}
.ol-popup-closer {
  text-decoration: none;
  position: absolute;
  top: 2px;
  right: 8px;
}
.ol-mouse-position {
  position: absolute;
  bottom: 10px;
  right: 10ppx;
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
