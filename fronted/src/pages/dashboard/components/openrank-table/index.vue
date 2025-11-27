<template>
	<div class="openrank-table">
		<!-- 筛选器 -->
		<div class="table-filters">
			<a-space :size="8">
				<!-- 排名模式切换 -->
				<a-radio-group v-model:value="rankMode" button-style="solid" size="small" class="rank-mode-group">
					<a-radio-button value="month">月度</a-radio-button>
					<a-radio-button value="year">年度</a-radio-button>
				</a-radio-group>

				<!-- 年份选择 -->
				<a-date-picker
					v-model:value="selectedYear"
					picker="year"
					placeholder="年份"
					size="small"
					class="year-picker"
					:disabled-date="disabledYear"
					:allow-clear="false"
					@change="onYearChange"
				/>

				<!-- 月份选择（仅月度模式显示） -->
				<a-date-picker
					v-if="rankMode === 'month'"
					v-model:value="selectedMonth"
					picker="month"
					placeholder="月份"
					size="small"
					class="month-picker"
					format="M月"
					:disabled-date="disabledMonth"
					:allow-clear="false"
					@change="onMonthChange"
				/>
			</a-space>
		</div>

		<!-- 表格 -->
		<a-table
			:columns="columns"
			:data-source="tableData"
			:pagination="false"
			:loading="loading"
			size="small"
			class="openrank-table-content"
		>
			<template #bodyCell="{ column, record, index }">
				<template v-if="column.key === 'rank'">
					<div class="rank-cell" :class="`rank-${index + 1}`">
						{{ index + 1 }}
					</div>
				</template>
				<template v-if="column.key === 'project'">
					<div class="project-cell" :title="record.project">
						{{ record.project }}
					</div>
				</template>
				<template v-if="column.key === 'openrank'">
					<div class="openrank-cell">
						{{ record.openrank }}
					</div>
				</template>
			</template>
		</a-table>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import dayjs, { Dayjs } from 'dayjs';
import { getOpenRankData } from '../../service';

// 所有项目的OpenRank数据
const allProjectsData = ref<Array<any>>([]);

// 排名模式：month或year
const rankMode = ref<'month' | 'year'>('month');

// 选中的年份和月份
const selectedYear = ref<Dayjs>();
const selectedMonth = ref<Dayjs>();

const loading = ref(false);

// 表格列定义
const columns = [
	{
		title: '序号',
		key: 'rank',
		width: 80,
		align: 'center'
	},
	{
		title: '项目',
		key: 'project',
		ellipsis: true,
		align: 'center'
	},
	{
		title: 'OpenRank',
		key: 'openrank',
		width: 120,
		align: 'center'
	}
];

// 表格数据
const tableData = ref<Array<{ project: string; openrank: string }>>([]);

/**
 * 获取所有可用的日期
 */
const getAvailableDates = () => {
	const dates = new Set<string>();
	allProjectsData.value.forEach((project: any) => {
		if (project.openrank) {
			const openrankData = project.openrank;
			Object.keys(openrankData).forEach(date => {
				if (openrankData[date] !== null && openrankData[date] !== undefined) {
					dates.add(date);
				}
			});
		}
	});
	return Array.from(dates).sort().reverse(); // 降序排列，最新的在前
};

/**
 * 初始化默认选择最新月份
 */
const initDefaultDate = () => {
	const availableDates = getAvailableDates();
	if (availableDates.length > 0) {
		const latestDate = availableDates[0]; // 如: "2025-10"
		selectedMonth.value = dayjs(latestDate, 'YYYY-MM');
		selectedYear.value = dayjs(latestDate, 'YYYY-MM');
	} else {
		// 如果没有数据，默认当前月
		selectedMonth.value = dayjs();
		selectedYear.value = dayjs();
	}
};

/**
 * 计算月度排名数据
 */
const calculateMonthlyRank = (yearMonth: string) => {
	const rankings: Array<{ project: string; openrank: number }> = [];

	allProjectsData.value.forEach((project: any) => {
		if (project.openrank) {
			const openrankData = project.openrank;
			const value = openrankData[yearMonth];
			if (value !== null && value !== undefined) {
				rankings.push({
					project: `${project.company_name}/${project.project_name}`,
					openrank: parseFloat(value)
				});
			}
		}
	});

	// 排序并取前10
	rankings.sort((a, b) => b.openrank - a.openrank);
	return rankings.slice(0, 10).map(item => ({
		project: item.project,
		openrank: item.openrank.toFixed(2)
	}));
};

/**
 * 计算年度排名数据（总和）
 */
const calculateYearlyRank = (year: string) => {
	const rankings: Array<{ project: string; openrank: number }> = [];

	allProjectsData.value.forEach((project: any) => {
		if (project.openrank) {
			const openrankData = project.openrank;
			let yearTotal = 0;
			let hasData = false;

			// 遍历该年的所有月份
			Object.keys(openrankData).forEach(date => {
				if (date.startsWith(year)) {
					const value = openrankData[date];
					if (value !== null && value !== undefined) {
						yearTotal += parseFloat(value);
						hasData = true;
					}
				}
			});

			if (hasData) {
				rankings.push({
					project: `${project.company_name}/${project.project_name}`,
					openrank: yearTotal
				});
			}
		}
	});

	// 排序并取前10
	rankings.sort((a, b) => b.openrank - a.openrank);
	return rankings.slice(0, 10).map(item => ({
		project: item.project,
		openrank: item.openrank.toFixed(2)
	}));
};

