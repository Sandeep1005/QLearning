document.addEventListener('DOMContentLoaded', ()=>{

    var cells=document.querySelectorAll(".value-column");
    cells.forEach(cell => {
        cell.textContent=Math.floor(Math.random()*201)-100;
        
    });

})

   

