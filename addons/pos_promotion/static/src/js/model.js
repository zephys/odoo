odoo.define('pos_promotion.models', function (require) {
    "use strict";
    var gui = require('point_of_sale.gui');
    var models = require('point_of_sale.models');
    var _super_posmodel = models.PosModel.prototype;
    var alldays = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
    var nowDate = new Date().getTime();

    //pos.promotion.day model
    models.load_models({
        model: 'pos.promotion.day',
        fields: ['code'],
        loaded: function (self, promotion_days) {
            self.promotion_days = [];
            for (var i=0; i<promotion_days.length; i++) {
                self.promotion_days[promotion_days[i].id] = promotion_days[i].code;
            }
        },
    });

    //pos.promotion.program model
    models.load_models({
        model: 'pos.promotion.program',
        fields: [
            'id',
            'name',
            'description',
            'type', 'sequence',
            'state',
            'start_date',
            'end_date',
            'day_apply',
            'number_select_free',
            'pos_promotion_bxgy_buy',
            'pos_promotion_bxgy_get',
            'total_order'
        ],
        domain: [['state','=','active']],
        loaded: function (self, programs) {
            var d = new Date();
            var n = d.getDay();
            self.programs = [];
            self.program_ids = [];
            for (var i=0; i<programs.length; i++) {
                var days = programs[i].day_apply;
                var day_available = false;
                for (var j=0; j<days.length; j++) {
                    if (self.promotion_days[days[j]] == 'everyday' || self.promotion_days[days[j]] == alldays[n]) {
                        day_available = true;
                        break;
                    }
                }
                if (day_available) {
                    var start_date = programs[i].start_date;
                    var end_date = programs[i].end_date;
                    if ((start_date == '' && end_date == '') || (start_date == '' && new Date(end_date + ' 23:59:59').getTime() >= nowDate) || (new Date(start_date).getTime() <= nowDate && end_date == '') || (new Date(start_date).getTime() <= nowDate && new Date(end_date + ' 23:59:59').getTime() >= nowDate)) {
                        self.programs.push(programs[i]);
                        self.program_ids.push(programs[i].id);
                    }
                }
            }
        },
    });

    //ir.pos.promotion.discount model - danh sach cac san pham duoc discount theo chuong trinh khuyen mai
    models.load_models({
        model: 'ir.pos.promotion.discount',
        fields: ['product_id', 'promotion_program_id', 'min_qty', 'discount'],
        loaded: function (self, promotion_discount) {
            self.pos_promotion_product_discount = [];

            self.promotion_discount_approved = [];
            self.promotion_discount_product_approved = [];
            for (var i=0; i<promotion_discount.length; i++) {
                if (self.program_ids.indexOf(promotion_discount[i].promotion_program_id[0]) != -1) {
                    self.pos_promotion_product_discount.push({
                        'product_id': promotion_discount[i].product_id[0],
                        'promotion_program_id': promotion_discount[i].promotion_program_id[0],
                        'min_qty': promotion_discount[i].min_qty,
                        'discount': promotion_discount[i].discount
                    });
                }
            }
        },
    });

    // ir.pos.promotion.bxgy model - danh sach cac san pham khuyen mai va duoc khuyen mai theo chuong trinh buy x get y
    models.load_models({
        model: 'ir.pos.promotion.bxgy',
        fields: [
            'id',
            'product_id',
            'min_qty',
            'promotion_program_id_buy',
            'promotion_program_id_get'
        ],
        loaded: function (self, bxgys) {
            // console.log(bxgys);
            // console.log(self.programs);

            self.bxgy_bx = [];
            self.bxgy_gy = [];
            self.bxgy_programs = [];
            self.bxgy = bxgys;
            self.new_order_free_product = [];
            self.new_free_product_chosen_title = [];
            self.new_free_product_chosen_count = [];
            var check;
            for(var i = 0 ; i < self.programs.length ; i++){
                if(self.programs[i].type == 'bxgy'){
                    self.bxgy_programs.push(self.programs[i]);
                    if(self.programs[i].pos_promotion_bxgy_buy.length > 0){
                        for(var j = 0 ; j < self.programs[i].pos_promotion_bxgy_buy.length ; j++) {
                            for (var k = 0; k < bxgys.length; k++) {
                                if (self.programs[i].pos_promotion_bxgy_buy[j] == bxgys[k].id && self.programs[i].id == bxgys[k].promotion_program_id_buy[0]) {
                                    self.bxgy_bx.push({
                                        'bxgy_program_id' : bxgys[k].promotion_program_id_buy[0],
                                        'id': bxgys[k].product_id[0],
                                        'qty': bxgys[k].min_qty
                                    });
                                }
                            }
                        }
                    }
                    if(self.programs[i].pos_promotion_bxgy_get.length > 0){
                        for(var j = 0 ; j < self.programs[i].pos_promotion_bxgy_get.length ; j++){
                            for (var k = 0; k < bxgys.length; k++) {
                                if (self.programs[i].pos_promotion_bxgy_get[j] == bxgys[k].id && self.programs[i].id == bxgys[k].promotion_program_id_get[0]) {
                                    self.bxgy_gy.push({
                                        'bxgy_program_id' : bxgys[k].promotion_program_id_get[0],
                                        'id': bxgys[k].product_id[0]
                                    });
                                }
                            }
                        }
                    }
                }
            }
            // console.log(self.bxgy_bx);
            // console.log(self.bxgy_gy);
        },
    }),

    // ir.pos.promotion.specialprice model - danh sach cac san pham khuyen mai theo gia dac biet
    models.load_models({
        model: 'ir.pos.promotion.specialprice',
        fields: ['id','product_id','promotion_program_id','spec_price'],
        loaded: function (self, special_prices) {
            self.special_prices = [];
            for (var i=0; i<special_prices.length; i++) {
                self.special_prices.push({
                    'product_id': special_prices[i].product_id[0],
                    'promotion_program_id': special_prices[i].promotion_program_id[0],
                    'spec_price': special_prices[i].spec_price,
                });
            }
        },
    }),
    models.load_models({
        model: 'ir.pos.promotion.discount.on.cat',
        fields: ['category_id', 'promotion_program_id', 'type', 'value'],
        loaded: function (self, discount_on_cat) {
            self.discount_on_cat = [];
            for (var i=0; i<discount_on_cat.length; i++) {
                self.discount_on_cat.push({
                    'category_id': discount_on_cat[i].category_id[0],
                    'promotion_program_id': discount_on_cat[i].promotion_program_id[0],
                    'type': discount_on_cat[i].type,
                    'value': discount_on_cat[i].value,
                });
            }
        },
    }),

    //ir.pos.promotion.give.product model - danh sach cac san pham duoc discount theo chuong trinh khuyen mai
    models.load_models({
        model: 'ir.pos.promotion.give.product',
        fields: ['product_id', 'promotion_program_id'],
        loaded: function (self, promotion_give_product) {
            self.pos_promotion_product_give_product = [];
            //
            // self.promotion_discount_approved = [];
            // self.promotion_discount_product_approved = [];
            for (var i=0; i<promotion_give_product.length; i++) {
                if (self.program_ids.indexOf(promotion_give_product[i].promotion_program_id[0]) != -1) {
                    self.pos_promotion_product_give_product.push({
                        'product_id': promotion_give_product[i].product_id[0],
                        'promotion_program_id': promotion_give_product[i].promotion_program_id[0]
                    });
                }
            }
        },
    });

});
