export default [
  {
    type: 'selection'
  },
  {
    label: '商品',
    slot: 'content',
    width: 300
  },
  {
    label: '实际销量',
    prop: 'sale_count'
  },
  {
    label: '商品状态',
    slot: 'status'
  },
  {
    label: '审核状态',
    slot: 'audit'
  },
  {
    label: '总库存',
    prop: 'stock'
  },
  {
    label: '操作',
    slot: 'action',
    width: 400,
    align: 'center'
  }
]
