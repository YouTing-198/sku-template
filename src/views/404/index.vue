<template>
  <div class='container container-star'>
    <div v-for='(item, index) in 30' :key='index' class='star-1'></div>
    <div v-for='(item, index) in 30' :key='index' class='star-2'></div>
  </div>
  <div class='container container-bird'>
    <div v-for='(item, index) in 6' :key='index' class='bird bird-anim'>
      <div class='bird-container'>
        <div class='wing wing-left'>
          <div class='wing-left-top'></div>
        </div>
        <div class='wing wing-right'>
          <div class='wing-right-top'></div>
        </div>
      </div>
    </div>
    <div class='container-title'>
      <div class='title'>
        <div class='number'>4</div>
        <div class='moon'>
          <div class='face'>
            <div class='mouth'></div>
            <div class='eyes'>
              <div class='eye-left'></div>
              <div class='eye-right'></div>
            </div>
          </div>
        </div>
        <div class='number'>4</div>
      </div>
      <div class='subtitle'>哎呀。看来你拐错弯了。</div>
      <div class='btn'>
        <button style='margin-right: 30px' @click='goHome'>返回首页</button>
        <button style='margin-left: 20px' @click='goBack'>返回上一页</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const goHome = () => {
  router.push('/')
}
const goBack = () => {
  router.go(-1)
}
</script>

<style scoped>
@import url('./index.css');
</style>
