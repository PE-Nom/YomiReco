<template>
  <div id="app">
    <div class="contents-container">
      <div class="dummy_container">
      </div>
      <div class="confirm_container">
        <h2 class="confirm-heading">サインアップの確認</h2>
        <p>{{sharedState.state.property.name}}</p>
        <form id="verificationCode" class="confirm-form">
          <input name="query" class="text-field" v-model="pin" placeholder="Verification Code">
        </form>
        <br/>
        <form v-on:submit.prevent="Confirm" class="confirm-form">
          <input type='submit' class="button" id="confirm-button" value='確認する'>
        </form>
        <form v-on:submit.prevent="ResendConfirmationCode" class="confirm-form">
          <input type='submit' class="button" id="resend-button" value='確認コードを再送する'>
        </form>
        <p v-if=errorMessage class="message-field">{{errorMessage}}</p>
      </div>
      <div class="dummy_container">
      </div>
    </div>
  </div>
</template>

<script>
import accountctl from '../models/accountctl.js'
import PropertyStore from '../models/store.js'

export default {
  name: 'Confirm',
  data: function () {
    return {
      sharedState: PropertyStore,
      pin: '',
      errorMessage: ''
    }
  },
  methods: {
    Confirm: function () {
      console.log('Confirm')
      if (this.pin === '') {
        this.errorMessage = '"Verification Code" is not input'
      } else {
        var params = {
          userName: this.sharedState.state.property.name,
          pin: this.pin
        }
        accountctl.Confirm(params)
          .then(() => {
            this.$router.push('/SignIn')
          })
          .catch((err) => {
            console.log(err)
            this.errorMessage = err.message
          })
      }
    },
    ResendConfirmationCode: function () {
      console.log('ResendConfirmationCode')
      var params = {
        userName: this.sharedState.state.property.name
      }
      accountctl.Resend(params)
        .then(() => {
          console.log('Resolve')
          // nop
        })
        .catch((err) => {
          console.log(err)
          this.errorMessage = err.message
        })
    }
  },
  mounted () {
    console.log('mounted PropertyStore.state.name = ' + PropertyStore.state.name + ', ' + 'this.userName = ' + this.userName)
  }
}
</script>

<style>
  .contents-container {
    display: flex;
    display: -webkit-flex;
    flex-direction: row;
    -webkit-flex-direction: row;
    justify-content: space-between;
    width:100%;
    height:100%;
  }
  .confirm-container {
    flex-direction: column;
    -webkit-flex-direction: column;
    align-content: space-between;
  }
  .confirm-heading {
    text-align: center;
  }
  .confirm-form {
    padding-bottom: 5%;
    outline: none;
    border-style: none;
  }
  .text-field {
    width:100%;
    border-radius: 3px;
    -moz-box-shadow: inset 1px 4px 9px -6px rgba(0,0,0,0.5);
    -webkit-box-shadow: inset 1px 4px 9px -6px rgba(0, 0, 0, 0.5);
    box-shadow: inset 1px 4px 9px -6px rgba(0,0,0,0.5);
  }
  .button  {
    width:100%;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-align: center;
    /* 文字サイズを1.4emに指定 */
    font-size: 1.0em;
    /* 文字の太さをboldに指定 */
    font-weight: bold;
    /* 背景色を濃い青色に指定 */
    /* ボーダーをなくす */
    border-style: none;
    border-radius: 3px;
  }
  .message_field {
    word-wrap: break-word;
  }
  #confirm-button, #resend-button {
    background-color: rgb(29, 137, 238);
    /* 文字色を白色に指定 */
    color: rgb(255, 255, 255);
    /* ボタンの影の指定
     * 影の横幅を2px
     * 縦長を2px
     * ぼかしを3px
     * 広がりを1px
     * 色を#666（グレー）に指定 */
    box-shadow: 2px 2px 3px 1px #248;
    -moz-box-shadow: 2px 2px 3px 1px #248;
    -webkit-box-shadow: 2px 2px 3px 1px #248;
  }
  #confirm-button:hover, #resend-button:hover {
    color: rgb(1, 78, 165);
  }
</style>
