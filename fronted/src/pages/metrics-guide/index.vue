<template>
	<div class="metrics-guide-page">
		<div class="guide-container">
			<h1 class="page-title">OpenInsight 指标说明</h1>
			<p class="page-subtitle">全面了解 OpenInsight 平台使用的各项开源项目评估指标</p>

			<div class="metrics-section">
				<h2 class="section-title">📊 GitHub 指数 (GitHub Index)</h2>
				<div class="metric-card">
					<h3>指数构成</h3>
					<p>GitHub 指数是综合评估开源项目整体质量的复合指标,由四个维度组成:</p>
					<ul class="metric-list">
						<li>
							<strong>影响力 (Influence):</strong>
							<code>0.25 × stars + 0.25 × forks + 0.3 × issues + 0.2 × pull_requests</code>
							<p class="metric-desc">衡量项目在开源社区的影响范围和受欢迎程度</p>
						</li>
						<li>
							<strong>反应力 (Reaction):</strong>
							<code>0.5 × issue_comments + 0.5 × pr_reviews</code>
							<p class="metric-desc">衡量社区对项目问题和贡献的响应活跃度</p>
						</li>
						<li>
							<strong>开发者活跃度 (Developer Activity):</strong>
							<code>0.5 × new_contributors + 0.5 × openrank</code>
							<p class="metric-desc">评估项目吸引新贡献者的能力和开发团队的活跃程度</p>
						</li>
						<li>
							<strong>趋势 (Trend):</strong>
							<code>sqrt(stars_growth)</code>
							<p class="metric-desc">通过 Star 增长率衡量项目的发展趋势(使用平方根平滑)</p>
						</li>
					</ul>
				</div>

				<div class="metric-card">
					<h3>计算方法</h3>
					<ol class="numbered-list">
						<li>基于 Top300 项目计算各维度的 min 和 max 值作为 Baseline</li>
						<li>对新项目的原始指标进行归一化: <code>(value - min) / (max - min)</code></li>
						<li>将归一化后的值映射到 60-100 分区间: <code>60 + normalized × 40</code></li>
						<li>对四个维度的分数进行加权平均得到最终 GitHub 指数</li>
					</ol>
				</div>
			</div>

			<div class="metrics-section">
				<h2 class="section-title">⚡ PREI 指数 (PR & Issue Efficiency Index)</h2>
				<div class="metric-card">
					<h3>指数构成</h3>
					<p>PREI 指数专注于评估项目处理 Pull Request 和 Issue 的效率,包含四个维度:</p>
					<ul class="metric-list">
						<li>
							<strong>响应速度 (Response):</strong>
							<code>issue_response_time + pr_response_time</code>
							<p class="metric-desc">评估项目对 Issue 和 PR 的首次响应速度(对数压缩后逆向评分)</p>
						</li>
						<li>
							<strong>解决速度 (Resolution):</strong>
							<code>issue_resolution_duration + pr_resolution_duration</code>
							<p class="metric-desc">评估从创建到关闭的平均时长(对数压缩后逆向评分)</p>
						</li>
						<li>
							<strong>审查效率 (Review):</strong>
							<code>pr_reviews / pull_requests</code>
							<p class="metric-desc">平均每个 PR 收到的 Review 数量(对数压缩)</p>
						</li>
						<li>
							<strong>接受率 (Accept):</strong>
							<code>merged_prs / total_prs</code>
							<p class="metric-desc">Pull Request 的合并成功率</p>
						</li>
					</ul>
				</div>

				<div class="metric-card">
					<h3>计算方法</h3>
					<ol class="numbered-list">
						<li>对时间类指标进行对数压缩: <code>log(value + 1)</code></li>
						<li>时间指标采用逆向评分(越短越好): <code>1 - normalized</code></li>
						<li>基于 Top300 项目的 Baseline 进行归一化</li>
						<li>映射到 60-100 分区间并加权平均</li>
					</ol>
				</div>
			</div>

			<div class="metrics-section">
				<h2 class="section-title">📈 OpenRank</h2>
				<div class="metric-card">
					<h3>指标说明</h3>
					<p>
						OpenRank 是基于开源协作网络的影响力评估算法,类似于 Google PageRank。
						它不仅考虑贡献者的数量,更重视贡献者之间的协作关系和影响力传递。
					</p>
					<ul class="metric-list">
						<li>
							<strong>网络模型:</strong>
							<p class="metric-desc">将开源项目构建为协作网络,贡献者和项目都是节点,贡献关系是边</p>
						</li>
						<li>
							<strong>影响力传递:</strong>
							<p class="metric-desc">高影响力贡献者的参与会提升项目的 OpenRank 值</p>
						</li>
						<li>
							<strong>动态计算:</strong>
							<p class="metric-desc">随着协作网络的变化,OpenRank 值会动态更新</p>
						</li>
					</ul>
				</div>
			</div>

			<div class="metrics-section">
				<h2 class="section-title">🔄 数据来源与更新</h2>
				<div class="metric-card">
					<h3>数据来源</h3>
					<p>所有指标数据均来自 <a href="https://github.com/X-lab2017/open-digger" target="_blank" class="link">X-lab OpenDigger</a> 项目,该项目提供了丰富的开源项目元数据和分析指标。</p>
				</div>

				<div class="metric-card">
					<h3>更新频率</h3>
					<ul class="metric-list">
						<li><strong>Top300 项目:</strong> 每月自动更新一次</li>
						<li><strong>Baseline 数据:</strong> 随 Top300 数据更新而重新计算</li>
						<li><strong>新导入项目:</strong> 实时计算指标并使用最新的 Baseline</li>
					</ul>
				</div>
			</div>

			<div class="metrics-section">
				<h2 class="section-title">💡 使用建议</h2>
				<div class="metric-card">
					<ul class="metric-list">
						<li>
							<strong>综合评估:</strong>
							<p class="metric-desc">不要只看单一指标,应综合 GitHub 指数、PREI 指数和 OpenRank 进行评估</p>
						</li>
						<li>
							<strong>趋势观察:</strong>
							<p class="metric-desc">关注项目的历史趋势,而不仅是当前的绝对值</p>
						</li>
						<li>
							<strong>同类对比:</strong>
							<p class="metric-desc">在相似类型或规模的项目间进行对比更有意义</p>
						</li>
						<li>
							<strong>结合实际:</strong>
							<p class="metric-desc">指标是参考工具,最终决策还需结合项目实际情况和业务需求</p>
						</li>
					</ul>
				</div>
			</div>

			<div class="back-btn-container">
				<button class="back-btn" @click="goBack">返回</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const goBack = () => {
	router.back();
};
</script>

