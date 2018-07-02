/**
 * 权限
 */

import Vue from 'vue'
import store from '@/utils/store'
import menu from '@/resources/menu'
import config from '@/config'
import _ from 'lodash'

// 递归匹配menu name筛选菜单
const filterMenu = function (menuObj, authMenu) {
  const _menus = _.cloneDeep(menuObj)
  return _menus.filter(menu => {
    if (authMenu.indexOf(menu.name) > -1) {
      // 对子菜单进行递归过滤
      if (menu.children && menu.children.length > 0) {
        menu.children = filterMenu(menu.children, authMenu)

        // 过滤掉子菜单全部没有权限的主菜单
        if (menu.children && menu.children.length === 0) {
          return false
        }
      }
      return true
    }
    // 父菜单不匹配，直接不再返回子菜单
    return false
  })
}

// 获取授权访问的菜单
const filteredMenu = function () {
  if (config.needPermission === false) {
    return menu
  }
  return filterMenu(menu, store.resource.getMenu())
}

// 是否授权访问菜单
const isAuthMenu = function (resourceName) {
  // 404 和 首页登录后可以访问
  if (!resourceName ||
    ['welcome', 'welcome.index', 'login', 'login.index'].indexOf(resourceName) > -1) {
    return true
  }
  const authMenu = store.resource.getMenu()  // 已授权的菜单
  return config.needPermission === false ? true : authMenu.indexOf(resourceName) > -1;
}

// 是否授权访问接口
const isAuthApi = function (resourceName) {
  const authApi = store.resource.getApi()  // 已授权的API
  return config.needPermission === false ? true : authApi.indexOf(resourceName) > -1;
}

// 是否授权访问行为
const isAuthAction = function (resourceName) {
  const authAction = store.resource.getAction()  // 已授权的行为
  return config.needPermission === false ? true : authAction.indexOf(resourceName) > -1;
}

// 添加到 Vue 实例方法
Vue.prototype.isAuthMenu = isAuthMenu
Vue.prototype.isAuthApi = isAuthApi
Vue.prototype.isAuthAction = isAuthAction

export default {
  filteredMenu,
  isAuthMenu,
  isAuthApi,
  isAuthAction,
}
