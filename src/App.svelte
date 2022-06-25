<script>
</script>

<main>
	<div class="nav" />
</main>

<style>
	@keyframes animation-right-to-left {
		from {
			width: 80px;
		}
		to {
			width: 160px;
		}
	}
	.nav {
		position: fixed;
		background: rgb(153, 149, 149);
		bottom: 0;
		right: 0;
		width: 100%;
		height: 80px;
	}
	@media screen and (min-width: 700px) {
		.nav {
			position: fixed;
			background: rgb(153, 149, 149);
			top: 0;
			right: 0;
			width: 80px;
			height: 100%;
		}
		.nav:hover {
		    transition: 1s ease-in-out;
			transform: translate(-3em,0);

		}
	}
</style>
