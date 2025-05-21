-- 上海翔珑科技有限公司ERP系统数据库设计

-- 创建数据库
CREATE DATABASE IF NOT EXISTS xianglong_erp DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE xianglong_erp;

-- 基础数据表

-- 产品表（成品）
CREATE TABLE products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    product_code VARCHAR(50) NOT NULL COMMENT '产品编码',
    product_name VARCHAR(100) NOT NULL COMMENT '产品名称',
    product_spec VARCHAR(200) COMMENT '产品规格',
    product_unit VARCHAR(20) COMMENT '计量单位',
    product_category VARCHAR(50) COMMENT '产品类别',
    product_price DECIMAL(10, 2) COMMENT '标准售价',
    product_cost DECIMAL(10, 2) COMMENT '标准成本',
    product_status TINYINT DEFAULT 1 COMMENT '状态：1-启用，0-禁用',
    product_desc TEXT COMMENT '产品描述',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY (product_code)
) COMMENT='产品信息表';

-- 配件表
CREATE TABLE components (
    component_id INT AUTO_INCREMENT PRIMARY KEY,
    component_code VARCHAR(50) NOT NULL COMMENT '配件编码',
    component_name VARCHAR(100) NOT NULL COMMENT '配件名称',
    component_spec VARCHAR(200) COMMENT '配件规格',
    component_unit VARCHAR(20) COMMENT '计量单位',
    component_category VARCHAR(50) COMMENT '配件类别',
    component_price DECIMAL(10, 2) COMMENT '标准采购价',
    min_stock INT DEFAULT 0 COMMENT '最小库存',
    max_stock INT DEFAULT 0 COMMENT '最大库存',
    lead_time INT DEFAULT 0 COMMENT '采购提前期(天)',
    default_supplier_id INT COMMENT '默认供应商ID',
    component_status TINYINT DEFAULT 1 COMMENT '状态：1-启用，0-禁用',
    component_desc TEXT COMMENT '配件描述',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY (component_code)
) COMMENT='配件信息表';

-- 客户表
CREATE TABLE customers (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_code VARCHAR(50) NOT NULL COMMENT '客户编码',
    customer_name VARCHAR(100) NOT NULL COMMENT '客户名称',
    customer_contact VARCHAR(50) COMMENT '联系人',
    customer_phone VARCHAR(20) COMMENT '联系电话',
    customer_email VARCHAR(100) COMMENT '电子邮箱',
    customer_address TEXT COMMENT '地址',
    payment_terms VARCHAR(100) COMMENT '付款条件',
    credit_limit DECIMAL(12, 2) DEFAULT 0 COMMENT '信用额度',
    customer_status TINYINT DEFAULT 1 COMMENT '状态：1-启用，0-禁用',
    customer_remark TEXT COMMENT '备注',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY (customer_code)
) COMMENT='客户信息表';

-- 供应商表
CREATE TABLE suppliers (
    supplier_id INT AUTO_INCREMENT PRIMARY KEY,
    supplier_code VARCHAR(50) NOT NULL COMMENT '供应商编码',
    supplier_name VARCHAR(100) NOT NULL COMMENT '供应商名称',
    supplier_contact VARCHAR(50) COMMENT '联系人',
    supplier_phone VARCHAR(20) COMMENT '联系电话',
    supplier_email VARCHAR(100) COMMENT '电子邮箱',
    supplier_address TEXT COMMENT '地址',
    payment_terms VARCHAR(100) COMMENT '付款条件',
    supplier_status TINYINT DEFAULT 1 COMMENT '状态：1-启用，0-禁用',
    supplier_remark TEXT COMMENT '备注',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY (supplier_code)
) COMMENT='供应商信息表';

-- 仓库表
CREATE TABLE warehouses (
    warehouse_id INT AUTO_INCREMENT PRIMARY KEY,
    warehouse_code VARCHAR(50) NOT NULL COMMENT '仓库编码',
    warehouse_name VARCHAR(100) NOT NULL COMMENT '仓库名称',
    warehouse_address TEXT COMMENT '仓库地址',
    warehouse_manager VARCHAR(50) COMMENT '仓库管理员',
    warehouse_status TINYINT DEFAULT 1 COMMENT '状态：1-启用，0-禁用',
    warehouse_remark TEXT COMMENT '备注',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY (warehouse_code)
) COMMENT='仓库信息表';

