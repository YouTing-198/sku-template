<template>
  <el-card shadow="never">
    <div class="search">
      <el-button size="small" type="primary" @click="addDrawerShow = true"
        >新增</el-button
      >
      <el-tooltip content="刷新数据" placement="top">
        <el-button icon="Refresh" text @click="getCategoryList"></el-button>
      </el-tooltip>
    </div>
    <!-- 树形结构 -->
    <el-tree :data="categoryList" :props="treeProps">
      <template #default="{ node, data }">
        <span class="custom-tree-node">
          <span>{{ node.label }}</span>
          <span>
            <el-button
              :loading="data.loading"
              link
              type="primary"
              @click="recommendGoods(data)"
              >推荐商品</el-button
            >
            <el-switch
              v-model="data.status"
              :active-value="1"
              :inactive-value="0"
              style="margin: 0 10px"
              @change="(status) => handleChangeStatus(status, data)"
            ></el-switch>
            <el-button link type="primary" @click="handleEditCatrgory(data)"
              >修改</el-button
            >
            <el-popconfirm
              title="是否要删除该记录?"
              @confirm="handleDeleteCategory(data.id)"
            >
              <template #reference>
                <el-button link type="primary">删除</el-button>
              </template>
            </el-popconfirm>
          </span>
        </span>
      </template>
    </el-tree>
  </el-card>
  <!-- 推荐抽屉 -->
  <el-drawer v-model="drawerShow" size="40%">
    <template #header>
      <span>推荐商品</span>
    </template>
    <ATable :clos="column" :data="recommendGoodsList" border>
      <template v-slot:cover="{ row: { cover } }">
        <el-image :src="cover" style="width: 60px; height: 60px">
          <template #error>
            <el-icon>
              <Picture />
            </el-icon>
          </template>
        </el-image>
      </template>
      <template v-slot:action>
        <el-button link type="primary">删除</el-button>
      </template>
    </ATable>
    <template #footer>
      <div class="footer">
        <el-button type="primary">关联</el-button>
        <el-button @click="drawerShow = false">取消</el-button>
      </div>
    </template>
  </el-drawer>
  <!-- 新增添加的抽屉 -->
  <el-drawer v-model="addDrawerShow" size="40%">
    <template #header>
      <span>{{ drawerTitle }}</span>
    </template>
    <el-form
      ref="categoryFormRef"
      :model="categoryModel"
      :rules="rules"
      label-width="80px"
    >
      <el-form-item label="分类名称" prop="name">
        <el-input
          v-model="categoryModel.name"
          placeholder="分类名称"
        ></el-input>
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
import {
  getCategoryListAPI,
  appCategortItemAPI,
  addCategoryAPI,
  editCategoryAPI,
  updateStatusAPI,
  deleteCategoryAPI
} from '@/api/category'
import { computed, reactive, ref } from 'vue'
import ATable from '@/components/Table/a-table'
import column from './column'
import { Notification } from '@/utils/Notification'
// 新增或添加抽屉显示隐藏
const addDrawerShow = ref(false)
// 抽屉显示隐藏
const drawerShow = ref(false)
// 表单ref
const categoryFormRef = ref(null)
// 添加--修改表单模型
const categoryModel = reactive({
  name: ''
})
// 表单验证
const rules = {
  name: [
    {
      required: true,
      message: '请输入分类名称',
      trigger: 'blur'
    }
  ]
}
// tree配置项
const treeProps = {
  label: 'name'
}
// 标题
const drawerTitle = computed(() => {
  return categoryModel.id ? '修改' : '新增'
})
// 推荐商品列表
const recommendGoodsList = ref([])
// 分类列表
const categoryList = ref([])
// 获取分类列表
const getCategoryList = async () => {
  try {
    categoryList.value = await getCategoryListAPI()
    categoryList.value.forEach((item) => {
      item.loading = false
    })
  } catch (e) {
    console.log(e)
  }
}
getCategoryList()
// 推荐商品
const recommendGoods = async (data) => {
  data.loading = true
  try {
    const options = {
      category_id: data.id
    }
    recommendGoodsList.value = await appCategortItemAPI(options)
    drawerShow.value = true
  } catch (e) {
    console.log(e)
  }
  data.loading = false
}
// 添加数据--修改数据
const handleSubmit = async () => {
  try {
    await categoryFormRef.value.validate()
    await (categoryModel.id ? editCategoryAPI : addCategoryAPI)(categoryModel)
    addDrawerShow.value = false
    await getCategoryList()
    Notification(categoryModel.id ? '修改成功' : '添加成功', '', 'success')
  } catch (e) {
    console.log(e)
  }
}
// 关闭抽屉，重置表单
const handleResetForm = () => {
  categoryFormRef.value.resetFields()
  addDrawerShow.value = false
}
// 修改
const handleEditCatrgory = (data) => {
  for (const key in data) {
    categoryModel[key] = data[key]
  }
  addDrawerShow.value = true
}
// 修改状态
const handleChangeStatus = async (status, data) => {
  try {
    await updateStatusAPI(data.id, { status })
    await getCategoryList()
    Notification('修改状态成功', '', 'success')
  } catch (e) {
    console.log(e)
  }
}
// 删除
const handleDeleteCategory = async (id) => {
  try {
    await deleteCategoryAPI(id)
    await getCategoryList()
    Notification('删除成功', '', 'success')
  } catch (e) {
    console.log(e)
  }
}
</script>

<style scoped>
.search {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

::v-deep(.el-tree-node__content) {
  height: 40px;
}

.footer {
  display: flex;
  justify-content: flex-start;
}
</style>
