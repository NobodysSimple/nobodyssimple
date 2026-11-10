/* Nobody's Simple: choice-led needs navigator.
 * A user's intention is not evidence of a psychological disorder.
 * All destinations are explicit; no classification, automatic diagnosis or scores.
 */
const action=(id,title,description,type,target)=>Object.freeze({id,title,description,type,target});
export const NEEDS_MODES=Object.freeze([
 {id:'regulate',title:'Feel steadier',summary:'Settle, ground, rest or adjust what is happening right now.',tone:'sage',icon:'◌',options:[
 action('overwhelmed','I feel overwhelmed','Reduce the load without needing to explain everything.','activity','steady-overwhelm'),
 action('panicky','I feel panicky or activated','Find a safe, familiar way to steady yourself.','activity','steady-panic'),
 action('sensory','I am overstimulated','Adjust the environment or sensory input.','activity','steady-sensory'),
 action('anger','I am very angry','Make room for anger without acting in a way you regret.','activity','steady-anger'),
 action('disconnected','I feel frozen, numb or disconnected','Reconnect gently without forcing a particular feeling.','activity','steady-disconnected'),
 action('drained','I am exhausted or depleted','Prioritise recovery and realistic demands.','activity','steady-depleted'),
 action('restless','I feel restless or understimulated','Find a tolerable sensory or movement adjustment.','activity','steady-restless'),
 action('savour','I want to enjoy a good feeling','Notice and appreciate something meaningful, without forcing joy.','activity','savour-good')
 ]},
 {id:'process',title:'Process something',summary:'Feel, express or make sense of an experience in your own way.',tone:'rose',icon:'♡',options:[
 action('feel','I want to let myself feel it','Notice what is present without needing to fix or reduce it.','activity','process-feel'),
 action('express','I want to express what is inside','Give feelings room through words, private writing or another form.','activity','process-express'),
 action('event','I want to make sense of what happened','Explore an experience and what stayed with you.','activity','process-event'),
 action('reaction','I want to understand my reaction','Explore what mattered without assuming one hidden cause.','activity','process-reaction'),
 action('mixed','I have mixed or conflicting feelings','Hold more than one feeling without forcing a decision.','activity','process-mixed'),
 action('grief','I am dealing with grief or loss','Make room for the relationship, change and meaning of a loss.','activity','process-grief'),
 action('compassion','I am being hard on myself','Respond to self-criticism with fairness rather than forced positivity.','activity','process-compassion'),
 action('closure','I want some closure or acceptance','Decide what can be acknowledged, expressed or left unresolved.','activity','process-closure')
 ]},
 {id:'understand',title:'Understand myself',summary:'Explore emotions, thoughts, experiences, needs and recurring patterns.',tone:'blue',icon:'◇',options:[
 action('feelings','I do not know what I am feeling','Explore the feeling and what your circumstances might suggest.','tool','emotion-check-in'),
 action('reaction','Why did I react like that?','Explore the event and your response without assigning a cause.','activity','process-reaction'),
 action('pattern','A pattern keeps repeating','Map the sequence and the context around it.','tool','pattern-map'),
 action('thought','I want to untangle my thoughts','Separate different questions and interpretations.','tool','thought-map'),
 action('identity','I want to explore my identity','Explore roles and identities without needing a fixed label.','tool','identity-map'),
 action('values','What actually matters to me?','Clarify values rather than imposing a universal ideal.','tool','values-discovery'),
 action('question','I want to compare explanations','Explore competing ideas without forcing certainty.','tool','competing-models')
 ]},
 {id:'act',title:'Work out what to do',summary:'Choose, start, plan, solve or change a practical condition.',tone:'gold',icon:'↗',options:[
 action('decision','I need to make a decision','Compare realistic options, costs, values and uncertainty.','tool','decision-map'),
 action('begin','I am struggling to start','Identify the obstacle before demanding more willpower.','tool','start-starter'),
 action('step','I need one small next step','Make an action workable and observable.','tool','small-step'),
 action('worry','I keep worrying about what to do','Separate solvable concerns from hypothetical ones.','tool','worry-sort'),
 action('load','Too much is being demanded of me','Identify what can move, change or be shared.','tool','load-balancer'),
 action('environment','My circumstances or environment get in the way','Find practical adjustments and accessibility options.','tool','environment-design'),
 action('time','I cannot fit everything into my time','Plan with real durations and transitions.','tool','time-reality'),
 action('plans','I want to think through different futures','Compare consequences without pretending to predict them.','tool','future-perspectives')
 ]},
 {id:'relate',title:'Work through something with someone',summary:'Communication, needs, trust, conflict, care and boundaries.',tone:'peach',icon:'◎',options:[
 action('interaction','I want to understand an interaction','Separate what happened, what was interpreted and what remains unknown.','tool','conversation-map'),
 action('need','I want to explain what I need','Prepare a specific request or expression.','tool','needs-clarifier'),
 action('boundary','I need to set or understand a boundary','Distinguish preferences, requests, boundaries and control.','tool','boundary-builder'),
 action('argument','We keep having the same argument','Understand recurring patterns without blaming one person automatically.','tool','conflict-map'),
 action('repair','I want to repair something','Consider responsibility, impact and genuine change.','tool','repair'),
 action('feel','I need to process how I feel about someone','Make room for the feelings before deciding what to do.','activity','process-mixed'),
 action('resent','I feel resentful or taken for granted','Consider unequal demands and a reasonable request.','tool','resentment-load'),
 action('unsafe','I feel unsafe, pressured or controlled','Prioritise safety, practical choice and confidential support.','activity','support-safety')
 ]},
 {id:'learn',title:'Explore a specific difficulty',summary:'Choose a named difficulty such as sleep, rumination or social anxiety.',tone:'lilac',icon:'▤',options:[
 action('sleep','I want to understand sleep problems','Explore insomnia and different sleep patterns.','topic','insomnia'),
 action('rumination','I want to understand rumination','Learn about repetitive thinking and possible maintainers.','topic','rumination'),
 action('social','I want to understand social anxiety','Explore fear of judgement, safety behaviours and context.','topic','social-anxiety'),
 action('panic','I want to understand panic experiences','Explore panic sensations and physical-health considerations.','topic','panic-experiences'),
 action('checking','I want to understand checking or rituals','Explore checking and its different possible functions.','topic','checking'),
 action('submission','I want to understand unwanted compliance','Distinguish consent, self-assertion and unsafe pressure.','topic','submissive-patterns')
 ]},
 {id:'unsure',title:"I'm not sure",summary:'Begin with what would be useful rather than naming a problem.',tone:'slate',icon:'?',options:[
 action('relief','I would like a little relief','Start with a gentle, optional settling exercise.','activity','steady-overwhelm'),
 action('room','I want space to feel or express','Start with an open-ended processing activity.','activity','process-feel'),
 action('clarity','I would like more clarity','Choose a gentle emotional check-in.','tool','emotion-check-in'),
 action('practical','I need a practical next step','Find a manageable first action.','tool','small-step')
 ]}
]);
export const NEEDS_MAP=Object.freeze(Object.fromEntries(NEEDS_MODES.map(mode=>[mode.id,mode])));
export const NEEDS_ACTIVITIES=Object.freeze(Object.fromEntries(NEEDS_MODES.flatMap(mode=>
 mode.options.filter(o=>o.type==='activity').map(o=>[o.target,{...o,mode:mode.id}]))));
