'use strict'
var upsample = {};

upsample.poolData = {
    UserPoolId: 'ap-northeast-1_AM0R9AjCn',
    ClientId: '5pirlk3nk3htdngm6h6mbbi77u'
};
upsample.UserPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(upsample.poolData);

upsample.signup = function() {
    var email = $('#inputEmail').val();
    var username = $('#inputUserName').val();
    var password = $('#inputPassword').val();
    if (!email | !username | !password) { return false; }

    var attributeEmail = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute({Name: 'email', Value: email});
    var attributeList = [];
    attributeList.push(attributeEmail);

    var message_text;
    upsample.UserPool.signUp(username, password, attributeList, null, function(err, result){
        if (err) {
            console.log(err);
            message_text = err;
        } else {
            var cognitoUser = result.user;
            console.log('user name is ' + cognitoUser.getUsername());

            message_text = cognitoUser.getUsername() + ' が作成されました';
            setTimeout(function () {
                $(location).attr('href', 'confirm.html');
            }, 2000);
        }
        $('#message').text(message_text);
        $('#message').show();
    });
}