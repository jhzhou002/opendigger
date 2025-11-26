const axios = require('axios');
const https = require('https');

// 不使用代理，直接访问
const httpsAgent = new https.Agent({ rejectUnauthorized: false });
const axiosConfig = {
  httpsAgent,
  timeout: 10000,
  proxy: false
};

const logRequestError = (title, url, error) => {
  console.error(`${title}:`, {
    message: error.message,
    status: error.response?.status,
    statusText: error.response?.statusText,
    url
  });
};

/**
 * 从OpenDigger提取数据
 */
class DataExtractor {
  constructor(owner, repo) {
    this.owner = owner;
    this.repo = repo;
    this.baseUrl = `https://oss.open-digger.cn/github/${owner}/${repo}`;
  }

  /**
   * 构建请求配置，允许覆盖某些字段
   */
  buildRequestConfig(overrides = {}) {
    return { ...axiosConfig, ...overrides };
  }

  /**
   * 检查项目是否存在
   */
  async checkExists() {
    const url = `${this.baseUrl}/meta.json`;
    try {
      console.log(`检查项目: ${url}`);
      const response = await axios.get(url, this.buildRequestConfig());
      return { exists: true, meta: response.data };
    } catch (error) {
      logRequestError('检查项目错误', url, error);

      if (error.response && error.response.status === 404) {
        return { exists: false, message: 'OpenDigger暂无该项目数据' };
      }

      throw new Error(`检查项目失败: ${error.message}`);
    }
  }

  /**
   * 获取所有需要的JSON指标
   */
  async fetchAllMetrics() {
    const metrics = [
      'openrank',
      'stars',
      'technical_fork',
      'issues_new',
      'issues_closed',
      'issue_response_time',
      'issue_resolution_duration',
      'issue_comments',
      'change_requests',
      'change_requests_accepted',
      'change_requests_reviews',
      'change_request_response_time',
      'change_request_resolution_duration',
      'new_contributors'
    ];

    const results = {};
    const promises = metrics.map(async (metric) => {
      const url = `${this.baseUrl}/${metric}.json`;
      try {
        const response = await axios.get(url, this.buildRequestConfig());
        results[metric] = response.data;
      } catch (error) {
        console.warn(`指标 ${metric} 获取失败:`, error.message);
        results[metric] = null;
      }
    });

    await Promise.all(promises);
    return results;
  }

  /**
   * 获取指定的单个指标
   */
  async fetchMetric(metricName) {
    const url = `${this.baseUrl}/${metricName}.json`;
    try {
      const response = await axios.get(url, this.buildRequestConfig());
      return response.data;
    } catch (error) {
      console.warn(`指标 ${metricName} 获取失败:`, error.message);
      return null;
    }
  }
}

module.exports = DataExtractor;
