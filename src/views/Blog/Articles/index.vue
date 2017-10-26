<template>
  <el-card class="blog-articles-page">
    <el-tabs v-model="articleState">
      <el-tab-pane label="全部" name="-1"></el-tab-pane>
      <el-tab-pane label="已发布" name="1"></el-tab-pane>
      <el-tab-pane label="未发布" name="0"></el-tab-pane>
    </el-tabs>
    <el-form :inline="true" :model="articleFilter" class="demo-form-inline">
      <el-form-item>
        <el-select
          v-model="articleFilter.category"
          value-key="_id"
          placeholder="分类选择"
          size="mini"
          clearable>
          <el-option
            v-for="c in categoryList"
            :key="c._id"
            :label="c.name"
            :value="c._id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="articleFilter.tag"
          value-key="_id"
          placeholder="标签选择"
          size="mini"
          clearable>
          <el-option
            v-for="c in tagList"
            :key="c._id"
            :label="c.name"
            :value="c._id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="articleFilter.title" @keyup.native.enter="handleSearch" size="mini" placeholder="请输入..."></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch" icon="el-icon-search" size="mini">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="default" @click="handleReset" size="mini">重置</el-button>
      </el-form-item>
    </el-form>
    <ArticlesList
      :list="articleList"
      :pagination="pagination"
      :loading="articleListFetching"
      @page-change="handlePageChange"
      @toggle-publish="handleTogglePublish"
      @edit="handleEdit"
      @delete="handleDelete"
      @sort="handleSort">
    </ArticlesList>
  </el-card>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import { ArticlesList } from '@/components/Common'

  export default {
    name: 'Blog-Article',
    components: {
      ArticlesList
    },
    data () {
      return {
        articleState: '-1',
        pageMap: [1, 1],
        articleFilter: {
          category: '',
          tag: '',
          title: ''
        },
        sort: {
          by: '',
          order: 0
        }
      }
    },
    computed: {
      ...mapGetters({
        articleList: 'article/list',
        articleListFetching: 'article/listFetching',
        pagination: 'article/pagination',
        categoryList: 'category/list',
        tagList: 'tag/list'
      })
    },
    watch: {
      articleState (val) {
        this.handleReset()
      }
    },
    created () {
      this.handleSearch()
    },
    methods: {
      ...mapActions({
        fetchArticlelist: 'article/fetchList',
        editArticle: 'article/edit',
        deleteArticle: 'article/delete'
      }),
      async fetchArticlelistWrapper (config = {}) {
        const param = {}
        let state = ~~this.articleState
        if (state >= 0) {
          param.state = state
        }
        if (this.sort.by && [-1, 1].includes(this.sort.order)) {
          param.sort_by = this.sort.by
          param.order = this.sort.order
        }
        await this.fetchArticlelist(Object.assign({}, param, config))
      },
      handlePageChange (page) {
        this.fetchArticlelist({ page })
      },
      async handleTogglePublish (index, data, state) {
        await this.editArticle({
          id: data._id,
          model: { state: ~~state }
        })
        await this.handleSearch({
          page: this.pagination.current_page
        })
      },
      handleEdit (index, data) {
        this.$router.push({
          name: 'Blog-ArticleDetail',
          params: {
            articleId: data._id
          }
        })
      },
      async handleDelete (index, data) {
        await this.deleteArticle(data._id)
        await this.handleSearch()
      },
      handleSort ({ prop, order }) {
        if (prop && order) {
          this.sort.order = order === 'descending' ? -1 : 1
          this.sort.by = prop
        } else {
          this.sort.order = 0
          this.sort.by = ''
        }
        this.handleSearch()
      },
      handleReset () {
        this.articleFilter.title = ''
        this.articleFilter.category = ''
        this.articleFilter.tag = ''
        this.fetchArticlelistWrapper()
      },
      async handleSearch (params = {}) {
        if (this.articleFilter.title) {
          params.keyword = this.articleFilter.title
        }
        if (this.articleFilter.category) {
          params.category = this.articleFilter.category
        }
        if (this.articleFilter.tag) {
          params.tag = this.articleFilter.tag
        }
        await this.fetchArticlelistWrapper(params)
      }
    }
  }
</script>
