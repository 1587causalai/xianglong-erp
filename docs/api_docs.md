# API文档

本文档详细说明了上海翔珑科技有限公司ERP系统的API接口。

## 基础URL

所有API请求的基础URL为：`http://your-server-address:3000/api`

## 认证

除了登录接口外，所有API请求都需要在请求头中包含JWT令牌：

```
Authorization: Bearer <your_token>
```

## 错误处理

所有API响应都遵循以下格式：

```json
{
  "success": true/false,
  "message": "操作成功/错误信息",
  "data": { ... } // 成功时返回的数据
}
```

当发生错误时，会返回相应的HTTP状态码和错误信息。

## API端点

### 认证

#### 登录

- **URL**: `/auth/login`
- **方法**: `POST`
- **请求体**:
  ```json
  {
    "username": "admin",
    "password": "123456"
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "message": "登录成功",
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "user_id": 1,
        "username": "admin",
        "real_name": "系统管理员",
        "role_id": 1
      }
    }
  }
  ```

### 产品管理

#### 获取产品列表

- **URL**: `/products`
- **方法**: `GET`
- **响应**:
  ```json
  {
    "success": true,
    "data": [
      {
        "product_id": 1,
        "product_code": "P001",
        "product_name": "产品A",
        "product_spec": "规格A",
        "product_unit": "个",
        "product_price": 100.00,
        "product_status": 1
      }
    ]
  }
  ```

#### 获取单个产品

- **URL**: `/products/:id`
- **方法**: `GET`
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "product_id": 1,
      "product_code": "P001",
      "product_name": "产品A",
      "product_spec": "规格A",
      "product_unit": "个",
      "product_price": 100.00,
      "product_status": 1
    }
  }
  ```

#### 创建产品

- **URL**: `/products`
- **方法**: `POST`
- **请求体**:
  ```json
  {
    "product_code": "P002",
    "product_name": "产品B",
    "product_spec": "规格B",
    "product_unit": "个",
    "product_price": 200.00
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "message": "产品创建成功",
    "data": {
      "product_id": 2,
      "product_code": "P002",
      "product_name": "产品B"
    }
  }
  ```

#### 更新产品

- **URL**: `/products/:id`
- **方法**: `PUT`
- **请求体**:
  ```json
  {
    "product_name": "产品B更新",
    "product_price": 250.00
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "message": "产品更新成功",
    "data": {
      "product_id": 2,
      "product_name": "产品B更新",
      "product_price": 250.00
    }
  }
  ```

### 配件管理

#### 获取配件列表

- **URL**: `/components`
- **方法**: `GET`
- **响应**:
  ```json
  {
    "success": true,
    "data": [
      {
        "component_id": 1,
        "component_code": "C001",
        "component_name": "配件A",
        "component_spec": "规格A",
        "component_unit": "个",
        "component_price": 50.00,
        "component_status": 1
      }
    ]
  }
  ```

#### 获取单个配件

- **URL**: `/components/:id`
- **方法**: `GET`
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "component_id": 1,
      "component_code": "C001",
      "component_name": "配件A",
      "component_spec": "规格A",
      "component_unit": "个",
      "component_price": 50.00,
      "component_status": 1
    }
  }
  ```

#### 创建配件

- **URL**: `/components`
- **方法**: `POST`
- **请求体**:
  ```json
  {
    "component_code": "C002",
    "component_name": "配件B",
    "component_spec": "规格B",
    "component_unit": "个",
    "component_price": 60.00,
    "min_stock": 100,
    "max_stock": 1000
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "message": "配件创建成功",
    "data": {
      "component_id": 2,
      "component_code": "C002",
      "component_name": "配件B"
    }
  }
  ```

### BOM管理

#### 获取BOM列表

- **URL**: `/bom`
- **方法**: `GET`
- **响应**:
  ```json
  {
    "success": true,
    "data": [
      {
        "bom_id": 1,
        "product_id": 1,
        "bom_version": "V1.0",
        "bom_status": 1,
        "Product": {
          "product_code": "P001",
          "product_name": "产品A"
        }
      }
    ]
  }
  ```

#### 获取单个BOM及其明细

