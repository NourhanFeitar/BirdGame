let button =  document.querySelector("button");
let playerName= document.querySelector("input");
let alert= document.getElementsByClassName("alert")[0];

button.onclick=function()
{ 
    alert.style.display="none";

    if( !playerName.value)
     {
         alert.style.display="block";
     }
    
     if(!isNaN(playerName.value))
     {
        alert.style.display="block";
     }
    
    else
     {
        localStorage.setItem("playerName",playerName.value);
        window.location.href = "game.html";
     }
}