export function getNeedsMode(id){return NEEDS_MAP[id]||null}
export function getNeedsActivity(id){return NEEDS_ACTIVITIES[id]||null}
export function needsDestination(option){
 if(!option)return '#navigate';
 // Every named atlas entry now uses the same integrated topic field guide.
 if(option.type==='topic')return '#workbook-topic/'+encodeURIComponent(option.target);
 if(option.type==='atlas')return '#navigate/learn'; // legacy links only
 const mode=NEEDS_MODES.find(m=>m.options.includes(option))?.id;
 if(mode)return '#workbook/'+encodeURIComponent(mode)+'/'+encodeURIComponent(option.id);
 if(option.type==='activity')return '#need/'+encodeURIComponent(option.target);
 if(option.type==='tool')return '#tool/'+encodeURIComponent(option.target);
 return '#navigate';
}
export const NEEDS_REVIEW_CASES=Object.freeze([
 {intention:'calm down',mode:'regulate',option:'overwhelmed'},
 {intention:'process breakup',mode:'process',option:'event'},
 {intention:'sit with sadness',mode:'process',option:'feel'},
 {intention:'learn rumination',mode:'learn',option:'rumination'},
 {intention:'sleep difficulty',mode:'learn',option:'sleep'},
 {intention:'savour happiness',mode:'regulate',option:'savour'},
 {intention:'make a decision',mode:'act',option:'decision'},
 {intention:'understand repeated pattern',mode:'understand',option:'pattern'},
 {intention:'coercive behaviour',mode:'relate',option:'unsafe'},
 {intention:'unsure',mode:'unsure',option:'room'}
]);
