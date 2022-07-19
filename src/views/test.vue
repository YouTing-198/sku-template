<template>
  <div class="test">
    <el-button type="primary" style="margin-left: 16px" @click="drawer = true">
      open
    </el-button>
    <el-drawer v-model="drawer" title="I am the title">
      <span>我来了</span>
    </el-drawer>
    <el-drawer v-model="drawer2" :direction="direction">
      <template #title>
        <h4>set title by slot</h4>
      </template>
      <template #default>
        <div>
          <el-radio v-model="radio1" label="Option 1" size="large"
            >Option 1</el-radio
          >
          <el-radio v-model="radio1" label="Option 2" size="large"
            >Option 2</el-radio
          >
        </div>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="cancelClick">cancel</el-button>
          <el-button type="primary" @click="confirmClick">confirm</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>
<script setup>
import { ref } from 'vue'
const drawer = ref(false)
const drawer2 = ref(false)
const direction = ref('rtl')
const radio1 = ref('Option 1')
function cancelClick() {
  drawer2.value = false
}
function confirmClick() {
  drawer2.value = false
}
</script>
<style lang="scss" scoped></style>