-- 库位表
CREATE TABLE locations (
    location_id INT AUTO_INCREMENT PRIMARY KEY,
    warehouse_id INT NOT NULL COMMENT '所属仓库ID',
    location_code VARCHAR(50) NOT NULL COMMENT '库位编码',
    location_name VARCHAR(100) COMMENT '库位名称',
    area_code VARCHAR(50) COMMENT '区域编码',
    shelf_code VARCHAR(50) COMMENT '货架编码',
    layer_code VARCHAR(50) COMMENT '层编码',
    position_code VARCHAR(50) COMMENT '位置编码',
    location_status TINYINT DEFAULT 1 COMMENT '状态：1-启用，0-禁用',
    location_remark TEXT COMMENT '备注',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY (warehouse_id, location_code),
    FOREIGN KEY (warehouse_id) REFERENCES warehouses(warehouse_id)
) COMMENT='库位信息表';

-- BOM相关表

-- BOM头表
CREATE TABLE bom_headers (
    bom_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL COMMENT '成品ID',
    bom_version VARCHAR(20) NOT NULL COMMENT 'BOM版本',
    bom_status TINYINT DEFAULT 1 COMMENT '状态：1-启用，0-禁用',
    bom_remark TEXT COMMENT '备注',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY (product_id, bom_version),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
) COMMENT='BOM头表';

-- BOM明细表
CREATE TABLE bom_details (
    bom_detail_id INT AUTO_INCREMENT PRIMARY KEY,
    bom_id INT NOT NULL COMMENT 'BOM ID',
    component_id INT NOT NULL COMMENT '配件ID',
    quantity DECIMAL(10, 3) NOT NULL COMMENT '用量',
    bom_detail_remark TEXT COMMENT '备注',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY (bom_id, component_id),
    FOREIGN KEY (bom_id) REFERENCES bom_headers(bom_id),
    FOREIGN KEY (component_id) REFERENCES components(component_id)
) COMMENT='BOM明细表';

-- 订单相关表

-- 销售订单表
CREATE TABLE sales_orders (
    sales_order_id INT AUTO_INCREMENT PRIMARY KEY,
    order_no VARCHAR(50) NOT NULL COMMENT '订单编号',
    customer_id INT NOT NULL COMMENT '客户ID',
    order_date DATE NOT NULL COMMENT '订单日期',
    delivery_date DATE COMMENT '预计交付日期',
    order_status TINYINT DEFAULT 0 COMMENT '状态：0-草稿，1-确认，2-部分发货，3-全部发货，4-完成，5-取消',
    total_amount DECIMAL(12, 2) DEFAULT 0 COMMENT '订单总金额',
    order_remark TEXT COMMENT '备注',
    created_by VARCHAR(50) COMMENT '创建人',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY (order_no),
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
) COMMENT='销售订单表';

-- 销售订单明细表
CREATE TABLE sales_order_items (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    sales_order_id INT NOT NULL COMMENT '销售订单ID',
    product_id INT NOT NULL COMMENT '产品ID',
    quantity INT NOT NULL COMMENT '订单数量',
    unit_price DECIMAL(10, 2) NOT NULL COMMENT '单价',
    line_amount DECIMAL(12, 2) NOT NULL COMMENT '行金额',
    delivered_quantity INT DEFAULT 0 COMMENT '已发货数量',
    item_status TINYINT DEFAULT 0 COMMENT '状态：0-待处理，1-部分发货，2-全部发货',
    item_remark TEXT COMMENT '备注',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (sales_order_id) REFERENCES sales_orders(sales_order_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
) COMMENT='销售订单明细表';

-- 采购订单表
CREATE TABLE purchase_orders (
    purchase_order_id INT AUTO_INCREMENT PRIMARY KEY,
    order_no VARCHAR(50) NOT NULL COMMENT '订单编号',
    supplier_id INT NOT NULL COMMENT '供应商ID',
    order_date DATE NOT NULL COMMENT '订单日期',
    expected_date DATE COMMENT '预计到货日期',
    order_status TINYINT DEFAULT 0 COMMENT '状态：0-草稿，1-已发送，2-部分到货，3-全部到货，4-完成，5-取消',
    total_amount DECIMAL(12, 2) DEFAULT 0 COMMENT '订单总金额',
    order_remark TEXT COMMENT '备注',
    created_by VARCHAR(50) COMMENT '创建人',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY (order_no),
    FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id)
) COMMENT='采购订单表';

