"use strict";
let attServants=[],attMeetings=[],rowStatus={};
document.addEventListener("DOMContentLoaded",()=>{attServants=getServants().filter(x=>x.status!=="inactive");attMeetings=getMeetings().filter(x=>x.status!=="inactive");initAttendance()});
function initAttendance(){
  const sel=document.getElementById("meetingSelect"),date=document.getElementById("attendanceDate");
  sel.innerHTML=`<option value="">اختر الاجتماع</option>`+attMeetings.map(m=>`<option value="${m.id}">${escapeHTML(m.name)}</option>`).join("");
  date.value=getToday();
  const param=new URLSearchParams(location.search).get("meeting");if(param&&attMeetings.some(x=>x.id===param))sel.value=param;
  sel.addEventListener("change",loadExisting);date.addEventListener("change",loadExisting);document.getElementById("attendanceSearch").addEventListener("input",renderAttendance);
  document.getElementById("markAllPresentBtn").addEventListener("click",()=>{attServants.forEach(s=>rowStatus[s.id]="present");renderAttendance()});
  document.getElementById("saveAttendanceBtn").addEventListener("click",saveCurrentAttendance);
  loadExisting();
}
function loadExisting(){
  rowStatus={};const m=document.getElementById("meetingSelect").value,d=document.getElementById("attendanceDate").value,settings=getSettings();
  const records=getAttendance().filter(x=>x.meetingId===m&&x.date===d);
  attServants.forEach(s=>rowStatus[s.id]=records.find(r=>r.servantId===s.id)?.status||(settings.defaultAbsent?"absent":"present"));
  renderAttendance();
}
function renderAttendance(){
  const q=document.getElementById("attendanceSearch").value.toLowerCase();const list=attServants.filter(s=>`${s.name} ${s.group} ${s.role}`.toLowerCase().includes(q));
  const body=document.getElementById("attendanceTableBody");
  body.innerHTML=list.length?list.map(s=>`<tr><td><strong>${escapeHTML(s.name)}</strong></td><td>${escapeHTML(s.group||"—")}</td><td>${escapeHTML(s.role||"—")}</td><td><div class="status-buttons">${["present","absent","late"].map(st=>`<button class="status-btn ${st} ${rowStatus[s.id]===st?"active":""}" onclick="setStatus('${s.id}','${st}')">${st==="present"?"حاضر":st==="absent"?"غائب":"متأخر"}</button>`).join("")}</div></td></tr>`).join(""):`<tr><td colspan="4"><div class="empty-state">لا يوجد خدام</div></td></tr>`;
  updateAttStats();
}
function setStatus(id,status){rowStatus[id]=status;renderAttendance()}
function updateAttStats(){const vals=Object.values(rowStatus);setText("attendanceTotal",attServants.length);setText("attendancePresent",vals.filter(x=>x==="present").length);setText("attendanceAbsent",vals.filter(x=>x==="absent").length);setText("attendanceLate",vals.filter(x=>x==="late").length)}
function saveCurrentAttendance(){const mid=document.getElementById("meetingSelect").value,date=document.getElementById("attendanceDate").value;if(!mid)return showToast("اختر الاجتماع أولًا","error");if(!date)return showToast("اختر التاريخ","error");const meeting=attMeetings.find(x=>x.id===mid);attServants.forEach(s=>addAttendance({servantId:s.id,servantName:s.name,meetingId:mid,meetingName:meeting?.name||"",date,status:rowStatus[s.id]||"absent"}));showToast("تم حفظ كشف الحضور")}
window.setStatus=setStatus;
