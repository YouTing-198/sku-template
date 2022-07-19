<template>
  <div
    :style="{
      left: $store.getters.isCollapse ? '64px' : '250px',
      width: $store.getters.isCollapse
        ? 'calc(100vw - 64px)'
        : 'calc(100vw - 250px)'
    }"
    class="tags-container"
  >
    <el-tabs
      :model-value="tabsName"
      class="demo-tabs"
      type="card"
      @tab-remove="handleCloseTags"
      @tab-click="changeView"
    >
      <el-tab-pane
        v-for="(item, i) in tags"
        :key="i"
        :closable="item.path !== '/index'"
        :label="item.title"
        :name="item.path"
      />
    </el-tabs>
    <!--  下拉-->
    <div class="tag-btn">
      <el-dropdown trigger="click" @command="handleCloseAllTags">
        <span class="el-dropdown-link">
          <el-icon><ArrowDown /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="closeOther">关闭其它</el-dropdown-item>
            <el-dropdown-item command="closeAll">关闭全部</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
  <div style="height: 40px"></div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { computed, watch } from 'vue'
import { useStore } from 'vuex'
const router = useRouter()
const store = useStore()
const route = useRoute()
// 渲染标签
const tags = computed(() => {
  return store.getters.tagsView
})
// 默认选中值
const tabsName = computed(() => {
  return route.path
})
// 监听路由信息
watch(
  route,
  (val) => {
    if (!val.meta.title) return
    const tags = {
      path: val.path,
      title: val.meta.title
    }
    store.commit('tagsView/setTags', tags)
  },
  {
    immediate: true,
    deep: true
  }
)
// 删除tags
const handleCloseTags = (name) => {
  let path = ''
  const tags = store.getters.tagsView
  // 获取下标
  const index = tags.findIndex((item) => item.path === name)
  // 先跳转
  if (index !== tags.length - 1) {
    path = tags[index + 1].path
  } else {
    path = tags[index - 1].path
  }
  router.push(path)
  store.commit('tagsView/delTags', index)
}
// 关闭其它 关闭全部标签
const handleCloseAllTags = (command) => {
  switch (command) {
    case 'closeOther':
      closeOther()
      break
    case 'closeAll':
      closeAll()
      break
  }
}
// 关闭其它
const closeOther = () => {
  store.commit('tagsView/delOhter', route.path)
}
// 关闭全部
const closeAll = () => {
  store.commit('tagsView/delAll')
  router.push('/index')
}
// 页面跳转
const changeView = ({ props: { name } }) => {
  router.push(name)
}
</script>

<style lang="scss" scoped>
.tags-container {
  height: 44px;
  top: 64px;
  position: fixed;
  transition: all 0.4s;
  width: 100%;
  display: flex;
  padding: 0 8px 0 8px;
  box-sizing: border-box;
  background: #f3f4f6;
  z-index: 10;
  .el-tabs {
    height: 100%;
    flex: 1;
    overflow-y: hidden;
    ::v-deep(.el-tabs__header) {
      border: none;
      .el-tabs__nav {
        border: 0 !important;
        .el-tabs__item {
          background: #fff;
          margin: 0 4px;
          height: 32px;
          padding: 0 20px;
          line-height: 32px;
          border-radius: 5px;
          border: 0 !important;
        }
      }
    }
  }
  .tag-btn {
    --tw-bg-opacity: 1;
    background-color: rgba(255, 255, 255, var(--tw-bg-opacity));
    border-radius: 0.25rem;
    display: -webkit-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    -webkit-align-items: center;
    align-items: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    -webkit-justify-content: center;
    justify-content: center;
    margin-left: auto;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    height: 32px;
    margin-top: 5px;
    .el-dropdown-link {
      cursor: pointer;
    }
  }
}
</style>
