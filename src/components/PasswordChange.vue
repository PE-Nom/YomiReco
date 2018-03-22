<template>
  <div id="app">
    <div class="container">
      <form class="PasswrdChange">
        <h2 class="PasswrdChange-heading">パスワードリセット</h2>
        <p>{{sharedState.state.property.name}}</p>
        <form id="passWord" class="passWord">
          <input name="query" v-model="pw" placeholder="New Password">
        </form>
        <form id="verificationCode" class="verificationCode">
          <input name="query" v-model="pin" placeholder="Verification Code">
        </form>
        <br/>
        <form v-on:submit.prevent="ChangePassword">
          <input type='submit' value='変更する'>
        </form>
      </form>
    </div>
  </div>
</template>

<script>
import dbmodel from '../models/dbmodel.js'
import PropertyStore from '../models/store.js'

export default {
  name: 'PasswordChange',
  data: function () {
    return {
      sharedState: PropertyStore,
      pw: '',
      pin: ''
    }
  },
  methods: {
    ChangePassword: function () {
      console.log('ChangePassword')
      var params = {
        pw: this.pw,
        pin: this.pin
      }
      dbmodel.ChangePassword(params)
        .then(() => {
          this.$router.push('/SignIn')
        })
        .catch((err) => {
          console.log(err)
          this.sharedState.state.property.name = ''
          this.pin = ''
        })
    }
  },
  mounted () {
    console.log('mounted PropertyStore.state.name = ' + PropertyStore.state.property.name)
  }
}
</script>
