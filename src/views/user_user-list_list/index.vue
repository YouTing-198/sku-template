<template>
  <el-card>
    <!-- 搜索栏 -->
    <div class="search">
      <el-form ref="queryFormRef" :model="queryModel" inline="inline">
        <el-form-item label="关键词">
          <el-input
            v-model.trim="queryModel.keyword"
            clearable
            placeholder="手机号/邮箱/会员昵称"
          ></el-input>
        </el-form-item>
        <el-form-item v-if="userLevelShow" label="会员等级">
          <el-select
            v-model="queryModel.user_level_id"
            :props="{ label: 'name', value: 'id' }"
            placeholder="请选择会员等级"
          >
            <el-option
              v-for="item in userLevel"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="query-btn">
        <el-button size="small" type="primary" @click="getUserList"
          >搜索</el-button
        >
        <el-button size="small" @click="handleReset">重置</el-button>
        <el-button
          size="small"
          text
          type="primary"
          @click="userLevelShow = !userLevelShow"
        >
          {{ userLevelShow ? '收起' : '展开' }}
          <el-icon>
            <ArrowDownBold v-if="!userLevelShow" />
            <ArrowUpBold v-else />
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
    <Paging :total="total" @currentChange="currentChange"></Paging>
  </el-card>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { userListAPI } from '@/api/userList'
import ATable from '@/components/Table/a-table'
import column from './tableColumn'
import Paging from '@/components/Paging'
// 查询模型
const queryModel = reactive({
  current: 1,
  keyword: '',
  user_level_id: ''
})
// 查询表单ref
const queryFormRef = ref(null)
// 会员等级下拉框是否显示
const userLevelShow = ref(false)
// 条数
const total = ref(0)
// 会员等级
const userLevel = ref([])
// 用户列表
const userList = ref([])
// 获取用户列表
const getUserList = async () => {
  try {
    const res = await userListAPI(queryModel)
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
// 重置表单
const handleReset = async () => {
  try {
    await queryFormRef.value.resetFields()
    queryModel.keyword = ''
    queryModel.user_level_id = ''
    getUserList()
  } catch (e) {
    console.log(e)
  }
}
// 分页切换
const currentChange = (value) => {
  queryModel.current = value
  getUserList()
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
