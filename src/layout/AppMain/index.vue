<template>
  <Loading
    v-if="loading"
    :style="{
      left: isCollapse ? '64px' : '250px',
      width: isCollapse ? 'calc(100vw - 64px)' : 'calc(100vw - 250px)'
    }"
    class="loading"
  ></Loading>
  <router-view />
</template>

<script setup>
import Loading from '@/components/Loading'
import { useStore } from 'vuex'
import { computed } from 'vue'
const store = useStore()
const isCollapse = computed(() => {
  return store.getters.isCollapse
})
const loading = computed(() => {
  return store.getters.loading
})
</script>

<style scoped>
.loading {
  position: fixed;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #fff;
  z-index: 1000;
  opacity: 0.5;
}
</style>