/**
 * 更新表格数据
 */
const updateTableData = () => {
	loading.value = true;

	setTimeout(() => {
		if (rankMode.value === 'month' && selectedMonth.value) {
			const yearMonth = selectedMonth.value.format('YYYY-MM');
			tableData.value = calculateMonthlyRank(yearMonth);
		} else if (rankMode.value === 'year' && selectedYear.value) {
			const year = selectedYear.value.format('YYYY');
			tableData.value = calculateYearlyRank(year);
		}
		loading.value = false;
	}, 100);
};

/**
 * 禁用未来的年份
 */
const disabledYear = (current: Dayjs) => {
	return current && current.year() > dayjs().year();
};

/**
 * 禁用未来的月份
 */
const disabledMonth = (current: Dayjs) => {
	return current && current.isAfter(dayjs());
};

/**
 * 年份变化
 */
const onYearChange = () => {
	if (rankMode.value === 'year') {
		updateTableData();
	} else if (selectedMonth.value) {
		// 月度模式下，年份变化后，调整月份到同一年
		const newMonth = selectedMonth.value.year(selectedYear.value!.year());
		if (!disabledMonth(newMonth)) {
			selectedMonth.value = newMonth;
		}
	}
};

/**
 * 月份变化
 */
const onMonthChange = () => {
	selectedYear.value = selectedMonth.value;
	updateTableData();
};

// 监听排名模式变化
watch(rankMode, () => {
	updateTableData();
});

/**
 * 加载所有项目的OpenRank数据
 */
const loadOpenRankData = async () => {
	loading.value = true;
	try {
		const res = await getOpenRankData();
		if (res.code === 200) {
			allProjectsData.value = res.data || [];
			initDefaultDate();
			updateTableData();
		}
	} catch (error) {
		console.error('Failed to load OpenRank data:', error);
	} finally {
		loading.value = false;
	}
};

// 组件挂载时初始化
onMounted(() => {
	loadOpenRankData();
});
</script>

<style lang="scss" scoped>
.openrank-table {
	height: 100%;
	display: flex;
	flex-direction: column;
	padding: 8px;

	.table-filters {
		margin-bottom: 12px;
		display: flex;
		align-items: center;
		flex-shrink: 0;

		:deep(.ant-space) {
			flex-wrap: nowrap !important;
		}

		.rank-mode-group {
			:deep(.ant-radio-button-wrapper) {
				min-width: 50px;
				padding: 0 10px;
				font-size: 13px;
			}
		}

		.year-picker {
			width: 85px !important;
		}

		.month-picker {
			width: 75px !important;
		}

		:deep(.ant-radio-group) {
			.ant-radio-button-wrapper {
				background: rgba(15, 23, 42, 0.6);
				border-color: rgba(56, 189, 248, 0.3);
				color: #94a3b8;

				&:hover {
					color: #38bdf8;
				}

				&.ant-radio-button-wrapper-checked {
					background: rgba(56, 189, 248, 0.2);
					border-color: #38bdf8;
					color: #38bdf8;
				}
			}
		}

		:deep(.ant-picker) {
			background: rgba(15, 23, 42, 0.6);
			border-color: rgba(56, 189, 248, 0.3);

			.ant-picker-input > input {
				color: #e2e8f0;
				font-size: 13px;

				&::placeholder {
					color: #64748b;
					font-size: 12px;
				}
			}

			.ant-picker-suffix {
				color: #94a3b8;
			}

			&:hover {
				border-color: rgba(56, 189, 248, 0.6);
			}
		}
	}

	.openrank-table-content {
		flex: 1;
		overflow: hidden;

		:deep(.ant-table) {
			background: transparent;
			color: #e2e8f0;

			.ant-table-body {
				max-height: 500px;
				overflow-y: auto;
				overflow-x: hidden;

				/* 隐藏滚动条 */
				&::-webkit-scrollbar {
					width: 0;
					height: 0;
				}

				scrollbar-width: none;
				-ms-overflow-style: none;
			}

			.ant-table-thead > tr > th {
				background: rgba(15, 23, 42, 0.8);
				border-bottom: 1px solid rgba(56, 189, 248, 0.3);
				color: #38bdf8;
				font-weight: 600;
				padding: 12px 8px;
			}

			.ant-table-tbody > tr {
				background: rgba(15, 23, 42, 0.4);

				&:hover > td {
					background: rgba(56, 189, 248, 0.1);
				}

				> td {
					border-bottom: 1px solid rgba(56, 189, 248, 0.1);
					padding: 14px 8px;
					vertical-align: middle;
				}
			}

			.ant-table-placeholder {
				background: rgba(15, 23, 42, 0.4);
				color: #64748b;

				.ant-empty-description {
					color: #64748b;
				}
			}
		}

		.rank-cell {
			font-weight: 600;
			font-size: 14px;

			&.rank-1 {
				color: #fbbf24;
			}

			&.rank-2 {
				color: #94a3b8;
			}

			&.rank-3 {
				color: #f59e0b;
			}
		}

		.project-cell {
			color: #e2e8f0;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		.openrank-cell {
			color: #38bdf8;
			font-weight: 500;
			font-family: 'Consolas', 'Monaco', monospace;
		}
	}
}

</style>
