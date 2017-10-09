<template>
  <div id="app" style="width: 100%; height: 100%;">
    <router-view v-if="fullscreen"></router-view>
    <!-- <template v-else>
      <AppHeader></AppHeader>
      <AppSider></AppSider>
      <AppContainer>
        <router-view></router-view>
      </AppContainer>
    </template> -->
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
