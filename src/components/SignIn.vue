<template>
  <div id="app">
    <div class="signin-container">
      <div class="dummy_container">
      </div>
      <div class="contents-container">
        <h2 class="signin-heading">サインイン</h2>
        <form id="userName" class="signin-form">
          <input name="query" class="text-field" v-model="sharedState.state.property.name" placeholder="UserName">
        </form>
        <form id="passWord" class="signin-form">
          <input name="query" class="text-field" v-model="sharedState.state.property.pw" placeholder="Password">
        </form>
        <!--
          v-on:submit.prevent の修飾子を指定しないと、クリック時にページリロードが
          発生し、初回のクリックでログインされず、ページ再描画される
        -->
        <form v-on:submit.prevent="SignIn" class="signin-form">
          <input type='submit' class="button" id='signin-button' value='サインイン'>
        </form>
        <p v-if=signinErrorMessage id="signin-message-field">{{signinErrorMessage}}</p>
        <br/>
        <form v-on:submit.prevent="PasswordReset" class="signin-form">
          <input type='submit' class="button" id='password-button' value='パスワードを新たに発行する'>
        </form>
        <p v-if=passwordResetErrorMessage id="password-message-field">{{passwordResetErrorMessage}}</p>
        <form v-on:submit.prevent="SignUp" class="signin-form">
          <input type='submit' class="button" id = 'account-button' value='新しいアカウントを登録する'>
        </form>
      </div>
      <div class="dummy_container">
      </div>
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
      sharedState: PropertyStore,
      signinErrorMessage: '',
      passwordResetErrorMessage: ''
    }
  },
  methods: {
    SignIn: function () {
      console.log('Signin')
      this.signinErrorMessage = ''
      this.passwordResetErrorMessage = ''
      if (this.sharedState.state.property.name === '') {
        this.signinErrorMessage = 'UserName is not input'
      } else if (this.sharedState.state.property.pw === '') {
        this.signinErrorMessage = 'PassWord is not input'
      } else {
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
              this.signinErrorMessage = err.message
              this.sharedState.state.property.name = ''
              this.sharedState.state.property.pw = ''
            }
          })
      }
    },
    SignUp: function () {
      this.$router.push('/SignUp')
    },
    PasswordReset: function () {
      console.log('PasswordReset')
      this.signinErrorMessage = ''
      this.passwordResetErrorMessage = ''
      if (this.sharedState.state.property.name === '') {
        this.passwordResetErrorMessage = 'UserName is not input'
      } else {
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
    }
  },
  mounted () {
    console.log('mounted')
  }
}
</script>

<style>
  .signin-container {
    display: flex;
    display: -webkit-flex;
    flex-direction: row;
    -webkit-flex-direction: row;
    justify-content: space-between;
    width:100%;
    height:100%;
  }
  .contents-container {
    flex-direction: column;
    -webkit-flex-direction: column;
    align-content: space-between;
  }
  .signin-heading {
    text-align: center;
  }
  .signin-form {
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
  #signin-button {
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
  #signin-button:hover {
    color: rgb(1, 78, 165);
  }
  #password-button,#account-button {
    background-color: rgb(175, 175, 175);
    color: rgb(255, 255, 255);
    box-shadow: 2px 2px 3px 1px rgb(148, 148, 148);
    -moz-box-shadow: 2px 2px 3px 1px rgb(148, 148, 148);
    -webkit-box-shadow: 2px 2px 3px 1px rgb(148, 148, 148);
  }
  #password-button:hover,#account-button:hover {
    color: rgb(122, 122, 122);
  }
</style>