-- 采购订单明细表
CREATE TABLE purchase_order_items (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    purchase_order_id INT NOT NULL COMMENT '采购订单ID',
    component_id INT NOT NULL COMMENT '配件ID',
    quantity INT NOT NULL COMMENT '订单数量',
    unit_price DECIMAL(10, 2) NOT NULL COMMENT '单价',
    line_amount DECIMAL(12, 2) NOT NULL COMMENT '行金额',
    received_quantity INT DEFAULT 0 COMMENT '已收货数量',
    item_status TINYINT DEFAULT 0 COMMENT '状态：0-待处理，1-部分到货，2-全部到货',
    item_remark TEXT COMMENT '备注',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (purchase_order_id) REFERENCES purchase_orders(purchase_order_id),
    FOREIGN KEY (component_id) REFERENCES components(component_id)
) COMMENT='采购订单明细表';

-- 库存相关表

-- 库存事务表
CREATE TABLE inventory_transactions (
    transaction_id INT AUTO_INCREMENT PRIMARY KEY,
    transaction_no VARCHAR(50) NOT NULL COMMENT '事务编号',
    transaction_type TINYINT NOT NULL COMMENT '事务类型：1-采购入库，2-销售出库，3-生产领料，4-成品入库，5-库存调整，6-盘点调整',
    transaction_date DATETIME NOT NULL COMMENT '事务日期',
    reference_no VARCHAR(50) COMMENT '参考单号',
    reference_type VARCHAR(20) COMMENT '参考单据类型',
    warehouse_id INT NOT NULL COMMENT '仓库ID',
    transaction_status TINYINT DEFAULT 1 COMMENT '状态：0-草稿，1-已确认',
    transaction_remark TEXT COMMENT '备注',
    created_by VARCHAR(50) COMMENT '创建人',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY (transaction_no),
    FOREIGN KEY (warehouse_id) REFERENCES warehouses(warehouse_id)
) COMMENT='库存事务表';

-- 库存事务明细表
CREATE TABLE inventory_transaction_details (
    detail_id INT AUTO_INCREMENT PRIMARY KEY,
    transaction_id INT NOT NULL COMMENT '事务ID',
    item_id INT NOT NULL COMMENT '物料ID（产品ID或配件ID）',
    item_type TINYINT NOT NULL COMMENT '物料类型：1-产品，2-配件',
    location_id INT COMMENT '库位ID',
    quantity DECIMAL(10, 3) NOT NULL COMMENT '数量',
    unit_cost DECIMAL(10, 2) COMMENT '单位成本',
    batch_no VARCHAR(50) COMMENT '批次号',
    detail_remark TEXT COMMENT '备注',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (transaction_id) REFERENCES inventory_transactions(transaction_id),
    FOREIGN KEY (location_id) REFERENCES locations(location_id)
) COMMENT='库存事务明细表';

-- 库存余额表
CREATE TABLE inventory_balances (
    balance_id INT AUTO_INCREMENT PRIMARY KEY,
    warehouse_id INT NOT NULL COMMENT '仓库ID',
    location_id INT COMMENT '库位ID',
    item_id INT NOT NULL COMMENT '物料ID（产品ID或配件ID）',
    item_type TINYINT NOT NULL COMMENT '物料类型：1-产品，2-配件',
    batch_no VARCHAR(50) COMMENT '批次号',
    quantity DECIMAL(10, 3) NOT NULL DEFAULT 0 COMMENT '当前数量',
    reserved_quantity DECIMAL(10, 3) NOT NULL DEFAULT 0 COMMENT '已预留数量',
    available_quantity DECIMAL(10, 3) GENERATED ALWAYS AS (quantity - reserved_quantity) STORED COMMENT '可用数量',
    last_transaction_date DATETIME COMMENT '最后事务日期',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY (warehouse_id, location_id, item_id, item_type, batch_no),
    FOREIGN KEY (warehouse_id) REFERENCES warehouses(warehouse_id),
    FOREIGN KEY (location_id) REFERENCES locations(location_id)
) COMMENT='库存余额表';

-- 在途库存表
CREATE TABLE inventory_in_transit (
    transit_id INT AUTO_INCREMENT PRIMARY KEY,
    component_id INT NOT NULL COMMENT '配件ID',
    purchase_order_id INT NOT NULL COMMENT '采购订单ID',
    order_item_id INT NOT NULL COMMENT '订单明细ID',
    expected_quantity INT NOT NULL COMMENT '预期数量',
    received_quantity INT DEFAULT 0 COMMENT '已收货数量',
    remaining_quantity INT GENERATED ALWAYS AS (expected_quantity - received_quantity) STORED COMMENT '剩余在途数量',
    expected_date DATE COMMENT '预计到货日期',
    transit_status TINYINT DEFAULT 1 COMMENT '状态：1-在途，2-部分到货，3-全部到货，4-取消',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (component_id) REFERENCES components(component_id),
    FOREIGN KEY (purchase_order_id) REFERENCES purchase_orders(purchase_order_id),
    FOREIGN KEY (order_item_id) REFERENCES purchase_order_items(order_item_id)
) COMMENT='在途库存表';

