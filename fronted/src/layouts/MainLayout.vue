<template>
	<div class="main-layout">
		<header class="nav-header">
			<div class="nav-container">
				<!-- 左侧：Logo + 平台名称 -->
				<div class="nav-left">
					<div class="nav-logo">
						<div class="logo-icon">🚀</div>
						<h1 class="platform-name">OpenInsight</h1>
					</div>
				</div>

				<!-- 中间：主导航 -->
				<nav class="nav-center">
					<router-link to="/search" class="nav-link" active-class="active">
						项目搜索
					</router-link>
					<span class="nav-divider">|</span>
					<router-link to="/dashboard" class="nav-link" active-class="active">
						可视化大屏
					</router-link>
					<span class="nav-divider">|</span>
					<router-link to="/analysis" class="nav-link" active-class="active">
						项目分析
					</router-link>
				</nav>

				<!-- 右侧：时间/用户信息 -->
				<div class="nav-right">
					<div class="nav-time">{{ currentTime }}</div>
				</div>
			</div>
		</header>
		<main class="main-content">
			<router-view />
		</main>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import dayjs from 'dayjs';

const currentTime = ref('');
let timer: number | null = null;

const updateTime = () => {
	currentTime.value = dayjs().format('YYYY/MM/DD 星期dddd HH:mm:ss');
};

onMounted(() => {
	updateTime();
	timer = window.setInterval(updateTime, 1000);
});

onBeforeUnmount(() => {
	if (timer) {
		clearInterval(timer);
	}
});
</script>

<style lang="scss" scoped>
.main-layout {
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100vh;
	overflow: hidden;
}

.nav-header {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	z-index: 1000;
	background: linear-gradient(90deg, #0f172a 0%, #1e293b 100%);
	backdrop-filter: blur(10px);
	box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
	opacity: 0.95;
}

.nav-container {
	display: flex;
	align-items: center;
	justify-content: space-between;
	max-width: 1920px;
	height: 64px;
	margin: 0 auto;
	padding: 0 32px;
}

// 左侧：Logo
.nav-left {
	flex: 1;
	display: flex;
	align-items: center;
}

.nav-logo {
	display: flex;
	align-items: center;
	gap: 12px;

	.logo-icon {
		font-size: 28px;
		line-height: 1;
		filter: drop-shadow(0 0 8px rgba(56, 189, 248, 0.5));
	}

	.platform-name {
		margin: 0;
		font-size: 20px;
		font-weight: 600;
		color: #e2e8f0;
		letter-spacing: 1px;
		background: linear-gradient(135deg, #e2e8f0 0%, #94a3b8 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}
}

// 中间：导航
.nav-center {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 4px;
}

.nav-link {
	position: relative;
	padding: 20px 24px;
	color: #e2e8f0;
	font-size: 16px;
	font-weight: 500;
	text-decoration: none;
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	letter-spacing: 0.5px;

	&::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 50%;
		width: 0;
		height: 3px;
		background: #38bdf8;
		border-radius: 2px 2px 0 0;
		transform: translateX(-50%);
		transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		box-shadow: 0 0 12px rgba(56, 189, 248, 0.6);
	}

	&:hover {
		color: #38bdf8;

		&::after {
			width: 60%;
		}
	}

	&.active {
		color: #38bdf8;
		font-weight: 600;

		&::after {
			width: 100%;
		}
	}
}

.nav-divider {
	color: rgba(226, 232, 240, 0.2);
	font-size: 14px;
	margin: 0 8px;
}

// 右侧：时间
.nav-right {
	flex: 1;
	display: flex;
	justify-content: flex-end;
	align-items: center;
}

.nav-time {
	padding: 8px 16px;
	color: #94a3b8;
	font-size: 14px;
	font-weight: 500;
	font-family: 'Consolas', 'Monaco', monospace;
	background: rgba(15, 23, 42, 0.6);
	border-radius: 6px;
	border: 1px solid rgba(56, 189, 248, 0.2);
	letter-spacing: 0.5px;
}

.main-content {
	margin-top: 64px;
	flex: 1;
	overflow: auto;
}

// 响应式设计
@media (max-width: 1024px) {
	.nav-container {
		padding: 0 20px;
	}

	.nav-link {
		padding: 20px 16px;
		font-size: 15px;
	}

	.platform-name {
		font-size: 18px;
	}
}

@media (max-width: 768px) {
	.nav-header {
		opacity: 1;
	}

	.nav-container {
		flex-direction: column;
		height: auto;
		padding: 12px 16px;
		gap: 12px;
	}

	.nav-left,
	.nav-right,
	.nav-center {
		flex: none;
		width: 100%;
		justify-content: center;
	}

	.nav-logo {
		.logo-icon {
			font-size: 24px;
		}

		.platform-name {
			font-size: 16px;
		}
	}

	.nav-center {
		gap: 0;
	}

	.nav-link {
		padding: 12px 12px;
		font-size: 14px;
	}

	.nav-divider {
		margin: 0 4px;
	}

	.nav-time {
		font-size: 12px;
		padding: 6px 12px;
	}

	.main-content {
		margin-top: 150px;
	}
}
</style>
