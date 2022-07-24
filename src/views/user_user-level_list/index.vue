<template>
  <div>
    <el-card>
      <!--    搜索-->
      <div class="search">
        <el-button
          size="small"
          type="primary"
          @click="levelDrawerVisible = true"
          >新增</el-button
        >
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
        <template #action="{ row }">
          <el-button link type="primary" @click="handleEdit(row)"
            >修改</el-button
          >
          <el-popconfirm title="是否删除该条记录?" @confirm="handleDel(row)">
            <template #reference>
              <el-button link type="primary">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </ATable>
      <!--    分页-->
      <Paging :total="total" @currentChange="currentChange"></Paging>
      <!--    添加-修改抽屉-->
      <el-drawer v-model="levelDrawerVisible" size="40%">
        <template #header>
          <span>{{ drawerTitle }}</span>
        </template>
        <el-form
          ref="levelFormRef"
          :model="levelModel"
          :rules="rules"
          label-width="80px"
        >
          <el-form-item label="等级名称" prop="name">
            <el-input v-model.trim="levelModel.name"></el-input>
          </el-form-item>
          <el-form-item label="等级权重">
            <el-input
              v-model.number="levelModel.level"
              type="number"
            ></el-input>
          </el-form-item>
          <el-form-item label="是否启用">
            <el-switch
              v-model="levelModel.status"
              :active-value="1"
              :inactive-value="0"
            ></el-switch>
          </el-form-item>
          <el-form-item class="upgrade-container" label="升级条件">
            <div class="left">
              <div>
                <small>累计消费满</small>
                <el-input v-model.number="levelModel.max_price" type="number">
                  <template #append> 元 </template>
                </el-input>
              </div>
              <small>设置会员等级所需要的累计消费必须大于等于0,单位：元</small>
            </div>
            <div class="right">
              <div>
                <small>累计次数满</small>
                <el-input v-model.number="levelModel.min_times" type="number">
                  <template #append> 笔 </template>
                </el-input>
              </div>
              <small>设置会员等级所需要的购买量必须大于等于0,单位：笔</small>
            </div>
          </el-form-item>
          <el-form-item label="折扣率(%)">
            <el-input
              v-model.number="levelModel.discount"
              style="width: 500px"
              type="number"
            >
              <template #append>%</template>
            </el-input>
            <small class="discount-small"
              >折扣率单位为百分比，如输入90，表示该会员等级的用户可以以商品原价的90%购买</small
            >
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="footer">
            <el-button type="primary" @click="handleSubmit">提交</el-button>
            <el-button type="default" @click="handleResetForm">取消</el-button>
          </div>
        </template>
      </el-drawer>
    </el-card>
  </div>
</template>

<script setup>
import {
  getLevelListAPI,
  editStatusAPI,
  userLevelAPI,
  deleteLevelAPI
} from '@/api/userLevel'
import { computed, reactive, ref } from 'vue'
import ATable from '@/components/Table/a-table'
import tableColumn from './tableColumn'
import Paging from '@/components/Paging'
import { Notification } from '@/utils/Notification'
import rules from './formRules'
// 抽屉标题
const drawerTitle = computed(() => {
  return levelModel.id ? '修改' : '新增'
})
// 表单ref
const levelFormRef = ref(null)
// 添加-修改数据模型
const levelModel = reactive({
  name: '',
  level: '',
  status: 1,
  max_price: '',
  min_times: '',
  discount: ''
})
// 添加-修改抽屉
const levelDrawerVisible = ref(false)
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
// 提交数据
const handleSubmit = async () => {
  try {
    await levelFormRef.value.validate()
    await userLevelAPI(levelModel)
    await getLevelList()
    Notification(levelModel.id ? '修改成功' : '添加成功', '', 'success')
    handleResetForm()
  } catch (e) {
    console.log(e)
  }
}
// 重置表单 关闭抽屉
const handleResetForm = async () => {
  await levelFormRef.value.resetFields()
  levelDrawerVisible.value = false
  for (const key in levelModel) {
    if (key === 'status') {
      levelModel[key] = 1
    } else {
      levelModel[key] = ''
    }
  }
}
// 修改--回填数据
const handleEdit = (row) => {
  for (const rowKey in row) {
    levelModel[rowKey] = row[rowKey]
  }
  levelDrawerVisible.value = true
}
// 删除会员等级
const handleDel = async (row) => {
  try {
    await deleteLevelAPI(row.id)
    await getLevelList()
    Notification('删除成功', '', 'success')
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
