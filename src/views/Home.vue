<template>
  <div>
    <project-header></project-header>
    <el-container class="home">
      <el-aside class="aside">
          <el-container class="class">
            <div @click="createProject" style="margin-left: 0px">
              <el-button class="button" circle>
                <div class="add">
                 <i class="el-icon-folder-add"></i>
                </div>
              </el-button>
              <h4>创建项目</h4>
            </div>
          </el-container>
            <el-menu
              router
              :default-active="status"
            active-text-color="#1976d2"
              >
            <el-menu-item index='normal' @click="getNormal" class="history-project">
              <i class="el-icon-folder-opened"></i>
              <span slot="title"> 历史项目</span>
            </el-menu-item>
            <v-divider></v-divider>
            <el-menu-item index='delete' @click="getDelete" class="history-project">
              <i class="el-icon-delete"></i>
              <span slot="title">回收站</span>
            </el-menu-item>
          </el-menu>
      </el-aside>
      <el-main class="main" v-loading="show">
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
        <div v-for=" item, idx in projects.slice(page_size*(page-1), page_size*page)" :key="item.id" class="project">
          <project-card @remove="remove" :project="item" :idx="idx"/>
        </div>
        <div v-if="page_num===0" class="no-project">
          暂无项目
        </div>
        <v-divider class="divider"></v-divider>
        <v-pagination
        v-model="page"
        :length="page_num"
        prev-icon="mdi-menu-left"
        next-icon="mdi-menu-right"
        v-if="page_num !== 0"
      ></v-pagination>
      </el-main>
    </el-container>
  </div>
</template>

<script>

import ProjectCard from '../components/ProjectCard.vue'
import ProjectHeader from '../components/ProjectHeader.vue'

export default {
  name: 'Home',
  components: {
    ProjectCard,
    ProjectHeader
  },
  data () {
    return {
      projects: [],
      status: 'normal',
      show: true,
      page_num: 1,
      page_size: 3,
      page: 1
    }
  },
  mounted () {
    this.init()
    this.$emit('show', 'home')
  },
  methods: {
    init () {
      var _status
      if (this.$route.query.status) {
        _status = this.$route.query.status
      } else {
        _status = 'normal'
      }
      this.status = _status
      this.$api.project.getProjects(_status).then(res => {
        this.projects = res.data.projects
        this.show = false
        this.page_num = Math.ceil(this.projects.length / this.page_size)
      })
    },
    remove (idx) {
      this.projects.splice(idx, 1)
      this.page_num = Math.ceil(this.projects.length / this.page_size)
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
.class {
  background-color: white;
  /*opacity: 0.9;*/
  border-radius: 10px;
  padding: 25px 10px 20px;
  text-align: center;
  justify-content: center;
}
.home {
  width: 80%;
  margin: 0 auto;
  display: flex;
  margin-top: 1%;
}
.divider{
  margin: 10px 0 10px 0;
}
.button {
  background-image: linear-gradient(to right, #0250c5, #d43f8d);
  color: white;
  opacity: 0.6;
  height: 60px;
  width: 60px;
  margin: 10px;
  /*border-radius : 50%;*/
}

.project{
  padding: 10px;
}
.no-project{
  font-size: 22px;
  text-align: center;
  margin: 95px;
}
.button:hover{
  background-color: #d43f8d;
}
.aside {
  min-width: 200px;
  padding: 0px !important;
  /* background-color: antiquewhite; */
}

.main {
  width: calc(100% - 300px);
  height: 100%;
  margin-left: 1%;
  padding: 12px;
  min-height: 500px;
}

.project-bar {
  margin-top: 3%;
  /* border-radius: 15px; */
  width: 100%;
  min-height: 50px;
}

.create-project {
  text-align: center;
  font-size: 18px;
  padding: 15px;
}

.create-project:hover {
  cursor: pointer;
  background-color: aqua;
}

.history-project {
  text-align: center;
  font-size: 18px;
}
.el-menu{
  padding: 0px !important;
    background-color: #fff;
  box-shadow: 0 2px 12px 1px rgba(0, 0, 0, 0.1);
}
.title {
  font-size: 25px;
  text-align: left;
  border-bottom: 2px solid purple;
  padding-bottom: 13px;
  font-weight: 550;
}
.add{
  font-size: 28px;
}

</style>
