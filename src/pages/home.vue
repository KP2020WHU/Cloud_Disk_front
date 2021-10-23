<template>
  <el-container
    style="
      height: 100%;
      width: 100%;
      border: 1px solid #eee;
      position: absolute;
    "
  >
    <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
      <el-menu
        default-active="disk"
        class="el-menu-vertical-demo"
        @select="handleSelect"
      >
        <el-menu-item index="disk">
          <i class="el-icon-menu"></i>
          <span slot="title">云盘主页</span>
        </el-menu-item>
        <el-menu-item index="info">
          <i class="el-icon-document"></i>
          <span slot="title">云盘信息</span>
        </el-menu-item>
        <el-menu-item index="user">
          <i class="el-icon-setting"></i>
          <span slot="title">云盘设置</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header style="text-align: right; font-size: 12px">
        <el-dropdown>
          <i class="el-icon-setting" style="margin-right: 15px"></i>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>查看</el-dropdown-item>
            <el-dropdown-item>新增</el-dropdown-item>
            <el-dropdown-item>删除</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <span>{{ UserName }}</span>
        <el-avatar
          :size="40"
          :src="circle_url"
          style="margin-top: 10px"
        ></el-avatar>
      </el-header>

      <el-main style="padding: 0">
        <router-view padding="0"></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import disk from "@/pages/disk"; // 导入文件管理器
export default {
  name: "home",
  components: {
    disk,
  },
  props: {
    userId: {
      type: String,
      default: "Anonymous User",
    },
  },
  data() {
    const item = {
      date: "2016-05-02",
      name: "王小虎",
      address: "上海市普陀区金沙江路 1518 弄",
    };
    return {
      circle_url:
        "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
    };
  },
  methods: {
    handleSelect(index, indexPath) {
      console.log(index, indexPath);
      this.$router.push("/" + index);
    },
  },
  computed: {
    UserName() {
      return localStorage.getItem("userId");
    },
  },
};
</script>

<style lang="scss" scoped>
.el-header {
  background-color: rgb(64, 158, 255);
  color: rgb(51, 51, 51);
  line-height: 60px;
}

.el-aside {
  color: #333;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  height: 100%;
}
</style>
