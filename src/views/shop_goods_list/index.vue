<template>
  <div>
    <!--    标签页-->
    <el-tabs v-model="queryModel.tab" @tab-click="handleChangeTab">
      <el-tab-pane
        v-for="item in tabsOptions"
        :key="item.id"
        :label="item.label"
        :name="item.name"
      >
      </el-tab-pane>
    </el-tabs>
    <!--    表格-->
    <el-card shadow="never">
      <!--      搜索-->
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
          >恢复商品</el-button
        >
        <el-button size="small" type="danger">彻底删除</el-button>
        <el-button
          v-if="queryModel.tab === 'all' || queryModel.tab === 'off'"
          size="small"
          >上架</el-button
        >
        <el-button
          v-if="queryModel.tab === 'all' || queryModel.tab === 'saling'"
          size="small"
          >下架</el-button
        >
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
      <!--     表格 -->
      <Atable :clos="tableClos" :data="goodsList">
        <template v-slot:content="{ row }">
          <!--          {{ row.category.name }}-->
          <div class="content">
            <img :src="row.cover" alt="" />
            <div class="right-cell">
              <p class="title">{{ row.title }}</p>
              <p class="price">
                <span>{{ row.min_price }}</span>
                <span>|</span>
                <span>{{ row.min_oprice }}</span>
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
        <!--       商品状态 -->
        <template v-slot:status="{ row }">
          <el-tag v-if="row.status === 1" type="success">上架</el-tag>
          <el-tag v-else type="danger">仓库</el-tag>
        </template>
        <!--        审核状态-->
        <template v-slot:audit="{ row }">
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
              v-if="row.ischeck === 0"
              plain
              size="small"
              type="success"
              >审核通过</el-button
            >
            <el-button
              v-if="row.ischeck === 0"
              plain
              size="small"
              style="margin: 0"
              type="danger"
              >审核拒绝</el-button
            >
            <span v-if="row.ischeck === 1">通过</span>
            <span v-if="row.ischeck === 2">拒绝</span>
          </div>
        </template>
        <!--        操作-->
        <template v-slot:action>
          <el-button link type="primary">修改</el-button>
          <el-button link type="primary">商品规格</el-button>
          <el-button link type="primary">设置轮播图</el-button>
          <el-button link type="primary">商品详情</el-button>
          <el-button link type="primary">删除</el-button>
        </template>
      </Atable>
      <!--      分页-->
      <Paging :total="total" @currentChange="handleCurrent" />
    </el-card>
    <el-select>
      <el-option
        v-for="item in catesList"
        :key="item.id"
        :label="item.name"
        :value="item.id"
      ></el-option>
    </el-select>
    <!--    添加 修改--抽屉-->
    <el-drawer
      v-model="drawerShow"
      :close-on-click-modal="false"
      :z-index="1000"
      modal
      size="40%"
    >
      <template #header>
        <span>新增</span>
      </template>
      <el-form label-width="90px">
        <el-form-item label="商品名称">
          <el-input
            v-model="goodsModel.title"
            :maxlength="60"
            placeholder="请输入商品名称，不能超过60字符"
          ></el-input>
        </el-form-item>
        <el-form-item label="封面">
          <el-upload list-type="picture-card">
            <el-icon>
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="商品分类">
          <el-select placeholder="请选择商品分类">
            <el-option
              v-for="item in catesList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品描述">
          <el-input placeholder="选填，商品卖点" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="单位" style="width: 400px">
          <el-input placeholder="请输入单位" value="件" />
        </el-form-item>
        <el-form-item label="总库存" style="width: 300px">
          <el-input type="number" value="100">
            <template #append>件</template>
          </el-input>
        </el-form-item>
        <el-form-item label="库存预警" style="width: 300px">
          <el-input type="number" value="10">
            <template #append>件</template>
          </el-input>
        </el-form-item>
        <el-form-item label="最低销售价" style="width: 300px">
          <el-input type="number" value="0">
            <template #append>元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="最低原价" style="width: 300px">
          <el-input type="number" value="0">
            <template #append>元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="库存显示">
          <el-radio label="隐藏"></el-radio>
          <el-radio label="显示"></el-radio>
        </el-form-item>
        <el-form-item label="是否上架">
          <el-radio label="放入仓库"></el-radio>
          <el-radio label="立即上架"></el-radio>
        </el-form-item>
      </el-form>
      <template #footer>
        <div style="display: flex; justify-content: flex-start">
          <el-button type="primary">提交</el-button>
          <el-button>取消</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup>
import { goodsListAPI } from '@/api/goods'
import { reactive, ref } from 'vue'
import tabsOptions from './tabsOptions'
import Atable from '@/components/Table/a-table'
import tableClos from './tableClos'
import Paging from '@/components/Paging'
// 添加--修改-数据模型
const goodsModel = reactive({
  category_id: '',
  cover: '',
  desc: '',
  min_oprice: '',
  min_price: '',
  status: '',
  stock: 100,
  stock_display: 1,
  title: '',
  unit: '件'
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
// tabs选中值
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
  img {
    width: 50px;
    height: 50px;
    margin-right: 5px;
  }
  .right-cell {
    font-size: 10px;
    .title {
      font-size: 15px;
    }
    .price {
      display: flex;
      align-items: center;
      span {
        &:nth-of-type(1) {
          color: #f56c6c;
          font-size: 15px;
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
