<template>
  <el-table :data="data">
    <el-table-column
      v-for="(item, i) in clos"
      :key="i"
      :align="item.align"
      :label="item.label"
      :prop="item.prop"
      :type="item.type"
      :width="item.width"
    >
      <template v-if="item.slot" v-slot="{ row, $index, column }">
        <slot
          :column="column"
          :index="$index"
          :name="item.slot"
          :row="row"
        ></slot>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup>
import { defineProps } from 'vue'
defineProps({
  clos: {
    type: Array,
    default: () => []
  },
  data: {
    type: Array,
    default: () => []
  }
})
</script>

<style scoped>
.el-table {
  margin-top: 20px;
}
</style>
