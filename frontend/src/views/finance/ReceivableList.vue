<template>
  <div class="receivable-list-container">
    <h2>应收账款列表</h2>
    <!-- TODO: Filters, actions like create receipt -->
    <el-table :data="receivables" border style="width: 100%">
      <el-table-column prop="customer_name" label="客户名称"></el-table-column>
      <el-table-column prop="invoice_no" label="发票号"></el-table-column>
      <el-table-column prop="original_amount" label="原始金额"></el-table-column>
      <el-table-column prop="remaining_amount" label="剩余金额"></el-table-column>
      <el-table-column prop="due_date" label="到期日"></el-table-column>
      <el-table-column prop="ar_status" label="状态">
        <template slot-scope="scope">
          {{ getStatusText(scope.row.ar_status) }}
        </template>
      </el-table-column>
      <!-- TODO: Add actions like view invoice, record payment -->
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'ReceivableList',
  data() {
    return {
      receivables: []
    };
  },
  created() {
    this.fetchReceivables();
  },
  methods: {
    fetchReceivables() {
      // TODO: API Call
      this.receivables = [
        { ar_id: 1, customer_name: '客户甲', invoice_no: 'INV2023001', original_amount: 5000, remaining_amount: 2000, due_date: '2023-03-01', ar_status: 2 },
        { ar_id: 2, customer_name: '客户乙', invoice_no: 'INV2023002', original_amount: 12000, remaining_amount: 12000, due_date: '2023-03-10', ar_status: 1 },
      ];
    },
    getStatusText(status) {
      const map = { 1: '未收款', 2: '部分收款', 3: '全部收款' };
      return map[status] || '未知';
    }
  }
};
</script>

<style scoped>
.receivable-list-container {
  padding: 20px;
}
</style> 