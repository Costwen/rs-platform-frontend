<template>
  <div class="text-center">
    <v-dialog
      v-model="dialog"
      width="500"
    >
      <v-card>
        <v-card-title class="text-h5 title">
          创建项目
            <v-icon right @click="close">
                mdi-close
            </v-icon>
        </v-card-title>

        <v-card-text class="contain">
            <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="80px">
            <el-form-item label="项目类型" prop="type">
              <el-input type="text" v-model="ruleForm.type" autocomplete="off" disabled></el-input>
            </el-form-item>
            <el-form-item label="名称" prop="name">
                <el-input type="text" v-model="ruleForm.name" autocomplete="off" clearable></el-input>
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
            确认
            </v-btn>

        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
var name = {
  目标检测: 'detection',
  目标提取: 'retrieval',
  地物分类: 'sort',
  变化检测: 'contrast'
}
export default {

  data () {
    var checkName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('名称不能为空'))
      }
      return callback()
    }
    return {
      ruleForm: {
        name: '',
        type: ''
      },
      rules: {
        name: [
          { validator: checkName, trigger: 'blur' }
        ]
      },
      dialog: false
    }
  },
  methods: {
    init (item) {
      this.ruleForm.type = item.title
      this.ruleForm.name = ''
      this.dialog = true
    },
    close () {
      this.dialog = false
      this.ruleForm.name = ''
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var data = {
            name: this.ruleForm.name,
            type: name[this.ruleForm.type]
          }
          console.log(data)
          this.$api.project.putProject(data).then(res => {
            this.$notify.success({
              message: '创建成功'
            })
            this.dialog = false
            this.$emit('upload', res.data)
          }).catch(
            err => {
              console.log(err)
              this.$notify.error({
                message: '创建失败'
              })
            })
        } else {
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
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
