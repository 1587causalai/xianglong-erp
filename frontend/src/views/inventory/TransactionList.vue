<template>
  <div class="transaction-list-container">
    <h2>库存事务列表</h2>
    <!-- TODO: Add filters, and buttons for new transactions (StockIn, StockOut, Adjustment) -->
    <el-table :data="transactions" border style="width: 100%">
      <el-table-column prop="transaction_no" label="事务编号"></el-table-column>
      <el-table-column prop="transaction_type" label="事务类型">
        <template slot-scope="scope">
          {{ getTransactionTypeText(scope.row.transaction_type) }}
        </template>
      </el-table-column>
      <el-table-column prop="transaction_date" label="事务日期"></el-table-column>
      <el-table-column prop="reference_no" label="参考单号"></el-table-column>
      <el-table-column prop="warehouse_name" label="仓库"></el-table-column>
      <el-table-column prop="created_by" label="创建人"></el-table-column>
      <el-table-column prop="transaction_status" label="状态">
         <template slot-scope="scope">
          <el-tag :type="scope.row.transaction_status === 1 ? 'success' : 'info'">
            {{ scope.row.transaction_status === 1 ? '已确认' : '草稿' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleView(scope.row)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'TransactionList',
  data() {
    return {
      transactions: []
    };
  },
  created() {
    this.fetchTransactions();
  },
  methods: {
    fetchTransactions() {
      // TODO: API Call
      this.transactions = [
        { transaction_id: 1, transaction_no: 'TRN2023001', transaction_type: 1, transaction_date: '2023-01-20', reference_no: 'PO2023001', warehouse_name: '主仓库', created_by: 'admin', transaction_status: 1},
        { transaction_id: 2, transaction_no: 'TRN2023002', transaction_type: 2, transaction_date: '2023-02-01', reference_no: 'SO2023001', warehouse_name: '主仓库', created_by: 'admin', transaction_status: 1}
      ];
    },
    getTransactionTypeText(type) {
      const typeMap = { 1: '采购入库', 2: '销售出库', 3: '生产领料', 4: '成品入库', 5: '库存调整', 6: '盘点调整' };
      return typeMap[type] || '未知类型';
    },
    handleView(row) {
      // TODO: Navigate to a transaction detail view or show a dialog with items
      console.log('View transaction details:', row);
    }
    // TODO: Add methods to navigate to StockInForm, StockOutForm, AdjustmentForm
  }
};
</script>

<style scoped>
.transaction-list-container {
  padding: 20px;
}
</style> 