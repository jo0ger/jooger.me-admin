<template>
  <el-card class="blog-articles-page">
    <el-tabs v-model="articleState">
      <el-tab-pane label="全部" name="-1"></el-tab-pane>
      <el-tab-pane label="已发布" name="1"></el-tab-pane>
      <el-tab-pane label="未发布" name="0"></el-tab-pane>
    </el-tabs>
    <el-form :inline="true" :model="articleFilter" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="articleFilter.title" @keyup.native.enter="handleSearch" size="mini" placeholder="请输入..."></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch" icon="el-icon-search" size="mini">查询</el-button>
      </el-form-item>
    </el-form>
    <ArticlesList
      :list="articleList"
      :pagination="pagination"
      :loading="articleListFetching"
      @page-change="handlePageChange"
      @toggle-publish="handleTogglePublish"
      @edit="handleEdit"
      @delete="handleDelete">
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
          title: ''
        }
      }
    },
    computed: {
      ...mapGetters({
        articleList: 'article/list',
        articleListFetching: 'article/listFetching',
        pagination: 'article/pagination'
      })
    },
    watch: {
      articleState (val) {
        this.fetchArticlelistWrapper()
      }
    },
    created () {
      this.fetchArticlelistWrapper()
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
        await this.fetchArticlelistWrapper({
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
        await this.fetchArticlelistWrapper()
      },
      handleSearch () {
        const params = {}
        if (this.articleFilter.title) {
          params.keyword = this.articleFilter.title
        }
        this.fetchArticlelistWrapper(params)
      }
    }
  }
</script>
