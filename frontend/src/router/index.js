import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import store from '../store'

Vue.use(VueRouter)

// --- 全局捕获 NavigationDuplicated 错误 ---
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => {
    if (
      err.name === 'NavigationDuplicated' ||
      // Vue Router 3.1+ uses isNavigationFailure and NavigationFailureType
      (VueRouter.isNavigationFailure && VueRouter.isNavigationFailure(err, VueRouter.NavigationFailureType.duplicated))
    ) {
      // 静默处理重复导航错误
      return err;
    }
    // 对于其他错误，仍然抛出
    return Promise.reject(err);
  });
}

const originalReplace = VueRouter.prototype.replace;
VueRouter.prototype.replace = function replace(location, onResolve, onReject) {
  if (onResolve || onReject) return originalReplace.call(this, location, onResolve, onReject);
  return originalReplace.call(this, location).catch(err => {
    if (
      err.name === 'NavigationDuplicated' ||
      (VueRouter.isNavigationFailure && VueRouter.isNavigationFailure(err, VueRouter.NavigationFailureType.duplicated))
    ) {
      return err;
    }
    return Promise.reject(err);
  });
};
// --- 结束全局捕获 ---

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/products',
    name: 'Products',
    component: () => import('../views/product/ProductList.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/components',
    name: 'Components',
    component: () => import('../views/component/ComponentList.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/bom',
    name: 'BOM',
    component: () => import('../views/bom/BomList.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/bom/create',
    name: 'CreateBOM',
    component: () => import('../views/bom/BomForm.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/bom/edit/:id',
    name: 'EditBOM',
    component: () => import('../views/bom/BomForm.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/sales-orders',
    name: 'SalesOrders',
    component: () => import('../views/sales/SalesOrderList.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/sales-orders/create',
    name: 'CreateSalesOrder',
    component: () => import('../views/sales/SalesOrderForm.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/sales-orders/:id',
    name: 'SalesOrderDetail',
    component: () => import('../views/sales/SalesOrderDetail.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/purchase-orders',
    name: 'PurchaseOrders',
    component: () => import('../views/purchase/PurchaseOrderList.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/purchase-orders/create',
    name: 'CreatePurchaseOrder',
    component: () => import('../views/purchase/PurchaseOrderForm.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/purchase-orders/:id',
    name: 'PurchaseOrderDetail',
    component: () => import('../views/purchase/PurchaseOrderDetail.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/inventory',
    name: 'Inventory',
    component: () => import('../views/inventory/InventoryList.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/inventory/transactions',
    name: 'InventoryTransactions',
    component: () => import('../views/inventory/TransactionList.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/inventory/in-transit',
    name: 'InTransitInventory',
    component: () => import('../views/inventory/InTransitList.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/inventory/stock-in',
    name: 'StockIn',
    component: () => import('../views/inventory/StockInForm.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/inventory/stock-out',
    name: 'StockOut',
    component: () => import('../views/inventory/StockOutForm.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/inventory/adjustment',
    name: 'InventoryAdjustment',
    component: () => import('../views/inventory/AdjustmentForm.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/finance/receivables',
    name: 'AccountsReceivable',
    component: () => import('../views/finance/ReceivableList.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/finance/payables',
    name: 'AccountsPayable',
    component: () => import('../views/finance/PayableList.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/finance/invoices',
    name: 'Invoices',
    component: () => import('../views/finance/InvoiceList.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/reports',
    name: 'Reports',
    component: () => import('../views/report/ReportDashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../views/settings/Settings.vue'),
    meta: { requiresAuth: true }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 导航守卫
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isAuthenticated = store.state.token

  if (requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router
