<template>
  <div class="olmap">

    <div class="left" v-if="leftshow">
      <el-upload
        action=""
        ref="upload"
        list-type="picture-card"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :auto-upload="false"
        :file-list="fileList"
        :http-request="handleUpload"
        >
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-button @click="upload">上传</el-button>
    </div>
     <el-button @click="leftdisappear">切换</el-button>

    <map-card v-if="isShow" ref="map" class="mid" />

  </div>
</template>

<script>
import MapCard from '../components/MapCard.vue'
export default {
  name: 'OLmap',
  components: {
    MapCard
  },
  data () {
    return {
      leftshow: true,
      rightshow: true,
      mode: null,
      fileList: [],
      url: null
    }
  },
  methods: {
    isShow () {
      if (this.url) {
        return true
      } else {
        return false
      }
    },
    leftdisappear () {
      this.leftshow = !this.leftshow
      console.log(this.mode)
    },
    rightdisappear () {
      this.rightshow = !this.rightshow
    },
    handleRemove (file, fileList) {
      console.log(file, fileList)
      this.url = null
    },
    handlePreview (file) {
      this.url = file.url
      setTimeout(() => {
        this.isShow = true
        this.$refs.map.mapInit(this.url)
      }, 1000)
    },
    handleUpload (param) {
      console.log(param)
    },
    upload () {
      this.$refs.upload.submit()
    }
  },
  mounted () {
    // 获取url的最后一个
  }
}
</script>

<style scoped>
.olmap{
  width: 100%;
  height: 100%;
  display: -webkit-box;
}
.left{
  width: 20%;
  background-color: rgb(225, 97, 97);
  height: 100%;
}
.mid{
  z-index: -1;
  width: 100%;
  height: 100%;
}
.right{
  position: fixed;
  width: 20%;
  margin-left: 80%;
  height: 100%;
  background-color: rgb(139, 139, 208);
}
</style>
