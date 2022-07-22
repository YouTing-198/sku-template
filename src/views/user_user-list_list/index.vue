<template>
  <el-card>
    <!-- 搜索栏 -->
    <div class="search">
      <el-form inline="inline">
        <el-form-item label="关键词">
          <el-input placeholder="手机号/邮箱/会员昵称"></el-input>
        </el-form-item>
        <el-form-item label="会员等级">
          <el-select placeholder="请选择会员等级"></el-select>
        </el-form-item>
      </el-form>
      <div class="query-btn">
        <el-button size="small" type="primary">搜索</el-button>
        <el-button size="small">重置</el-button>
        <el-button size="small" text type="primary">
          展开
          <el-icon>
            <ArrowDownBold />
          </el-icon>
        </el-button>
      </div>
    </div>
    <!-- 新增+刷新 -->
    <div class="refresh">
      <el-button size="small" type="primary">新增</el-button>
      <el-tooltip content="刷新数据" placement="top">
        <el-button icon="Refresh" text></el-button>
      </el-tooltip>
    </div>
    <!-- 表格 -->
    <ATable :clos="column" :data="userList" :stripe="true">
      <template #nickname="{ row }">
        <div class="avatar-container">
          <el-avatar :src="row.avatar"></el-avatar>
          <div class="content">
            <span>{{ row.username }}</span>
            <span>ID：{{ row.id }}</span>
          </div>
        </div>
      </template>
      <template #level="{ row: { user_level } }">
        {{ user_level?.name }}
      </template>
      <template #status="{ row }">
        <el-switch v-model="row.switchStatus"></el-switch>
      </template>
      <template #action>
        <el-button link type="primary">修改</el-button>
        <el-button link type="primary">删除</el-button>
      </template>
    </ATable>
    <Paging :total="total"></Paging>
  </el-card>
</template>

<script setup>
import { ref } from 'vue'
import { userListAPI } from '@/api/userList'
import ATable from '@/components/Table/a-table'
import column from './tableColumn'
import Paging from '@/components/Paging'
// 条数
const total = ref(0)
// 页码
const current = ref(1)
// 会员等级
const userLevel = ref([])
// 用户列表
const userList = ref([])
// 获取用户列表
const getUserList = async () => {
  try {
    const res = await userListAPI(current.value)
    userLevel.value = res.user_level
    userList.value = res.list
    userList.value.forEach((item) => {
      if (item.status === 1) {
        item.switchStatus = true
      } else {
        item.switchStatus = false
      }
    })
    total.value = res.totalCount
  } catch (e) {
    console.log(e)
  }
}
getUserList()
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
.refresh {
  display: flex;
  justify-content: space-between;
}
.avatar-container {
  display: flex;
  .content {
    margin-left: 10px;
    display: flex;
    font-size: 10px;
    flex-direction: column;
    span {
      &:nth-of-type(1) {
        font-weight: bold;
        font-size: 15px;
      }
    }
  }
}
</style>
