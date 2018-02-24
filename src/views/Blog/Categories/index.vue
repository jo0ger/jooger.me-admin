<template>
  <el-card class="blog-categories-page">
    <el-form :inline="true" :model="categoryFilter" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="categoryFilter.name" @keyup.native.enter="handleSearch" size="mini" placeholder="请输入..."></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch" icon="el-icon-search" size="mini">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      class="categories-table"
      v-loading="categoryListFetching"
      element-loading-text="LOADING"
      :data="categoryList">
      <el-table-column
        type="index"
        label="序号"
        width="50">
      </el-table-column>
      <el-table-column
        prop="name"
        label="名称"
        width="200">
      </el-table-column>
      <el-table-column
        prop="description"
        label="描述">
        <template slot-scope="scope">
          <p>{{ scope.row.description || '--' }}</p>
        </template>
      </el-table-column>
      <el-table-column
        prop="count"
        label="文章数"
        width="100">
      </el-table-column>
      <el-table-column
        prop="list"
        label="排序"
        width="100">
      </el-table-column>
      <el-table-column
        prop="createdAt"
        label="创建日期"
        width="200">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span>{{ scope.row.createdAt | fmtDate('yyyy-MM-dd hh:mm:ss') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button
            class="operate edit-btn"
            type="text"
            @click="handleEdit(scope.$index, scope.row)">
            <i class="iconfont icon-edit"></i>
          </el-button>
          <el-button
            class="operate delete-btn"
            type="text"
            @click="handleDelete(scope.$index, scope.row)">
            <i class="iconfont icon-delete"></i>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="分类编辑"
      width="500px"
      center
      v-if="model"
      :visible.async="!!model"
      @close="handleCloseEditBox">
      <el-form ref="form" :model="model" label-width="60px">
        <el-form-item label="名称">
          <el-input v-model="model.name" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input type="textarea" :rows="4" v-model="model.description" placeholder="请输入描述"></el-input>
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="model.list" :step="1" :min="1"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="handleCloseEditBox">取 消</el-button>
        <el-button type="primary" @click="handleEditCategoryConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import { deepCopy } from '@/utils'

  export default {
    name: 'Blog-Category',
    data () {
      return {
        categoryFilter: {
          name: ''
        },
        model: null
      }
    },
    computed: {
      ...mapGetters({
        categoryList: 'category/list',
        categoryListFetching: 'category/listFetching'
      })
    },
    created () {
      this.fetchCategorylist()
    },
    methods: {
      ...mapActions({
        fetchCategorylist: 'category/fetchList',
        editCategory: 'category/edit',
        deleteCategory: 'category/delete'
      }),
      handleSearch () {
        const params = {}
        if (this.categoryFilter.name) {
          params.keyword = this.categoryFilter.name
        }
        this.fetchCategorylist(params)
      },
      handleEdit (index, data) {
        this.model = deepCopy({}, data)
      },
      async handleEditCategoryConfirm () {
        const success = await this.editCategory({
          id: this.model._id,
          model: {
            name: this.model.name,
            description: this.model.description,
            list: this.model.list
          }
        })
        if (success) {
          this.handleCloseEditBox()
        }
      },
      handleDelete (index, data) {
        this.$confirm('<strong>此操作将永久删除该标签，是否继续?</strong>', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          dangerouslyUseHTMLString: true,
          type: 'warning',
          center: true
        }).then(async () => {
          await this.deleteCategory(data._id)
          await this.fetchCategorylist()
        }).catch(() => {})
      },
      handleCloseEditBox () {
        this.model = null
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~@/assets/stylus/vars/index'
  @import '~@/assets/stylus/mixins/index'

  .categories-table {
    font-size $font-size-base

    .operate {
      opacity 1
      transform scale(1)
      transition all .3s $ease

      &:hover {
        opacity .8
        transform scale(.9)
      }
    }

    .edit-btn {
      color $base-color
    }
    .delete-btn {
      color $red
    }
  }
</style>
