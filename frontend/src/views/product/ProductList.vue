<template>
  <div class="product-list-container">
    <h2>产品列表</h2>
    <!-- TODO: Add search, filter, add button -->
    <el-button type="primary" @click="handleAddProduct" style="margin-bottom: 20px;">新增产品</el-button>
    <el-table :data="products" border style="width: 100%">
      <el-table-column prop="product_code" label="产品编码"></el-table-column>
      <el-table-column prop="product_name" label="产品名称"></el-table-column>
      <el-table-column prop="product_spec" label="规格"></el-table-column>
      <el-table-column prop="product_category" label="类别"></el-table-column>
      <el-table-column prop="product_price" label="售价"></el-table-column>
      <el-table-column prop="product_status" label="状态">
        <template slot-scope="scope">
          <el-tag :type="scope.row.product_status === 1 ? 'success' : 'danger'">
            {{ scope.row.product_status === 1 ? '启用' : '禁用' }}
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
// TODO: Import API service for products
export default {
  name: 'ProductList',
  data() {
    return {
      products: [] // Populate with API data
    };
  },
  created() {
    this.fetchProducts();
  },
  methods: {
    fetchProducts() {
      // TODO: Call API to get products
      // Example data:
      this.products = [
        { product_id: 1, product_code: 'P001', product_name: '示例产品A', product_spec: '型号X', product_category: '类别1', product_price: 100, product_status: 1 },
        { product_id: 2, product_code: 'P002', product_name: '示例产品B', product_spec: '型号Y', product_category: '类别2', product_price: 150, product_status: 0 },
      ];
    },
    handleAddProduct() {
      // TODO: Navigate to product form or open dialog
      console.log('Navigate to add product form');
    },
    handleEdit(row) {
      // TODO: Navigate to product form with row.product_id or open dialog
      console.log('Edit product:', row);
    },
    handleDelete(row) {
      // TODO: Confirm and call API to delete product
      console.log('Delete product:', row);
      this.$confirm('此操作将永久删除该产品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // Call delete API
        this.$message({ type: 'success', message: '删除成功!'});
      }).catch(() => {
        this.$message({ type: 'info', message: '已取消删除' });
      });
    }
  }
};
</script>

<style scoped>
.product-list-container {
  padding: 20px;
}
</style> 