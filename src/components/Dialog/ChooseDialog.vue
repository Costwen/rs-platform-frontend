<template>
  <div class="text-center">
    <v-dialog
      v-model="dialog"
      width="1200"
    >
      <v-card>
        <v-card-title class="text-h5 title">
          选择图像{{mode}}
            <v-icon right @click="close">
                mdi-close
            </v-icon>
        </v-card-title>
        <el-container>
            <el-aside class="aside">
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
        <el-main class="mid" v-loading="show">
          <el-radio-group v-model="radio" v-if="!show">
            <el-table
            class="table"
              :data="imageList"
              stripe
              >
              <el-table-column
                prop="id"
                label="图片ID"
                width="310"
                >
                <template slot-scope="scope">
                  <el-radio :label="scope.row.id">
                  </el-radio>
                </template>
                </el-table-column>
              <el-table-column
                prop="imageA"
                label="图片预览"
                width="180">
                 <template slot-scope="scope">
                  <el-image
                      :src="thumbnail(scope.row.url)"
                      class="image-item"
                    >
                    </el-image>
                </template>
              </el-table-column>
              <el-table-column
                prop="name"
                label="图片名称"
                width="180">
              </el-table-column>
              <el-table-column
                prop="create_time"
                label="创建时间"
                width="180">
              </el-table-column>
            </el-table>
          </el-radio-group>

      </el-main>
        </el-container>
    <v-divider></v-divider>
    <v-card-actions class="bottom">
        <v-btn style="margin-left: 10px;" color="primary" @click="save">
            <v-icon>
                mdi-content-save
            </v-icon>
            保存
            </v-btn>
    </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      imageList: [],
      dialog: false,
      show: true,
      radio: null,
      srcList: [],
      mode: ''
    }
  },
  methods: {
    close () {
      this.show = true
      this.dialog = false
      this.radio = null
    },
    change (type) {
      this.show = true
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
    },
    save () {
      if (!this.radio) {
        this.$notify.error({
          message: '请选择图片'
        })
        return
      }
      var data
      if (this.mode === 'B') {
        data = {
          imageB: this.radio
        }
      } else {
        data = {
          imageA: this.radio
        }
      }
      var id = this.$route.params.id
      this.$api.project.postProject(id, data).then(res => {
        this.$notify.success({
          message: '保存成功'
        })
        this.close()
        this.$emit('save')
      }).catch(err => {
        console.log(err)
        this.$notify.error({
          message: '保存失败'
        })
      })
    },
    thumbnail (url) {
      if (!url) {
        return require('@/assets/default.png')
      }
      return url.replace('/images/', '/thumbnail/')
    },
    chooseImage (url) {
      console.log(url)
      this.dialog = true
    },
    init (mode) {
      this.mode = mode
      this.dialog = true
      this.getImages({
        type: 'all'
      })
    },
    getImages (query) {
      this.$api.image.getImages(query).then(res => {
        this.imageList = res.data.images
        this.show = false
      })
    }
  }
}
</script>

<style scoped>
.contain {
   margin-top: 30px;
}
.title{
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #e0e0e0;
}
.aside{
  margin-left: 5px;
  width: 200px !important;
  border-right: 1px solid #e0e0e0;
}
.bottom{
  display: flex;
  justify-content: right;
}
.mid{
  display: flex;
  justify-content: center;
  height: 500px;
}
.el-main{
  padding: 0 !important;
}
.table{
  border-left: 1px solid #e8e8e8;
  border-right: 1px solid #e8e8e8;
}
.image-item{
  width: 180px;
  height: 120px;
}
</style>
