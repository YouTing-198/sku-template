export const filterMenus = (menus) => {
  const newMenus = []
  menus.forEach((item) => {
    const result = {
      title: item.name,
      icon: item.icon,
      children: []
    }
    if (item.child && item.child.length > 0) {
      item.child.forEach((child) => {
        result.children.push({
          title: child.name,
          icon: child.icon,
          path: child.frontpath
        })
      })
    }
    newMenus.push(result)
  })
  return newMenus
}
