var themeSelect = document.getElementById("select-theme");
var themeSelectButton = document.getElementById("theme-select-button");

for(let key in QuickifyThemes){
  let opt = document.createElement("option");
  let th = QuickifyThemes[key];
  opt.setAttribute("value", th);
  opt.innerHTML = th.charAt(0).toUpperCase() + th.slice(1); // Capitalize the first letter
  themeSelect.appendChild(opt);
}


themeSelectButton.onclick = function(){
  var theme = themeSelect.options[themeSelect.selectedIndex].value;
  localStorage.setItem("currentTheme", theme);
}


