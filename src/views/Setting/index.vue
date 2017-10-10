<template>
  <section class="setting-page">
    <FormEdit
      @cancel="handleCancel"
      @submit="handleSubmit">
      <el-row :gutter="24">
        <el-col :span="16">
          <el-card >
            <div slot="header">
              <span>基本设置</span>
            </div>
            <el-form ref="form" :model=""></el-form>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card></el-card>
          <el-card></el-card>
        </el-col>
      </el-row>
    </FormEdit>
  </section>
</template>

<script>
  import { FormEdit } from '@/components/Common'

  export default {
    name: 'Setting',
    components: {
      FormEdit
    },
    data () {
      return {
        model: {}
      }
    },
    methods: {
      handleCancel () {
        this.$router.back()
      },
      handleSubmit () {}
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~@/assets/stylus/vars/index'
  @import '~@/assets/stylus/mixins/index'

  .setting-page {
    
  }
</style>
