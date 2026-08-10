const days=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
let currentWeek=Number(localStorage.getItem("philly2026-current-week")||1);
const completed=JSON.parse(localStorage.getItem("philly2026-completed")||"{}");
const mileage=JSON.parse(localStorage.getItem("philly2026-mileage")||"{}");

function save(){
  localStorage.setItem("philly2026-current-week",currentWeek);
  localStorage.setItem("philly2026-completed",JSON.stringify(completed));
  localStorage.setItem("philly2026-mileage",JSON.stringify(mileage));
}
function renderButtons(){
  weekPicker.innerHTML=WEEKS.map(w=>`<button class="week-btn ${w.week===currentWeek?"active":""}" onclick="showWeek(${w.week})"><span>${w.week}</span><small>${w.dates}</small></button>`).join("");
}
function key(w,d){return `w${w}-${d}`;}
function cleanMileage(value){
  const number=Number.parseFloat(value);
  return Number.isFinite(number)&&number>=0?number:0;
}
function renderWeek(){
 const w=WEEKS.find(x=>x.week===currentWeek);
 document.getElementById("currentWeek").textContent=`Week ${w.week}`;
 weekView.innerHTML=`<div class="week-head"><div class="week-title"><h1>Week ${w.week}</h1><h2>${w.dates}</h2></div><div class="week-pill">${w.phase}</div></div>
 <div class="days">${days.map(day=>`<div class="card"><div class="day">${day}</div><div class="workout">${w.days[day].map(line=>`<div>${line}</div>`).join("")}</div>
 <div class="mileage-entry"><label for="miles-${w.week}-${day}">Miles</label><input id="miles-${w.week}-${day}" class="mileage-input" type="number" min="0" step="0.01" inputmode="decimal" value="${mileage[key(w.week,day)] ?? ""}" placeholder="0.0" onchange="updateMileage(${w.week},'${day}',this.value)"></div>
 <label class="complete"><input type="checkbox" ${completed[key(w.week,day)]?"checked":""} onchange="toggleComplete(${w.week},'${day}',this.checked)"> Done</label></div>`).join("")}</div>`;
 updateDashboard();
}
function showWeek(n){currentWeek=n;save();renderButtons();renderWeek();window.scrollTo({top:0,behavior:"smooth"});}
function toggleComplete(w,d,val){completed[key(w,d)]=val;save();updateDashboard();}
function updateMileage(w,d,value){
  mileage[key(w,d)]=cleanMileage(value);
  save();
  updateDashboard();
}
function weekMileage(weekNumber){
  return days.reduce((sum,day)=>sum+cleanMileage(mileage[key(weekNumber,day)]),0);
}
function blockMileage(){
  return WEEKS.reduce((sum,w)=>sum+weekMileage(w.week),0);
}
function updateDashboard(){
  const total=WEEKS.length*7;
  const done=Object.values(completed).filter(Boolean).length;
  document.getElementById("completedCount").textContent=`${done}/${total}`;
  document.getElementById("progressPercent").textContent=Math.round(done/total*100)+"%";
  document.getElementById("weekMiles").textContent=weekMileage(currentWeek).toFixed(1);
  document.getElementById("blockMiles").textContent=blockMileage().toFixed(1);
}
function updateCountdown(){
  const race=new Date("2026-11-22T07:00:00-05:00");
  const now=new Date();
  const daysLeft=Math.ceil((race-now)/(1000*60*60*24));
  document.getElementById("countdown").textContent=daysLeft>0?`${daysLeft} days until race day`:"Race day is here.";
}
function jumpToday(){
  const start=new Date("2026-08-10T00:00:00");
  const now=new Date();
  const diff=Math.floor((now-start)/(1000*60*60*24));
  const week=Math.min(15,Math.max(1,Math.floor(diff/7)+1));
  showWeek(week);
}
document.getElementById("prevBtn").onclick=()=>currentWeek>1&&showWeek(currentWeek-1);
document.getElementById("nextBtn").onclick=()=>currentWeek<15&&showWeek(currentWeek+1);
document.getElementById("todayBtn").onclick=jumpToday;
renderButtons();renderWeek();updateCountdown();
