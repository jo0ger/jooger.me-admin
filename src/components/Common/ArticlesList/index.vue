<template>
  <div class="article-list-field">
    <el-table
      class="articles-table"
      v-loading="loading"
      element-loading-text="LOADING"
      :data="list"
      @sort-change="handleChangeSort">
      <el-table-column
        prop="thumb"
        width="120"
        label="缩略图">
        <template slot-scope="scope">
          <img class="thumb" :src="scope.row.thumb" :alt="scope.row.title" v-if="scope.row.thumb">
          <div class="thumb-placeholder" v-else></div>
        </template>
      </el-table-column>
      <el-table-column
        prop="title"
        label="标题">
        <template slot-scope="scope">
          <h6 class="title">{{ scope.row.title }}</h6>
          <p class="description">{{ scope.row.description }}</p>
        </template>
      </el-table-column>
      <el-table-column
        prop="category"
        label="分类"
        width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.category">{{ scope.row.category.name }}</span>
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="tag"
        label="标签"
        width="250">
        <template slot-scope="scope">
          <template v-if="scope.row.tag && scope.row.tag.length">
            <a class="tag-item" v-for="item in scope.row.tag" :key="item._id">
              <el-tag size="small">
                {{ item.name }}
              </el-tag>
            </a>
          </template>
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="meta.pvs"
        label="浏览量"
        width="80"
        sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.meta.pvs }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="meta.ups"
        label="点赞数"
        width="80"
        sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.meta.ups }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="meta.comments"
        label="评论量"
        width="80"
        sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.meta.comments }}</span>
        </template>
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
        width="100">
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
          <a class="el-button el-button--text operate qrcode-btn"
            :class="{ 'is-disabled': scope.row.state !== 1 }"
            @click="handleViewQrcode(scope.$index, scope.row)">
            <i class="iconfont icon-qrcode"></i>
          </a>
          <a :href="getArticleLink(scope.row)" target="_blank" class="el-button el-button--text operate skip-btn"
            :class="{ 'is-disabled': scope.row.state !== 1 }">
            <i class="iconfont icon-skip-link"></i>
          </a>
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
    <el-dialog
      title="文章二维码"
      width="400px"
      center
      :visible.async="!!qrcodeUrl"
      @close="handleCloseQrcodeThumb">
      <img :src="qrcodeUrl" alt="" width="100%">
    </el-dialog>
  </div>
</template>

<script>
  import { qrcode } from '@/utils'

  export default {
    name: 'ArticlesList',
    props: {
      loading: {
        type: Boolean,
        default: false
      },
      list: {
        type: Array,
        default () {
          return []
        }
      },
      pagination: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    data () {
      return {
        qrcodeUrl: ''
      }
    },
    methods: {
      handlePageChange (page) {
        this.$emit('page-change', page)
      },
      handleTogglePublish (index, data, state) {
        this.$emit('toggle-publish', index, data, state)
      },
      handleEdit (index, data) {
        this.$emit('edit', index, data)
      },
      handleOpenDeleteBox (index, data) {
        this.$confirm('<strong>此操作将永久删除该篇文章, 是否继续?</strong>', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          dangerouslyUseHTMLString: true,
          type: 'warning',
          center: true
        }).then(() => this.$emit('delete', index, data))
      },
      getArticleLink (data) {
        if (data.state !== 1) {
          return 'javascript:;'
        }
        return data.permalink || `https://jooger.me/blog/article/${data._id}`
      },
      handleViewQrcode (index, data) {
        if (data.state !== 1) {
          return 'javascript:;'
        }
        qrcode.toDataURL(this.getArticleLink(data)).then(data => {
          this.qrcodeUrl = data
        })
      },
      handleCloseQrcodeThumb () {
        this.qrcodeUrl = ''
      },
      handleChangeSort ({ column, prop, order }) {
        this.$emit('sort', { prop, order })
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~@/assets/stylus/vars/index'
  @import '~@/assets/stylus/mixins/index'

  .articles-table {
    font-size $font-size-base

    .thumb {
      border-radius 2px
      &-placeholder {
        width 100%
        height 50px
        background $grey-4
        border-radius 2px
      }
    }

    .title {
      font-weight 600
    }

    .tag-item + .tag-item {
      margin-left 8px
    }
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
    .qrcode-btn {
      display inline-block
      color $blue
    }

    .skip-btn {
      display inline-block
      color $grey
    }

    .qrcode-btn
    .skip-btn {
      &.is-disabled {
        color alpha($grey, .5)

        &:hover {
          opacity 1
          transform scale(1)
        }
      }
    }
  }

  .pagination {
    margin-top 24px
    text-align center
  }
</style>
