<template>
  <el-menu :collapse="isCollapse" router unique-opened>
    <MenuTree
      v-for="(item, i) in menuList"
      :key="i"
      :i="i"
      :item="item"
    ></MenuTree>
  </el-menu>
</template>
<script setup>
import MenuTree from './MenuTree'
import { useStore } from 'vuex'
import { filterMenus } from '@/utils/filterMenus'
import { computed } from 'vue'
const store = useStore()
const menuList = computed(() => {
  return filterMenus(store.getters.menus)
})
const isCollapse = computed(() => {
  return store.getters.isCollapse
})
</script>
<style scoped></style>
