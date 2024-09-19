let info=document.querySelector(".info");
let add_btn=document.querySelector(".add-btn");
add_btn.addEventListener("mouseover",()=>{
    info.style.visibility="visible";
});
add_btn.addEventListener("mouseout",()=>{
    info.style.visibility="hidden";
});
