<template>
  <div class="app-container">
    <el-button type="success" class="add-btn" icon="el-icon-plus" @click="dialogVisible = true" />
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="序号" width="120">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>

      <el-table-column min-width="300px" label="类别" align="center">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.name" class="edit-input" size="small" />
            <el-button
              class="cancel-btn"
              size="small"
              icon="el-icon-refresh"
              type="warning"
              @click="cancelEdit(row)"
            >
              取消
            </el-button>
          </template>
          <span v-else>{{ row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column label="更新时间" align="center" width="180">
        <template slot-scope="scope">
          {{ scope.row.updateTime | timeFilter }}
        </template>
      </el-table-column>

      <el-table-column label="博客数量" align="center">
        <template slot-scope="scope">
          {{ scope.row.blogNum }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="240">
        <template slot-scope="{row}">
          <el-button
            v-if="row.edit"
            type="success"
            size="small"
            icon="el-icon-circle-check"
            @click="confirmEdit(row)"
          >
            确定
          </el-button>
          <el-button
            v-else
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="row.edit=!row.edit"
          >
            编辑
          </el-button>
          <el-button type="danger" size="small" icon="el-icon-delete" @click="deleteType(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      title="添加分类"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <el-form ref="postForm" :model="postForm" :rules="rules" label-width="80px">
        <el-form-item label="类型名称" prop="name">
          <el-input v-model="postForm.name" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="canclePost()">取 消</el-button>
        <el-button type="primary" @click="postType()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, addType, updateType, removeType } from '@/api/type/admin/type'

export default {
  filters: {
    timeFilter(time) {
      return time.substr(0, 10)
    }
  },
  inject: ['reload'],
  data() {
    return {
      list: [],
      total: 0,
      listLoading: false,
      dialogVisible: false,
      postForm: {
        name: ''
      },
      rules: {
        name: [
          { required: true, message: '类型名称不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      const { data } = await fetchList()
      this.list = data.map(v => {
        this.$set(v, 'edit', false)
        v.originalName = v.name
        return v
      })
      this.listLoading = false
    },
    canclePost() {
      this.dialogVisible = false
      this.$refs.postForm.resetFields()
    },
    // 添加提交类型事件
    postType() {
      this.$refs.postForm.validate(async valid => {
        if (valid) {
          const res = await addType(this.postForm)
          if (res.code !== 20000) {
            return this.$message({
              message: res.message || '添加失败',
              type: 'error'
            })
          }
          this.reload()
          this.dialogVisible = false
          this.$message({
            message: res.message || '添加成功',
            type: 'success'
          })
        }
      })
    },
    // 取消修改 Type
    cancelEdit(row) {
      row.name = row.originalName
      row.edit = false
      this.$message({
        message: '修改已经取消',
        type: 'warning'
      })
    },
    // 确认修改 Type
    async confirmEdit(row) {
      row.edit = false
      row.updateTime = new Date().toJSON()
      row.originalName = row.name
      const { code, message } = await updateType(row)
      if (code !== 20000) {
        return this.$message({
          message: message || '修改失败',
          type: 'error'
        })
      }
      this.$message({
        message: '修改成功',
        type: 'success'
      })
    },
    // 删除 Type
    deleteType(row) {
      this.$confirm('此操作将删除改类别，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await removeType(row.id)
        if (res.code !== 20000) {
          return this.$message({
            type: 'error',
            message: res.message | '删除失败'
          })
        }
        this.reload()
        this.$message({
          type: 'success',
          message: '删除成功'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>
<style scoped>
.el-pagination{
  margin: 50px 0;
}
.filter-container {
    padding-bottom: 10px;
}
.filter-container .filter-item {
    display: inline-block;
    vertical-align: middle;
    margin-bottom: 10px;
}
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
.add-btn{
  position: fixed;
  z-index: 2;
  right: -2px;
  font-size: 24px;
  padding: 6px 10px;
}
</style>
