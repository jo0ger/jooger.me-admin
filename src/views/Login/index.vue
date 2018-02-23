<template>
  <div class="login-page">
    <div class="login-bg">
      <div id="particles-background" class="particles-background"></div>
    </div>
    <div class="login-field">
      <div class="login-title">
        <h5 class="title">
          <i class="iconfont icon-logo logo"></i>
        </h5>
        <template v-if="hasAuthCache && !changeUser">
          <img class="avatar" :src="avatar" alt="" v-if="avatar">
          <i class="iconfont icon-avatar" v-else></i>
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
  import { imageLoad } from '@/utils'
  import 'particles.js'

  export default {
    name: 'Login-index',
    data () {
      return {
        avatar: '',
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
    mounted () {
      this.genBackground()
      imageLoad(this.authInfo.avatar, {
        success: () => {
          this.avatar = this.authInfo.avatar
        }
      })
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
      },
      genBackground () {
        particlesJS('particles-background', {
          'particles': {
            'number': {
              'value': 30,
              'density': {
                'enable': true,
                'value_area': 1000
              }
            },
            'color': {
              'value': '#bfbfbf'
            },
            'shape': {
              'type': 'circle',
              'stroke': {
                'width': 0,
                'color': '#ffffff'
              },
              'polygon': {
                'nb_sides': 10
              },
              'image': {
                'src': 'img/github.svg',
                'width': 100,
                'height': 100
              }
            },
            'opacity': {
              'value': 0.5,
              'random': false,
              'anim': {
                'enable': true,
                'speed': 0.8,
                'opacity_min': 0.3,
                'sync': false
              }
            },
            'size': {
              'value': 15,
              'random': true,
              'anim': {
                'enable': false,
                'speed': 40,
                'size_min': 0.1,
                'sync': false
              }
            },
            'line_linked': {
              'enable': true,
              'distance': 300,
              'color': '#c5c5c5',
              'opacity': 0.4,
              'width': 1
            },
            'move': {
              'enable': true,
              'speed': 2,
              'direction': 'none',
              'random': true,
              'straight': false,
              'out_mode': 'out',
              'bounce': false,
              'attract': {
                'enable': false,
                'rotateX': 600,
                'rotateY': 1200
              }
            }
          },
          'interactivity': {
            'detect_on': 'canvas',
            'events': {
              'onhover': {
                'enable': false,
                'mode': 'repulse'
              },
              'onclick': {
                'enable': false,
                'mode': 'push'
              },
              'resize': true
            },
            'modes': {
              'grab': {
                'distance': 400,
                'line_linked': {
                  'opacity': 1
                }
              },
              'bubble': {
                'distance': 400,
                'size': 40,
                'duration': 2,
                'opacity': 0.8471528471528471,
                'speed': 3
              },
              'repulse': {
                'distance': 200,
                'duration': 0.4
              },
              'push': {
                'particles_nb': 4
              },
              'remove': {
                'particles_nb': 2
              }
            }
          },
          'retina_detect': true
        })
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~@/assets/stylus/vars/index'
  @import '~@/assets/stylus/mixins/index'

  $dark = #272c41
  $dark-secondary = #1f222e
  $text-color-dark = alpha($white, .67)

  full() {
    width 100%
    height @width
  }

  .login-page {
    full()

    .login-bg {
      position fixed
      top 0
      right 0
      bottom 0
      left 0
      full()
      // background url('~@@/static/image/login-bg.svg') center center
      // background-color $white
      // filter blur(2px)

      .particles-background {
        full()
      }
    }

    .login-field {
      position absolute
      top 50%
      left 50%
      transform translate(-50%, -50%)
      width 320px
      height auto
      padding 40px
      background linear-gradient(45deg, $dark 0%, $dark-secondary 100%)
      box-shadow 0 0 100px $dark
      border-radius 4px
      transition all .3s ease

      .login-title {
        margin-bottom 24px
        text-align center

        .title {
          color $base-color
          text-transform uppercase
          .logo {
            font-size 48px
            text-shadow 0 0 40px $base-color
          }
        }

        .name {
          color $text-color-secondary
        }

        .avatar {
          width 72px;
          height 72px
          margin-bottom 8px
          border-radius 50%
          border 4px solid alpha($white, .2)
        }

        .icon-avatar {
          font-size 72px
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
            color $text-color-dark
          }

          & > .iconfont:not(.icon-check) {
            opacity .5
            transition opacity .2s $ease-in
          }

          .icon-check {
            left auto
            right 30px
            color $green
          }

          & > input {
            width 100%
            height 42px
            line-height 40px
            color: $text-color-dark;
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
