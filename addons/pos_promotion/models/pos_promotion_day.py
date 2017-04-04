# -*- coding: utf-8 -*-
from odoo import models, fields, api


class PosPromotionDay(models.Model):
    _name = 'pos.promotion.day'

    name = fields.Char(string='Day in Week', required=True, index=True)
    code = fields.Char(string='Day code', required=True, index=True)