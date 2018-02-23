<template>
  <div class="article-detail" v-if="model">
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
            <el-form :model="model" label-width="80px">
              <el-form-item label="状态">
                <el-radio-group v-model="model.state" size="small">
                  <el-radio :label="0" border>未发布</el-radio>
                  <el-radio :label="1" border>已发布</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="标题" required>
                <el-input v-model="model.title" placeholder="请输入标题"></el-input>
              </el-form-item>
              <el-form-item label="简介">
                <el-input type="textarea" :rows="3" v-model="model.description" placeholder="请输入简介"></el-input>
              </el-form-item>
              <el-form-item label="关键词">
                <el-tag
                  style="margin-right: 8px"
                  :key="index"
                  v-for="(keyword, index) in model.keywords"
                  closable
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
              <el-form-item label="永久链接" v-if="model.permalink">
                <el-input v-model="model.permalink" disabled placeholder="请输入永久链接URL"></el-input>
              </el-form-item>
            </el-form>
          </el-card>
          <el-card>
            <MarkdownEditor
              :value="model.content"
              @change="handleEditorValueChange">
            </MarkdownEditor>
          </el-card>
        </el-col>
        <el-col :span="8">
          <!-- <el-card v-if="articleModel.meta">
            <div slot="header">
              <span>其他信息</span>
            </div>
            <el-form ref="form" :model="model" label-width="80px">
              <template>
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
              </template>
            </el-form>
          </el-card> -->
          <el-card>
            <div slot="header">
              <span>分类标签</span>
            </div>
            <el-form ref="form" :model="model" label-width="50px">
              <el-form-item label="分类">
                <el-select
                  v-model="model.category"
                  value-key="_id"
                  placeholder="分类选择">
                  <el-option v-for="c in categoryList"
                    :key="c._id"
                    :label="c.name"
                    :value="c">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="标签">
                <el-select
                  v-model="model.tag"
                  value-key="_id"
                  placeholder="标签选择"
                  clearable
                  multiple>
                  <el-option v-for="t in tagList"
                    :key="t._id"
                    :label="t.name"
                    :value="t">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </el-card>
          <el-card>
            <div slot="header">
              <span>缩略图</span>
            </div>
            <Uploader :url="model.thumb"
              :name="uploadName"
              @on-success="uploadSuccess"
              @on-delete="deleteThumb"
              @on-preview="handlePreviewThumb"></Uploader>
          </el-card>
          <el-card>
            <div slot="header">
              <span>相关时间</span>
            </div>
            <el-form ref="form" :model="model" label-width="80px">
              <el-form-item label="创建时间">
                <el-date-picker
                  v-model="createdAt"
                  type="datetime"
                  placeholder="选择创建日期时间">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="更新时间" v-if="model.updatedAt">
                <i class="el-icon-time"></i>
                <span style="margin-left: 8px">{{ model.updatedAt | fmtDate('yyyy-MM-dd hh:mm:ss') }}</span>
              </el-form-item>
              <el-form-item label="发布时间" v-if="model.publishedAt">
                <i class="el-icon-time"></i>
                <span style="margin-left: 8px">{{ model.publishedAt | fmtDate('yyyy-MM-dd hh:mm:ss') }}</span>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
      </el-row>
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
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import moment from 'moment'
  import FormEdit from '../FormEdit'
  import MarkdownEditor from '../MarkdownEditor'
  import Uploader from '../Uploader'
  import { deepCopy, imageLoad } from '@/utils'

  export default {
    name: 'ArticleDetail',
    components: {
      FormEdit,
      MarkdownEditor,
      Uploader
    },
    props: {
      articleModel: {
        type: Object,
        default: null
      }
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
        articleDetailEditing: 'article/detailEditing',
        articleDetailLiking: 'article/detailLiking',
        tagList: 'tag/list',
        categoryList: 'category/list'
      }),
      uploadName () {
        const date = this.articleModel.createdAt ? moment(this.articleModel.createdAt) : moment()
        return `source/${date.format('YYYYMMDD')}/`
      }
    },
    watch: {
      articleModel (val, oldVal) {
        if (val) {
          this.buildModel()
        }
      }
    },
    async created () {
      if (this.articleModel) {
        this.buildModel()
      }
    },
    beforeDestroy () {
      this.$store.commit('article/CLEAR_DETAIL')
    },
    methods: {
      ...mapActions({
        editArticle: 'article/edit'
      }),
      buildModel () {
        this.model = deepCopy({
          category: {}
        }, this.articleModel)
        this.createdAt = this.model.createdAt || new Date()
      },
      uploadSuccess (thumb) {
        this.model.thumb = thumb
      },
      deleteThumb () {
        this.model.thumb = ''
      },
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
          .filter(tag => this.model.tag && this.model.tag.length ? this.model.tag.find(item => item._id !== tag._id) : true)
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
      handlePreviewThumb (url) {
        imageLoad(url, {
          fail: err => {
            this.$message.error(err ? err.message : '缩略图加载失败')
          }
        })
        this.thumbPreview = true
      },
      handleClosePreviewThumb () {
        this.thumbPreview = false
      },
      handleEditorValueChange (value) {
        this.model.content = value
      },
      handleBack () {
        this.$router.back()
      },
      handleSubmit () {
        const model = deepCopy({}, this.model)
        if (model.category) {
          model.category = model.category._id
        }
        model.tag = model.tag.map(item => item._id)
        if (this.createdAt && new Date(this.createdAt).getTime() !== new Date(this.model.createdAt).getTime()) {
          model.createdAt = this.createdAt
        } else {
          this.createdAt = this.model.createdAt
          delete model.createdAt
        }
        this.$emit('submit', model)
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .article-detail {
    padding-bottom 100px
  }
</style>
