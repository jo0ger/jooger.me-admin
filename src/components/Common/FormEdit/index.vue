<template>
  <div class="form-edit">
    <slot></slot>
    <transition name="summary" appear>
      <div class="summary" v-if="canEdit">
        <div class="wrapper">
          <el-button class="btn cancel-btn" plain type="danger" v-if="showCancel" @click="handleCancel">取消</el-button>
          <el-button class="btn submit-btn" type="primary" @click="handleSubmit">提交</el-button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  export default {
    name: 'FormEdit',
    props: {
      showCancel: {
        type: Boolean,
        default: true
      },
      canEdit: {
        type: Boolean,
        default: true
      }
    },
    methods: {
      handleCancel () {
        this.$emit('cancel')
      },
      handleSubmit () {
        this.$emit('submit')
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~@/assets/stylus/vars/index'
  @import '~@/assets/stylus/mixins/index'

  .form-edit {
    .summary {
      position absolute
      right 0
      bottom 0
      left 0
      background-color $white
      box-shadow 0 0 40px -10px alpha($black, .2)
      transition all .5s $fuck

      .wrapper {
        flexLayout(, center, ,wrap)
        margin 0 auto
        padding 16px 24px

        .btn {
          flex 1 0
          max-width 300px
          height 48px
          margin 0 24px
          font-weight bold
          letter-spacing 1px
        }
      }
    }
  }

  .summary-enter
  .summary-leave-active {
    transform translateY(100%)
  }
</style>
