<template>
  <div class="total">
    <project-header id="header"></project-header>
  <el-container class="main">
    <el-aside class="aside">
      <div class="up">
        <v-btn @click="upload" color="primary">
          <v-icon >mdi-image-size-select-actual</v-icon>
          <span>选取文件</span>
        </v-btn>
      </div>
      <v-tabs class="tabs" vertical @change="change">
          <v-tab>
            <v-icon left>
              mdi-account
            </v-icon>
            <span>总共图片</span>
          </v-tab>
          <v-tab>
            <v-icon left>
              mdi-account
            </v-icon>
            <span>公共图片</span>
          </v-tab>
          <v-tab>
            <v-icon left>
              mdi-account
            </v-icon>
            <span>个人图片</span>
          </v-tab>
          <v-tab>
            <v-icon left>
              mdi-account
            </v-icon>
            <span>分析结果</span>
          </v-tab>
      </v-tabs>
    </el-aside>
    <v-divider vertical style="margin: 2px"></v-divider>

    <el-main class="mid" v-loading="show">
    <div v-if="page_num===0" class="no-image">
        暂无图片
    </div>
    <div class="content">
      <v-card class="image"  v-for="item, idx in imageList.slice(page_size*(page-1), page_size*page)" :key="item.id" >
      <div class="image-item">
          <el-image
            @click="setIdx(idx)"
            :src="thumbnail(item.url)"
            :preview-src-list="srcList.slice(page_size*(page-1), page_size*page)"
            :z-index="cur_idx"
            >
            {{thumbnail(item.url)}}
          </el-image>
      </div>
        <v-card-title>
          <div class="image-title" v-if="!editMap[item.id]">
            <div style="margin-right: 10px">
            {{item.name}}
            </div>
            <div>
              <i @click="changeName(item.id)" class="el-icon-edit" style="fontSize:15px;color:gray;opacity:0.5"></i>
            </div>
          </div>
          <div class="actions" v-if="editMap[item.id]">
          <el-input v-model="item.name" placeholder="请输入内容" ></el-input>
          <v-icon class="icon" @click="changeName(item.id, item.name)"> mdi-content-save-edit </v-icon>
          </div>
        </v-card-title>
        <v-card-subtitle class="subtitle">
            <span style="fontSize:12px;color:gray;margin-right: 5px;">创建时间：</span>
            <span style="fontSize:13px">{{item.create_time}}</span>
          </v-card-subtitle>
          <v-divider></v-divider>
        <v-card-actions class="actions">
          <v-btn v-if="mode!==3"
            color="#1976d2"
            text
            @click=create(item.id)
            class="btn-content"
            plain
          >
          <v-icon>mdi-pencil-outline</v-icon>
            创建项目
          </v-btn>
          <v-btn v-else
            color="#1976d2"
            text
            @click=toProject({id:item.project})
            class="btn-content"
            plain
          >
          <v-icon>mdi-pencil-outline</v-icon>
            查看项目
          </v-btn>

          <v-btn
            color="#9575cd"
            text
            @click="downloadIamge(item.url, item.name)"
            class="btn-content"
            plain
          >
          <v-icon> mdi-download</v-icon>
            下载
          </v-btn>
          <v-btn text
            color="gray"
            class="btn1 btn-content"
            @click="deleteImage(item.id, idx)"
            plain
          >
          <v-icon left >
            mdi-delete
          </v-icon>
              删除
          </v-btn>
        </v-card-actions>
      </v-card>
    </div>
    <v-pagination
      v-model="page"
      :length="page_num"
      prev-icon="mdi-menu-left"
      next-icon="mdi-menu-right"
      v-if="page_num !== 0"
    ></v-pagination>

    </el-main>
  <upload-dialog ref="dialog" @upload="addImages"></upload-dialog>
  <image-create-project-dialog ref="create" @upload="toProject"></image-create-project-dialog>
  </el-container>
  </div>
</template>

