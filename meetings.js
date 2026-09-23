"use strict";
let meetings=[],editingMeetingId=null;
document.addEventListener("DOMContentLoaded",()=>{reloadM();bindM();renderM()});
function reloadM(){meetings=getMeetings()}
function bindM(){
  byM("addMeetingBtn")?.addEventListener("click",()=>openMeetingModal());
  byM("closeMeetingModal")?.addEventListener("click",closeMeetingModal);
  byM("cancelMeetingBtn")?.addEventListener("click",closeMeetingModal);
  byM("meetingSearch")?.addEventListener("input",renderM);
  byM("meetingStatusFilter")?.addEventListener("change",renderM);
  byM("meetingForm")?.addEventListener("submit",e=>{e.preventDefault();const name=byM("meetingName").value.trim();if(!name)return showToast("أدخل اسم الاجتماع","error");const data={name,day:byM("meetingDay").value,time:byM("meetingTime").value,location:byM("meetingLocation").value.trim(),description:byM("meetingDescription").value.trim(),status:byM("meetingStatus").value};editingMeetingId?updateMeeting(editingMeetingId,data):addMeeting(data);reloadM();renderM();closeMeetingModal();showToast("تم حفظ الاجتماع")});
}
function renderM(){
  const q=(byM("meetingSearch")?.value||"").toLowerCase(),st=byM("meetingStatusFilter")?.value||"all";
  const list=meetings.filter(m=>`${m.name} ${m.location} ${m.day} ${m.description}`.toLowerCase().includes(q)&&(st==="all"||m.status===st));
  setText("totalMeetingsCount",meetings.length);setText("activeMeetingsCount",meetings.filter(x=>x.status==="active").length);setText("inactiveMeetingsCount",meetings.filter(x=>x.status==="inactive").length);setText("tableMeetingsCount",`${list.length} اجتماع`);
  byM("meetingsTableBody").innerHTML=list.length?list.map(m=>`<tr><td><div class="meeting-name"><div class="meeting-avatar"><i class="fa-solid fa-calendar-days"></i></div><div><strong>${escapeHTML(m.name)}</strong><div style="font-size:11px;color:var(--text-light)">${escapeHTML(m.description||"")}</div></div></div></td><td>${escapeHTML(m.day||"—")}</td><td>${formatTime(m.time)}</td><td>${escapeHTML(m.location||"—")}</td><td><span class="status-badge ${m.status}">${m.status==="active"?"نشط":"غير نشط"}</span></td><td><div class="action-group"><a class="action-btn attendance" href="attendance.html?meeting=${encodeURIComponent(m.id)}"><i class="fa-solid fa-clipboard-check"></i></a><button class="action-btn edit" onclick="openMeetingModal('${m.id}')"><i class="fa-solid fa-pen"></i></button><button class="action-btn delete" onclick="removeMeeting('${m.id}')"><i class="fa-solid fa-trash"></i></button></div></td></tr>`).join(""):`<tr><td colspan="6"><div class="empty-state"><i class="fa-solid fa-calendar-xmark"></i>لا توجد اجتماعات</div></td></tr>`;
}
function openMeetingModal(id=null){editingMeetingId=id;byM("meetingForm").reset();byM("meetingModalTitle").textContent=id?"تعديل الاجتماع":"إضافة اجتماع";if(id){const m=meetings.find(x=>x.id===id);if(!m)return;byM("meetingName").value=m.name||"";byM("meetingDay").value=m.day||"";byM("meetingTime").value=m.time||"";byM("meetingLocation").value=m.location||"";byM("meetingDescription").value=m.description||"";byM("meetingStatus").value=m.status||"active"}byM("meetingModal").classList.add("show")}
function closeMeetingModal(){byM("meetingModal").classList.remove("show");editingMeetingId=null}
function removeMeeting(id){const m=meetings.find(x=>x.id===id);if(!m)return;if(confirm(`حذف اجتماع "${m.name}"؟ سيتم حذف سجلات الحضور المرتبطة به.`)){deleteMeeting(id);reloadM();renderM();showToast("تم حذف الاجتماع")}}
function formatTime(t){if(!t)return"—";const [h,m]=t.split(":").map(Number);return `${h%12||12}:${String(m).padStart(2,"0")} ${h>=12?"م":"ص"}`}
function byM(id){return document.getElementById(id)}
window.openMeetingModal=openMeetingModal;window.removeMeeting=removeMeeting;
