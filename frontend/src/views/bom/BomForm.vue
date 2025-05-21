<template>
  <div class="bom-form-container">
    <h2>{{ isEditMode ? '编辑BOM' : (isViewMode ? '查看BOM' : '新增BOM') }}</h2>
    <el-form :model="bomForm" ref="bomFormRef" label-width="120px" :disabled="isViewMode">
      <el-form-item label="成品" prop="product_id">
        <!-- TODO: Use a searchable select for products -->
        <el-select v-model="bomForm.product_id" placeholder="请选择成品">
          <el-option label="示例产品A (P001)" value="1"></el-option>
          <el-option label="示例产品B (P002)" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="BOM版本" prop="bom_version">
        <el-input v-model="bomForm.bom_version" placeholder="例如：V1.0"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="bom_status">
        <el-switch v-model="bomForm.bom_status" :active-value="1" :inactive-value="0" active-text="启用" inactive-text="禁用"></el-switch>
      </el-form-item>
      <el-form-item label="备注" prop="bom_remark">
        <el-input type="textarea" v-model="bomForm.bom_remark"></el-input>
      </el-form-item>

      <h3>BOM明细</h3>
      <el-table :data="bomForm.details" border style="margin-bottom: 20px;">
        <el-table-column label="配件编码">
          <template slot-scope="scope">
            <!-- TODO: Searchable select for components -->
            <el-select v-model="scope.row.component_id" placeholder="选择配件" :disabled="isViewMode">
               <el-option label="示例配件X (C001)" value="1"></el-option>
               <el-option label="示例配件Y (C002)" value="2"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="用量">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.quantity" :min="0.001" :precision="3" :disabled="isViewMode"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="备注">
          <template slot-scope="scope">
            <el-input v-model="scope.row.bom_detail_remark" :disabled="isViewMode"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" v-if="!isViewMode">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click="removeDetailItem(scope.$index)">移除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary" @click="addDetailItem" v-if="!isViewMode">添加明细项</el-button>

      <el-form-item style="margin-top: 20px;" v-if="!isViewMode">
        <el-button type="primary" @click="submitForm">保存</el-button>
        <el-button @click="goBack">取消</el-button>
      </el-form-item>
      <el-form-item style="margin-top: 20px;" v-if="isViewMode">
        <el-button @click="goBack">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// TODO: Import API service for BOMs, products, components
export default {
  name: 'BomForm',
  data() {
    return {
      isEditMode: false,
      isViewMode: false,
      bomForm: {
        product_id: null,
        bom_version: '',
        bom_status: 1,
        bom_remark: '',
        details: []
      },
      // TODO: rules for validation
    };
  },
  created() {
    const bomId = this.$route.params.id;
    this.isViewMode = this.$route.query.view === 'true';

    if (this.$route.name === 'CreateBOM') {
      this.isEditMode = false;
      // For new BOM, viewMode doesn't make sense, ensure it's editable.
      this.isViewMode = false; 
      this.addDetailItem(); 
    } else if (this.$route.name === 'EditBOM' && bomId) {
      this.isEditMode = true; // isViewMode is already set from query param
      this.fetchBomDetails(bomId);
      console.log(`BomForm loaded for ${this.isViewMode ? 'viewing' : 'editing'} BOM ID:`, bomId);
    } else {
      console.error("BomForm loaded with unexpected route state:", this.$route.name, this.$route.params);
      // Potentially redirect or show an error message to the user
      this.$message.error('无法加载BOM表单，路由状态不正确。');
      this.goBack(); // Go back to list if state is invalid
    }
  },
  methods: {
    fetchBomDetails(bomId) {
      console.log('Fetch BOM details for:', bomId);
      // TODO: Replace with actual API call
      // Simulating API call with example data based on isEditMode/isViewMode
      this.bomForm = {
        bom_id: bomId,
        product_id: '1', 
        bom_version: 'V1.0',
        bom_status: 1,
        bom_remark: this.isViewMode ? '查看模式BOM备注' : '编辑模式BOM备注',
        details: [
          { bom_detail_id: 1, component_id: '1', quantity: 2, bom_detail_remark: '主要部件' },
          { bom_detail_id: 2, component_id: '2', quantity: 5, bom_detail_remark: '辅助材料' },
        ]
      };
    },
    addDetailItem() {
      if (this.isViewMode) return; // Don't add items in view mode
      this.bomForm.details.push({
        component_id: null,
        quantity: 1,
        bom_detail_remark: ''
      });
    },
    removeDetailItem(index) {
      if (this.isViewMode) return; // Don't remove items in view mode
      this.bomForm.details.splice(index, 1);
    },
    submitForm() {
      if (this.isViewMode) return; // Don't submit in view mode
      this.$refs.bomFormRef.validate(valid => {
        if (valid) {
          console.log('Submitting BOM:', this.bomForm);
          // TODO: Call API to save/update BOM (differentiate create vs update by bomForm.bom_id or isEditMode)
          this.$message.success('BOM保存成功!');
          this.goBack();
        } else {
          this.$message.error('请检查表单输入!');
          return false;
        }
      });
    },
    goBack() {
      this.$router.push({ name: 'BOM' }); // Route name for BomList is 'BOM'
    }
  }
};
</script>

<style scoped>
.bom-form-container {
  padding: 20px;
}
</style> 