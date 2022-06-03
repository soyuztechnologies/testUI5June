sap.ui.define([
    'emc/fin/ar/controller/BaseController',
    'emc/fin/ar/util/formatter',
    'sap/ui/core/Fragment',
    'sap/m/MessageBox',
    'sap/m/MessageToast'
], function(BaseController, Formatter, Fragment, MessageBox, MessageToast) {
    'use strict';
    return BaseController.extend("emc.fin.ar.controller.View2",{
        formatter: Formatter,
        onInit: function(){
            this.oRouter = this.getOwnerComponent().getRouter();
            //register the event handler for Route matchd
            this.oRouter.getRoute("superman").attachMatched(this.herculis, this);
        },
        herculis: function(oEvent){
            console.log(oEvent);
            var params = oEvent.getParameter("arguments");
            var sPath = "/" + params.pid;
            this.getView().bindElement(sPath,{
                expand: 'To_Supplier'
            });
        },
        onBack: function(){
            this.getView().getParent().to("idView1");
            
        },
        onMsgConfirm: function(status){
            //here we cannot access this pointer at all
            
            var msgConfirm = this.getView().getModel("i18n").getResourceBundle().getText("orderComplete",["5555"]);
            console.log(status);
            console.log(this);
            if(status === "OK"){
                MessageToast.show(msgConfirm);
            }else{
                MessageBox.warning("You have cancelled it");
            }

        },
        onReject: function(){
            MessageBox.error("The order has been rejected");
        },
        onApprove: function(){

            //DO NOT USE alert of basic JS
            //Use SAP UI5 Message API for messages
            var msgConfirm = this.getView().getModel("i18n").getResourceBundle().getText("msgConfirm");
            MessageBox.confirm(msgConfirm,{
                //We want the event handler to access controller object
                //so we pass this pointer to it seprately
                onClose: this.onMsgConfirm.bind(this)
            });

        },
        cityPopup: null,
        oCityField: null,
        onPopupConfirm: function(oEvent){
            
            //Step 1: Get to know which item user selected
            var oWhichItemUserSelect = oEvent.getParameter("selectedItem");
            //Get the label from that item object - name of the city
            var sLabel = oWhichItemUserSelect.getLabel();

            if(oEvent.getSource().getId().indexOf("city") != -1){
                //Set this data back to the input field
                this.oCityField.setValue(sLabel);
            }else{

            }
            

        },
        onF4Help: function(oEvent){
            //IF lo_alv IS NOT INITIAL
            //alert("this function is under construction 😂😂")
            //Inside the promise, we cannot access 'this' pointer as controller object
            //so we create a local variable as copy of this, and use the local variable which
            //is accessible always in the callbacks
            var that = this;
            this.oCityField = oEvent.getSource();
            //We add a condition to avoid creation of duplicate objects again and again
            if(!this.cityPopup){
                Fragment.load({
                    id: 'city',
                    name:'emc.fin.ar.fragments.popup',
                    controller: this
                })
                //it is a promise because fragment.load is going to load fragment asynchronously
                .then(function(oFragment){
                    //here inside the callback/promise we should use local variable only
                    that.cityPopup = oFragment;
                    that.cityPopup.setTitle("City");
                    //Allow the fragment to access the resources which view have access to like MODEL
                    that.getView().addDependent(that.cityPopup);
                    that.cityPopup.setMultiSelect(false);
                    //Syntax 4  for agg binding
                    that.cityPopup.bindAggregation("items",{
                        path: '/cities',
                        template: new sap.m.DisplayListItem({
                            label: '{name}',
                            value: '{famousFor}'
                        })
                    });

                    that.cityPopup.open();
                });
            }else{
                this.cityPopup.open();
            }

        },
        supplierPopup: null,
        onFilter: function(){
            //IF lo_alv IS NOT INITIAL
            //alert("this function is under construction 😂😂")
            //Inside the promise, we cannot access 'this' pointer as controller object
            //so we create a local variable as copy of this, and use the local variable which
            //is accessible always in the callbacks
            var that = this;
            //We add a condition to avoid creation of duplicate objects again and again
            if(!this.supplierPopup){
                Fragment.load({
                    id: 'supplier',
                    name:'emc.fin.ar.fragments.popup',
                    controller: this
                })
                //it is a promise because fragment.load is going to load fragment asynchronously
                .then(function(oFragment){
                    //here inside the callback/promise we should use local variable only
                    that.supplierPopup = oFragment;
                    that.supplierPopup.setTitle("Suppliers");
                    //Allow the fragment to access the resources which view have access to like MODEL
                    that.getView().addDependent(that.supplierPopup);
                    //Syntax 4  for agg binding
                    that.supplierPopup.bindAggregation("items",{
                        path: '/suppliers',
                        template: new sap.m.DisplayListItem({
                            label: '{name}',
                            value: '{sinceWhen}'
                        })
                    });

                    that.supplierPopup.open();
                });
            }else{
                this.supplierPopup.open();
            }
            
        }
    });
});