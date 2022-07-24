export default {
  name: [
    {
      required: true,
      message: '请输入用户等级名称',
      trigger: 'blur'
    },
    {
      min: 1,
      max: 20,
      message: '用户等级名称必须是中文',
      trigger: 'blur',
      pattern: /^[\u4e00-\u9fa5]+$/
    }
  ]
}
