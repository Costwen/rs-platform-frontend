<template>
  <div>
    <BeforeAfterSlider>
    </BeforeAfterSlider>

    <!-- <img :src="url" alt="" > -->

    <UploadPics></UploadPics>
  </div>
</template>

<script>

import BeforeAfterSlider from '../components/BeforeAfterSlider.vue'
import UploadPics from '../components/UploadPics.vue'

export default {
  name: 'About',
  components: {
    BeforeAfterSlider,
    UploadPics
  },
  data () {
    return {
      // url: require('../assets/before.jpg')
    }
  },
  mounted () {

  },
  methods: {

  }

}
</script>

<style>

</style>
