/**
 * Created by veeramarni on 12/21/15.
 */

// PhoneManager represents a remote client's view of the global LibPhonumber
// It can receive arbitary values from the network and save them
// for later use
var PhoneWrapper = function(){
    this.util = LibPhoneNumber.PhoneNumberUtil.getInstance();
    this.format = LibPhoneNumber.PhoneNumberFormat;
    this.types = LibPhoneNumber.PhoneNumberType;
};

_.extend(PhoneWrapper.prototype, {
    // take phone and country and parse it formatted phone
    parsePhone: function(opts){
        var self = this;
        var _parsedNumber = self.util.parse(opts.phone, opts.country || "US");
        var _parsedType = self.util.getNumberType(_parsedNumber);
        var _type = (_.invert(self.types))[_parsedType];
        log.debug("Parsed phone %s, is of type %s ", self.util.format(_parsedNumber, self.format.E164), _type);
        return {
            phone: self.util.format(_parsedNumber, self.format.E164),
            isValid: self.util.isValidNumber(_parsedNumber),
            type: _type,
            isMobile: _parsedType === self.types.Mobile || _parsedType === self.types.FIXED_LINE_OR_MOBILE
        };
    },
    buildAndValidatePhone: function (phoneNumber, countryCode) {
        var _regionCode = this.util.getRegionCodeForCountryCode(countryCode);
        var _number = this.util.parseAndKeepRawInput(phoneNumber, regionCode);
        var strIntNumber = "invalid";
        try {
            if (this.util.isValidNumber(_number)) {
                var _type = this.util.getNumberType(_number);

                if (_type == self.types.MOBILE) {
                    strIntlNumber = this.util.format(_number, format.E164);
                    strIntlNumber = strIntNumber.replace('+', '');
                }
            }
        }
        catch (ex) {
            log.error(ex);
        }
        return strIntNumber;
    }
});

// initiating the phone class
bjse.api.phone = new PhoneWrapper();