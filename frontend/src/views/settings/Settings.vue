<template>
  <div class="settings-container">
    <h2>系统设置</h2>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="基础设置" name="basic">
        <p>TODO: 基础数据管理，例如：</p>
        <ul>
            <li>客户管理 (列表/表单)</li>
            <li>供应商管理 (列表/表单)</li>
            <li>仓库与库位结构管理</li>
            <!-- These might be better as separate top-level menu items if complex -->
        </ul>
      </el-tab-pane>
      <el-tab-pane label="用户管理" name="users">
        <p>TODO: 用户列表，角色管理，权限分配等 (参考数据库用户、角色、权限表)</p>
      </el-tab-pane>
      <el-tab-pane label="系统日志" name="logs">
        <p>TODO: 展示系统日志 (参考 system_logs 表)</p>
      </el-tab-pane>
      <!-- Add more tabs as needed -->
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: 'Settings',
  data() {
    return {
      activeTab: 'basic'
    };
  }
};
</script>

<style scoped>
.settings-container {
  padding: 20px;
}
</style> 