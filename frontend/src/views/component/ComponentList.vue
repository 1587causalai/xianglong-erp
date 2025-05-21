<template>
  <div class="component-list-container">
    <h2>配件列表</h2>
    <el-button type="primary" @click="handleAddComponent" style="margin-bottom: 20px;">新增配件</el-button>
    <el-table :data="components" border style="width: 100%">
      <el-table-column prop="component_code" label="配件编码"></el-table-column>
      <el-table-column prop="component_name" label="配件名称"></el-table-column>
      <el-table-column prop="component_spec" label="规格"></el-table-column>
      <el-table-column prop="component_category" label="类别"></el-table-column>
      <el-table-column prop="component_price" label="采购价"></el-table-column>
      <el-table-column prop="min_stock" label="最小库存"></el-table-column>
      <el-table-column prop="component_status" label="状态">
        <template slot-scope="scope">
          <el-tag :type="scope.row.component_status === 1 ? 'success' : 'danger'">
            {{ scope.row.component_status === 1 ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- TODO: Add pagination -->
  </div>
</template>

<script>
// TODO: Import API service for components
export default {
  name: 'ComponentList',
  data() {
    return {
      components: [] // Populate with API data
    };
  },
  created() {
    this.fetchComponents();
  },
  methods: {
    fetchComponents() {
      // TODO: Call API to get components
      // Example data:
      this.components = [
        { component_id: 1, component_code: 'C001', component_name: '示例配件X', component_spec: '规格A', component_category: '原料', component_price: 10, min_stock:50, component_status: 1 },
        { component_id: 2, component_code: 'C002', component_name: '示例配件Y', component_spec: '规格B', component_category: '辅料', component_price: 5, min_stock:100, component_status: 1 },
      ];
    },
    handleAddComponent() {
      // TODO: Navigate to component form or open dialog
      console.log('Navigate to add component form');
    },
    handleEdit(row) {
      // TODO: Navigate to component form with row.component_id or open dialog
      console.log('Edit component:', row);
    },
    handleDelete(row) {
      // TODO: Confirm and call API to delete component
      console.log('Delete component:', row);
      this.$confirm('此操作将永久删除该配件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({ type: 'success', message: '删除成功!'});
      }).catch(() => {
        this.$message({ type: 'info', message: '已取消删除' });
      });
    }
  }
};
</script>

<style scoped>
.component-list-container {
  padding: 20px;
}
</style> 