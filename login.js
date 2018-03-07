'use strict'
var upsample = {};

upsample.poolData = {
    UserPoolId: 'ap-northeast-1_AM0R9AjCn',
    ClientId: '5pirlk3nk3htdngm6h6mbbi77u'
};
upsample.UserPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(upsample.poolData);

var bucketName = 'yomi-rec-test';
var bucket;

upsample.login = function() {
    var username = $('#inputUserName').val();
    var password = $('#inputPassword').val();
    if (!username | !password) { return false; }

    var authenticationData = {
        Username: username,
        Password: password
    };
    var authenticationDetails = new AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails(authenticationData);

    var userData = {
        Username: username,
        Pool: upsample.UserPool
    };

    var message_text;
    var cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function(result) {
            console.log('access token + ' + result.getAccessToken().getJwtToken());

            AWS.config.region = 'ap-northeast-1';
            AWS.config.credentials = new AWS.CognitoIdentityCredentials({
//                IdentityPoolId: 'ap-northeast-1:149a8900-ae0e-4724-afc3-9dfa2be6b63a', // YomiRec
                IdentityPoolId: 'ap-northeast-1:c9fc7223-f992-4b06-8aa2-de2976eade8c', // YomiRecTest
                Logins: {
                    'cognito-idp.ap-northeast-1.amazonaws.com/ap-northeast-1_AM0R9AjCn': result.getIdToken().getJwtToken()
                }
            });
            AWS.config.credentials.clearCachedId();
            AWS.config.credentials.get(function(err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("success");
                    console.log("id:" + AWS.config.credentials.identityId);                    
                }
//                bucket = new AWS.S3({params: {Bucket: bucketName}});
//                upsample.listObjects();
//                $(location).attr('href', 'mypage.html');
                $(location).attr('href', 'recordgrid.html');
            });
//            $(location).attr('href', 'mypage.html');
        },

        onFailure: function(err) {
            alert(err);
        },

        newPasswordRequired: function(userAttributes, requiredAttributes) {
            // User was signed up by an admin and must provide new
            // password and required attributes, if any, to complete
            // authentication.

            // the api doesn't accept this field back
            delete userAttributes.email_verified;

            // Get these details and call
            cognitoUser.completeNewPasswordChallenge(newPassword, userAttributes, this);
        }
        
    });
}

upsample.listObjects = function() {
    console.log('listObjects');
    bucket.listObjects({Bucket: "yomi-rec-test"},function (err, data) {
        if (err) {
            console.log('ERROR: ' + err);
        } else {
            console.log('data : ' + data );
        }
    });
}