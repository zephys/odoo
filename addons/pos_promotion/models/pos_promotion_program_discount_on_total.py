# -*- coding: utf-8 -*-
from odoo import models, fields, api

#Discount on totak
class PosPromotionProgram(models.Model):
    _inherit = 'pos.promotion.program'

    total_order = fields.Float(string="Total order amount", required=True, default=0,
                               states={'active': [('readonly', True)]})
    discount_on_total_type = fields.Selection([('percent', 'Percentage'), ('fixed', 'Fixed')], string='Discount Type (Percentage| Fixed Amount)',
                            required=True, default='percent', states={'active': [('readonly', True)]})
    discount_on_total_value = fields.Float(string='Discount Value', required=True, default=1, states={'active': [('readonly', True)]})
