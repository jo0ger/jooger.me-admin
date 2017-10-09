<template>
  <section class="blog-articles-page">
    <el-tabs v-model="articleStatus">
      <el-tab-pane label="已发布" name="1">
        <el-table
          class="articles-table"
          :data="articleList"
          style="width: 100%">
          <el-table-column
            type="index"
            label="序号"
            width="50">
          </el-table-column>
          <el-table-column
            prop="title"
            label="标题"
            width="180">
          </el-table-column>
          <el-table-column
            prop="tag"
            label="标签"
            width="180">
            <template scope="scope">
              <template v-if="scope.row.tag && scope.row.tag.length">
                <a v-for="item in scope.row.tag" :key="item._id">
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
            width="180">
            <template scope="scope">
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
            label="浏览量（PV）">
            <template scope="scope">
              <span>{{ scope.row.meta.pvs }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="meta"
            label="点赞数">
            <template scope="scope">
              <span>{{ scope.row.meta.ups }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="meta"
            label="评论量">
            <template scope="scope">
              <span>{{ scope.row.meta.comments }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="createdAt"
            label="创建日期">
            <template scope="scope">
              <span>{{ scope.row.createdAt | fmtDate('yyyy-MM-dd hh:mm') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template scope="scope">
              <el-button
                class="unpublish-btn"
                type="text"
                @click="handleTogglePublish(scope.$index, scope.row, false)">
                <i class="iconfont icon-unpublish"></i>
              </el-button>
              <el-button
                class="edit-btn"
                type="text"
                icon="el-icon-edit"
                @click="handleEdit(scope.$index, scope.row)">
              </el-button>
              <el-button
                class="delete-btn"
                type="text"
                icon="el-icon-delete2"
                @click="handleDelete(scope.$index, scope.row)">
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          class="pagination"
          @current-change="handlePageChange"
          :current-page.sync="currentPage[articleStatus]"
          :page-size="pagination.per_page"
          layout="total, prev, pager, next, jumper"
          :total="pagination.total">
        </el-pagination>
      </el-tab-pane>
      <el-tab-pane label="未发布" name="0">
        <el-table
          class="articles-table"
          :data="articleList"
          style="width: 100%">
          <el-table-column
            type="index"
            label="序号"
            width="50">
          </el-table-column>
          <el-table-column
            prop="title"
            label="标题"
            width="180">
          </el-table-column>
          <el-table-column
            prop="tag"
            label="标签"
            width="180">
            <template scope="scope">
              <template v-if="scope.row.tag && scope.row.tag.length">
                <a v-for="item in scope.row.tag" :key="item._id">
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
            width="180">
            <template scope="scope">
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
            label="浏览量（PV）">
            <template scope="scope">
              <span>{{ scope.row.meta.pvs }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="meta"
            label="点赞数">
            <template scope="scope">
              <span>{{ scope.row.meta.ups }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="meta"
            label="评论量">
            <template scope="scope">
              <span>{{ scope.row.meta.comments }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="createdAt"
            label="创建日期">
            <template scope="scope">
              <span>{{ scope.row.createdAt | fmtDate('yyyy-MM-dd hh:mm') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template scope="scope">
              <el-button
                class="publish-btn"
                type="text"
                @click="handleTogglePublish(scope.$index, scope.row, true)">
                <i class="iconfont icon-publish"></i>
              </el-button>
              <el-button
                class="edit-btn"
                type="text"
                icon="el-icon-edit"
                @click="handleEdit(scope.$index, scope.row)">
              </el-button>
              <el-button
                class="delete-btn"
                type="text"
                icon="el-icon-delete2"
                @click="handleDelete(scope.$index, scope.row)">
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          class="pagination"
          @current-change="handlePageChange"
          :current-page.sync="currentPage[articleStatus]"
          :page-size="pagination.per_page"
          layout="total, prev, pager, next, jumper"
          :total="pagination.total">
        </el-pagination>
      </el-tab-pane>
    </el-tabs>
  </section>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'

  export default {
    name: 'Blog-Article',
    data () {
      return {
        articleStatus: '1',
        currentPage: [1, 1],
        tableData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }]
      }
    },
    computed: {
      ...mapGetters({
        articleList: 'article/list',
        pagination: 'article/pagination'
      })
    },
    watch: {
      articleStatus (val) {
        this.fetchArticlelist({
          state: val
        })
      }
    },
    created () {
      this.fetchArticlelist({
        state: this.status
      })
    },
    methods: {
      ...mapActions({
        fetchArticlelist: 'article/fetchList',
        editArticle: 'article/edit'
      }),
      handlePageChange (page) {
        this.fetchArticlelist({
          state: this.status,
          page
        })
      },
      async handleTogglePublish (index, data, state) {
        await this.editArticle({
          id: data._id,
          model: { state: ~~state }
        })
        await this.fetchArticlelist({
          state: this.status,
          page: this.pagination.current_page
        })
      },
      handleEdit (index, data) {},
      handleDelete (index, data) {}
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~@/assets/stylus/vars/index'
  @import '~@/assets/stylus/mixins/index'

  .blog-articles-page {
    card()

    .articles-table {
      .keyword {
        display inline-block
        margin-right 10px
      }
      .publish-btn {
        color $green
      }
      .unpublish-btn {
        color $yellow
      }
      .edit-btn {
        color alpha($grey, .8)
      }
      .delete-btn {
        color $red
      }
    }

    .pagination {
      margin-top 24px
      text-align center
    }
  }
</style>
