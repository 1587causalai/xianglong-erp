<template>
  <div class="adjustment-form-container">
    <h2>创建库存调整单</h2>
    <el-form :model="adjustmentForm" ref="adjustmentFormRef" label-width="120px">
      <el-form-item label="事务编号" prop="transaction_no">
        <el-input v-model="adjustmentForm.transaction_no" placeholder="系统自动生成或手动输入"></el-input>
      </el-form-item>
      <el-form-item label="事务类型" prop="transaction_type">
         <el-select v-model="adjustmentForm.transaction_type" placeholder="选择调整类型">
          <el-option label="库存调整" :value="5"></el-option>
          <el-option label="盘点调整" :value="6"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="事务日期" prop="transaction_date">
        <el-date-picker v-model="adjustmentForm.transaction_date" type="datetime" placeholder="选择日期时间"></el-date-picker>
      </el-form-item>
      <el-form-item label="仓库" prop="warehouse_id">
        <el-select v-model="adjustmentForm.warehouse_id" placeholder="选择仓库">
            <el-option label="主仓库" value="1"></el-option>
        </el-select>
      </el-form-item>

      <h3>调整明细</h3>
      <el-table :data="adjustmentForm.details" border style="margin-bottom: 15px;">
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
                <!-- TODO: Searchable select for items -->
                <el-select v-model="scope.row.item_id" placeholder="选择物料">
                     <el-option v-if="scope.row.item_type === 1" label="示例产品A (P001)" value="1"></el-option>
                    <el-option v-if="scope.row.item_type === 2" label="示例配件X (C001)" value="101"></el-option>
                </el-select>
            </template>
        </el-table-column>
        <el-table-column label="库位">
             <template slot-scope="scope">
                <el-input v-model="scope.row.location_code_manual" placeholder="库位编码"></el-input>
            </template>
        </el-table-column>
        <el-table-column label="调整数量">
            <template slot-scope="scope">
                <el-input-number v-model="scope.row.quantity" :precision="3" placeholder="正为增,负为减"></el-input-number>
            </template>
        </el-table-column>
        <el-table-column label="批次号">
            <template slot-scope="scope">
                <el-input v-model="scope.row.batch_no"></el-input>
            </template>
        </el-table-column>
        <el-table-column label="调整原因">
            <template slot-scope="scope">
                <el-input v-model="scope.row.detail_remark" placeholder="如盘盈、盘亏、损坏等"></el-input>
            </template>
        </el-table-column>
        <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button size="mini" type="danger" @click="removeItem(scope.$index)">移除</el-button>
            </template>
        </el-table-column>
      </el-table>
      <el-button @click="addItem">添加调整项</el-button>

      <el-form-item label="总体备注" prop="transaction_remark" style="margin-top: 15px;">
        <el-input type="textarea" v-model="adjustmentForm.transaction_remark"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交调整单</el-button>
        <el-button @click="goBack">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'AdjustmentForm',
  data() {
    return {
      adjustmentForm: {
        transaction_no: '',
        transaction_type: 5, // Default to 库存调整
        transaction_date: new Date(),
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
      this.adjustmentForm.details.push({
        item_type: 2,
        item_id: null,
        location_code_manual: '',
        quantity: 0,
        batch_no: '',
        detail_remark: ''
      });
    },
    removeItem(index) {
      this.adjustmentForm.details.splice(index, 1);
    },
    submitForm() {
      // TODO: Validate and API call
      console.log('Submitting Adjustment form:', this.adjustmentForm);
      this.$message.success('库存调整单创建成功!');
      // this.goBack();
    },
    goBack() {
      this.$router.push({ name: 'TransactionList' });
    }
  }
};
</script>

<style scoped>
.adjustment-form-container {
  padding: 20px;
}
</style> 