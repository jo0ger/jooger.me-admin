<template>
  <el-aside class="aside" :class="{ collapse: asideCollapse }" :width="asideCollapse ? '64px' : '200px'">
    <div class="admin-field">
      <router-link class="avatar" :to="{ name: 'Auth' }">
        <img :src="avatar" :alt="authInfo.name" v-if="avatar">
        <img :src="logo" alt="" v-else>
      </router-link>
      <div class="info">
        <h3 class="name">{{ authInfo.name }}</h3>
        <p class="slogan">{{ authInfo.slogan }}</p>
      </div>
    </div>
    <div class="menu-field">
      <el-menu class="menu-list"
        :default-active="defaultActive"
        :collapse="asideCollapse"
        router>
        <template v-for="menu in appRoutesMenu">
          <el-submenu
            :key="menu.path"
            :index="menu.path"
            v-if="menu.children">
            <template slot="title">
              <i class="iconfont" :class="[`icon-${menu.meta.icon}`]"></i>
              <span slot="title">{{ menu.meta.title }}</span>
            </template>
            <el-menu-item v-for="submenu in menu.children" :key="submenu.path" :index="`${menu.path}/${submenu.path}`">
              <i class="iconfont" :class="[`icon-${submenu.meta.icon}`]"></i>
              <span slot="title">{{ submenu.meta.title }}</span>
            </el-menu-item>
          </el-submenu>
          <el-menu-item
            :key="menu.path"
            :index="menu.path"
            v-else>
            <i class="iconfont" :class="[`icon-${menu.meta.icon}`]"></i>
            <span slot="title">{{ menu.meta.title }}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </div>
  </el-aside>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { imageLoad } from '@/utils'
  import logo from '@@/static/image/logo.svg'

  export default {
    name: 'Layout-Aside',
    data () {
      return {
        logo,
        avatar: ''
      }
    },
    computed: {
      ...mapGetters({
        appRoutesMenu: 'app/routesMenu',
        asideCollapse: 'app/asideCollapse',
        authInfo: 'auth/info'
      }),
      defaultActive () {
        return this.$route.fullPath
      }
    },
    watch: {
      'authInfo.avatar' (val, oldVal) {
        this.loadAvatar(val)
      }
    },
    mounted () {
      this.loadAvatar(this.authInfo.avatar)
    },
    methods: {
      loadAvatar (url) {
        this.avatar = ''
        imageLoad(url, {
          success: () => {
            this.avatar = url
          }
        })
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~@/assets/stylus/vars/index'
  @import '~@/assets/stylus/mixins/index'

  .aside {
    flexLayout(column, flex-start, flex-start)
    background-color $white
    box-shadow 4px 4px 20px 0 alpha($black, .01)
    overflow visible
    z-index 999
    transition width .5s $fuck

    .admin-field {
      position relative
      width 100%
      padding 24px 12px
      text-align center
      overflow hidden

      .avatar {
        img {
          width 64px
          border-radius 50%
          transition all .5s $fuck
        }
      }

      .iconfont {
        font-size 48px
        color $base-color
      }

      .info {
        .name {
          font-size 20px
        }

        .slogan {
          margin-top 8px
          font-size 12px
          color $text-color-secondary
        }
      }

    }

    // .logo-field {
    //   display block
    //   height 40px
    //   line-height @height
    //   margin 24px 0
    //   text-align center

    //   .logo {
    //     width 32px
    //   }
    // }

    .menu-field {
      flex 1 0
      width 100%
      .menu-list {
        letter-spacing .5px
        border none

        .iconfont {
          margin-right 5px
          font-size 14px
        }
      }
    }

    &.collapse {
      width 64px

      .admin-field {
        padding 8px
        .avatar {
          img {
            width 32px
          }
        }
        .info {
          display none
        }
      }

      .iconfont {
        display inline-block
        width 24px
        line-height 1
        margin-right 0 !important
        text-align center
      }
    }
  }
</style>

<style lang="stylus">
  @import '~@/assets/stylus/vars/index'
  @import '~@/assets/stylus/mixins/index'

  .aside {
    .el-menu-item
    .el-submenu__title {
      &:focus
      &:hover {
        background-color unset
        color $base-color

        i {
          color $base-color
        }
      }
    }
      
    .el-menu-item {
      position relative
      height 48px
      line-height @height
      font-size $font-size-base

      &.is-active {
        background-color alpha($base-color, .1)
        font-weight bold

        &::after {
          content ''
          position absolute
          top 0
          right 0
          bottom 0
          border-right 3px solid $base-color
        }
      }
    }

    .el-submenu__title {
      height 48px
      line-height @height
      font-size $font-size-base

      .el-submenu__icon-arrow {
        color $text-color-placeholder
      }
    }
  }
</style>
