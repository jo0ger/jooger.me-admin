<template>
  <section class="blog-article-detail-page">
    <ArticleDetail
      :article-model="model"
      @submit="handleEdit">
    </ArticleDetail>
  </section>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import { ArticleDetail } from '@/components/Common'
  import { deepCopy } from '@/utils'

  export default {
    name: 'Blog-ArticleDetail',
    components: {
      ArticleDetail
    },
    data () {
      return {
        model: null
      }
    },
    computed: {
      ...mapGetters({
        articleDetail: 'article/detail'
      })
    },
    async created () {
      await this.fetchArticleDetail(this.$route.params.articleId)
      this.model = deepCopy({}, this.articleDetail)
    },
    methods: {
      ...mapActions({
        fetchArticleDetail: 'article/fetchDetail',
        editArticle: 'article/edit'
      }),
      handleEdit (model) {
        this.editArticle({
          id: this.articleDetail._id,
          model
        }).then(success => {
          if (success) {
            this.model = deepCopy({}, this.articleDetail)
          }
        })
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .blog-article-detail-page {
    padding-bottom 100px
  }
</style>