-- 财务相关表

-- 发票表（应收）
CREATE TABLE invoices_receivable (
    invoice_id INT AUTO_INCREMENT PRIMARY KEY,
    invoice_no VARCHAR(50) NOT NULL COMMENT '发票编号',
    invoice_date DATE NOT NULL COMMENT '发票日期',
    customer_id INT NOT NULL COMMENT '客户ID',
    sales_order_id INT COMMENT '销售订单ID',
    invoice_amount DECIMAL(12, 2) NOT NULL COMMENT '发票金额',
    tax_amount DECIMAL(12, 2) DEFAULT 0 COMMENT '税额',
    total_amount DECIMAL(12, 2) NOT NULL COMMENT '总金额',
    invoice_status TINYINT DEFAULT 0 COMMENT '状态：0-草稿，1-已确认，2-部分收款，3-全部收款',
    due_date DATE COMMENT '到期日',
    invoice_remark TEXT COMMENT '备注',
    created_by VARCHAR(50) COMMENT '创建人',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY (invoice_no),
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    FOREIGN KEY (sales_order_id) REFERENCES sales_orders(sales_order_id)
) COMMENT='应收发票表';

-- 发票表（应付）
CREATE TABLE invoices_payable (
    invoice_id INT AUTO_INCREMENT PRIMARY KEY,
    invoice_no VARCHAR(50) NOT NULL COMMENT '发票编号',
    invoice_date DATE NOT NULL COMMENT '发票日期',
    supplier_id INT NOT NULL COMMENT '供应商ID',
    purchase_order_id INT COMMENT '采购订单ID',
    invoice_amount DECIMAL(12, 2) NOT NULL COMMENT '发票金额',
    tax_amount DECIMAL(12, 2) DEFAULT 0 COMMENT '税额',
    total_amount DECIMAL(12, 2) NOT NULL COMMENT '总金额',
    invoice_status TINYINT DEFAULT 0 COMMENT '状态：0-草稿，1-已确认，2-部分付款，3-全部付款',
    due_date DATE COMMENT '到期日',
    invoice_remark TEXT COMMENT '备注',
    created_by VARCHAR(50) COMMENT '创建人',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY (invoice_no),
    FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id),
    FOREIGN KEY (purchase_order_id) REFERENCES purchase_orders(purchase_order_id)
) COMMENT='应付发票表';

-- 应收账款表
CREATE TABLE accounts_receivable (
    ar_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL COMMENT '客户ID',
    invoice_id INT NOT NULL COMMENT '发票ID',
    original_amount DECIMAL(12, 2) NOT NULL COMMENT '原始金额',
    remaining_amount DECIMAL(12, 2) NOT NULL COMMENT '剩余金额',
    due_date DATE NOT NULL COMMENT '到期日',
    ar_status TINYINT DEFAULT 1 COMMENT '状态：1-未收款，2-部分收款，3-全部收款',
    ar_remark TEXT COMMENT '备注',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    FOREIGN KEY (invoice_id) REFERENCES invoices_receivable(invoice_id)
) COMMENT='应收账款表';

-- 应付账款表
CREATE TABLE accounts_payable (
    ap_id INT AUTO_INCREMENT PRIMARY KEY,
    supplier_id INT NOT NULL COMMENT '供应商ID',
    invoice_id INT NOT NULL COMMENT '发票ID',
    original_amount DECIMAL(12, 2) NOT NULL COMMENT '原始金额',
    remaining_amount DECIMAL(12, 2) NOT NULL COMMENT '剩余金额',
    due_date DATE NOT NULL COMMENT '到期日',
    ap_status TINYINT DEFAULT 1 COMMENT '状态：1-未付款，2-部分付款，3-全部付款',
    ap_remark TEXT COMMENT '备注',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id),
    FOREIGN KEY (invoice_id) REFERENCES invoices_payable(invoice_id)
) COMMENT='应付账款表';

