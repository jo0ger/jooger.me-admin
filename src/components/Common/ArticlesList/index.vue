<template>
  <div class="article-list-field">
    <el-table
      class="articles-table"
      v-loading="loading"
      element-loading-text="LOADING"
      :data="list">
      <el-table-column
        type="index"
        label="序号"
        width="50">
      </el-table-column>
      <el-table-column
        prop="title"
        label="标题">
      </el-table-column>
      <el-table-column
        prop="tag"
        label="标签"
        width="180">
        <template slot-scope="scope">
          <template v-if="scope.row.tag && scope.row.tag.length">
            <a class="tag-item" v-for="item in scope.row.tag" :key="item._id">
              <el-tag size="small">
                {{ item.name }}
              </el-tag>
            </a>
          </template>
          <span v-else>暂无标签</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="keywords"
        label="关键词"
        width="200">
        <template slot-scope="scope">
          <template v-if="scope.row.keywords && scope.row.keywords.length">
            <span class="keyword" v-for="(item, index) in scope.row.keywords" :key="index">
              {{ item }}
            </span>
          </template>
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="meta"
        label="浏览量"
        width="70">
        <template slot-scope="scope">
          <span>{{ scope.row.meta.pvs }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="meta"
        label="点赞数"
        width="70">
        <template slot-scope="scope">
          <span>{{ scope.row.meta.ups }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="meta"
        label="评论量"
        width="70">
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
        width="80px">
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
      <el-table-column label="操作">
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
          <el-button
            class="operate qrcode-btn"
            type="text"
            @click="handleViewQrcode(scope.$index, scope.row)">
            <i class="iconfont icon-qrcode"></i>
          </el-button>
          <a :href="getArticleLink(scope.row)" target="_blank" class="el-button el-button--text operate skip-btn">
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
        return data.permalink || `https://jooger.me/blog/article/${data._id}`
      },
      handleViewQrcode (index, data) {
        qrcode.toDataURL(this.getArticleLink(data)).then(data => {
          this.qrcodeUrl = data
        })
      },
      handleCloseQrcodeThumb () {
        this.qrcodeUrl = ''
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~@/assets/stylus/vars/index'
  @import '~@/assets/stylus/mixins/index'

  .articles-table {
    font-size $font-size-base

    .skip-link {
      margin-left 8px
      color $text-color-secondary

      &:hover {
        color $base-color
      }
    }
    .keyword {
      display inline-block
      margin-right 10px
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
      color $blue
    }
    .delete-btn {
      color $red
    }
    .qrcode-btn
    .skip-btn {
      display inline-block
      color alpha($grey, .8)
    }
  }

  .pagination {
    margin-top 24px
    text-align center
  }
</style>
