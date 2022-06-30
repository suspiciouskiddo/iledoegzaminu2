<script>
    export let dataobj;
    function remainingtime(end_date) {
        
    }
</script>

<div class="maindiv">
    <a href={dataobj.addr} style="text-decoration: none; color: white;">
        <h1>Odliczanie do {dataobj.name}</h1>
        <p style="font-size: 12px;">(kliknij w tekst aby zobaczyć więcej)</p>
        <h2>test</h2>
    </a>
</div>

<style>
    .maindiv {
        height: 300px;
        width: 325px;
        background: rgb(56, 56, 56);
        margin: 10px;
        color: white;
        text-align: center;
    }
</style>