-- 收款记录表
CREATE TABLE receipts (
    receipt_id INT AUTO_INCREMENT PRIMARY KEY,
    receipt_no VARCHAR(50) NOT NULL COMMENT '收款单号',
    receipt_date DATE NOT NULL COMMENT '收款日期',
    customer_id INT NOT NULL COMMENT '客户ID',
    ar_id INT COMMENT '应收账款ID',
    receipt_amount DECIMAL(12, 2) NOT NULL COMMENT '收款金额',
    receipt_method VARCHAR(50) COMMENT '收款方式',
    receipt_reference VARCHAR(100) COMMENT '收款参考（如银行流水号）',
    receipt_status TINYINT DEFAULT 1 COMMENT '状态：0-草稿，1-已确认',
    receipt_remark TEXT COMMENT '备注',
    created_by VARCHAR(50) COMMENT '创建人',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY (receipt_no),
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    FOREIGN KEY (ar_id) REFERENCES accounts_receivable(ar_id)
) COMMENT='收款记录表';

-- 付款记录表
CREATE TABLE payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    payment_no VARCHAR(50) NOT NULL COMMENT '付款单号',
    payment_date DATE NOT NULL COMMENT '付款日期',
    supplier_id INT NOT NULL COMMENT '供应商ID',
    ap_id INT COMMENT '应付账款ID',
    payment_amount DECIMAL(12, 2) NOT NULL COMMENT '付款金额',
    payment_method VARCHAR(50) COMMENT '付款方式',
    payment_reference VARCHAR(100) COMMENT '付款参考（如银行流水号）',
    payment_status TINYINT DEFAULT 1 COMMENT '状态：0-草稿，1-已确认',
    payment_remark TEXT COMMENT '备注',
    created_by VARCHAR(50) COMMENT '创建人',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY (payment_no),
    FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id),
    FOREIGN KEY (ap_id) REFERENCES accounts_payable(ap_id)
) COMMENT='付款记录表';

-- 系统相关表

-- 用户表
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL COMMENT '用户名',
    password VARCHAR(255) NOT NULL COMMENT '密码（加密存储）',
    real_name VARCHAR(50) COMMENT '真实姓名',
    email VARCHAR(100) COMMENT '电子邮箱',
    phone VARCHAR(20) COMMENT '电话',
    role_id INT COMMENT '角色ID',
    user_status TINYINT DEFAULT 1 COMMENT '状态：1-启用，0-禁用',
    last_login DATETIME COMMENT '最后登录时间',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY (username)
) COMMENT='用户表';

-- 角色表
CREATE TABLE roles (
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL COMMENT '角色名称',
    role_desc TEXT COMMENT '角色描述',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY (role_name)
) COMMENT='角色表';

-- 权限表
CREATE TABLE permissions (
    permission_id INT AUTO_INCREMENT PRIMARY KEY,
    permission_name VARCHAR(50) NOT NULL COMMENT '权限名称',
    permission_code VARCHAR(50) NOT NULL COMMENT '权限代码',
    permission_desc TEXT COMMENT '权限描述',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY (permission_code)
) COMMENT='权限表';

-- 角色权限关联表
CREATE TABLE role_permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_id INT NOT NULL COMMENT '角色ID',
    permission_id INT NOT NULL COMMENT '权限ID',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES roles(role_id),
    FOREIGN KEY (permission_id) REFERENCES permissions(permission_id)
) COMMENT='角色权限关联表';

-- 系统日志表
CREATE TABLE system_logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT COMMENT '用户ID',
    log_type VARCHAR(20) COMMENT '日志类型',
    log_content TEXT COMMENT '日志内容',
    ip_address VARCHAR(50) COMMENT 'IP地址',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) COMMENT='系统日志表';

-- 创建视图

-- 库存总览视图
CREATE VIEW view_inventory_summary AS
SELECT 
    CASE 
        WHEN ib.item_type = 1 THEN p.product_code
        WHEN ib.item_type = 2 THEN c.component_code
    END AS item_code,
    CASE 
        WHEN ib.item_type = 1 THEN p.product_name
        WHEN ib.item_type = 2 THEN c.component_name
    END AS item_name,
    CASE 
        WHEN ib.item_type = 1 THEN '成品'
        WHEN ib.item_type = 2 THEN '配件'
    END AS item_type_name,
    w.warehouse_name,
    l.location_code,
    ib.quantity,
    ib.reserved_quantity,
    ib.available_quantity,
    ib.batch_no,
    ib.last_transaction_date
FROM 
    inventory_balances ib
LEFT JOIN 
    products p ON ib.item_id = p.product_id AND ib.item_type = 1
