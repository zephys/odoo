odoo.define('pos_promotion.screen', function (require) {
    "use strict";

    var model = require('pos_promotion.models');
    var screens = require('point_of_sale.screens');

    // Tab
    // screens.ProductListWidget.include({
    //     init: function(parent, options) {
    //         this._super(parent, options);
    //         var self = this;
    //
    //         self.click_product_handler = function(){
    //             var product = self.pos.db.get_product_by_id(this.dataset.productId);
    //             // console.log(this.dataset.productId);
    //             if(this.dataset.productId){
    //                 if(self.specialprice)
    //             }
    //             options.click_product_action(product);
    //         };
    //     }
    // });

    // screens.ProductScreenWidget.include({
        // click_product: function(product) {
        //     var self = this;
        //     this._super.apply(this, arguments);

            // console.log(this.pos.get_order().get_orderlines());
            // console.log(product.id);
            // console.log(this.pos.specialprice[0].product_id[0]);

            // var orderlines = this.pos.get_order().get_orderlines();
            // var new_orderlines = [];
            //
            // var check = true;
            // new_orderlines.push(orderlines[0]);
            // for (var i = 1; i < orderlines.length; i++) {
            //     for (var j = 0; j < new_orderlines.length; j++) {
            //         if (new_orderlines[j].product.id == orderlines[i].product.id) {
            //             new_orderlines[j].quantity += orderlines[i].quantity;
            //             check = false;
            //         }
            //         if (j == new_orderlines.length - 1 && check) {
            //             new_orderlines.push(orderlines[i]);
            //         }
            //         check = true;
            //     }
            // }
            // new_orderlines.push(orderlines[i]);
            // for(var j = 0 ; j < this.pos.bxgy_bx.length ; j++){
            //     if(orderlines[i] == this.pos.bxgy_bx[j].product_id[0]){
            //         console.log('adsasd');
            //     }
            // }
        // }
    // });

    // screens.OrderWidget.include({
    //     init: function (parent, options) {
    //         this._super(parent, options);
    //         var sefl = this;
    //
    //         var order = this.pos.get('selectedOrder');
    //         console.log(order);
    //     }
    // });

});
