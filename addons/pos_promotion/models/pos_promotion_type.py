# -*- coding: utf-8 -*-
from odoo import models, fields, api


class PosPromotionType(models.Model):
    _name = 'pos.promotion.type'

    name = fields.Char(string='Promotion Type Name', required=True, index=True)
    code = fields.Char(string='Promotion Type Code', required=True, index=True)
    status = fields.Selection([('active', 'Active'), ('inactive', 'Inactive')], string='Promotion Status', default='active')