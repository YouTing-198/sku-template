export default {
  title: [
    {
      required: true,
      message: '请输入商品名称',
      trigger: 'blur'
    }
  ],
  category_id: [
    {
      required: true,
      message: '请选择商品分类',
      trigger: 'change'
    }
  ],
  min_price: [
    {
      required: true,
      message: '请输入最低销售价',
      trigger: 'blur'
    }
  ],
  min_oprice: [
    {
      required: true,
      message: '请输入最低原价格',
      trigger: 'blur'
    }
  ],
  stock_display: [
    {
      required: true,
      message: '请选择库存是否显示',
      trigger: 'change'
    }
  ],
  status: [
    {
      required: true,
      message: '请选择商品是否上架',
      trigger: 'change'
    }
  ],
  stock: [
    {
      required: true,
      message: '请输入库存数量',
      trigger: 'blur'
    }
  ],
  min_stock: [
    {
      required: true,
      message: '请输入最低库存数量',
      trigger: 'blur'
    }
  ],
  unit: [
    {
      required: true,
      message: '请输入商品单位',
      trigger: 'blur'
    }
  ]
}
