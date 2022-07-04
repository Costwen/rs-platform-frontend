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
              <el-select v-model="ruleForm.type" placeholder="请选择项目类型">
                <el-option label="目标检测" value="detection"></el-option>
                <el-option label="目标提取" value="retrieval"></el-option>
                <el-option label="地物分类" value="sort"></el-option>
                <el-option label="变化检测" value="contrast"></el-option>
              </el-select>
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
export default {

  data () {
    var checkName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('名称不能为空'))
      }
      return callback()
    }
    return {
      imageA: 0,
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
    init (id) {
      this.ruleForm.name = ''
      this.dialog = true
      this.imageA = id
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
            type: this.ruleForm.type,
            imageA: this.imageA
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
