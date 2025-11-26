const ETLProcessor = require('../services/etlProcessor');
const DataExtractor = require('../services/dataExtractor');
const db = require('../db/promise');

/**
 * 检查项目是否存在
 * GET /api/etl/check/:owner/:repo
 */
exports.checkProject = async (req, res) => {
  try {
    const { owner, repo } = req.params;

    // 1. 检查OpenDigger是否有数据
    const extractor = new DataExtractor(owner, repo);
    const opendiggerResult = await extractor.checkExists();

    if (!opendiggerResult.exists) {
      return res.json({
        success: false,
        opendiggerExists: false,
        dbExists: false,
        message: 'OpenDigger暂无该项目数据'
      });
    }

    // 2. 检查数据库是否已有该项目
    const sql = 'SELECT project_id FROM github WHERE company_name = ? AND project_name = ?';
    const [results] = await db.query(sql, [owner, repo]);

    const dbExists = results.length > 0;

    res.json({
      success: true,
      opendiggerExists: true,
      dbExists,
      message: dbExists
        ? '该项目已存在于数据库中'
        : '项目可以添加',
      meta: opendiggerResult.meta
    });
  } catch (error) {
    console.error('检查项目失败', error);
    res.status(500).json({
      success: false,
      message: `检查失败: ${error.message}`
    });
  }
};

/**
 * 执行ETL处理
 * POST /api/etl/process
 * Body: { owner: string, repo: string }
 */
exports.processETL = async (req, res) => {
  try {
    const { owner, repo } = req.body;

    if (!owner || !repo) {
      return res.status(400).json({
        success: false,
        message: '缺少owner或repo参数'
      });
    }

    const processor = new ETLProcessor(owner, repo);
    const result = await processor.process();

    res.json(result);
  } catch (error) {
    console.error('ETL处理失败:', error);
    res.status(500).json({
      success: false,
      message: `ETL处理失败: ${error.message}`
    });
  }
};
