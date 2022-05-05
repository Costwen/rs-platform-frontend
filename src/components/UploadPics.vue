<template>
  <div>
    <input name="file" type="file" accept="image/*" @change="update"/>
    <el-button @click="submitUpload">上传图片</el-button>
    <img :src="pic_preview" style="width: 200px" alt=""/>
    <img :src="pic_result" alt="" />
  </div>
</template>

<script>

export default {
  name: 'UploadPics',
  props: [],
  data () {
    return {
      pic_preview: '',
      pic_result: ''
    }
  },
  methods: {
    submitUpload () {
    },
    update (e) { // 上传照片
      this.pic = e.target.files[0]
      const _this = this
      const pic = e.target.files[0]
      const reader = new FileReader()
      reader.readAsDataURL(pic)
      reader.addEventListener('load', function () {
        _this.pic_preview = this.result
      })
    }
  }
}
</script>

<style scoped></style>
