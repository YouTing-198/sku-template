<template>
  <el-card shadow="never">
    <div class="search">
      <el-button size="small" type="primary">新增</el-button>
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
            ></el-switch>
            <el-button link type="primary">修改</el-button>
            <el-button link type="primary">删除</el-button>
          </span>
        </span>
      </template>
    </el-tree>
  </el-card>
  <!-- 抽屉 -->
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
</template>

<script setup>
import { getCategoryListAPI, appCategortItemAPI } from '@/api/category'
import { ref } from 'vue'
import ATable from '@/components/Table/a-table'
import column from './column'
// 抽屉显示隐藏
const drawerShow = ref(false)
// tree配置项
const treeProps = {
  label: 'name'
}
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
