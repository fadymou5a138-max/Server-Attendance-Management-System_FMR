"use strict";
const STORAGE_KEYS={servants:"fmr_servants",meetings:"fmr_meetings",attendance:"fmr_attendance",settings:"fmr_settings"};
function readStorage(key,fallback=[]){try{const d=localStorage.getItem(key);return d?JSON.parse(d):fallback}catch(e){console.error(e);return fallback}}
function writeStorage(key,data){try{localStorage.setItem(key,JSON.stringify(data));return true}catch(e){console.error(e);return false}}
function generateID(prefix="item"){return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2,8)}`}
function getServants(){return readStorage(STORAGE_KEYS.servants,[])}
function saveServants(v){return writeStorage(STORAGE_KEYS.servants,Array.isArray(v)?v:[])}
function addServant(v){const a=getServants();const n={id:v.id||generateID("servant"),name:v.name||"",phone:v.phone||"",group:v.group||"",role:v.role||"",status:v.status||"active",createdAt:v.createdAt||new Date().toISOString(),updatedAt:new Date().toISOString()};a.push(n);saveServants(a);return n}
function updateServant(id,u){const a=getServants(),i=a.findIndex(x=>x.id===id);if(i<0)return null;a[i]={...a[i],...u,updatedAt:new Date().toISOString()};saveServants(a);return a[i]}
function deleteServant(id){saveServants(getServants().filter(x=>x.id!==id));saveAttendance(getAttendance().filter(x=>x.servantId!==id));return true}
function getMeetings(){return readStorage(STORAGE_KEYS.meetings,[])}
function saveMeetings(v){return writeStorage(STORAGE_KEYS.meetings,Array.isArray(v)?v:[])}
function addMeeting(v){const a=getMeetings();const n={id:v.id||generateID("meeting"),name:v.name||"",day:v.day||"",time:v.time||"",location:v.location||"",description:v.description||"",status:v.status||"active",createdAt:v.createdAt||new Date().toISOString(),updatedAt:new Date().toISOString()};a.push(n);saveMeetings(a);return n}
function updateMeeting(id,u){const a=getMeetings(),i=a.findIndex(x=>x.id===id);if(i<0)return null;a[i]={...a[i],...u,updatedAt:new Date().toISOString()};saveMeetings(a);return a[i]}
function deleteMeeting(id){saveMeetings(getMeetings().filter(x=>x.id!==id));saveAttendance(getAttendance().filter(x=>x.meetingId!==id));return true}
function getAttendance(){return readStorage(STORAGE_KEYS.attendance,[])}
function saveAttendance(v){return writeStorage(STORAGE_KEYS.attendance,Array.isArray(v)?v:[])}
function addAttendance(r){const a=getAttendance();const n={id:r.id||generateID("attendance"),servantId:r.servantId||"",servantName:r.servantName||"",meetingId:r.meetingId||"",meetingName:r.meetingName||"",date:r.date||"",status:r.status||"absent",updatedAt:new Date().toISOString()};const i=a.findIndex(x=>x.servantId===n.servantId&&x.meetingId===n.meetingId&&x.date===n.date);if(i>=0)a[i]={...a[i],...n,id:a[i].id};else a.push(n);saveAttendance(a);return n}
function getSettings(){return readStorage(STORAGE_KEYS.settings,{})}
function saveSettings(v){return writeStorage(STORAGE_KEYS.settings,v||{})}
function getToday(){const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`}
function getTodayAttendance(){return getAttendance().filter(x=>x.date===getToday())}
function getAttendanceStats(records=getAttendance()){const s=getSettings(),p=records.filter(x=>x.status==="present").length,a=records.filter(x=>x.status==="absent").length,l=records.filter(x=>x.status==="late").length,t=p+a+l,att=p+(s.lateAsPresent===false?0:l),percentage=t?Math.round(att/t*100):0;return{total:t,present:p,absent:a,late:l,percentage}}
function exportDatabase(){return{version:"1.0",exportedAt:new Date().toISOString(),servants:getServants(),meetings:getMeetings(),attendance:getAttendance(),settings:getSettings()}}
function importDatabase(b){if(!b||!Array.isArray(b.servants)||!Array.isArray(b.meetings)||!Array.isArray(b.attendance))return false;saveServants(b.servants);saveMeetings(b.meetings);saveAttendance(b.attendance);if(b.settings&&typeof b.settings==="object")saveSettings(b.settings);return true}
function clearDatabase(){Object.values(STORAGE_KEYS).forEach(k=>localStorage.removeItem(k));return true}
