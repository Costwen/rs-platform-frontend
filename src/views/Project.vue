<template>
    <el-container class="contain">
    <el-header class="header">

      <div class="title">
        <i class="el-icon-back" @click="back"></i>
        <span>项目名称</span>
        <span>创建时间</span>
      </div>
      <div class="right">
        <el-dropdown @command="handleCommand" trigger="click">
          <span class="el-dropdown-link">
            <el-avatar size="small">用户名</el-avatar>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="toCenter">个人空间</el-dropdown-item>
            <el-dropdown-item command="logout">注销登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-header>
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
            <el-button @click="upload" >上传</el-button>
        </el-aside>
            <div @click="leftdisappear" class="button-left">
                <i :class="leftshow ? 'el-icon-caret-left' : 'el-icon-caret-right'"></i>
            </div>

        <el-main>
            <map-card ref="map" class="mid" />
        </el-main>
        <div @click="rightdisappear" class="button-right">
            <i :class="rightshow ? 'el-icon-caret-right' : 'el-icon-caret-left'"></i>
        </div>
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
    },
    back () {
      this.$router.push('/')
    }
  },
  mounted () {
    // 获取url的最后一个
    this.$refs.map.mapInit(require('../assets/original.png'), 'move')
  }
}
</script>

<style scoped>

.header {
  display: flex;
  height: 50px !important;
  justify-content: space-between;
  padding-right: 0;
  background: #2f3238;
  color: aliceblue;
  align-items: center;
}

.left{
  width: 20%;
  background-color: #2f3238;
}
/* 过渡动画 */
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
.button-left{
  background-color: #2f3238;
  color: white;
  width: 20px;
  height: 40px;
  border: none;
  margin-top: 30px;
  cursor: pointer;
  margin-right: 10px;
}
.button-right{
  background-color: #2f3238;
  color: white;
  width: 20px;
  height: 40px;
  border: none;
  margin-top: 30px;
  cursor: pointer;
  margin-left: 10px;
}
.contain{
  height: 100%;
}
.el-icon-caret-right{
  margin-top: 50%;
  font-size: 20px;
  transform: translateX(-10%);
}
.el-icon-caret-left{
  margin-top: 50%;
  font-size: 20px;
  transform: translateX(-10%);
}
.el-main{
    padding: 0;
}
.el-dropdown{
  cursor: pointer;
}
.el-icon-back{
  font-size: 20px;
  cursor: pointer;
}
</style>
