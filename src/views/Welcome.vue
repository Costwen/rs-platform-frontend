<template>
  <div>
      <div class="header">
        <div class="left">
            <img src="../assets/logo3.png" class="logo" @click="toHome"/>
        </div>
          <div class="right">
              <span class="item" @click="toLogin">现在开始</span>
              <span class="item" @click="toDown">平台简介</span>
          </div>
      </div>
  <div>

      <v-carousel
        cycle
        height="400px"
        hide-delimiter-background
        show-arrows-on-hover
      >
        <v-carousel-item
          v-for="(item, i) in items"
          :key="i"
          :src="item.src"
          class="fill-height"
        >
          <v-row justify="center">
            <h2>{{ item.title }}</h2>
          </v-row>
          <v-row justify="center">
            <h3>{{ item.subtitle }}</h3>
          </v-row>
          <v-row justify="center">
            <img :src="item.img"/>
          </v-row>
        </v-carousel-item>
      </v-carousel>
      <h1 class="title"> 🦈🐬🐳🐋🐟🐠🐡 </h1>
      <p class="subContent" style="max-width: 568px;">
        <strong>摸鱼遥感平台</strong> 拥有简洁轻量的界面，算法高效。
        目前向所有用户免费开放，志在做一款用户喜爱的在线遥感服务平台✊
      </p>
      <v-container style="margin-bottom: 40px">
        <v-row justify="center">
          <v-col cols="auto">
            <v-btn
              elevation="4"
              :min-width="btnWidth"
              color="primary"
              @click="$router.push({path: '/home'})"
              depressed
              x-large
            >
              <v-icon left>
                mdi-speedometer
              </v-icon>
              开始使用吧
            </v-btn>
          </v-col>
          <v-col cols="auto">
            <v-btn
              elevation="4"
              :min-width="btnWidth"
              color="primary"
              href="https://zhuanlan.zhihu.com/p/338360442"
              target="_blank"
              outlined
              x-large
            >
              <v-icon left>
                mdi-fish
              </v-icon>
              为什么选择摸鱼
            </v-btn>
          </v-col>
          <v-col cols="auto">
            <v-btn
              elevation="4"
              :min-width="btnWidth"
              color="#212121"
              dark
              depressed
              href="https://github.com"
              rel="noopener"
              target="_blank"
              x-large
            >
              <v-icon left>
                mdi-github
              </v-icon>
              GitHub
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
      <v-divider style="width: 50%; margin: 0 auto"></v-divider>
      <p id="content" class="subContent" style="max-width: 568px; margin-top: 40px">
        项目团队精心实现了多种不同类型的功能以适应不同场合需求。 做到创建分析历史一条龙 — 查看👀相应的类型介绍👇，以便更好地做出选择。
      </p>

      <div  class="all_block" style="background-color: #fdfbfb">
        <div class="block"  style="border-right: 1px solid #eff2f6;">
          <img src="https://img.alicdn.com/imgextra/i2/O1CN01yUuD2623wbuKi994q_!!6000000007320-55-tps-48-48.svg"
               width="200px"
               height="200px"
               class="img"
          />
          <div style="margin-left: 20%; display: inline-block">
            <p class="sub" style="font-size: 2rem; font-weight: 400">
              目标提取<br/>
            </p>
            <p class="sub">使用图像分割技术对卫星图像中指定对象完成分割</p>
          </div>
        </div>
        <div class="block">
          <img src="https://img.alicdn.com/imgextra/i4/O1CN01KsWWBg1CT8mkcfYg1_!!6000000000081-55-tps-48-48.svg"
               width="200px"
               height="200px"
               class="img"
          />
          <div style="margin-left: 20%; display: inline-block">
            <p class="sub" style="font-size: 2rem; font-weight: 400">
              变化检测<br/>
            </p>
            <p class="sub">使用图像分割技术对同区域两个时期的卫星图像变化情况完成分析</p>
          </div>
        </div>
      </div>

      <div class="all_block">
        <div class="block"  style="border-right: 1px solid #eff2f6;">
          <img src="https://img.alicdn.com/imgextra/i3/O1CN01h1WOBX1Fif3YcjbVS_!!6000000000521-55-tps-48-48.svg"
               width="200px"
               height="200px"
               class="img"
          />
          <div style="margin-left: 20%; display: inline-block">
            <p class="sub" style="font-size: 2rem; font-weight: 400">
              目标检测<br/>
            </p>
            <p class="sub">使用目标检测技术对卫星图像中指定对象完成检测</p>
          </div>
        </div>
        <div class="block">
          <img src="https://img.alicdn.com/imgextra/i3/O1CN01TOtzDB1LIS5R21sx2_!!6000000001276-55-tps-48-48.svg"
               width="200px"
               height="200px"
               class="img"
          />
          <div style="margin-left: 20%; display: inline-block">
            <p class="sub" style="font-size: 2rem; font-weight: 400">
              地物分类<br/>
            </p>
            <p class="sub">使用图像分割技术对卫星图像每个像素完成分类</p>
          </div>
        </div>
      </div>
      <v-footer padless>
        <v-col
          class="text-center"
          cols="12"
        >
          {{ new Date().getFullYear() }} — <strong>Fishing Remote Sensing</strong>
        </v-col>
      </v-footer>
  </div>
