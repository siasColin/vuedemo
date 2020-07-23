<template>
  <el-container style="height: 100%;">
    <el-header class="el-header">
      <div class="logodiv">
        <img src="../assets/logo.png" alt="头像" />
        <span style="font-size: 20px;">后台管理系统</span>
      </div>
      <div>
        <el-dropdown @command="handleLogin">
          <i class="el-icon-setting" style="margin-right: 15px;"></i>
          <el-dropdown-menu>
            <el-dropdown-item command="userInfo">查看</el-dropdown-item>
            <el-dropdown-item command="logout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <span>colin</span>
      </div>
    </el-header>
    <el-container>
      <el-aside
        :width="isCollapse ? '64px' : '200px'"
        style="background-color: rgb(238, 241, 246);"
      >
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
          :default-openeds="['1', '3']"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
        >
          <el-submenu index="1">
            <template slot="title"
              ><i class="el-icon-message"></i>
              <span>一级导航1</span>
            </template>
            <el-menu-item index="1-1">二级导航1.1</el-menu-item>
            <el-menu-item index="1-2">二级导航1.2</el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title"
              ><i class="el-icon-message"></i>
              <span>一级导航2</span>
            </template>
            <el-menu-item index="2-1">二级导航2.1</el-menu-item>
            <el-submenu index="2-2">
              <template slot="title"
                ><i class="el-icon-message"></i>二级导航2.2
              </template>
              <el-menu-item index="2-2-1">三级导航2.2.1</el-menu-item>
              <el-menu-item index="2-2-2">三级导航2.2.2</el-menu-item>
            </el-submenu>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <el-table :data="tableData">
          <el-table-column prop="date" label="日期" width="140">
          </el-table-column>
          <el-table-column prop="name" label="姓名" width="120">
          </el-table-column>
          <el-table-column prop="address" label="地址"></el-table-column>
        </el-table>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Storage from '../assets/js/storage'
export default {
  data() {
    const item = {
      date: '2020-07-23',
      name: 'colin',
      address: '北京市海淀区大钟寺'
    }
    return {
      tableData: Array(10).fill(item),
      isCollapse: false
    }
  },
  methods: {
    handleLogin(command) {
      if (command === 'logout') {
        Storage.localRemove('Authorization')
        Storage.localRemove('Refresh_token')
        this.$router.push('/login')
      }
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    }
  }
}
</script>

<style lang="less" scoped>
.el-header {
  background-color: #b3c0d1;
  color: #333;
  line-height: 60px;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
}
.logodiv {
  display: flex;
  align-items: center;
  img {
    height: 90%;
    border-radius: 50%;
    background-color: #eeeeee;
  }
  span {
    margin-left: 10px;
  }
}
.el-aside {
  color: #333;
}
.toggle-button {
  background-color: #eef1f6;
  font-size: 10px;
  line-height: 24px;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
