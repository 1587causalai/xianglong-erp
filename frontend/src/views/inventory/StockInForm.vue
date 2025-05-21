<template>
  <div class="stock-in-form-container">
    <h2>创建入库单</h2>
    <el-form :model="stockInForm" ref="stockInFormRef" label-width="120px">
      <el-form-item label="事务编号" prop="transaction_no">
        <el-input v-model="stockInForm.transaction_no" placeholder="系统自动生成或手动输入"></el-input>
      </el-form-item>
      <el-form-item label="事务类型" prop="transaction_type">
         <el-select v-model="stockInForm.transaction_type" placeholder="选择入库类型">
          <el-option label="采购入库" :value="1"></el-option>
          <el-option label="成品入库" :value="4"></el-option>
          <!-- Other types like return etc. -->
        </el-select>
      </el-form-item>
      <el-form-item label="事务日期" prop="transaction_date">
        <el-date-picker v-model="stockInForm.transaction_date" type="datetime" placeholder="选择日期时间"></el-date-picker>
      </el-form-item>
      <el-form-item label="参考单号" prop="reference_no">
        <el-input v-model="stockInForm.reference_no" placeholder="采购单号/生产单号等"></el-input>
      </el-form-item>
      <el-form-item label="仓库" prop="warehouse_id">
        <!-- TODO: Select for warehouses -->
        <el-select v-model="stockInForm.warehouse_id" placeholder="选择仓库">
            <el-option label="主仓库" value="1"></el-option>
        </el-select>
      </el-form-item>

      <h3>入库明细</h3>
      <el-table :data="stockInForm.details" border style="margin-bottom: 15px;">
        <el-table-column label="物料类型">
            <template slot-scope="scope">
                <el-select v-model="scope.row.item_type" placeholder="类型">
                    <el-option label="产品" :value="1"></el-option>
                    <el-option label="配件" :value="2"></el-option>
                </el-select>
            </template>
        </el-table-column>
        <el-table-column label="物料编码/名称">
            <template slot-scope="scope">
                <!-- TODO: Searchable select for items based on item_type -->
                <el-select v-model="scope.row.item_id" placeholder="选择物料">
                    <el-option v-if="scope.row.item_type === 1" label="示例产品A (P001)" value="1"></el-option>
                    <el-option v-if="scope.row.item_type === 2" label="示例配件X (C001)" value="101"></el-option>
                </el-select>
            </template>
        </el-table-column>
        <el-table-column label="库位">
            <template slot-scope="scope">
                <!-- TODO: Select for locations based on warehouse -->
                <el-input v-model="scope.row.location_code_manual" placeholder="库位编码"></el-input> 
                <!-- <el-select v-model="scope.row.location_id" placeholder="选择库位"><el-option label="A-01" value="1"></el-option></el-select> -->
            </template>
        </el-table-column>
        <el-table-column label="数量">
            <template slot-scope="scope">
                <el-input-number v-model="scope.row.quantity" :min="0.001" :precision="3"></el-input-number>
            </template>
        </el-table-column>
        <el-table-column label="批次号">
            <template slot-scope="scope">
                <el-input v-model="scope.row.batch_no"></el-input>
            </template>
        </el-table-column>
        <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button size="mini" type="danger" @click="removeItem(scope.$index)">移除</el-button>
            </template>
        </el-table-column>
      </el-table>
      <el-button @click="addItem">添加入库项</el-button>

      <el-form-item label="备注" prop="transaction_remark" style="margin-top: 15px;">
        <el-input type="textarea" v-model="stockInForm.transaction_remark"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交入库单</el-button>
        <el-button @click="goBack">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'StockInForm',
  data() {
    return {
      stockInForm: {
        transaction_no: '',
        transaction_type: 1, // Default to 采购入库
        transaction_date: new Date(),
        reference_no: '',
        warehouse_id: null,
        transaction_remark: '',
        created_by: 'admin', // TODO: Get from current user
        details: []
      }
    };
  },
  created(){
      this.addItem();
  },
  methods: {
    addItem() {
      this.stockInForm.details.push({
        item_type: 2, // Default to component
        item_id: null,
        location_id: null, // Or use location_code_manual if not using select
        location_code_manual: '',
        quantity: 1,
        batch_no: ''
      });
    },
    removeItem(index) {
      this.stockInForm.details.splice(index, 1);
    },
    submitForm() {
      // TODO: Validate and API call
      console.log('Submitting Stock In form:', this.stockInForm);
      this.$message.success('入库单创建成功!');
      // this.goBack(); // Or navigate to transaction list/detail
    },
    goBack() {
      // TODO: Navigate to previous page or transaction list
      this.$router.push({ name: 'TransactionList' }); 
    }
  }
};
</script>

<style scoped>
.stock-in-form-container {
  padding: 20px;
}
</style> 