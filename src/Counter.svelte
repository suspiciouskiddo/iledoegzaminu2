<script>
    export let dataobj;
    function remainingtime(end_date) {
        let cdate = new Date();
        let diff = end_date - cdate;
        let robj = {
            inmonths: Math.floor((diff / (1000 * 60 * 60 * 24 * 30)) * 1000000)/1000000,
            inweeks: Math.floor((diff / (1000 * 60 * 60 * 24 * 7)) * 100000)/100000,
            indays: Math.floor((diff / (1000 * 60 * 60 * 24)) * 10000)/10000,
            inhours: Math.floor((diff / (1000 * 60 * 60)) * 1000)/1000,
            inminutes: Math.floor((diff / (1000 * 60)) * 100)/100,
            inseconds: Math.floor((diff / 1000) * 1)/1
        }
        
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
