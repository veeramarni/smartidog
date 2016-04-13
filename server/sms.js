// Add in order to use with a real twilio account
// if twilio has issue then most probably the application exist with 1

if (Meteor.settings) {
    var ACCOUT_PHONE_SETTINGS = Meteor.settings.private.ACCOUNTS_PHONE;
    var TWILIO_SETTINGS = Meteor.settings.private.TWILIO;
    if (TWILIO_SETTINGS && ACCOUT_PHONE_SETTINGS.SEND_SMS) {
        SMS.twilio = {
            FROM: TWILIO_SETTINGS.FROM,
            ACCOUNT_SID: TWILIO_SETTINGS.TWILIO.SID,
            AUTH_TOKEN: TWILIO_SETTINGS.TWILIO.TOKEN
        };
        SMS.phoneTemplates = {
            from: TWILIO_SETTINGS.FROM,
            text: function (user, code) {
                return 'Welcome to SmartiDog your invitation code is: ' + code;
            }
        };
    }

    if (ACCOUT_PHONE_SETTINGS) {
        Accounts._options.adminPhoneNumbers = ACCOUT_PHONE_SETTINGS.ADMIN_NUMBERS;
        Accounts._options.phoneVerificationMasterCode = ACCOUT_PHONE_SETTINGS.MASTER_CODE;
        ACCOUT_PHONE_SETTINGS.RETRIES && (Accounts._options.verificationMaxRetries = ACCOUT_PHONE_SETTINGS.RETRIES);
    }
} else {
    log.error("settings.json file is missing and this will break the setup.");
}
