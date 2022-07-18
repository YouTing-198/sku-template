<template>
  <el-container>
    <el-header>
      <AppHeader />
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '250px'">
        <AppAside />
      </el-aside>
      <el-main :style="{ marginLeft: isCollapse ? '64px' : '250px' }">
        <!--  tagsView-->
        <TagsView></TagsView>
        <AppMain />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import AppHeader from './AppHeader'
import AppAside from './AppAside'
import AppMain from './AppMain'
import TagsView from '@/components/TagsView'
import { useStore } from 'vuex'
import { computed } from 'vue'
const store = useStore()
const isCollapse = computed(() => {
  return store.getters.isCollapse
})
</script>

<style lang="scss" scoped>
.el-container {
  height: 100%;
  .el-header {
    background: #4338ca;
    height: 64px;
  }
  & > .el-container {
    .el-aside {
      transition: all 0.3s;
      background: #fdfdfd;
      -ms-overflow-style: none; /* IE 10+ */
      scrollbar-width: none; /* Firefox */
      position: fixed;
      z-index: 1000;
      height: 100%;
    }
    .el-main {
      background: #f3f4f6;
      width: 100%;
      position: relative;
      transition: all 0.4s;
    }
  }
}
::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}
</style>
