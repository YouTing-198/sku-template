<template>
  <!-- 结合 el-icon 使用（el-icon 为原始的 SVG 图标提供额外的属性） -->
  <el-icon><Search /></el-icon>
  <!-- 通过添加额外的类名 is-loading，你的图标就可以在2秒内旋转360度，但让你也可以自己改写想要的动画 -->
  <el-icon class="is-loading"><loading /></el-icon>
  <!-- 直接使用 SVG 图标 -->
  <Edit style="width: 30px; height: 30px" />
  <Share style="width: 40px; height: 40px; margin-right: 8px" />
  <Apple style="width: 50px; height: 50px; margin-right: 8px" />
</template>
<script setup></script>
<style lang="scss" scoped></style>
