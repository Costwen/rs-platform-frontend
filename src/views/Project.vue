<template>
    <el-container class="contain">
    <el-header>Header</el-header>
    <el-container>
        <el-aside class="left" v-if="leftshow">
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
        </el-aside>
            <el-button @click="leftdisappear">切换</el-button>
        <el-main>
            <map-card ref="map" class="mid" />
        </el-main>
        <el-button @click="rightdisappear">切换</el-button>
        <el-aside class="right" v-if="rightshow">
            <div>
                暂无任务
            </div>
        </el-aside>
    </el-container>
    </el-container>
</template>
<script>
import MapCard from '../components/MapCard.vue'
export default {
  name: 'Project',
  components: {
    MapCard
  },
  data () {
    return {
      leftshow: true,
      midshow: true,
      rightshow: true,
      mode: null,
      fileList: [],
      url: null
    }
  },
  methods: {
    leftdisappear () {
      this.leftshow = !this.leftshow
      this.$nextTick(
        () => {
          this.$refs.map.map.updateSize()
        })
    },
    rightdisappear () {
      this.rightshow = !this.rightshow
      this.$nextTick(
        () => {
          this.$refs.map.map.updateSize()
        })
    },
    handleRemove (file, fileList) {
      console.log(file, fileList)
      this.url = null
    },
    handlePreview (file) {
      this.url = file.url
      this.midshow = false
      this.$refs.map.mapInit(this.url, 'move')
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
    this.$refs.map.mapInit(require('../assets/original.png'), 'move')
  }
}
</script>

<style scoped>
.left{
  width: 20%;
  background-color: #2f3238;
}
.mid{
  z-index: -1;
  width: 100%;
  height: 100%;
}
.right{
  width: 150px !important;
  background-color: #2f3238;
  color: white;
}
.contain{
  height: 100%;
}
.el-main{
    padding: 0;
}
</style>
