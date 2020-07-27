<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-input
          placeholder="请输入内容"
          v-model="userName"
          clearable
          @clear="userSearch"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="userSearch"
          ></el-button>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="updateAddDialogVisible"
          >添加</el-button
        >
      </el-col>
    </el-row>
    <user-save ref="UserSave" :getUserList="getUserList"></user-save>
  </div>
</template>

<script>
import UserSave from './UserSave'
export default {
  name: 'UserSearch',
  components: {
    UserSave
  },
  props: {
    getUserList: Function
  },
  data() {
    return {
      addDialogVisible: false,
      userName: ''
    }
  },
  methods: {
    async userSearch() {
      const searchData = { userName: this.userName }
      await this.$emit('updataQuaryData', searchData)
      this.getUserList()
    },
    updateAddDialogVisible() {
      this.$refs.UserSave.addDialogVisible = true
    }
  }
}
</script>

<style lang="less" scoped></style>
