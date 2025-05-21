# 安装指南

本文档提供了在不同操作系统上安装和运行上海翔珑科技有限公司ERP系统的详细步骤。

## 目录

- [通用前提条件](#通用前提条件)
- [Linux环境安装](#linux环境安装)
- [Windows环境安装](#windows环境安装)
- [macOS (Intel芯片)环境安装](#macos-intel芯片环境安装)
- [macOS (M1/M2芯片)环境安装](#macos-m1m2芯片环境安装)
- [生产环境部署](#生产环境部署)
- [常见问题](#常见问题)

## 通用前提条件

无论您使用哪种操作系统，都需要安装以下软件：

1. **Node.js** (v14+)
2. **MySQL** (v8.0+)
3. **Git** (可选，用于版本控制)

## Linux环境安装

### 安装前提条件

1. 安装Node.js：
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

2. 安装MySQL：
   ```bash
   sudo apt-get install mysql-server
   sudo systemctl start mysql
   sudo systemctl enable mysql
   ```

3. 安装Git (如需)：
   ```bash
   sudo apt-get install git
   ```

### 数据库设置

1. 设置MySQL密码：
   ```bash
   sudo mysql_secure_installation
   ```

2. 创建数据库：
   ```bash
   mysql -u root -p
   CREATE DATABASE xianglong_erp;
   exit;
   ```

3. 导入数据库脚本：
   ```bash
   mysql -u root -p xianglong_erp < /path/to/xianglong_erp.sql
   ```

### 后端设置

1. 解压项目文件到本地目录
2. 进入后端目录：
   ```bash
   cd /path/to/xianglong-erp/backend
   ```

3. 复制环境变量示例文件：
   ```bash
   cp .env.example .env
   ```

4. 编辑.env文件，修改数据库连接信息：
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=xianglong_erp
   DB_PORT=3306
   ```

5. 安装依赖：
   ```bash
   npm install
   ```

6. 启动后端服务：
   ```bash
   npm start
   ```

### 前端设置

1. 打开新的终端窗口，进入前端目录：
   ```bash
   cd /path/to/xianglong-erp/frontend
   ```

2. 复制环境变量示例文件：
   ```bash
   cp .env.example .env.local
   ```

3. 编辑.env.local文件，确保API地址正确：
   ```
   VUE_APP_API_URL=http://localhost:3000/api
   ```

4. 安装依赖：
   ```bash
   npm install
   ```

5. 启动前端开发服务器：
   ```bash
   npm run serve
   ```

## Windows环境安装

### 安装前提条件

1. 安装Node.js：
   - 从[Node.js官网](https://nodejs.org/)下载并安装最新的LTS版本

2. 安装MySQL：
   - 从[MySQL官网](https://dev.mysql.com/downloads/installer/)下载并安装MySQL安装程序
   - 按照安装向导完成安装，记住设置的root密码

3. 安装Git (可选)：
   - 从[Git官网](https://git-scm.com/download/win)下载并安装

### 数据库设置

1. 打开MySQL Workbench或命令行工具
2. 创建数据库：
   ```sql
   CREATE DATABASE xianglong_erp;
   ```
3. 导入数据库脚本：
   ```
   mysql -u root -p xianglong_erp < 路径\到\xianglong_erp.sql
   ```
   或者在MySQL Workbench中打开并执行SQL脚本文件

### 后端设置

1. 解压项目文件到本地目录
2. 打开命令提示符(CMD)或PowerShell，进入后端目录：
   ```
   cd 路径\到\xianglong-erp\backend
   ```
3. 复制环境变量示例文件：
   ```
   copy .env.example .env
   ```
4. 使用文本编辑器(如记事本或VS Code)编辑.env文件，修改数据库连接信息：
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=xianglong_erp
   DB_PORT=3306
   ```
5. 安装依赖：
   ```
   npm install
   ```
6. 启动后端服务：
   ```
   npm start
   ```

### 前端设置

1. 打开新的命令提示符(CMD)或PowerShell窗口，进入前端目录：
   ```
   cd 路径\到\xianglong-erp\frontend
   ```
2. 复制环境变量示例文件：
   ```
   copy .env.example .env.local
   ```
3. 编辑.env.local文件，确保API地址正确：
   ```
   VUE_APP_API_URL=http://localhost:3000/api
   ```
4. 安装依赖：
   ```
   npm install
   ```
5. 启动前端开发服务器：
   ```
   npm run serve
   ```

### Windows特有的注意事项

1. **路径分隔符**：Windows使用反斜杠(\)作为路径分隔符，而项目中可能使用的是正斜杠(/)。在配置文件中需要注意这一点。
2. **端口占用**：如果3000或8080端口被占用，可以在后端的.env文件中修改PORT参数，前端则需要在package.json中的scripts部分添加--port参数。
3. **权限问题**：确保您有足够的权限来访问和修改项目目录和数据库。
4. **防火墙设置**：可能需要在Windows防火墙中允许Node.js应用程序通过。

## macOS (Intel芯片)环境安装

### 安装前提条件

1. 安装Homebrew (如果尚未安装)：
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

2. 安装Node.js：
   ```bash
   brew install node
   ```

3. 安装MySQL：
   ```bash
   brew install mysql
   brew services start mysql
   ```

4. 安装Git (如需)：
   ```bash
   brew install git
   ```

### 数据库设置

1. 设置MySQL密码（如果是首次安装）：
   ```bash
   mysql_secure_installation
   ```

2. 创建数据库：
   ```bash
   mysql -u root -p
   CREATE DATABASE xianglong_erp;
   exit;
   ```

3. 导入数据库脚本：
   ```bash
   mysql -u root -p xianglong_erp < /path/to/xianglong_erp.sql
   ```

### 后端设置

1. 解压项目文件到本地目录
2. 打开终端，进入后端目录：
   ```bash
   cd /path/to/xianglong-erp/backend
   ```

3. 复制环境变量示例文件：
   ```bash
   cp .env.example .env
   ```

4. 编辑.env文件，修改数据库连接信息：
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=xianglong_erp
   DB_PORT=3306
   ```

5. 安装依赖：
   ```bash
   npm install
   ```

6. 启动后端服务：
   ```bash
   npm start
   ```

### 前端设置

1. 打开新的终端窗口，进入前端目录：
   ```bash
   cd /path/to/xianglong-erp/frontend
   ```

2. 复制环境变量示例文件：
   ```bash
   cp .env.example .env.local
   ```

3. 编辑.env.local文件，确保API地址正确：
   ```
   VUE_APP_API_URL=http://localhost:3000/api
   ```

4. 安装依赖：
   ```bash
   npm install
   ```

5. 启动前端开发服务器：
   ```bash
   npm run serve
   ```

## macOS (M1/M2芯片)环境安装

### 安装前提条件

1. 安装Homebrew (如果尚未安装)：
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

2. 安装Node.js：
   ```bash
   brew install node
   ```

3. 安装MySQL：
   ```bash
   brew install mysql
   brew services start mysql
   ```

4. 安装Git (如需)：
   ```bash
   brew install git
   ```

### 数据库设置

1. 设置MySQL密码（如果是首次安装）：
   ```bash
   mysql_secure_installation
   ```

2. 创建数据库：
   ```bash
   mysql -u root -p
   CREATE DATABASE xianglong_erp;
   exit;
   ```

3. 导入数据库脚本：
   ```bash
   mysql -u root -p xianglong_erp < /path/to/xianglong_erp.sql
   ```

### 后端设置

1. 解压项目文件到本地目录
2. 打开终端，进入后端目录：
   ```bash
   cd /path/to/xianglong-erp/backend
   ```

3. 复制环境变量示例文件：
   ```bash
   cp .env.example .env
   ```

4. 编辑.env文件，修改数据库连接信息：
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=xianglong_erp
   DB_PORT=3306
   ```

5. 安装依赖：
   ```bash
   npm install
   ```
   
   注意：某些原生依赖可能需要为ARM架构重新编译，如果遇到问题，可以尝试：
   ```bash
   npm install --arch=arm64 --platform=darwin
   ```

6. 启动后端服务：
   ```bash
   npm start
   ```

### 前端设置

1. 打开新的终端窗口，进入前端目录：
   ```bash
   cd /path/to/xianglong-erp/frontend
   ```

2. 复制环境变量示例文件：
   ```bash
   cp .env.example .env.local
   ```

3. 编辑.env.local文件，确保API地址正确：
   ```
   VUE_APP_API_URL=http://localhost:3000/api
   ```

4. 安装依赖：
   ```bash
   npm install
   ```

5. 启动前端开发服务器：
   ```bash
   npm run serve
   ```

### M1/M2芯片特有的注意事项

1. **Rosetta 2兼容性**：某些未针对ARM架构优化的Node.js包可能需要通过Rosetta 2运行。如果遇到兼容性问题，可以尝试在Rosetta终端中运行安装命令。

2. **原生模块编译**：某些需要编译的模块可能需要额外的配置。确保已安装Xcode命令行工具：
   ```bash
   xcode-select --install
   ```

3. **性能优化**：M1/M2芯片上的Node.js性能通常非常好，但某些未优化的库可能表现不佳。如果发现性能问题，可以考虑寻找ARM原生替代方案。

## 生产环境部署

### Linux/macOS生产环境部署

1. 前端构建：
   ```bash
   cd /path/to/xianglong-erp/frontend
   npm run build
   ```
   将生成的dist目录部署到Web服务器（如Nginx或Apache）

2. 后端部署：
   - 修改.env文件中的NODE_ENV为production
   - 安装PM2：`npm install -g pm2`
   - 启动应用：`pm2 start src/app.js --name xianglong-erp`
   - 设置开机自启：`pm2 startup` 然后按照提示操作
   - 保存PM2进程列表：`pm2 save`

3. 配置Nginx（推荐）：
   ```
   server {
       listen 80;
       server_name your_domain.com;

       location / {
           root /path/to/xianglong-erp/frontend/dist;
           try_files $uri $uri/ /index.html;
       }

       location /api {
           proxy_pass http://localhost:3000/api;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

### Windows生产环境部署

1. 前端构建：
   ```
   cd 路径\到\xianglong-erp\frontend
   npm run build
   ```
   将生成的dist目录部署到IIS或其他Web服务器

2. 后端部署：
   - 修改.env文件中的NODE_ENV为production
   - 安装PM2：`npm install -g pm2`
   - 启动应用：`pm2 start src/app.js --name xianglong-erp`
   - 设置开机自启：`pm2 startup` 然后按照提示操作
   - 保存PM2进程列表：`pm2 save`

3. 配置IIS（可选）：
   - 安装URL Rewrite模块
   - 配置反向代理将/api请求转发到Node.js服务

## 常见问题

### 数据库连接问题

**问题**：无法连接到MySQL数据库
**解决方案**：
1. 确认MySQL服务正在运行
2. 检查.env文件中的数据库连接信息是否正确
3. 确认MySQL用户有足够的权限
4. 检查防火墙设置是否允许3306端口

### 端口占用问题

**问题**：启动服务时提示端口已被占用
**解决方案**：
1. 后端：在.env文件中修改PORT参数
2. 前端：修改启动命令为`npm run serve -- --port=8081`

### 依赖安装问题

**问题**：npm install命令失败
**解决方案**：
1. 尝试使用`npm cache clean --force`清除npm缓存
2. 确保Node.js版本兼容（推荐v14+）
3. 在M1/M2 Mac上，尝试使用`npm install --arch=arm64 --platform=darwin`

### 前端无法连接后端API

**问题**：前端页面加载但无法获取数据
**解决方案**：
1. 确认后端服务正在运行
2. 检查.env.local文件中的API地址是否正确
3. 检查浏览器控制台是否有CORS错误，如有，确保后端已正确配置CORS

### 登录问题

**问题**：无法使用默认账户登录
**解决方案**：
1. 确认数据库脚本已正确导入
2. 默认账户为：用户名 admin，密码 123456
3. 如果仍然无法登录，可以在数据库中直接重置密码：
   ```sql
   UPDATE users SET password = '$2a$10$X7aPRvRRZ5/wd2hfgRJKEOTRKTANGwC3XfmYvtakL8.iCY3cVJkJa' WHERE username = 'admin';
   ```
   这将密码重置为"123456"
