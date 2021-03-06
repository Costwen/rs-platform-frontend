/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
import Map from 'ol/Map'
import View from 'ol/View'
import XYZ from 'ol/source/XYZ'
import { Tile as TileLayer } from 'ol/layer'
import ImageLayer from 'ol/layer/Image'
import Static from 'ol/source/ImageStatic'
import Projection from 'ol/proj/Projection'
import { getCenter } from 'ol/extent'
export function gaodeMapInit () {
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
  const map = new Map({
    target: 'imgA',
    layers: [
      imgLayer,
      labelLayer
    ],
    view: new View({
      projection: 'EPSG:4326', // 使用这个坐标系
      center: [116.350564, 39.983056], // BUAA
      maxZoom: 18,
      zoom: 17
    })
  })
  return map
}

export function userMapInit (obj, url, target) {
  const img = new Image()
  img.src = url
  obj.img_count += 1
  img.onload = () => {
    const extent = [0, 0, img.width, img.height]
    const projection = new Projection({
      code: 'xkcd-image',
      units: 'pixels',
      extent: extent
    })
    var view
    if (target === 'imgA') {
      view = new View({
        projection: projection,
        center: getCenter(extent),
        zoom: 2,
        maxZoom: 8
      })
      obj.view = view
    } else {
      view = obj.view
    }
    const map = new Map({
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
    obj.map = map
    obj.drawInit()
    obj.popUpInit()
  }
}
