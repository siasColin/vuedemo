<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/main' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片视图区-->
    <el-card>
      <!--搜索与添加区-->
      <user-search
        :getUserList="getUserList"
        @updataQuaryData="updataQuaryData"
      ></user-search>
      <!--数据表格区-->
      <el-table :data="userList" border style="width: 100%;">
        <el-table-column prop="userName" label="用户名" width="180">
        </el-table-column>
        <el-table-column prop="userEmail" label="邮箱" width="180">
        </el-table-column>
        <el-table-column prop="phoneNumber" label="电话"> </el-table-column>
        <el-table-column
          prop="userGender"
          label="性别"
          :formatter="formatGender"
        >
        </el-table-column>
        <el-table-column label="操作" align="center">
          <!--自 2.6.0 起有所更新。已废弃的使用 slot-scope,2.X虽以废弃但可以用，vue3中将不可用-->
          <!--          <template slot-scope="scope">-->
          <template v-slot:default="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="userDelete(scope.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页区-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[2, 5, 10, 20]"
        :page-size="2"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!--修改用户的对话框-->
    <user-edit ref="UserEditRef" :getUserList="getUserList"></user-edit>
  </div>
</template>

<script>
import UserSearch from './UserSearch'
import UserEdit from './UserEdit'
export default {
  components: {
    UserEdit,
    UserSearch
  },
  created() {
    this.getUserList()
  },
  data() {
    return {
      query: {
        userName: '',
        page: 1,
        limit: 2
      },
      total: 0,
      // 用户列表数据
      userList: []
    }
  },
  methods: {
    updataQuaryData(queryData) {
      this.query.userName = queryData.userName
    },
    async getUserList() {
      const { data: res } = await this.$axios.get('userManage/userList', {
        params: this.query
      })
      if (res.returnCode != '0') {
        this.userList = []
        return this.$message.error(res.returnMessage)
      }
      this.total = res.total
      this.userList = res.data
    },
    /* 监听分页每页记录数改变事件 */
    handleSizeChange(pageSize) {
      this.query.limit = pageSize
      this.getUserList()
    },
    /* 监听分页，当前页面改变事件 */
    handleCurrentChange(pageNum) {
      this.query.page = pageNum
      this.getUserList()
    },
    /* 格式化table表格中的性别列 */
    formatGender(row, column) {
      return row.userGender == '0'
        ? '男'
        : row.userGender == '1'
        ? '女'
        : '未知'
    },
    /* 删除用户 */
    async userDelete(userid) {
      console.log(userid)
      const confirmResult = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch((error) => error)
      // 点击确认 confirmResult = confirm
      if (confirmResult !== 'confirm') {
        this.$message.info('已取消删除')
      } else {
        // 执行删除
        const { data: res } = await this.$axios.delete('userManage/user', {
          params: { ids: userid }
        })
        if (res.returnCode != '0') {
          return this.$message.error('删除用户失败！')
        }
        this.$message.success('删除用户成功！')
        // 重新获取用户列表数据
        this.getUserList()
      }
    },
    /* 打开编辑用户Dialog层 */
    showEditDialog(userid) {
      this.$refs.UserEditRef.showEditDialog(userid)
    }
  }
}
</script>

<style lang="less" scoped></style>
