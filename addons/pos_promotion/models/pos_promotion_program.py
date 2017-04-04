# -*- coding: utf-8 -*-
from odoo import models, fields, api


class PosPromotionProgram(models.Model):
    _name = 'pos.promotion.program'

    @api.model
    def get_type_selection(self):
        promotion_types = self.env['pos.promotion.type'].search([('status', '=', 'active')])
        return [(promotion_type.code, promotion_type.name) for promotion_type in promotion_types]

    name = fields.Char(string='Name', required=True,
                       states={'active': [('readonly', True)]})
    description = fields.Text(string='Description', states={'active': [('readonly', True)]})
    type = fields.Selection(get_type_selection, 'Type', required=True, states={'active': [('readonly', True)]})
    sequence = fields.Integer(string='Sequence', required=True, states={'active': [('readonly', True)]})
    # status = fields.Selection([('draft', 'Draft'), ('active', 'Active'), ('cancel', 'Cancel')], string='Status', default='draft')
    state = fields.Selection([('draft', 'Draft'), ('active', 'Active'), ('cancel', 'Cancel')], default='draft', states={'active': [('readonly', True)]})
    start_date = fields.Date(string='Start Date', states={'active': [('readonly', True)]})
    end_date = fields.Date(string='End Date', states={'active': [('readonly', True)]})
    day_apply = fields.Many2many('pos.promotion.day', states={'active': [('readonly', True)]})

    @api.multi
    def action_draft(self):
        self.state = 'draft'

    @api.multi
    def action_active(self):
        self.state = 'active'

    @api.multi
    def action_cancel(self):
        self.state = 'cancel'
