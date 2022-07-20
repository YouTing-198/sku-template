<template>
  <div>
    <el-card shadow="never">
      <div class="search">
        <div class="left">
          <el-button size="small" type="primary">新增</el-button>
          <el-button size="small" type="danger">批量删除</el-button>
        </div>
        <el-tooltip content="刷新数据" placement="top">
          <el-button icon="refresh" text></el-button>
        </el-tooltip>
      </div>
      <ATable :clos="clos" :data="sukList" :stripe="true">
        <template v-slot:status="{ row }">
          <el-switch
            v-model="row.switchStatus"
            style="margin: 0 10px"
            @change="(status) => handleChangeSkuStatus(status, row)"
          ></el-switch>
        </template>
        <template #action>
          <el-button link type="primary" @click="handleEditSuk(row)"
            >修改</el-button
          >
          <el-button link type="primary" @click="handleDeleteSuk(row.id)"
            >删除</el-button
          >
        </template>
      </ATable>
      <Paging :total="total" @currentChange="currentChange"></Paging>
    </el-card>
  </div>
</template>

<script setup>
import ATable from '@/components/Table/a-table'
import Paging from '@/components/Paging'
import { getSkuListAPI, updateSkuStatusAPI } from '@/api/skus'
import { ref } from 'vue'
import clos from './clos'
import { Notification } from '@/utils/Notification'
// 条
const total = ref(0)
// 页
const current = ref(1)
// 规格列表
const sukList = ref([])
// 获取规格列表
const getSukList = async () => {
  try {
    const { list, totalCount } = await getSkuListAPI(current.value)
    sukList.value = list
    // 对el-switch的v-model绑定做容错处理
    sukList.value.forEach((item) => {
      if (item.status === 1) {
        item.switchStatus = true
      } else {
        item.switchStatus = false
      }
    })
    total.value = totalCount
  } catch (e) {
    console.log(e)
  }
}
getSukList()
// 分页
const currentChange = (page) => {
  current.value = page
  getSukList()
}
// 修改状态
const handleChangeSkuStatus = async (value, row) => {
  try {
    const status = { status: value ? 1 : 0 }
    await updateSkuStatusAPI(row.id, status)
    await getSukList()
    Notification('修改状态成功', '', 'success')
  } catch (e) {
    console.log(e)
  }
}
</script>

<style lang="scss" scoped>
.search {
  display: flex;
  justify-content: space-between;
  & > .el-button {
    font-size: 20px;
  }
}
</style>
