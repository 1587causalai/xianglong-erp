<template>
  <div class="bom-list-container">
    <h2>BOM列表</h2>
    <el-button type="primary" @click="handleAddBom" style="margin-bottom: 20px;">新增BOM</el-button>
    <el-table :data="boms" border style="width: 100%">
      <el-table-column prop="product_name" label="成品名称"></el-table-column>
      <el-table-column prop="bom_version" label="BOM版本"></el-table-column>
      <el-table-column prop="bom_status" label="状态">
        <template slot-scope="scope">
          <el-tag :type="scope.row.bom_status === 1 ? 'success' : 'danger'">
            {{ scope.row.bom_status === 1 ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="创建日期"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleView(scope.row)">查看</el-button>
          <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- TODO: Add pagination -->
  </div>
</template>

<script>
// TODO: Import API service for BOMs
export default {
  name: 'BomList',
  data() {
    return {
      boms: [] // Populate with API data
    };
  },
  created() {
    this.fetchBoms();
  },
  methods: {
    fetchBoms() {
      // TODO: Call API to get BOMs
      // Example data:
      this.boms = [
        { bom_id: 1, product_name: '示例产品A', product_id: 1, bom_version: 'V1.0', bom_status: 1, created_at: '2023-01-01' },
        { bom_id: 2, product_name: '示例产品B', product_id: 2, bom_version: 'V1.1', bom_status: 0, created_at: '2023-01-05' },
      ];
    },
    handleAddBom() {
      this.$router.push({ name: 'BomForm', params: { id: 'new' } }); // Assuming you have a route named BomForm
    },
    handleView(row) {
      // TODO: Navigate to BOM detail view or open dialog
      console.log('View BOM:', row);
      this.$router.push({ name: 'BomForm', params: { id: row.bom_id }, query: { view: 'true' } });
    },
    handleEdit(row) {
      this.$router.push({ name: 'BomForm', params: { id: row.bom_id } });
    },
    handleDelete(row) {
      // TODO: Confirm and call API to delete BOM
      console.log('Delete BOM:', row);
        this.$confirm('此操作将永久删除该BOM, 是否继续?', '提示', {
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
.bom-list-container {
  padding: 20px;
}
</style> 