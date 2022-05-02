<template>
  <div>
    <el-upload
      class="uploadPics"
      action=""
      list-type="picture-card"
      multiple
      :auto-upload="false"
      :on-change="handleChange"
      :file-list="fileList"
      :limit="1"
      :http-request="uploadPics"
      :on-preview="PreviewPics"
      :on-remove="handleRemove"
      :on-exceed="handleExceed"
    >
      <i class="el-icon-plus"></i>
    </el-upload>

    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>

    <el-button type="primary" @click="submitUpload" style="margin-top: 10px"
      >上传服务器</el-button
    >
  </div>
</template>

<script>
import axois from 'axios'

export default {
  name: 'UploadPics',
  props: [],
  data () {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      imgUrl: '',
      fileDate: '',
      fileList: []
    }
  },
  methods: {
    // 上传之前只需要检查图片的大小, auto-upload=false时，此函数无效
    beforeUpload (file) {
      if (file.size > 1024 * 1024) {
        this.$message.error('上传图片不能大于1M')
        return false
      }
      console.log(this.fileList)
      return true
    },
    // 处理变化
    handleChange (file, fileList) {
      this.fileList = fileList
    },
    handleRemove (file, fileList) {
      this.fileList = fileList
    },
    handleExceed (files, fileList) {
      this.$message.error('最多只能上传1张图片')
    },
    // 传给后端
    submitUpload () {
      const formData = new FormData()
      console.log(this.fileList)
      formData.append('file', this.fileList)
      axois
        .post('/image/retrieval/', {
          img: this.fileList
        })
        .then((res) => {
          console.log(res)
        })
    }
  }
}
</script>

<style scoped></style>
