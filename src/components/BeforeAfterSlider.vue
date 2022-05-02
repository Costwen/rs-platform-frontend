<template>
  <div class="container">
    <div class="slider-wrap">
      <div class="before-img">
        <img src="../assets/before.jpg" alt="">
      </div>
      <img src="../assets/after.jpg" alt="">
      <span class="handler"></span>
    </div>
  </div>
</template>

<script>

export default {
  name: 'BeforeAfterSlider',
  data () {
    return {
      slider: '',
      beforeImg: '',
      handler: '',
      marginX: ''
    }
  },
  mounted () {
    const that = this
    this.slider = document.querySelector('.slider-wrap') // 整个滑动区域
    this.beforeImg = document.querySelector('.before-img') // 左边图片外框
    this.handler = document.querySelector('.handler') // 滑动条
    this.handler.onmousedown = function (e) {
      console.log(that.handler.offsetLeft)
      that.marginX = e.pageX - that.handler.offsetLeft // 计算鼠标相对于滑动条的距离
      // envent.pageX : 点击时鼠标相对浏览器边框的 X 距离；
      // elenment.offsetLeft : 元素 left 属性值。
      // 此时，内框absolute，外框relative，所以 left 是相对外框的距离；
      that.slider.addEventListener('mousemove', that.moveHandler)
    }
    this.handler.onmouseup = function (e) {
      that.slider.removeEventListener('mousemove', that.moveHandler)
    }
  },
  methods: {
    moveHandler (e) {
      this.handler.style.left = e.pageX - this.marginX + 'px'
      this.beforeImg.style.width = e.pageX - this.marginX + 'px'
      // 此时 e.pageX 是鼠标滑动时据浏览器左边的距离，减去外部距离，
      // 即得到此时鼠标相对于图片区域的 X 坐标；
      // 让滑动条的 left 和左边图片宽度 都等于坐标，即可以达到跟随效果；
    }
  }
}
</script>

<style>
.container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.slider-wrap {
  position: relative;
}
.slider-wrap img {
  display: block;
  width: 1080px;
  user-select: none;
  /* 取消图片被选中 */
}
.slider-wrap .before-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 50%;
  overflow: hidden;
}
.slider-wrap .handler {
  display: block;
  width: 5px;
  height: 100%;
  background-color: rgba(0, 0, 0, .3);
  position: absolute;
  left: 50%;
  top: 0;
  transform: translateX(-50%);
  cursor: ew-resize;
  /* cursor: ew-resize; 鼠标样式，左右滑动 */
}
.slider-wrap .handler::after {
  width: 64px;
  height: 64px;
  background-color: rgba(0, 0, 0, .5);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  content: '\2b0c';
  color: white;
  font-size: 50px;
  text-align: center;
  line-height: 64px;
  border-radius: 50%;
  box-shadow: 0 2px 6px #000;
  transition: all .3s ease;
}
.slider-wrap .handler:hover::after {
  width: 40px;
  height: 40px;
  font-size: 30px;
  line-height: 40px;
}

</style>
