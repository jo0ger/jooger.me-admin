<template>
  <el-card class="auth-info-page">
    <el-tabs tab-position="left" v-model="currentTab">
      <el-tab-pane label="基本信息" name="0">
        <el-form ref="form" :model="model" label-width="80px" style="margin-left: 24px">
          <el-form-item label="ID">
            <span>{{ authInfo._id }}</span>
          </el-form-item>
          <el-form-item label="更新时间">
            <i class="el-icon-time"></i>
            <span style="margin-left: 8px">{{ authInfo.updatedAt | fmtDate('yyyy-MM-dd hh:mm:ss') }}</span>
          </el-form-item>
          <el-form-item label="登录名">
            <span>{{ authInfo.name }}</span>
          </el-form-item>
          <el-form-item label="Slogan">
            <el-input v-model="model.slogan" placeholder="请输入Slogan"></el-input>
          </el-form-item>
          <el-form-item label="头像">
            <el-row>
              <el-col :span="20">
                <el-input v-model="model.avatar" placeholder="请输入头像URL"></el-input>
              </el-col>
              <el-col :span="2">
                <el-button style="margin-left: 16px" type="primary" :disabled="!model.avatar" size="mini" plain round icon='el-icon-search' @click="handlePreviewAvatar"></el-button>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSaveInfo">保存</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="修改密码" name="1">
        <el-form :model="pwdModel" label-width="80px" style="margin-left: 24px">
          <el-form-item label="原密码">
            <el-input v-model.trim="pwdModel.old" type="password" placeholder="请输入原密码"></el-input>
          </el-form-item>
          <el-form-item label="新密码">
            <el-input v-model.trim="pwdModel.new" type="password" placeholder="请输入新密码"></el-input>
          </el-form-item>
          <el-form-item label="确认密码">
            <el-input v-model.trim="pwdModel.confirm" type="password" placeholder="请输入确认密码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSavePwd">保存</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <el-dialog
      title="头像预览"
      width="40%"
      center
      v-if="model"
      :visible.async="avatarPreview"
      @close="handleClosePreviewAvatar">
      <p style="margin-bottom: 16px">{{ model.avatar }}</p>
      <img :src="model.avatar" alt="" width="100%">
    </el-dialog>
  </el-card>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import { deepCopy, imageLoad } from '@/utils'

  export default {
    name: 'Auth',
    data () {
      return {
        currentTab: '0',
        model: null,
        pwdModel: {
          old: '',
          new: '',
          confirm: ''
        },
        avatarPreview: false
      }
    },
    computed: {
      ...mapGetters({
        authInfo: 'auth/info'
      })
    },
    created () {
      this.model = deepCopy({}, this.authInfo)
    },
    methods: {
      ...mapActions({
        updateAuthInfo: 'auth/update'
      }),
      handlePreviewAvatar () {
        imageLoad(this.model.avatar, {
          fail: err => {
            this.$message.error(err ? err.message : '头像加载失败')
          }
        })
        this.avatarPreview = true
      },
      handleClosePreviewAvatar () {
        this.avatarPreview = false
      },
      handleSaveInfo () {
        const { name, avatar, slogan } = this.model
        this.updateAuthInfo({ name, avatar, slogan })
      },
      handleSavePwd () {
        if (!this.pwdModel.old) {
          return this.$message.error('请输入原密码')
        } else if (!this.pwdModel.new) {
          return this.$message.error('请输入新密码')
        } else if (this.pwdModel.new !== this.pwdModel.confirm) {
          return this.$message.error('确认密码与新密码不符')
        }
        this.updateAuthInfo({
          password: this.pwdModel.new,
          old_password: this.pwdModel.old
        })
      }
    }
  }
</script>
