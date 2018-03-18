<template>
  <div id="app">
    <div class="container">
      <form class="login">
        <h2 class="login-heading">ログイン</h2>
        <div id="message" style="display:none"></div>
        <form id="userName" class="userName">
          ユーザー名 <input name="query" v-model="userName">
        </form>
        <form id="passWord" class="passWord">
          パスワード <input name="query" v-model="passWord">
        </form>
        <br/>
        <button v-on:click='login'>ログイン</button>
        <button v-on:click='signup'>ユーザーを作成する</button>
      </form>
    </div>
  </div>
</template>

<script>
import dbmodel from '../models/dbmodel.js'

export default{
  name: 'Login',
  data: function () {
    return {
      userName: '',
      passWord: ''
    }
  },
  methods: {
    asyncFuncCall: function (cb, params) {
      return new Promise((resolve, reject) => { return cb(resolve, reject, params) })
    },
    login: async function () {
      console.log('login')
      var params = {
        userName: this.userName,
        passWord: this.passWord
      }
      console.log(params)
      try {
        await this.asyncFuncCall(dbmodel.login, params)
        await this.$router.push('./List')
      } catch (err) {
        console.log(err)
        this.userName = ''
        this.passWord = ''
      }
    },
    signup: function () {
      console.log('signup')
    }
  }
}
</script>
