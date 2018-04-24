<template>
  <div id="app">
    <div class="contents-container">
      <div class="dummy_container">
      </div>
      <div class="passwordreset_container">
        <h2 class="passwordreset-heading">パスワードリセット</h2>
        <p>{{sharedState.state.property.name}}</p>
        <form id="passWord" class="passwordreset-form">
          <input name="query" class="text-field" v-model="pw" placeholder="New Password">
        </form>
        <form id="verificationCode" class="passwordreset-form">
          <input name="query" class="text-field" v-model="pin" placeholder="Verification Code">
        </form>
        <br/>
        <form v-on:submit.prevent="ChangePassword" class="passwordreset-form">
          <input type='submit' class="button" id="reset-button" value='変更する'>
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
  name: 'PasswordChange',
  data: function () {
    return {
      sharedState: PropertyStore,
      pw: '',
      pin: '',
      errorMessage: ''
    }
  },
  methods: {
    ChangePassword: function () {
      if (this.pw === '') {
        this.errorMessage = '"Password" is not input'
      } else if (this.pin === '') {
        this.errorMessage = '"Verification Code" is not input'
      } else {
        console.log('ChangePassword')
        var params = {
          pw: this.pw,
          pin: this.pin
        }
        accountctl.ChangePassword(params)
          .then(() => {
            this.$router.push('/SignIn')
          })
          .catch((err) => {
            console.log(err)
            this.errorMessage = err.message
          })
      }
    }
  },
  mounted () {
    console.log('mounted PropertyStore.state.name = ' + PropertyStore.state.property.name)
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
  .passwordreset-container {
    flex-direction: column;
    -webkit-flex-direction: column;
    align-content: space-between;
    flex: 1;
    min-width: 300;
  }
  .passwordreset-heading {
    text-align: center;
  }
  .passwordreset-form {
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
  .message-field {
    word-wrap: break-word;
  }
  #reset-button {
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
  #reset-button:hover {
    color: rgb(1, 78, 165);
  }
</style>
