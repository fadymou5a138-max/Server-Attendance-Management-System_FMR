"use strict";
let servants=[],editingServantId=null;
document.addEventListener("DOMContentLoaded",()=>{reload();bind();render()});
function reload(){servants=getServants()}
function bind(){
  byId("addServantBtn")?.addEventListener("click",()=>openServantModal());
  byId("closeServantModal")?.addEventListener("click",closeServantModal);
  byId("cancelServantBtn")?.addEventListener("click",closeServantModal);
  byId("servantSearch")?.addEventListener("input",render);
  byId("servantForm")?.addEventListener("submit",e=>{e.preventDefault();const name=byId("servantName").value.trim();if(!name)return showToast("أدخل اسم الخادم","error");const data={name,phone:byId("servantPhone").value.trim(),group:byId("servantGroup").value.trim(),role:byId("servantRole").value.trim(),status:byId("servantStatus").value};editingServantId?updateServant(editingServantId,data):addServant(data);reload();render();closeServantModal();showToast(editingServantId?"تم التعديل":"تمت الإضافة")});
}
function render(){
  const q=(byId("servantSearch")?.value||"").toLowerCase();const list=servants.filter(s=>`${s.name} ${s.phone} ${s.group} ${s.role}`.toLowerCase().includes(q));
  setText("totalServantsCount",servants.length);setText("activeServantsCount",servants.filter(x=>x.status==="active").length);setText("inactiveServantsCount",servants.filter(x=>x.status==="inactive").length);setText("tableServantsCount",`${list.length} خادم`);
  byId("servantsTableBody").innerHTML=list.length?list.map(s=>`<tr><td><div class="servant-name"><div class="servant-avatar">${escapeHTML((s.name||"?").charAt(0))}</div><strong>${escapeHTML(s.name)}</strong></div></td><td>${escapeHTML(s.phone||"—")}</td><td>${escapeHTML(s.group||"—")}</td><td>${escapeHTML(s.role||"—")}</td><td><span class="status-badge ${s.status}">${s.status==="active"?"نشط":"غير نشط"}</span></td><td>${formatDate(s.createdAt)}</td><td><div class="action-group"><button class="action-btn edit" onclick="openServantModal('${s.id}')"><i class="fa-solid fa-pen"></i></button><button class="action-btn delete" onclick="removeServant('${s.id}')"><i class="fa-solid fa-trash"></i></button></div></td></tr>`).join(""):`<tr><td colspan="7"><div class="empty-state"><i class="fa-solid fa-users"></i>لا توجد بيانات</div></td></tr>`;
}
function openServantModal(id=null){editingServantId=id;byId("servantForm").reset();byId("servantModalTitle").textContent=id?"تعديل خادم":"إضافة خادم";if(id){const s=servants.find(x=>x.id===id);if(!s)return;byId("servantName").value=s.name||"";byId("servantPhone").value=s.phone||"";byId("servantGroup").value=s.group||"";byId("servantRole").value=s.role||"";byId("servantStatus").value=s.status||"active"}byId("servantModal").classList.add("show")}
function closeServantModal(){byId("servantModal").classList.remove("show");editingServantId=null}
function removeServant(id){const s=servants.find(x=>x.id===id);if(!s)return;if(confirm(`حذف الخادم "${s.name}"؟`)){deleteServant(id);reload();render();showToast("تم حذف الخادم")}}
function byId(id){return document.getElementById(id)}function formatDate(v){if(!v)return"—";return new Date(v).toLocaleDateString("ar-EG")}
window.openServantModal=openServantModal;window.removeServant=removeServant;
