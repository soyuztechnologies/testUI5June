sap.ui.define([
    'emc/fin/ar/controller/BaseController',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator'
], function(BaseController, Filter, FilterOperator) {
    'use strict';
    return BaseController.extend("emc.fin.ar.controller.View1",{
        onInit: function(){
            
            this.oRouter = this.getOwnerComponent().getRouter();

        },
        onNext: function(sPath){

            this.oRouter.navTo("superman",{
                pid: sPath.replace("/","")
            });
            // //Step 1: Get the current view object
            // var oView = this.getView();

            // //Step 2: Get the mother object (parent)
            // var oAppCon = oView.getParent();

            // //Step 3: Let the parent navigate to second view
            // oAppCon.to("idView2");

        },
        onItemDelete: function(oEvent){

            //Step 1: We want to know which is the exact item user pressed deleted - object of the item
            var oListItemToBeDeleted = oEvent.getParameter("listItem");

            //Step 2: We get the object of the list control
            var oList = oEvent.getSource();

            //Step 3: Ask list to delete that item from inside
            oList.removeItem(oListItemToBeDeleted);

        },
        onSelChange: function(oEvent){
            
            //Step 1: Findout the item which was selected by user (get table object)
            var oSelectItem = oEvent.getParameter("listItem");
            //Step 2: get the path of the element associated to that (get the path of the row /empTab/1)
            var sPath = oSelectItem.getBindingContextPath();
            //Step 3: get the view2 object (got the simple form object)
            //var oView2 = this.getView().getParent().getPages()[1];
            //in case of split screen layout
            // var oView2 = this.getView().getParent().getParent().getDetailPages()[0];

            // //Step 4: Bind the element path with V2 (bindElement with simple Form)
            // oView2.bindElement(sPath,{
            //     expand: 'To_Supplier'
            // });

            this.onNext(sPath);

        },
        onAdd: function(){
            this.oRouter.navTo("add");
        },
        onSearch: function(oEvent){

            //Step 1: What user tried to search in the field
            var sValue = oEvent.getParameter("query");
            if (sValue === undefined){
                sValue = oEvent.getParameter("newValue");
            }
            //Step 2: Create a filter object (condition - 2 operands and 1 operator)
            var oFilter1 = new Filter("CATEGORY", FilterOperator.Contains,sValue);
            var oFilter2 = new Filter("type", FilterOperator.Contains,sValue);
            var oFilter = new Filter({
                filters: [oFilter1, oFilter2],
                and: false
            });
            //Step 3: Get the items binding for the list control
            var oBindingsItems = this.getView().byId("idList").getBinding("items");
            //Step 4: Inject the filter
            oBindingsItems.filter([oFilter1]);

        }
    });
});