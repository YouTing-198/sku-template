<template>
  <div>
    <!-- 标签页 -->
    <el-tabs v-model="queryModel.tab" @tab-click="handleChangeTab">
      <el-tab-pane
        v-for="item in tabsOptions"
        :key="item.id"
        :label="item.label"
        :name="item.name"
      >
      </el-tab-pane>
    </el-tabs>
    <!-- 表格 -->
    <el-card shadow="never">
      <!-- 搜索 -->
      <div class="search">
        <el-form :inline="true">
          <el-form-item :inline="true" label="关键词">
            <el-input
              v-model="queryModel.title"
              placeholder="商品名称"
            ></el-input>
          </el-form-item>
          <el-form-item v-if="show" label="商品分类">
            <el-select
              v-model="queryModel.category_id"
              placeholder="请选择商品分类"
            >
              <el-option
                v-for="item in catesList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div class="query-btn">
          <el-button size="small" type="primary" @click="search"
            >搜索</el-button
          >
          <el-button size="small" @click="reset">重置</el-button>
          <el-button size="small" text type="primary" @click="show = !show">
            {{ show ? '收起' : '展开' }}
            <el-icon>
              <ArrowDown v-if="!show" />
              <ArrowUp v-else />
            </el-icon>
          </el-button>
        </div>
      </div>
      <!-- 按钮组 -->
      <div class="btns">
        <el-button size="small" type="primary" @click="handleAddGoods"
          >新增</el-button
        >
        <el-button
          v-if="queryModel.tab === 'delete'"
          size="small"
          type="warning"
          @click="handleRestoreGoods"
          >恢复商品
        </el-button>
        <el-button
          v-if="queryModel.tab !== 'delete'"
          size="small"
          type="danger"
          @click="handleDelGoods"
          >批量删除</el-button
        >
        <el-popconfirm
          v-if="queryModel.tab === 'delete'"
          title="是否要删除该商品?"
          @confirm="handleDeleteGoodsDestory"
        >
          <template #reference>
            <el-button size="small" type="danger"> 彻底删除 </el-button>
          </template>
        </el-popconfirm>
        <el-button
          v-if="queryModel.tab === 'all' || queryModel.tab === 'off'"
          size="small"
          @click="shelves(1)"
          >上架
        </el-button>
        <el-button
          v-if="queryModel.tab === 'all' || queryModel.tab === 'saling'"
          size="small"
          @click="shelves(0)"
          >下架
        </el-button>
        <div class="right-refresh">
          <el-tooltip content="刷新数据" effect="dark" placement="top">
            <el-button
              icon="Refresh"
              style="font-size: 20px"
              text
              @click="getGoodsList"
            />
          </el-tooltip>
        </div>
      </div>
      <!-- 表格 -->
      <Atable
        :clos="tableClos"
        :data="goodsList"
        :stripe="true"
        @selectChange="selectChange"
      >
        <template v-slot:content="{ row }">
          <div class="content">
            <img :src="row.cover" alt="" class="cover" />
            <div class="right-cell">
              <p class="title">{{ row.title }}</p>
              <p class="price">
                <span>￥{{ row.min_price }}</span>
                <span>|</span>
                <span>￥{{ row.min_oprice }}</span>
              </p>
              <p class="footer">
                分类:{{
                  row.category && row.category.name ? row.category.name : ''
                }}
              </p>
              <p class="footer">
                创建时间：{{
                  row.category && row.category.create_time
                    ? row.category.create_time
                    : ''
                }}
              </p>
            </div>
          </div>
        </template>
        <!-- 商品状态 -->
        <template v-slot:status="{ row }">
          <el-tag v-if="row.status === 1" type="success">上架</el-tag>
          <el-tag v-else type="danger">仓库</el-tag>
        </template>
        <!-- 审核状态 -->
        <template v-slot:audit="{ row: { ischeck, id } }">
          <div
            style="
              width: 55px;
              height: 60px;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: space-around;
            "
          >
            <el-button
              v-if="ischeck === 0"
              plain
              size="small"
              type="success"
              @click="handleIscheck(1, id)"
              >审核通过
            </el-button>
            <el-button
              v-if="ischeck === 0"
              plain
              size="small"
              style="margin: 0"
              type="danger"
              @click="handleIscheck(2, id)"
            >
              审核拒绝
            </el-button>
            <span v-if="ischeck === 1">通过</span>
            <span v-if="ischeck === 2">拒绝</span>
          </div>
        </template>
        <!-- 操作 -->
        <template v-slot:action="{ row }">
          <div v-if="queryModel.tab !== 'delete'">
            <el-button link type="primary" @click="handleEditGoods(row)"
              >修改</el-button
            >
            <el-button link type="primary">商品规格</el-button>
            <el-button link type="primary">设置轮播图</el-button>
            <el-button link type="primary">商品详情</el-button>
            <el-popconfirm
              title="是否要删除该商品?"
              @confirm="handleDelGoods(row, 'one')"
            >
              <template #reference>
                <el-button link type="primary">删除</el-button>
              </template>
            </el-popconfirm>
          </div>
          <div v-else>暂无操作</div>
        </template>
      </Atable>
      <!-- 分页 -->
      <Paging :total="total" @currentChange="handleCurrent" />
    </el-card>
    <!-- 添加 修改抽屉 -->
    <el-drawer
      v-model="drawerShow"
      :close-on-click-modal="false"
      :z-index="1000"
      modal
      size="40%"
    >
      <template #header>
        <span>{{ drawerTitle }}</span>
      </template>
      <el-form
        ref="goodsModelRef"
        :model="goodsModel"
        :rules="formRules"
        label-width="100px"
      >
        <el-form-item label="商品名称" prop="title">
          <el-input
            v-model.trim="goodsModel.title"
            :maxlength="60"
            placeholder="请输入商品名称，不能超过60字符"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="封面">
          <el-upload list-type="picture-card">
            <el-icon>
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="商品分类" prop="category_id">
          <el-select
            v-model="goodsModel.category_id"
            placeholder="请选择商品分类"
          >
            <el-option
              v-for="item in catesList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品描述">
          <el-input
            v-model.trim="goodsModel.desc"
            placeholder="选填，商品卖点"
            type="textarea"
          ></el-input>
        </el-form-item>
        <el-form-item label="单位" prop="unit" style="width: 400px">
          <el-input
            v-model.trim="goodsModel.unit"
            placeholder="请输入单位"
            value="件"
          />
        </el-form-item>
        <el-form-item label="总库存" prop="stock" style="width: 300px">
          <el-input v-model="goodsModel.stock" type="number">
            <template #append>件</template>
          </el-input>
        </el-form-item>
        <el-form-item label="库存预警" prop="min_stock" style="width: 300px">
          <el-input v-model="goodsModel.min_stock" type="number">
            <template #append>件</template>
          </el-input>
        </el-form-item>
        <el-form-item label="最低销售价" prop="min_price" style="width: 300px">
          <el-input v-model="goodsModel.min_price" type="number">
            <template #append>元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="最低原价" prop="min_oprice" style="width: 300px">
          <el-input v-model.number="goodsModel.min_oprice" type="number">
            <template #append>元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="库存显示" prop="stock_display">
          <el-radio-group v-model="goodsModel.stock_display">
            <el-radio label="0">隐藏</el-radio>
            <el-radio label="1">显示</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否上架" prop="status">
          <el-radio-group v-model="goodsModel.status">
            <el-radio label="0">放入仓库</el-radio>
            <el-radio label="1">立即上架</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div style="display: flex; justify-content: flex-start">
          <el-button type="primary" @click="handleSubmitGoods">提交</el-button>
          <el-button @click="handleDrawerClose">取消</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup>
