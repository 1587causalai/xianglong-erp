<template>
  <div class="breadcrumb-container">
    <!-- TODO: Implement breadcrumb logic, e.g., using vue-router's matched routes -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item v-for="item in pathItems" :key="item.path" :to="item.path ? { path: item.path } : null">
        {{ item.name }}
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  name: 'Breadcrumb',
  data() {
    return {
      pathItems: [] // This should be populated based on current route
    };
  },
  watch: {
    $route: {
      handler(route) {
        this.generateBreadcrumbs(route);
      },
      immediate: true
    }
  },
  methods: {
    generateBreadcrumbs(route) {
      // A simple example, you might need more sophisticated logic
      let matched = route.matched.filter(item => item.meta && item.meta.title);
      const first = matched[0];
      if (first && first.name !== 'Dashboard') { // Assuming 'Dashboard' is your homepage under '/'
         // this.pathItems = [{ path: '/', name: '首页' }, ...matched.map(item => ({ name: item.meta.title, path: item.path }))];
      } else {
        // this.pathItems = matched.map(item => ({ name: item.meta.title, path: item.path }));
      }
      // Placeholder logic - replace with actual breadcrumb generation
      this.pathItems = route.matched
        .filter(item => item.meta && item.meta.title)
        .map(item => ({
          name: item.meta.title,
          path: item.path,
        }));
      if (this.pathItems.length > 0 && this.pathItems[0].name !== '首页' && route.path !== '/') {
        this.pathItems.unshift({ name: '首页', path: '/' });
      }
    }
  }
};
</script>

<style scoped>
.breadcrumb-container {
  padding: 15px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
}
</style> 