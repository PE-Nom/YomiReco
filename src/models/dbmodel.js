
import AWS from 'aws-sdk'
import {CognitoUserPool, AuthenticationDetails, CognitoUser, CognitoUserAttribute} from 'amazon-cognito-identity-js'

// 結局以下のimportは不要
// JavaScriptからAmazon Cognitoを使うためのまとめ(https://lealog.hateblo.jp/entry/2017/01/25/105528)
// を参考に実装し、Cognito、DynamoDBへのアクセスができよう様になった。
// import CognitoSDK from 'amazon-cognito-identity-js-node'

// const bucketName = 'yomi-rec-test'

const idPoolId = 'ap-northeast-1:c9fc7223-f992-4b06-8aa2-de2976eade8c' // YomiRecTest
const poolData = {
  UserPoolId: 'ap-northeast-1_AM0R9AjCn',
  ClientId: '5pirlk3nk3htdngm6h6mbbi77u'
}

var userPool = new CognitoUserPool(poolData)
var authenticationDetails = null
var cognitoUser = null
var session = null
var ddb = null
var emailAddr = ''

export default {
  SignUp: function (params) {
    const p = new Promise((resolve, reject) => {
      console.log(params)
      if (!params.email | !params.userName | !params.passWord) {
        var err = 'invalid params'
        reject(err)
      }
      const attributeList = []
      const dataEmail = {
        Name: 'email',
        Value: params.email
      }
      const attributeEmail = new CognitoUserAttribute(dataEmail)
      attributeList.push(attributeEmail)
      userPool.signUp(params.userName, params.passWord, attributeList, null, function (err, result) {
        if (err) {
          console.log('an error occurred @ SignUp')
          console.log(err)
          reject(err)
        } else {
          console.log('SignUp')
          // resolve the promise with whatever attributes you need
          // in this case, we return an object with only the email attribute because we will save that to localStorage
          resolve()
        }
      })
    })
    return p
  },
  Confirm: function (params) {
    const p = new Promise((resolve, reject) => {
      console.log(params)
      if (!params.userName | !params.pin) {
        var err = 'invalid params'
        reject(err)
      }
      var userData = {
        Username: params.userName,
        Pool: userPool
      }
      const cognitoUser = new CognitoUser(userData)
      cognitoUser.confirmRegistration(params.pin, true, function (err, result) {
        if (err) {
          console.log(err)
          reject(err)
        } else {
          if (result === 'SUCCESS') {
            console.log('Successfully verified account!')
            cognitoUser.signOut()
            resolve()
          } else {
          // if otherwise failure, we reject the promise
            var error = 'Could not verify account'
            reject(error)
          }
        }
      })
    })
    return p
  },
  PasswordReset: function (params) {
    const p = new Promise((resolve, reject) => {
      console.log(params)
      if (!params.userName) {
        var err = 'invalid params'
        reject(err)
      }
      var userData = {
        Username: params.userName,
        Pool: userPool
      }
      cognitoUser = new CognitoUser(userData)
      cognitoUser.forgotPassword({

        // we are resolving the `cognitoUser` in our promise because the React component will use it to call `cognitoUser.confirmPassword()`
        // thats also why we pass in the `forgotPassword` `this` to be used in the React component

        // if successful, then we can resolve the promise with cognitoUser and the `this` declaration from the React component that calls `forgotPassword()`
        // but we may also resolve the promise with the third function `inputVerificationCode()` which handles behind the scenes of `forgotPassword()`
        onSuccess: function (result) {
          console.log('call result: ' + result)
          // res({
          //  cognitoUser: cognitoUser,
          //  thirdArg: this
          // })
        },
        // if failure, reject the promise
        onFailure: function (err) {
          reject(err)
        },
        // Optional automatic callback that passes in `data` object from `forgotPassword()` and resolve the same was as `onSuccess`
        // `inputVerificationCode()` handles behind the scenes of `forgotPassword()`, but we don't actually use it. Its here if needed in the future.
        inputVerificationCode: function (data) {
          // console.log('Code sent to: ' + data)
          resolve({
            cognitoUser: cognitoUser,
            thirdArg: this
          })
        }
      })
    })
    return p
  },
  ChangePassword: function (params) {
    const p = new Promise((resolve, reject) => {
      cognitoUser.confirmPassword(params.pin, params.pw, {
        onSuccess: function () {
          resolve()
        },
        onFailure: function (err) {
          reject(err)
        }
      })
    })
    return p
  },
  SignIn: function (params) {
    const p = new Promise((resolve, reject) => {
      console.log(params)
      if (!params.userName | !params.passWord) {
        var err = 'invalid params'
        reject(err)
      }
      const authenticationData = {
        Username: params.userName,
        Password: params.passWord
      }
      // userPool = new CognitoUserPool(poolData)
      authenticationDetails = new AuthenticationDetails(authenticationData)

      var userData = {
        Username: params.userName,
        Pool: userPool
      }
      cognitoUser = new CognitoUser(userData)
      this.authenticateUser(cognitoUser, authenticationDetails)
        .then(() => {
          resolve()
        })
        .catch((err) => {
          reject(err)
        })
    })
    return p
  },
  authenticateUser: function (cognitoUser, authenticationDetails) {
    const p = new Promise((resolve, reject) => {
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
          console.log('access token + ' + result.getAccessToken().getJwtToken())

          AWS.config.region = 'ap-northeast-1'
          AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            // IdentityPoolId: 'ap-northeast-1:149a8900-ae0e-4724-afc3-9dfa2be6b63a', // YomiRec
            IdentityPoolId: 'ap-northeast-1:c9fc7223-f992-4b06-8aa2-de2976eade8c', // YomiRecTest
            Logins: {
              'cognito-idp.ap-northeast-1.amazonaws.com/ap-northeast-1_AM0R9AjCn': result.getIdToken().getJwtToken()
            }
          })
          AWS.config.credentials.clearCachedId()
          /*
          AWS.config.credentials.get(function (err) {
            if (err) {
              console.log('error @ login AWS.config.getCredentials')
              reject(err)
            } else {
              console.log('id:' + AWS.config.credentials.identityId)
              resolve()
            }
          })
          */
          AWS.config.credentials.refresh(function () {
            console.log(AWS.config.credentials)
          })
          resolve()
        },
        onFailure: function (err) {
          reject(err)
        }
      })
    })
    return p
  },
  SignOut: function () {
    // var cognitoUser = UserPool.getCurrentUser()
    const p = new Promise((resolve, reject) => {
      if (cognitoUser != null) {
        console.log('logout')
        cognitoUser.signOut()
        AWS.config.credentials.clearCachedId()
        location.reload()
      }
    })
    return p
  },
  Resend: function (params) {
    const p = new Promise((resolve, reject) => {
      console.log(params)
      if (!params.userName) {
        var err = 'invalid params'
        reject(err)
      }
      var userData = {
        Username: params.userName,
        Pool: userPool
      }
      cognitoUser = new CognitoUser(userData)
      cognitoUser.resendConfirmationCode(function (err, result) {
        // reject promise if confirmation code failed
        if (err) {
          console.log(err)
          reject(err)
        }
        // resolve if successfull
        resolve()
      })
    })
    return p
  },
  getSession: function () {
    const p = new Promise((resolve, reject) => {
      console.log('getSession start')
      userPool = new CognitoUserPool(poolData)
      cognitoUser = userPool.getCurrentUser()
      if (cognitoUser != null) {
        console.log(cognitoUser)
        cognitoUser.getSession(function (err, sessionResult) {
          if (err) {
            console.log('session is invalid')
            reject(err)
          } else {
            if (sessionResult) {
              session = sessionResult
              console.log('end of getSession')
              resolve()
            } else {
              session = null
              var error = 'sessionResult undefined'
              reject(error)
            }
          }
        })
      } else {
        console.log('no user')
        var error = 'no user'
        reject(error)
      }
    })
    return p
  },
  getUserAttribute: function () {
    const p = new Promise((resolve, reject) => {
      console.log('getUserAttribute start')
      if (cognitoUser != null && session != null) {
        cognitoUser.getUserAttributes(function (err, attrs) {
          if (err) {
            console.log('error @ checkSession getUserAttributes')
            // console.log(err)
            reject(err)
          } else {
            for (var i = 0; i < attrs.length; i++) {
              console.log('name:' + attrs[i].getName() + ', value: ' + attrs[i].getValue())
              if (attrs[i].getName() === 'email') {
                emailAddr = attrs[i].getValue()
              }
            }
            console.log('end of getUserAttribute')
            resolve()
          }
        })
      } else {
        console.log('no user')
        var error = 'no user'
        reject(error)
      }
    })
    return p
  },
  getCredentials: function () {
    const p = new Promise((resolve, reject) => {
      console.log('getCredentials start')
      AWS.config.region = 'ap-northeast-1'
      var cognitoParams = {
        IdentityPoolId: idPoolId,
        Logins: {'cognito-idp.ap-northeast-1.amazonaws.com/ap-northeast-1_AM0R9AjCn': session.getIdToken().getJwtToken()}
      // Logins: { userPoolId: sessionResult.getIdToken().getJwtToken() }
      }
      AWS.config.credentials = new AWS.CognitoIdentityCredentials(cognitoParams)
      console.log('AWS.config.credentials.get!!!')
      // AWS.config.credentials.clearCachedId();
      AWS.config.credentials.get(function (err) {
        if (err) {
          console.log(err)
          reject(err)
        } else {
          console.log('id:' + AWS.config.credentials.identityId)
          console.log('end of getCredentials')
          // for test
          // return reject('return reject from getCredentials for test')
          resolve()
        }
      })
    })
    return p
  },
  listBooks: function () {
    const p = new Promise((resolve, reject) => {
      console.log('listBooks')
      ddb = new AWS.DynamoDB({apiVersion: '2012-10-08'})
      if (ddb) {
        console.log('emailAddr : ' + emailAddr)
        var params = {
          ExpressionAttributeValues: {
            ':user': {
              S: emailAddr
            }
          },
          FilterExpression: 'UserName = :user',
          ProjectionExpression: 'UserName, RegistrationDateTime,BookImagePath,BookTitle,Buy,ReadComplete',
          TableName: 'YomiRecTest'
        }
        // Call DynamoDB to read the item from the table
        ddb.scan(params, function (err, data) {
          if (err) {
            console.log('Error', err)
            reject(err)
          } else {
            console.log('Success', data)
            var records = ''
            data.Items.forEach(function (element, index, array) {
              records += element.UserName.S +
                    ':' + element.BookTitle.S + '@' + element.RegistrationDateTime.S +
                    '(' + element.BookImagePath.S + ')' + '<br>'
            })
            console.log(records)
            // for test
            // return reject('return rejcet from listBooks for test')
            resolve(data)
          }
        })
      } else {
        var err = 'ddb is undefined'
        console.log('ddb :' + ddb)
        reject(err)
      }
    })
    return p
  }
}
