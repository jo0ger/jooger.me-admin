<template>
  <div class="action-buttons">
    <transition-group name="action-list" tag="div" class="list">
      <a v-for="action in activeActionMap"
        :key="action.key"
        class="action" :class="[action.key]"
        :title="action.title"
        @click.prevent.stop="handleTriggerAction(action.key)">
        <i class="iconfont" :class="['icon-' + action.icon]"></i>
      </a>
    </transition-group>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { scrollTo, easing } from '@/utils'

  export default {
    name: 'ActionButtons',
    data () {
      const actionMap = [
        { key: 'create', title: '新建', icon: 'plus' },
        { key: 'go-to-top', title: '返回顶部', icon: 'go-to-top' }
      ]
      return {
        actionMap
      }
    },
    computed: {
      ...mapGetters({
        actionButtonVisible: 'app/actionButtonVisible'
      }),
      activeActionMap () {
        const { goToTop, create } = this.actionButtonVisible
        return this.actionMap.filter(item => {
          if (item.key === 'go-to-top' && !goToTop) {
            return false
          } else if (item.key === 'create' && !create) {
            return false
          }
          return true
        })
      }
    },
    methods: {
      handleTriggerAction (key) {
        switch (key) {
          case 'create':
            const pageName = this.$route.name
            if (pageName.includes('Article')) {
              this.$router.push({ name: 'Blog-ArticleCreate' })
            }
            break
          case 'go-to-top':
            scrollTo(0, 500, { easing: easing['fuck'] })
            break
          default:
            break
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~@/assets/stylus/vars/index'
  @import '~@/assets/stylus/mixins/index'

  .action-buttons {
    .list {
      position fixed
      right 30px
      bottom 70px
      z-index 999

      .action {
        position relative
        display block
        width 42px
        height @width
        line-height @width
        margin-top 10px
        text-align center
        background $white
        border-radius 4px
        color $text-color-secondary
        box-shadow 4px 4px 20px 0 alpha($black, .1)
        opacity .8
        transition all .3s $ease

        .iconfont {
          font-size 20px
        }

        &:hover {
          opacity 1
          transform translate3d(0, 0, 0) scale(.9)
        }

        &.create {
          color $white
          background-color $base-color
          box-shadow 4px 4px 20px 0 alpha($base-color, .8)
        }
      }
    }
  }

  .action-list-enter, .action-list-leave-to {
    opacity 0
    transform translateX(200%)
  }
  .action-list-leave-active {
    position absolute
  }

</style>
