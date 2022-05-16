<template>
  <div class="el-main" >
    <div class="questionnaire" direction="vertical">
      <div>
        <v-app style="width: 10%;float: right">
          <v-btn
            class="white-space"
            color="primary"
            depressed
            elevation="2"
            @click="back()"
          ><v-icon small>mdi-arrow-left</v-icon>    返回</v-btn>
        </v-app>
        <h2 class="title" style="min-width: 800px; text-align: left">创建项目</h2>
        <v-app>
          <v-container style="margin: 40px auto">
            <v-row justify="center">
              <template v-for="(item, index) in type">
                <v-col cols="auto" :key="index">
                  <v-card
                    class="mx-auto"
                    min-width="200px"
                  >
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
                        @click="Create(item)"
                      >
                        create
                      </v-btn>
                      <v-spacer></v-spacer>
<!--                      <v-btn-->
<!--                        icon-->
<!--                        @click="item.show = !item.show"-->
<!--                      >-->
<!--                        <v-icon>{{ item.show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>-->
<!--                      </v-btn>-->
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
                </v-col>
                <!--            <v-responsive-->
                <!--                v-if="index === 2"-->
                <!--                :key="`width-${index}`"-->
                <!--                width="100%"-->
                <!--            ></v-responsive>-->
              </template>
            </v-row>
          </v-container>
        </v-app>
      </div>
    </div>
  </div>
</template>

<script>
// import axios from 'axios'
// import authorization from '../utils/authorization'
// import { Base64 } from 'js-base64'
// import Header from '@/components/Header'
export default {
  data () {
    return {
      type: [
        {
          src: 'https://img.alicdn.com/imgextra/i2/O1CN01yUuD2623wbuKi994q_!!6000000007320-55-tps-48-48.svg',
          title: '目标提取',
          subtitle: '点击 CREATE 创建',
          type: 'normal',
          show: false,
          content: '最基础的问卷类型，包含单选、多选、填空及评分题型。简约好用是我们的初衷，能够满足大部分问卷的需求'
        },
        {
          src: 'https://img.alicdn.com/imgextra/i4/O1CN01KsWWBg1CT8mkcfYg1_!!6000000000081-55-tps-48-48.svg',
          title: '变化检测',
          subtitle: '点击 CREATE 创建',
          type: 'vote',
          show: false,
          content: '无需人工计票，实时更新和展示选项对应的票数和结果'
        },
        {
          src: 'https://img.alicdn.com/imgextra/i3/O1CN01h1WOBX1Fif3YcjbVS_!!6000000000521-55-tps-48-48.svg',
          title: '目标检测',
          subtitle: '点击 CREATE 创建',
          type: 'signup',
          show: false,
          content: '对问卷和问题选项进行限额，踊跃报名活动，机会先到先得'
        },
        {
          src: 'https://img.alicdn.com/imgextra/i3/O1CN01TOtzDB1LIS5R21sx2_!!6000000001276-55-tps-48-48.svg',
          title: '地物分类',
          subtitle: '点击 CREATE 创建',
          type: 'exam',
          show: false,
          content: '“考试开始，请考生开始答题”，系统自动评分，答案解析一键生成\n' +
            '\n'
        }
      ]
    }
  },
  methods: {
    back () {
      this.$router.push({ path: '/home' })
    },
    Create (item) {
      this.$router.push({ path: '/project' })
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
.mx-auto{
  padding-top: 20px;
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

<style>
.v-application--wrap {
  min-height: 0 !important;
}
</style>
