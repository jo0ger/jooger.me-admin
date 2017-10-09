<template>
  <div id="app">
    <PageLoading v-if="authLoading"></PageLoading>
    <template v-else>
      <router-view v-if="fullscreen"></router-view>
      <el-container class="container" v-else>
        <AppAside></AppAside>
        <el-container style="overflow: hidden" direction="vertical">
          <AppHeader></AppHeader>
          <el-main class="main">
            <router-view></router-view>
          </el-main>
          <AppFooter></AppFooter>
        </el-container>
      </el-container>
    </template>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { AppHeader, AppAside, AppFooter } from '@/components/Layout'
  import { PageLoading } from '@/components/Common'

  export default {
    name: 'App',
    components: {
      AppHeader,
      AppAside,
      AppFooter,
      PageLoading
    },
    computed: {
      ...mapGetters({
        authLoading: 'auth/loading'
      }),
      fullscreen () {
        return this.$route.meta.fullscreen
      }
    },
    created () {
      this.$store.dispatch('auth/getInfo')
    }
  }
</script>

<style lang="stylus" scoped>
  #app
  .container {
    width 100%
    height @width
  }

  .main {
    padding 24px
  }

</style>
