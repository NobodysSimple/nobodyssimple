import test from 'node:test';
import assert from 'node:assert/strict';
import {safetyScreen,chooseGroup,startReasoning,nextQuestion,answerQuestion,rankedCandidates,reasoningSummary,reviewReasoning,explainSuitability} from '../../ns-reasoning-model.mjs';
import {atlasGet} from '../../ns-atlas-core.mjs';
import {LEARNING_STAGES,evidenceMetadata} from '../../ns-reasoning-bridge.mjs';

test('high-risk safety signals take precedence over unrelated keyword matches',()=>{
 assert.equal(safetyScreen('My partner monitors my phone')?.kind,'coercion');
 assert.equal(safetyScreen("I don't feel safe at home")?.kind,'coercion');
 assert.equal(safetyScreen("I wake up gasping")?.kind,'physical');
 assert.equal(safetyScreen('I hear voices')?.kind,'unusual');
 assert.equal(safetyScreen('I think of harming someone')?.kind,'unusual');
 assert.equal(safetyScreen('I will hurt someone')?.kind,'crisis');
 assert.equal(safetyScreen('I have suicidal thoughts')?.kind,'crisis');
 assert.equal(safetyScreen('I am NOT suicidal'),null);
 assert.equal(safetyScreen('I enjoy being submissive'),null);
 assert.equal(safetyScreen('My boss bullies me')?.kind,'structural');
});
test('case grouping distinguishes social evaluation, work, sleep, checking and threats',()=>{
 assert.equal(chooseGroup('I fear people judging me')?.id,'social');
 assert.equal(chooseGroup('My boss bullies me')?.id,'work');
 assert.equal(chooseGroup('I wake up at night gasping')?.id,'sleep');
 assert.equal(chooseGroup('I keep checking my messages')?.id,'checking');
 assert.equal(chooseGroup('I think everyone is watching me')?.id,'threat');
});
test('unanswered questions do not create false evidence and mechanisms can be challenged',()=>{
 let st=startReasoning('I keep checking my messages');
 const q=nextQuestion(st);
 assert.equal(q.id,'driver');
 const before=st.candidates.find(c=>c.id==='binge-scroll')?.score;
 st=answerQuestion(st,q.id,'routine');
 assert.ok(st.candidates.find(c=>c.id==='binge-scroll').score>before);
 assert.ok(st.candidates.find(c=>c.id==='ritual-checking').challenges.length>=1);
 assert.equal(st.answers.length,1);
 assert.ok(nextQuestion(st));
 const summary=reasoningSummary(st);
 assert.ok(summary.uncertainty.includes('distinguishing information'));
});
test('context can change what help is suitable rather than assuming motivation is the problem',()=>{
 let st=startReasoning('I keep putting off an assignment');
 assert.equal(chooseGroup(st.raw)?.id,'action');
 st=answerQuestion(st,nextQuestion(st).id,'demands');
 assert.ok(st.candidates.some(c=>c.id==='too-many-tasks'&&c.supports.length));
 assert.ok(reasoningSummary(st).signals.includes('capacity'));
});
test('coercive control is routed to safety-first support, not routine relationship advice',()=>{
 const st=startReasoning('My partner monitors my phone');
 assert.equal(st.safety.kind,'coercion');
 assert.equal(nextQuestion(st),null);
 assert.ok(rankedCandidates(st).some(c=>c.id==='control-harm'));
});
test('question sequences stop and preserve alternatives rather than inventing certainty',()=>{
 let st=startReasoning('I am worried about being judged');
 for(let i=0;i<4;i++){const q=nextQuestion(st);if(!q)break;st=answerQuestion(st,q.id,q.options.at(-1).id);}
 assert.equal(nextQuestion(st),null);
 assert.ok(rankedCandidates(st).length>1);
 assert.match(explainSuitability(st,rankedCandidates(st)[0].id).limits,/not a diagnosis|not established|A safety/i);
 st=reviewReasoning(st,'not-fit');
 assert.ok(st.revision.length===1);
 assert.match(st.reviewMessage,/may not fit/i);
});
test('the ten educational sections are retained inside three visible guide stages',()=>{
 assert.deepEqual(LEARNING_STAGES.flatMap(x=>x.sections).sort((a,b)=>a-b),[0,1,2,3,4,5,6,7,8,9]);
 assert.equal(evidenceMetadata('work-stress').reviewStatus,'Not independently clinically validated');
 assert.ok(evidenceMetadata('social-anxiety').sources.length>0);
});
test('all authored candidate identifiers refer to actual atlas topics',()=>{
 for(const raw of ['I cannot sleep','My partner scares me','I keep checking','My boss bullies me',
 'I cannot start a task','I fear social embarrassment','I want to discuss my submissive preference']){
  const st=startReasoning(raw);
  for(const x of st.candidates) assert.ok(atlasGet(x.id),x.id+' '+raw);
 }
});
