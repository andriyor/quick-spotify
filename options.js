var themeSelect = document.getElementById("select-theme");
var themeSelectButton = document.getElementById("theme-select-button");

for(let key in QuickifyThemes){
  let opt = document.createElement("option");
  opt.setAttribute("value", QuickifyThemes[key]);
  opt.innerHTML = QuickifyThemes[key];
  themeSelect.appendChild(opt);
}


themeSelectButton.onclick = function(){
  var theme = themeSelect.options[themeSelect.selectedIndex].value;
  localStorage.setItem("currentTheme", theme);
}


