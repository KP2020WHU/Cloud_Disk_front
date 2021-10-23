<template>
  <div id="app">
    <div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: "app",
  // App 组件调用的子组件（在template中以相应组件名标签的形式构成页面）
};
</script>

<style>
#app {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  position: absolute;
}
</style>
