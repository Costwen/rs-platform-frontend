<template>

  <div>
    <div class="container" >
      <div class="left">
          <el-image :src="thumbnail(project.imageA)" alt="" class="project_image">
          <div slot="error" class="slot">
              暂未设置图片
          </div>
          </el-image>
      </div>

      <div class="middle-box">
        <div class="middle-name">{{project.name}}</div>
        <div class="middle-attr">
          <span style="fontSize:12px;color:gray">项目类型：</span>
          <span style="fontSize:13px">{{typeMap[project.type]}}</span>
        </div>
        <div class="middle-attr">
          <span style="fontSize:12px;color:gray">任务数量：</span>
          <span style="fontSize:13px">{{project.task_num}}</span>
        </div>
        <div class="middle-attr">
          <span style="fontSize:12px;color:gray">创建时间：</span>
          <span style="fontSize:13px">{{project.create_time}}</span>
        </div>
        <div class="middle-attr">
          <span style="fontSize:12px;color:gray">最后编辑：</span>
          <span style="fontSize:13px">{{project.modify_time}}</span>
        </div>
      </div>

      <div class="right">
        <div v-if="project.status === 'normal' " @click="projectEdit(project.id)">
          <el-button  type="primary" icon="el-icon-edit" size="small">编辑</el-button>
        </div>
        <div v-if="project.status === 'normal' " @click="projectDelete(project.id)">
          <el-button type="info" icon="el-icon-delete" size="small">删除</el-button>
        </div>

        <div v-if="project.status === 'delete' " style="rab" @click="projectRecovery(project.id)">
          <el-button type="primary" icon="el-icon-success" size="small">恢复</el-button>
        </div>

        <div v-if="project.status === 'delete' " style="rab" @click="entireDelete(project.id)">
          <el-button type="info" icon="el-icon-delete" size="small">彻底删除</el-button>
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
      status: 'normal',
      typeMap: {
        detection: '目标检测',
        sort: '地物分类',
        retrieval: '目标提取',
        contrast: '变化检测'
      }
    }
  },
  methods: {
    thumbnail (image) {
      if (!image.url) {
        return require('../assets/default.png')
      }
      return image.url.replace('/images/', '/thumbnail/')
    },
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
          title: '已加入回收站',
          message: '已加入回收站',
          duration: 2000
        })
      }).catch(err => {
        console.log(err)
        this.$notify.error({
          title: '删除失败',
          duration: 2000
        })
      }
      )
    },
    projectRecovery (id) {
      this.$api.project.recoveryProject(id).then(res => {
        this.$emit('remove', this.idx)
        this.$notify.success({
          title: '恢复成功',
          duration: 2000
        })
      }).catch(err => {
        console.log(err)
        this.$notify.error({
          title: '恢复失败',
          duration: 2000
        })
      }
      )
    },
    entireDelete (id) {
      this.$api.project.entireDelete(id).then(
        res => {
          this.$emit('remove', this.idx)
          this.$notify.success({
            title: '彻底删除成功',
            duration: 2000
          })
        }).catch(err => {
        console.log(err)
        this.$notify.error({
          title: '删除失败',
          duration: 2000
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
  height: 160px;
  padding-top: 10px;
  padding-right: 10px;
  justify-content: space-between;
  background-color: #fff;
  box-shadow: 0 2px 12px 1px rgba(0, 0, 0, 0.1);
  border-radius: 6px;
}

.container:hover {
  cursor: pointer;
  background-color: #ecf5ff
}

.left {
  width: 20%;
  padding: 10px;
  /* background-color:gray; */
}

.middle-box {
  width:50%;

  padding: 10px 0px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: flex-start;
}

.middle-attr {
  text-align: left;
  /* display: flex; */
}

.middle-name {
  font-size: 20px;
  font-weight: 600;
}

.right{
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.project_image {
  /*长宽比: 1:1 */
  height: 100%;
  margin: 0 auto;
  text-align: center;
  font-size: 15pt;
}

.rab{
  margin-top: 5px
}

.el-button{
  width:110px;
  margin: 8px;
}
</style>
