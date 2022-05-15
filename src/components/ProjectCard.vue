<template>

  <div>
    <div class="container" >
      <div class="left">
          <img :src="project.imageA" alt="" class="project_image" />
      </div>

      <div class="middle">
        <div>项目名称：{{project.name}}</div>
        <div>项目类型：{{project.type}}</div>
        <div>任务数量：{{project.task_num}}</div>
        <div>创建时间：{{project.create_time}}</div>
        <div>最后编辑时间：{{project.modify_time}}</div>
      </div>

      <div class="right">
        <div v-if="project.status === 'normal' " @click="projectEdit(project.id)">
          <el-button  type="primary" icon="el-icon-edit" size="medium">编辑</el-button>
        </div>
        <div v-if="project.status === 'normal' " @click="projectDelete(project.id)">
          <el-button type="danger" icon="el-icon-delete" size="medium">删除</el-button>
        </div>

        <div v-if="project.status === 'delete' " style="rab" @click="projectRecovery(project.id)">
          <el-button type="primary" icon="el-icon-success" size="medium">恢复</el-button>
        </div>

        <div v-if="project.status === 'delete' " style="rab" @click="projectRecovery(project.id)">
          <el-button type="danger" icon="el-icon-delete" size="medium">彻底删除</el-button>
        </div>

      </div>
    </div>

  </div>

</template>

<script>
// TODO  添加等待动画
export default {
  props: {
    project: { type: Object, required: true },
    idx: { type: Number, required: true }
  },
  data () {
    return {
      status: 'normal'
    }
  },
  methods: {
    projectEdit (id) {
      this.$router.push({
        name: 'Project',
        params: { id: id }
      })
    },
    projectDelete (id) {
      this.$api.project.deleteProject(id).then(res => {
        this.$emit('remove', this.idx)
        this.$notify.success({
          title: '已加入回收站'
        })
      }).catch(err => {
        console.log(err)
        this.$notify.error({
          title: '删除失败'
        })
      }
      )
    },
    projectRecovery (id) {
      this.$api.project.recoveryProject(id).then(res => {
        this.$emit('remove', this.idx)
        this.$notify.success({
          title: '恢复成功'
        })
      }).catch(err => {
        console.log(err)
        this.$notify.error({
          title: '恢复失败'
        })
      }
      )
    },
    entireDelete (id) {
      this.$api.project.entireDelete(id).then(
        res => {
          this.$emit('remove', this.idx)
          this.$notify.success({
            title: '彻底删除成功'
          })
        }).catch(err => {
        console.log(err)
        this.$notify.error({
          title: '删除失败'
        })
      }
      )
    }
  }
}
</script>

<style scoped>

.container {
  display: flex;
  /* justify-content: flex-start; */
  min-height: 140px;
  border-bottom: 1px solid grey;
  padding-top: 10px;
  padding-right: 10px;
  justify-content: space-between;
}

.container:hover {
  cursor: pointer;
  background-color: ivory;
}

.left {
  width: 20%;
  /* background-color:gray; */
}

.middle {
  font-size: 17px;
  text-align: left;
  /* display: flex; */
}

.project_image {
  width: 90%;
  margin: 0 auto;
}

.rab{
  margin-top: 5px
}

.el-button{
  width:110px;
  margin: 8px;
}

</style>
