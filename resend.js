'use strict'
var upsample = {};

upsample.poolData = {
    UserPoolId: 'ap-northeast-1_AM0R9AjCn',
    ClientId: '5pirlk3nk3htdngm6h6mbbi77u'
};
upsample.UserPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(upsample.poolData);

upsample.resend = function() {
    var username = $('#inputUserName').val();
    if (!username) { return false; }

    var userData = {
        Username: username,
        Pool: upsample.UserPool
    };

    var message_text;
    var cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);
    cognitoUser.resendConfirmationCode(function(err, result) {
        if (err) {
            console.log(err);
            message_text = err;
        } else {
            console.log('call result ' + result);

            message_text = '確認コードを再送信しました';
        }
        $('#message').text(message_text);
        $('#message').show();
    });
}