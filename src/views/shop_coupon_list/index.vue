<template>
  <div>
    <el-card shadow="never">
      <div class="search">
        <el-button size="small" type="primary" @click="drawerVisable = true"
          >新增</el-button
        >
        <el-tooltip content="刷新数据" placement="top">
          <el-button icon="refresh" text @click="getCouponList"></el-button>
        </el-tooltip>
      </div>
      <!--      表格-->
      <ATable :clos="clos" :data="couponList">
        <!--        优惠券名称-->
        <template #coupon_name="{ row }">
          <div
            :class="{
              border: couponStatus(row.start_time, row.end_time) === '1'
            }"
            class="coupon_name"
          >
            <span>{{ row.name }}</span>
            <span>{{ row.start_time }} ~ {{ row.end_time }}</span>
          </div>
        </template>
        <!--        状态-->
        <template #status="{ row }">
          <span v-if="couponStatus(row.start_time, row.end_time) === '0'"
            >未开始</span
          >
          <span v-if="couponStatus(row.start_time, row.end_time) === '2'"
            >已结束</span
          >
          <span v-if="couponStatus(row.start_time, row.end_time) === '1'"
            >领取中</span
          >
        </template>
        <!--        优惠-->
        <template #discount="{ row }">
          {{ row.type === 0 ? `折扣 ${row.value}折` : `满减 ￥${row.value}` }}
        </template>
        <!--        操作-->
        <template #action="{ row }">
          <el-button
            v-if="couponStatus(row.start_time, row.end_time) === '0'"
            size="small"
            text
            type="primary"
            @click="handleEdit(row)"
            >修改
          </el-button>
          <el-popconfirm
            v-if="couponStatus(row.start_time, row.end_time) !== '1'"
            title="确定要删除该优惠券吗?"
            @confirm="handleDelete(row.id)"
          >
            <template #reference>
              <el-button text type="primary">删除</el-button>
            </template>
          </el-popconfirm>
          <el-button
            v-if="couponStatus(row.start_time, row.end_time) === '1'"
            type="danger"
            @click="handleFailure(row.id)"
            >失效
          </el-button>
        </template>
      </ATable>
      <Paging :total="total" @currentChange="currentChange"></Paging>
    </el-card>
  </div>
  <!--  添加--修改-抽屉-->
  <el-drawer v-model="drawerVisable" size="40%">
    <template #header>
      <span>{{ drawerTilte }}</span>
    </template>
    <el-form ref="couponModelRef" :model="couponModel" label-width="100px">
      <el-form-item label="优惠券名称">
        <el-input
          v-model="couponModel.name"
          placeholder="优惠券名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="类型">
        <el-radio-group v-model="couponModel.type">
          <el-radio :label="0">满减</el-radio>
          <el-radio :label="1">折扣</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="面值">
        <el-input v-model="couponModel.value" placeholder="面值" type="number">
          <template #append>
            <el-button type="info">元</el-button>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="发行量">
        <el-input-number
          v-model="couponModel.total"
          :max="1000"
          :min="0"
          placeholder="发行量"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="最低使用价格">
        <el-input
          v-model="couponModel.min_price"
          placeholder="最低使用价格"
          type="number"
        ></el-input>
      </el-form-item>
      <el-form-item label="排序">
        <el-input-number
          v-model="couponModel.order"
          :max="1000"
          :min="0"
          placeholder="排序"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="活动时间">
        <el-date-picker
          v-model="couponModel.time"
          end-placeholder="结束时间"
          range-separator="To"
          start-placeholder="开始时间"
          type="daterange"
        />
      </el-form-item>
      <el-form-item label="描述">
        <el-input
          v-model.trim="couponModel.desc"
          placeholder="描述"
          style="height: 70px"
          type="textarea"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="footer">
        <el-button size="small" type="primary" @click="handleSubmit"
          >提交</el-button
        >
        <el-button size="small" @click="handleHideDrawer">取消</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup>
import {
  couponListAPI,
  couponAPI,
  deleteCouponAPI,
  failureCouponAPI
} from '@/api/coupon'
import { computed, reactive, ref } from 'vue'
import ATable from '@/components/Table/a-table'
import Paging from '@/components/Paging'
import clos from './clos'
import { couponStatus } from './couponStatus'
import { Notification } from '@/utils/Notification'
// 标题
const drawerTilte = computed(() => {
  return couponModel.id ? '修改' : '新增'
})
// 表单ref
const couponModelRef = ref(null)
// 抽屉组件显示隐藏
const drawerVisable = ref(false)
// 添加-修改数据模型
const couponModel = reactive({
  desc: '',
  name: '',
  start_time: '',
  end_time: '',
  total: 100,
  value: '',
  min_price: '',
  type: 0,
  order: 50,
  time: []
})
// 条数
const total = ref(0)
// 页
const current = ref(1)
// 优惠券LIST
const couponList = ref([])
// 获取优惠券LIST
const getCouponList = async () => {
  try {
    const res = await couponListAPI(current.value)
    couponList.value = res.list
    total.value = res.totalCount
  } catch (e) {
    console.log(e)
  }
}
getCouponList()
// 添加--修改
const handleSubmit = async () => {
  try {
    couponModel.start_time = couponModel.time[0].getTime()
    couponModel.end_time = couponModel.time[1].getTime()
    await couponAPI(couponModel)
    await getCouponList()
    handleHideDrawer()
    Notification(couponModel.id ? '修改成功' : '新增成功', '', 'success')
  } catch (e) {
    console.log(e)
  }
}
// 关闭抽屉 重置表单
const handleHideDrawer = () => {
  drawerVisable.value = false
  couponModelRef.value.resetFields()
}
// 分页
const currentChange = async (page) => {
  try {
    current.value = page
    await getCouponList()
  } catch (e) {
    console.log(e)
  }
}
// 修改 回填数据
const handleEdit = (row) => {
  for (const rowKey in row) {
    couponModel[rowKey] = row[rowKey]
  }
  couponModel.time = [
    new Date(couponModel.start_time),
    new Date(couponModel.end_time)
  ]
  drawerVisable.value = true
}
// 删除
const handleDelete = async (id) => {
  try {
    await deleteCouponAPI(id)
    await getCouponList()
    Notification('删除成功', '', 'success')
  } catch (e) {
    console.log(e)
  }
}
// 失效
const handleFailure = async (id) => {
  try {
    await failureCouponAPI(id, { status: 0 })
    await getCouponList()
    Notification('失效成功', '', 'success')
  } catch (e) {
    console.log(e)
  }
}
</script>

<style lang="scss" scoped>
.search {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.coupon_name {
  border: 1px dashed #e5e7eb;
  background: #f9fafb;
  padding: 10px 15px;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  color: #9ca3af;
  max-width: 350px;
  span {
    &:nth-of-type(1) {
      font-weight: bold;
      margin-bottom: 5px;
    }
    &:nth-of-type(2) {
      font-size: 10px;
    }
  }
}
.border {
  border-color: #fecdd3;
  background: #fff1f2;
  color: #f87171;
}
.footer {
  display: flex;
  justify-content: flex-start;
}
</style>
