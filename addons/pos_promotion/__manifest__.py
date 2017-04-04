# -*- coding: utf-8 -*-
{
    'name': "Pos Promotion",

    'summary': """Pos Promotion""",

    'description': """
        - POS
    """,

    'author': "Magestore",
    'website': "http://magestore.com",

    # Categories can be used to filter modules in modules listing
    # for the full list
    'category': 'Point Of Sale',
    'version': '0.1',

    # any module necessary for this one to work correctly
    'depends': ['point_of_sale'],

    # always loaded
    'data': [
        # 'security/ir.model.access.csv',
        'data/pos_promotion_type_default_data.xml',
        'data/pos_promotion_day_default_data.xml',
        'views/pos_promotion_views.xml',
        'views/pos_promotion_type_views.xml',
        'views/pos_promotion_program_views.xml',
        'views/pos_promotion_program_discount_views.xml',
        'views/pos_promotion_program_workflow.xml',
        'views/pos_promotion_program_bxpy_views.xml',
        'views/pos_promotion_program_bxgy_views.xml',
        'views/pos_promotion_program_special_price_views.xml',
        'views/pos_promotion_program_discount_on_cat_views.xml',
        'views/pos_promotion_program_give_product.xml',
        'views/pos_promotion_program_discount_on_total_views.xml',
        'views/pos_promotion_assets_template.xml',
    ],
    'qweb': [
        'static/src/xml/pos_promotion_templates.xml',
        'static/src/xml/pos_templates.xml',
    ],
    # only loaded in demonstration mode
    'installable': True,
    'application': True
}