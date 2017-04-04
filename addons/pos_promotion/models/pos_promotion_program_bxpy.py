# -*- coding: utf-8 -*-
from odoo import models, fields, api

#By X pay Y
class IrPosPromotionBxpy(models.Model):
    _name = 'ir.pos.promotion.bxpy'

    product_id = fields.Many2one('product.product', string='Product', required=True, index=True, ondelete='cascade', domain=[('available_in_pos', '=', True)])
    promotion_program_id = fields.Many2one('pos.promotion.program', string='Promotion Program', ondelete='cascade', index=True)
    qty_buy = fields.Integer(string='Qty buy', required=True, default=1)
    qty_pay = fields.Integer(string='Qty to pay', required=True, default=1)

class PosPromotionProgram(models.Model):
    _inherit = 'pos.promotion.program'

    pos_promotion_bxpy_access = fields.One2many('ir.pos.promotion.bxpy', 'promotion_program_id', string='Product (Buy X Pay Y)',
                                      copy=True, states={'active': [('readonly', True)]})