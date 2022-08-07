<template>
  <el-container class="contain">
    <el-header class="header">
      <div class="back" @click="back">
        <i class="el-icon-back"></i>
        <span style="margin-left: 10px">返回</span>
      </div>
    </el-header>
    <markdown-it-toc
      class="markdown-it-wrap"
      :content="content"
      :offset="21"
      :level="3"
    >
    </markdown-it-toc>
  </el-container>
</template>
<script>
export default {
  name: 'UserBook',
  content: '',
  data () {
    return {
      content: ''
    }
  },
  methods: {
    back () {
      this.$router.push({ path: '/home' })
    }
  },
  mounted () {
    this.content = '# 用户手册\n\n[[toc]]\n\n这个文档将会对于《摸鱼遥感平台》的使用进行详细的介绍。\n\n## 上传数据\n\n上传数据一共有两种方式, 其中第一种方式为自己上传数据。其中的位置如下图所示\n\n![](https://qnnplanet.top/static/2022-07-21-22-28-43.png)\n\n第二种上传数据的方式为使用在线地图数据, 在地图感兴趣位置使用矩形进行裁剪。 完成 之后使用点击上传后填写图片名称信息即可。\n\n\n![](https://qnnplanet.top/static/2022-07-21-22-31-09.png)\n\n\n## 选择分析数据\n\n选择分析的数据有两种方式, 第一种为直接使用 对应的图片创建对应的分析项目\n\n![](https://qnnplanet.top/static/2022-07-21-22-34-49.png)\n\n第二种方式为在项目之中点击更换图片, 从而修改需要分析的数据。\n\n![](https://qnnplanet.top/static/2022-07-21-22-36-50.png)\n\n## 项目界面介绍\n\n这里将会对于项目分析的操作界面进行一个简要的介绍\n\n![](https://qnnplanet.top/static/2022-07-21-22-38-40.png)\n\n点击"下载图片",  将会下载所显示的所有图层叠加的图片\n\n\n点击"提交任务", 将能够将所选择的分析项目提交到服务器进行分析, 并且将结果进行保存.\n\n![](https://qnnplanet.top/static/2022-07-21-22-45-38.png)\n\n最右侧的任务信息将会显示每一个任务的结果信息。点击"i"按钮, 将会展示任务的分析结果\n\n![](https://qnnplanet.top/static/2022-07-21-22-46-19.png)'
  }
}
</script>

<style scoped>
.header {
  display: flex;
  height: 50px !important;
  justify-content: space-between;
  padding-right: 0;
  align-items: center;
}
.back {
  cursor: pointer;
}
.markdown-it-wrap {
  width: 1140px;
  margin: 0 auto;
  padding-right: 165px;
  box-sizing: border-box;
}
</style>
