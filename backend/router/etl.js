const express = require('express');
const router = express.Router();

const etl_handler = require('../router_handler/etl');

// 检查项目是否存在
router.get('/check/:owner/:repo', etl_handler.checkProject);

// 执行ETL处理
router.post('/process', etl_handler.processETL);

module.exports = router;
