<template>
  <div class="home">
    <el-button type="primary" @click="drawer = true" class="btn-open"
      >打开
    </el-button>
    <el-drawer v-model="drawer" title="I am the title">
      <span>Hi, there!</span>
    </el-drawer>
  </div>
</template>
<script setup>
import { ref } from 'vue'
const drawer = ref(false)
</script>
<style lang="scss" scoped>
.btn-open {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
