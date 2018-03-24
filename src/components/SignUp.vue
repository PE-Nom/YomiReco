<template>
  <div id="app">
    <div class="contents-container">
      <div class="dummy_container">
      </div>
      <div class="signup-container">
        <h2 class="signup-heading">サインアップ</h2>
        <form id="emailAddr" class="signup-form">
          <input name="query" class="text-field" v-model="sharedState.state.property.mail" placeholder="E-mail">
        </form>
        <form id="userName" class="signup-form">
          <input name="query" class="text-field" v-model="sharedState.state.property.name" placeholder="User Name">
        </form>
        <form id="passWord" class="signup-form">
          <input name="query" class="text-field" v-model="sharedState.state.property.pw" placeholder="Password">
        </form>
        <br/>
        <form v-on:submit.prevent="SignUp" class="signup-form">
          <input type='submit' class="button" id='create-account-button' value='アカウントの作成'>
        </form>
        <p v-if=errorMessage id="error-message-field">{{errorMessage}}</p>
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
  name: 'SignUp',
  data: function () {
    return {
      sharedState: PropertyStore,
      errorMessage: ''
    }
  },
  methods: {
    SignUp: function () {
      console.log('SignUp')
      if (this.sharedState.state.property.mail === '') {
        this.errorMessage = '"E-mail" is not input'
      } else if (this.sharedState.state.property.name === '') {
        this.errorMessage = '"User Name" is not input'
      } else if (this.sharedState.state.property.pw === '') {
        this.errorMessage = '"Password" is not input'
      } else {
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
            this.errorMessage = err.message
            this.sharedState.state.property.mail = ''
            this.sharedState.state.property.name = ''
            this.sharedState.state.property.pw = ''
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
  .contents-container {
    display: flex;
    display: -webkit-flex;
    flex-direction: row;
    -webkit-flex-direction: row;
    justify-content: space-between;
    width:100%;
    height:100%;
  }
  .signup-container {
    flex-direction: column;
    -webkit-flex-direction: column;
    align-content: space-between;
  }
  .signup-heading {
    text-align: center;
  }
  .signup-form {
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
  #create-account-button {
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
  #create-account-button:hover {
    color: rgb(1, 78, 165);
  }
</style>
