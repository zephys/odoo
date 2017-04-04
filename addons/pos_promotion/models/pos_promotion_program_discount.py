# -*- coding: utf-8 -*-
from odoo import models, fields, api


class IrPosPromotionDiscount(models.Model):
    _name = 'ir.pos.promotion.discount'

    product_id = fields.Many2one('product.product', string='Product', required=True, index=True, ondelete='cascade', domain=[('available_in_pos', '=', True)])
    promotion_program_id = fields.Many2one('pos.promotion.program', string='Promotion Program', ondelete='cascade', index=True)
    min_qty = fields.Integer(string='Min Qty', required=True, default=1)
    discount = fields.Float(string='Discount (%)', required=True)

class PosPromotionProgram(models.Model):
    _inherit = 'pos.promotion.program'

    pos_promotion_discount_access = fields.One2many('ir.pos.promotion.discount', 'promotion_program_id', string='Product discount',
                                      copy=True, states={'active': [('readonly', True)]})