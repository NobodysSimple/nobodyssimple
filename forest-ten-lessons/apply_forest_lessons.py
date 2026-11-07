#!/usr/bin/env python3
"""Apply the Forest-only ten-lessons-per-unit update to an existing repo.

Usage from a clone of NobodysSimple/nobodyssimple:
    python path/to/apply_forest_lessons.py --repo . --check
    python path/to/apply_forest_lessons.py --repo .

Changes only the four existing named files and adds the Forest-specific
curriculum/lesson/CSS/test modules listed in this package.
"""
from __future__ import annotations
import argparse
from pathlib import Path
import shutil
import sys

BASE = Path(__file__).resolve().parent
FILES = BASE / 'files'

class PatchError(Exception):
    pass

def replace_once(s: str, a: str, b: str, label: str) -> str:
    n=s.count(a)
    if n!=1:
        raise PatchError(f'{label}: expected one exact anchor, found {n}. Repository may have changed; no files written.')
    return s.replace(a,b,1)

def replace_span(s: str, start: str, end: str, replacement: str, label: str) -> str:
    if s.count(start)!=1 or s.count(end)!=1:
        raise PatchError(f'{label}: could not find unique boundary markers; no files written.')
    i=s.index(start);j=s.index(end)
    if j<=i:
        raise PatchError(f'{label}: boundaries are out of order; no files written.')
    return s[:i]+replacement+s[j:]

