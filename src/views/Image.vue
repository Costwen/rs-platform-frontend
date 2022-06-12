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
    <v-tabs vertical>
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
      <div  class="content">
      <v-card class="image"  v-for="item, idx in imageList.slice(page_size*(page-1), page_size*page)" :key="item.id" >
      <div class="image-item">
          <el-image
            :src="item.url"
            :preview-src-list="srcList.slice(page_size*(page-1), page_size*page)">
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
          <v-btn
          color="orange"
            text
            @click=postProject(item.id)
          >
          <v-icon>mdi-pencil-outline</v-icon>
            创建项目
          </v-btn>
          <v-btn
          color="deep-purple lighten-2"
            text
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
    ></v-pagination>
    </el-main>
  <upload-dialog ref="dialog" @upload="getImages"></upload-dialog>
  </el-container>
  </div>
</template>

<script>
import ProjectHeader from '../components/ProjectHeader.vue'
import UploadDialog from '../components/UploadDialog.vue'
export default {
  components: { UploadDialog, ProjectHeader },
  data () {
    return {
      srcList: [],
      imageList: [],
      page: 1,
      fileList: [],
      show: true,
      page_num: 1,
      page_size: 6
    }
  },
  methods: {
    getImages () {
      this.$api.image.getImages().then(res => {
        this.imageList = res.data.images
        this.show = false
        this.page_num = Math.round(this.imageList.length / this.page_size) + 1
        for (let i = 0; i < this.imageList.length; i++) {
          this.srcList.push(this.imageList[i].url)
        }
      })
    },
    deleteImage (id, idx) {
      this.$api.image.deleteImage(id).then(res => {
        this.$notify.success({
          title: '成功',
          message: '删除成功',
          duration: 2000
        })
        this.imageList.splice(idx, 1)
      }).catch(err => {
        console.log(err)
        this.$notify.error({
          title: '失败',
          message: '删除失败',
          duration: 2000
        })
      })
    },
    putImage (data) {
      this.imageList.push(data)
    },
    upload () {
      this.$refs.dialog.dialog = true
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
    }
  },
  mounted () {
    this.getImages()
  }
}
</script>

<style>
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
  margin: 0 auto;
  width: 95%;
  background-color: whitesmoke;
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
  height: 168px;
  margin: 10px;
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
