<template>
  <section class="blog-article-detail-page">
    <FormEdit
      :loading="articleDetailEditing"
      cancel-text="返回"
      @submit="handleSubmit"
      @cancel="handleBack"
      v-if="model">
      <el-row :gutter="24">
        <el-col :span="16">
          <el-card>
            <div slot="header">
              <span>基本信息</span>
            </div>
            <el-form ref="form" :model="model" label-width="80px">
              <el-form-item label="状态">
                <el-switch
                  v-model="model.state"
                  on-color="#13ce66"
                  off-color="#878D99"
                  on-text="已发布"
                  off-text="草稿"
                  :on-value="1"
                  :off-value="0">
                </el-switch>
              </el-form-item>
              <el-form-item label="标题">
                <el-input v-model="model.title" placeholder="请输入标题"></el-input>
              </el-form-item>
              <el-form-item label="简介">
                <el-input type="textarea" :rows="4" v-model="model.description" placeholder="请输入简介"></el-input>
              </el-form-item>
              <el-form-item label="关键词">
                <el-tag
                  style="margin-right: 8px"
                  :key="index"
                  v-for="(keyword, index) in model.keywords"
                  closable
                  type="success"
                  :disable-transitions="false"
                  @close="handleDeleteKeywordItem(keyword, index)">
                  {{ keyword }}
                </el-tag>
                <el-input
                  v-if="keywordInputVisible"
                  v-model="keywordInput"
                  ref="saveKeywordInput"
                  size="small"
                  style="width: 90px"
                  @keyup.enter.native="handleKeywordInputConfirm"
                  @blur="handleKeywordInputConfirm">
                </el-input>
                <el-button v-else size="small" @click="handleShowKeywordInput">+ 添加</el-button>
              </el-form-item>
              <el-form-item label="标签">
                <el-tag
                  style="margin-right: 8px"
                  :key="tag._id"
                  v-for="(tag, index) in model.tag"
                  closable
                  :disable-transitions="false"
                  @close="handleDeleteTagItem(tag, index)">
                  {{ tag.name }}
                </el-tag>
                <el-autocomplete
                  ref="saveTagInput"
                  v-model="tagInput"
                  :fetch-suggestions="tagFilter"
                  placeholder="请输入标签名"
                  size="small"
                  @keyup.esc.native="handleHideTagInput"
                  @select="handleSelectTag"
                  v-if="tagInputVisible">
                </el-autocomplete>
                <el-button v-else class="button-new-tag" size="small" @click="handleShowTagInput">+ 添加</el-button>
              </el-form-item>
              <el-form-item label="缩略图">
                <el-row>
                  <el-col :span="20">
                    <el-input v-model="model.thumb" placeholder="请输入缩略图URL"></el-input>
                  </el-col>
                  <el-col :span="2">
                    <el-button style="margin-left: 16px" type="primary" size="mini" plain round icon='el-icon-search' @click="handlePreviewThumb"></el-button>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card>
            <div slot="header">
              <span>其他信息</span>
            </div>
            <el-form ref="form" :model="model" label-width="80px">
              <el-form-item label="创建时间">
                <el-date-picker
                  v-model="createdAt"
                  type="datetime"
                  placeholder="选择创建日期时间">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="更新时间">
                <i class="el-icon-time"></i>
                <span>{{ model.updatedAt | fmtDate('yyyy-MM-dd hh:mm:ss') }}</span>
              </el-form-item>
              <el-form-item label="发布时间">
                <i class="el-icon-time"></i>
                <span>{{ model.publishedAt | fmtDate('yyyy-MM-dd hh:mm:ss') }}</span>
              </el-form-item>
              <el-form-item label="浏览量">
                <i class="iconfont icon-visit"></i>
                <span style="margin-left: 8px">{{ model.meta.pvs }}</span>
              </el-form-item>
              <el-form-item label="点赞量">
                <i class="iconfont icon-thumb-up"></i>
                <span style="margin-left: 8px">{{ model.meta.ups }}</span>
              </el-form-item>
              <el-form-item label="评论量">
                <i class="iconfont icon-comments"></i>
                <span style="margin-left: 8px">{{ model.meta.comments }}</span>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
      </el-row>
      <el-card>
        <div slot="header">
          <span>内容区域</span>
        </div>
      </el-card>
    </FormEdit>
    <el-dialog
      title="缩略图预览"
      width="60%"
      center
      v-if="model"
      :visible.async="thumbPreview"
      @close="handleClosePreviewThumb">
      <p style="margin-bottom: 16px">{{ model.thumb }}</p>
      <img :src="model.thumb" alt="" width="100%">
    </el-dialog>
  </section>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import { FormEdit } from '@/components/Common'
  import { deepCopy } from '@/utils'

  export default {
    name: 'Blog-ArticleDetail',
    components: {
      FormEdit
    },
    data () {
      return {
        model: null,
        tagInputVisible: false,
        tagInput: '',
        keywordInputVisible: false,
        keywordInput: '',
        thumbPreview: false,
        createdAt: ''
      }
    },
    computed: {
      ...mapGetters({
        articleDetail: 'article/detail',
        articleDetailFetching: 'article/detailFetching',
        articleDetailEditing: 'article/detailEditing',
        articleDetailLiking: 'article/detailLiking',
        tagList: 'tag/list'
      })
    },
    async created () {
      await this.fetchArticleDetail(this.$route.params.articleId)
      this.model = deepCopy({}, this.articleDetail)
      this.createdAt = this.model.createdAt
    },
    beforeDestroy () {
      this.$store.commit('article/CLEAR_DETAIL')
    },
    methods: {
      ...mapActions({
        fetchArticleDetail: 'article/fetchDetail',
        editArticle: 'article/edit'
      }),
      handleDeleteKeywordItem (keyword, index) {
        this.model.keywords.splice(index, 1)
      },
      handleKeywordInputConfirm () {
        const keyword = this.keywordInput
        if (keyword) {
          this.model.keywords.push(keyword)
        }
        this.keywordInputVisible = false
        this.keywordInput = ''
      },
      handleShowKeywordInput () {
        this.keywordInputVisible = true
        this.$nextTick(() => {
          this.$refs.saveKeywordInput.$refs.input.focus()
        })
      },
      handleDeleteTagItem (tag, index) {
        this.model.tag.splice(index, 1)
      },
      handleShowTagInput () {
        this.tagInputVisible = true
        this.$nextTick(() => {
          this.$refs.saveTagInput.$refs.input.focus()
        })
      },
      handleHideTagInput () {
        this.tagInputVisible = false
      },
      tagFilter (query, done) {
        const result = (!query ? this.tagList : this.tagList.filter(tag => tag.name.includes(query.toLowerCase())))
          .map(tag => ({
            ...tag,
            value: tag.name
          }))
        done(result)
      },
      handleSelectTag (tag) {
        delete tag.value
        this.model.tag.push(tag)
        this.tagInput = ''
        this.tagInputVisible = false
      },
      handlePreviewThumb () {
        this.thumbPreview = true
      },
      handleClosePreviewThumb () {
        this.thumbPreview = false
      },
      handleBack () {
        this.$router.back()
      },
      handleSubmit () {
        const model = deepCopy({}, this.model)
        model.tag = model.tag.map(item => item._id)
        console.log(new Date(this.createdAt).getTime() !== new Date(this.model.createdAt).getTime())
        if (this.createdAt && new Date(this.createdAt).getTime() !== new Date(this.model.createdAt).getTime()) {
          model.createdAt = this.createdAt
        } else {
          this.createdAt = this.model.createdAt
          delete model.createdAt
        }
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

</style>
