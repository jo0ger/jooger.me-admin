<template>
  <transition name="fade" mode="out-in">
    <router-view></router-view>
  </transition>
</template>

<script>
  export default {
    name: 'Blog',
    created () {
      this.$store.dispatch('category/fetchList')
      this.$store.dispatch('tag/fetchList')
    }
  }
</script>
