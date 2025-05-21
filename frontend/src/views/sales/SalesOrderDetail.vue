<template>
  <div class="sales-order-detail-container">
    <h2>销售订单详情 - {{ order.order_no }}</h2>
    <el-descriptions :column="2" border>
      <el-descriptions-item label="客户名称">{{ order.customer_name }}</el-descriptions-item>
      <el-descriptions-item label="订单日期">{{ order.order_date }}</el-descriptions-item>
      <el-descriptions-item label="交付日期">{{ order.delivery_date }}</el-descriptions-item>
      <el-descriptions-item label="订单状态">
        <el-tag>{{ getStatusText(order.order_status) }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="总金额">{{ order.total_amount | toFixed(2) }}</el-descriptions-item>
      <el-descriptions-item label="备注">{{ order.order_remark }}</el-descriptions-item>
    </el-descriptions>

    <h3>订单明细</h3>
    <el-table :data="order.items" border style="width: 100%; margin-top:15px;">
      <el-table-column prop="product_name" label="产品名称"></el-table-column>
      <el-table-column prop="product_code" label="产品编码"></el-table-column>
      <el-table-column prop="quantity" label="数量"></el-table-column>
      <el-table-column prop="unit_price" label="单价"></el-table-column>
      <el-table-column prop="line_amount" label="金额">
        <template slot-scope="scope">
          {{ (scope.row.quantity * scope.row.unit_price) | toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column prop="delivered_quantity" label="已发货数量"></el-table-column>
    </el-table>

    <!-- TODO: Add sections for related shipments, invoices, payments based on README -->
    <div style="margin-top: 20px;">
        <el-button @click="goBack">返回列表</el-button>
        <!-- Add other actions like print, create shipment etc. -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'SalesOrderDetail',
  data() {
    return {
      order: {
        items: [] // Ensure items is initialized
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
      console.log('Fetching sales order details for:', orderId);
      this.order = {
        sales_order_id: orderId,
        order_no: 'SO2023001',
        customer_name: '客户甲',
        customer_id: '1',
        order_date: '2023-01-10',
        delivery_date: '2023-02-01',
        order_status: 3,
        total_amount: 5000,
        order_remark: '加急订单',
        items: [
          { order_item_id: 1, product_id: '1', product_name:'示例产品A', product_code:'P001', quantity: 50, unit_price: 100, delivered_quantity: 50 },
        ]
        // TODO: Add related shipment/invoice data if needed for display
      };
    },
    getStatusText(status) {
      const statusMap = { 0: '草稿', 1: '确认', 2: '部分发货', 3: '全部发货', 4: '完成', 5: '取消' };
      return statusMap[status] || '未知';
    },
    goBack() {
      this.$router.push({ name: 'SalesOrderList' });
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
.sales-order-detail-container {
  padding: 20px;
}
.el-descriptions {
    margin-top: 15px;
}
</style> 