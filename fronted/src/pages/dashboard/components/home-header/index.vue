<template>
	<div class="home-header">
		<!-- 标题和时间已移除 -->
	</div>
</template>

<script lang="ts" setup>
// 标题和时间功能已移除
</script>

<style lang="scss" scoped>
.home-header {
	position: relative;
	height: 65px;
	padding-top: 3px;
	text-align: center;
	background: url('@/assets/images/home-header.png') no-repeat;
	background-size: 100% 100%;
}

@media (max-width: 600px) {
	.home-header {
		height: 70px;
	}
}

@media (max-width: 450px) {
	.home-header {
		height: 80px;
		padding-top: 4px;
	}
}
</style>
