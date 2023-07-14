
const  n=10;
const array=[];
init();
function init(){
    for(let i=0; i<n; i++){
        array[i] =Math.random();
    }
    showBars();
}

function play(){
    bubblesort(array);
    showBars();
}
function bubblesort(array){
    do{
        var  swapped = false;
        for( let i =1; i <array.length; i++){
            if(array[i-1] >array[i]){
                swapped = true;
                [array[i-1],array[i]]=[array[i],array[i-1]];
    
            }
        }
    }while(swapped);
    
}

function showBars(){

    container.innerHtml = " ";
    for(let i=0; i<array.length; i++){
        const bar =document.createElement("div");
        bar.style.height = array[i]*100+"%";
        bar.classList.add("bar");
        container.appendChild(bar);
    }
}


console.log("hellpw")