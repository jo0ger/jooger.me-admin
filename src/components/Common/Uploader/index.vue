<template>
  <div class="uploader">
    <div class="upload-img-wrapper mb-md" v-if="url">
      <img :src="url" alt="" @click.prevent="preview">
    </div>
    <div class="uploader-action">
      <el-upload
        style="width: 100%"
        action=""
        :show-file-list="false"
        accept="image/png,image/jpeg,image/gif"
        :http-request="upload">
        <el-row :gutter="16">
          <el-col :span="12">
            <el-button type="primary" icon="el-icon-upload" size="small" :loading="uploading">
              {{ url ? '更换' : '上传' }}
            </el-button>
          </el-col>
          <el-col :span="12">
            <el-button type="danger" icon="el-icon-delete" size="small" v-if="url" @click.native="_delete">删除</el-button>
          </el-col>
        </el-row>
      </el-upload>
    </div>
  </div>
</template>

<script>
  import { api } from '@/service'

  export default {
    name: 'Uploader',
    props: {
      url: {
        type: String,
        default: ''
      },
      name: {
        type: String,
        default: new Date().getTime().toString()
      }
    },
    data () {
      return {
        action: '',
        uploading: false
      }
    },
    methods: {
      upload (upload) {
        if (!upload.file) {
          return this.$message.warning('请选择图片')
        }
        this.uploading = true
        const filename = upload.file.name.split('.').join(`_${new Date().getTime()}.`)
        api.aliyun.upload('img/' + this.name + filename, upload.file).then(res => {
          this.uploading = false
          this.$emit('on-success', res.url)
        })
      },
      preview () {
        this.$emit('on-preview', this.url)
      },
      _delete (event) {
        event.preventDefault()
        event.stopPropagation()
        this.$emit('on-delete')
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~@/assets/stylus/vars/index'
  @import '~@/assets/stylus/mixins/index'

  .uploader {
    text-align center

    .upload-img-wrapper {
      margin-bottom 16px
      img {
        max-width 100%
        cursor pointer
      }
    }  
  }
</style>
