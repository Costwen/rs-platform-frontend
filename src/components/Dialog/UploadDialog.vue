<template>
  <div class="text-center">
    <v-dialog
      v-model="dialog"
      width="500"
    >
      <v-card>
        <v-card-title class="text-h5 title">
          上传文件
            <v-icon right @click="close">
                mdi-close
            </v-icon>
        </v-card-title>

        <v-card-text class="contain">
            <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="80px">
            <el-form-item label="名称" prop="name">
                <el-input type="text" v-model="ruleForm.name" autocomplete="off" clearable></el-input>
            </el-form-item>
            <el-form-item label="文件" prop="file">
                  <v-file-input
                    accept="image/png, image/jpeg, image/bmp"
                    v-model="ruleForm.file"
                    ></v-file-input>
            </el-form-item>
            </el-form>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
            <v-btn @click="resetForm('ruleForm')" color="secondary" >
                <v-icon>mdi-undo</v-icon>
                重置
            </v-btn>
        <v-btn style="margin-left: 10px;" color="primary" @click="submitForm('ruleForm')">
            <v-icon>
                mdi-upload
            </v-icon>
            上传服务器
            </v-btn>

        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data () {
    var checkName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('名称不能为空'))
      }
      return callback()
    }
    var checkFile = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('文件不能为空'))
      }

      return callback()
    }
    return {
      ruleForm: {
        name: '',
        file: null
      },
      rules: {
        name: [
          { validator: checkName, trigger: 'blur' }
        ],
        file: [
          {
            validator: checkFile, trigger: 'blur'
          }
        ]
      },
      dialog: false
    }
  },
  methods: {
    init () {
      this.ruleForm.name = ''
      this.ruleForm.file = null
      this.dialog = true
    },
    close () {
      this.dialog = false
      this.$refs.ruleForm.resetFields()
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var form = new FormData()
          form.append('name', this.ruleForm.name)
          form.append('file', this.ruleForm.file)
          this.$api.image.putImage(form).then(res => {
            this.$notify.success({
              message: '上传成功'
            })
            this.close()
            this.$emit('upload', res.data.image)
          }).catch(
            err => {
              this.$notify({
                title: '错误',
                message: err.message,
                type: 'error',
                duration: 2000
              })
            })
        } else {
          return false
        }
      })
    },
    resetForm (formName) {
      console.log(this.ruleForm)
    //   this.$refs[formName].resetFields()
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
}
</style>
