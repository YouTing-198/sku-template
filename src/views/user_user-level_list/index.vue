<template>
  <div>
    <el-card>
      <!--    搜索-->
      <div class="search">
        <el-button size="small" type="primary">新增</el-button>
        <el-tooltip content="刷新数据" placement="top">
          <el-button icon="Refresh" text @click="getLevelList"></el-button>
        </el-tooltip>
      </div>
      <!--    表格-->
      <ATable :clos="tableColumn" :data="levelList" stripe>
        <template #status="{ row }">
          <el-switch
            v-model="row.switchStatus"
            @change="(status) => handleChangeStatus(status, row.id)"
          ></el-switch>
        </template>
        <template #action>
          <el-button link type="primary">修改</el-button>
          <el-button link type="primary">删除</el-button>
        </template>
      </ATable>
      <!--    分页-->
      <Paging :total="total" @currentChange="currentChange"></Paging>
    </el-card>
  </div>
</template>

<script setup>
import { getLevelListAPI, editStatusAPI } from '@/api/userLevel'
import { ref } from 'vue'
import ATable from '@/components/Table/a-table'
import tableColumn from './tableColumn'
import Paging from '@/components/Paging'
import { Notification } from '@/utils/Notification'
// 页码
const current = ref(1)
// 等级列表
const levelList = ref([])
// 条数
const total = ref(0)
// 获取等级列表
const getLevelList = async () => {
  try {
    const { list, totalCount } = await getLevelListAPI(current.value)
    levelList.value = list
    levelList.value.forEach((item) => {
      item.switchStatus = item.status === 1
    })
    total.value = totalCount
  } catch (e) {
    console.log(e)
  }
}
getLevelList()
// 修改状态
const handleChangeStatus = async (switchStatus, id) => {
  try {
    const status = switchStatus ? 1 : 0
    await editStatusAPI(id, { status })
    await getLevelList()
    Notification('修改状态成功', '', 'success')
  } catch (e) {
    console.log(e)
  }
}
// 分页
const currentChange = async (currentPage) => {
  try {
    current.value = currentPage
    await getLevelList()
  } catch (e) {
    console.log(e)
  }
}
</script>

<style lang="scss" scoped>
.search {
  display: flex;
  justify-content: space-between;
  .el-form {
    flex: 1;
    margin-left: 40px;
    ::v-deep(.el-form-item) {
      .el-input,
      .el-select {
        font-size: 10px;
        height: 24px !important;
      }
      &:nth-of-type(1) {
        width: 400px;
      }
    }
  }
}
</style>
