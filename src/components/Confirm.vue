<template>
  <div id="app">
    <div class="container">
      <form class="Confirm">
        <h2 class="confirm-heading">サインアップの確認</h2>
        <form id="userName" class="userName">
          <input name="query" v-model="sharedState.state.property.name" placeholder="UserName">
        </form>
        <form id="verificationCode" class="verificationCode">
          <input name="query" v-model="pin" placeholder="Verification Code">
        </form>
        <br/>
        <form v-on:submit.prevent="Confirm">
          <input type='submit' value='確認する'>
        </form>
        <form v-on:submit.prevent="ResendConfirmationCode">
          <input type='submit' value='確認コードを再送する'>
        </form>
      </form>
    </div>
  </div>
</template>

<script>
import dbmodel from '../models/dbmodel'
import PropertyStore from '../models/store.js'

export default {
  name: 'Confirm',
  data: function () {
    return {
      sharedState: PropertyStore,
      pin: ''
    }
  },
  methods: {
    Confirm: function () {
      console.log('Confirm')
      var params = {
        userName: this.sharedState.state.property.name,
        pin: this.pin
      }
      dbmodel.Confirm(params)
        .then(() => {
          this.$router.push('/SignIn')
        })
        .catch((err) => {
          console.log(err)
          this.sharedState.state.property.name = ''
          this.pin = ''
        })
    },
    ResendConfirmationCode: function () {
      console.log('ResendConfirmationCode')
      if (this.sharedState.state.property.name) {
        console.log(this.sharedState.state.property.name)
        var params = {
          userName: this.sharedState.state.property.name
        }
        dbmodel.Resend(params)
          .then(() => {
            console.log('Resolve')
            // nop
          })
          .catch((err) => {
            console.log(err)
          })
      }
    }
  },
  mounted () {
    console.log('mounted PropertyStore.state.name = ' + PropertyStore.state.name + ', ' + 'this.userName = ' + this.userName)
  }
}
</script>