<style lang="scss" scoped>
.metrics-guide-page {
	min-height: calc(100vh - 64px);
	background: #060c20;
	padding: 40px 20px;
	overflow-y: auto;
}

.guide-container {
	max-width: 1200px;
	margin: 0 auto;
}

.page-title {
	text-align: center;
	font-size: 36px;
	font-weight: 700;
	margin-bottom: 12px;
	background: linear-gradient(135deg, #e2e8f0 0%, #94a3b8 100%);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	background-clip: text;
}

.page-subtitle {
	text-align: center;
	color: #94a3b8;
	font-size: 16px;
	margin-bottom: 48px;
}

.metrics-section {
	margin-bottom: 48px;
}

.section-title {
	font-size: 28px;
	font-weight: 600;
	color: #e2e8f0;
	margin-bottom: 24px;
	padding-bottom: 12px;
	border-bottom: 2px solid rgba(56, 189, 248, 0.3);
}

.metric-card {
	background: rgba(15, 23, 42, 0.6);
	backdrop-filter: blur(10px);
	border: 1px solid rgba(56, 189, 248, 0.2);
	border-radius: 12px;
	padding: 24px;
	margin-bottom: 20px;

	h3 {
		font-size: 20px;
		font-weight: 600;
		color: #38bdf8;
		margin-bottom: 16px;
	}

	p {
		color: #cbd5e1;
		line-height: 1.8;
		margin-bottom: 12px;
	}
}

.metric-list {
	list-style: none;
	padding: 0;

	li {
		margin-bottom: 20px;
		padding: 16px;
		background: rgba(30, 41, 59, 0.4);
		border-radius: 8px;
		border-left: 3px solid #38bdf8;

		strong {
			color: #38bdf8;
			font-size: 16px;
			display: block;
			margin-bottom: 8px;
		}

		code {
			display: block;
			background: rgba(0, 0, 0, 0.3);
			padding: 8px 12px;
			border-radius: 6px;
			font-family: 'Consolas', 'Monaco', monospace;
			font-size: 13px;
			color: #6ee7b7;
			margin: 8px 0;
			overflow-x: auto;
		}

		.metric-desc {
			color: #94a3b8;
			font-size: 14px;
			margin: 8px 0 0 0;
		}
	}
}

.numbered-list {
	padding-left: 20px;

	li {
		color: #cbd5e1;
		line-height: 1.8;
		margin-bottom: 12px;

		code {
			display: inline-block;
			background: rgba(0, 0, 0, 0.3);
			padding: 2px 8px;
			border-radius: 4px;
			font-family: 'Consolas', 'Monaco', monospace;
			font-size: 13px;
			color: #6ee7b7;
		}
	}
}

.link {
	color: #38bdf8;
	text-decoration: none;
	border-bottom: 1px solid transparent;
	transition: border-color 0.3s;

	&:hover {
		border-bottom-color: #38bdf8;
	}
}

.back-btn-container {
	text-align: center;
	margin-top: 48px;
	padding-bottom: 20px;
}

.back-btn {
	padding: 12px 32px;
	background: linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%);
	border: 1px solid rgba(56, 189, 248, 0.3);
	border-radius: 8px;
	color: white;
	font-size: 16px;
	font-weight: 600;
	cursor: pointer;
	transition: all 0.3s;

	&:hover {
		background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
		transform: translateY(-2px);
		box-shadow: 0 4px 16px rgba(56, 189, 248, 0.6);
	}
}

@media (max-width: 768px) {
	.page-title {
		font-size: 28px;
	}

	.page-subtitle {
		font-size: 14px;
	}

	.section-title {
		font-size: 22px;
	}

	.metric-card {
		padding: 16px;

		h3 {
			font-size: 18px;
		}
	}

	.metric-list li {
		padding: 12px;

		strong {
			font-size: 15px;
		}

		code {
			font-size: 12px;
		}
	}
}
</style>
