/* Five deliberately fine-grained, clinically informed *educational* example
   pathways. Separate symptoms, traits and diagnostic constructs.
   No item here is a validated diagnostic instrument. No cause can be inferred
   from a brief answer pattern. */
const card=(id,title,definition,taxonomy,signs,cycle,maintainers,contributors,targets,progress,questions,links,contrasts,alert='')=>({
  id,title,definition,taxonomy,signs,cycle,maintainers,contributors,targets,progress,questions,links,contrasts,alert
});
const signs=(thoughts,feelings,behaviours,body)=>({thoughts,feelings,behaviours,body});
const m=(id,label,detail,target,tool,tryFirst)=>({id,label,detail,target,tool,tryFirst});
const t=(id,title,why,action,tool)=>({id,title,why,action,tool});
const c=(id,label)=>({id,label});
const link=(title,url)=>({title,url});
export const preciseProfiles=Object.freeze([
card('social-anxiety','Fear of being judged by others',
 'Social-evaluation fear means anticipating criticism, embarrassment or rejection in situations where other people may notice or evaluate you. That experience is not, by itself, a diagnosis of social anxiety disorder.',
 'HiTOP: Fear → Social phobia (syndrome); interpersonal anxiety (component).',
 signs(
 ['They will think I am awkward','I must not look nervous','I will replay anything I say'],
 ['Fear of criticism','Shame or embarrassment'],
 ['Avoiding speaking up','Rehearsing sentences','Watching yourself rather than the conversation'],
 ['Blushing, trembling or sweating','Tension or racing heartbeat']
 ),
 ['Fear of negative evaluation','Avoidance or self-protective behaviour','Short-term relief, but fewer disconfirming experiences','Stronger fear before the next situation'],
 [
 m('avoidance','Avoidance','Avoiding feared social situations can relieve distress immediately, but may prevent learning how manageable a situation can be.','Reduce avoidance','small-step','Choose one low-stakes interaction you would like to approach, at your own pace.'),
 m('self-focus','Monitoring how you appear','Constantly checking your voice, face or performance can increase anxiety and reduce attention to the interaction.','Shift attention outward','attention-mission','For one brief conversation, attend to what the other person actually says.'),
 m('safety','Safety behaviours','Over-rehearsing, hiding visible anxiety or only speaking when absolutely certain can leave a feared prediction untested.','Test a safety behaviour','pattern-experiment','Notice one safety behaviour. If it feels safe, consider a small experiment with using it less.'),
 m('replay','Post-event replay','Repeatedly reviewing an interaction can magnify imagined errors and selectively remember negative details.','Reduce post-event rumination','rumination','Note the facts and one learning point; avoid an endless performance review.')
 ],
 [c('sleep','Poor sleep or fatigue'),c('history','Past criticism or bullying'),c('context','Current social environment'),c('perfectionism','High standards for your performance'),c('access','Communication or accessibility barriers'),c('stress','Current stress or workload')],
 [
 t('avoidance','Make approach easier','Reducing avoidance can provide experience that fear alone cannot supply.','Pick one small, safe social action you can choose rather than an all-or-nothing challenge.','small-step'),
 t('self-focus','Practise outward attention','Less self-monitoring may make it easier to understand what is happening around you.','During a short conversation, bring attention back to the topic or the other person.','attention-mission'),
 t('replay','End the post-event review','A bounded review can keep useful learning while reducing repetitive self-criticism.','Write one observed fact and one reasonable next step, then change activity.','rumination'),
 t('safety','Examine safety behaviours','Protective rituals may stop a feared prediction from being fairly tested.','Identify one nonessential behaviour you could experiment with safely.','pattern-experiment')
 ],
 ['Noticing the feared prediction','Participating with less effort or avoidance','Recovering more easily after an interaction','Reduced interference in relationships, study or work'],
 [
 {id:'fear',q:'What worries you most around other people?',options:[
 ['judged','Being judged, criticised or embarrassed','social-anxiety'],
 ['panic','Having overwhelming physical panic symptoms','panic-experiences'],
 ['rejected','Losing approval or feeling unable to say no','submissive-patterns'],
 ['unclear','Several things or not sure',null]]},
 {id:'response',q:'What usually happens when you feel that fear?',options:[
 ['avoid','I avoid the situation or leave early',null,'avoidance'],
 ['hide','I carefully rehearse or hide anxiety',null,'safety'],
 ['monitor','I watch myself closely',null,'self-focus'],
 ['replay','I replay the interaction afterwards',null,'replay'],
 ['other','Something else or several patterns',null,null]]}
 ],
 [link('NHS: Social anxiety','https://www.nhs.uk/mental-health/conditions/social-anxiety/'),
  link('NICE: Social anxiety treatment and assessment','https://www.nice.org.uk/guidance/cg159/chapter/recommendations')],
 ['Panic sensations can occur in social anxiety, but fear of the sensations themselves may be a different primary concern.','Real discrimination or hostile treatment is not simply a distorted belief. Safer conditions and support may be needed.']
),
card('panic-experiences','Sudden episodes of intense fear or alarm',
 'A panic episode involves a rapid surge of fear or bodily alarm. Repeated unexpected attacks and ongoing fear of further attacks can occur in panic disorder, but this page cannot determine whether that diagnosis applies.',
 'HiTOP: Fear → Panic disorder (syndrome); physiological panic (component).',
 signs(
 ['What if I collapse or lose control?','What if it happens again?'],
 ['Sudden intense fear','Dread of another episode'],
 ['Escaping or avoiding places','Monitoring breathing or heartbeat','Keeping constant reassurance nearby'],
 ['Racing heart or trembling','Dizziness or breathlessness','Feeling unreal or detached']
 ),
 ['A bodily sensation or sudden alarm','Threatening interpretation of the sensation','Escalating fear and urge to escape or check','More vigilance for the next episode'],
 [
 m('catastrophic','Catastrophic interpretations','Interpreting bodily symptoms as definite catastrophe can intensify alarm, though new symptoms should still be assessed medically.','Understand the panic cycle','reality-map','Separate the sensation, your prediction and the current medical context.'),
 m('monitoring','Body monitoring','Constantly checking sensations may make ordinary changes more noticeable or threatening.','Reduce unnecessary monitoring','body-check','Notice when checking adds information and when it only fuels vigilance.'),
 m('avoidance','Avoidance of feared places','Avoiding every situation associated with an attack can shrink activity and maintain fear of another episode.','Rebuild confidence in safe contexts','small-step','Choose a manageable, safe everyday activity; seek professional guidance if needed.'),
 m('reassurance','Repeated reassurance or escape preparation','Reassurance can help initially, but a repeated ritual may keep a sense of danger prominent.','Review reassurance patterns','rumination','Distinguish necessary safety checking from repeated reassurance that adds no new evidence.')
 ],
 [c('sleep','Sleep disruption'),c('stress','Prolonged stress'),c('health','Health or medication factors'),c('caffeine','Caffeine or other stimulants'),c('environment','Unpredictable or threatening environments'),c('history','Previous frightening episodes')],
 [
 t('catastrophic','Understand the body–fear loop','Interpreting a sensation more accurately can sometimes interrupt escalating alarm.','Read about panic symptoms and review new symptoms appropriately with a clinician.','reality-map'),
 t('monitoring','Notice checking patterns','Tracking when attention repeatedly returns to sensations can reveal unhelpful monitoring.','Write down when a check is medically warranted versus driven by repeated doubt.','body-check'),
 t('avoidance','Reduce unnecessary avoidance','Safe, gradual return to ordinary activities may help reduce impairment.','With appropriate support, identify a small activity that matters to you.','small-step'),
 t('reassurance','Build a workable response plan','A planned response is different from having to seek reassurance repeatedly.','Write a concise, medically informed coping and support plan.','state-check')
 ],
 ['Recognising the beginning of a panic episode','Responding with less unnecessary checking','Recovering and returning to activities','Less fear-driven interference over time'],
 [
 {id:'fear',q:'What feels most frightening during the episode?',options:[
 ['body','The physical sensations or fear of losing control','panic-experiences'],
 ['judged','Other people noticing or judging me','social-anxiety'],
 ['health','A new or unresolved health concern','health-worry'],
 ['unclear','Several things or unsure',null]]},
 {id:'pattern',q:'What usually happens afterwards?',options:[
 ['avoid','I avoid places in case it happens again',null,'avoidance'],
 ['watch','I monitor my body for signs',null,'monitoring'],
 ['check','I seek repeated reassurance',null,'reassurance'],
 ['interpret','I fear the sensations mean catastrophe',null,'catastrophic'],
 ['other','Several things or something else',null,null]]}
 ],
 [link('NHS: Panic disorder','https://www.nhs.uk/mental-health/conditions/panic-disorder/'),
  link('NICE: Panic disorder management','https://www.nice.org.uk/guidance/cg113/chapter/recommendations')],
 ['A panic attack is not the same as panic disorder.','Some symptoms overlap with physical conditions, so new or concerning chest pain, collapse or breathlessness must not be automatically attributed to anxiety.'],
 'New or unusual chest pain, fainting, severe breathing difficulty or other acute physical symptoms need appropriate urgent medical attention.'
),
card('insomnia','Difficulty falling or staying asleep',
 'Insomnia describes recurring difficulty getting to sleep, staying asleep or waking too early, often alongside daytime tiredness or impaired functioning. It does not always have one psychological explanation.',
 'HiTOP: Distress → Insomnia (homogeneous symptom component).',
 signs(
 ['I have to get to sleep now','Tomorrow will be ruined if I cannot sleep'],
 ['Frustration at bedtime','Anxiety about the next day'],
 ['Clock watching','Staying in bed awake for long periods','Irregular sleep schedules'],
 ['Feeling tired but alert','Daytime fatigue or poor concentration']
 ),
 ['Poor or interrupted sleep','Pressure or worry about sleeping','Increased alertness and monitoring','Greater difficulty sleeping on subsequent nights'],
 [
 m('sleep-pressure','Pressure to force sleep','Monitoring sleep and trying hard to make it happen can increase alertness in bed.','Reduce pressure and sleep monitoring','rumination','Notice whether clock watching or calculations about sleep make you more alert.'),
 m('schedule','Irregular timing or cues','Shifting sleep and wake patterns may disrupt the regular timing that supports sleep.','Build more stable cues','if-then','Consider a realistic, consistent wake-time cue while accounting for shift work.'),
 m('arousal','Bedtime arousal','Stress and extended worry can keep the mind and body activated when rest is needed.','Reduce pre-bed arousal','quick-reset','Try a brief, non-striving wind-down routine outside the pressure of falling asleep.'),
 m('environment','Unsuitable sleep conditions','Noise, temperature, light, caregiving or safety may physically interfere with sleep.','Adjust the sleep environment','environment-design','Identify one condition you could realistically change or obtain help with.')
 ],
 [c('shift','Shift work or irregular hours'),c('pain','Pain or other health conditions'),c('medication','Medication, caffeine or substances'),c('stress','Stress, anxiety or workload'),c('noise','Noise, housing or caring demands'),c('sleep-conditions','Breathing, snoring or other sleep symptoms')],
 [
 t('sleep-pressure','Reduce the struggle to sleep','Less effortful sleep monitoring can reduce unhelpful bedtime pressure.','Avoid turning bedtime into a performance test; learn about CBT-I principles.','rumination'),
 t('schedule','Stabilise appropriate cues','Consistent cues can support the sleep-wake rhythm when circumstances permit.','Explore a realistic routine and the conditions needed to sustain it.','if-then'),
 t('arousal','Create a gentler wind-down','Reducing arousal may help when stress is part of the pattern.','Try a brief settling routine without making sleep an achievement.','quick-reset'),
 t('environment','Change what interrupts sleep','Environmental changes can be more relevant than thought work when the setting prevents rest.','Identify a practical noise, lighting, temperature or support adjustment.','environment-design')
 ],
 ['Noticing patterns and what disrupts sleep','Less worry or monitoring at bedtime','More workable rest routines or support','Improved daytime function, not perfect sleep every night'],
 [
 {id:'pattern',q:'Which sleep difficulty is closest?',options:[
 ['onset','I struggle to fall asleep','insomnia'],
 ['middle','I wake up repeatedly','insomnia'],
 ['early','I wake too early and cannot return to sleep','insomnia'],
 ['unrefreshed','I sleep but wake unrefreshed','fatigue'],
 ['other','My schedule changes or something else',null]]},
 {id:'influence',q:'What seems to interfere most?',options:[
 ['pressure','Pressure and clock-watching',null,'sleep-pressure'],
 ['stress','A busy or activated mind',null,'arousal'],
 ['routine','Irregular sleep or waking times',null,'schedule'],
 ['setting','Noise, caring duties, pain or my environment',null,'environment'],
 ['unknown','Not sure / several of these',null,null]]}
 ],
 [link('NHS: Insomnia','https://www.nhs.uk/conditions/insomnia/'),
  link('NICE: CBT for insomnia principles (2026)','https://www.nice.org.uk/guidance/gid-hte10068/documents/final-scope')],
 ['Unrefreshing sleep, loud snoring, breathing pauses, pain or new fatigue can warrant medical investigation rather than a self-help sleep label.','For chronic insomnia, clinician-guided CBT-I is a recommended approach; unsupervised sleep restriction is not appropriate for everybody.'],
 'Persistent sleep problems, marked daytime sleepiness or breathing-related symptoms are reasons to consider a GP assessment.'
),
card('rumination','Replaying thoughts or problems repeatedly',
 'Rumination means repeatedly turning over distressing thoughts or problems without reaching a useful new action. It can involve past events, perceived mistakes or the meaning of feelings; it is a process, not a diagnosis.',
 'Cross-cutting process: not a standalone HiTOP syndrome in the supplied figure. Related to distress, repetitive thinking and other spectra.',
 signs(
 ['Why did I do that?','What is wrong with me?','I have to think this through again'],
 ['Frustration or sadness','Anxiety or self-criticism'],
 ['Replaying conversations','Long internal debates','Putting off action while analysing'],
 ['Tension or difficulty concentrating','Sleep disruption']
 ),
 ['A distressing event or question','Repetitive abstract analysis','Temporary feeling of working on it','Less action, more distress or another round of replay'],
 [
 m('abstract','Abstract why-questions','Repeated global questions such as “Why am I like this?” may sustain negative self-focus without yielding an actionable answer.','Move toward concrete processing','brain-dump','Change “why am I like this?” to “what happened and what can I do next?”'),
 m('certainty','Trying to reach certainty','Seeking a final, perfect interpretation can keep the same uncertainty active.','Tolerate unresolved questions','uncertainty-calibration','Ask what genuinely new information another review could give.'),
 m('avoidance','Analysis instead of action','Thinking can sometimes substitute for a difficult but manageable action or decision.','Turn thought into a step','small-step','Choose one next action or decide to deliberately stop analysing for now.'),
 m('self-criticism','Self-critical replay','Selective attention to mistakes can turn review into repeated self-punishment.','Practise fair self-evaluation','thought-map','List what you know, what you are assuming and what you would say to someone else.')
 ],
 [c('low-mood','Low mood'),c('sleep','Poor sleep or fatigue'),c('uncertainty','Unresolved uncertainty'),c('loss','Loss, criticism or rejection'),c('stress','Persistent demands'),c('perfectionism','Strong self-imposed standards')],
 [
 t('abstract','Use concrete questions','Specific descriptions create more room for problem-solving than general self-blame.','Write the event, one observation and one useful next step.','brain-dump'),
 t('certainty','Stop demanding the perfect answer','A practical decision can sometimes be possible without complete certainty.','Set a boundary for how much new checking or analysis is actually useful.','uncertainty-calibration'),
 t('avoidance','Act on one solvable part','A small action can test whether the thought is giving you new information.','Identify one action that moves the situation forward.','small-step'),
 t('self-criticism','Separate fair review from punishment','Balanced reflection is different from repeatedly rehearsing faults.','Consider evidence for and against a sweeping negative conclusion.','thought-map')
 ],
 ['Noticing when thinking has become repetitive','Being able to interrupt a loop without solving everything','More time spent on purposeful action','Less interference with sleep, mood or concentration'],
 [
 {id:'type',q:'What kind of repeated thinking is most familiar?',options:[
 ['past','I replay past events or personal mistakes','rumination'],
 ['future','I think through future “what ifs”','what-if'],
 ['intrusions','Unwanted intrusive thoughts that alarm me','intrusive'],
 ['checks','I feel driven to check or neutralise something','checking'],
 ['not-sure','A mixture / not sure',null]]},
 {id:'pattern',q:'What tends to keep the loop going?',options:[
 ['why','Trying to find the ultimate explanation',null,'abstract'],
 ['certain','Needing certainty',null,'certainty'],
 ['avoid','Thinking instead of taking action',null,'avoidance'],
 ['blame','Criticising myself',null,'self-criticism'],
 ['other','Several things or unsure',null,null]]}
 ],
 [link('Review: Reflecting on rumination (Watkins & Roberts, 2020)','https://pubmed.ncbi.nlm.nih.gov/32087393/'),
  link('NHS: Tackling your worries','https://www.nhs.uk/every-mind-matters/mental-wellbeing-tips/self-help-cbt-techniques/tackling-your-worries/')],
 ['Rumination about the past differs from anticipatory worry about the future, and both differ from intrusive obsessions with compulsions.','There are also useful, time-limited forms of reflection; the problem is not thinking itself.']
),
card('submissive-patterns','Difficulty asserting needs or saying no',
 'Submissiveness is described as a trait in the HiTOP framework. Choosing to be receptive, gentle or submissive in a consensual relationship is not inherently a psychological problem. The concern here is unwanted compliance that overrides your preferences or safety.',
 'HiTOP: Internalizing → Submissiveness (maladaptive trait component); not a diagnosis.',
 signs(
 ['They might be upset if I disagree','My preferences are less important','I need permission to say no'],
 ['Guilt when asserting yourself','Fear of conflict or disapproval'],
 ['Agreeing when you want to decline','Letting others decide to avoid tension','Difficulty communicating preferences'],
 ['Tension before setting limits','Exhaustion or resentment afterwards']
 ),
 ['Anticipating disapproval or conflict','Compliance or silence','Immediate reduction in tension','Needs remain unmet; asserting yourself feels harder next time'],
 [
 m('fear-disapproval','Fear of disapproval','Concern about losing approval may make unwanted agreement feel safer in the moment.','Express a small preference','needs-clarifier','Identify one low-stakes preference you can state without having to justify it.'),
 m('conflict','Avoiding interpersonal conflict','Silence can bring short-term peace while leaving expectations and resentment unchanged.','Practise respectful disagreement','conversation-map','Try a short sentence that expresses both care and a different preference.'),
 m('self-worth','Discounting your own needs','Beliefs that other people always matter more may make boundaries feel undeserved.','Clarify needs and rights','boundary-builder','Write one reasonable need and what respecting it would look like.'),
 m('pressure','External pressure or unequal power','When consequences, dependence or coercion constrain choices, individual assertiveness exercises may be unsafe or insufficient.','Prioritise autonomy and safety','context-map','Examine which conditions limit choice and what safe support or options exist.')
 ],
 [c('history','Past criticism or punishment'),c('roles','Family or cultural role expectations'),c('power','Power imbalances or dependence'),c('confidence','Limited experience expressing preferences'),c('fatigue','Exhaustion or stress'),c('identity','Identity, values or chosen relational roles')],
 [
 t('fear-disapproval','Practise stating preferences','Small moments of choice can clarify that agreement is not always necessary.','Try naming a preference in a safe, low-stakes context.','needs-clarifier'),
 t('conflict','Use respectful disagreement','Communication can be both kind and clear without requiring agreement.','Draft one sentence that expresses a difference without an apology for having a need.','conversation-map'),
 t('self-worth','Learn your boundaries','Knowing a boundary is legitimate helps separate guilt from responsibility.','Identify what is yours to decide and what is not.','boundary-builder'),
 t('pressure','Increase safe options','Where power or coercion limits choice, access to support comes before confrontation.','Identify a trusted support route and practical options that do not increase risk.','context-map')
 ],
 ['Identifying what you actually prefer','Being able to say a small no in safe situations','More mutuality and consent in choices','Less unwanted compliance or resentment'],
 [
 {id:'kind',q:'Which description fits most closely?',options:[
 ['unwanted','I say yes when I genuinely want to say no','submissive-patterns'],
 ['chosen','I enjoy a consensual submissive role and feel free to decline','submissive-patterns'],
 ['unsafe','I feel pressured or unsafe if I disagree','control-harm'],
 ['social','I fear being judged more generally','social-anxiety'],
 ['other','A mixture / unsure',null]]},
 {id:'pattern',q:'What tends to be most difficult?',options:[
 ['approval','Feeling someone will dislike me',null,'fear-disapproval'],
 ['conflict','Tolerating a disagreement',null,'conflict'],
 ['needs','Believing my own needs matter',null,'self-worth'],
 ['power','The consequences or power difference',null,'pressure'],
 ['other','Several things or unsure',null,null]]}
 ],
 [link('NHS: Mental wellbeing and relationships','https://www.nhs.uk/every-mind-matters/mental-wellbeing-tips/top-tips-to-improve-your-mental-wellbeing/'),
 link('NHS: Get help for domestic abuse','https://www.nhs.uk/live-well/getting-help-for-domestic-violence/')],
 ['A consensual preferred role is not a deficit to treat. The relevant questions are choice, consent, comfort and whether needs can be expressed.','If setting limits may lead to retaliation, support and safety planning matter more than a communication exercise.']
)
]);
const index=new Map(preciseProfiles.map(p=>[p.id,p]));
export const getPreciseProfile=id=>index.get(id)||null;
export const preciseGroups=Object.freeze([
 {id:'social',label:'Around other people',detail:'Being evaluated, asserting needs or feared reactions',profiles:['social-anxiety','submissive-patterns','panic-experiences']},
 {id:'thinking',label:'Thoughts that repeat',detail:'Replaying, checking or worrying',profiles:['rumination','social-anxiety']},
 {id:'sleep',label:'Sleep and energy',detail:'Falling asleep, waking or feeling depleted',profiles:['insomnia','rumination']},
 {id:'body',label:'Sudden bodily alarm',detail:'Panic sensations, fear or physiological reactions',profiles:['panic-experiences','social-anxiety']},
 {id:'choice',label:'Needs, consent and boundaries',detail:'Compliance, disapproval and choice',profiles:['submissive-patterns','social-anxiety']}
]);
export const sourceDomains=Object.freeze([
 {name:'HiTOP model',url:'https://www.hitop-system.org/current-model'},
 {name:'HiTOP framework',url:'https://www.hitop-system.org/the-framework'}
]);
