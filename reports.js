"use strict";
let rs=[],rm=[],ra=[];
document.addEventListener("DOMContentLoaded",()=>{rs=getServants();rm=getMeetings();ra=getAttendance();fillFilters();bindReports();renderReports()});
function fillFilters(){
  document.getElementById("reportMeeting").innerHTML=`<option value="all">كل الاجتماعات</option>`+rm.map(m=>`<option value="${m.id}">${escapeHTML(m.name)}</option>`).join("");
  document.getElementById("reportServant").innerHTML=`<option value="all">كل الخدام</option>`+rs.map(s=>`<option value="${s.id}">${escapeHTML(s.name)}</option>`).join("");
}
function bindReports(){
  ["reportPeriod","reportMeeting","reportServant"].forEach(id=>document.getElementById(id).addEventListener("change",renderReports));
  document.getElementById("resetReportsBtn").addEventListener("click",()=>{document.getElementById("reportPeriod").value="all";document.getElementById("reportMeeting").value="all";document.getElementById("reportServant").value="all";renderReports()});
}
function filteredRecords(){let x=[...ra];const p=document.getElementById("reportPeriod").value,m=document.getElementById("reportMeeting").value,s=document.getElementById("reportServant").value;if(p!=="all"){const days=p==="week"?7:p==="month"?30:90,cut=new Date();cut.setHours(0,0,0,0);cut.setDate(cut.getDate()-days+1);x=x.filter(r=>new Date(r.date+"T00:00:00")>=cut)}if(m!=="all")x=x.filter(r=>r.meetingId===m);if(s!=="all")x=x.filter(r=>r.servantId===s);return x}
function renderReports(){
  const records=filteredRecords(),stats=getAttendanceStats(records),servantFilter=document.getElementById("reportServant").value;
  const relevant=servantFilter==="all"?rs:rs.filter(s=>s.id===servantFilter);
  setText("reportTotalServants",relevant.length);setText("reportPresent",stats.present+stats.late);setText("reportAbsent",stats.absent);setText("reportAverage",stats.percentage+"%");setText("attendancePercentage",stats.percentage+"%");
  const circle=document.getElementById("attendanceCircle");circle.style.background=`conic-gradient(var(--primary) ${stats.percentage*3.6}deg,var(--border) 0deg)`;
  const rows=relevant.map(s=>{const sr=records.filter(r=>r.servantId===s.id),st=getAttendanceStats(sr),label=st.percentage>=90?"ممتاز":st.percentage>=80?"جيد":st.percentage>=70?"متوسط":"يحتاج متابعة";return{...s,st,label}});
  document.getElementById("servantReportsBody").innerHTML=rows.length?rows.map(x=>`<tr><td>${escapeHTML(x.name)}</td><td>${x.st.present}</td><td>${x.st.absent}</td><td>${x.st.late}</td><td>${x.st.percentage}%</td><td>${x.label}</td></tr>`).join(""):`<tr><td colspan="6"><div class="empty-state">لا توجد بيانات</div></td></tr>`;
  const follow=rows.filter(x=>x.st.total>0&&x.st.percentage<70);document.getElementById("followUpList").innerHTML=follow.length?follow.map(x=>`<div style="padding:13px 18px;border-top:1px solid var(--border);display:flex;justify-content:space-between"><strong>${escapeHTML(x.name)}</strong><span>${x.st.percentage}%</span></div>`).join(""):`<div class="empty-state">لا توجد حالات تحتاج متابعة</div>`;
}
