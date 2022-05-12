<template>

  <div>
    <div class="container" >
      <div class="left">
          <img src="../assets/original.png" alt="" class="project_image" />
      </div>

      <div class="middle">
        <div>项目名称：{{project.name}}</div>
        <div>项目类型：{{project.type}}</div>
        <div>任务数量：{{project.task_num}}</div>
        <div>创建时间：{{project.create_time}}</div>
        <div>最后编辑时间：{{project.last_edit_time}}</div>
      </div>

      <div class="right">
        <div v-if="project.status === 'normal' " style="margin-top: 5px" @click="edit(project.id)">
          <el-button class="button" type="primary" icon="el-icon-edit" size="medium">编辑</el-button>
        </div>
        <div v-if="project.status === 'normal' " style="margin-top: 5px">
          <el-button class="button" type="danger" icon="el-icon-delete" size="medium">删除</el-button>
        </div>

        <div v-if="project.status === 'deleted' " style="margin-top: 5px">
          <el-button class="button" type="primary" icon="el-icon-success" size="medium">恢复</el-button>
        </div>
        <div v-if="project.status === 'deleted' " style="margin-top: 5px">
          <el-button class="button" type="danger" icon="el-icon-delete" size="medium">删除</el-button>
        </div>
      </div>
    </div>

    <!-- <el-divider></el-divider> -->

  </div>

</template>

<script>
export default {
  props: { project: { type: Object, required: true } },
  data () {
    return {
      imageA: 'C:\\Users\\Zhouxt\\Desktop\\SoftwareCup\\rs-platform-frontend\\src\\assets\\original.png'
    }
  },
  methods: {
    edit (id) {
      this.$prompt('项目名称', '编辑项目', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
        // inputErrorMessage: '邮箱格式不正确'
      }).then(({ value }) => {
        // TODO: post
        this.$message({
          type: 'success',
          message: '编辑成功: ' + value
        })
      })
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
  margin-left: 1%;
  min-width: 70%;
  /* display: flex; */
}

.project_image {
  width: 90%;
  margin: 0 auto;
}

.button {
  /* width: 100px; */
  /* border-radius: 30px; */
  /* margin-top: 10px; */
}

</style>
