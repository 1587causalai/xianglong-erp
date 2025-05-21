# 上海翔珑科技有限公司ERP系统

*manus.ai 实战案例*

这是一个为上海翔珑科技有限公司定制开发的企业资源管理(ERP)系统，旨在解决公司在订单管理、BOM管理、采购管理、库存管理、销售发货、财务对账等环节的痛点问题，实现业务流程的自动化、集成化和高效化。

## 系统特点

- **订单与BOM自动管理**：录入客户成品订单后，系统能自动关联预设的成品BOM，计算所需配件总量
- **智能采购与在途管理**：对库存不足的配件自动生成采购建议，跟踪采购订单的执行状态
- **精准库存管理**：支持多级库位结构，成品入库自动扣减配件库存，实时库存查询
- **销售发货与应收管理**：支持发货管理、已发货未开票管理、应收账款跟踪
- **财务对账与应付管理**：支持已收货未开票管理、供应商对账、应付账款管理

## 技术架构

- **前端**：Vue.js + Element UI
- **后端**：Node.js + Express.js
- **数据库**：MySQL

## 项目结构

```
xianglong-erp/
├── backend/             # 后端代码
│   ├── src/
│   │   ├── config/      # 配置文件
│   │   ├── controllers/ # 控制器
│   │   ├── middlewares/ # 中间件
│   │   ├── models/      # 数据模型
│   │   ├── routes/      # 路由
│   │   ├── utils/       # 工具函数
│   │   └── app.js       # 应用入口
│   ├── .env             # 环境变量
│   └── package.json     # 依赖配置
├── frontend/            # 前端代码
│   ├── public/          # 静态资源
│   ├── src/
│   │   ├── assets/      # 资源文件
│   │   ├── components/  # 组件
│   │   ├── views/       # 页面
│   │   ├── router/      # 路由
│   │   ├── store/       # 状态管理
│   │   ├── App.vue      # 主组件
│   │   └── main.js      # 入口文件
│   └── package.json     # 依赖配置
├── docs/                # 文档
│   ├── system_design.md # 系统设计文档
│   └── api_docs.md      # API文档
└── database/            # 数据库脚本
    └── xianglong_erp.sql # 数据库初始化脚本
```

## 安装与部署

### 前提条件

- Node.js (v14+)
- MySQL (v8.0+)
- npm 或 yarn

### 后端部署

1. 进入后端目录
   ```
   cd backend
   ```

2. 安装依赖
   ```
   npm install
   ```

3. 配置环境变量
   ```
   cp .env.example .env
   ```
   然后编辑 `.env` 文件，配置数据库连接等信息

4. 初始化数据库
   ```
   mysql -u your_username -p < ../database/xianglong_erp.sql
   ```

5. 启动服务
   ```
   npm start
   ```
   开发模式：
   ```
   npm run dev
   ```

### 前端部署

1. 进入前端目录
   ```
   cd frontend
   ```

2. 安装依赖
   ```
   npm install
   ```

3. 配置API地址
   创建或编辑 `.env.local` 文件：
   ```
   VUE_APP_API_URL=http://localhost:3000/api
   ```

4. 开发模式启动
   ```
   npm run serve
   ```

5. 构建生产版本
   ```
   npm run build
   ```
   构建后的文件将生成在 `dist` 目录中，可部署到任何静态文件服务器

## 核心功能模块

1. **基础数据管理**
   - 产品与配件主数据管理
   - BOM结构管理与维护
   - 客户与供应商信息管理
   - 仓库与库位结构管理

2. **订单管理**
   - 销售订单管理
   - 采购订单管理
   - 订单状态跟踪

3. **库存管理**
   - 库存事务管理
   - 库位管理
   - 在途库存管理
   - 库存盘点与调整

4. **财务管理**
   - 应收账款管理
   - 应付账款管理
   - 发票管理
   - 对账管理

## 默认账户

系统初始化后，将创建以下默认账户：

- 用户名：admin
- 密码：123456

首次登录后请立即修改密码。

## 许可证

[MIT](LICENSE)
