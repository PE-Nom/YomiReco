<template>
  <div id="app">
    <div class="container">
      <form class="SingUp">
        <h2 class="sign-up-heading">サインアップ</h2>
        <form id="emailAddr" class="emailAddr">
          <input name="query" v-model="sharedState.state.property.mail" placeholder="E-mail">
        </form>
        <form id="userName" class="userName">
          <input name="query" v-model="sharedState.state.property.name" placeholder="UserName">
        </form>
        <form id="passWord" class="passWord">
          <input name="query" v-model="sharedState.state.property.pw" placeholder="Password">
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
import PropertyStore from '../models/store.js'

export default {
  name: 'SignUp',
  data: function () {
    return {
      sharedState: PropertyStore
    }
  },
  methods: {
    SignUp: function () {
      console.log('SignUp')
      var params = {
        email: this.sharedState.state.property.mail,
        userName: this.sharedState.state.property.name,
        passWord: this.sharedState.state.property.pw
      }
      dbmodel.SignUp(params)
        .then(() => {
          this.$router.push('/Confirm')
        })
        .catch((err) => {
          console.log(err)
          this.sharedState.state.property.mail = ''
          this.sharedState.state.property.name = ''
          this.sharedState.state.property.pw = ''
        })
    }
  },
  mounted () {
    console.log('mounted')
  }
}
</script>
