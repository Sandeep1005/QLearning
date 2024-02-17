document.addEventListener('DOMContentLoaded', ()=>{
    {
        setInterval(()=>{
        document.getElementById("td1").textContent = Math.floor(Math.random()*201)-100;
        document.getElementById("td2").textContent = Math.floor(Math.random()*201)-100;
        document.getElementById("td3").textContent = Math.floor(Math.random()*201)-100;
        document.getElementById("td4").textContent = Math.floor(Math.random()*201)-100;
        },1000)
    }
})