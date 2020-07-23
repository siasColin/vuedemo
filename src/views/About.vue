<template>
  <div class="about">
      <input name="username" id="username" v-model="username">
      <input name="password" id="password" v-model="password">
      <button v-on:click="login">登录</button>
  </div>
</template>

<script>
export default {
  data () {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    login: function (event) {
      const username = this.username.trim()
      const password = this.password.trim()
      const params = { username, password }
      this.$axios.post('auth/login', params)
        .then(res => {
          if (res.data.returnCode === '0') {
            alert('登录成功')
          } else {
            alert(res.data.returnMessage)
          }
        }).catch(error => {
          alert('登录失败' + error)
        })
    }
  }
}
</script>
