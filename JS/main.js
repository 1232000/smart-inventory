//  ------------variables------------------------------
    let toggleBtn=document.getElementById("toggleBtn");
    let themeIcon= toggleBtn.querySelector("i");
    let savedTheme= localStorage.getItem("theme") || "light";
       if(savedTheme=== "dark"){
        themeIcon.classList.remove("fa-moon");
        themeIcon.classList.add("fa-sun");
    } else {
         themeIcon.classList.remove("fa-sun");
        themeIcon.classList.add("fa-moon");
    }
    document.documentElement.setAttribute("data-theme" , savedTheme);
// ------dark-mode---------
toggleBtn.addEventListener("click" , ()=>{
    let currentTheme=document.documentElement.getAttribute("data-theme");
    let newTheme= currentTheme=== "light"? "dark" :"light";
    document.documentElement.setAttribute("data-theme" , newTheme);
    if(newTheme=== "dark"){
        themeIcon.classList.remove("fa-moon");
        themeIcon.classList.add("fa-sun");
    } else {
         themeIcon.classList.remove("fa-sun");
        themeIcon.classList.add("fa-moon");
    }
    localStorage.setItem("theme" ,newTheme);
});