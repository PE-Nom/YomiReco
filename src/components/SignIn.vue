<template>
  <div id="app">
    <div class="container">
      <form class="SignIn">
        <h2 class="SignIn-heading">サインイン</h2>
        <form id="userName" class="userName">
          <input name="query" v-model="sharedState.state.property.name" placeholder="UserName">
        </form>
        <form id="passWord" class="passWord">
          <input name="query" v-model="sharedState.state.property.pw" placeholder="Password">
        </form>
        <br/>
        <!--
          v-on:submit.prevent の修飾子を指定しないと、クリック時にページリロードが
          発生し、初回のクリックでログインされず、ページ再描画される
        -->
        <form v-on:submit.prevent="SignIn">
          <input type='submit' value='サインイン'>
        </form>
        <form v-on:submit.prevent="PasswordReset">
          <input type='submit' value='パスワードリセット'>
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
import PropertyStore from '../models/store.js'

export default {
  name: 'SignIn',
  data: function () {
    return {
      sharedState: PropertyStore
    }
  },
  methods: {
    SignIn: function () {
      console.log('Signin')
      var params = {
        userName: this.sharedState.state.property.name,
        passWord: this.sharedState.state.property.pw
      }
      console.log(params)
      dbmodel.SignIn(params)
        .then(() => {
          this.$router.push('/List')
        })
        .catch((err) => {
          console.log(err)
          if (err.code === 'UserNotConfirmedException') {
            this.$router.push('/Confirm')
          } else {
            this.sharedState.state.property.name = ''
            this.sharedState.state.property.pw = ''
          }
        })
    },
    SignUp: function () {
      this.$router.push('/SignUp')
    },
    PasswordReset: function () {
      console.log('PasswordReset')
      var params = {
        userName: this.sharedState.state.property.name
      }
      console.log(params)
      dbmodel.PasswordReset(params)
        .then((cognitoUserPackage) => {
          PropertyStore.state.cognitoUserPackage = cognitoUserPackage
          this.$router.push('/PasswordChange')
        })
        .catch((err) => {
          console.log(err)
        })
    }
  },
  mounted () {
    console.log('mounted')
  }
}
</script>
