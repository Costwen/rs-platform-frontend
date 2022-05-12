<template>
  <div class="home">
    <div class="aside">

      <div class="create-project">
        <i class="el-icon-folder-add"></i>
        创建项目
      </div>
      <div @click="showProjects = true" class="history-project">
        <i class="el-icon-folder-opened"></i>
        历史项目
      </div>
      <div @click="showProjects = false" class="trash-can" >
        <i class="el-icon-delete"></i>
        回收站
      </div>

    </div>

    <div class="main">

      <el-dropdown @command="sort" style="float: right; margin-right: 7px; margin-top: 7px">
          <span class="el-dropdown-link" style="color: grey; float: left; font-size: 15px">
            选择排序方式<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command = '-create_date'>创建时间</el-dropdown-item>
          <el-dropdown-item command = '-task_num'>任务数量</el-dropdown-item>
          <el-dropdown-item command = '-last_edit_time'>最后编辑时间</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <div v-if="showProjects" class="title">项目列表</div>
      <div v-else class="title" >回收站</div>
      <div v-for="item in projectList" :key="item.id" class="project">
        <project-card :project="item" v-if="showProjects && item.status === 'normal' " />
        <project-card :project="item" v-if="!showProjects && item.status === 'deleted' " />
      </div>
    </div>

  </div>
</template>

<script>

import ProjectCard from '../components/ProjectCard.vue'

export default {
  name: 'Home',
  components: {
    ProjectCard
  },
  data () {
    return {
      showProjects: true, // 显示项目列表 or 回收站
      projectList: [
        {
          id: 0,
          name: '项目0',
          imageA: '../assets/original.png',
          imageB: '',
          create_time: '2019-01-01',
          type: '目标检测',
          status: 'normal', // normal, deleted,
          task_num: 10,
          last_edit_time: '2019-01-04'
        },
        {
          id: 1,
          name: '项目1',
          imageA: '../assets/original.png',
          imageB: '',
          create_time: '2019-01-02',
          type: '地物分类',
          status: 'deleted',
          task_num: 2,
          last_edit_time: '2019-01-04'
        },
        {
          id: 2,
          name: '项目2',
          imageA: '../assets/original.png',
          imageB: '',
          create_time: '2019-01-04',
          type: '目标检测',
          status: 'normal', // normal, deleted,
          task_num: 3,
          last_edit_time: '2019-01-03'
        }
      ]
    }
  },
  mounted () {

  },
  methods: {
    sort (command) {
      const _this = this
      _this.projectList.sort(function (a, b) {
        if (command === '-create_date') {
          var date1 = new Date(a.create_time)
          var date2 = new Date(b.create_time)
          return date1 - date2
        }
        if (command === '-task_num') return a.task_num - b.task_num
        if (command === '-last_edit_time') {
          var date3 = new Date(a.last_edit_time)
          var date4 = new Date(b.last_edit_time)
          return date3 - date4
        }
      })
      console.log(_this.projectList[0])
    }
  }
}
</script>

<style scoped>
.home {
  width: 70%;
  margin: 0 auto;
  display: flex;
  margin-top: 1%;
}

.aside {
  min-width: 350px;
  height: 100%;
  /* background-color: antiquewhite; */
}

.main {
  width: calc(100% - 300px);
  height: 100%;
  background-color:whitesmoke;
  margin-left: 1%;
  padding: 12px;
}

.project-bar {
  margin-top: 3%;
  background-color: whitesmoke;
  /* border-radius: 15px; */
  width: 100%;
  min-height: 50px;
}

.create-project {
  background-color: whitesmoke;
  text-align: center;
  font-size: 18px;
  padding: 15px;
}

.create-project:hover {
  cursor: pointer;
  background-color: antiquewhite;
}

.history-project {
  margin-top: 20px;
  background-color: whitesmoke;
  text-align: center;
  font-size: 18px;
  padding: 15px;
  border-bottom: 1px solid gray;
}

.history-project:hover {
  cursor: pointer;
  background-color: antiquewhite;
}

.trash-can {
  background-color: whitesmoke;
  text-align: center;
  font-size: 18px;
  padding: 15px;
}

.trash-can:hover {
  cursor: pointer;
  background-color: antiquewhite;
}

.title {
  font-size: 25px;
  text-align: left;
  border-bottom: 2px solid gray;
  padding-bottom: 13px;
  font-weight: 550;
}

</style>
