/**
 *lichen - 2017-11-14
 *首页导航配置
 */
export const NAV_CONFIG = {
  nav_head:[
    {
      iqon: 'iqon-comment-o',
      title: '洽谈',
      slideState: 'out',
      list: [
        {
          isOpen: 'close',
          title: '投标',
          url: ''
        },
        {
          isOpen: 'close',
          title: '授权',
          notComplete: true,
          url: ''
        },
        {
          isOpen: 'close',
          title: '报价',
          url: ''
        },
        {
          isOpen: 'close',
          title: '资质',
          url: ''
        },
        {
          isOpen: 'close',
          title: '其他',
          url: ''
        }
      ]
    },
    {
      iqon: 'iqon-pencil',
      title: '签约',
      slideState: 'out',
      list: [
        {
          isOpen: 'close',
          title: '合同',
          children: [
            {name: '销售合同', notComplete: true},
            {name: '采购合同', url: ''},
            {name: '其他合同', url: ''}
          ]
        },
        {
          isOpen: 'close',
          title: '客户商务信息',
          url: ''
        }
      ]
    },
    {
      iqon: 'iqon-apply',
      title: '开单',
      slideState: 'out',
      list: [
        {
          isOpen: 'close',
          title: '销售单',
          url: ''
        },
        {
          isOpen: 'close',
          title: '票据',
          children: [
            {name: '支票', url: ''},
            {name: '商票', url: ''},
            {name: '银票', url: ''}
          ]
        }
      ]
    },
    {
      iqon: 'iqon-salary-o',
      title: '交付',
      slideState: 'out',
      list: [
        {
          isOpen: 'close',
          title: '物流配送跟踪',
          url: ''
        },
        {
          isOpen: 'close',
          title: '货物暂存',
          url: ''
        },
        {
          isOpen: 'close',
          title: '借用',
          url: ''
        },
        {
          isOpen: 'close',
          title: '冲红',
          url: ''
        },
        {
          isOpen: 'close',
          title: '退换货',
          url: ''
        }
      ]
    },{
      iqon: 'iqon-finance',
      title: '回款',
      slideState: 'out',
      list: [
        {
          isOpen: 'close',
          title: '回款核销',
          url: ''
        },
        {
          isOpen: 'close',
          title: '欠款查询',
          url: ''
        },
        {
          isOpen: 'close',
          title: '对账单',
          url: ''
        }
      ]
    }
  ]
}