odoo.define('pos_promotion.pos_promotion', function (require) {
    "use strict";

    var screens = require('point_of_sale.screens');
    var gui = require('point_of_sale.gui');
    var core = require('web.core');
    var widget_base = require('point_of_sale.BaseWidget');

    var _t = core._t;

    var PosPromotionButton = screens.ActionButtonWidget.extend({
        template: 'PosPromotionButton',
        button_click: function () {
            var self = this;

            self.apply_promotion();
        },
        apply_promotion: function () {
            var self = this;
            self.order = self.pos.get_order();
            self.order_orderlines = self.order.get_orderlines();
            self.orderlines = new Array();
            _.each(self.order_orderlines, function (orderline) {
                self.orderlines.push(orderline);
            });
            var program_available = this.pos.programs;
            var check_bxgy = 0;

            self.new_promotion_discount_approved = [];
            self.new_promotion_discount_product_approved = [];
            for (var i = 0; i < program_available.length; i++) {
                // check promotion progam type discount %

                if (program_available[i].type == 'discount') {
                    self.apply_pos_promotion_discount(program_available[i]);
                }
                if (program_available[i].type == 'special_price') {
                    self.apply_pos_promotion_special_price(program_available[i]);
                }
                if (program_available[i].type == 'bxgy') {
                    check_bxgy++;
                }
                if(i == program_available.length - 1 && check_bxgy != 0){
                    self.apply_pos_promotion_bxgy();
                }
                if (program_available[i].type == 'bxpy') {
                    self.apply_pos_promotion_bxpy(program_available[i])
                }
                if (program_available[i].type == 'give_product') {
                    self.apply_pos_promotion_give_product(program_available[i])
                }
                if (program_available[i].type == 'discount_on_cat') {
                    self.apply_pos_promotion_discount_on_cat(program_available[i])
                }
            }

            //cancel promotion type discount not available
            this.cancel_pos_promotion_discount();

        },

        //start promotion type: discount
        get_product_promotion_discount: function (promotion_id) {
            var self = this;
            var pos_promotion_product_discount = self.pos.pos_promotion_product_discount;
            var promotion_product = [];
            for (var i = 0; i < pos_promotion_product_discount.length; i++) {
                if (pos_promotion_product_discount[i].promotion_program_id == promotion_id) {
                    promotion_product.push(pos_promotion_product_discount[i]);
                }
            }
            return promotion_product;
        },
        apply_pos_promotion_discount: function (program) {
            var self = this;
            var pos_promotion_product_discount = self.get_product_promotion_discount(program.id);
            var orderlines = self.orderlines;
            self.promotions_product_discount_apply = [];
            for (var condition_count = 0; condition_count < pos_promotion_product_discount.length; condition_count++) {
                var apply = true;
                var min_qty = pos_promotion_product_discount[condition_count].min_qty;
                var product_id = pos_promotion_product_discount[condition_count].product_id;
                var p_qty = 0;
                var orderline_ids = [];
                for (var item_count = 0; item_count < orderlines.length; item_count++) {
                    if (orderlines[item_count].product.id == product_id) {
                        p_qty = parseFloat(p_qty) + parseFloat(orderlines[item_count].quantity);
                        orderline_ids.push(orderlines[item_count].id);
                    }
                }
                if (parseFloat(p_qty) <= 0 || parseFloat(p_qty) < parseFloat(min_qty)) {
                    apply = false;
                    // break;
                }
                if (apply === true) {
                    apply = false;
                    for (var j = 0; j < orderline_ids.length; j++) {
                        self.promotions_product_discount_apply.push({
                            'orderline_id': orderline_ids[j],
                            'discount': pos_promotion_product_discount[condition_count].discount
                        });
                    }
                }
            }
            if (self.promotions_product_discount_apply) {
                for (var i = 0; i < orderlines.length; i++) {
                    for (var j = 0; j < self.promotions_product_discount_apply.length; j++) {
                        if (self.promotions_product_discount_apply[j].orderline_id == orderlines[i].id) {
                            orderlines[i].pos_promotion_message = program.name + ': discount ' + self.promotions_product_discount_apply[j].discount + '%';
                            orderlines[i].set_discount(self.promotions_product_discount_apply[j].discount);
                            self.new_promotion_discount_product_approved.push(orderlines[i].id);
                        }
                    }
                }
            }
        },
        cancel_pos_promotion_discount: function () {
            var self = this;
            var orderlines = self.orderlines;
            var old_promotion_discount_approved = self.pos.promotion_discount_approved;
            var old_promotion_discount_product_approved = self.pos.promotion_discount_product_approved;
            if (old_promotion_discount_approved) {
                var new_promotion_discount_approve = self.new_promotion_discount_approved;
            }
            if (old_promotion_discount_product_approved) {
                var new_promotion_discount_product_approved = self.new_promotion_discount_product_approved;
                var cancel_product = [];
                for (var i = 0; i < old_promotion_discount_product_approved.length; i++) {
                    if (new_promotion_discount_product_approved.indexOf(old_promotion_discount_product_approved[i]) == -1) {
                        cancel_product.push(old_promotion_discount_product_approved[i]);
                        delete new_promotion_discount_product_approved[new_promotion_discount_product_approved.indexOf(old_promotion_discount_product_approved[i])];
                        // new_promotion_discount_product_approved.splice(new_promotion_discount_product_approved.indexOf(old_promotion_discount_product_approved[i]), 1);
                    }
                }
                self.pos.promotion_discount_product_approved = new_promotion_discount_product_approved;
                if (cancel_product) {
                    for (var i = 0; i < orderlines.length; i++) {
                        if (cancel_product.indexOf(orderlines[i].id) != -1) {
                            orderlines[i].pos_promotion_message = null;
                            orderlines[i].set_discount(0);
                        }
                    }
                }
            }
        },
        //end promotion type: discount

        //start promotion type: Buy X Pay Y
        apply_pos_promotion_bxpy: function (program) {
            return;
            var self = this;
            var pos_promotion_product_discount = self.get_product_promotion_discount(program.id);
            var orderlines = self.orderlines;
            self.promotions_product_discount_apply = [];
            for (var condition_count = 0; condition_count < pos_promotion_product_discount.length; condition_count++) {
                var apply = true;
                var min_qty = pos_promotion_product_discount[condition_count].min_qty;
                var product_id = pos_promotion_product_discount[condition_count].product_id;
                var p_qty = 0;
                var orderline_ids = [];
                for (var item_count = 0; item_count < orderlines.length; item_count++) {
                    if (orderlines[item_count].product.id == product_id) {
                        p_qty = parseFloat(p_qty) + parseFloat(orderlines[item_count].quantity);
                        orderline_ids.push(orderlines[item_count].id);
                    }
                }
                if (parseFloat(p_qty) <= 0 || parseFloat(p_qty) < parseFloat(min_qty)) {
                    apply = false;
                    break;
                }
                if (apply === true) {
                    apply = false;
                    for (var j = 0; j < orderline_ids.length; j++) {
                        self.promotions_product_discount_apply.push({
                            'orderline_id': orderline_ids[j],
                            'discount': pos_promotion_product_discount[condition_count].discount
                        });
                    }
                }
            }
            if (self.promotions_product_discount_apply) {
                for (var i = 0; i < orderlines.length; i++) {
                    for (var j = 0; j < self.promotions_product_discount_apply.length; j++) {
                        if (self.promotions_product_discount_apply[j].orderline_id == orderlines[i].id) {
                            orderlines[i].set_discount(self.promotions_product_discount_apply[j].discount);
                            self.new_promotion_discount_product_approved.push(orderlines[i].id);
                        }
                    }
                }
                if (program_available[i].type == 'discount_on_cat') {
                    self.apply_pos_promotion_discount_on_cat();
                }
            }
        },
        //end Buy X pay Y

        //Start give product
        get_product_promotion_give_product: function (promotion_id) {
            var self = this;
            var pos_promotion_product_give_product = self.pos.pos_promotion_product_give_product;
            var promotion_product = [];
            for (var i = 0; i < pos_promotion_product_give_product.length; i++) {
                if (pos_promotion_product_give_product[i].promotion_program_id == promotion_id) {
                    promotion_product.push(pos_promotion_product_give_product[i]);
                }
            }
            return promotion_product;
        },
        apply_pos_promotion_give_product: function (program) {
            return;
            var self = this;
            var order = self.order;
            var min_total_order = program.total_order;
            var current_total_order = order.get_total_with_tax();
            if (parseFloat(current_total_order) >= parseFloat(min_total_order)) {
                var title = program.name;
                // var product_list = this.pos.db.get_product_by_category(0);
                var product_list = self.get_product_promotion_give_product(program.id);
                this.gui.show_popup('getfreeproduct',{
                    // title: "Popup Title",
                    'list_title':title,
                    list: product_list,
                    confirm: function(item) {
                        // get the item selected by the user.
                    },
                    cancel: function(){
                        // user chose nothing
                    }
                });
            }
            return;
            self.promotions_product_discount_apply = [];
            for (var condition_count = 0; condition_count < pos_promotion_product_discount.length; condition_count++) {
                var apply = true;
                var min_qty = pos_promotion_product_discount[condition_count].min_qty;
                var product_id = pos_promotion_product_discount[condition_count].product_id;
                var p_qty = 0;
                var orderline_ids = [];
                for (var item_count = 0; item_count < orderlines.length; item_count++) {
                    if (orderlines[item_count].product.id == product_id) {
                        p_qty = parseFloat(p_qty) + parseFloat(orderlines[item_count].quantity);
                        orderline_ids.push(orderlines[item_count].id);
                    }
                }
                if (parseFloat(p_qty) <= 0 || parseFloat(p_qty) < parseFloat(min_qty)) {
                    apply = false;
                    break;
                }
                if (apply === true) {
                    apply = false;
                    for (var j = 0; j < orderline_ids.length; j++) {
                        self.promotions_product_discount_apply.push({
                            'orderline_id': orderline_ids[j],
                            'discount': pos_promotion_product_discount[condition_count].discount
                        });
                    }
                }
            }
            if (self.promotions_product_discount_apply) {
                for (var i = 0; i < orderlines.length; i++) {
                    for (var j = 0; j < self.promotions_product_discount_apply.length; j++) {
                        if (self.promotions_product_discount_apply[j].orderline_id == orderlines[i].id) {
                            orderlines[i].set_discount(self.promotions_product_discount_apply[j].discount);
                            self.new_promotion_discount_product_approved.push(orderlines[i].id);
                        }
                    }
                }
            }
        },
        //end promotion give product

        // start promotion buy x get y product
        apply_pos_promotion_bxgy: function () {
            var self = this;
            var order = this.pos.get_order();
            var orderlines = this.pos.get_order().get_orderlines();
            if(orderlines.length > 0){
                // console.log(this.pos.get_order().get_orderlines());
                // console.log(this.pos.bxgy_bx);
                // console.log(this.pos.bxgy_gy);
                // console.log(this.pos.bxgy);
                // console.log(this.pos.bxgy_programs);

                // gop san pham trong order
                var orderlines_object = [];
                var check;
                for(var i = 0 ; i < orderlines.length ; i++){
                    check = false;
                    if(i == 0){
                        orderlines_object.push({
                            'id': orderlines[i].product.id,
                            'qty': orderlines[i].quantity
                        });
                        continue;
                    }
                    for(var j = 0 ; j < orderlines_object.length ; j++) {
                        if (orderlines_object[j].id == orderlines[i].product.id) {
                            orderlines_object[j].qty += orderlines[i].quantity;
                            check = true;
                            break;
                        }
                    }
                    if(!check){
                        orderlines_object.push({
                            'id': orderlines[i].product.id,
                            'qty': orderlines[i].quantity
                        });
                    }
                }

                // kiem tra san pham theo chuong trinh khuyen mai
                var bxgy_programs = this.pos.bxgy_programs;
                var bxgy_bx = this.pos.bxgy_bx;
                var bxgy_gy = this.pos.bxgy_gy;
                var bxgy_gy_list = []; // danh sach san pham get y
                var bxgy_gy_title = []; // danh sach ten chuong trinh
                var product_list = this.pos.db.get_product_by_category(0);
                var check_bxgy_bx,bxgy_bx_total;
                var bxgy_bx_product = false,bxgy_bx_product_index;
                var count_item = [];
                for(var i = 0 ; i <  bxgy_programs.length; i++){
                    check_bxgy_bx = true;
                    bxgy_bx_total = 0;
                    for(var j = 0 ; j < bxgy_bx.length ; j++){
                        bxgy_bx_product = false;
                        if(bxgy_programs[i].id == bxgy_bx[j].bxgy_program_id){
                            // kiem tra ton tai
                            for(var k = 0 ; k < orderlines_object.length ; k++){
                                if(bxgy_bx[j].id == orderlines_object[k].id){
                                    bxgy_bx_product = true;
                                    bxgy_bx_product_index = k;
                                    break;
                                }
                            }
                            // kiem tra min qty
                            if(bxgy_bx_product){
                                if(bxgy_bx[j].qty <= orderlines_object[bxgy_bx_product_index].qty) {
                                        bxgy_bx_total++;
                                }else{
                                    check_bxgy_bx = false;
                                    break;
                                }
                            }
                            if(!bxgy_bx_product){
                                check_bxgy_bx = false;
                                break;
                            }
                            if(check_bxgy_bx && bxgy_bx_total == bxgy_programs[i].pos_promotion_bxgy_buy.length){
                                break;
                            }
                        }
                    }
                    if(check_bxgy_bx){
                        for(var k = 0 ; k < product_list.length ; k++){
                            for(var j = 0 ; j < bxgy_gy.length ; j++){
                                if(bxgy_programs[i].id == bxgy_gy[j].bxgy_program_id){
                                    if(product_list[k].id == bxgy_gy[j].id){
                                        bxgy_gy_list.push({
                                            product_bxgy_id: bxgy_programs[i].id,
                                            product_bxgy_name: bxgy_programs[i].name,
                                            product_list : product_list[k]
                                        });
                                    }
                                }
                            }
                        }
                        bxgy_gy_title.push({
                            id : bxgy_programs[i].id,
                            name : bxgy_programs[i].name,
                            chosen_product : bxgy_programs[i].number_select_free,
                            count_product : 0
                        });
                    }
                }

                // console.log(bxgy_gy_title);
                // console.log(bxgy_gy_list);
                // console.log(count_item);
                if(bxgy_gy_list.length > 0){
                    this.gui.show_popup('getfreeproduct',{
                        'list_title':bxgy_gy_title,
                        list: bxgy_gy_list,
                        choose_title: function (item) {
                            var free_product_by_program = [];
                            for(var i = 0 ; i < bxgy_gy_list.length ; i++){
                                if(item.id == bxgy_gy_list[i].product_bxgy_id){
                                    free_product_by_program.push(bxgy_gy_list[i]);
                                }
                            }
                            return free_product_by_program;
                        },
                        ok: function(item,item1) {
                            self.pos.new_free_product_chosen_count = item;
                            self.pos.new_free_product_chosen_title = item1;
                            // console.log(item);
                            // console.log(item1);
                            // console.log(self.pos.new_order_free_product);
                            if(self.pos.new_order_free_product.length > 0){
                                var re_orderline = self.pos.get_order().get_orderlines();
                                var new_order = self.pos.new_order_free_product;
                                // console.log(re_orderline);
                                for(var i = 0 ; i < new_order.length ; i++){
                                    for(var j = 0 ; j < re_orderline.length ; j++){
                                        if(re_orderline[j].id == new_order[i].order_line_position){
                                            order.remove_orderline(re_orderline[j]);
                                        }
                                    }
                                }
                            }
                            for(var i = 0 ; i < item.length ; i++){
                                for(var j = 0 ; j < bxgy_gy_list.length ; j++){
                                    if(item[i].product_id == bxgy_gy_list[j].product_list.id && item[i].program_id == bxgy_gy_list[j].product_bxgy_id){
                                        order.add_product(self.pos.db.get_product_by_id(item[i].product_id));
                                        var last_orderline = self.pos.get_order().get_orderlines()[self.pos.get_order().get_orderlines().length-1];
                                        last_orderline.pos_promotion_message = bxgy_gy_list[j].product_bxgy_name;
                                        last_orderline.set_unit_price(0);
                                        self.pos.new_order_free_product.push({
                                            order_line_position : last_orderline.id,
                                            bxgy_program_id : item[i].program_id
                                        });
                                    }
                                }
                            }
                        },
                        cancel: function(){
                            // user chose nothing
                        }
                    });
                }
                if(bxgy_gy_list.length == 0 && self.pos.new_order_free_product.length > 0){
                    // console.log(self.pos.new_order_free_product);
                    var re_orderline = self.pos.get_order().get_orderlines();
                    var new_order = self.pos.new_order_free_product;
                    for(var i = 0 ; i < new_order.length ; i++){
                        for(var j = 0 ; j < re_orderline.length ; j++){
                            if(re_orderline[j].id == new_order[i].order_line_position){
                                order.remove_orderline(re_orderline[j]);
                            }
                        }
                    }
                }
            }
        },
        // end promotion buy x get y product

        //start promotion type special price
        get_product_promotion_special_price: function (promotion_id) {
            var self = this;
            var pos_promotion_special_price = self.pos.special_prices;
            var promotion_product = [];
            for (var i = 0; i < pos_promotion_special_price.length; i++) {
                if (pos_promotion_special_price[i].promotion_program_id == promotion_id) {
                    promotion_product.push(pos_promotion_special_price[i]);
                }
            }
            return promotion_product;
        },
        apply_pos_promotion_special_price: function (program) {
            var self = this;
            var orderlines = self.orderlines;
            var promotion_product = self.get_product_promotion_special_price(program.id);
            for (var i=0; i<promotion_product.length; i++) {
                for (var item_count = 0; item_count < orderlines.length; item_count++) {
                    if (orderlines[item_count].product.id == promotion_product[i].product_id) {
                        orderlines[item_count].pos_promotion_message = program.name + ': special price ' + self.chrome.format_currency(promotion_product[i].spec_price);
                        orderlines[item_count].set_unit_price(promotion_product[i].spec_price);
                    }
                }
            }
        },
        //end promotion type special price

        //start promotion type discount on cat
        get_category_promotion_discount_on_cat: function (promotion_id) {
            var self = this;
            var pos_promotion_discount_on_cat = self.pos.discount_on_cat;
            var promotion_category = [];
            for (var i = 0; i < pos_promotion_discount_on_cat.length; i++) {
                if (pos_promotion_discount_on_cat[i].promotion_program_id == promotion_id) {
                    promotion_category.push(pos_promotion_discount_on_cat[i]);
                }
            }
            return promotion_category;
        },

        apply_pos_promotion_discount_on_cat: function (program) {
            var self = this;
            var orderlines = self.orderlines;
            var promotion_category = self.get_category_promotion_discount_on_cat(program.id);
            for (var i=0; i<promotion_category.length; i++) {
                for (var item_count = 0; item_count < orderlines.length; item_count++) {
                    if (orderlines[item_count].product.pos_categ_id[0] == promotion_category[i].category_id) {
                        if (promotion_category[i].type == 'percent') {
                            orderlines[item_count].pos_promotion_message = program.name + ': discount ' + promotion_category[i].value + '%';
                            orderlines[item_count].set_discount(promotion_category[i].value);
                        }
                        if (promotion_category[i].type == 'fixed') {
                            orderlines[item_count].pos_promotion_message = program.name + ': discount ' + self.chrome.format_currency(promotion_category[i].value);
                            orderlines[item_count].set_unit_price(orderlines[item_count].product.price - promotion_category[i].value);
                        }
                    }
                }
            }
        },
        //end promotion type discount on cat
    });

    screens.define_action_button({
        'name': 'pos_promotion',
        'widget': PosPromotionButton,
        'condition': function(){
            return true;
            // return this.pos.config.iface_discount && this.pos.config.discount_product_id;
        },
    });


});
