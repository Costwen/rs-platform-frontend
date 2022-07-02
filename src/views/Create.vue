<template>
  <div class="el-main" >
    <div class="questionnaire" direction="vertical">
      <div>
        <div style="width: 10%;float: right">
          <v-btn
            class="white-space"
            color="primary"
            depressed
            elevation="2"
            @click="back()"
          ><v-icon small>mdi-arrow-left</v-icon>    返回</v-btn>
        </div>
        <h2 class="title" style="min-width: 800px; text-align: left">创建项目</h2>
          <div class="contain">
                  <div
                  v-for="(item, index) in type"
                  :key="index"
                  class="mx-auto"
                  >
                  <v-card>
                    <v-img class="img"
                           :src="item.src"
                           max-height="120px"
                           max-width="120px"
                    ></v-img>

                    <v-card-title>
                      {{ item.title }}
                    </v-card-title>

                    <v-card-subtitle style="text-align: left">
                      {{ item.subtitle }}
                    </v-card-subtitle>
                    <v-card-actions>
                      <v-btn
                        color="#3F87DA"
                        text
                        @click="create(item)"
                      >
                        create
                      </v-btn>
                      <v-spacer></v-spacer>
                      <v-btn
                        icon
                        @click="change(item)"
                      >
                        <v-icon>{{ item.show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                      </v-btn>
                    </v-card-actions>

                    <v-expand-transition>
                          <div v-show="item.show">
                            <v-divider></v-divider>

                            <v-card-text>
                              {{ item.content }}
                            </v-card-text>
                          </div>
                        </v-expand-transition>
                  </v-card>
                  </div>
          </div>
      </div>
    </div>
      <creat-project-dialog ref="create" @upload="toProject"></creat-project-dialog>
  </div>

</template>

<script>
import CreatProjectDialog from '../components/Dialog/CreatProjectDialog.vue'

export default {
  components: { CreatProjectDialog },
  data () {
    return {
      type: [
        {
          src: 'https://img.alicdn.com/imgextra/i2/O1CN01yUuD2623wbuKi994q_!!6000000007320-55-tps-48-48.svg',
          title: '目标提取',
          subtitle: '点击 CREATE 创建',
          type: 'retrieval',
          show: false,
          content: '目标提取能够提交图片之中的道路部分。简约好用是我们的初衷，能够精确识别图片道路部分'
        },
        {
          src: 'https://img.alicdn.com/imgextra/i4/O1CN01KsWWBg1CT8mkcfYg1_!!6000000000081-55-tps-48-48.svg',
          title: '变化检测',
          subtitle: '点击 CREATE 创建',
          type: 'contrast',
          show: false,
          content: '提交两张图片, 识别图片之中变化部分。'
        },
        {
          src: 'https://img.alicdn.com/imgextra/i3/O1CN01h1WOBX1Fif3YcjbVS_!!6000000000521-55-tps-48-48.svg',
          title: '目标检测',
          subtitle: '点击 CREATE 创建',
          type: 'detection',
          show: false,
          content: '准确统计图片中的目标部分。使用DOTA1.5数据集, 准确分辨目标'
        },
        {
          src: 'https://img.alicdn.com/imgextra/i3/O1CN01TOtzDB1LIS5R21sx2_!!6000000001276-55-tps-48-48.svg',
          title: '地物分类',
          subtitle: '点击 CREATE 创建',
          type: 'sort',
          show: false,
          content: '识别遥感地图中不同地区, 快速分析不同区域'
        }
      ]
    }
  },
  methods: {
    back () {
      this.$router.push({ path: '/home' })
    },
    create (item) {
      this.$refs.create.init(item)
    },
    change (item) {
      item.show = !item.show
    },
    toProject (data) {
      this.$router.push({
        name: 'Project',
        params: { id: data.id }
      })
    }
  },
  mounted () {

  },
  beforeRouteEnter (to, from, next) {
    // 添加背景色 style="background-color: #222831"
    document.querySelector('body').setAttribute('style', 'background-color:#222831')
    document.title = '创建项目'
    next()
  },
  beforeRouteLeave (to, from, next) {
    // 去除背景色
    document.querySelector('body').setAttribute('style', '')
    document.title = 'rs-platform'
    next()
  }
}
</script>

<style scoped>
@import url("../assets/common.css");
.img{
  margin:auto !important;
  /*padding: 30px 0 !important;*/
}
.contain{
  display: flex;
}
.mx-auto{
  padding-top: 20px;
  margin: 5px;
  width: 220px;
}
.white-space {
  white-space:pre
}
.el-main {
  background-color: transparent;
  margin: 40px auto 0;
  border-radius: 15px;
  /*opacity: 1;*/
  color: #333;
  height: fit-content;
  padding-top: 0 !important;
  padding-bottom: 0;
  width: 77%;
  justify-content: center;
  /*text-align: center;*/
}

.questionnaire {
  padding: 20px;
  border-radius: 10px;
  border-color: purple;
  border-width: thin;
  background-color: #fff;
  opacity: 0.95;
}

.title {
  border-bottom: 2px solid purple;
  padding-bottom: 20px;
  margin-bottom: 10px;
}
.el-icon-arrow-down {
  font-size: 12px;
}

</style>
