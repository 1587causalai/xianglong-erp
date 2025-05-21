<template>
  <div class="report-dashboard-container">
    <h2>报表中心</h2>
    <p>此处将集成各类业务报表，例如：</p>
    <ul>
      <li>销售分析报表 (按客户、产品、时间等维度)</li>
      <li>采购分析报表</li>
      <li>库存状态报表 (库龄、周转率等)</li>
      <li>财务状况报表 (应收账龄、应付账龄等)</li>
      <li>已发货未开票视图 (view_delivered_not_invoiced)</li>
      <li>已到货未开票视图 (view_received_not_invoiced)</li>
    </ul>
    <!-- TODO: Implement specific reports or embed a reporting tool/charts -->
    <el-alert
      title="报表功能待开发"
      type="info"
      description="详细的报表功能将在此处实现，敬请期待。"
      show-icon>
    </el-alert>
  </div>
</template>

<script>
export default {
  name: 'ReportDashboard'
};
</script>

<style scoped>
.report-dashboard-container {
  padding: 20px;
}
ul {
    line-height: 1.8;
}
</style> 