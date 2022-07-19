<template>
  <div class="flex_div">
    <div class="animation_div">加载中</div>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.flex_div {
  margin: 0;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.animation_div {
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  box-sizing: border-box;
  /* background: #ffff00; */
  line-height: 80px;
  text-align: center;
}
.animation_div::before {
  position: absolute;
  left: 0;
  top: 0;
  display: block;
  content: '';
  width: 80px;
  height: 80px;
  border-width: 1px;
  border-style: solid;
  border-color: #00ffff transparent transparent transparent;
  box-sizing: content-box;
  animation: trotate 1.5s linear infinite;
  border-radius: 50%;
  z-index: 2;
}
.animation_div::after {
  position: absolute;
  left: -3px;
  top: -3px;
  display: block;
  content: '';
  width: 86px;
  height: 86px;
  border-width: 1px;
  border-style: solid;
  border-color: #ff0000 transparent transparent transparent;
  box-sizing: content-box;
  animation: trotate 1s linear infinite;
  border-radius: 50%;
  z-index: 1;
}
@keyframes trotate {
  0% {
    transform: rotate(0);
  }
  25% {
    transform: rotate(90deg);
  }
  50% {
    transform: rotate(180deg);
  }
  75% {
    transform: rotate(270deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
