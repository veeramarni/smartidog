/**
 * Created by veeramarni on 1/19/16.
 */
bjse.util = bjse.util || {};
bjse.util = _.extend(bjse.util, {
    isDevelopment : function(){
        return process.env.NODE_ENV === "development";
    },
    isProduction: function(){
        return process.env.NODE_ENV === "production";
    }
});