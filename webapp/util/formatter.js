sap.ui.define([
    
], function(require, factory) {
    'use strict';
    return {
        getStatus: function(value){
            switch (value) {
                case "Available":
                    return "Success";
                    break;
                case "Out of Stock":
                    return "Warning";
                    break;
                case "Unavailable":
                    return "Error";
                    break;
                default:
                    break;
            }
        }
    }
});