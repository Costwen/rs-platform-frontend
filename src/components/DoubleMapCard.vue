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
      view: null, // 视角
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
      this._addLayer('map2', task)
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
    },
    setVisibility (task, visible) {
      this.layers['map1' + task.id].setVisible(visible)
      this.layers['map2' + task.id].setVisible(visible)
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
