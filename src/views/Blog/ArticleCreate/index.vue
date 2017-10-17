<template>
  <section class="blog-article-create-page">
    <ArticleDetail
      :article-model="model"
      @submit="handleCreate">
    </ArticleDetail>
  </section>
</template>

<script>
  import { ArticleDetail } from '@/components/Common'

  export default {
    name: 'Blog-ArticleCreate',
    components: {
      ArticleDetail
    },
    data () {
      return {
        model: null
      }
    },
    created () {
      this.buildModel()
    },
    methods: {
      buildModel () {
        this.model = {
          title: '',
          description: '',
          state: 0,
          keywords: [],
          tag: [],
          permalink: '',
          thumb: '',
          content: ''
        }
      },
      handleCreate (model) {
        this.$store.dispatch('article/create', model).then(success => {
          if (success) {
            this.$router.push({ name: 'Blog-Articles' })
          }
        })
      }
    }
  }
</script>

<style lang="stylus" scoped>

</style>
