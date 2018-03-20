<template>
  <div id="app">
    <div class="container">
      <form class="login">
        <h2 class="login-heading">ログイン</h2>
        <form id="userName" class="userName">
          <input name="query" v-model="userName" placeholder="UserName">
        </form>
        <form id="passWord" class="passWord">
          <input name="query" v-model="passWord" placeholder="Password">
        </form>
        <br/>
        <!--
          v-on:submit.prevent の修飾子を指定しないと、クリック時にページリロードが
          発生し、初回のクリックでログインされず、ページ再描画される
        -->
        <form v-on:submit.prevent="login">
          <input type='submit' value='ログイン'>
        </form>
        <!-- <button v-on:click='login'>ログイン</button> -->
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
    login: function () {
      console.log('login')
      var params = {
        userName: this.userName,
        passWord: this.passWord
      }
      console.log(params)
      dbmodel.login(params)
        .then(() => {
          this.$router.push('List')
        })
        .catch((err) => {
          console.log(err)
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
