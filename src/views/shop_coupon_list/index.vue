<template>
  <div>
    <el-card shadow="never">
      <div class="search">
        <el-button size="small" type="primary">新增</el-button>
        <el-tooltip content="刷新数据" placement="top">
          <el-button icon="refresh" text></el-button>
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
            >修改
          </el-button>
          <el-popconfirm
            v-if="couponStatus(row.start_time, row.end_time) !== '1'"
          >
            <template #reference>
              <el-button text type="primary">删除</el-button>
            </template>
          </el-popconfirm>
          <el-button
            v-if="couponStatus(row.start_time, row.end_time) === '1'"
            type="danger"
            >失效</el-button
          >
        </template>
      </ATable>
      <Paging :total="total"></Paging>
    </el-card>
  </div>
</template>

<script setup>
import { couponListAPI } from '@/api/coupon'
import { ref } from 'vue'
import ATable from '@/components/Table/a-table'
import Paging from '@/components/Paging'
import clos from './clos'
import { couponStatus } from './couponStatus'
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
</style>