def patch_trail(s: str)->str:
    s=replace_once(s,
      "import {getForestUnitOutline, forestUnitOutlines} from './ns-forest-curriculum.mjs';",
      "import {getForestUnitOutline, getForestPlayableLesson, forestStoneLessonGroups, forestPlayableLessonIds, forestUnitOutlines} from './ns-forest-curriculum.mjs';",
      'trail import')
    s=replace_once(s,
      "const recordKey=(world,id)=>`ns-lab:${world}:${id}`;",
      '''const recordKey=(world,id)=>`ns-lab:${world}:${id}`;
const forestLessonKey=id=>`ns-lab-lesson:forest:${id}`;
const safeLearningRecords=()=>{
 try{
  const records=JSON.parse(localStorage.getItem(LEARNING_KEY)||'{}');
  return records&&typeof records==='object'&&!Array.isArray(records)?records:{};
 }catch{return {};}
};
/** Previous Forest stone completions still count as fully completed stones. */
export function isForestLessonComplete(id){
 if(!forestPlayableLessonIds.includes(id))return false;
 const records=safeLearningRecords();
 if(records[forestLessonKey(id)]?.completed===true)return true;
 const nodeId=Object.keys(forestStoneLessonGroups).find(node=>forestStoneLessonGroups[node].includes(id));
 return records[recordKey('forest',nodeId)]?.completed===true;
}
export function forestStoneProgress(nodeId){
 const ids=forestStoneLessonGroups[nodeId];
 if(!ids)return null;
 const done=ids.filter(isForestLessonComplete).length;
 return {nodeId,done,total:ids.length,finished:done===ids.length,
  next:ids.find(id=>!isForestLessonComplete(id))||null};
}
export function markForestLessonComplete(id){
 if(!forestPlayableLessonIds.includes(id))return false;
 try{
  const records=JSON.parse(localStorage.getItem(LEARNING_KEY)||'{}');
  const updated=records&&typeof records==='object'&&!Array.isArray(records)?records:{};
  const when=new Date().toISOString();
  updated[forestLessonKey(id)]={kind:'life-lab-lesson',completed:true,completedAt:when,updatedAt:when};
  localStorage.setItem(LEARNING_KEY,JSON.stringify(updated));
  return true;
 }catch{return false;}
}''', 'trail progress utilities')
    s=replace_once(s,
      '''function completedIds(world){
 try{const value=JSON.parse(localStorage.getItem(LEARNING_KEY)||'{}');return new Set(WORLD_META[world].nodes.filter(n=>value?.[recordKey(world,n.id)]?.completed===true).map(n=>n.id));}
 catch{return new Set();}
}''',
      '''function completedIds(world){
 if(world==='forest')return new Set(WORLD_META.forest.nodes
  .filter(node=>forestStoneProgress(node.id)?.finished).map(node=>node.id));
 try{const value=JSON.parse(localStorage.getItem(LEARNING_KEY)||'{}');return new Set(WORLD_META[world].nodes.filter(n=>value?.[recordKey(world,n.id)]?.completed===true).map(n=>n.id));}
 catch{return new Set();}
}''','trail completion precedence')

    marker='function dialogContent(world,node){'
    old_start=s.index(marker)
    old_end=s.index('function plannedUnitPreview(',old_start)
    original=s[old_start:old_end]
    forest_branch='''function dialogContent(world,node){
 if(world.id==='forest'){
  const progress=forestStoneProgress(node.id);
  const index=world.nodes.findIndex(n=>n.id===node.id);
  const previous=index>0?forestStoneProgress(world.nodes[index-1].id):null;
  const unlocked=!previous||previous.finished;
  const lesson=progress?.next?getForestPlayableLesson(progress.next):null;
  const top=`<div class="ns-trail-dialog__top"><span class="ns-trail-dialog-icon" aria-hidden="true">${nodeIcon(node.type)}</span><button type="button" class="ns-trail-dialog-close" data-trail-close aria-label="Close preview">×</button></div><p class="ns-trail-eyebrow">THE FOREST · UNIT 1 · ${progress.done} OF ${progress.total} LESSONS</p><h2 id="ns-trail-dialog-title">${escapeText(node.title)}</h2><p>${escapeText(node.detail)}</p>`;
  const dots=`<div class="ns-forest-dialog-progress" role="status" aria-label="${progress.done} of ${progress.total} lessons completed">${progress.done} / ${progress.total} lessons completed</div>`;
  if(!unlocked)return `${top}${dots}<p class="ns-trail-dialog-note">Complete the lessons in the preceding stone before moving here. The existing tools remain available independently in Tools.</p>`;
  if(progress.finished)return `${top}${dots}<p>You've finished all the lessons at this stepping stone.</p><a class="ns-trail-dialog-go" href="${escapeText(node.href)}">${node.status==='mission'?'Replay Reality Sorter':'Open tool again'} →</a>`;
  if(!lesson)return `${top}${dots}<p>This lesson is not available yet.</p>`;
  return `${top}${dots}<p><strong>Next lesson ${progress.done+1} of ${progress.total}:</strong> ${escapeText(lesson.title)}</p>
   <a class="ns-trail-dialog-go" href="${escapeText(lesson.href)}">${lesson.type==='tool'?'Open tool':lesson.type==='mission'?'Start mission':'Start lesson'} →</a>
   ${lesson.type==='tool'?`<button type="button" class="ns-trail-mark-complete" data-trail-complete="${escapeText(node.id)}">I've practised this tool · mark lesson complete</button><p class="ns-trail-dialog-note">Mark this only after using the tool. The next lesson opens from the same stone.</p>`:'<p class="ns-trail-dialog-note">Finish this activity to fill another indicator. The same stone will then offer the next lesson.</p>'}`;
 }
'''
    # The old function remains completely intact for Meadow, Bridge, Workshop and Observatory.
    forest_branch+=original[len(marker):]
    s=s[:old_start]+forest_branch+s[old_end:]

    node_markup='''function nodeMarkup(node,index,world){
 const localY=UNIT_H-105-index*97,y=yForUnit(1)+localY;
 const x=round(100*trailX(y,world.id)/480),leftSide=x>50;
 const done=completedIds(world.id),next=world.nodes.find(n=>!done.has(n.id))?.id||null;
 const isDone=done.has(node.id),isCurrent=next===node.id,atLastCompleted=next===null&&index===world.nodes.length-1;
 const state=isDone?'completed':isCurrent?'current':'available';
 // Preserve each Forest stone's original icon, including after completion.
 const kind=world.id==='forest'?node.type:isDone?'review':node.type;
 const ntype=node.type==='capstone'?'capstone':node.type;
 const progress=world.id==='forest'?forestStoneProgress(node.id):null;
 const lessonDots=progress?`<span class="ns-trail-lesson-dots" aria-hidden="true">${forestStoneLessonGroups[node.id].map((id,i)=>`<span class="ns-trail-lesson-dot${isForestLessonComplete(id)?' is-done':''}" style="--dot-angle:${360*i/progress.total}deg"></span>`).join('')}</span>`:'';
 const aria=progress?`${node.title}. ${progress.done} of ${progress.total} lessons complete.`:`${node.title}. ${isDone?'Completed':isCurrent?'Next mission':'Available to practise'}.`;
 const flag=isCurrent&&world.id==='forest'?'NEXT LESSON':isCurrent?'NEXT MISSION':atLastCompleted?'UNIT 1 PRACTISED':'';
 return `<button type="button" class="ns-trail-node ns-trail-node--${state} ns-trail-node--type-${ntype}" data-trail-node="${escapeText(node.id)}" data-unit="1" style="--node-x:${x}%;--node-y:${localY}px" aria-label="${escapeText(aria)}" aria-haspopup="dialog"><span class="ns-trail-stone" aria-hidden="true">${nodeIcon(kind)}</span>${lessonDots}<span class="ns-trail-node-title" data-side="${leftSide?'left':'right'}"><strong>${escapeText(node.title)}</strong><small>${progress?`${progress.done}/${progress.total} LESSONS`:isDone?'COMPLETE':isCurrent?'NEXT MISSION':node.status==='mission'?'INTERACTIVE MISSION':'OPEN TOOL'}</small></span>${isCurrent||atLastCompleted?`<span class="ns-trail-start" aria-hidden="true">${flag}</span><img class="ns-trail-walker" src="${escapeText(world.pose)}" alt="" loading="eager" decoding="async"/>`:''}</button>`;
}
'''
    s=replace_span(s,'function nodeMarkup(node,index,world){','function unitMarkup(world,unit,index){',node_markup,'trail node rendering')
    s=replace_once(s,
      '   const done=markLabNodeComplete(world.id,nodeId);',
      '''   let done=false;
   if(world.id==='forest'){
    const progress=forestStoneProgress(nodeId);
    const nextLesson=progress?.next?getForestPlayableLesson(progress.next):null;
    // A tool's completion requires an explicit choice after trying the tool.
    done=Boolean(nextLesson?.type==='tool'&&markForestLessonComplete(progress.next));
   }else done=markLabNodeComplete(world.id,nodeId);''','trail tool completion')
    return s

