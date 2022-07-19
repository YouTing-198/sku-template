<template>
  <div class="pagination-container">
    <el-pagination
      :total="total"
      background
      layout="prev, pager, next"
      @current-change="handleChangeCurrent"
    />
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
defineProps({
  total: Number
})
const emits = defineEmits(['currentChange'])
const handleChangeCurrent = (current) => {
  emits('currentChange', current)
}
</script>

<style scoped>
.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>
