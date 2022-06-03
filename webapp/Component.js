sap.ui.define([
    'sap/ui/core/UIComponent'
], function(UIComponent) {
    'use strict';
    return UIComponent.extend("emc.fin.ar.Component",{

        metadata: {
            manifest: "json"
        },
        init: function(){
            //super->constructor()
            //we are calling parent class(given by sap) constructor
            //Because parent will gift functionality to us - e.g. Router object
            sap.ui.core.UIComponent.prototype.init.apply(this);

            //get the router object
            var oRouter = this.getRouter();
            //we will call initialize
            oRouter.initialize();

        },
        // createContent: function(){
        //     //Step 1: Create the object of our Root view and return it out
        //     //of the Component.js, this is the view component js talk to
        //     var oView = new sap.ui.view({
        //         viewName: "emc.fin.ar.view.App",
        //         id: "idAppView",
        //         type: "XML"
        //     });

        //     //Step 2: Whatever additional views needed in our app
        //     //We define them and create object for them here

        //     var oView1 = new sap.ui.view({
        //         viewName: "emc.fin.ar.view.View1",
        //         id: "idView1",
        //         type: "XML"
        //     });


        //     var oView2 = new sap.ui.view({
        //         viewName: "emc.fin.ar.view.View2",
        //         id: "idView2",
        //         type: "XML"
        //     });

        //     //Step 3: Get the object of app container from App view
        //     //Place all our views inside of that container control of App.view.xml - AppCon
        //     var oAppCon = oView.byId("appCon");
        //     oAppCon.addMasterPage(oView1).addDetailPage(oView2);


        //     return oView;
        // },
        destroy: function(){

        }

    });
});