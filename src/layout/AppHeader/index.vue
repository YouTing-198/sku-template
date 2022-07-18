<template>
  <div class="header-container">
    <span class="logo">
      <el-icon><Eleme /></el-icon>
      积云编程
    </span>
    <!-- 左侧菜单缩放 -->
    <div class="icon-button" @click="changeIsCollapse">
      <el-icon>
        <Fold />
      </el-icon>
    </div>
    <!-- 刷新 -->
    <el-tooltip content="刷新" placement="bottom">
      <el-icon class="box-item" @click="refresh">
        <Refresh />
      </el-icon>
    </el-tooltip>
    <div>
      <!-- 全屏 -->
      <div class="right-container">
        <el-tooltip :content="screenfullTltle" placement="bottom">
          <el-icon class="box-item" @click="changeFullScreen">
            <FullScreen v-if="isFullscreen" />
            <Aim v-else />
          </el-icon>
        </el-tooltip>
        <!-- 下拉菜单 -->
        <el-dropdown trigger="click" @command="handleCommand">
          <span class="el-dropdown-link">
            <el-avatar :size="30" :src="userInfo.avatar"></el-avatar>
            <span class="username">{{ userInfo.username }}</span>
            <el-icon><ArrowDown /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="editPwd">修改密码</el-dropdown-item>
              <el-dropdown-item command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    <!--    修改密码抽屉-->
    <el-drawer v-model="drawer" title="修改密码">
      <el-form
        ref="formRef"
        :model="editPasswordFormModel"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input
            v-model="editPasswordFormModel.oldPassword"
            placeholder="请输入旧密码"
          />
        </el-form-item>
        <el-form-item label="确认密码" prop="newPassword">
          <el-input
            v-model="editPasswordFormModel.newPassword"
            placeholder="请输入新密码"
            show-password
            type="password"
          />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="editPasswordFormModel.confirmPassword"
            placeholder="请输入确认密码"
            show-password
            type="password"
          />
        </el-form-item>
      </el-form>
      <!-- 修改密码抽屉 -->
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleSubmit">提交</el-button>
          <el-button @click="drawer = false">取消</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup>
import { confirm } from '@/utils/confirm'
import { useStore } from 'vuex'
import screenfull from 'screenfull'
import { ref, nextTick, computed, reactive } from 'vue'
import { Notification } from '@/utils/Notification'
const store = useStore()
// 验证规则
const rules = {
  oldPassword: [
    {
      required: true,
      trigger: 'blur',
      message: '旧密码不能为空'
    }
  ],
  newPassword: [
    {
      required: true,
      message: '新密码不能为空',
      trigger: 'blur'
    }
  ],
  confirmPassword: [
    {
      required: true,
      trigger: 'blur',
      validator: (rule, value, callback) => {
        if (value === '') {
          callback(new Error('确认密码不能为空'))
        } else if (value !== editPasswordFormModel.newPassword) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
    }
  ]
}
// 修改密码表单
const formRef = ref(null)
const editPasswordFormModel = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})
const drawer = ref(false)
const isFullscreen = ref(true)
const screenfullTltle = computed(() => {
  return !isFullscreen.value ? '退出全屏' : '全屏'
})
const handleCommand = (command) => {
  switch (command) {
    case 'editPwd':
      editPwd()
      break
    case 'logout':
      logout()
      break
  }
}
// 修改密码
const editPwd = () => {
  drawer.value = true
}
// 退出登录
const logout = async () => {
  try {
    await confirm('是否要退出登录？', '', 'warning', '确定', '取消')
    store.dispatch('user/userLogout')
  } catch (e) {}
}
// 全屏切换
const changeFullScreen = () => {
  screenfull.toggle()
  nextTick(() => {
    isFullscreen.value = screenfull.isFullscreen
  })
}
// 刷新页面
const refresh = () => {
  window.location.reload()
}
// 修改密码
const handleSubmit = async () => {
  try {
    await formRef.value.validate()
    Notification('修改密码', '', 'success')
    drawer.value = false
  } catch (e) {
    console.log(e)
  }
}
// 用户信息
const userInfo = computed(() => {
  const { username } = store.getters.userInfo
  return {
    username,
    avatar:
      'https://portrait.gitee.com/uploads/avatars/user/3659/10978559_suyuan_0_1652861325.png'
  }
})
// 菜单缩放
const changeIsCollapse = () => {
  store.commit('menu/changeIsCollapse')
}
</script>

<style lang="scss" scoped>
.header-container {
  z-index: 9;
  color: #fff;
  display: flex;
  align-items: center;
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0px;
  height: 64px;
  background: #4338ca;
  .logo {
    width: 250px;
    display: flex;
    align-items: center;
    font-weight: 100;
    height: 100%;
    justify-content: center;
    font-size: 20px;
    .el-icon {
      color: #fff;
      margin-right: 5px;
    }
  }
  .el-dropdown {
    cursor: pointer;
  }
  .icon-button,
  .box-item {
    color: #fff;
    height: 100%;
    width: 42px;
    font-size: 20px;
    transition: all 0.5s;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  }
  .right-container {
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .el-dropdown {
      width: 150px;
      display: flex;
      justify-content: center;
      align-items: center;
      .el-dropdown-link {
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
        font-size: 15px;
        .username {
          margin: 0 10px;
        }
      }
    }
  }
}
.dialog-footer {
  display: flex;
  justify-content: flex-start;
}
</style>
