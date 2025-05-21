<template>
  <div class="purchase-order-detail-container">
    <h2>采购订单详情 - {{ order.order_no }}</h2>
    <el-descriptions :column="2" border>
      <el-descriptions-item label="供应商名称">{{ order.supplier_name }}</el-descriptions-item>
      <el-descriptions-item label="订单日期">{{ order.order_date }}</el-descriptions-item>
      <el-descriptions-item label="预计到货日">{{ order.expected_date }}</el-descriptions-item>
      <el-descriptions-item label="订单状态">
        <el-tag>{{ getStatusText(order.order_status) }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="总金额">{{ order.total_amount | toFixed(2) }}</el-descriptions-item>
      <el-descriptions-item label="备注">{{ order.order_remark }}</el-descriptions-item>
    </el-descriptions>

    <h3>订单明细 (配件)</h3>
    <el-table :data="order.items" border style="width: 100%; margin-top:15px;">
      <el-table-column prop="component_name" label="配件名称"></el-table-column>
      <el-table-column prop="component_code" label="配件编码"></el-table-column>
      <el-table-column prop="quantity" label="订单数量"></el-table-column>
      <el-table-column prop="unit_price" label="单价"></el-table-column>
      <el-table-column prop="line_amount" label="金额">
        <template slot-scope="scope">
          {{ (scope.row.quantity * scope.row.unit_price) | toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column prop="received_quantity" label="已收货数量"></el-table-column>
    </el-table>

    <!-- TODO: Add sections for related receipts, invoices based on README -->
    <div style="margin-top: 20px;">
        <el-button @click="goBack">返回列表</el-button>
        <!-- Add other actions like print, create receipt etc. -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'PurchaseOrderDetail',
  data() {
    return {
      order: {
        items: []
      }
    };
  },
  created() {
    const orderId = this.$route.params.id;
    if (orderId) {
      this.fetchOrderDetails(orderId);
    }
  },
  methods: {
    fetchOrderDetails(orderId) {
      // TODO: API call
      console.log('Fetching purchase order details for:', orderId);
      this.order = {
        purchase_order_id: orderId,
        order_no: 'PO2023001',
        supplier_name: '供应商A',
        supplier_id: '1',
        order_date: '2023-01-05',
        expected_date: '2023-01-20',
        order_status: 3,
        total_amount: 2000,
        order_remark: '常规采购',
        items: [
          { order_item_id: 1, component_id: '1', component_name: '示例配件X', component_code: 'C001', quantity: 200, unit_price: 10, received_quantity: 200 },
        ]
      };
    },
    getStatusText(status) {
      const statusMap = { 0: '草稿', 1: '已发送', 2: '部分到货', 3: '全部到货', 4: '完成', 5: '取消' };
      return statusMap[status] || '未知';
    },
    goBack() {
      this.$router.push({ name: 'PurchaseOrderList' });
    }
  },
  filters: {
    toFixed(value, count) {
        if (isNaN(parseFloat(value))) return '0.00';
        return parseFloat(value).toFixed(count || 2);
    }
  }
};
</script>

<style scoped>
.purchase-order-detail-container {
  padding: 20px;
}
.el-descriptions {
    margin-top: 15px;
}
</style> 