</div>
</template>

<script>
const createData = () => ({
  threshold: 0,
  headerClass: 'vue-fixed-header',
  fixedClass: 'vue-fixed-header--isFixed',
  hideScrollUp: false
})
export default {

  name: 'Welcome',
  data () {
    return {
      fixedStatus: {
        headerIsFixed: false
      },
      propsData: { ...createData() },
      formData: { ...createData() },
      show: false,
      expand: false,
      btnWidth: 228,
      items: [
        {
          src: require('@/assets/earth1.png'),
          title: '简约好用的遥感系统',
          subtitle: '简约好用，轻松开启在线调试',
          img: 'https://wj.qq.com/image/index_slider_p1.png?v=@version'
        },
        {
          src: require('@/assets/city.jpg'),
          title: '数据实时统计在线分析',
          subtitle: '数据实时在线统计，图表化展示，清晰直观',
          img: 'https://wj.qq.com/image/index_slider_p2.png?v=@version'
        }
      ]

    }
  },
  methods: {
    updateFixedStatus (next) {
      this.fixedStatus.headerIsFixed = next
    },
    toHome () {
      this.$router.push('/')
    },
    toLogin () {
      this.$router.push({ path: '/home' })
    },
    toDown () {
      console.log('toDown')
      var el = document.getElementById('content')
      this.$nextTick(
        () => {
          el.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          })
        }
      )
    }
  }
}
</script>

<style scoped>
.header{
  margin-top: 5px;
  background-color: transparent;
  height: 50px !important;
  justify-content: space-between;
  display: flex;
  position: fixed;
  z-index: 5;
  width: 100%;
}
.item{
  margin-right: 40px;
  vertical-align: -webkit-baseline-middle;
  cursor: pointer;
}
.logo{
  margin-right: 20px;
  cursor: pointer;
}
.left{
  margin-left: 20px;
  display: flex;
}
.right{
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  font-family: Arial, Helvetica, sans-serif;
}
nav {
  display: flex;
  width: 100vw;
  margin: 0;
  padding: 0;
  background: #fff;
  border-bottom: solid 1px #e5e5e5;
}
nav.vue-fixed-header--isFixed {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
}
.navbar.vue-fixed-header--isFixed {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
}
.all_block{
  padding: 40px 0;
}
.block{
  display: inline-block;
  /*vertical-align: center;*/
  text-align: center;
  width: 50%;
  margin: 0 auto;
  box-sizing: border-box;
}
.sub{
  font-family: Roboto,sans-serif;
  line-height: 1.5;
  /*text-align: center!important;*/
  font-size: 1.25rem;
  font-weight: 300;
  /*margin-bottom: 40px;*/
  /*margin-right: auto;*/
  /*margin-left: auto;*/
  max-width: 200px;
}
.img{
  vertical-align: bottom;
}
h2{
  color: #fff;
  padding-top: 50px;
  margin-top: 0;
  font-weight: normal;
  font-size: 50px;
  margin-bottom: 0;
}
h3{
  margin-top: -3px;
  font-size: 20px;
  color: #fff;
  font-weight: normal;
  margin-bottom: 10px
}
.title{
  text-align: center ;
  position: relative;
  margin-bottom: 40px;
  margin-top: 40px;
  font-size: 3rem!important;
  line-height: 3.125rem;
  letter-spacing: normal;
  font-weight: 400;
  font-family: Roboto,sans-serif!important;
}
.subContent{
  font-family: Roboto,sans-serif;
  line-height: 1.5;
  text-align: center!important;
  font-size: 1.25rem;
  font-weight: 300;
  margin-bottom: 40px;
  margin-right: auto;
  margin-left: auto;
  max-width: 568px;
}
</style>
