<template>
  <div class="markdown-editor" :class="classes">
    <div class="command" v-if="commands.length">
      <a class="command-item" :class="[`command-item-${item.key}`]"
        v-for="item in commands"
        :key="item.key"
        :title="item.title"
        @click.prevent="handleCommandClick(item)">
        <i class="iconfont" :class="[`icon-${item.key}`]"></i>
        <span v-if="item.text">{{ item.text }}</span>
      </a>
    </div>
    <div class="content" :style="contentStyle">
      <div class="edit-pane">
        <textarea class="edit-area" :value="value" ref="input" @input="handleValueChange"></textarea>
      </div>
      <transition name="fade">
        <div class="preview-pane md-body" v-html="previewContent" v-show="previewMode"></div>
      </transition>
    </div>
  </div>
</template>

<script>
  import commands from './lib/commands'
  import { getSelection, setSelection } from './lib/selectionHelper'
  import { debounce, marked } from '@/utils'

  export default {
    name: 'MarkdownEditor',
    props: {
      height: { type: [Number, String], default: 650 },
      value: { type: String, requierd: true },
      commands: {
        type: Array,
        default () {
          return commands.getDefaultCommands()
        }
      },
      mini: { type: Boolean, default: false }
    },
    data () {
      return {
        fullscreenMode: false,
        previewMode: false,
        previewContent: ''
      }
    },
    computed: {
      classes () {
        return {
          'mini-mode': this.mini,
          'fullscreen-mode': this.fullscreenMode,
          'preview-mode': this.previewMode
        }
      },
      contentStyle () {
        return {
          height: this.height + 'px'
        }
      }
    },
    watch: {
      value () {
        this._setPreviewContent()
      }
    },
    created () {
      this._setPreviewContent = this.getPreviewContentDebounceFn()
    },
    mounted () {
      this._setPreviewContent()
    },
    methods: {
      getPreviewContentDebounceFn () {
        if (this._setPreviewContent) {
          return this._setPreviewContent
        }
        return debounce((content = this.value) => {
          if (this.previewMode) {
            if (content !== this._value) {
              this._value = content
              this.previewContent = content ? marked(content) : ''
            }
          }
        }, 500)
      },
      handleCommandClick (cmd) {
        switch (cmd.key) {
          // case 'grow':
          //   this.fullscreenMode = true
          //   break
          // case 'shrink':
          //   this.fullscreenMode = false
          //   break
          case 'preview':
            this.previewMode = !this.previewMode
            this.$nextTick(() => {
              this._setPreviewContent()
              if (!this.previewMode) {
                this.$refs.input.focus()
              }
            })
            break
          default:
            if (this.previewMode) {
              return
            }
            this.executeCommand(cmd)
            break
        }
      },
      handleValueChange (e) {
        this.$emit('change', e.target.value)
      },
      executeCommand (cmd) {
        const $input = this.$refs.input
        const newValue = cmd.execute ? cmd.execute(this.value, getSelection($input)) : null
        if (!newValue) return
        $input.focus()
        setSelection($input, 0, $input.value.length)
        document.execCommand('insertText', false, newValue.text)
        setSelection($input, newValue.selection[0], newValue.selection[1])
      }
    },
    beforeDestroy () {
      this._setPreviewContent = null
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~@/assets/stylus/vars/index'
  @import '~@/assets/stylus/mixins/index'

  .markdown-editor {
    position relative
    background-color $white
    .command {
      color $base-color
      border-bottom 1px solid $border-color-4
      &-item {
        display inline-block
        width 48px
        height @width
        line-height @height
        text-align center

        .iconfont {
          display inline-block
          transition all .3s $ease
        }

        &:hover {
          .iconfont {
            transform scale(1.2)
          }
        }
      }
    }

    .content {
      position relative
      .edit-pane
      .preview-pane {
        position absolute
        width 100%
        height @width
      }

      .edit-pane {
        .edit-area {
          width 100%
          height @width
          padding 16px
          border none
          outline none
          font-size 14px
        }
      }

      .preview-pane {
        padding 16px
        overflow-y auto
        background $white
      }
    }

    &.preview-mode {
      .command-item {
        &:hover {
          .iconfont {
            transform scale(1)
          }
        }
        &:not(.command-item-preview) {
          opacity .5
          cursor not-allowed
        }
      }
      .command-item-preview {
        background-color $base-color
        color $white
      }
    }
  }

</style>
