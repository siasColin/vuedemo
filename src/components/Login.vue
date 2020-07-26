<template>
  <div class="login_container">
    <div class="login_box">
      <!--头像区-->
      <div class="avatar_box">
        <img src="../assets/logo.png" />
      </div>
      <!--登录表单区-->
      <el-form
        ref="loginFormRef"
        label-width="0px"
        :model="loginForm"
        :rules="loginRules"
        class="login_form"
      >
        <!--用户名-->
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="iconfont icon-user"
          ></el-input>
        </el-form-item>
        <!--密码-->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            prefix-icon="iconfont icon-3702mima"
          ></el-input>
        </el-form-item>
        <!--按钮区-->
        <el-form-item class="btns">
          <el-button type="primary" @click="doLogin('loginFormRef')"
            >登录</el-button
          >
          <el-button type="info" @click="resetLoginForm('loginFormRef')"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      /* 登录表单的数据绑定对象 */
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    doLogin(formRef) {
      this.$refs[formRef].validate((valid) => {
        if (valid) {
          var params = this.loginForm
          this.$axios
            .post('login', params)
            .then((res) => {
              if (res.data.returnCode === '0') {
                this.$router.push('/main')
              } else {
                // Element 为 Vue.prototype 添加了全局方法 $message。因此在 vue instance 中可以采用本页面中的方式调用 Message
                return this.$message({
                  showClose: true,
                  message: res.data.returnMessage,
                  type: 'warning'
                })
              }
            })
            .catch((error) => {
              console.log('登录失败' + error)
              return this.$message({
                showClose: true,
                message: '登录失败' + error,
                type: 'warning'
              })
            })
        } else {
          return false
        }
      })
    },
    resetLoginForm(formRef) {
      this.$refs[formRef].resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: #ffffff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eeeeee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #dddddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #ffffff;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eeeeee;
    }
  }
}

.btns {
  display: flex;
  justify-content: flex-end;
}

.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
</style>
