<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.title" placeholder="Title" style="width: 200px;" class="filter-item" @keyup.enter.native="fetchData" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="fetchData">
        Search
      </el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="序号" width="95">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="标题">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>

      <el-table-column label="类型" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.typeName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="推荐" align="center" width="130">
        <template slot-scope="scope">
          <el-button v-if="scope.row.recommend" type="success" circle icon="el-icon-check" size="mini" @click="switchRecommend(scope.row)" />
          <el-button v-else type="warning" circle icon="el-icon-close" size="mini" @click="switchRecommend(scope.row)" />
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="发布状态" width="120" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.published | statusFilter">{{ scope.row.published ? '发布' : '草稿' }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" prop="created_at" label="更新时间" width="220">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ time(scope.row.updateTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200">
        <template slot-scope="scope">
          <el-button type="success" size="small" icon="el-icon-edit" @click="editBlog(scope.row.id)">编辑</el-button>
          <el-button type="danger" size="small" icon="el-icon-delete" @click="remove(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="listQuery.page"
      :page-sizes="[2, 5, 10, 15, 20]"
      :page-size="listQuery.size"
      :total="total"
      background
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { getList, removeArticle, updateRecommend } from '@/api/article'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        true: 'success',
        false: 'gray'
      }
      return statusMap[status]
    }
  },
  inject: ['reload'],
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        title: '',
        page: 1,
        size: 5
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getList(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleSizeChange(newSize) {
      this.listQuery.size = newSize
      this.fetchData()
    },
    handleCurrentChange(newPage) {
      this.listQuery.page = newPage
      this.fetchData()
    },
    time(time) { // 时间戳转换
      return time.substr(0, 10)
    },
    editBlog(id) { // 编辑博客
      this.$router.push('/blog/edit/' + id)
    },
    remove(id) {
      this.$confirm('此操作将删除该博客，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await removeArticle(id)
        if (res.code === 20000) {
          this.reload()
          return this.$message({
            type: 'success',
            message: res.message || '删除成功'
          })
        }
      }).catch(() => {
        this.$message({
          message: '取消删除',
          type: 'info'
        })
      })
    },
    async switchRecommend(row) {
      const res = await updateRecommend(row.id, !row.recommend)
      if (res.code === 20000) {
        this.reload()
        return this.$message({
          type: 'success',
          message: res.message || '修改成功'
        })
      }
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
</style>
