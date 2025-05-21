<template>
  <div class="purchase-order-list-container">
    <h2>采购订单列表</h2>
    <el-button type="primary" @click="handleAddOrder" style="margin-bottom: 20px;">新增采购订单</el-button>
    <el-table :data="orders" border style="width: 100%">
      <el-table-column prop="order_no" label="订单编号"></el-table-column>
      <el-table-column prop="supplier_name" label="供应商名称"></el-table-column>
      <el-table-column prop="order_date" label="订单日期"></el-table-column>
      <el-table-column prop="expected_date" label="预计到货日"></el-table-column>
      <el-table-column prop="total_amount" label="总金额"></el-table-column>
      <el-table-column prop="order_status" label="订单状态">
        <template slot-scope="scope">
          <el-tag>{{ getStatusText(scope.row.order_status) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleView(scope.row)">查看</el-button>
          <el-button size="mini" @click="handleEdit(scope.row)" :disabled="scope.row.order_status > 1">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)" :disabled="scope.row.order_status > 1">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'PurchaseOrderList',
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
        { purchase_order_id: 1, order_no: 'PO2023001', supplier_name: '供应商A', order_date: '2023-01-05', expected_date: '2023-01-20', total_amount: 2000, order_status: 1 },
        { purchase_order_id: 2, order_no: 'PO2023002', supplier_name: '供应商B', order_date: '2023-01-10', expected_date: '2023-01-25', total_amount: 800, order_status: 3 },
      ];
    },
    getStatusText(status) {
      const statusMap = { 0: '草稿', 1: '已发送', 2: '部分到货', 3: '全部到货', 4: '完成', 5: '取消' };
      return statusMap[status] || '未知';
    },
    handleAddOrder() {
      this.$router.push({ name: 'PurchaseOrderForm', params: { id: 'new' } });
    },
    handleView(row) {
      this.$router.push({ name: 'PurchaseOrderDetail', params: { id: row.purchase_order_id } });
    },
    handleEdit(row) {
      this.$router.push({ name: 'PurchaseOrderForm', params: { id: row.purchase_order_id } });
    },
    handleDelete(row) {
      console.log('Delete purchase order', row);
      this.$confirm('确认删除此采购订单吗?', '提示', { type: 'warning' })
        .then(() => { /* TODO: API call */ this.$message.success('删除成功'); this.fetchOrders(); })
        .catch(() => this.$message.info('已取消删除'));
    }
  }
};
</script>

<style scoped>
.purchase-order-list-container {
  padding: 20px;
}
</style> 