<script>
import ImageCreateProjectDialog from '../components/Dialog/ImageCreateProjectDialog.vue'
import ProjectHeader from '../components/ProjectHeader.vue'
import UploadDialog from '../components/Dialog/UploadDialog.vue'
import axios from 'axios'
export default {
  components: { UploadDialog, ProjectHeader, ImageCreateProjectDialog },
  data () {
    return {
      editMap: {},
      srcList: [],
      rowList: [],
      imageList: [],
      page: 1,
      fileList: [],
      show: true,
      page_num: 1,
      page_size: 8,
      mode: 0,
      cur_idx: 0
    }
  },
  methods: {
    changeName (id, name) {
      // 响应式修改
      this.editMap[id] = !this.editMap[id]
      if (!this.editMap[id]) {
        this.$api.image.postImage(id, {
          name: name
        }).then(res => {
          this.$notify({
            message: '修改成功',
            type: 'success'
          })
        }).catch(err => {
          console.log(err)
          this.$notify.error({
            message: '修改失败',
            type: 'error'
          })
        })
      }
      this.$forceUpdate()
    },
    setIdx (index) {
      const afterPicArr = this.rowList.slice(index)
      const beforePicArr = this.rowList.slice(0, index)
      this.srcList = afterPicArr.concat(beforePicArr)
    },
    addImages (image) {
      // 添加到第一个
      this.editMap[image.id] = false
      this.imageList.unshift(image)
      this.rowList.unshift(image.url)
      this.page_num = Math.ceil(this.imageList.length / this.page_size)
    },
    downloadIamge (imgsrc, name) { // 下载图片地址和图片名
      var idx = imgsrc.lastIndexOf('/images')
      var url = imgsrc.substring(idx)
      axios({
        method: 'GET',
        url: url,
        responseType: 'blob'
      }).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        if (!name) name = 'mask'
        link.setAttribute('download', name + '.png')
        document.body.appendChild(link)
        link.click()
      })
    },
    thumbnail (url) {
      if (!url) {
        return require('../assets/default.png')
      }
      return url.replace('/images/', '/thumbnail/')
    },
    getImages (query) {
      this.$api.image.getImages(query).then(res => {
        this.imageList = res.data.images
        this.show = false
        this.rowList = []
        this.srcList = []
        this.page_num = Math.ceil(this.imageList.length / this.page_size)
        for (let i = 0; i < this.imageList.length; i++) {
          this.rowList.push(this.imageList[i].url)
          this.editMap[this.imageList[i].id] = false
        }
      })
    },
    deleteImage (id, idx) {
      this.$api.image.deleteImage(id).then(res => {
        this.$notify.success({
          message: '删除成功'
        })
        this.imageList.splice(idx, 1)
        this.rowList.splice(idx, 1)
        this.page_num = Math.ceil(this.imageList.length / this.page_size)
      }).catch(err => {
        console.log(err)
        this.$notify.error({
          message: '删除失败'
        })
      })
    },
    putImage (data) {
      this.imageList.push(data)
    },
    toProject (data) {
      this.$router.push({
        name: 'Project',
        params: { id: data.id }
      })
    },
    upload () {
      this.$refs.dialog.init()
    },
    create (id) {
      this.$refs.create.init(id)
    },
    change (type) {
      this.show = true
      this.mode = type
      switch (type) {
        case 0:
          this.getImages({
            type: 'all'
          })
          break
        case 1:
          this.getImages({
            type: 'public'
          })
          break
        case 2:
          this.getImages({
            type: 'custom'
          })
          break
        case 3:
          this.getImages({
            type: 'mask'
          })
          break
      }
    }
  },
  mounted () {
    this.getImages({
      type: 'all'
    })
  }
}
</script>

<style scoped>
/* .total{
  background: linear-gradient(to top, #c6e2f9, #f2faff);
} */
.total{
  height: 100%;
  overflow-y: hidden;
}
.up{
  text-align: center;
  margin: 50px 0 20px 0 ;
}
.mid{
  height: 100%;
  width: calc(100% - 200px);
  margin: 0px !important;
  padding: 0px !important;
}
.main {
  margin: 5px;
  width: 95%;
  height: calc(100% - 58px);
  /* background: #e9fdff; */
}
.el-main{
  overflow-y:hidden;
}

.btn-content{
  font-size:13px;
}
.no-image{
    font-size: 22px;
  text-align: center;
  margin: 95px;
}
.title {
  text-align: left;
  font-size: 30px;
  padding-bottom: 3px;
  border-bottom: 1.5px solid gray;
}
.aside{
  width: 200px !important;
}
.subtitle{
  text-align: left;
}

.content {
  /* overflow-y: scroll; */
  align-items: center;
  display: -webkit-box;
  justify-content: center;
  flex-wrap: wrap;
  margin: 0 auto;
}

.image {
  position: absoulte;
  padding: 5px;
  width: 23%;
  margin: 12px;
  min-height: 270px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  background: rgba(255, 255, 255, 0.5);
}
.image-item{
  display: flex;
  height: 160px;
  margin: 0px;
  border: 2px solid #13459c;
  border-radius: 5px;
  padding: 2px;
  justify-content: center;
}
.actions{
  display: flex;
  justify-content: space-between;
}
.v-card__subtitle, .v-card__text, .v-card__title{
  padding: 10px;
}
.v-card__actions{
  padding:0px !important;
}
.v-icon{
  font-size: 15px;
}
.image-title{
  display: flex;
}
.el-icon-edit{
  cursor: pointer;
}
.icon{
  margin-left: 20px;
  color: #618e1a;
}
.tabs{
  background: #5829a7;
}
</style>
