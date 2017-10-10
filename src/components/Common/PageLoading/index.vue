<template>
  <div class="page-loading">
    <div class="wrapper">
      <div class="spinner"></div>
      <div class="text">Loading</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'PageLoading'
  }
</script>

<style lang="stylus" scoped>
  @import '~@/assets/stylus/vars/index'
  @import '~@/assets/stylus/mixins/index'

  .page-loading {
    flexLayout()
    position fixed
    top 0
    right 0
    bottom 0
    left 0
    opacity 1
    z-index 9999
    background-color $white

    .wrapper {
      flexLayout(column, space-around)
      width 100px
      height @width
      text-transform uppercase

      .spinner {
        width 48px
        height @width
        margin 0 auto
        border 1px solid alpha($black, .08)
        border-left-color $base-color
        border-radius 50%
        animation loading .6s infinite linear
      }

    }

  }

  @keyframes loading {
    0% {
      transform rotate(0deg)
    }

    100% {
      transform rotate(1turn)
    }
  }

</style>
