<template>
  <section class="setting-page">
    <FormEdit
      :loading="optionEditing"
      :showCancel="false"
      @submit="handleSubmit"
      v-if="model">
      <el-row :gutter="24">
        <el-col :span="12">
          <el-card >
            <div slot="header">
              <span>基本设置</span>
            </div>
            <el-form ref="form" :model="model" label-width="80px">
              <el-form-item label="标题">
                <el-input v-model="model.title" placeholder="请输入标题"></el-input>
              </el-form-item>
              <el-form-item label="副标题">
                <el-input v-model="model.subtitle" placeholder="请输入副标题"></el-input>
              </el-form-item>
              <el-form-item label="轮播图">
                <el-row class="banner-item" v-for="(banner, index) in model.banners" :key="index">
                  <el-col :span="18">
                    <el-input v-model="model.banners[index]" placeholder="请输入URL"></el-input>
                  </el-col>
                  <el-col :span="4">
                    <el-row :gutter="16">
                      <el-col :span="12">
                        <el-button type="danger" size="mini" plain round icon='el-icon-minus' @click="handleDeleteItem('banners', index)"></el-button>
                      </el-col>
                      <el-col :span="12">
                        <el-button type="primary" size="mini" plain round icon='el-icon-search' @click="handlePreview(banner)"></el-button>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="20">
                    <el-button type="primary" size="small" icon='el-icon-plus' style="width: 100%" @click="handleAddItem('banners')">添加</el-button>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item label="错误图">
                <el-row>
                  <el-col :span="20">
                    <el-input v-model="model.errorBanner" placeholder="请输入URL"></el-input>
                  </el-col>
                  <el-col :span="2">
                    <el-button style="margin-left: 16px" type="primary" size="mini" plain round icon='el-icon-search' @click="handlePreview(model.errorBanner)"></el-button>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-form>
          </el-card>
          <el-card >
            <div slot="header">
              <span>第三方设置</span>
            </div>
            <el-form ref="form" :model="model" label-width="80px">
              <el-form-item label="音乐ID">
                <el-row>
                  <el-col :span="20">
                    <el-input v-model="model.musicId" placeholder="请输入音乐ID"></el-input>
                  </el-col>
                  <el-col :span="2">
                    <el-button style="margin-left: 16px" type="primary" size="mini" plain round icon='el-icon-search' @click="handleViewMusic"></el-button>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
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
                <el-row class="desc-item" v-for="(desc, index) in model.description" :key="index">
                  <el-col :span="20">
                    <el-input type="textarea" :rows="2" v-model="model.description[index]" placeholder="请输入简介"></el-input>
                  </el-col>
                  <el-col :span="2">
                    <el-button type="danger" size="mini" plain round icon='el-icon-minus' @click="handleDeleteItem('description', index)"></el-button>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="20">
                    <el-button type="primary" size="small" icon='el-icon-plus' style="width: 100%" @click="handleAddItem('description')">添加</el-button>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item label="爱好" class="hobby">
                <el-row class="hobby-item" v-for="(hobby, index) in model.hobby" :key="index">
                  <el-col :span="10">
                    <el-input v-model="model.hobby[index].name" placeholder="名称"></el-input>
                  </el-col>
                  <el-col :span="10" style="margin-left: 16px">
                    <el-input v-model="model.hobby[index].icon" placeholder="iconfont图标"></el-input>
                  </el-col>
                  <el-col :span="2">
                    <el-button type="danger" size="mini" plain round icon='el-icon-minus' @click="handleDeleteItem('hobby', index)"></el-button>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="20">
                    <el-button type="primary" size="small" icon='el-icon-plus' style="width: 100%" @click="handleAddItem('hobby')">添加</el-button>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item label="经历" class="experience">
                <el-row class="experience-item" v-for="(experience, index) in model.experience" :key="index">
                  <el-col :span="20">
                    <el-row :gutter="16" class="main">
                      <el-col :span="12">
                        <el-input v-model="model.experience[index].time" placeholder="时间"></el-input>
                      </el-col>
                      <el-col :span="12">
                        <el-input v-model="model.experience[index].title" placeholder="地点"></el-input>
                      </el-col>
                    </el-row>
                    <el-row class="extra">
                      <el-col :span="24">
                        <el-input v-model="model.experience[index].subtitle" placeholder="补充"></el-input>
                      </el-col>
                    </el-row>
                  </el-col>
                  <el-col :span="2">
                    <el-button type="danger" size="mini" plain round icon='el-icon-minus' @click="handleDeleteItem('experience', index)"></el-button>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="20">
                    <el-button type="primary" size="small" icon='el-icon-plus' style="width: 100%" @click="handleAddItem('experience')">添加</el-button>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item label="技能" class="skill">
                <el-row class="skill-item" v-for="(skill, index) in model.skill" :key="index">
                  <el-col :span="10">
                    <el-input v-model="model.skill[index].title" placeholder="名称"></el-input>
                  </el-col>
                  <el-col :span="5" style="margin-left: 16px">
                    <el-input v-model="model.skill[index].level" placeholder="水平百分比数字"></el-input>
                  </el-col>
                  <el-col :span="5" style="margin-left: 16px">
                    <el-input v-model="model.skill[index].icon" placeholder="iconfont图标"></el-input>
                  </el-col>
                  <el-col :span="2">
                    <el-button type="danger" size="mini" plain round icon='el-icon-minus' @click="handleDeleteItem('skill', index)"></el-button>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="20">
                    <el-button type="primary" size="small" icon='el-icon-plus' style="width: 100%" @click="handleAddItem('skill')">添加</el-button>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item label="联系方式" class="contact">
                <el-row class="contact-item" v-for="(contact, index) in model.contact" :key="index">
                  <el-col :span="20">
                    <el-row :gutter="16" class="main">
                      <el-col :span="12">
                        <el-input v-model="model.contact[index].title" placeholder="名称"></el-input>
                      </el-col>
                      <el-col :span="12">
                        <el-input v-model="model.contact[index].icon" placeholder="iconfont图标"></el-input>
                      </el-col>
                    </el-row>
                    <el-row class="extra">
                      <el-col :span="24">
                        <el-input v-model="model.contact[index].url" placeholder="链接"></el-input>
                      </el-col>
                    </el-row>
                  </el-col>
                  <el-col :span="2">
                    <el-button type="danger" size="mini" plain round icon='el-icon-minus' @click="handleDeleteItem('contact', index)"></el-button>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="20">
                    <el-button type="primary" size="small" icon='el-icon-plus' style="width: 100%" @click="handleAddItem('contact')">添加</el-button>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item label="友链" class="links">
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
                    <el-row class="info" v-if="model.links[index].avatar || model.links[index].slogan">
                      <el-col :span="2">
                        <img :src="model.links[index].avatar || defaultAvatar" class="avatar" alt="">
                      </el-col>
                      <el-col :span="22">
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
              </el-form-item>
            </el-form>
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
    <el-dialog
      v-if="model"
      :title="`歌单预览 - ${model.musicId}`"
      center
      width="60%"
      :visible.async="musicPreview"
      @close="handleCloseViewMusic">
      <el-table
        v-loading="musicFetching"
        element-loading-text="LOADING"
        empty-text="未找到该歌单"
        :data="musicList">
        <el-table-column
          prop="name"
          label="名称">
          <template scope="scope">
            <a :href="`https://music.163.com/#/song?id=${scope.row.id}`" target="_blank" :key="scope.row.id">
              {{ scope.row.name }}
            </a>
          </template>
        </el-table-column>
        <el-table-column
          prop="artists"
          label="歌手"
          width="100">
          <template scope="scope">
            <template v-for="(at, index) in scope.row.artists">
              <span :key="at.id" v-if="index !== 0"> / </span>
              <a :href="`https://music.163.com/#/artist?id=${at.id}`" target="_blank" :key="at.id">
                {{ at.name }}
              </a>
            </template>
          </template>
        </el-table-column>
        <el-table-column
          prop="album"
          label="专辑">
          <template scope="scope">
            <a :href="`https://music.163.com/#/album?id=${scope.row.album.id}`" target="_blank">
              <span>{{ scope.row.album.name }}</span>
              <span class="alias" v-if="scope.row.album.tns && scope.row.album.tns.length">
                <span> ( </span>
                <span class="alias-name" v-for="(alias, index) in scope.row.album.tns" :key="index">
                  {{ alias }}
                </span>
                <span> ) </span>
              </span>
            </a>
          </template>
        </el-table-column>
        <el-table-column
          prop="duration"
          label="时长"
          width="80">
          <template scope="scope">
            <i class="el-icon-time"></i>
            <span>{{ getMusicDuration(scope.row.duration) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="lyric"
          label="歌词"
          width="50">
          <template scope="scope">
            <span>{{ !!scope.row.lyric ? '有' : '无' }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </section>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import { FormEdit } from '@/components/Common'
  import { deepCopy, isType } from '@/utils'
  import { api } from '@/service'
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
        previewUrl: '',
        musicPreview: false,
        musicList: [],
        musicFetching: false
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
      getMusicDuration (d = 0) {
        return this.formatTime(Math.floor(d / 1000))
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
          case 'contact':
            this.model[key].push({ title: '', url: '', icon: '' })
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
      async handleViewMusic () {
        this.musicPreview = true
        this.musicFetching = true
        const { success, data } = await api.music.list({
          params: {
            play_list_id: this.model.musicId
          }
        })
        this.musicFetching = false
        if (success) {
          this.musicList = data
        }
      },
      handleCloseViewMusic () {
        this.musicPreview = false
        this.musicList = []
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
    .contact-item
    .links-item {
      position relative
      margin-bottom 16px
      transition all .5s $ease
      button {
        margin-left 16px
      }
    }

    .experience-item
    .contact-item
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
