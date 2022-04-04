<template>
    <div id="map" ref="rootmap">

    </div>
</template>

<script>
import 'ol/ol.css'
import { Map, View } from 'ol'
import TileLayer from 'ol/layer/Tile'
import XYZ from 'ol/source/XYZ'
// import mapconfig from '@config/mapconfig.js'
export default {
  data () {
    return {
      map: null
    }
  },
  mounted () {
    this.map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new XYZ({
            url: 'https://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}&scl=1',
            wrapX: true
          })
        }),
        new TileLayer({
          source: new XYZ({
            url: 'https://wprd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=8&x={x}&y={y}&z={z}&scl=1&ltype=4',
            wrapX: true
          })
        })
      ],
      view: new View({
        projection: 'EPSG:4326', // 使用这个坐标系
        center: [116.397468, 39.908816], // 北京
        maxZoom: 18,
        zoom: 17
      })
    })
  }
}
</script>

<style>
#map{height:100%;}
/*隐藏ol的一些自带元素*/
.ol-attribution,.ol-zoom { display: none;}

</style>
