const themeSelect = document.getElementById("select-theme");
const themeSelectButton = document.getElementById("theme-select-button");

for(let key in QuickifyThemes){
  let opt = document.createElement("option");
  let th = QuickifyThemes[key];
  opt.setAttribute("value", th);
  let data = th.charAt(0).toUpperCase() + th.slice(1); // Capitalize the first letter
  opt.appendChild(document.createTextNode(data));
  themeSelect.appendChild(opt);
}


themeSelectButton.onclick = function(){
  const theme = themeSelect.options[themeSelect.selectedIndex].value;
  localStorage.setItem("currentTheme", theme);
};
