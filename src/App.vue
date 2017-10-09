<template>
  <div id="app">
    <router-view v-if="fullscreen"></router-view>
    <el-container class="container" v-else>
      <el-header></el-header>
      <el-container>
        <el-aside width="200px"></el-aside>
        <el-container>
          <el-main></el-main>
          <el-footer></el-footer>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  // import { AppHeader, AppSider, AppContainer } from '@/components/Layout'

  export default {
    name: 'App',
    // components: {
    //   AppHeader,
    //   AppSider,
    //   AppContainer
    // },
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