- **URL**: `/bom/:id`
- **方法**: `GET`
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "bom_id": 1,
      "product_id": 1,
      "bom_version": "V1.0",
      "bom_status": 1,
      "Product": {
        "product_code": "P001",
        "product_name": "产品A",
        "product_spec": "规格A",
        "product_unit": "个"
      },
      "BomDetails": [
        {
          "bom_detail_id": 1,
          "component_id": 1,
          "quantity": 2,
          "Component": {
            "component_code": "C001",
            "component_name": "配件A",
            "component_spec": "规格A",
            "component_unit": "个"
          }
        }
      ]
    }
  }
  ```

#### 创建BOM

- **URL**: `/bom`
- **方法**: `POST`
- **请求体**:
  ```json
  {
    "product_id": 1,
    "bom_version": "V1.0",
    "details": [
      {
        "component_id": 1,
        "quantity": 2
      },
      {
        "component_id": 2,
        "quantity": 3
      }
    ]
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "message": "BOM创建成功",
    "data": {
      "bomHeader": {
        "bom_id": 1,
        "product_id": 1,
        "bom_version": "V1.0"
      },
      "bomDetails": [
        {
          "bom_detail_id": 1,
          "bom_id": 1,
          "component_id": 1,
          "quantity": 2
        },
        {
          "bom_detail_id": 2,
          "bom_id": 1,
          "component_id": 2,
          "quantity": 3
        }
      ]
    }
  }
  ```

### 销售订单管理

#### 获取销售订单列表

- **URL**: `/sales-orders`
- **方法**: `GET`
- **响应**:
  ```json
  {
    "success": true,
    "data": [
      {
        "sales_order_id": 1,
        "order_no": "SO2025052100001",
        "customer_id": 1,
        "order_date": "2025-05-21",
        "delivery_date": "2025-05-28",
        "order_status": 1,
        "total_amount": 1000.00,
        "Customer": {
          "customer_name": "客户A"
        }
      }
    ]
  }
  ```

#### 获取单个销售订单详情

- **URL**: `/sales-orders/:id`
- **方法**: `GET`
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "sales_order_id": 1,
      "order_no": "SO2025052100001",
      "customer_id": 1,
      "order_date": "2025-05-21",
      "delivery_date": "2025-05-28",
      "order_status": 1,
      "total_amount": 1000.00,
      "Customer": {
        "customer_name": "客户A",
        "customer_contact": "张三",
        "customer_phone": "13800138000"
      },
      "SalesOrderItems": [
        {
          "order_item_id": 1,
          "product_id": 1,
          "quantity": 10,
          "unit_price": 100.00,
          "line_amount": 1000.00,
          "delivered_quantity": 0,
          "Product": {
            "product_code": "P001",
            "product_name": "产品A",
            "product_spec": "规格A",
            "product_unit": "个"
          }
        }
      ]
    }
  }
  ```

#### 创建销售订单

- **URL**: `/sales-orders`
- **方法**: `POST`
- **请求体**:
  ```json
  {
    "customer_id": 1,
    "order_date": "2025-05-21",
    "delivery_date": "2025-05-28",
    "items": [
      {
        "product_id": 1,
        "quantity": 10,
        "unit_price": 100.00
      }
    ]
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "message": "销售订单创建成功",
    "data": {
      "salesOrder": {
        "sales_order_id": 1,
        "order_no": "SO2025052100001",
        "customer_id": 1,
        "order_date": "2025-05-21",
        "delivery_date": "2025-05-28",
        "total_amount": 1000.00
      },
      "orderItems": [
        {
          "order_item_id": 1,
          "sales_order_id": 1,
          "product_id": 1,
          "quantity": 10,
          "unit_price": 100.00,
          "line_amount": 1000.00
        }
      ]
    }
  }
  ```

### 采购订单管理

#### 获取采购订单列表

- **URL**: `/purchase-orders`
- **方法**: `GET`
- **响应**:
  ```json
  {
    "success": true,
    "data": [
      {
        "purchase_order_id": 1,
        "order_no": "PO2025052100001",
        "supplier_id": 1,
        "order_date": "2025-05-21",
        "expected_date": "2025-05-28",
        "order_status": 1,
        "total_amount": 500.00,
        "Supplier": {
          "supplier_name": "供应商A"
        }
      }
    ]
  }
  ```

#### 获取单个采购订单详情