LEFT JOIN 
    components c ON ib.item_id = c.component_id AND ib.item_type = 2
LEFT JOIN 
    warehouses w ON ib.warehouse_id = w.warehouse_id
LEFT JOIN 
    locations l ON ib.location_id = l.location_id;

-- 在途库存视图
CREATE VIEW view_inventory_in_transit AS
SELECT 
    c.component_code,
    c.component_name,
    s.supplier_name,
    po.order_no AS purchase_order_no,
    po.order_date,
    iit.expected_quantity,
    iit.received_quantity,
    iit.remaining_quantity,
    iit.expected_date,
    CASE 
        WHEN iit.transit_status = 1 THEN '在途'
        WHEN iit.transit_status = 2 THEN '部分到货'
        WHEN iit.transit_status = 3 THEN '全部到货'
        WHEN iit.transit_status = 4 THEN '取消'
    END AS transit_status_name
FROM 
    inventory_in_transit iit
JOIN 
    components c ON iit.component_id = c.component_id
JOIN 
    purchase_orders po ON iit.purchase_order_id = po.purchase_order_id
JOIN 
    suppliers s ON po.supplier_id = s.supplier_id;

-- 已发货未开票视图
CREATE VIEW view_delivered_not_invoiced AS
SELECT 
    so.order_no,
    so.order_date,
    c.customer_name,
    p.product_code,
    p.product_name,
    soi.quantity,
    soi.delivered_quantity,
    soi.unit_price,
    (soi.delivered_quantity * soi.unit_price) AS delivered_amount,
    COALESCE(SUM(ir.invoice_amount), 0) AS invoiced_amount,
    ((soi.delivered_quantity * soi.unit_price) - COALESCE(SUM(ir.invoice_amount), 0)) AS uninvoiced_amount
FROM 
    sales_order_items soi
JOIN 
    sales_orders so ON soi.sales_order_id = so.sales_order_id
JOIN 
    products p ON soi.product_id = p.product_id
JOIN 
    customers c ON so.customer_id = c.customer_id
LEFT JOIN 
    invoices_receivable ir ON so.sales_order_id = ir.sales_order_id
WHERE 
    soi.delivered_quantity > 0
GROUP BY 
    so.order_no, so.order_date, c.customer_name, p.product_code, p.product_name, 
    soi.quantity, soi.delivered_quantity, soi.unit_price
HAVING 
    ((soi.delivered_quantity * soi.unit_price) - COALESCE(SUM(ir.invoice_amount), 0)) > 0;

-- 已收货未开票视图
CREATE VIEW view_received_not_invoiced AS
SELECT 
    po.order_no,
    po.order_date,
    s.supplier_name,
    c.component_code,
    c.component_name,
    poi.quantity,
    poi.received_quantity,
    poi.unit_price,
    (poi.received_quantity * poi.unit_price) AS received_amount,
    COALESCE(SUM(ip.invoice_amount), 0) AS invoiced_amount,
    ((poi.received_quantity * poi.unit_price) - COALESCE(SUM(ip.invoice_amount), 0)) AS uninvoiced_amount
FROM 
    purchase_order_items poi
JOIN 
    purchase_orders po ON poi.purchase_order_id = po.purchase_order_id
JOIN 
    components c ON poi.component_id = c.component_id
JOIN 
    suppliers s ON po.supplier_id = s.supplier_id
LEFT JOIN 
    invoices_payable ip ON po.purchase_order_id = ip.purchase_order_id
WHERE 
    poi.received_quantity > 0
GROUP BY 
    po.order_no, po.order_date, s.supplier_name, c.component_code, c.component_name, 
    poi.quantity, poi.received_quantity, poi.unit_price
HAVING 
    ((poi.received_quantity * poi.unit_price) - COALESCE(SUM(ip.invoice_amount), 0)) > 0;

-- 创建存储过程

