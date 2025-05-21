<template>
  <div class="app-container">
    <el-container>
      <el-aside width="220px">
        <div class="logo">
          <img src="../assets/logo.png" alt="翔珑科技ERP" v-if="false">
          <h2>翔珑科技ERP</h2>
        </div>
        <el-menu
          :default-active="activeMenu"
          class="el-menu-vertical"
          background-color="#304156"
          text-color="#bfcbd9"
          active-text-color="#409EFF"
          router
        >
          <el-menu-item index="/">
            <i class="el-icon-s-home"></i>
            <span>首页</span>
          </el-menu-item>
          
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-s-goods"></i>
              <span>基础数据</span>
            </template>
            <el-menu-item index="/products">产品管理</el-menu-item>
            <el-menu-item index="/components">配件管理</el-menu-item>
            <el-menu-item index="/bom">BOM管理</el-menu-item>
            <el-menu-item index="/customers">客户管理</el-menu-item>
            <el-menu-item index="/suppliers">供应商管理</el-menu-item>
          </el-submenu>
          
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-s-order"></i>
              <span>订单管理</span>
            </template>
            <el-menu-item index="/sales-orders">销售订单</el-menu-item>
            <el-menu-item index="/purchase-orders">采购订单</el-menu-item>
          </el-submenu>
          
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-s-management"></i>
              <span>库存管理</span>
            </template>
            <el-menu-item index="/inventory">库存查询</el-menu-item>
            <el-menu-item index="/inventory/in-transit">在途库存</el-menu-item>
            <el-menu-item index="/inventory/transactions">库存事务</el-menu-item>
            <el-menu-item index="/inventory/stock-in">入库管理</el-menu-item>
            <el-menu-item index="/inventory/stock-out">出库管理</el-menu-item>
            <el-menu-item index="/inventory/adjustment">库存调整</el-menu-item>
          </el-submenu>
          
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-money"></i>
              <span>财务管理</span>
            </template>
            <el-menu-item index="/finance/receivables">应收账款</el-menu-item>
            <el-menu-item index="/finance/payables">应付账款</el-menu-item>
            <el-menu-item index="/finance/invoices">发票管理</el-menu-item>
          </el-submenu>
          
          <el-menu-item index="/reports">
            <i class="el-icon-s-data"></i>
            <span>报表中心</span>
          </el-menu-item>
          
          <el-menu-item index="/settings">
            <i class="el-icon-setting"></i>
            <span>系统设置</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      
      <el-container>
        <el-header>
          <div class="header-left">
            <i class="el-icon-s-fold toggle-sidebar"></i>
            <breadcrumb />
          </div>
          <div class="header-right">
            <el-dropdown trigger="click">
              <span class="user-dropdown">
                {{ currentUser ? currentUser.real_name || currentUser.username : '用户' }}
                <i class="el-icon-arrow-down"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>个人信息</el-dropdown-item>
                <el-dropdown-item>修改密码</el-dropdown-item>
                <el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-header>
        
        <el-main>
          <router-view />
        </el-main>
        
        <el-footer>
          <div class="footer-content">
            © 2025 上海翔珑科技有限公司 - ERP系统
          </div>
        </el-footer>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb.vue'

export default {
  name: 'App',
  components: {
    Breadcrumb
  },
  computed: {
    ...mapGetters(['currentUser']),
    activeMenu() {
      return this.$route.path
    }
  },
  methods: {
    ...mapActions(['logout']),
    handleLogout() {
      this.logout()
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.app-container {
  height: 100vh;
}

.el-aside {
  background-color: #304156;
  color: #bfcbd9;
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background-color: #263445;
}

.logo img {
  height: 40px;
  margin-right: 10px;
}

.el-menu-vertical {
  border-right: none;
}

.el-header {
  background-color: #fff;
  color: #333;
  line-height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}

.header-left, .header-right {
  display: flex;
  align-items: center;
}

.toggle-sidebar {
  font-size: 20px;
  cursor: pointer;
  margin-right: 15px;
}

.user-dropdown {
  cursor: pointer;
  display: flex;
  align-items: center;
}

.el-main {
  background-color: #f0f2f5;
  padding: 20px;
}

.el-footer {
  background-color: #fff;
  color: #666;
  text-align: center;
  line-height: 60px;
  border-top: 1px solid #e6e6e6;
}

.footer-content {
  font-size: 12px;
}
</style>
