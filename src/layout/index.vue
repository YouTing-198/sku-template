<template>
  <el-container>
    <el-header>
      <AppHeader />
    </el-header>
    <el-container>
      <el-aside width="250px">
        <AppAside />
      </el-aside>
      <el-main>
        <AppMain />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import AppHeader from './AppHeader'
import AppAside from './AppAside'
import AppMain from './AppMain'
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
      transition: all 2s;
      background: #fdfdfd;
    }
    .el-main {
      background: #f3f4f6;
    }
  }
}
</style>
