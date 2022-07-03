<template>
  <div>
    <project-header></project-header>
  <el-container class="main">

    <el-aside class="aside">
      <div class="up">
        <v-btn @click="upload" color="primary">
          <v-icon >mdi-image-size-select-actual</v-icon>
          <span>选取文件</span>
          </v-btn>
      </div>
    <v-tabs vertical @change="change">
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
         {{item.name}}
        </v-card-title>
        <v-card-subtitle class="subtitle">
            <span>创建时间:</span>
            <span>{{item.create_time}}</span>
          </v-card-subtitle>
        <v-card-actions class="actions">
          <v-btn v-if="mode!==3"
          color="orange"
            text
            @click=create(item.id)
          >
          <v-icon>mdi-pencil-outline</v-icon>
            创建项目
          </v-btn>
          <v-btn v-else
            color="orange"
            text
            @click=toProject({id:item.project})
          >
          <v-icon>mdi-pencil-outline</v-icon>
            查看项目
          </v-btn>

          <v-btn
          color="deep-purple lighten-2"
            text
            @click="downloadIamge(item.url, item.name)"
          >
          <v-icon> mdi-download</v-icon>
          下载
          </v-btn>
          <v-btn text
          class="btn1"
          @click="deleteImage(item.id, idx)"
          >
        <v-icon left >
          mdi-delete
        </v-icon>
            删除
          </v-btn>
        </v-card-actions>
      </v-card>
      </div>
      <v-divider></v-divider>
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
      srcList: [],
      rowList: [],
      imageList: [],
      page: 1,
      fileList: [],
      show: true,
      page_num: 1,
      page_size: 6,
      mode: 0,
      cur_idx: 0
    }
  },
  methods: {
    setIdx (index) {
      const afterPicArr = this.rowList.slice(index)
      const beforePicArr = this.rowList.slice(0, index)
      this.srcList = afterPicArr.concat(beforePicArr)
    },
    addImages (image) {
      // 添加到第一个
      this.imageList.unshift(image)
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
        return ''
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
    postProject (id) {
      var data = {
        imageA: id
      }
      this.$api.project.postProject(data).then(res => {
        console.log(res)
        this.$notify.success({
          message: '创建成功'
        })
      }).catch(err => {
        console.log(err)
        this.$notify.error({
          message: '创建失败'
        })
      })
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
.up{
  text-align: center;
  margin: 50px 0 20px 0 ;
}
.mid{
  height: 100%;
  margin: 0px !important;
  padding: 0px !important;
}
.main {
  margin: 20px auto;
  width: 95%;
  background-color: whitesmoke;
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
  width: 200px;
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
  margin-top: 30px;
  margin: 0 auto;
  min-height: 300px;
}

.image {
  position: absoulte;
  width: 30%;
  min-width: 300px;
  min-height: 300px;
  margin: 1%;
  height: 40%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.image-item{
  display: flex;
  height: 165px;
  margin: 5px;
  border: 1.5px solid rgb(126, 12, 12);
  padding: 2px;
  justify-content: center;
}
.actions{
  display: flex;
  justify-content: space-between;
}
.btn1{
  color: #b68712 !important;
}
.btn2{
  color: #a2741d !important;
}
.v-card__subtitle, .v-card__text, .v-card__title{
  padding: 10px;
}
</style>