def patch_lab(s: str)->str:
    s=replace_once(s,
      "import {renderLivingTrail, cleanupLivingTrail, markLabNodeComplete} from './ns-living-trail.mjs';",
      "import {renderLivingTrail, cleanupLivingTrail, markForestLessonComplete} from './ns-living-trail.mjs';\nimport {renderForestMicroLesson, cleanupForestMicroLesson} from './ns-forest-micro-lessons.mjs';",
      'Life Lab imports')
    s=replace_once(s,
      'export function cleanupNSLab(){clean();clean=()=>{};cleanupLivingTrail();}',
      'export function cleanupNSLab(){clean();clean=()=>{};cleanupForestMicroLesson();cleanupLivingTrail();}',
      'Life Lab teardown')
    s=replace_once(s,
      "if(markLabNodeComplete('forest','reality-sorter')){location.hash='#lab/forest';}",
      "if(markForestLessonComplete('reality-sorter')){location.hash='#lab/forest';}",
      'Reality Sorter completion')
    s=replace_once(s,
      " if(!first){renderLivingTrail(main,null,WORLDS);return;}\n else if(first==='mission')",
      " if(!first){renderLivingTrail(main,null,WORLDS);return;}\n else if(first==='lesson'&&second==='forest'&&!extra.length){renderForestMicroLesson(main,third);return;}\n else if(first==='mission')",
      'Forest micro-lesson route')
    return s

def patch_index(s: str)->str:
    return replace_once(s,
      '<link rel="stylesheet" href="ns-trail-fidelity.css?v=4" />',
      '<link rel="stylesheet" href="ns-trail-fidelity.css?v=4" />\n    <link rel="stylesheet" href="ns-forest-lessons.css?v=1" />',
      'Forest CSS import')

def patch_test(s: str)->str:
    return replace_once(s,
      'assert.ok(forestUnitOutlines.every(u=>u.steps.length===5));',
      'assert.ok(forestUnitOutlines.every(u=>u.steps.length===10));',
      'existing Forest test')

def build(repo:Path)->dict[Path,str]:
    updates={}
    for filename,patcher in [
      ('ns-living-trail.mjs',patch_trail),
      ('ns-life-lab.mjs',patch_lab),
      ('index.html',patch_index),
      ('tests/free/forest-trail-fidelity.test.mjs',patch_test)]:
        path=repo/filename
        if not path.is_file(): raise PatchError(f'Missing required file: {filename}')
        updates[path]=patcher(path.read_text(encoding='utf-8'))
    for filename in ['ns-forest-curriculum.mjs','ns-forest-micro-lessons.mjs',
                     'ns-forest-lessons.css','tests/free/forest-ten-lessons.test.mjs']:
        path=repo/filename
        if filename!='ns-forest-curriculum.mjs' and path.exists():
            raise PatchError(f'Already exists: {filename}; refusing to overwrite.')
        updates[path]=(FILES/filename).read_text(encoding='utf-8')
    return updates

def main()->int:
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--repo',type=Path,default=Path.cwd(),help='Path to project checkout')
    parser.add_argument('--check',action='store_true',help='Validate and preview without editing')
    args=parser.parse_args(); repo=args.repo.resolve()
    if not (repo/'site.mjs').is_file() or not (repo/'ns-living-trail.mjs').is_file():
        print('Not a Nobody’s Simple repo directory. Supply --repo path/to/nobodyssimple',file=sys.stderr);return 2
    try: updates=build(repo)
    except PatchError as e: print(f'NOT APPLIED: {e}',file=sys.stderr);return 2
    print('Forest-only patch validated. Files to create/update:')
    for path in updates: print(' -',path.relative_to(repo))
    if args.check:
        print('Dry run complete. No files changed.');return 0
    # Save original files outside the repository (beside this installer).
    # Check every backup destination BEFORE changing any repository file.
    backup_root=BASE/'backups'
    for path in updates:
        if path.is_file():
            backup=backup_root/path.relative_to(repo)
            if backup.exists(): raise PatchError(f'Backup already exists: {backup}')
    for path,content in updates.items():
        path.parent.mkdir(parents=True,exist_ok=True)
        if path.is_file():
            backup=backup_root/path.relative_to(repo)
            backup.parent.mkdir(parents=True,exist_ok=True)
            shutil.copy2(path,backup)
        path.write_text(content,encoding='utf-8')
    print('Patch installed. Run: node --test tests/free/*.test.mjs')
    print('Originals are in the patch-package backups/ folder. Review `git diff` before committing.')
    return 0

if __name__=='__main__':
    try: sys.exit(main())
    except PatchError as e:
        print('Stopped:',e,file=sys.stderr);sys.exit(2)