-- 成品入库自动扣减配件库存存储过程
DELIMITER //
CREATE PROCEDURE sp_product_stock_in(
    IN p_transaction_id INT,
    IN p_product_id INT,
    IN p_warehouse_id INT,
    IN p_location_id INT,
    IN p_quantity DECIMAL(10, 3),
    IN p_batch_no VARCHAR(50),
    IN p_created_by VARCHAR(50)
)
BEGIN
    DECLARE v_bom_id INT;
    DECLARE v_component_id INT;
    DECLARE v_component_qty DECIMAL(10, 3);
    DECLARE v_total_component_qty DECIMAL(10, 3);
    DECLARE v_available_qty DECIMAL(10, 3);
    DECLARE v_current_location_id INT;
    DECLARE v_transaction_no VARCHAR(50);
    DECLARE v_done INT DEFAULT FALSE;
    DECLARE v_error_message TEXT;
    
    -- 声明游标，获取BOM中的配件清单
    DECLARE cur_components CURSOR FOR 
        SELECT bd.component_id, bd.quantity
        FROM bom_headers bh
        JOIN bom_details bd ON bh.bom_id = bd.bom_id
        WHERE bh.product_id = p_product_id AND bh.bom_status = 1;
    
    -- 声明异常处理
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET v_done = TRUE;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        GET DIAGNOSTICS CONDITION 1 v_error_message = MESSAGE_TEXT;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = v_error_message;
    END;
    
    -- 开始事务
    START TRANSACTION;
    
    -- 获取BOM ID
    SELECT bom_id INTO v_bom_id
    FROM bom_headers
    WHERE product_id = p_product_id AND bom_status = 1
    LIMIT 1;
    
    -- 检查BOM是否存在
    IF v_bom_id IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = '找不到有效的BOM配置';
    END IF;
    
    -- 生成领料事务编号
    SET v_transaction_no = CONCAT('MT', DATE_FORMAT(NOW(), '%Y%m%d'), LPAD(FLOOR(RAND() * 10000), 4, '0'));
    
    -- 创建领料事务记录
    INSERT INTO inventory_transactions (
        transaction_no, 
        transaction_type, 
        transaction_date, 
        reference_no, 
        reference_type, 
        warehouse_id, 
        transaction_status, 
        transaction_remark, 
        created_by
    ) VALUES (
        v_transaction_no,
        3, -- 生产领料
        NOW(),
        (SELECT transaction_no FROM inventory_transactions WHERE transaction_id = p_transaction_id),
        '成品入库',
        p_warehouse_id,
        1,
        CONCAT('成品 ', (SELECT product_name FROM products WHERE product_id = p_product_id), ' 入库自动扣减配件'),
        p_created_by
    );
    
    -- 获取新创建的事务ID
    SET @new_transaction_id = LAST_INSERT_ID();
    
    -- 打开游标，遍历BOM中的配件
    OPEN cur_components;
    
    components_loop: LOOP
        FETCH cur_components INTO v_component_id, v_component_qty;
        
        IF v_done THEN
            LEAVE components_loop;
        END IF;
        
        -- 计算需要扣减的配件总量
        SET v_total_component_qty = p_quantity * v_component_qty;
        
        -- 检查库存是否足够
        SELECT SUM(available_quantity) INTO v_available_qty
        FROM inventory_balances
        WHERE warehouse_id = p_warehouse_id AND item_id = v_component_id AND item_type = 2;
        
        IF v_available_qty < v_total_component_qty THEN
            SIGNAL SQLSTATE '45000' 
            SET MESSAGE_TEXT = CONCAT('配件 ', (SELECT component_name FROM components WHERE component_id = v_component_id), ' 库存不足，需要 ', v_total_component_qty, '，实际可用 ', COALESCE(v_available_qty, 0));
        END IF;
        
        -- 从库存中扣减配件（先进先出原则）
        SET @remaining_qty = v_total_component_qty;
        
        -- 查找可用库存并逐个扣减
        WHILE @remaining_qty > 0 DO
            -- 找到最早入库的库存记录
            SELECT location_id, available_quantity INTO v_current_location_id, v_available_qty
            FROM inventory_balances
            WHERE warehouse_id = p_warehouse_id AND item_id = v_component_id AND item_type = 2 AND available_quantity > 0
            ORDER BY last_transaction_date ASC
            LIMIT 1;
            
            IF v_current_location_id IS NULL THEN
                SIGNAL SQLSTATE '45000' 
                SET MESSAGE_TEXT = CONCAT('配件 ', (SELECT component_name FROM components WHERE component_id = v_component_id), ' 库存不足，无法完成扣减');
            END IF;
            
            -- 确定本次扣减数量
            SET @deduct_qty = LEAST(@remaining_qty, v_available_qty);
            
            -- 创建库存事务明细
            INSERT INTO inventory_transaction_details (
                transaction_id,
                item_id,
                item_type,
                location_id,
                quantity,
                detail_remark
            ) VALUES (
                @new_transaction_id,
                v_component_id,
                2, -- 配件
                v_current_location_id,
                -@deduct_qty,
                CONCAT('成品 ', (SELECT product_name FROM products WHERE product_id = p_product_id), ' 入库自动扣减')
            );
            
            -- 更新库存余额
            UPDATE inventory_balances
            SET quantity = quantity - @deduct_qty,
                last_transaction_date = NOW()
            WHERE warehouse_id = p_warehouse_id AND location_id = v_current_location_id 
                AND item_id = v_component_id AND item_type = 2;
            
            -- 更新剩余需要扣减的数量
            SET @remaining_qty = @remaining_qty - @deduct_qty;
        END WHILE;
    END LOOP;
    
    -- 关闭游标
    CLOSE cur_components;
    
    -- 提交事务
    COMMIT;
