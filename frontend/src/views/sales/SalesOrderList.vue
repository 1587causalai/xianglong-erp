<template>
  <div class="sales-order-list-container">
    <h2>销售订单列表</h2>
    <el-button type="primary" @click="handleAddOrder" style="margin-bottom: 20px;">新增销售订单</el-button>
    <el-table :data="orders" border style="width: 100%">
      <el-table-column prop="order_no" label="订单编号"></el-table-column>
      <el-table-column prop="customer_name" label="客户名称"></el-table-column>
      <el-table-column prop="order_date" label="订单日期"></el-table-column>
      <el-table-column prop="delivery_date" label="交付日期"></el-table-column>
      <el-table-column prop="total_amount" label="总金额"></el-table-column>
      <el-table-column prop="order_status" label="订单状态">
        <template slot-scope="scope">
          <!-- TODO: Map status codes to text -->
          <el-tag>{{ getStatusText(scope.row.order_status) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleView(scope.row)">查看</el-button>
          <el-button size="mini" @click="handleEdit(scope.row)" :disabled="scope.row.order_status > 1">编辑</el-button> <!-- Example: Disable edit after confirm -->
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)" :disabled="scope.row.order_status > 1">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'SalesOrderList',
  data() {
    return {
      orders: []
    };
  },
  created() {
    this.fetchOrders();
  },
  methods: {
    fetchOrders() {
      // TODO: API call
      this.orders = [
        { sales_order_id: 1, order_no: 'SO2023001', customer_name: '客户甲', order_date: '2023-01-10', delivery_date: '2023-02-01', total_amount: 5000, order_status: 1 },
        { sales_order_id: 2, order_no: 'SO2023002', customer_name: '客户乙', order_date: '2023-01-15', delivery_date: '2023-02-10', total_amount: 12000, order_status: 3 },
      ];
    },
    getStatusText(status) {
      const statusMap = { 0: '草稿', 1: '确认', 2: '部分发货', 3: '全部发货', 4: '完成', 5: '取消' };
      return statusMap[status] || '未知';
    },
    handleAddOrder() {
      this.$router.push({ name: 'SalesOrderForm', params: { id: 'new' } });
    },
    handleView(row) {
      this.$router.push({ name: 'SalesOrderDetail', params: { id: row.sales_order_id } });
    },
    handleEdit(row) {
      this.$router.push({ name: 'SalesOrderForm', params: { id: row.sales_order_id } });
    },
    handleDelete(row) {
      console.log('Delete sales order', row);
      this.$confirm('确认删除此销售订单吗?', '提示', { type: 'warning' })
        .then(() => { /* TODO: API call */ this.$message.success('删除成功'); this.fetchOrders(); })
        .catch(() => this.$message.info('已取消删除'));
    }
  }
};
</script>

<style scoped>
.sales-order-list-container {
  padding: 20px;
}
</style> 