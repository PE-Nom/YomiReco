
import AWS from 'aws-sdk'
import {CognitoUserPool, AuthenticationDetails, CognitoUser} from 'amazon-cognito-identity-js'

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

var userPool = null
var authenticationDetails = null
var cognitoUser = null
var session = null
var ddb = null
var emailAddr = ''

export default {
  /*
  login: function (resolve, reject, params) {
    console.log(params)
    if (!params.userName | !params.passWord) { return false }

    const authenticationData = {
      Username: params.userName,
      Password: params.passWord
    }
    userPool = new CognitoUserPool(poolData)
    authenticationDetails = new AuthenticationDetails(authenticationData)

    var userData = {
      Username: params.userName,
      Pool: userPool
    }

    cognitoUser = new CognitoUser(userData)
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
        AWS.config.credentials.get(function (err) {
          if (err) {
            console.log('error @ login AWS.config.getCredentials')
            return reject(err)
          } else {
            console.log('id:' + AWS.config.credentials.identityId)
            return resolve()
          }
        })
      },
      onFailure: function (err) {
        return reject(err)
      }
    })
  },
  */
  login: function (params) {
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
      userPool = new CognitoUserPool(poolData)
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
  logout: function () {
    // var cognitoUser = UserPool.getCurrentUser()
    if (cognitoUser != null) {
      console.log('logout')
      cognitoUser.signOut()
      AWS.config.credentials.clearCachedId()
      location.reload()
    }
  },
  getSession: function (resolve, reject) {
    console.log('getSession start')
    userPool = new CognitoUserPool(poolData)
    cognitoUser = userPool.getCurrentUser()
    if (cognitoUser != null) {
      console.log(cognitoUser)
      cognitoUser.getSession(function (err, sessionResult) {
        if (err) {
          console.log('session is invalid')
          return reject('session is invalid')
        } else {
          if (sessionResult) {
            session = sessionResult
            console.log('end of getSession')
            return resolve()
          } else {
            session = null
            return reject('sessionResult undefined')
          }
        }
      })
    } else {
      console.log('no user')
      return reject('no user')
    }
  },
  getUserAttribute: function (resolve, reject) {
    console.log('getUserAttribute start')
    if (cognitoUser != null && session != null) {
      cognitoUser.getUserAttributes(function (err, attrs) {
        if (err) {
          console.log('error @ checkSession getUserAttributes')
          // console.log(err)
          return reject(err)
        } else {
          for (var i = 0; i < attrs.length; i++) {
            console.log('name:' + attrs[i].getName() + ', value: ' + attrs[i].getValue())
            if (attrs[i].getName() === 'email') {
              emailAddr = attrs[i].getValue()
            }
          }
          console.log('end of getUserAttribute')
          return resolve()
        }
      })
    } else {
      console.log('no user')
      return reject('no user')
    }
  },
  getCredentials: function (resolve, reject) {
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
        return reject(err)
      } else {
        console.log('id:' + AWS.config.credentials.identityId)
        console.log('end of getCredentials')
        // for test
        // return reject('return reject from getCredentials for test')
        return resolve()
      }
    })
  },
  listBooks: function (resolve, reject) {
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
          return reject(err)
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
          return resolve(data)
        }
      })
    } else {
      var err = 'ddb is undefined'
      console.log('ddb :' + ddb)
      return reject(err)
    }
  }
}
