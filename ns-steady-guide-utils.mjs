/* Reviewed reference directory for the Feel Steadier guidebook collection.
 * Sources substantiate broad concepts, NOT independent validation of these
 * novel micro-exercises or individualised treatment.
 */
export const STEADY_REFERENCES=Object.freeze({
 'nhs-anger':{name:'NHS · Get help with anger',url:'https://www.nhs.uk/mental-health/feelings-symptoms-behaviours/feelings-and-symptoms/anger/',scope:'Recognising anger, choosing a pause, CBT self-help, and when to seek support',type:'Clinical public guidance'},
 'nhs-panic':{name:'NHS · Panic disorder',url:'https://www.nhs.uk/mental-health/conditions/panic-disorder/',scope:'Recognising familiar panic episodes, self-help and support',type:'Clinical public guidance'},
 'nice-panic':{name:'NICE CG113 · Generalised anxiety and panic in adults',url:'https://www.nice.org.uk/guidance/cg113/chapter/Recommendations',scope:'Assessment, evidence-based CBT, stepped care and medical considerations',type:'Clinical guideline'},
 'nice-autism':{name:'NICE CG142 · Autism in adults',url:'https://www.nice.org.uk/guidance/cg142/chapter/Recommendations',scope:'Sensory environments, accessibility and individual adjustments',type:'Clinical guideline'},
 'nas-sensory':{name:'National Autistic Society · Sensory processing',url:'https://www.autism.org.uk/advice-and-guidance/about-autism/sensory-processing',scope:'Sensory differences, low-demand recovery and respecting self-regulation',type:'Specialist practice guidance'},
 'nhs-fatigue':{name:'NHS · Tiredness and fatigue',url:'https://www.nhs.uk/symptoms/tiredness-and-fatigue/',scope:'Possible physical and environmental contributors to fatigue and appropriate medical review',type:'Clinical public guidance'},
 'nice-mecfs':{name:'NICE NG206 · ME/CFS',url:'https://www.nice.org.uk/guidance/ng206/chapter/recommendations',scope:'Energy management, post-exertional malaise and prohibitions on fixed graded-exercise programmes',type:'Clinical guideline'},
 'nice-ptsd':{name:'NICE NG116 · Post-traumatic stress disorder',url:'https://www.nice.org.uk/guidance/ng116/chapter/recommendations',scope:'Dissociation, hyperarousal, safety and appropriate trauma-focused treatment',type:'Clinical guideline'},
 'nhs-mindfulness':{name:'NHS · Mindfulness',url:'https://www.nhs.uk/mental-health/self-help/tips-and-support/mindfulness/',scope:'Present-focused awareness; not appropriate or helpful for everyone',type:'Clinical public guidance'},
 'nhs-wellbeing':{name:'NHS · Five steps to mental wellbeing',url:'https://www.nhs.uk/mental-health/self-help/guides-tools-and-activities/five-steps-to-mental-wellbeing/',scope:'Activity, social connection and present-moment appreciation',type:'Clinical public guidance'},
 'act-review':{name:'Macri & Rogge (2024) · ACT psychological flexibility review',url:'https://pubmed.ncbi.nlm.nih.gov/38615492/',scope:'Psychological flexibility, defusion, acceptance and values in ACT across studies',type:'Systematic review/meta-analysis'},
 'act-meta':{name:'2025 meta-analysis · ACT for depression',url:'https://pubmed.ncbi.nlm.nih.gov/40597900/',scope:'ACT outcomes and limits of evidence for automatic thoughts',type:'Systematic review/meta-analysis'},
 'savour-review':{name:'Cullen and colleagues (2024) · Savouring in clinical populations',url:'https://doi.org/10.1007/s41042-024-00182-1',scope:'Preliminary clinical intervention evidence for positive-experience savouring',type:'Systematic review'},
 'nice-selfharm':{name:'NICE NG225 · Self-harm',url:'https://www.nice.org.uk/guidance/ng225/chapter/recommendations',scope:'Support, safeguarding, structured interventions and cautious use of DBT approaches',type:'Clinical guideline'},
 'nhs-urgent':{name:'NHS · Urgent help for mental health',url:'https://www.nhs.uk/nhs-services/mental-health-services/where-to-get-urgent-help-for-mental-health/',scope:'Appropriate urgent support and services',type:'Clinical public guidance'}
});
export const STEADY_LANES=Object.freeze([
 {id:'context',label:'Change the conditions',description:'Environment, demands, practical resources and access needs'},
 {id:'behaviour',label:'Change a response',description:'A small practical action, habit or preparation'},
 {id:'thinking',label:'Work with thoughts · CBT-informed',description:'Check appraisals and test useful alternatives without dismissing reality'},
 {id:'dbt',label:'Tolerate and manage the moment · DBT-informed',description:'Adapted mindfulness, distress tolerance and emotional skills'},
 {id:'act',label:'Make room and move toward values · ACT-informed',description:'Acceptance, defusion and valued choices; not symptom suppression'},
 {id:'support',label:'Support, recovery and health',description:'Relational support, resources and reasons to seek assessment'}
]);
export const M=(title,why,steps,caution='',refs=[],note='Adapted educational skill; not an independently tested intervention')=>Object.freeze({
 title,why,steps:steps.split('|').map(s=>s.trim()).filter(Boolean),caution,refs,note
});
export const G=(title,subtitle,what,variations,possibleLoop,contributors,goals,cautions,progress,lanes,refs)=>Object.freeze({
 title,subtitle,what,variations,possibleLoop,contributors,goals,cautions,progress,lanes,refs,
 reviewStatus:'Evidence-informed editorial draft · not individually clinically reviewed or validated',
 reviewedDate:'2026-11-09'
});
