<template>
  <div class="text-center">
    <v-dialog
      v-model="dialog"
      width="1200"
    >
      <v-card>
        <v-card-title class="text-h5 title">
          选择图像
            <v-icon right @click="close">
                mdi-close
            </v-icon>
        </v-card-title>
        <el-container>
            <el-aside class="aside">
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
                prop="url"
                label="图片预览"
                width="180">
                 <template slot-scope="scope">
                    <v-img
                      src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg"
                      class="image-item"
                      @click="chooseImage(scope.row.url)"
                    ></v-img>
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
      radio: null
    }
  },
  methods: {
    close () {
      this.show = true
      this.dialog = false
      this.radio = null
    },
    save () {
      if (!this.radio) {
        this.$notify.error({
          message: '请选择图片'
        })
        return
      }
      var data = {
        imageA: this.radio
      }
      var id = this.$route.params.id
      this.$api.project.putProject(id, data).then(res => {
        this.$notify.success({
          message: '保存成功'
        })
        this.close()
      }).catch(err => {
        console.log(err)
        this.$notify.error({
          message: '保存失败'
        })
      })
    },
    chooseImage (url) {
      console.log(url)
      this.dialog = true
    },
    init () {
      this.dialog = true
      this.$api.image.getImages().then(res => {
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
</style>
