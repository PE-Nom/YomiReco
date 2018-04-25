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
          return reject(err)
        } else {
          s3objects = data
          return resolve()
        }
      })
    })
    return p
  },
  putObject: function (obj) {
    const p = new Promise((resolve, reject) => {
      console.log('putObject')
      var s3 = new AWS.S3({params: {Bucket: bucketName}})
      s3objects.Contents.forEach(function (element) {
        if (element.Key === obj.rec.BookImagePath) {
          var err = '同じ名前のイメージデータが存在しています'
          return reject(err)
        }
      })
      var params = {Key: obj.rec.BookImagePath, ContentType: obj.img.type, ACL: 'public-read', Body: obj.img}
      s3.putObject(params, function (err, data) {
        if (err) {
          return reject(err)
        } else {
          return resolve()
        }
      })
    })
    return p
  },
  getObject: function (records) {
    const p = new Promise((resolve, reject) => {
      console.log('getObject')
      var s3 = new AWS.S3({params: {Bucket: bucketName}})
      records.forEach(function (element, index, array) {
        var filename = element.BookImagePath
        var params = {Key: filename}
        s3.getObject(params, function (err, data) {
          if (err) {
            console.log(err)
            return reject(err)
          } else {
            console.log(data)
            return resolve('success')
          }
        })
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
          return resolve()
        }
      })
    })
    return p
  },
  getBucketName: function () {
    return bucketName
  }
}
