<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ name: 'Home' }">
      <i class="iconfont icon-home"></i>
      <span class="title">首页</span>
    </el-breadcrumb-item>
    <el-breadcrumb-item v-for="(item, index) in guideList"
      :key="index">
      <i class="iconfont" :class="'icon-' + item.icon"></i>
      <span class="title">{{ item.title }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'Guide',
    data () {
      return {}
    },
    computed: {
      ...mapGetters({
        appRoutesMenu: 'app/routesMenu'
      }),
      guideList () {
        return this.$route.matched
          .map(item => item && item.name !== 'Home' ? item.meta : null)
          .filter(item => !!item)
      }
    }
  }
</script>

<style lang="stylus" scoped>

</style>