import {
  goodsListAPI,
  addGoodsAPI,
  changeStatusAPI,
  goodsRestoreAPI,
  goodsDeleteAPI,
  goodsDeleteDestroyAPI,
  goodsCheckAPI
} from '@/api/goods'
import { computed, reactive, ref } from 'vue'
import tabsOptions from './tabsOptions'
import Atable from '@/components/Table/a-table'
import tableClos from './tableClos'
import Paging from '@/components/Paging'
import formRules from './formRules'
import { Notification } from '@/utils/Notification'
// 抽屉标题
const drawerTitle = computed(() => {
  return goodsModel.id ? '修改' : '新增'
})
// 表单ref
const goodsModelRef = ref(null)
// 添加--修改-数据模型
const goodsModel = reactive({
  category_id: '',
  cover: '',
  desc: '',
  min_oprice: '',
  min_price: '',
  status: '1',
  stock: 100,
  stock_display: '1',
  title: '',
  unit: '件',
  min_stock: 10
})
// 抽屉是否显示
const drawerShow = ref(false)
// 商品分类的显示隐藏
const show = ref(false)
// 页码
const current = ref(1)
// 查询模型
const queryModel = reactive({
  title: '',
  tab: 'all',
  category_id: ''
})
// 表格多选框选中的值
const selected = ref([])
// 商品列表
const goodsList = ref([])
const catesList = ref([])
const total = ref(0)
const getGoodsList = async () => {
  try {
    const { list, cates, totalCount } = await goodsListAPI(
      current.value,
      queryModel
    )
    goodsList.value = list
    catesList.value = cates
    total.value = totalCount
  } catch (e) {
    console.log(e, 'goodsList')
  }
}
getGoodsList()
// tabs切换
const handleChangeTab = ({ props: { name } }) => {
  queryModel.tab = name
  getGoodsList()
}
// 分页
const handleCurrent = (val) => {
  current.value = val
  getGoodsList()
}
// 查询
const search = () => {
  getGoodsList()
}
// 重置
const reset = () => {
  queryModel.title = ''
  queryModel.category_id = ''
  getGoodsList()
}
// 新增商品
const handleAddGoods = () => {
  drawerShow.value = true
}
// 添加商品
const handleSubmitGoods = async () => {
  try {
    await goodsModelRef.value.validate()
    await addGoodsAPI(goodsModel)
    drawerShow.value = false
    Notification(goodsModel.id ? '修改成功' : '添加成功', '', 'success')
    getGoodsList()
  } catch (e) {
    console.log(e, 'handleSubmitGoods')
  } finally {
    handleDrawerClose()
  }
}
// 抽屉隐藏 & 重置表单数据
const handleDrawerClose = () => {
  drawerShow.value = false
  goodsModelRef.value.resetFields()
}
// 修改商品
const handleEditGoods = (row) => {
  for (const key in row) {
    goodsModel[key] = row[key] + ''
  }
  drawerShow.value = true
}
// 获取选中的值
const selectChange = (val) => {
  selected.value = val.map((v) => v.id)
}
// 上架或下架
const shelves = async (status) => {
  if (selected.value.length <= 0) {
    return Notification('请先选择商品噢', '', 'error')
  }
  const options = {
    status: status,
    ids: selected.value
  }
  try {
    await changeStatusAPI(options)
    Notification('修改状态成功', '', 'success')
    getGoodsList()
  } catch (e) {
    console.log(e, 'shelves')
  }
}
// 恢复商品
const handleRestoreGoods = async () => {
  if (selected.value.length <= 0) {
    return Notification('请先选择商品噢', '', 'error')
  }
  const options = {
    ids: selected.value
  }
  try {
    await goodsRestoreAPI(options)
    Notification('恢复成功', '', 'success')
    getGoodsList()
  } catch (e) {
    console.log(e, 'handleRestoreGoods')
  }
}
// 删除 和批量删除
const handleDelGoods = async (row, flag) => {
  try {
    const options = {
      ids: flag ? [row.id] : selected.value
    }
    await goodsDeleteAPI(options)
    Notification('删除成功', '', 'success')
    getGoodsList()
  } catch (e) {
    console.log(e)
  }
}
// 彻底删除商品
const handleDeleteGoodsDestory = async () => {
  if (selected.value.length <= 0) {
    return Notification('请先选择商品噢', '', 'error')
  }
  const options = {
    ids: selected.value
  }
  try {
    await goodsDeleteDestroyAPI(options)
    Notification('删除成功', '', 'success')
    getGoodsList()
  } catch (e) {
    console.log(e)
  }
}
// 商品审核
const handleIscheck = async (ischeck, id) => {
  try {
    await goodsCheckAPI(id, { ischeck })
    await getGoodsList()
    Notification('操作成功', '', 'success')
  } catch (e) {
    console.log(e)
  }
}
</script>

<style lang="scss" scoped>
.search {
  display: flex;
  width: 100%;
  height: 30px;
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
  .query-btn {
    width: 100px;
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
    margin-right: 10px;
    align-items: center;
  }
}
.btns {
  position: relative;
  margin-top: 30px;
  .right-refresh {
    position: absolute;
    right: 0;
    top: 0;
  }
}
.content {
  display: flex;
  align-items: center;
  .cover {
    width: 50px;
    height: 50px;
    margin-right: 5px;
  }
  .right-cell {
    font-size: 12px;
    p {
      margin: 0;
    }
    .title {
      font-size: 14px;
    }
    .price {
      span {
        &:nth-of-type(1) {
          color: #f43f5c;
          font-size: 14px;
        }
        &:nth-of-type(2) {
          font-size: 12px;
          margin: 0 5px;
          color: #dcdfe6;
        }
      }
    }
    .footer {
      font-size: 12px;
      color: #9ca3af;
    }
  }
}
::v-deep(.el-upload) {
  width: 100px;
  height: 100px;
}
</style>