END //
DELIMITER ;

-- 创建触发器

-- 采购订单确认后自动创建在途库存记录
DELIMITER //
CREATE TRIGGER trg_purchase_order_confirm
AFTER UPDATE ON purchase_orders
FOR EACH ROW
BEGIN
    -- 当采购订单状态从草稿变为已发送时
    IF OLD.order_status = 0 AND NEW.order_status = 1 THEN
        -- 为每个订单明细创建在途库存记录
        INSERT INTO inventory_in_transit (
            component_id,
            purchase_order_id,
            order_item_id,
            expected_quantity,
            expected_date,
            transit_status
        )
        SELECT 
            poi.component_id,
            poi.purchase_order_id,
            poi.order_item_id,
            poi.quantity,
            NEW.expected_date,
            1 -- 在途状态
        FROM 
            purchase_order_items poi
        WHERE 
            poi.purchase_order_id = NEW.purchase_order_id;
    END IF;
    
    -- 当采购订单状态变为取消时
    IF NEW.order_status = 5 AND OLD.order_status != 5 THEN
        -- 更新在途库存状态为取消
        UPDATE inventory_in_transit
        SET transit_status = 4
        WHERE purchase_order_id = NEW.purchase_order_id AND transit_status IN (1, 2);
    END IF;
END //
DELIMITER ;

-- 收货后自动更新在途库存记录
DELIMITER //
CREATE TRIGGER trg_purchase_item_received
AFTER UPDATE ON purchase_order_items
FOR EACH ROW
BEGIN
    -- 当收货数量发生变化时
    IF NEW.received_quantity != OLD.received_quantity THEN
        -- 更新在途库存记录
        UPDATE inventory_in_transit
        SET 
            received_quantity = NEW.received_quantity,
            transit_status = CASE
                WHEN NEW.received_quantity = 0 THEN 1 -- 在途
                WHEN NEW.received_quantity < NEW.quantity THEN 2 -- 部分到货
                WHEN NEW.received_quantity >= NEW.quantity THEN 3 -- 全部到货
            END
        WHERE 
            order_item_id = NEW.order_item_id;
    END IF;
END //
DELIMITER ;

-- 初始化基础数据

-- 创建默认仓库
INSERT INTO warehouses (warehouse_code, warehouse_name, warehouse_status)
VALUES ('WH001', '主仓库', 1);

-- 创建默认角色
INSERT INTO roles (role_name, role_desc)
VALUES 
('系统管理员', '系统管理员，拥有所有权限'),
('运营主管', '运营主管，负责整体业务流程'),
('销售人员', '销售人员，负责销售订单管理'),
('采购人员', '采购人员，负责采购管理'),
('仓库管理员', '仓库管理员，负责库存管理'),
('财务人员', '财务人员，负责财务管理');

-- 创建默认用户（密码为123456的MD5加密）
INSERT INTO users (username, password, real_name, role_id, user_status)
VALUES ('admin', MD5('123456'), '系统管理员', 1, 1);

-- 创建基础权限
INSERT INTO permissions (permission_name, permission_code, permission_desc)
VALUES 
('产品管理', 'product:manage', '管理产品信息'),
('配件管理', 'component:manage', '管理配件信息'),
('BOM管理', 'bom:manage', '管理BOM结构'),
('客户管理', 'customer:manage', '管理客户信息'),
('供应商管理', 'supplier:manage', '管理供应商信息'),
('销售订单管理', 'sales_order:manage', '管理销售订单'),
('采购订单管理', 'purchase_order:manage', '管理采购订单'),
('库存管理', 'inventory:manage', '管理库存'),
('财务管理', 'finance:manage', '管理财务信息'),
('系统设置', 'system:manage', '管理系统设置');

-- 为管理员角色分配所有权限
INSERT INTO role_permissions (role_id, permission_id)
SELECT 1, permission_id FROM permissions;
