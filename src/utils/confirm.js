import { ElMessageBox } from 'element-plus'

export const confirm = async (
  message,
  title,
  type,
  confirmButtonText,
  cancelButtonText
) => {
  await ElMessageBox.confirm(message, title, {
    confirmButtonText,
    cancelButtonText,
    type
  })
}
