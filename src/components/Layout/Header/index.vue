<template>
  <el-header height="48px" class="header">
    <a class="collapse" @click="handleToggleCollapseMenu">
      <i class="iconfont" :class="[`icon-${asideCollapse ? 'unfold' : 'fold'}`]"></i>
    </a>
    <div class="action">
      <router-link to="/" class="action-item message">
        <el-badge is-dot>
          <i class="iconfont icon-message"></i>
        </el-badge>
      </router-link>
      <el-menu class="user" mode="horizontal" @select="handleMenuSelect">
        <el-submenu index="submenu">
          <template slot="title">
            <i class="iconfont icon-user"></i>
            <span>{{ authInfo.name }}</span>
          </template>
          <el-menu-item index="info">
            <i class="iconfont icon-user-info"></i>
            <span>个人信息</span>
          </el-menu-item>
          <el-menu-item index="logout">
            <i class="iconfont icon-logout"></i>
            <span>退出</span>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </div>
  </el-header>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'Layout-Header',
    data () {
      return {}
    },
    computed: {
      ...mapGetters({
        asideCollapse: 'app/asideCollapse',
        authInfo: 'auth/info'
      })
    },
    methods: {
      handleToggleCollapseMenu () {
        this.$store.commit('app/SET_ASIDE_COLLAPSE', !this.asideCollapse)
      },
      async handleMenuSelect (index) {
        switch (index) {
          case 'info':
            this.$router.push({ name: 'Auth' })
            break
          case 'logout':
            await this.$store.dispatch('auth/logout')
            this.$router.push({ name: 'Login' })
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

  .header {
    flexLayout(,space-between)
    padding-left 0
    background-color $white
    box-shadow 4px 4px 40px 0 alpha($black, .05)
    border-bottom 1px solid $border-color-4

    .collapse {
      display inline-block
      width 48px
      height @width
      line-height @height
      text-align center
      color $text-color-secondary
      &:hover {
        color $base-color
        background-color alpha($base-color, .1)
      }
    }

    .action {
      flexLayout()

      &-item {
        display inline-block
        width 48px
        height @width
        line-height @height
        text-align center

        & > div {
          line-height 1
        }

        &:hover {
          color $base-color
          background-color alpha($base-color, .1)
        }
      }
    }

  }

</style>

<style lang="stylus">
  @import '~@/assets/stylus/vars/index'
  @import '~@/assets/stylus/mixins/index'

  .header {
    .user {
      .el-menu-item
      .el-submenu__title {
        font-size $font-size-base
        i {
          font-size 12px
        }
      }

      .el-submenu__title {
        height 48px
        line-height @height
      }

      .el-submenu {
        .el-menu {
          top 53px

          .el-menu-item {
            min-width auto
            width 100px

            .iconfont {
              margin-right 5px
            }
          }
        }
      }
    }
  }
</style>
