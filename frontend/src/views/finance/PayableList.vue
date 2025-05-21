<template>
  <div class="payable-list-container">
    <h2>应付账款列表</h2>
    <!-- TODO: Filters, actions like create payment -->
    <el-table :data="payables" border style="width: 100%">
      <el-table-column prop="supplier_name" label="供应商名称"></el-table-column>
      <el-table-column prop="invoice_no" label="发票号"></el-table-column>
      <el-table-column prop="original_amount" label="原始金额"></el-table-column>
      <el-table-column prop="remaining_amount" label="剩余金额"></el-table-column>
      <el-table-column prop="due_date" label="到期日"></el-table-column>
      <el-table-column prop="ap_status" label="状态">
        <template slot-scope="scope">
          {{ getStatusText(scope.row.ap_status) }}
        </template>
      </el-table-column>
      <!-- TODO: Add actions like view invoice, record payment -->
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'PayableList',
  data() {
    return {
      payables: []
    };
  },
  created() {
    this.fetchPayables();
  },
  methods: {
    fetchPayables() {
      // TODO: API Call
      this.payables = [
        { ap_id: 1, supplier_name: '供应商A', invoice_no: 'SINV2023001', original_amount: 2000, remaining_amount: 1000, due_date: '2023-02-20', ap_status: 2 },
        { ap_id: 2, supplier_name: '供应商B', invoice_no: 'SINV2023002', original_amount: 800, remaining_amount: 800, due_date: '2023-02-25', ap_status: 1 },
      ];
    },
    getStatusText(status) {
      const map = { 1: '未付款', 2: '部分付款', 3: '全部付款' };
      return map[status] || '未知';
    }
  }
};
</script>

<style scoped>
.payable-list-container {
  padding: 20px;
}
</style> 