# -*- coding: utf-8 -*-
from odoo import models, fields, api


# Buy X Get Y
class IrPosPromotionBxGy(models.Model):
    _name = 'ir.pos.promotion.bxgy'

    product_id = fields.Many2one('product.product', string='Product', required=True, index=True, ondelete='cascade', domain=[('available_in_pos', '=', True)])
    promotion_program_id_buy = fields.Many2one('pos.promotion.program', string='Promotion Program',
                            ondelete='cascade')
    promotion_program_id_get = fields.Many2one('pos.promotion.program', string='Promotion Program 2', ondelete='cascade',
                                               index=True)
    min_qty = fields.Integer(string='Min Qty', required=True, default=1)
    # max_qty = fields.Integer(string='Max Qty', required=True, default=1)


class PosPromotionProgram(models.Model):
    _inherit = 'pos.promotion.program'

    number_select_free = fields.Integer(string='Number of selectable free items', required=True, default=1,
                                        states={'active': [('readonly', True)]})
    pos_promotion_bxgy_buy = fields.One2many('ir.pos.promotion.bxgy', 'promotion_program_id_buy', string='Buy Product',
                                      copy=True, states={'active': [('readonly', True)]})
    pos_promotion_bxgy_get = fields.One2many('ir.pos.promotion.bxgy', 'promotion_program_id_get', string='Get Product',
                                             copy=True, states={'active': [('readonly', True)]})