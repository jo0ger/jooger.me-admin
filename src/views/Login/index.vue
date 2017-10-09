<template>
  <div class="login-page">
    <div class="login-bg"></div>
    <div class="login-field">
      <div class="login-title">
        <h5 class="title">Admin  Login</h5>
        <template v-if="hasAuthCache && !changeUser">
          <img class="avatar" :src="authInfo.avatar" alt="">
          <p class="name">
            {{ authInfo.name }}
            <i class="iconfont icon-edit" title="切换用户" @click="handleChangeUser"></i>
          </p>
        </template>
      </div>
      <div class="login-form">
        <div class="form-item user" :class="{ focus: focus.name }" v-if="!hasAuthCache || changeUser">
          <i class="iconfont icon-user"></i>
          <input type="text"
            class="user-input"
            placeholder="Username"
            v-model.trim="loginModel.name"
            @keyup.enter="handleLogin"
            @focus="focus.name = true"
            @blur="focus.name = false">
          <transition name="slide-in-left-fast">
            <i class="iconfont icon-check" v-show="!!loginModel.name"></i>
          </transition>
        </div>
        <div class="form-item password" :class="{ focus: focus.password }">
          <i class="iconfont icon-password"></i>
          <input type="password"
            class="password-input"
            placeholder="Password"
            v-model.trim="loginModel.password"
            @keyup.enter="handleLogin"
            @focus="focus.password = true"
            @blur="focus.password = false">
          <transition name="slide-in-left-fast">
            <i class="iconfont icon-check" v-show="!!loginModel.password"></i>
          </transition>
        </div>
        <div class="submit">
          <div class="submit-btn" @click="handleLogin">log in</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'Login-index',
    data () {
      return {
        loginModel: {
          name: '',
          password: ''
        },
        changeUser: false,
        focus: {
          name: false,
          password: false
        }
      }
    },
    computed: {
      ...mapGetters({
        authInfo: 'auth/info',
        authLoading: 'auth/loading'
      }),
      hasAuthCache () {
        return this.authInfo && this.authInfo.name
      }
    },
    created () {
      if (this.hasAuthCache) {
        this.loginModel.name = this.authInfo.name || ''
      }
    },
    methods: {
      handleChangeUser () {
        this.loginModel.name = ''
        this.changeUser = true
      },
      async handleLogin () {
        const success = await this.$store.dispatch('auth/login', this.loginModel)
        if (success) {
          const query = this.$route.query
          this.$router.push({
            name: query.redirect_uri_name || 'Home',
            params: JSON.parse(query.redirect_params || '{}'),
            query: JSON.parse(query.redirect_query || '{}')
          })
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~@/assets/stylus/vars/index'
  @import '~@/assets/stylus/mixins/index'

  full() {
    width 100%
    height 100%
  }

  .login-page {
    full()

    .login-bg {
      full()
      background url('~@/static/image/login-bg.svg') no-repeat center center
      background-size cover
      filter blur(4px)
    }

    .login-field {
      position absolute
      top 50%
      left 50%
      transform translate(-50%, -50%)
      width 320px
      height auto
      padding 40px
      background linear-gradient(45deg, $dark 0%, #1f222e 100%)
      box-shadow 0 0 100px alpha($dark, .8)
      border-radius 4px
      transition all .3s ease

      .login-title {
        margin-bottom 24px
        text-align center

        .title, .name {
          margin-bottom 36px
          color $text-color-secondary-dark
        }
        .title {
          text-transform uppercase
        }

        .avatar {
          width 64px;
          height 64px
          margin-bottom 8px
          border-radius 50%
        }

        .name {
          margin-bottom 16px
          font-size 16px
          .iconfont {
            font-size 12px
            opacity .8
            cursor pointer
            transition opacity .3s $ease
            
            &:hover {
              opacity 1
            }
          }
        }
      }

      .login-form {
        margin 0 -40px

        .form-item {
          position relative

          & > .iconfont {
            position absolute
            top 8px
            left 36px
            color $text-color-secondary-dark
          }

          & > .iconfont:not(.icon-check) {
            opacity .5
            transition opacity .2s $ease-in
          }

          .icon-check {
            left auto
            right 30px
            color $green-6
          }

          & > input {
            width 100%
            height 42px
            line-height 40px
            color: $text-color-secondary-dark;
            margin-top -2px
            background #32364a
            padding 10px 65px
            border-top 2px solid #393d52
            border-bottom 2px solid #393d52
            border-right none
            border-left none
            outline none
            box-shadow none

            &::-webkit-input-placeholder {
              color alpha($white, .2)
            }
          }

          &.focus {
            & > .iconfont:not(.icon-check) {
              opacity 1
            }
          }
        }

        .submit {
          width 50%
          margin 24px auto
          &-btn {
            padding 10px 50px
            border-radius 50px
            color $base-color
            text-align center
            font-weight 700
            border 2px solid $base-color
            text-transform uppercase
            cursor pointer
            transition $transition-ease
            transition-duration .2s

            &:hover {
              background $base-color
              color $white
            }
          }
        }
      }
    }

  }
</style>
