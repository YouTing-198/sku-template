<template>
  <el-skeleton :count="10" :loading="skeletonLoading" :throttle="0" animated>
    <!--    第一行-->
    <el-row :gutter="20" class="top_1">
      <el-col v-for="(item, i) in panelsList" :key="i" :span="6">
        <el-card shadow="hover">
          <template #header>
            <span class="title">{{ item.title }}</span>
            <el-tag :type="item.unitColor" effect="plain">{{
              item.unit
            }}</el-tag>
          </template>
          <span class="text_1">{{ item.value }}</span>
          <el-divider></el-divider>
          <div class="body_footer">
            <span>{{ item.subTitle }}</span>
            <span>{{ item.subValue }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!--    第二行-->
    <el-row :gutter="20" class="top_2">
      <el-col v-for="(item, i) in routerList" :key="i" :span="3">
        <el-card
          shadow="hover"
          style="cursor: pointer"
          @click="toViews(item.path)"
        >
          <div class="card-flex">
            <el-icon>
              <component :is="item.icon" :color="item.color"></component>
            </el-icon>
            <span class="title">{{ item.title }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!--    第三行-->
    <el-row :gutter="20" class="top_3">
      <!--      左侧-->
      <el-col :span="12" class="left_1">
        <el-card>
          <template #header>
            <span class="title">订单统计</span>
            <div class="check-tag">
              <el-check-tag>近1个月</el-check-tag>
              <el-check-tag>近1周</el-check-tag>
              <el-check-tag>近24小时</el-check-tag>
            </div>
          </template>
        </el-card>
      </el-col>
      <!--      右侧-->
      <el-col :span="12" class="right_1">
        <!--        上-->
        <el-card>
          <template #header>
            <span class="title">店铺及商品提示</span>
            <el-tag effect="plain" type="danger">店铺及商品提示</el-tag>
          </template>
          <el-row :gutter="20" class="top_1">
            <el-col v-for="(item, i) in goodsList" :key="i" :span="6">
              <el-card
                :body-style="{ background: '#f6f6f6', border: 'none' }"
                shadow="hover"
              >
                <div class="card-div">
                  <span>{{ item.value }}</span>
                  <span style="margin-top: 10px">{{ item.label }}</span>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </el-card>
        <!--      下-->
        <el-card style="margin-top: 10px">
          <template #header>
            <span class="title">交易提示</span>
            <el-tag effect="plain" type="danger">需要立即处理的交易订单</el-tag>
          </template>
          <el-row :gutter="20" class="top_1">
            <el-col v-for="(item, i) in orderList" :key="i" :span="6">
              <el-card
                :body-style="{ background: '#f6f6f6', border: 'none' }"
                shadow="hover"
              >
                <div class="card-div">
                  <span>{{ item.value }}</span>
                  <span style="margin-top: 10px">{{ item.label }}</span>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </el-skeleton>
</template>

<script setup>
import { statistics1API, statistics2API, statistics3API } from '@/api'
import { ref } from 'vue'
import routerList from './routerList'
import { useRouter } from 'vue-router'
const router = useRouter()
const skeletonLoading = ref(true)
const panelsList = ref([])
const goodsList = ref([])
const orderList = ref([])
const getStatistics = async () => {
  try {
    const { panels } = await statistics1API()
    const { goods, order } = await statistics2API()
    const res = await statistics3API({ type: 'week' })
    panelsList.value = panels
    goodsList.value = goods
    orderList.value = order
    skeletonLoading.value = false
    console.log(res)
  } catch (e) {
    console.log(e)
  }
}
getStatistics()
const toViews = (path) => {
  router.push(path)
}
</script>
<style lang="scss" scoped>
.top_1 {
  transition: all 0.5s;
  ::v-deep(.el-card) {
    .el-card__header {
      display: flex;
      justify-content: space-between;
      background: #f9fafb;
      height: 50px;
      align-items: center;
      .title {
        font-size: 15px;
      }
    }
    .el-card__body {
      color: rgba(107, 114, 128);
      .text_1 {
        font-weight: 700;
        font-size: 40px;
      }
      .body_footer {
        display: flex;
        justify-content: space-between;
      }
    }
  }
}
.top_2 {
  transition: all 0.5s;
  margin: 20px -10px;
  ::v-deep(.el-col) {
    flex: 0 0 12.5%;
    max-width: 12.5%;
  }
  .card-flex {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .title {
      font-size: 15px;
      margin-top: 10px;
    }
  }
}
.top_3 {
  .left_1 {
    ::v-deep(.el-card) {
      .el-card__header {
        display: flex;
        justify-content: space-between;
        background: #f9fafb;
        height: 50px;
        align-items: center;
        .title {
          font-size: 15px;
        }
        .check-tag {
          .el-check-tag {
            margin-right: 8px;
          }
        }
      }
    }
  }
  .right_1 {
    ::v-deep(.el-card) {
      .el-card__header {
        display: flex;
        justify-content: space-between;
        background: #f9fafb;
        height: 40px;
        align-items: center;
        .title {
          font-size: 15px;
        }
      }
      .top_1 {
        .card-div {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
        }
      }
    }
  }
}
</style>
