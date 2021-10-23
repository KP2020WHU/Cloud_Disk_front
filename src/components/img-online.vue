<template>
  <div class="img-pre-box" @click="imgClose('close')">
    <!-- <pic-zoom :url="imgUrl"></pic-zoom> -->
    <!-- <img class="u-img-pre" :src="imgUrl" alt="图片资料"> -->
    <h3 class="video-player-h3">
      <i
        class="el-icon-circle-close video-player-icon"
        @click="imgClose('close')"
      ></i>
    </h3>
    <el-image :src="imgUrl" class="u-img-pre" fit="scale-down"></el-image>
  </div>
</template>

<script>
export default {
  props: {
    url: {
      type: String,
    },
  },
  mounted() {
    // 绑定键盘事件
    window.addEventListener("keyup", this.imgClose, false);
  },
  data() {
    return {
      fit: "contain",
    };
  },
  methods: {
    imgClose(e) {
      if (e == "close") {
        this.$emit("closeImg");
        return;
      }

      if (e.keyCode === 27) {
        this.$emit("closeImg");
      }
    },
  },
  computed: {
    imgUrl() {
      return this.url;
    },
  },
  beforeDestroy() {
    // 卸载键盘事件
    window.removeEventListener("keyup", this.imgClose, false);
  },
};
</script>

<style lang="scss" scoped>
.img-pre-box {
  position: relative;
  //   top: 5%;
  //   left: 10%;
  max-width: 80%;
  height: 90%;
  z-index: 99;
  background-color: #fff;
  text-align: center;

  > .u-img-pre {
    width: 100%;
    height: 100%;
  }
}
</style>


