
import AWS from 'aws-sdk'
import account from './accountctl.js'

var ddb = null
var ddbDoc = null

export default {
  listBooks: function () {
    const p = new Promise((resolve, reject) => {
      ddb = new AWS.DynamoDB({apiVersion: '2012-10-08'})
      var emailAddr = account.getEmailAddr()
      if (ddb) {
        var params = {
          ExpressionAttributeValues: {
            ':user': {
              S: emailAddr
            }
          },
          FilterExpression: 'UserName = :user',
          ProjectionExpression: 'UserName, RegistrationDateTime,BookImagePath,BookTitle,Buy,ReadComplete,ReviewComment',
          TableName: 'YomiReco'
        }
        // Call DynamoDB to read the item from the table
        ddb.scan(params, function (err, data) {
          if (err) {
            console.log('listBook Error', err)
            reject(err)
          } else {
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
  },
  addRecord: function (rec) {
    const p = new Promise((resolve, reject) => {
      ddbDoc = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-10-08'})
      var emailAddr = account.getEmailAddr()
      if (ddbDoc) {
        var params = {
          TableName: 'YomiReco',
          Item: {
            UserName: emailAddr,
            BookTitle: rec.BookTitle,
            BookImagePath: rec.BookImagePath,
            Buy: rec.Buy === 'true',
            ReadComplete: rec.ReadComplete === 'true',
            RegistrationDateTime: rec.RegistrationDateTime,
            ReviewComment: rec.ReviewComment
          }
        }
        // Call DynamoDB to create the item from the table
        ddbDoc.put(params, function (err, data) {
          if (err) {
            console.log('Error', err)
            reject(err)
          } else {
            resolve()
          }
        })
      } else {
        var err = 'ddbDoc is undefined'
        console.log('ddbDoc :' + ddbDoc)
        reject(err)
      }
    })
    return p
  },
  updateRecord: function (rec) {
    const p = new Promise((resolve, reject) => {
      console.log('updateRecoed')
      console.log(rec)
      ddbDoc = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-10-08'})
      var emailAddr = account.getEmailAddr()
      if (ddbDoc) {
        var params = {
          TableName: 'YomiReco',
          Key: {
            'UserName': emailAddr,
            'BookTitle': rec.BookTitle
          },
          UpdateExpression: 'set RegistrationDateTime = :t, BookImagePath = :i, ReviewComment = :r, Buy = :b, ReadComplete = :c',
          ExpressionAttributeValues: {
            ':t': rec.RegistrationDateTime,
            ':i': rec.BookImagePath,
            ':r': rec.ReviewComment,
            ':b': rec.Buy === 'true',
            ':c': rec.ReadComplete === 'true'
          }
        }
        // Call DynamoDB to update the item from the table
        ddbDoc.update(params, function (err, data) {
          if (err) {
            console.log('Error', err)
            reject(err)
          } else {
            resolve()
          }
        })
      } else {
        var err = 'ddbDoc is undefined'
        console.log('ddbDoc :' + ddbDoc)
        reject(err)
      }
    })
    return p
  },
  deleteRecord: function (rec) {
    const p = new Promise((resolve, reject) => {
      console.log('deleteRecoed')
      console.log(rec)
      ddbDoc = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-10-08'})
      var emailAddr = account.getEmailAddr()
      if (ddbDoc) {
        var params = {
          TableName: 'YomiReco',
          Key: {
            'UserName': emailAddr,
            'BookTitle': rec.BookTitle
          }
        }
        // Call DynamoDB to delete the item from the table
        ddbDoc.delete(params, function (err, data) {
          if (err) {
            console.log('Error', err)
            reject(err)
          } else {
            resolve()
          }
        })
      } else {
        var err = 'ddbDoc is undefined'
        console.log('ddbDoc :' + ddbDoc)
        reject(err)
      }
    })
    return p
  }
}
