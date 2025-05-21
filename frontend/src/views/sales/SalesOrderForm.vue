<template>
  <div class="sales-order-form-container">
    <h2>{{ isEditMode ? '编辑销售订单' : '新增销售订单' }}</h2>
    <el-form :model="orderForm" ref="orderFormRef" label-width="100px">
      <el-form-item label="订单编号" prop="order_no">
        <el-input v-model="orderForm.order_no" :disabled="isEditMode"></el-input>
      </el-form-item>
      <el-form-item label="客户" prop="customer_id">
        <!-- TODO: Searchable select for customers -->
        <el-select v-model="orderForm.customer_id" placeholder="选择客户">
          <el-option label="客户甲" value="1"></el-option>
          <el-option label="客户乙" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="订单日期" prop="order_date">
        <el-date-picker v-model="orderForm.order_date" type="date" placeholder="选择日期"></el-date-picker>
      </el-form-item>
      <el-form-item label="交付日期" prop="delivery_date">
        <el-date-picker v-model="orderForm.delivery_date" type="date" placeholder="选择日期"></el-date-picker>
      </el-form-item>
      
      <h3>订单明细</h3>
      <el-table :data="orderForm.items" border style="margin-bottom:15px;">
        <el-table-column label="产品">
            <template slot-scope="scope">
                <!-- TODO: Searchable select for products -->
                <el-select v-model="scope.row.product_id" placeholder="选择产品">
                    <el-option label="示例产品A" value="1"></el-option>
                    <el-option label="示例产品B" value="2"></el-option>
                </el-select>
            </template>
        </el-table-column>
        <el-table-column label="数量">
            <template slot-scope="scope">
                <el-input-number v-model="scope.row.quantity" :min="1"></el-input-number>
            </template>
        </el-table-column>
        <el-table-column label="单价">
            <template slot-scope="scope">
                 <!-- TODO: Auto-fetch price or allow manual input -->
                <el-input-number v-model="scope.row.unit_price" :min="0" :precision="2"></el-input-number>
            </template>
        </el-table-column>
        <el-table-column label="金额">
            <template slot-scope="scope">
                {{ (scope.row.quantity * scope.row.unit_price) || 0 | toFixed(2) }}
            </template>
        </el-table-column>
        <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button size="mini" type="danger" @click="removeItem(scope.$index)">移除</el-button>
            </template>
        </el-table-column>
      </el-table>
      <el-button @click="addItem">添加产品</el-button>
      
      <el-form-item label="总金额" style="margin-top:15px;">
          <el-input v-model="totalAmountDisplay" readonly></el-input>
      </el-form-item>

      <el-form-item label="备注" prop="order_remark">
        <el-input type="textarea" v-model="orderForm.order_remark"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">保存</el-button>
        <el-button @click="goBack">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SalesOrderForm',
  data() {
    return {
      isEditMode: false,
      orderForm: {
        order_no: '',
        customer_id: null,
        order_date: new Date(),
        delivery_date: null,
        order_status: 0, // Draft by default
        total_amount: 0,
        order_remark: '',
        items: []
      }
    };
  },
  computed: {
    totalAmountDisplay() {
      return this.orderForm.items.reduce((sum, item) => sum + (item.quantity * item.unit_price || 0), 0).toFixed(2);
    }
  },
  created() {
    const orderId = this.$route.params.id;
    if (orderId && orderId !== 'new') {
      this.isEditMode = true;
      this.fetchOrderDetails(orderId);
    } else {
        this.addItem(); // Add one item line by default for new order
    }
  },
  methods: {
    fetchOrderDetails(orderId) {
      // TODO: API call
      console.log('Fetching sales order:', orderId);
      this.orderForm = {
        sales_order_id: orderId,
        order_no: 'SO2023001',
        customer_id: '1',
        order_date: '2023-01-10',
        delivery_date: '2023-02-01',
        order_status: 1,
        total_amount: 5000,
        order_remark: '加急订单',
        items: [
          { order_item_id: 1, product_id: '1', quantity: 50, unit_price: 100 },
        ]
      };
    },
    addItem() {
      this.orderForm.items.push({ product_id: null, quantity: 1, unit_price: 0 });
    },
    removeItem(index) {
      this.orderForm.items.splice(index, 1);
    },
    submitForm() {
      // TODO: Validate and API call
      this.orderForm.total_amount = parseFloat(this.totalAmountDisplay);
      console.log('Submitting sales order:', this.orderForm);
      this.$message.success('订单保存成功!');
      this.goBack();
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
.sales-order-form-container {
  padding: 20px;
}
</style> 