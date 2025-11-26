/**
 * 数据转换服务
 * 负责时间对齐、缺失值处理、归一化等
 */
class DataTransformer {
  constructor(baseline) {
    this.baseline = baseline;
    this.timeRange = this.generateTimeRange('2021-01', '2025-10');
  }

  /**
   * 生成时间范围数组
   */
  generateTimeRange(start, end) {
    const range = [];
    const [startYear, startMonth] = start.split('-').map(Number);
    const [endYear, endMonth] = end.split('-').map(Number);

    for (let year = startYear; year <= endYear; year++) {
      const monthStart = year === startYear ? startMonth : 1;
      const monthEnd = year === endYear ? endMonth : 12;

      for (let month = monthStart; month <= monthEnd; month++) {
        range.push(`${year}-${String(month).padStart(2, '0')}`);
      }
    }
    return range;
  }

  /**
   * 对齐时间轴并填充缺失值
   */
  alignTimeSeries(data, fillStrategy = 'zero') {
    const aligned = {};

    this.timeRange.forEach(month => {
      if (data && data[month] !== undefined && data[month] !== null) {
        aligned[month] = data[month];
      } else {
        // 根据策略填充
        if (fillStrategy === 'zero') {
          aligned[month] = 0;
        } else if (fillStrategy === 'forward') {
          // 向前填充
          const prevMonths = this.timeRange.slice(0, this.timeRange.indexOf(month));
          let lastValue = null;
          for (let i = prevMonths.length - 1; i >= 0; i--) {
            if (aligned[prevMonths[i]] !== null && aligned[prevMonths[i]] !== undefined) {
              lastValue = aligned[prevMonths[i]];
              break;
            }
          }
          aligned[month] = lastValue !== null ? lastValue : 0;
        } else if (fillStrategy === 'null') {
          aligned[month] = null;
        }
      }
    });

    return aligned;
  }

  /**
   * Min-Max归一化
   */
  minMaxNorm(value, min, max) {
    if (max === min) return 0;
    return (value - min) / (max - min);
  }

  /**
   * 标准化归一化（z-score + min-max）
   */
  stdNorm(series) {
    const values = Object.values(series).filter(v => v !== null && !isNaN(v));
    if (values.length === 0) return series;

    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const std = Math.sqrt(values.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / values.length);

    const zScores = {};
    Object.keys(series).forEach(key => {
      if (series[key] !== null && !isNaN(series[key])) {
        zScores[key] = std !== 0 ? (series[key] - mean) / std : 0;
      } else {
        zScores[key] = 0;
      }
    });

    // 再做一次min-max
    const zValues = Object.values(zScores);
    const zMin = Math.min(...zValues);
    const zMax = Math.max(...zValues);

    const normalized = {};
    Object.keys(zScores).forEach(key => {
      normalized[key] = this.minMaxNorm(zScores[key], zMin, zMax);
    });

    return normalized;
  }

  /**
   * 反向评分（越小越好的指标）
   */
  reverseScore(series) {
    const normalized = this.minMaxNormSeries(series);
    const reversed = {};
    Object.keys(normalized).forEach(key => {
      reversed[key] = 1 - normalized[key];
    });
    return reversed;
  }

  /**
   * 对时间序列做min-max归一化
   */
  minMaxNormSeries(series) {
    const values = Object.values(series).filter(v => v !== null && !isNaN(v));
    if (values.length === 0) return series;

    const min = Math.min(...values);
    const max = Math.max(...values);

    const normalized = {};
    Object.keys(series).forEach(key => {
      if (series[key] !== null && !isNaN(series[key])) {
        normalized[key] = this.minMaxNorm(series[key], min, max);
      } else {
        normalized[key] = 0;
      }
    });

    return normalized;
  }

  /**
   * Log压缩
   */
  logCompress(series) {
    const compressed = {};
    Object.keys(series).forEach(key => {
      const val = series[key];
      compressed[key] = val !== null && !isNaN(val) ? Math.log1p(val) : 0;
    });
    return compressed;
  }

  /**
   * 计算时间序列的平均值
   */
  calculateAverage(series) {
    const values = Object.values(series).filter(v => v !== null && !isNaN(v));
    if (values.length === 0) return 0;
    return values.reduce((a, b) => a + b, 0) / values.length;
  }

  /**
   * 计算增长率
   */
  calculateGrowthRate(series) {
    const months = this.timeRange;
    const growthRates = [];

    for (let i = 1; i < months.length; i++) {
      const prev = series[months[i - 1]];
      const curr = series[months[i]];

      if (prev !== null && prev !== 0 && curr !== null) {
        growthRates.push((curr - prev) / prev);
      }
    }

    return growthRates.length > 0
      ? growthRates.reduce((a, b) => a + b, 0) / growthRates.length
      : 0;
  }
}

module.exports = DataTransformer;
