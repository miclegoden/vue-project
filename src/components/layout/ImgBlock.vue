<template>
<img class="img-fluid" v-show="isImageLoaded" :src="getImgUrl(img)" @load="loaded">
<img v-if="!isImageLoaded" class="loading w-100" :src="'/images/loader.gif'">
</template>

<script>
import ApiService from "@/services";
export default {
  name: "ImgBlock",
  props:['img'],
  data() {
    return {
      isImageLoaded: false,
    };
  },
  methods: {
    loaded() {
      this.isImageLoaded = true;
    },
    getImgUrl(imgHash){
      return ApiService.getImgUrl(imgHash);
    },
  },
};
</script>