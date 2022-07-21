<template>
  <div>
    <el-card shadow="never">
      <!-- 搜索 -->
      <div class="search">
        <div class="left">
          <el-button size="small" type="primary" @click="sukModelShow = true"
            >新增</el-button
          >
          <el-button size="small" type="danger">批量删除</el-button>
        </div>
        <el-tooltip content="刷新数据" placement="top">
          <el-button icon="refresh" text></el-button>
        </el-tooltip>
      </div>
      <!-- 表格数据 -->
      <ATable :clos="clos" :data="sukList" :stripe="true">
        <template v-slot:status="{ row }">
          <el-switch
            v-model="row.switchStatus"
            style="margin: 0 10px"
            @change="(status) => handleChangeSkuStatus(status, row)"
          ></el-switch>
        </template>
        <template #action="{ row }">
          <el-button link type="primary" @click="handleEditSuk(row)"
            >修改</el-button
          >
          <el-popconfirm
            title="是否要删除该规格?"
            @confirm="handleDeleteSuk(row.id)"
          >
            <template #reference>
              <el-button link type="primary">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </ATable>
      <Paging :total="total" @currentChange="currentChange"></Paging>
    </el-card>
  </div>
  <!-- 添加修改的抽屉 -->
  <el-drawer v-model="sukModelShow" size="40%">
    <template #header>
      <span>{{ drawerTitle }}</span>
    </template>
    <el-form
      ref="skuListFormRef"
      :model="skuListModel"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item label="规格名称" prop="name">
        <el-input
          v-model.trim="skuListModel.name"
          placeholder="请输入规格名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="排序">
        <el-input-number
          v-model="skuListModel.order"
          :max="1000"
          :min="0"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="状态">
        <el-switch
          v-model="skuListModel.status"
          :active-value="1"
          :inactive-value="0"
        ></el-switch>
      </el-form-item>
      <el-form-item label="规格" prop="default">
        <el-tag
          v-for="(tag, i) in skuListModel.default"
          :key="i"
          :disable-transitions="false"
          closable
          style="margin-right: 5px"
          @close="handleClose(i)"
        >
          {{ tag }}
        </el-tag>
        <el-input
          v-if="inputVisible"
          ref="InputRef"
          v-model.trim="inputValue"
          size="small"
          style="width: 100px"
          @blur="handleInputConfirm"
          @keyup.enter="handleInputConfirm"
        />
        <el-button
          v-else
          class="button-new-tag ml-1"
          size="small"
          @click="showInput"
        >
          + 添加值
        </el-button>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="footer">
        <el-button type="primary" @click="handleSubmit">提交</el-button>
        <el-button @click="handleResetForm">取消</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup>
import ATable from '@/components/Table/a-table'
import Paging from '@/components/Paging'
import {
  getSkuListAPI,
  updateSkuStatusAPI,
  addSkusAPI,
  deleteSkusAPI
} from '@/api/skus'
import { reactive, ref, nextTick, computed } from 'vue'
import clos from './clos'
import { Notification } from '@/utils/Notification'
import rules from './rules'
const inputValue = ref('')
const InputRef = ref(null)
const inputVisible = ref(false)
// 表单数据模型
const skuListModel = reactive({
  default: [],
  name: '',
  order: 50,
  status: 1
})
// 抽屉标题
const drawerTitle = computed(() => {
  return skuListModel.id ? '修改' : '新增'
})
// 表单ref
const skuListFormRef = ref(null)
// 添加--修改的抽屉的v-model
const sukModelShow = ref(false)
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
// 添加--修改
const handleSubmit = async () => {
  try {
    const options = { ...skuListModel }
    options.default = options.default.join(',')
    await skuListFormRef.value.validate()
    await addSkusAPI(options)
    await getSukList()
    Notification(skuListModel.id ? '修改成功' : '新增成功', '', 'success')
    handleResetForm()
  } catch (e) {}
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
// 表单规格数据
const showInput = () => {
  inputVisible.value = true
  nextTick(() => {
    InputRef.value?.input?.focus()
  })
}
const handleInputConfirm = () => {
  if (inputValue.value) {
    skuListModel.default.push(inputValue.value)
  }
  inputVisible.value = false
  inputValue.value = ''
}
const handleClose = (i) => {
  skuListModel.default.splice(i, 1)
}
// 关闭抽屉，重置表单
const handleResetForm = () => {
  skuListFormRef.value.resetFields()
  sukModelShow.value = false
}
// 修改
const handleEditSuk = (row) => {
  const options = { ...row }
  options.default = options.default.split(',')
  for (const key in options) {
    skuListModel[key] = options[key]
  }
  sukModelShow.value = true
}
// 删除
const handleDeleteSuk = async (id) => {
  try {
    const options = {
      ids: [id]
    }
    await deleteSkusAPI(options)
    await getSukList()
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
  & > .el-button {
    font-size: 20px;
  }
}
.footer {
  display: flex;
  justify-content: flex-start;
}
</style>
