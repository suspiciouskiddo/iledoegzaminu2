<script>
const e8date = new Date(2023, 6, 1, 8, 0, 0);
const mdate = new Date(2023, 3, 1 ,1, 12, 0);
const wakacjedate = new Date(2022, 8, 1,8,0,0);
let e8days  = undefined;
let e8hours = undefined;
let e8minutes = undefined;
let e8seconds = undefined;

let mdays  = undefined;
let mhours = undefined;
let mminutes = undefined;
let mseconds = undefined;

let wdays  = undefined;
let whours = undefined;
let wminutes = undefined;
let wseconds = undefined;

let formdate = "";
let formname = "";
let formtime = "";

function calcDate(){
	const now = new Date();
	const diff = e8date - now;
	const diffmatura = mdate - now;
	const diffwakacje = wakacjedate - now;

	e8days = Math.floor((diff / (1000 * 60 * 60 * 24))*10000)/10000;
	e8hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	e8minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
	e8seconds = Math.floor((diff % (1000 * 60)) / 1000);

	mdays = Math.floor(diffmatura / (1000 * 60 * 60 * 24));
	mhours = Math.floor((diffmatura % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	mminutes = Math.floor((diffmatura % (1000 * 60 * 60)) / (1000 * 60));
	mseconds = Math.floor((diffmatura % (1000 * 60)) / 1000);

	wdays = Math.floor((diffwakacje / (1000 * 60 * 60 * 24))*10000)/10000;
	whours = Math.floor((diffwakacje / (1000 * 60 * 60))*1000)/1000;
	wminutes = Math.floor((diffwakacje / (1000 * 60))*100)/100;
	wseconds = Math.floor((diffwakacje / (1000)));

}

setInterval(calcDate, 500);
</script>

<main>
	<div class="counter-holder" id="counter-holder">
		<div class="counterdiv"><a href="/e8" style="color: black;"><h2>Odliczanie do egzaminu ósmoklasisty 2023</h2>
		<p style="font-size: 12px;">Kliknij w tekst aby zobaczyć więcej</p>
			<!-- 
		<h3>W dniach {e8days}</h3>
			<h3>W godzinach {e8hours}</h3>
			<h3>W minutach {e8minutes}</h3>
			<h3>W sekundach {e8seconds}</h3>
		-->
		<h3>Brak dokładnego terminu</h3>
		</a></div>
		<div class="counterdiv"><a href="/matura" style="color: black;"><h2>Odliczanie do matury 2023</h2>
			<p style="font-size: 12px;">Kliknij w tekst aby zobaczyć więcej</p>
			<!---	
			<h3>W dniach {mdays}</h3>
				<h3>W godzinach {mhours}</h3>
				<h3>W minutach {mminutes}</h3>
				<h3>W sekundach {mseconds}</h3>-->
			<h3>Brak dokładnego terminu</h3>
			</a></div>
			<div class="counterdiv"><a href="/wakacje" style="color: black;"><h2>Odliczanie do końca wakacji</h2>
				<p style="font-size: 12px;">Kliknij w tekst aby zobaczyć więcej</p>
					<h3>W dniach {wdays}</h3>
					<h3>W godzinach {whours}</h3>
					<h3>W minutach {wminutes}</h3>
					<h3>W sekundach {wseconds}</h3>
				</a></div>
				<div class="maeformdiv">
					<h2>Generowanie własnego odliczania</h2>
					<a href="/customsave" style="color: black;"><p style="font-size: 12px;">Aby zapisać odliczanie kliknij tutaj</p></a>
					<input type="text" placeholder="Nazwa odliczania (bez znaków specjalnych)" bind:value={formname}>
					<input type="date" id="inputcustomdate" bind:value={formdate}>
					<input type="time" id="inputcustomtime" bind:value={formtime}>
					<a href="/custom?name={formname}&date={formdate}&time={formtime}" style="font-size: 14px;">https://iledoegzaminu.pl/custom?name={formname}&date={formdate}&time={formtime}</a>
				</div>
	</div>
</main>
<div class="nav">
	<ul>
		<li>
			<a href="/" style="text-decoration: none;">
				<div class="nav-item-div">
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
			<div style="height: 50px;" />
		</li>
		<li>
			<a href="/matura">
				<div class="nav-item-div">
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
			<a href="/e8">
				<div class="nav-item-div">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 448 512"
						class="svg-li-icon"
						><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path
							d="M448 336v-288C448 21.49 426.5 0 400 0H96C42.98 0 0 42.98 0 96v320c0 53.02 42.98 96 96 96h320c17.67 0 32-14.33 32-31.1c0-11.72-6.607-21.52-16-27.1v-81.36C441.8 362.8 448 350.2 448 336zM143.1 128h192C344.8 128 352 135.2 352 144C352 152.8 344.8 160 336 160H143.1C135.2 160 128 152.8 128 144C128 135.2 135.2 128 143.1 128zM143.1 192h192C344.8 192 352 199.2 352 208C352 216.8 344.8 224 336 224H143.1C135.2 224 128 216.8 128 208C128 199.2 135.2 192 143.1 192zM384 448H96c-17.67 0-32-14.33-32-32c0-17.67 14.33-32 32-32h288V448z"
						/></svg
					>
					<div class="nav-text">
						<span>EGZAMIN ÓSMOKLASISTY</span>
					</div>
				</div></a
			>
		</li>
		<li>
			<a href="/wakacje">
				<div class="nav-item-div">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 640 512"
						class="svg-li-icon"
						><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path
							d="M115.4 136.8l102.1 37.35c35.13-81.62 86.25-144.4 139-173.7c-95.88-4.875-188.8 36.96-248.5 111.7C101.2 120.6 105.2 133.2 115.4 136.8zM247.6 185l238.5 86.87c35.75-121.4 18.62-231.6-42.63-253.9c-7.375-2.625-15.12-4.062-23.12-4.062C362.4 13.88 292.1 83.13 247.6 185zM521.5 60.51c6.25 16.25 10.75 34.62 13.13 55.25c5.75 49.87-1.376 108.1-18.88 166.9l102.6 37.37c10.13 3.75 21.25-3.375 21.5-14.12C642.3 210.1 598 118.4 521.5 60.51zM528 448h-207l65-178.5l-60.13-21.87l-72.88 200.4H48C21.49 448 0 469.5 0 496C0 504.8 7.163 512 16 512h544c8.837 0 16-7.163 16-15.1C576 469.5 554.5 448 528 448z"
						/></svg
					>
					<div class="nav-text">
						<span>WAKACJE 2023</span>
					</div>
				</div></a
			>
		</li>
	</ul>
</div>


<style>
	.maeformdiv {
		height: 300px;
        width: 325px;
        background: rgb(56, 56, 56);
        margin: 10px;
        text-align: center;
		color: black;
	}
	/* theese properties for all screen sizes*/
	input {
		width: 100%;
		height: 30px;
		background-color: #2c2d30;
		border: 0;
	}
	.counterdiv {
		height: 300px;
        width: 325px;
        background: rgb(56, 56, 56);
        margin: 10px;
        text-align: center;
		color: black;
	}
	:root {
		overflow-x: hidden;
	}
	.counter-holder {
		position: absolute;
			top: 0;
			left: 0;
			padding: 30px;
			display: grid;
	}
	ul {
		padding: 0;
		margin: 0;
	}
	li {
		list-style-type: none;
	}
	/* end theese properties for all screen sizes*/
	@media screen and (max-width: 700px) {
		li {
			display: inline-block;
		}
		.nav {
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100%;
			height: 80px;
			background: #70a0e9;
		}
		.svg-li-icon {
			height: 50px;
			padding: 15px;
		}
		.nav-text {
			display: none;
		}
		.nav-item-div {
			background: #70a0e9;
			transition: background 0.5s;
		}
		.nav-item-div:hover {
			background: #5b7db1;
		}
		.counter-holder {
			width: 100%;
			grid-template-columns: 1fr;
			grid-template-rows: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
		}
	}


	@media screen and (min-width: 700px) {
		.counter-holder {
			width: calc(100% - 80px);
			grid-template-columns: 1fr 1fr;
			grid-template-rows: 1fr 1fr 1fr 1fr 1fr 1fr;

		}
		.svg-li-icon {
			width: 50px;
			padding: 15px;
		}
		.nav-text {
			position: fixed;
			transform: translate(100px, -59px);
			color: #2c2d30;
		}
		.nav {
			position: fixed;
			background: #70a0e9;
			top: 0;
			right: 0;
			width: 300px;
			height: 100%;
			transform: translate(220px);
			transition: 0.6s ease-in-out;
		}
		.nav:hover {
			transition: 0.8s ease-in-out;
			transform: translate(0, 0);
		}
		.nav-item-div {
			/*TODO later: fix aligning color changing div to text and icon (align text and icon relative to div) */
			height: 100px;
			background: #70a0e9;
			transition: background 0.5s;
		}
		.nav-item-div:hover {
			background: #5b7db1;
		}
	}
	@media screen and (min-width: 1200px) {
		.counter-holder {
			grid-template-columns: 1fr 1fr 1fr;
			grid-template-rows: 1fr 1fr 1fr 1fr;
		}
	}
</style>
