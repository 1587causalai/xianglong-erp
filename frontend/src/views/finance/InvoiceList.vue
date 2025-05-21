<template>
  <div class="invoice-list-container">
    <h2>发票列表</h2>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="应收发票" name="receivable">
        <el-table :data="receivableInvoices" border style="width: 100%">
          <el-table-column prop="invoice_no" label="发票编号"></el-table-column>
          <el-table-column prop="customer_name" label="客户"></el-table-column>
          <el-table-column prop="invoice_date" label="发票日期"></el-table-column>
          <el-table-column prop="total_amount" label="总金额"></el-table-column>
          <el-table-column prop="invoice_status" label="状态">
            <template slot-scope="scope">{{ getReceivableStatusText(scope.row.invoice_status) }}</template>
          </el-table-column>
          <!-- TODO: Actions -->
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="应付发票" name="payable">
        <el-table :data="payableInvoices" border style="width: 100%">
          <el-table-column prop="invoice_no" label="发票编号"></el-table-column>
          <el-table-column prop="supplier_name" label="供应商"></el-table-column>
          <el-table-column prop="invoice_date" label="发票日期"></el-table-column>
          <el-table-column prop="total_amount" label="总金额"></el-table-column>
          <el-table-column prop="invoice_status" label="状态">
            <template slot-scope="scope">{{ getPayableStatusText(scope.row.invoice_status) }}</template>
          </el-table-column>
          <!-- TODO: Actions -->
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <!-- TODO: Add buttons to create new invoices -->
  </div>
</template>

<script>
export default {
  name: 'InvoiceList',
  data() {
    return {
      activeTab: 'receivable',
      receivableInvoices: [],
      payableInvoices: []
    };
  },
  created() {
    this.fetchReceivableInvoices();
    this.fetchPayableInvoices();
  },
  methods: {
    fetchReceivableInvoices() {
      // TODO: API Call
      this.receivableInvoices = [
        { invoice_id: 1, invoice_no: 'INV2023001', customer_name: '客户甲', sales_order_id: 1, invoice_date: '2023-02-15', total_amount: 5000, invoice_status: 2 }
      ];
    },
    fetchPayableInvoices() {
      // TODO: API Call
      this.payableInvoices = [
        { invoice_id: 101, invoice_no: 'SINV2023001', supplier_name: '供应商A', purchase_order_id: 1, invoice_date: '2023-01-25', total_amount: 2000, invoice_status: 3 }
      ];
    },
    getReceivableStatusText(status) {
      const map = { 0: '草稿', 1: '已确认', 2: '部分收款', 3: '全部收款' };
      return map[status] || '未知';
    },
    getPayableStatusText(status) {
      const map = { 0: '草稿', 1: '已确认', 2: '部分付款', 3: '全部付款' };
      return map[status] || '未知';
    }
  }
};
</script>

<style scoped>
.invoice-list-container {
  padding: 20px;
}
</style> 