<template>
  <div class="in-transit-list-container">
    <h2>在途库存列表</h2>
    <!-- TODO: Add filters -->
    <el-table :data="inTransitItems" border style="width: 100%">
      <el-table-column prop="component_code" label="配件编码"></el-table-column>
      <el-table-column prop="component_name" label="配件名称"></el-table-column>
      <el-table-column prop="supplier_name" label="供应商"></el-table-column>
      <el-table-column prop="purchase_order_no" label="采购单号"></el-table-column>
      <el-table-column prop="expected_quantity" label="预期数量"></el-table-column>
      <el-table-column prop="received_quantity" label="已收货数量"></el-table-column>
      <el-table-column prop="remaining_quantity" label="剩余在途"></el-table-column>
      <el-table-column prop="expected_date" label="预计到货日"></el-table-column>
      <el-table-column prop="transit_status_name" label="状态"></el-table-column>
    </el-table>
    <!-- TODO: Add pagination -->
  </div>
</template>

<script>
// TODO: Import API service for in-transit inventory
export default {
  name: 'InTransitList',
  data() {
    return {
      inTransitItems: [] // Populate with API data from view_inventory_in_transit
    };
  },
  created() {
    this.fetchInTransitItems();
  },
  methods: {
    fetchInTransitItems() {
      // TODO: Call API to get in-transit items
      // Example from view_inventory_in_transit:
      this.inTransitItems = [
        { component_code: 'C001', component_name: '示例配件X', supplier_name: '供应商A', purchase_order_no: 'PO2023001', expected_quantity: 200, received_quantity: 100, remaining_quantity: 100, expected_date: '2023-01-20', transit_status_name: '部分到货' },
        { component_code: 'C002', component_name: '示例配件Y', supplier_name: '供应商B', purchase_order_no: 'PO2023002', expected_quantity: 50, received_quantity: 0, remaining_quantity: 50, expected_date: '2023-01-25', transit_status_name: '在途' }
      ];
    }
  }
};
</script>

<style scoped>
.in-transit-list-container {
  padding: 20px;
}
</style> 