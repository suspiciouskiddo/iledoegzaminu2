<script>
</script>


	<div class="nav">
		<ul>
			<li>
				<a href="/" style="text-decoration: none;">
					<div>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 384 512"
							class="svg-li-icon"
							><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path
								d="M352 0C369.7 0 384 14.33 384 32C384 49.67 369.7 64 352 64V74.98C352 117.4 335.1 158.1 305.1 188.1L237.3 256L305.1 323.9C335.1 353.9 352 394.6 352 437V448C369.7 448 384 462.3 384 480C384 497.7 369.7 512 352 512H32C14.33 512 0 497.7 0 480C0 462.3 14.33 448 32 448V437C32 394.6 48.86 353.9 78.86 323.9L146.7 256L78.86 188.1C48.86 158.1 32 117.4 32 74.98V64C14.33 64 0 49.67 0 32C0 14.33 14.33 0 32 0H352zM111.1 128H272C282.4 112.4 288 93.98 288 74.98V64H96V74.98C96 93.98 101.6 112.4 111.1 128zM111.1 384H272C268.5 378.7 264.5 373.7 259.9 369.1L192 301.3L124.1 369.1C119.5 373.7 115.5 378.7 111.1 384V384z"
							/></svg
						>
						<div class="nav-text">
							<span>ILEDOEGZAMINU.PL</span>
						</div>
					</div></a
				>
			</li>
			<li>
				<a href="/">
					<div>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 512 512"
							class="svg-li-icon"
							><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path
								d="M0 219.2v212.5c0 14.25 11.62 26.25 26.5 27C75.32 461.2 180.2 471.3 240 511.9V245.2C181.4 205.5 79.99 194.8 29.84 192C13.59 191.1 0 203.6 0 219.2zM482.2 192c-50.09 2.848-151.3 13.47-209.1 53.09C272.1 245.2 272 245.3 272 245.5v266.5c60.04-40.39 164.7-50.76 213.5-53.28C500.4 457.9 512 445.9 512 431.7V219.2C512 203.6 498.4 191.1 482.2 192zM352 96c0-53-43-96-96-96S160 43 160 96s43 96 96 96S352 149 352 96z"
							/></svg
						>
						<div class="nav-text">
							<span>MATURA</span>
						</div>
					</div></a
				>
			</li>
			<li>
				<a href="/">
				<div>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="svg-li-icon"><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M448 336v-288C448 21.49 426.5 0 400 0H96C42.98 0 0 42.98 0 96v320c0 53.02 42.98 96 96 96h320c17.67 0 32-14.33 32-31.1c0-11.72-6.607-21.52-16-27.1v-81.36C441.8 362.8 448 350.2 448 336zM143.1 128h192C344.8 128 352 135.2 352 144C352 152.8 344.8 160 336 160H143.1C135.2 160 128 152.8 128 144C128 135.2 135.2 128 143.1 128zM143.1 192h192C344.8 192 352 199.2 352 208C352 216.8 344.8 224 336 224H143.1C135.2 224 128 216.8 128 208C128 199.2 135.2 192 143.1 192zM384 448H96c-17.67 0-32-14.33-32-32c0-17.67 14.33-32 32-32h288V448z"/></svg>
				<div class="nav-text">
					<span>EGZAMIN ÓSMOKLASISTY</span>
				</div>
				</div></a>
			</li>
		</ul>
	</div>
	<main>
</main>

<style>
	ul {
		padding: 0;
		margin: 0;
	}
	li {
		list-style-type: none;
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
		.svg-li-icon {
			width: 50px;
			padding: 15px;
		}
		.nav-text {
			position: fixed;
			transform: translate(100px, -59px);
			color: black;
		}
		.nav {
			position: fixed;
			background: rgb(153, 149, 149);
			top: 0;
			right: 0;
			width: 300px;
			height: 100%;
			/*transform: translate(220px);  uncomment after finishing navbar*/
			transition: 0.6s ease-in-out;
		}
		.nav:hover { /* find how the guy from fireship did the aligning to bottom, and do it for all items except for the first one*/
			transition: 0.8s ease-in-out;
			transform: translate(0, 0);
		}
	}
</style>
