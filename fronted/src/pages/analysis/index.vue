<template>
	<div class="analysis-page">
		<div class="coming-soon">
			<div class="icon">🚧</div>
			<h1>项目分析功能</h1>
			<p>该功能正在开发中，敬请期待...</p>
		</div>
	</div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.analysis-page {
	display: flex;
	justify-content: center;
	align-items: center;
	min-height: calc(100vh - 60px);
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.coming-soon {
	text-align: center;
	color: white;
	padding: 60px 40px;
	background: rgba(255, 255, 255, 0.1);
	backdrop-filter: blur(10px);
	border-radius: 16px;
	box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);

	.icon {
		font-size: 80px;
		margin-bottom: 20px;
		animation: bounce 2s ease-in-out infinite;
	}

	h1 {
		font-size: 36px;
		margin-bottom: 16px;
		font-weight: 600;
	}

	p {
		font-size: 18px;
		opacity: 0.9;
	}
}

@keyframes bounce {
	0%,
	100% {
		transform: translateY(0);
	}
	50% {
		transform: translateY(-10px);
	}
}
</style>
