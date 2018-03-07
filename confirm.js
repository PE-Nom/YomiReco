'use strict'
var upsample = {};

upsample.poolData = {
    UserPoolId: 'ap-northeast-1_AM0R9AjCn',
    ClientId: '5pirlk3nk3htdngm6h6mbbi77u'
};
upsample.UserPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(upsample.poolData);

upsample.verify = function() {
    var username = $('#inputUserName').val();
    var vericode = $('#inputVerificationCode').val();
    if (!username | !vericode) { return false; }

    var userData = {
        Username: username,
        Pool: upsample.UserPool
    };

    var message_text;
    var cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);
    cognitoUser.confirmRegistration(vericode, true, function(err, result) {
        if (err) {
            console.log(err);
            message_text = err;
            $('#message').text(message_text);
            $('#message').append($('<a href="resend.html">再送信</a>')); // 再送信リンクの表示
        } else {
            console.log('call result ' + result);

            message_text = cognitoUser.getUsername() + ' が確認されました';
            $('#message').text(message_text);
            setTimeout(function () {
                $(location).attr('href', 'login.html');
            }, 2000);
        }
        $('#message').show();
    });
}
