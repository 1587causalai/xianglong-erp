<template>
  <div class="inventory-list-container">
    <h2>库存总览</h2>
    <!-- TODO: Add filters for warehouse, item type, etc. -->
    <el-table :data="inventory" border style="width: 100%">
      <el-table-column prop="item_code" label="物料编码"></el-table-column>
      <el-table-column prop="item_name" label="物料名称"></el-table-column>
      <el-table-column prop="item_type_name" label="物料类型"></el-table-column>
      <el-table-column prop="warehouse_name" label="仓库"></el-table-column>
      <el-table-column prop="location_code" label="库位"></el-table-column>
      <el-table-column prop="quantity" label="当前数量"></el-table-column>
      <el-table-column prop="reserved_quantity" label="预留数量"></el-table-column>
      <el-table-column prop="available_quantity" label="可用数量"></el-table-column>
      <el-table-column prop="batch_no" label="批次号"></el-table-column>
      <el-table-column prop="last_transaction_date" label="最后事务日期"></el-table-column>
    </el-table>
    <!-- TODO: Add pagination -->
  </div>
</template>

<script>
// TODO: Import API service for inventory
export default {
  name: 'InventoryList',
  data() {
    return {
      inventory: [] // Populate with API data from view_inventory_summary
    };
  },
  created() {
    this.fetchInventory();
  },
  methods: {
    fetchInventory() {
      // TODO: Call API to get inventory summary
      // Example from view_inventory_summary:
      this.inventory = [
        { item_code: 'P001', item_name: '示例产品A', item_type_name: '成品', warehouse_name: '主仓库', location_code: 'A-01-01', quantity: 100, reserved_quantity: 10, available_quantity: 90, batch_no: 'B001', last_transaction_date: '2023-01-15' },
        { item_code: 'C001', item_name: '示例配件X', item_type_name: '配件', warehouse_name: '主仓库', location_code: 'C-02-03', quantity: 500, reserved_quantity: 50, available_quantity: 450, batch_no: null, last_transaction_date: '2023-01-20' }
      ];
    }
  }
};
</script>

<style scoped>
.inventory-list-container {
  padding: 20px;
}
</style> 