<template>
  <div id="app">
    <router-view v-if="fullscreen"></router-view>
    <el-container class="container" v-else>
      <AppAside></AppAside>
      <el-container direction="vertical">
        <AppHeader></AppHeader>
        <el-main></el-main>
        <AppFooter></AppFooter>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  import { AppHeader, AppAside, AppFooter } from '@/components/Layout'

  export default {
    name: 'App',
    components: {
      AppHeader,
      AppAside,
      AppFooter
    },
    computed: {
      fullscreen () {
        return this.$route.meta.fullscreen
      }
    }
  }
</script>

<style lang="stylus" scoped>
  #app
  .container {
    width 100%
    height @width
  }

</style>
