sap.ui.define([
    'emc/fin/ar/controller/BaseController',
    'sap/ui/model/json/JSONModel',
    'sap/m/MessageToast',
    'sap/m/MessageBox'
], function(BaseController,JSONModel, MessageToast,MessageBox) {
    'use strict';
    return BaseController.extend("emc.fin.ar.controller.Add",{
        onInit: function(){
            var oModel = new JSONModel();
            oModel.setData({
                "enable": true,
                "prodData": {
                    "PRODUCT_ID" : "",
                    "TYPE_CODE" : "PR",
                    "CATEGORY" : "Notebooks",
                    "NAME" : "",
                    "DESCRIPTION" : "",
                    "SUPPLIER_ID" : "0100000051",
                    "SUPPLIER_NAME" : "TECUM",
                    "PRICE" : 0,
                    "CURRENCY_CODE" : "USD",
                    "TAX_TARIF_CODE" : "1 ",
                    "MEASURE_UNIT" : "EA",
                    "DIM_UNIT" : "CM"
                }
            });
            this.getView().setModel(oModel,"prod");
            this.getOwnerComponent().getRouter().getRoute("add").attachMatched(this.herculis, this);

        },
        herculis: function(){
            this.changeMode("Create");
        },
        sPath: null,
        onEnter: function(oEvent){
            //Step 1: What value of product id user give on screen
            var val = oEvent.getParameter("value");
            var oModel = this.getView().getModel("prod");
            //Step 2: Get The OData Model object
            var oDataModel = this.getView().getModel();
            //Step 3: Prepare path to read single product data
            var sPath = "/ProductSet('" + val + "')";
            //Step 4: fire OData GET call to read
            //https://www.youtube.com/watch?v=RMsTYQe_3Jg
            var that = this;
            oDataModel.read(sPath, {
                success: function(data){
                    //Step 5: Set the data back to local model
                    oModel.setProperty("/prodData", data);
                    that.changeMode("Change");
                    that.sPath = sPath;
                    that.loadPhoto(sPath).bind(that);
                },
                error: function(){
                    that.sPath = null;
                }
            });
            


        },
        loadPhoto: function(sPath){
            sPath = sPath.replace("ProductSet", "ProdPicSet");
            var photoPath = "/sap/opu/odata/sap/ZMY_ODATA_SRV_01" + sPath + "/$value";
            this.getView().byId("idPhoto").setSrc(photoPath);
        },
        mode: "Create",
        changeMode: function(sMode){
            if ( sMode === "Create" ) {
                this.mode = "Create";
                this.getView().byId("idSave").setText("Create");
                this.getView().getModel("prod").setProperty("/enable", true);

            }else{
                this.mode = "Change";
                this.getView().byId("idSave").setText("Update");
                this.getView().getModel("prod").setProperty("/enable", false);

            }
        },

        onSaveProduct: function(){
            //Step 1: Prepare our payload which we want to send to ABAP system
            var payload = this.getView().getModel("prod").getProperty("/prodData");
            //Step 2: Get the odata model object (default model)
            var oDataModel = this.getView().getModel();
            //Step 3: Trigger POST call from OData Model to /ProductSet entityset and send data
            if(this.mode === "Create"){
                oDataModel.create("/ProductSet", payload,{
                    //Step 4: Handle call back for SUCCESS and ERROR
                    success: function(data){
                        MessageToast.show("Yo Amigo! you did it! 😊");
                    },
                    error: function(oErr){
                        //MessageBox.error("Oops! something is fishy 😒");
                        MessageBox.error(JSON.parse(oErr.responseText).error.innererror.errordetails[0].message);
                    }
                });
            }else{
                oDataModel.update(this.sPath, payload,{
                    //Step 4: Handle call back for SUCCESS and ERROR
                    success: function(data){
                        MessageToast.show("Yo Amigo! The update was done 😊");
                    },
                    error: function(oErr){
                        //MessageBox.error("Oops! something is fishy 😒");
                        MessageBox.error(JSON.parse(oErr.responseText).error.innererror.errordetails[0].message);
                    }
                });
            }
            
            
        },
        onLoadExp: function(){
            //Step 1: get the category from the drop down
            var oModel = this.getView().getModel("prod");
            var payload = oModel.getProperty("/prodData");
            var sCategory = payload.CATEGORY;
            //Step 2: Get the Odata model object
            var oDataModel = this.getView().getModel();
            //Step 3: Call the Odata request to load data from server with category
            var that = this;
            oDataModel.callFunction("/GetMostExpensiveProduct",{
                urlParameters: {
                    "I_CATEGORY": sCategory
                },
                //Step 4: Handle callback and set data to screen
                success: function(data){
                    oModel.setProperty("/prodData", data);
                    that.changeMode("Change");
                    that.sPath = sPath;
                },
                error: function(oErr){
                    MessageBox.error(JSON.parse(oErr.responseText).error.innererror.errordetails[0].message);
                }
            });
            

        },
        onDelete: function () {
            var that = this;
            //Step 1: ask user if they sure of deletion
            MessageBox.confirm("Would you like to delete?",{
                onClose: function(status){
                    if (status === "OK"){
                        //Step 2: get the odata model object
                        var oDataModel = that.getView().getModel();
                        //Step 3: perform the odata call to send DELETE request for the selected product
                        oDataModel.remove(that.sPath, {
                            success: function(){
                                //Step 4: Handle call back
                                MessageToast.show("The object has been deleted now!");
                            }
                        });
                    }
                }
            });

        },
        onClearScreen: function (params) {
            this.changeMode("Create");
            this.getView().getModel("prod").setData({
                "enable": true,
                "prodData": {
                    "PRODUCT_ID" : "",
                    "TYPE_CODE" : "PR",
                    "CATEGORY" : "",
                    "NAME" : "",
                    "DESCRIPTION" : "",
                    "SUPPLIER_ID" : "0100000051",
                    "SUPPLIER_NAME" : "TECUM",
                    "PRICE" : 0,
                    "CURRENCY_CODE" : "USD",
                    "TAX_TARIF_CODE" : "1 ",
                    "MEASURE_UNIT" : "EA",
                    "DIM_UNIT" : "CM"
                }
            });
        }
    });
}); 