<template>
  <section class="blog-articles-page">
    <el-tabs v-model="articleStatus">
      <el-tab-pane label="已发布" name="1"></el-tab-pane>
      <el-tab-pane label="未发布" name="0"></el-tab-pane>
    </el-tabs>
    <ArticlesList
      :list="list"
      :pagination="pagination"
      :loading="articleListFetching"
      @page-change="handlePageChange"
      @toggle-publish="handleTogglePublish"
      @edit="handleEdit"
      @delete="handleDelete">
    </ArticlesList>
  </section>
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
        articleStatus: '1',
        pageMap: [1, 1]
      }
    },
    computed: {
      ...mapGetters({
        articleList: 'article/list',
        articleListFetching: 'article/listFetching',
        pagination: 'article/pagination'
      }),
      list () {
        return this.articleList.concat(this.articleList).concat(this.articleList).concat(this.articleList).concat(this.articleList).concat(this.articleList).concat(this.articleList).concat(this.articleList)
      }
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
          state: 1 - ~~state,
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
  }
</style>
