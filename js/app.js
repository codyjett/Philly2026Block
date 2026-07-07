const days=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
let currentWeek=Number(localStorage.getItem("philly2026-current-week")||1);
const completed=JSON.parse(localStorage.getItem("philly2026-completed")||"{}");

function save(){localStorage.setItem("philly2026-current-week",currentWeek);localStorage.setItem("philly2026-completed",JSON.stringify(completed));}
function renderButtons(){weekPicker.innerHTML=WEEKS.map(w=>`<button class="week-btn ${w.week===currentWeek?"active":""}" onclick="showWeek(${w.week})"><span>${w.week}</span><small>${w.dates}</small></button>`).join("");}
function key(w,d){return `w${w}-${d}`;}
function renderWeek(){
 const w=WEEKS.find(x=>x.week===currentWeek);
 currentWeekEl=document.getElementById("currentWeek"); currentWeekEl.textContent=`Week ${w.week}`;
 weekView.innerHTML=`<div class="week-head"><div class="week-title"><h1>Week ${w.week}</h1><h2>${w.dates}</h2></div><div class="week-pill">${w.phase}</div></div>
 <div class="days">${days.map(day=>`<div class="card"><div class="day">${day}</div><div class="workout">${w.days[day].map(line=>`<div>${line}</div>`).join("")}</div><label class="complete"><input type="checkbox" ${completed[key(w.week,day)]?"checked":""} onchange="toggleComplete(${w.week},'${day}',this.checked)"> Done</label></div>`).join("")}</div>`;
 updateProgress();
}
function showWeek(n){currentWeek=n;save();renderButtons();renderWeek();window.scrollTo({top:0,behavior:"smooth"});}
function toggleComplete(w,d,val){completed[key(w,d)]=val;save();updateProgress();}
function updateProgress(){const total=WEEKS.length*7;const done=Object.values(completed).filter(Boolean).length;document.getElementById("completedCount").textContent=`${done}/${total}`;document.getElementById("progressPercent").textContent=Math.round(done/total*100)+"%";}
function updateCountdown(){const race=new Date("2026-11-22T07:00:00-05:00");const now=new Date();const daysLeft=Math.ceil((race-now)/(1000*60*60*24));document.getElementById("countdown").textContent=daysLeft>0?`${daysLeft} days until race day`:"Race day is here.";}
function jumpToday(){const start=new Date("2026-08-10T00:00:00");const now=new Date();const diff=Math.floor((now-start)/(1000*60*60*24));const week=Math.min(15,Math.max(1,Math.floor(diff/7)+1));showWeek(week);}
document.getElementById("prevBtn").onclick=()=>currentWeek>1&&showWeek(currentWeek-1);
document.getElementById("nextBtn").onclick=()=>currentWeek<15&&showWeek(currentWeek+1);
document.getElementById("todayBtn").onclick=jumpToday;
renderButtons();renderWeek();updateCountdown();
