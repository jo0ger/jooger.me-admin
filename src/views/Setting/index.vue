<template>
  <section class="setting-page">
    <FormEdit
      :loading="optionEditing"
      :showCancel="false"
      @submit="handleSubmit"
      v-if="model">
      <el-row :gutter="24">
        <el-col :span="12">
          <el-card>
            <div slot="header">
              <span>关于我</span>
            </div>
            <el-form ref="form" :model="model" label-width="80px">
              <el-form-item label="欢迎语" class="welcome">
                <el-input type="textarea" :rows="4" v-model="model.welcome" placeholder="请输入欢迎语"></el-input>
              </el-form-item>
              <el-form-item label="个人简介" class="description">
                <el-input type="textarea" :rows="4" v-model="model.description" placeholder="请输入个人简介"></el-input>
              </el-form-item>
              <el-form-item label="技能" class="skill">
                <el-input :rows="4" v-model="model.skill" placeholder="请输入技能"></el-input>
              </el-form-item>
              <el-form-item label="爱好" class="hobby">
                <el-input :rows="4" v-model="model.hobby" placeholder="请输入爱好"></el-input>
              </el-form-item>
              <el-form-item label="音乐" class="music">
                <el-input :rows="4" v-model="model.music" placeholder="请输入喜欢的音乐"></el-input>
              </el-form-item>
              <el-form-item label="地址" class="location">
                <el-input :rows="4" v-model="model.location" placeholder="请输入地址"></el-input>
              </el-form-item>
              <el-form-item label="公司" class="company">
                <el-input :rows="4" v-model="model.company" placeholder="请输入公司"></el-input>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card >
            <div slot="header">
              <span>第三方设置</span>
            </div>
            <el-form ref="form" :model="model" label-width="80px">
              <el-form-item label="歌单ID">
                <el-row>
                  <el-col :span="20">
                    <el-input v-model="model.musicId" placeholder="请输入音乐ID"></el-input>
                  </el-col>
                  <el-col :span="2">
                    <a style="margin-left: 16px" :href="`https://music.163.com/#/playlist?id=${model.musicId}`" class="el-button el-button--primary el-button--mini is-plain is-round" target="_blank">查看</a>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-form>
          </el-card>
          <el-card >
            <div slot="header">
              <span>友链</span>
            </div>
            <el-row class="links-item" v-for="(links, index) in model.links" :key="index">
              <el-col :span="20">
                <el-row :gutter="16" class="main">
                  <el-col :span="12">
                    <el-input v-model="model.links[index].name" placeholder="名称"></el-input>
                  </el-col>
                  <el-col :span="12">
                    <el-input v-model="model.links[index].github" placeholder="GitHub名称"></el-input>
                  </el-col>
                </el-row>
                <el-row class="extra">
                  <el-col :span="24">
                    <el-input v-model="model.links[index].site" placeholder="个人站点"></el-input>
                  </el-col>
                </el-row>
                <el-row :gutter="8" class="info" v-if="model.links[index].avatar || model.links[index].slogan">
                  <el-col :span="3">
                    <img :src="model.links[index].avatar || defaultAvatar" class="avatar" alt="">
                  </el-col>
                  <el-col :span="21">
                    <el-input disabled :value="model.links[index].slogan || '暂无'" class="slogan"></el-input>
                  </el-col>
                </el-row>
              </el-col>
              <el-col :span="2">
                <el-button type="danger" size="mini" plain round icon='el-icon-minus' @click="handleDeleteItem('links', index)"></el-button>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20">
                <el-button type="primary" size="small" icon='el-icon-plus' style="width: 100%" @click="handleAddItem('links')">添加</el-button>
              </el-col>
            </el-row>
          </el-card>
        </el-col>
      </el-row>
    </FormEdit>
    <el-dialog
      title="图片预览"
      width="60%"
      center
      top="5vh"
      :visible.async="!!previewUrl"
      @close="handleClosePreview">
      <p style="margin-bottom: 16px">{{ previewUrl }}</p>
      <img :src="previewUrl" alt="" width="100%">
    </el-dialog>
  </section>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import { FormEdit } from '@/components/Common'
  import { deepCopy, isType } from '@/utils'
  import defaultAvatar from '@@/static/image/avatar.png'

  export default {
    name: 'Setting',
    components: {
      FormEdit
    },
    data () {
      return {
        defaultAvatar,
        model: null,
        previewUrl: ''
      }
    },
    computed: {
      ...mapGetters({
        option: 'option/option',
        optionEditing: 'option/editing'
      })
    },
    async created () {
      await this.fetchOption()
      this.model = deepCopy({}, this.option)
    },
    methods: {
      ...mapActions({
        fetchOption: 'option/fetch',
        updateOption: 'option/update'
      }),
      formatTime (secs = 0) {
        const minutes = Math.floor(secs / 60) || 0
        const seconds = (secs - minutes * 60) || 0
        return minutes + ':' + (seconds < 10 ? '0' : '') + seconds
      },
      handleRemove (file, fileList) {
        console.log(file, fileList)
      },
      handlePictureCardPreview (file) {
        this.dialogImageUrl = file.url
        this.dialogVisible = true
      },
      handleDeleteItem (key, index) {
        if (!key) {
          return
        }
        this.model[key].splice(index, 1)
      },
      handleAddItem (key) {
        switch (key) {
          case 'banners':
          case 'description':
            this.model[key].push('')
            break
          case 'hobby':
            this.model[key].push({ name: '', icon: '' })
            break
          case 'experience':
            this.model[key].push({ time: '', title: '', subtitle: '' })
            break
          case 'skill':
            this.model[key].push({ title: '', level: '', icon: '' })
            break
          case 'links':
            this.model[key].push({ name: '', github: '', site: '' })
            break
          default:
            break
        }
      },
      handlePreview (url) {
        this.previewUrl = url
      },
      handleClosePreview () {
        this.previewUrl = ''
      },
      handleSubmit () {
        // 提交前的校验，去除数组中的空项（全部值都是空的项）
        const model = deepCopy({}, this.model)
        for (let key in model) {
          if (isType(model[key], 'Array')) {
            model[key] = model[key].filter(item => {
              if (isType(item, 'String')) {
                return !!item
              } else if (isType(item, 'Object')) {
                return !Object.keys(item).every(k => !item[k])
              }
            })
          }
        }
        this.updateOption(model).then(success => {
          if (success) {
            this.model = deepCopy({}, this.option)
          }
        })
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~@/assets/stylus/vars/index'
  @import '~@/assets/stylus/mixins/index'

  .setting-page {
    padding-bottom 100px

    .banner-item
    .desc-item
    .hobby-item
    .experience-item
    .skill-item
    .links-item {
      position relative
      margin-bottom 16px
      transition all .5s $ease
      button {
        margin-left 16px
      }
    }

    .experience-item
    .links-item {
      .main {
        margin-bottom 16px
      }
    }

    .links-item {
      .extra {
        margin-bottom 16px
      }
      .avatar {
        width 40px
        height @width
        border-radius 50%
      }
    }
  }
</style>
