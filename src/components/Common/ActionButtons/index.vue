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
      title="新建分类"
      width="500px"
      center
      :visible.async="showCategoryModal"
      @close="handleCloseCategoryBox">
      <el-form ref="form" :model="categoryModel" label-width="60px">
        <el-form-item label="名称">
          <el-input v-model="categoryModel.name" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input type="textarea" :rows="4" v-model="categoryModel.description" placeholder="请输入描述"></el-input>
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="categoryModel.list" :step="1" :min="1"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="handleCloseCategoryBox">取 消</el-button>
        <el-button type="primary" @click="handleCreateCategory">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="新建标签"
      width="500px"
      center
      :visible.async="showTagModal"
      @close="handleCloseTagBox">
      <el-form ref="form" :model="tagModel" label-width="60px">
        <el-form-item label="名称">
          <el-input v-model="tagModel.name" placeholder="请输入名称"></el-input>
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
    <el-dialog
      title="新建个人动态"
      width="500px"
      center
      :visible.async="showMomentModal"
      @close="handleCloseMomentBox">
      <el-form ref="form" :model="momentModel" label-width="60px">
        <el-form-item label="发布">
          <el-switch
            v-model="momentModel.state"
            :active-value="1"
            :inactive-value="0">
          </el-switch>
        </el-form-item>
        <el-form-item label="内容">
          <el-input type="textarea" :rows="4" v-model="momentModel.content" placeholder="请输入内容"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="handleCloseMomentBox">取 消</el-button>
        <el-button type="primary" @click="handleCreateMoment">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import { scrollTo, easing } from '@/utils'
  import { api } from '@/service'

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
        showCategoryModal: false,
        showTagModal: false,
        showMomentModal: false,
        categoryModel: {
          name: '',
          description: '',
          list: 1
        },
        tagModel: {
          name: '',
          description: ''
        },
        momentModel: {
          state: 1,
          content: ''
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
        createCategory: 'category/create',
        createTag: 'tag/create'
      }),
      handleTriggerAction (key) {
        switch (key) {
          case 'create':
            const pageName = this.$route.name
            if (pageName.includes('Article')) {
              this.$router.push({ name: 'Blog-ArticleCreate' })
            } else if (pageName.includes('Categories')) {
              this.showCategoryModal = true
            } else if (pageName.includes('Tags')) {
              this.showTagModal = true
            } else if (pageName.includes('Moments')) {
              this.showMomentModal = true
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
      handleCloseCategoryBox () {
        this.showCategoryModal = false
        this.categoryModel.name = ''
        this.categoryModel.description = ''
      },
      handleCreateCategory () {
        this.createCategory({
          name: this.categoryModel.name,
          description: this.categoryModel.description
        }).then(success => {
          if (success) {
            this.handleCloseCategoryBox()
          }
        })
      },
      handleCloseTagBox () {
        this.showTagModal = false
        this.tagModel.name = ''
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
      },
      handleCloseMomentBox () {
        this.showMomentModal = false
        this.momentModel.state = 1
        this.momentModel.content = ''
      },
      async handleCreateMoment () {
        const { success } = await api.moment.create({
          data: { ...this.momentModel }
        }).catch(() => ({}))
        if (success) {
          this.handleCloseMomentBox()
          this.$eventBus.$emit('create-moment')
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
          transform scale(.9)
        }

        &.create {
          color $white
          background-color $base-color
          box-shadow 4px 4px 20px 0 alpha($base-color, .8)
        }

        &.comment {
          color $white
          background-color $blue
          box-shadow 4px 4px 20px 0 alpha($blue, .8)
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
