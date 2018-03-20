<template>
  <div id="app">
    <div class="container">
      <form class="SignIn">
        <h2 class="SignIn-heading">サインイン</h2>
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
        <form v-on:submit.prevent="SignIn">
          <input type='submit' value='サインイン'>
        </form>
        <form v-on:submit.prevent="SignUp">
          <input type='submit' value='サインアップ'>
        </form>
      </form>
    </div>
  </div>
</template>

<script>
import dbmodel from '../models/dbmodel.js'

export default {
  name: 'SignIn',
  data: function () {
    return {
      userName: '',
      passWord: ''
    }
  },
  methods: {
    SignIn: function () {
      console.log('Signin')
      var params = {
        userName: this.userName,
        passWord: this.passWord
      }
      console.log(params)
      dbmodel.SignIn(params)
        .then(() => {
          this.$router.push('/List')
        })
        .catch((err) => {
          console.log(err)
          this.userName = ''
          this.passWord = ''
        })
    },
    SignUp: function () {
      this.$router.push('/SignUp')
    }
  },
  mounted () {
    console.log('mounted')
  }
}
</script>
