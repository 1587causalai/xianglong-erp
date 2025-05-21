'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const sequelize = require('../config/database');
const basename = path.basename(__filename);
const db = {};

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const loaded = require(path.join(__dirname, file));
    
    // 检查导出的内容是单个模型还是包含模型的对象
    if (loaded && loaded.sequelize && loaded.sequelize.isDefined && loaded.name) { // 单个 Sequelize 模型
      db[loaded.name] = loaded;
    } else if (typeof loaded === 'object' && loaded !== null) { // 包含多个模型的对象
      Object.keys(loaded).forEach(keyInExport => {
        const potentialModel = loaded[keyInExport];
        if (potentialModel && potentialModel.sequelize && potentialModel.sequelize.isDefined && potentialModel.name) {
          db[potentialModel.name] = potentialModel;
        } else {
          // console.warn(`Property '${keyInExport}' in ${file} is not a valid Sequelize model or lacks a name.`);
        }
      });
    } else {
      console.warn(`File ${file} does not export a recognized Sequelize model or an object of models.`);
    }
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName] && typeof db[modelName].associate === 'function') {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db; 