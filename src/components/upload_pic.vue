<template>
  <el-upload
    :action="posterUrl"
    :before-upload="beforeUpload"
    :http-request="(params)=>uploadImage(params)"
    :on-remove="(file, fileList)=>removeImage(file, fileList)"
    list-type="picture"
    accept="image/*"
  >
    <el-button size="small">选择图片</el-button>
  </el-upload>
</template>

<script>
export default {
  name: 'upload_pic'
}
</script>

<style scoped>

</style>
