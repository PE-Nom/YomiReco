import AWS from 'aws-sdk'
import account from './accountctl.js'

var bucketName = 'yomi-rec-test'
var s3objects = null

export default {
  listObjects: function () {
    const p = new Promise((resolve, reject) => {
      console.log('listObjects')
      var imgpath = account.getEmailAddr() + '/'
      console.log(imgpath)
      var s3 = new AWS.S3({params: {Bucket: bucketName, Prefix: imgpath}})
      s3.listObjects({}, function (err, data) {
        if (err) {
          console.log(err) // an error occurred
          return reject(err)
        } else {
          console.log(data) // request succeeded
          s3objects = data
          var objKeys = ''
          s3objects.Contents.forEach(function (obj) {
            objKeys += obj.Key + '<br>'
          })
          console.log(objKeys)
          return resolve()
        }
      })
    })
    return p
  },
  putObject: function (obj) {
    const p = new Promise((resolve, reject) => {
      console.log('putObject')
      var emailAddr = account.getEmailAddr()
      var s3 = new AWS.S3({params: {Bucket: bucketName}})
      var filename = emailAddr + '/' + obj.name
      console.log(filename)
      console.log(s3objects)
      s3objects.Contents.forEach(function (obj) {
        console.log(obj.Key)
        if (obj.Key === filename) {
          var err = '同じ名前のイメージデータが存在しています'
          return reject(err)
        }
      })
      var params = {Key: filename, ContentType: obj.type, Body: obj}
      s3.putObject(params, function (err, data) {
        if (err) {
          return reject(err)
        } else {
          console.log(data)
          return resolve()
        }
      })
    })
    return p
  },
  deleteObject: function (filename) {
    const p = new Promise((resolve, reject) => {
      console.log('deleteObject')
      console.log(filename)
      var s3 = new AWS.S3({params: {Bucket: bucketName}})
      var params = {Key: filename}
      s3.deleteObject(params, function (err, data) {
        if (err) {
          return reject(err)
        } else {
          console.log(data)
          return resolve()
        }
      })
    })
    return p
  }
}
