<template>
  <div id="app">
    <PageLoading v-if="authLoading"></PageLoading>
    <template v-else>
      <router-view v-if="fullscreen"></router-view>
      <el-container class="app-container" v-else>
        <AppAside></AppAside>
        <el-container style="overflow: hidden" direction="vertical">
          <AppHeader></AppHeader>
          <el-main class="app-main" @scroll.native.stop.prevent="handleScroll">
            <Guide class="app-guide" v-if="$route.name !== 'Home'"></Guide>
            <transition name="fade" mode="out-in">
              <router-view></router-view>
            </transition>
          </el-main>
          <AppFooter></AppFooter>
        </el-container>
      </el-container>
    </template>
    <ActionButtons></ActionButtons>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { AppHeader, AppAside, AppFooter } from '@/components/Layout'
  import { PageLoading, ActionButtons, Guide } from '@/components/Common'

  export default {
    name: 'App',
    components: {
      AppHeader,
      AppAside,
      AppFooter,
      PageLoading,
      ActionButtons,
      Guide
    },
    data () {
      return {
        goToTopThreshold: 200
      }
    },
    computed: {
      ...mapGetters({
        authLoading: 'auth/loading',
        actionButtonVisible: 'app/actionButtonVisible'
      }),
      fullscreen () {
        return this.$route.meta.fullscreen
      }
    },
    methods: {
      handleScroll (e) {
        const container = e.target
        const showGoToTop = container.scrollTop > this.goToTopThreshold
        const payload = {}
        if (showGoToTop && !this.actionButtonVisible.goToTop) {
          payload.goToTop = true
        } else if (!showGoToTop && this.actionButtonVisible.goToTop) {
          payload.goToTop = false
        }
        if (Object.keys(payload).length) {
          this.$store.commit('app/SET_ACTION_BUTTON_VISIBLE', payload)
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
  #app
  .app-container {
    width 100%
    height @width
  }

  .app-main {
    position relative
    padding 24px
  }

  .app-guide {
    margin-bottom 24px
  }

</style>
