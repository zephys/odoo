odoo.define('pos_promotion.popup', function (require) {
    "use strict";

    var posbasewidget = require('point_of_sale.BaseWidget');
    var gui = require('point_of_sale.gui');
    var basepopup = require('point_of_sale.popups');
    var screens = require('point_of_sale.screens');

    var GetFreeProductPopupWidget = basepopup.extend({
        template: 'GetFreeProductPopupWidget',
        events: _.extend({}, basepopup.prototype.events, {
            'click .free-product-title-selection-item':    'click_free_product_title',
            'click .free-product-selection-item': 'click_choose_free_product',
            'click .confirm-free-product': 'click_confirm_free_product'
        }),
        renderElement: function(list_title,check){
            this._super();
            // console.log(list_title);
            // console.log(check);

            var new_free_product_chosen_count = this.pos.new_free_product_chosen_count;
            var new_free_product_chosen_title = this.pos.new_free_product_chosen_title;
            if(check == 0 && new_free_product_chosen_count.length > 0 && new_free_product_chosen_title.length > 0){
                for(var i = 0 ; i < new_free_product_chosen_title.length ; i++){
                    if(new_free_product_chosen_title[i].count_product != 0){
                        $(".show-item-chosen[data-id="+new_free_product_chosen_title[i].id+"]").text(new_free_product_chosen_title[i].count_product);
                        for(var j = 0 ; j < new_free_product_chosen_count.length ; j++){
                            if(new_free_product_chosen_title[i].id == new_free_product_chosen_count[j].program_id){
                                $(":input[data-product-checkbox-id="+new_free_product_chosen_count[j].product_id+"][data-item-index="+new_free_product_chosen_count[j].product_index+"]").prop('checked', true);
                            }
                        }
                    }
                }
            }
            if(check == 1){
                var title_list = list_title;
                for(var i = 0 ; i < title_list.length ; i++){
                    if(title_list[i].count_product != 0){
                        $(".show-item-chosen[data-id="+title_list[i].id+"]").text(title_list[i].count_product);
                        for(var j = 0 ; j < this.count_chosen_product.length ; j++){
                            if(title_list[i].id == this.count_chosen_product[j].program_id){
                                $(":input[data-product-checkbox-id="+this.count_chosen_product[j].product_id+"][data-item-index="+this.count_chosen_product[j].product_index+"]").prop('checked', true);
                            }
                        }
                    }
                }
            }

        },
        show: function(options){
            options = options || {};
            var self = this;
            this._super(options);

            // console.log(options);
            var first_title = [];
            if(options.list.length > 0){
                first_title.push(options.list[0]);
                for(var i = 1 ; i < options.list.length ; i++){
                    if(options.list[0].product_bxgy_id == options.list[i].product_bxgy_id){
                         first_title.push(options.list[i]);
                    }
                }
                this.list = first_title || [];
            }else{
                this.list = options.list || [];
            }
            this.list_title = options.list_title || [];
            this.count_chosen_product = [];
            if(this.pos.new_free_product_chosen_title.length > 0){
                this.list_title = this.pos.new_free_product_chosen_title;
                this.count_chosen_product = this.pos.new_free_product_chosen_count;
            }

            this.renderElement([],0);
        },
        click_item : function(event) {
            this.gui.close_popup();
            if (this.options.confirm) {
                var item = this.list[parseInt($(event.target).data('item-index'))];
                item = item ? item.item : item;
                this.options.confirm.call(self,item);
            }
        },
        click_confirm_free_product: function () {
            // console.log(this.count_chosen_product);
            // if(this.count_chosen_product.length > 0){
                this.options.ok.call(self,this.count_chosen_product,this.list_title);
            // }
        },
        click_free_product_title: function (event) {
            var self= this;
            var item = this.list_title[parseInt($(event.target).data('item-index'))];
            this.list = this.options.choose_title.call(self,item);
            // console.log(this.list_title);
            this.renderElement(this.list_title,1);
        },
        click_choose_free_product: function (event) {
            var item_id = parseInt($(event.target).data('product-checkbox-id'));
            var item_index = parseInt($(event.target).data('item-index'));
            var item_bxgy_id = parseInt($(event.target).data('product-bxgy-id'));
            // console.log(item_id + ": " + item_index + ": " + item_bxgy_id);
            var node = ":input[data-product-checkbox-id="+item_id+"][data-item-index="+item_index+"]";
            if($(node).is(':checked')){
                // console.log('a');
                for(var i = 0 ; i < this.list_title.length ; i++){
                    if(this.list_title[i].id == item_bxgy_id){
                        if(this.list_title[i].chosen_product >= this.list_title[i].count_product && this.list_title[i].count_product > 0){
                            $(node).prop('checked', false);
                            for(var j = 0 ; j < this.count_chosen_product.length ; j++){
                                if(this.count_chosen_product[j].program_id == item_bxgy_id && this.count_chosen_product[j].product_id == item_id){
                                    this.count_chosen_product.splice(j,1);
                                }
                            }
                            // console.log('b');
                            this.list_title[i].count_product--;
                            $(".show-item-chosen[data-id="+item_bxgy_id+"]").text(this.list_title[i].count_product);
                        }
                    }
                }
                // console.log(this.count_chosen_product);
            }else{
                // console.log('1');
                for(var i = 0 ; i < this.list_title.length ; i++){
                    if(this.list_title[i].id == item_bxgy_id){
                        if(this.list_title[i].chosen_product > this.list_title[i].count_product){
                            $(node).prop('checked', true);
                            var check = true;
                            for(var j = 0 ; j < this.count_chosen_product.length ; j++){
                                if(this.count_chosen_product[j].program_id == item_bxgy_id && this.count_chosen_product[j].product_id == item_id){
                                    check = false;
                                }
                            }
                            if(check){
                                this.count_chosen_product.push({
                                    program_id : item_bxgy_id,
                                    product_id : item_id,
                                    product_index : item_index
                                });
                            }
                            // console.log('2');
                            this.list_title[i].count_product++;
                            $(".show-item-chosen[data-id="+item_bxgy_id+"]").text(this.list_title[i].count_product);
                        }
                    }
                }
                // console.log(this.count_chosen_product);
            }
            // this.pos.new_free_product_chosen = this.list_title;
            // this.pos.new_free_product_chosen_count = this.count_chosen_product;
        },
        get_product_image_url: function(product){
            return window.location.origin + '/web/image?model=product.product&field=image_medium&id='+product;
        },
    });
    gui.define_popup({name:'getfreeproduct', widget: GetFreeProductPopupWidget});
});