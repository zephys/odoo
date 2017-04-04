# -*- coding: utf-8 -*-
from odoo import models, fields, api

#Gift Product
class IrPosPromotionGiveProduct(models.Model):
    _name = 'ir.pos.promotion.give.product'

    product_id = fields.Many2one('product.product', string='Product', required=True, index=True, ondelete='cascade', domain=[('available_in_pos', '=', True)])
    promotion_program_id = fields.Many2one('pos.promotion.program', string='Promotion Program', ondelete='cascade', index=True)


class PosPromotionProgram(models.Model):
    _inherit = 'pos.promotion.program'

    total_order = fields.Float(string="Total order amount", required=True, default=0, states={'active': [('readonly', True)]})
    number_select_gift = fields.Integer(string='Number of selectable gift items', required=True, default=1, states={'active': [('readonly', True)]})
    pos_promotion_give_product_access = fields.One2many('ir.pos.promotion.give.product', 'promotion_program_id', string='Free gift product',
                                      copy=True, states={'active': [('readonly', True)]})