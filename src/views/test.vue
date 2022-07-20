<template>
  <div class="home">
    <el-button type="primary" @click="drawer = true">打开 </el-button>
    <el-drawer v-model="drawer" title="I am the title">
      <span>Hi, there!</span>
    </el-drawer>
  </div>
</template>
<script setup>
import { ref } from 'vue'
const drawer = ref(false)
</script>
<style lang="scss" scoped></style>
