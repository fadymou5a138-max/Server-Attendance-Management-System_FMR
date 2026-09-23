"use strict";
document.addEventListener("DOMContentLoaded",()=>{
  const body=document.body,themeBtn=document.getElementById("themeToggle"),sidebar=document.getElementById("sidebar"),mobileBtn=document.getElementById("mobileMenuBtn");
  if(localStorage.getItem("fmr_theme")==="dark")body.classList.add("dark");
  updateThemeLabel();
  themeBtn?.addEventListener("click",()=>{body.classList.toggle("dark");localStorage.setItem("fmr_theme",body.classList.contains("dark")?"dark":"light");updateThemeLabel()});
  mobileBtn?.addEventListener("click",()=>sidebar?.classList.toggle("open"));
  document.addEventListener("click",e=>{if(window.innerWidth<=800&&sidebar?.classList.contains("open")&&!sidebar.contains(e.target)&&e.target!==mobileBtn&&!mobileBtn?.contains(e.target))sidebar.classList.remove("open")});
  const page=body.dataset.page;document.querySelector(`[data-page="${page}"]`)?.classList.add("active");
  const settings=getSettings();document.querySelectorAll("#adminName").forEach(el=>el.textContent=settings.adminName||"Admin");
  if(page==="dashboard")initDashboard();
});
function updateThemeLabel(){const b=document.getElementById("themeToggle");if(!b)return;const dark=document.body.classList.contains("dark");b.innerHTML=`<i class="fa-solid ${dark?"fa-sun":"fa-moon"}"></i><span>${dark?"الوضع النهاري":"الوضع الليلي"}</span>`}
function initDashboard(){
  const servants=getServants(),today=getTodayAttendance(),stats=getAttendanceStats(today);
  setText("totalServants",servants.length);setText("presentToday",stats.present+stats.late);setText("absentToday",stats.absent);setText("attendancePercentage",stats.percentage+"%");
  setText("overviewPresent",stats.present);setText("overviewAbsent",stats.absent);setText("overviewLate",stats.late);setText("attendanceCircleText",stats.percentage+"%");
  const circle=document.getElementById("attendanceCircle");if(circle)circle.style.background=`conic-gradient(var(--primary) ${stats.percentage*3.6}deg,var(--border) 0deg)`;
  const d=document.getElementById("dashboardDate");if(d)d.textContent=new Date().toLocaleDateString("ar-EG",{weekday:"long",year:"numeric",month:"long",day:"numeric"});
  const c=document.getElementById("recentMeetings"),m=getMeetings().slice().sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)).slice(0,5);
  if(c)c.innerHTML=m.length?m.map(x=>`<div style="padding:14px 18px;border-top:1px solid var(--border);display:flex;justify-content:space-between;gap:10px"><div><strong>${escapeHTML(x.name)}</strong><div style="font-size:12px;color:var(--text-light)">${escapeHTML(x.day||"")} ${x.time||""}</div></div><a href="attendance.html?meeting=${encodeURIComponent(x.id)}" class="btn btn-secondary" style="padding:7px 10px">الحضور</a></div>`).join(""):`<div class="empty-state"><i class="fa-regular fa-calendar"></i>لا توجد اجتماعات حتى الآن</div>`;
}
function setText(id,v){const e=document.getElementById(id);if(e)e.textContent=v}
function escapeHTML(v){return String(v??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}
function showToast(msg,type="success"){document.querySelector(".toast")?.remove();const el=document.createElement("div");el.className=`toast ${type}`;el.innerHTML=`<i class="fa-solid ${type==="success"?"fa-circle-check":"fa-circle-exclamation"}"></i><span>${escapeHTML(msg)}</span>`;document.body.appendChild(el);setTimeout(()=>el.classList.add("show"),10);setTimeout(()=>{el.classList.remove("show");setTimeout(()=>el.remove(),250)},2600)}
