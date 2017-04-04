# -*- coding: utf-8 -*-
from odoo import models, fields, api


class IrPosPromotionSpecialPrice(models.Model):
    _name = 'ir.pos.promotion.specialprice'

    product_id = fields.Many2one('product.product', string='Product', required=True, index=True, ondelete='cascade', domain=[('available_in_pos', '=', True)])
    promotion_program_id = fields.Many2one('pos.promotion.program', string='Promotion Program', ondelete='cascade', index=True)
    spec_price = fields.Float(string='Special Price', required=True)

class PosPromotionProgram(models.Model):
    _inherit = 'pos.promotion.program'

    pos_promotion_special_price_access = fields.One2many('ir.pos.promotion.specialprice', 'promotion_program_id', string='Product',
                                      copy=True, states={'active': [('readonly', True)]})