export const lifestyleTaskKey = 'ns-lifestyle-tasks-v1';
export const focusTaskKey = 'ns-simplyfocus-tasks-v1';

const readJSON = (key,fallback) => { try { const value=JSON.parse(localStorage.getItem(key)||'null'); return value ?? fallback; } catch { return fallback; } };
const writeJSON = (key,value) => localStorage.setItem(key,JSON.stringify(value));
const localDate = (date=new Date()) => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
export const taskId = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export function readLifestyleTasks(){ const value=readJSON(lifestyleTaskKey,[]); return Array.isArray(value)?value:[]; }
export function writeLifestyleTasks(tasks){ writeJSON(lifestyleTaskKey,tasks); window.dispatchEvent(new CustomEvent('ns:lifestyle-tasks',{detail:{count:tasks.length}})); }
export function addLifestyleTask(task){ const tasks=readLifestyleTasks(); const next={id:task.id||taskId(),title:String(task.title||'').trim().slice(0,120),notes:String(task.notes||'').trim().slice(0,500),date:task.date||localDate(),time:task.time||'',done:Boolean(task.done),createdAt:task.createdAt||new Date().toISOString()}; if(!next.title)return null; tasks.push(next);writeLifestyleTasks(tasks);return next; }

export function readFocusBoard(){ const value=readJSON(focusTaskKey,{tasks:[],projects:['Personal']}); return {tasks:Array.isArray(value?.tasks)?value.tasks:[],projects:Array.isArray(value?.projects)&&value.projects.length?value.projects:['Personal']}; }
export function writeFocusBoard(board){ writeJSON(focusTaskKey,board); window.dispatchEvent(new CustomEvent('ns:focus-tasks',{detail:{count:board.tasks.length}})); }

export function moveLifestyleToFocus(id){ const lifestyle=readLifestyleTasks(); const task=lifestyle.find(item=>item.id===id); if(!task)return false; const board=readFocusBoard(); if(!board.projects.includes('Lifestyle'))board.projects.push('Lifestyle'); board.tasks.push({id:task.id,title:task.title,notes:task.notes,estimate:1,project:'Lifestyle',done:task.done,source:'lifestyle',scheduledDate:task.date||''}); writeFocusBoard(board);writeLifestyleTasks(lifestyle.filter(item=>item.id!==id));return true; }
export function moveFocusToLifestyle(id){ const board=readFocusBoard(); const task=board.tasks.find(item=>item.id===id); if(!task)return false; addLifestyleTask({id:task.id,title:task.title,notes:task.notes,date:task.scheduledDate||localDate(),done:task.done,createdAt:new Date().toISOString()});writeFocusBoard({...board,tasks:board.tasks.filter(item=>item.id!==id)});return true; }
