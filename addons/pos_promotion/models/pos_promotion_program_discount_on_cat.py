# -*- coding: utf-8 -*-
from odoo import models, fields, api

#By X pay Y
class IrPosPromotionDiscountOnCat(models.Model):
    _name = 'ir.pos.promotion.discount.on.cat'

    category_id = fields.Many2one('pos.category', string='Category Name', required=True, index=True, ondelete='cascade')
    promotion_program_id = fields.Many2one('pos.promotion.program', string='Promotion Program', ondelete='cascade', index=True)
    type = fields.Selection([('percent', 'Percentage'), ('fixed', 'Fixed')], string='Type (Percentage| Fixed Amount)', required=True, default='percent')
    value = fields.Float(string='Value', required=True, default=1)

class PosPromotionProgram(models.Model):
    _inherit = 'pos.promotion.program'

    pos_promotion_discount_on_cat_access = fields.One2many('ir.pos.promotion.discount.on.cat', 'promotion_program_id', string='Discount On Category',
                                      copy=True, states={'active': [('readonly', True)]})