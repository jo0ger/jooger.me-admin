<template>
  <router-view></router-view>
</template>

<script>
  export default {
    name: 'Blog',
    created () {
      this.$store.dispatch('tag/fetchList')
    }
  }
</script>
