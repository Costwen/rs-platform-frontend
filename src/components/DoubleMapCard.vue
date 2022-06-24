<template>
  <div class="content">
    <div id="map1" class="map1"></div>
    <div id="line" class="resize-line"></div>
    <div id="map2" class="map2"></div>
  </div>
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
  name: 'BeforeAfterSlider',
  data () {
    return {
      view: null,
      map: {
        map1: null,
        map2: null
      }
    }
  },
  mounted () {
  },
  methods: {
    init (project) {
      if (project.imageA.url) {
        this.mapInit(project.imageA, 'map1')
      }
      if (project.imageB.url) {
        this.mapInit(project.imageB, 'map2')
      }
    },
    mapInit (image, target) {
      const extent = [0, 0, image.H, image.W]
      const projection = new Projection({
        code: 'xkcd-image',
        units: 'pixels',
        extent: extent
      })
      var view
      if (this.view) {
        view = this.view
      } else {
        view = new View({
          projection: projection,
          center: getCenter(extent),
          zoom: 2,
          maxZoom: 8
        })
        this.view = view
      }
      this.map[target] = new Map({
        layers: [
          new ImageLayer({
            source: new Static({
              url: image.url,
              projection: projection,
              imageExtent: extent
            })
          })
        ],
        target: target,
        view: view
      })
    }
  }
}
</script>

<style scoped>
.map1 {
  width: 50%;
}
.map2 {
  width: 50%;
}
* {
  margin: 0;
  padding: 0;
}
.content {
  display: flex;
  height: 100vh;
}
.left {
  width: 200px;
  background-color: cyan;
  height: 100%;
}
.resize-line {
  width: 5px;
  background-color: #eee;
}
.right {
  width: calc(100% - 205px);
}
</style>
