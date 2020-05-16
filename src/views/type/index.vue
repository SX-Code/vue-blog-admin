<template>
  <div class="app-container">
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
      <el-table-column label="类别" align="center">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="博客数量" align="center">
        <template slot-scope="scope">
          {{ scope.row.blogNum }}
        </template>
      </el-table-column>
      <el-table-column align="center" width="240">
        <template slot-scope="scope">
          <el-button type="success" size="small" icon="el-icon-edit" :data-value="scope.row.id">编辑</el-button>
          <el-button type="danger" size="small" icon="el-icon-delete" :data-value="scope.row.id">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
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
  data() {
    return {
      list: [
        {
          id: 0,
          name: 'Spring',
          blogNum: 12
        },
        {
          id: 1,
          name: 'SpringBoot',
          blogNum: 15
        },
        {
          id: 2,
          name: 'Java',
          blogNum: 24
        },
        {
          id: 3,
          name: '杂谈',
          blogNum: 4
        },
        {
          id: 4,
          name: '操作系统',
          blogNum: 10
        }
      ],
      total: 0,
      listLoading: false
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      // this.listLoading = true
      // getList(this.listQuery).then(response => {
      //   this.list = response.data.records
      //   this.total = response.data.total
      //   this.listLoading = false
      // })
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
      var date = new Date(time * 1000)
      return date.toJSON().substr(0, 10)
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
