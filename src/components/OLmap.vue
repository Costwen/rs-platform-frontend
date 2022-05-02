<template>
  <div id="app">
    <div id="map" class="map">
      <div class="ol-mouse-position">
        <span> 经度: {{ lon }}</span>
        <span> 维度: {{ lat }}</span>
      </div>
    </div>
    <div id="popup" class="ol-popup">
      <a href="#" id="popup-closer" class="ol-popup-closer">X</a>
      <div id="popup-content" class="popup-content"></div>
    </div>
  </div>
</template>

<script>
import 'ol/ol.css'
import Map from 'ol/Map'
import Overlay from 'ol/Overlay'
import View from 'ol/View'
import XYZ from 'ol/source/XYZ'
import { Vector as VectorSource } from 'ol/source'
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer'
import TileDebug from 'ol/source/TileDebug'
import Draw, {
  createBox
} from 'ol/interaction/Draw'
export default {
  data () {
    return {
      lon: 0,
      lat: 0,
      map: null,
      overlay: null,
      container: null,
      draw: null,
      source: null
    }
  },
  methods: {
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
      this.draw.on('drawend', function (e) {
        var event = e.feature.getGeometry().getExtent()
        var tl = [Math.min(event[0], event[2]), Math.min(event[1], event[3])]
        var br = [Math.max(event[0], event[2]), Math.max(event[1], event[3])]
        var coordinate = {
          tl: tl,
          br: br
        }
        _that.$api.map.uploadCoordinate(coordinate).then(res => {
          console.log(res)
        })
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
      this.map.on('singleclick', function (e) {
        const coordinate = e.coordinate
        const zoom = Math.floor(_that.map.getView().getZoom())
        // get tile coordinate for click event
        const xyz = _that.getTileURL(coordinate[1], coordinate[0], zoom)
        content.innerHTML = `
        <p>你点击了这里：</p>
        <p>坐标：</p>X:${coordinate[0].toFixed(6)} &nbsp;&nbsp; Y: ${coordinate[1].toFixed(6)}
        <p>瓦片坐标：</p>X:${xyz[0]} &nbsp;&nbsp; Y: ${xyz[1]} &nbsp;&nbsp; Z: ${xyz[2]}
        `
        _that.overlay.setPosition(coordinate) // 把 overlay 显示到指定的 x,y坐标
      })
      closer.onclick = function () {
        _that.overlay.setPosition(undefined)
        closer.blur()
        return false
      }
      this.map.on('pointermove', (e) => {
      // 获取瓦片坐标
        var lonlat = this.map.getCoordinateFromPixel(e.pixel)
        this.lon = lonlat[0].toFixed(6)
        this.lat = lonlat[1].toFixed(6)
      })
    },
    mapInit () {
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
      var map = new Map({
        target: 'map',
        layers: [
          imgLayer,
          labelLayer,
          debugLayer
        ],
        view: new View({
          projection: 'EPSG:4326', // 使用这个坐标系
          center: [116.397468, 39.908816], // 北京
          maxZoom: 18,
          zoom: 17
        })
      })
      this.map = map
    },
    drawInit () {
      const source = new VectorSource({ wrapX: false })
      const vector = new VectorLayer({
        source: source
      })
      this.map.addLayer(vector)
      this.source = source
      this.addInteraction()
    }

  },
  mounted () {
    this.mapInit()
    this.popUpInit()
    this.drawInit()
  }
}
</script>

<style>
#map {
  height: 100%;
}
/*隐藏ol的一些自带元素*/
.ol-attribution,
.ol-zoom {
  display: none;
}
.ol-popup {
  position: absolute;
  background-color: white;
  -webkit-filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
  filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
  padding: 15px;
  border-radius: 10px;
  border: 1px solid #cccccc;
  bottom: 12px;
  left: -50px;
}
.popup-content {
  width: 400px;
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
</style>
