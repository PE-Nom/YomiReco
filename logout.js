'use strict'
var upsample = {};

upsample.poolData = {
    UserPoolId: 'ap-northeast-1_AM0R9AjCn',
    ClientId: '5pirlk3nk3htdngm6h6mbbi77u'
};
upsample.UserPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(upsample.poolData);

//var idPoolId = 'ap-northeast-1:149a8900-ae0e-4724-afc3-9dfa2be6b63a'; // YomiRec
var idPoolId = 'ap-northeast-1:c9fc7223-f992-4b06-8aa2-de2976eade8c'; // YomiRecTest
var userPoolId = 'cognito-idp.ap-northeast-1.amazonaws.com/ap-northeast-1_AM0R9AjCn';
var bucketName = 'yomi-rec-test';

var bucket;
var ddb;
var emailAddr;
var cognitoUser;

upsample.checkSession = function (resolve,reject) {

    cognitoUser = upsample.UserPool.getCurrentUser();
    if (cognitoUser != null) {
        cognitoUser.getSession(function (err, sessionResult) {
            if (sessionResult) {
                var attrs;
                cognitoUser.getUserAttributes(function (err, attrs) {
                    if (err) {
                        console.log(err);
                        return reject(err);
                    }
                    $('#username').text('Username:' + cognitoUser.getUsername());

                    for (var i = 0; i < attrs.length; i++) {
                        console.log('name:' + attrs[i].getName() + ", value: " + attrs[i].getValue() );
                        if (attrs[i].getName() == 'email') {
                            emailAddr = attrs[i].getValue();
                            $('#email').text('Email: ' + emailAddr);
                        }
                    }
                });
                ///
                AWS.config.region = 'ap-northeast-1';
                var cognitoParams = {
                    IdentityPoolId: idPoolId,
                    Logins: {'cognito-idp.ap-northeast-1.amazonaws.com/ap-northeast-1_AM0R9AjCn': sessionResult.getIdToken().getJwtToken()}
                    //Logins: { userPoolId: sessionResult.getIdToken().getJwtToken() }
                };
                AWS.config.credentials = new AWS.CognitoIdentityCredentials(cognitoParams);
                console.log("AWS.config.credentials.get!!!"); 
//                AWS.config.credentials.clearCachedId();               
                AWS.config.credentials.get(function(err){
                    if(err){
                        console.log(err);
                        return reject(err);
                    }
                    else {
                        console.log("id:" + AWS.config.credentials.identityId);
                        bucket = new AWS.S3({params: {Bucket: bucketName}});
                        ddb = new AWS.DynamoDB({apiVersion: '2012-10-08'});
                        return resolve();
                    }
                });                
                ///
            } else {
                console.log("session is invalid");
                return reject("session is invalid");
            }
        });
    } else {
        console.log("no user");
        return reject("no user");
    }
}

upsample.logout = function() {

    var cognitoUser = upsample.UserPool.getCurrentUser();
    if (cognitoUser != null) {
        cognitoUser.signOut();
        AWS.config.credentials.clearCachedId();               
        location.reload();
    }

}

upsample.listObjects = function(resolve,reject) {
    console.log('listObjects');
    var prefix = 'cognito-' + upsample.cognitoUser;
    if(bucket){
        bucket.listObjects({}, function (err, data) {
            if (err) {
                $('#results').html('ERROR: ' + err);
                return reject(err);
            } else {
                console.log('data : ' + data );
                var objKeys = "";
                data.Contents.forEach(function (obj) {
                    objKeys += obj.Key + "<br>";
                });
//                $('#s3results').html(objKeys);
                return resolve();
            }
        });
    }
}

upsample.listBooks = function(resolve,reject) {
    console.log('upsample listBooks');
    if(ddb){
        console.log('emailAddr : ' + emailAddr);
        var params = {
            ExpressionAttributeValues: {
                ":user": {
                    S: emailAddr
                }
            },
            FilterExpression: "UserName = :user",
            ProjectionExpression: "UserName, RegistrationDateTime,BookImagePath,BookTitle,Buy,ReadComplete",
            TableName: "YomiRecTest"    
        };

        // Call DynamoDB to read the item from the table
        ddb.scan(params, function(err, data) {
        if (err) {
          console.log("Error", err);
          return reject(err);
        } else {
            console.log("Success", data);
            var records = "";
            data.Items.forEach(function(element, index, array) {
                records += element.UserName.S
                    + ":" + element.BookTitle.S + "@" + element.RegistrationDateTime.S
                    + "(" + element.BookImagePath.S + ")" + "<br>";
            });
//            $('#dynamoDBresults').html(records);
            return resolve(data);
        }
      });
    }
    else{
        console.log('ddb :' + ddb);
        return reject(err);
    }
}