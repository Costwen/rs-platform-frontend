<template>
  <div>
    <div class="detail" v-if="name">
        <span>类别: {{ name }}</span>
        <span>区域大小: {{ area }} </span>
        <span>区域比例: {{ ratio}}</span>
        </div>
  <div class="content">
    <div id="map1" class="map1"></div>
    <div id="line" class="resize-line"></div>
    <div id="map2" class="map2"></div>
  </div>
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
import { Fill, Style, Stroke } from 'ol/style'
import GeoJSON from 'ol/format/GeoJSON'
import { Vector as VectorSource } from 'ol/source'
import { Vector as VectorLayer } from 'ol/layer'
export default {
  name: 'BeforeAfterSlider',
  data () {
    return {
      view: null, // 视角
      name: '',
      area: null,
      ratio: null,
      map: {
        map1: null,
        map2: null
      },
      coordinate: null,
      layers: {}
    }
  },
  mounted () {
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
      }).catch(_ => {
        this.$notify.error('提交失败')
      })
    },
    init (project) {
      if (project.imageA.url) {
        this.mapInit(project.imageA, 'map1')
      }
      if (project.imageB.url) {
        this.mapInit(project.imageB, 'map2')
      }
      for (var i = 0; i < project.tasks.length; i++) {
        this.addLayer(project.tasks[i])
      }
    },
    addLayer (task) {
      this._addLayer('map1', task)
      this._addFeatures('map1', task)
      this._addLayer('map2', task)
      this._addFeatures('map2', task)
    },
    _addLayer (type, task) {
      var coordinate = task.coordinate
      var extent = this.raw_extent
      if (coordinate) {
        var maxH = extent[3]
        var tl = [coordinate.tl[0], maxH - coordinate.br[1]]
        var br = [coordinate.br[0], maxH - coordinate.tl[1]]
        extent = [tl[0], tl[1], br[0], br[1]]
      }
      this.layers[type + task.id] = new ImageLayer({
        source: new Static({
          url: task.mask.url,
          projection: this.projection,
          imageExtent: extent
        }),
        opacity: 0.7
      })
      this.map[type].addLayer(this.layers[type + task.id])
    },
    removeLayer (task) {
      this.map.map1.removeLayer(this.layers['map1' + task.id])
      this.map.map2.removeLayer(this.layers['map2' + task.id])
      this.map.map1.removeLayer(this.layers['map1vector' + task.id])
      this.map.map2.removeLayer(this.layers['map2vector' + task.id])
    },
    setVisibility (task, visible) {
      this.layers['map1' + task.id].setVisible(visible)
      this.layers['map1vector' + task.id].setVisible(visible)
      this.layers['map2' + task.id].setVisible(visible)
      this.layers['map2vector' + task.id].setVisible(visible)
    },
    _addFeatures (type, task) {
      var style = new Style({
        stroke: new Stroke({
          color: 'red',
          width: 2
        }),
        fill: new Fill({
          color: 'rgba(0, 0, 0, 0)'
        })
      })
      var data = task.analysis.geojson
      if (!data) {
        return
      }
      const vectorLayer = new VectorLayer({
        source: new VectorSource({
          features: (new GeoJSON()).readFeatures(data)
        }),
        style: function (feature) {
          const color = feature.values_.color
          var rgba1 = 'rgba(' + color[0] + ',' + color[1] + ',' + color[2] + ',' + color[3] + ')'
          var rgba2 = 'rgba(' + color[0] + ',' + color[1] + ',' + color[2] + ',' + 1 + ')'
          if (color[0] === 255 && color[1] === 255 && color[2] === 255) {
            rgba2 = 'rgba(' + color[0] + ',' + color[1] + ',' + color[2] + ',' + 0 + ')'
          }
          style.getFill().setColor(rgba1)
          style.getStroke().setColor(rgba2)
          style.setZIndex(feature.values_.zIndex)
          return style
        }
      })
      this.layers[type + 'vector' + task.id] = vectorLayer
      var map = this.map[type]
      map.addLayer(vectorLayer)
      let highlight
      const featureOverlay = new VectorLayer({
        source: new VectorSource(),
        map: map,
        style: new Style({
          stroke: new Stroke({
            color: 'rgba(255, 255, 255, 1)',
            width: 2
          })
        })
      })
      const _that = this
      const displayFeatureInfo = function (pixel) {
        const feature = map.forEachFeatureAtPixel(pixel, function (feature) {
          return feature
        })
        if (feature) {
          _that.name = feature.get('name')
          _that.area = feature.get('area')
          _that.ratio = feature.get('ratio').toFixed(6)
        }
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
    mapInit (image, target) {
      const extent = [0, 0, image.H, image.W]
      this.raw_extent = extent
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
  height: 100%;
  background-color: rgb(36, 39, 47)
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
.detail{
  display: flex;
  justify-content: left;
  color: aqua;
  gap: 15px;
}
</style>
