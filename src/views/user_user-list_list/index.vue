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
      <el-button size="small" type="primary" @click="drawerVisable = true"
        >新增</el-button
      >
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
      <template #action="{ row }">
        <el-button link type="primary" @click="handleEdit(row)">修改</el-button>
        <el-button link type="primary">删除</el-button>
      </template>
    </ATable>
    <Paging :total="total" @currentChange="currentChange"></Paging>
    <!-- 添加和编辑抽屉 -->
    <el-drawer v-model="drawerVisable" size="40%">
      <template #header>
        <span>{{ drawerTitle }}</span>
      </template>
      <el-form
        ref="userListFormRef"
        :model="userListModel"
        :rules="formRules"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model.trim="userListModel.username"
            :maxlength="25"
            :min="4"
          ></el-input>
        </el-form-item>
        <el-form-item :prop="userListModel.id ? '' : 'password'" label="密码">
          <el-input
            v-model.trim="userListModel.password"
            show-password
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model.trim="userListModel.nickname"></el-input>
        </el-form-item>
        <el-form-item label="头像">
          <el-upload list-type="picture-card">
            <el-icon>
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="会员等级" porp="user_level_id">
          <el-select
            v-model="userListModel.user_level_id"
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
        <el-form-item label="手机" prop="phone">
          <el-input v-model.trim="userListModel.phone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model.trim="userListModel.email"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch
            v-model="userListModel.status"
            :active-value="1"
            :inactive-value="0"
          ></el-switch>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="footer">
          <el-button type="primary" @click="handleAddUser">提交</el-button>
          <el-button type="default" @click="handleResetUserForm"
            >取消</el-button
          >
        </div>
      </template>
    </el-drawer>
  </el-card>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { userListAPI, addUserListAPI } from '@/api/userList'
import { Notification } from '@/utils/Notification'
import ATable from '@/components/Table/a-table'
import column from './tableColumn'
import Paging from '@/components/Paging'
import formRules from './formRules'
// 抽屉标题
const drawerTitle = computed(() => {
  return userListModel.id ? '修改' : '新增'
})
// 添加-修改表单ref
const userListFormRef = ref(null)
// 添加-修改数据模型
const userListModel = reactive({
  avatar: '',
  email: '',
  nickname: '',
  password: '',
  phone: '',
  status: 1,
  user_level_id: '',
  username: ''
})
// 添加-编辑抽屉是否显示
const drawerVisable = ref(false)
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
// 添加
const handleAddUser = async () => {
  try {
    await userListFormRef.value.validate()
    await addUserListAPI(userListModel)
    await getUserList()
    handleResetUserForm()
    Notification(userListModel.id ? '修改成功' : '添加成功', '', 'success')
  } catch (e) {
    console.log(e)
  }
}
// 重置用户表单
const handleResetUserForm = async () => {
  await userListFormRef.value.resetFields()
  for (const key in userListModel) {
    if (key === 'status') {
      userListModel[key] = 1
    } else {
      userListModel[key] = ''
    }
  }
  drawerVisable.value = false
}
// 修改用户
const handleEdit = (row) => {
  for (const rowKey in row) {
    userListModel[rowKey] = row[rowKey]
  }
  drawerVisable.value = true
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
.footer {
  display: flex;
  justify-content: flex-start;
}
</style>
