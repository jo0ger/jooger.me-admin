<template>
  <div class="action-buttons">
    <transition-group name="action-list" tag="div" class="list">
      <a v-for="action in activeActionMap"
        :key="action.key"
        class="action" :class="[action.key]"
        :title="action.title"
        @click.prevent.stop="handleTriggerAction(action.key)">
        <el-badge style="width: 100%" v-if="action.key === 'comment'" :value="articleDetail ? articleDetail.meta.comments : 0" :max="999">
          <i class="iconfont" :class="['icon-' + action.icon]"></i>
        </el-badge>
        <i class="iconfont" :class="['icon-' + action.icon]" v-else></i>
      </a>
    </transition-group>
    <el-dialog
      title="新建标签"
      width="500px"
      center
      :visible.async="showTagModal"
      @close="handleCloseTagBox">
      <el-form ref="form" :model="tagModel" label-width="60px">
        <el-form-item label="名称">
          <el-input v-model="tagModel.name" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input type="textarea" :rows="4" v-model="tagModel.description" placeholder="请输入描述"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="handleCloseTagBox">取 消</el-button>
        <el-button type="primary" @click="handleCreateTag">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import { scrollTo, easing } from '@/utils'

  export default {
    name: 'ActionButtons',
    data () {
      const actionMap = [
        { key: 'comment', title: '评论', icon: 'comments' },
        { key: 'create', title: '新建', icon: 'plus' },
        { key: 'go-to-top', title: '返回顶部', icon: 'go-to-top' }
      ]
      return {
        actionMap,
        showTagModal: false,
        tagModel: {
          title: '',
          description: ''
        }
      }
    },
    computed: {
      ...mapGetters({
        actionButtonVisible: 'app/actionButtonVisible',
        articleDetail: 'article/detail'
      }),
      activeActionMap () {
        const { goToTop, create, comment } = this.actionButtonVisible
        return this.actionMap.filter(item => {
          if (item.key === 'go-to-top' && !goToTop) {
            return false
          } else if (item.key === 'create' && !create) {
            return false
          } else if (item.key === 'comment' && !comment) {
            return false
          }
          return true
        })
      }
    },
    methods: {
      ...mapActions({
        createTag: 'tag/create'
      }),
      handleTriggerAction (key) {
        switch (key) {
          case 'create':
            const pageName = this.$route.name
            if (pageName.includes('Article')) {
              this.$router.push({ name: 'Blog-ArticleCreate' })
            } else if (pageName.includes('Tag')) {
              this.showTagModal = true
            }
            break
          case 'comment':
            // TODO: show comment pane
            this.$message('show comment pane')
            break
          case 'go-to-top':
            scrollTo(0, 500, { easing: easing['fuck'] })
            break
          default:
            break
        }
      },
      handleCloseTagBox () {
        this.showTagModal = false
        this.tagModel.title = ''
        this.tagModel.description = ''
      },
      handleCreateTag () {
        this.createTag({
          name: this.tagModel.name,
          description: this.tagModel.description
        }).then(success => {
          if (success) {
            this.handleCloseTagBox()
          }
        })
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
          transform scale(.9)
        }

        &.create {
          color $white
          background-color $base-color
          box-shadow 4px 4px 20px 0 alpha($base-color, .8)
        }

        &.comment {
          color $white
          background-color $grey
          box-shadow 4px 4px 20px 0 alpha($grey, .8)
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
