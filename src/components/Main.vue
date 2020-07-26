<template>
  <el-container style="height: 100%;">
    <el-header class="el-header">
      <div class="logodiv">
        <img src="../assets/logo.png" alt="头像" />
        <span style="font-size: 20px;">后台管理系统</span>
      </div>
      <div>
        <el-dropdown @command="handleLogin">
          <i
            class="el-icon-setting"
            style="margin-right: 15px; color: #ffffff;"
          ></i>
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
          background-color="#eef1f6"
          :default-active="activePath"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
        >
          <!--循环一级菜单-->
          <template v-for="firstMenu in menulist">
            <!--判断一级菜单是否有子菜单（没有的情况）-->
            <el-menu-item
              :index="'/' + firstMenu.moduleUrl"
              :key="firstMenu.id"
              v-if="!firstMenu.children"
              @click="saveNavState('/' + firstMenu.moduleUrl)"
            >
              <i class="el-icon-s-operation"></i>
              <span slot="title">{{ firstMenu.moduleName }}</span>
            </el-menu-item>
            <!--判断一级菜单是否有子菜单（有的情况）-->
            <el-submenu
              :index="firstMenu.id"
              :key="firstMenu.id"
              v-if="firstMenu.children"
            >
              <template slot="title"
                ><i class="el-icon-s-operation"></i>
                <span>{{ firstMenu.moduleName }}</span>
              </template>
              <!--循环二级菜单-->
              <template v-for="secondMenu in firstMenu.children">
                <!--判断二级菜单是否有子菜单（没有的情况）-->
                <el-menu-item
                  :index="'/' + secondMenu.moduleUrl"
                  v-if="!secondMenu.children"
                  :key="secondMenu.id"
                  @click="saveNavState('/' + secondMenu.moduleUrl)"
                >
                  <template slot="title"
                    ><i class="el-icon-menu"></i
                    ><span>{{ secondMenu.moduleName }}</span>
                  </template>
                </el-menu-item>
                <!--判断二级菜单是否有子菜单（有的情况）-->
                <el-submenu
                  :index="secondMenu.id"
                  v-if="secondMenu.children"
                  :key="secondMenu.id"
                >
                  <template slot="title"
                    ><i class="el-icon-menu"></i
                    ><span>{{ secondMenu.moduleName }}</span>
                  </template>
                  <!--循环三级菜单-->
                  <el-menu-item
                    :index="'/' + thirdMenu.moduleUrl"
                    v-for="thirdMenu in secondMenu.children"
                    :key="thirdMenu.id"
                    @click="saveNavState('/' + thirdMenu.moduleUrl)"
                    ><span>{{ thirdMenu.moduleName }}</span></el-menu-item
                  >
                </el-submenu>
              </template>
            </el-submenu>
          </template>
        </el-menu>
      </el-aside>
      <el-main>
        <!--Main 子路由显示区-->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Storage from '../assets/js/storage'
export default {
  data() {
    return {
      activePath: Storage.sessionGet('activePath'),
      isCollapse: false,
      // 左侧菜单数据
      menulist: []
    }
  },
  created() {
    this.getMenuList()
  },
  methods: {
    async getMenuList() {
      const { data: res } = await this.$axios.get('menuManage/menus')
      this.menulist = res.data
    },
    handleLogin(command) {
      if (command === 'logout') {
        Storage.localRemove('Authorization')
        Storage.localRemove('Refresh_token')
        this.$router.push('/login')
      }
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    saveNavState(activePath) {
      this.activePath = activePath
      Storage.sessionSet('activePath', activePath)
    }
  }
}
</script>

<style lang="less" scoped>
.el-header {
  background-color: #3771bb;
  color: #ffffff;
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
