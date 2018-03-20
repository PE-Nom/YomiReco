<template>
  <div id="app">
    <div class="container">
      <form class="SingUp">
        <h2 class="sign-up-heading">サインアップ</h2>
        <form id="emailAddr" class="emailAddr">
          <input name="query" v-model="emailAddr" placeholder="E-mail">
        </form>
        <form id="userName" class="userName">
          <input name="query" v-model="userName" placeholder="UserName">
        </form>
        <form id="passWord" class="passWord">
          <input name="query" v-model="passWord" placeholder="Password">
        </form>
        <br/>
        <form v-on:submit.prevent="SignUp">
          <input type='submit' value='アカウントの作成'>
        </form>
      </form>
    </div>
  </div>
</template>

<script>
import dbmodel from '../models/dbmodel.js'

export default {
  name: 'SignUp',
  data: function () {
    return {
      emailAddr: '',
      userName: '',
      passWord: ''
    }
  },
  methods: {
    SignUp: function () {
      console.log('SignUp')
      var params = {
        email: this.emailAddr,
        userName: this.userName,
        passWord: this.passWord
      }
      dbmodel.SignUp(params)
        .then(() => {
          this.$router.push('/Confirm')
        })
        .catch((err) => {
          console.log(err)
          this.emailAddr = ''
          this.userName = ''
          this.passWord = ''
        })
    }
  },
  mounted () {
    console.log('mounted')
  }
}
</script>
