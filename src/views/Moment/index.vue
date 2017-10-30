<template>
  <el-card class="moment-page">
    <el-tabs v-model="momentState">
      <el-tab-pane label="全部" name="-1"></el-tab-pane>
      <el-tab-pane label="已发布" name="1"></el-tab-pane>
      <el-tab-pane label="未发布" name="0"></el-tab-pane>
    </el-tabs>
    <div class="moment-list-field">
      <el-table class="moments-table"
        v-loading="fetching"
        element-loading-text="LOADING"
        :data="list">
        <el-table-column
          type="index"
          label="序号"
          width="50">
        </el-table-column>
        <el-table-column
          prop="content"
          label="内容">
        </el-table-column>
        <el-table-column
          prop="createdAt"
          label="创建日期"
          width="180">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span>{{ scope.row.createdAt | fmtDate('yyyy-MM-dd hh:mm:ss') }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="state"
          label="状态"
          width="120">
          <template slot-scope="scope">
            <div class="state published" v-if="scope.row.state === 1">
              <i class="indicator"></i>
              <span class="text">已发布</span>
            </div>
            <div class="state un-published" v-else>
              <i class="indicator"></i>
              <span class="text">未发布</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="200">
          <template slot-scope="scope">
            <el-button
              class="operate"
              :class="[scope.row.state == 1 ? 'unpublish-btn' : 'publish-btn']"
              type="text"
              @click="handleTogglePublish(scope.$index, scope.row, !~~scope.row.state)">
              <i class="iconfont" :class="[`icon-${scope.row.state == 1 ? 'unpublish' : 'publish'}`]"></i>
            </el-button>
            <el-button
              class="operate edit-btn"
              type="text"
              @click="handleEdit(scope.$index, scope.row)">
              <i class="iconfont icon-edit"></i>
            </el-button>
            <el-button
              class="operate delete-btn"
              type="text"
              @click="handleOpenDeleteBox(scope.$index, scope.row)">
              <i class="iconfont icon-delete"></i>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        @current-change="handlePageChange"
        :current-page.sync="pagination.current_page"
        :page-size="pagination.per_page"
        layout="total, prev, pager, next, jumper"
        :total="pagination.total">
      </el-pagination>
    </div>
    <el-dialog
      title="个人动态编辑"
      width="500px"
      center
      v-if="model"
      :visible.async="!!model"
      @close="handleCloseEditBox">
      <el-form ref="form" :model="model" label-width="60px">
        <el-form-item label="内容">
          <el-input type="textarea" :rows="4" v-model="model.content" placeholder="请输入内容"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="handleCloseEditBox">取 消</el-button>
        <el-button type="primary" @click="handleEditConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
  import { api } from '@/service'
  import { deepCopy } from '@/utils'

  export default {
    name: 'Moment',
    data () {
      return {
        momentState: '-1',
        list: null,
        fetching: false,
        pagination: {},
        model: null
      }
    },
    watch: {
      momentState (val) {
        this.fetchMomentList()
      }
    },
    created () {
      this.fetchMomentList()
      this.$eventBus.$on('create-moment', () => {
        this.fetchMomentList()
      })
    },
    methods: {
      async fetchMomentList (config = {}) {
        const params = {}
        let state = ~~this.momentState
        if (state >= 0) {
          params.state = state
        }
        this.fetching = true
        const { success, data } = await api.moment.list({
          params: Object.assign({}, params, config)
        }).catch(() => {
          return {}
        })
        this.fetching = false
        if (success) {
          this.list = data.list
          this.pagination = data.pagination
        }
        return success
      },
      async editMoment (id, model = {}) {
        const { success, data } = await api.moment.update(id)({
          data: { ...model }
        }).catch(() => {
          return {}
        })
        if (success) {
          const index = this.list.findIndex(item => item._id === id)
          if (index > -1) {
            this.list.splice(index, 1, data)
          }
        }
        return success
      },
      async deleteMoment (id) {
        const { success } = await api.moment.delete(id)().catch(() => ({}))
        if (success) {
          const index = this.list.findIndex(item => item._id === id)
          if (index > -1) {
            this.list.splice(index, 1)
          }
        }
        return success
      },
      async handleTogglePublish (index, data, state) {
        await this.editMoment(data._id, { state: ~~state })
        await this.fetchMomentList({
          page: this.pagination.current_page
        })
      },
      handleEdit (index, data) {
        this.model = deepCopy({}, data)
      },
      async handleEditConfirm () {
        const success = await this.editMoment(this.model._id, { content: this.model.content })
        if (success) {
          this.handleCloseEditBox()
        }
      },
      handleCloseEditBox () {
        this.model = null
      },
      handleOpenDeleteBox (index, data) {
        this.$confirm('<strong>此操作将永久删除该条个人动态, 是否继续?</strong>', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          dangerouslyUseHTMLString: true,
          type: 'warning',
          center: true
        }).then(async () => {
          await this.deleteMoment(data._id)
          await this.fetchMomentList()
        })
      },
      handlePageChange (page) {
        this.fetchMomentList({ page })
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~@/assets/stylus/vars/index'
  @import '~@/assets/stylus/mixins/index'

  .moment-page {
    .moments-table {
      .state {
        flexLayout(, flex-start)
        i {
          position relative
          display inline-block
          width 16px
          height @width
          border-radius 50%

          &::after {
            content ''
            position absolute
            top 50%
            left 50%
            width 10px
            height @width
            border-radius 50%
            transform translate(-50%, -50%)
          }
        }      

        &.published {
          i {
            background-color alpha($green, .4)
            &::after {
              background-color $green
            }
          }

          .text {
            color $green
          }
        }

        &.un-published {
          i {
            background-color alpha($grey, .4)
            &::after {
              background-color $grey
            }
          }
          .text {
            color $grey
          }
        }

        .text {
          line-height 1
          margin-left 5px
        }
      }

      .operate {
        opacity 1
        transform scale(1)
        transition all .3s $ease

        &:hover {
          opacity .8
          transform scale(.9)
        }
      }

      .publish-btn {
        color $green
      }
      .unpublish-btn {
        color $yellow
      }
      .edit-btn {
        color $base-color
      }
      .delete-btn {
        color $red
      }
    }
  }

  .pagination {
    margin-top 24px
    text-align center
  }
</style>