- **URL**: `/purchase-orders/:id`
- **方法**: `GET`
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "purchase_order_id": 1,
      "order_no": "PO2025052100001",
      "supplier_id": 1,
      "order_date": "2025-05-21",
      "expected_date": "2025-05-28",
      "order_status": 1,
      "total_amount": 500.00,
      "Supplier": {
        "supplier_name": "供应商A",
        "supplier_contact": "李四",
        "supplier_phone": "13900139000"
      },
      "PurchaseOrderItems": [
        {
          "order_item_id": 1,
          "component_id": 1,
          "quantity": 10,
          "unit_price": 50.00,
          "line_amount": 500.00,
          "received_quantity": 0,
          "Component": {
            "component_code": "C001",
            "component_name": "配件A",
            "component_spec": "规格A",
            "component_unit": "个"
          }
        }
      ]
    }
  }
  ```

#### 创建采购订单

- **URL**: `/purchase-orders`
- **方法**: `POST`
- **请求体**:
  ```json
  {
    "supplier_id": 1,
    "order_date": "2025-05-21",
    "expected_date": "2025-05-28",
    "items": [
      {
        "component_id": 1,
        "quantity": 10,
        "unit_price": 50.00
      }
    ]
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "message": "采购订单创建成功",
    "data": {
      "purchaseOrder": {
        "purchase_order_id": 1,
        "order_no": "PO2025052100001",
        "supplier_id": 1,
        "order_date": "2025-05-21",
        "expected_date": "2025-05-28",
        "total_amount": 500.00
      },
      "orderItems": [
        {
          "order_item_id": 1,
          "purchase_order_id": 1,
          "component_id": 1,
          "quantity": 10,
          "unit_price": 50.00,
          "line_amount": 500.00
        }
      ]
    }
  }
  ```

### 库存管理

#### 获取库存余额列表

- **URL**: `/inventory/balances`
- **方法**: `GET`
- **响应**:
  ```json
  {
    "success": true,
    "data": [
      {
        "balance_id": 1,
        "warehouse_id": 1,
        "location_id": 1,
        "item_id": 1,
        "item_type": 2,
        "quantity": 100,
        "reserved_quantity": 0,
        "available_quantity": 100,
        "item_name": "配件A",
        "item_code": "C001",
        "Warehouse": {
          "warehouse_name": "主仓库"
        },
        "Location": {
          "location_code": "A-01-01"
        }
      }
    ]
  }
  ```

#### 获取在途库存列表

- **URL**: `/inventory/in-transit`
- **方法**: `GET`
- **响应**:
  ```json
  {
    "success": true,
    "data": [
      {
        "transit_id": 1,
        "component_id": 1,
        "purchase_order_id": 1,
        "order_item_id": 1,
        "expected_quantity": 10,
        "received_quantity": 0,
        "remaining_quantity": 10,
        "expected_date": "2025-05-28",
        "transit_status": 1,
        "Component": {
          "component_code": "C001",
          "component_name": "配件A"
        }
      }
    ]
  }
  ```

#### 创建库存事务（入库）

- **URL**: `/inventory/transactions`
- **方法**: `POST`
- **请求体**:
  ```json
  {
    "transaction_type": 1,
    "warehouse_id": 1,
    "reference_no": "PO2025052100001",
    "reference_type": "采购订单",
    "details": [
      {
        "item_id": 1,
        "item_type": 2,
        "location_id": 1,
        "quantity": 10,
        "unit_cost": 50.00,
        "batch_no": "B20250521"
      }
    ]
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "message": "库存事务创建成功",
    "data": {
      "transaction_id": 1,
      "transaction_no": "T1621234567890",
      "transaction_type": 1,
      "warehouse_id": 1,
      "transaction_date": "2025-05-21T10:30:00.000Z"
    }
  }
  ```

#### 成品入库（自动扣减配件库存）

- **URL**: `/inventory/transactions`
- **方法**: `POST`
- **请求体**:
  ```json
  {
    "transaction_type": 4,
    "warehouse_id": 1,
    "reference_no": "PROD20250521",
    "reference_type": "生产入库",
    "details": [
      {
        "item_id": 1,
        "item_type": 1,
        "location_id": 1,
        "quantity": 5,
        "unit_cost": 100.00,
        "batch_no": "P20250521"
      }
    ]
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "message": "库存事务创建成功",
    "data": {
      "transaction_id": 2,
      "transaction_no": "T1621234567891",
      "transaction_type": 4,
      "warehouse_id": 1,
      "transaction_date": "2025-05-21T10:35:00.000Z"
    }
  }
  ```

### 财务管理

#### 获取应收账款列表

- **URL**: `/finance/receivables`
- **方法**: `GET`
- **响应**:
  ```json
  {
    "success": true,
    "data": [
      {
        "ar_id": 1,
        "customer_id": 1,
        "invoice_id": 1,
        "original_amount": 1000.00,
        "remaining_amount": 1000.00,
        "due_date": "2025-06-21",
        "ar_status": 1,
        "Customer": {
          "customer_name": "客户A"
        },
        "Invoice": {
          "invoice_no": "INV2025052100001"
        }
      }
    ]
  }
  ```

#### 获取已发货未开票明细

- **URL**: `/finance/delivered-not-invoiced`
- **方法**: `GET`
- **响应**:
  ```json
  {
    "success": true,
    "data": [
      {
        "order_no": "SO2025052100001",
        "order_date": "2025-05-21",
        "customer_name": "客户A",
        "product_code": "P001",
        "product_name": "产品A",
        "quantity": 10,
        "delivered_quantity": 10,
        "unit_price": 100.00,
        "delivered_amount": 1000.00,
        "invoiced_amount": 0.00,
        "uninvoiced_amount": 1000.00
      }
    ]
  }
  ```

## 状态码说明

### 订单状态

#### 销售订单状态
- 0: 草稿
- 1: 确认
- 2: 部分发货
- 3: 全部发货
- 4: 完成
- 5: 取消

#### 采购订单状态
- 0: 草稿
- 1: 已发送
- 2: 部分到货
- 3: 全部到货
- 4: 完成
- 5: 取消

### 库存事务类型
- 1: 采购入库
- 2: 销售出库
- 3: 生产领料
- 4: 成品入库
- 5: 库存调整
- 6: 盘点调整

### 在途库存状态
- 1: 在途
- 2: 部分到货
- 3: 全部到货
- 4: 取消

### 发票状态
- 0: 草稿
- 1: 已确认
- 2: 部分收/付款
- 3: 全部收/付款

### 应收/应付账款状态
- 1: 未收/付款
- 2: 部分收/付款
- 3: 全部收/付款
