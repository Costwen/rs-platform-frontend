<template>
  <div class="home">
    <div class="aside">
      <div class="create-project" @click="createProject">
        <i class="el-icon-folder-add"></i>
        创建项目
      </div>
      <div @click="getNormal" class="history-project">
        <i class="el-icon-folder-opened"></i>
        历史项目
      </div>
      <div @click="getDelete" class="trash-can" >
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
          <el-dropdown-item command = '-create_time'>创建时间</el-dropdown-item>
          <el-dropdown-item command = '-task_num'>任务数量</el-dropdown-item>
          <el-dropdown-item command = '-modify_time'>最后编辑时间</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <div v-if="status === 'normal'" class="title">项目列表</div>
      <div v-else class="title" >回收站</div>
      <div v-for=" item, idx in projects" :key="item.id" class="project">
        <project-card @remove="remove" :project="item" :idx="idx"/>
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
      projects: [],
      status: 'normal'
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      const _that = this
      var _status
      if (this.$route.query.status) {
        _status = this.$route.query.status
      } else {
        _status = 'normal'
      }
      this.status = _status
      this.$api.project.getProjects(_status).then(res => {
        _that.projects = res.data.projects
      })
    },
    remove (idx) {
      this.projects.splice(idx, 1)
    },
    getNormal () {
      this.$router.push({
        path: '/home',
        query: {
          status: 'normal',
          t: new Date().getTime()
        }
      })
    },
    getDelete () {
      this.$router.push({
        path: '/home',
        query: {
          status: 'delete',
          t: new Date().getTime()
        }
      })
    },
    sort (command) {
      console.log(command)
    },
    createProject () {
      this.$router.push({
        name: 'Create'
      })
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
