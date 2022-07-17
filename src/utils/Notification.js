import { ElNotification } from 'element-plus'

export const Notification = (title, msg, type) => {
  ElNotification({
    title,
    msg,
    type
  })
}
