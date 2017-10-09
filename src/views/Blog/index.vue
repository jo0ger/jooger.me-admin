<template>
  <router-view></router-view>
</template>

<script>
  // import { mapGetters, mapActions } from 'vuex'

  export default {
    name: 'Blog'
    // computed: mapGetters({
    //   categoryList: 'category/list',
    //   tagList: 'tag/list'
    // }),
    // created () {
    //   if (!this.categoryList.length) {
    //     this.fetchCategoryList()
    //   }
    //   if (!this.tagList.length) {
    //     this.fetchTagList()
    //   }
    // },
    // methods: {
    //   ...mapActions({
    //     fetchCategoryList: 'category/fetchList',
    //     fetchTagList: 'tag/fetchList'
    //   })
    // }
  }
</script>
