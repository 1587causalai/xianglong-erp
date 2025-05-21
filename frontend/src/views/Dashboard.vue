<template>
  <div class="dashboard-container">
    <h1>欢迎来到翔珑ERP系统</h1>
    <p>这里是您的系统仪表盘，将展示关键指标和快速入口。</p>
    <!-- TODO: Add charts, summaries, quick links based on README features -->
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card shadow="hover">
          <div slot="header"><span>销售订单</span></div>
          <div>今日新增: XX</div>
          <div>待处理: XX</div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <div slot="header"><span>采购订单</span></div>
          <div>今日新增: XX</div>
          <div>待收货: XX</div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <div slot="header"><span>库存预警</span></div>
          <div>低库存配件: XX</div>
          <div>积压产品: XX</div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  data() {
    return {
      // Data for dashboard summaries
    };
  },
  created() {
    // Fetch dashboard data
  }
};
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
}
.el-card {
  margin-bottom: 20px;
}
</style> 