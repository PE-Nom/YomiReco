<template>
  <div id="app">
    <div class="container">
      <form class="Confirm">
        <h2 class="confirm-heading">サインアップの確認</h2>
        <form id="userName" class="userName">
          <input name="query" v-model="userName" placeholder="UserName">
        </form>
        <form id="verificationCode" class="verificationCode">
          <input name="query" v-model="pin" placeholder="Verification Code">
        </form>
        <br/>
        <form v-on:submit.prevent="Confirm">
          <input type='submit' value='確認する'>
        </form>
      </form>
    </div>
  </div>
</template>

<script>
import dbmodel from '../models/dbmodel'

export default {
  name: 'Confirm',
  data: function () {
    return {
      userName: '',
      pin: ''
    }
  },
  methods: {
    Confirm: function () {
      console.log('Confirm')
      var params = {
        userName: this.userName,
        pin: this.pin
      }
      dbmodel.Confirm(params)
        .then(() => {
          this.$router.push('/SignIn')
        })
        .catch((err) => {
          console.log(err)
          this.userName = ''
          this.pin = ''
        })
    }
  },
  mounted () {
    console.log('mounted')
  }
}
</script>
