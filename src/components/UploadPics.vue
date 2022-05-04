<template>
  <div>

  </div>
</template>

<script>
import axois from 'axios'
export default {
  name: 'UploadPics',
  props: [],
  data () {
    return {

    }
  },
  methods: {
    // 处理变化
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
