// Interpretive prompts for the IPIP-50. These are conditional hypotheses,
// never estimated probabilities, diagnoses, NEO facets, or causal explanations.
const PAIRS = [
  {ids:'EA',name:'Contact and consideration',variants:{
    HH:['A sociable, accommodating style','You may connect readily and also pay close attention to the comfort of others. In a busy group, that could make you an easy bridge between people.','You might agree to another plan before checking your own energy.','Try saying “I would like to join, and I need to leave by eight.”'],
    HL:['Sociable and candid','You may enjoy meeting people while being willing to disagree. This can make you a lively challenger in groups that welcome debate.','A direct comment may land more sharply than you intended.','Before a disagreement, name the shared aim and then make one clear point.'],
    LH:['Quiet care','You may care deeply about people while preferring fewer or calmer interactions. Others could mistake limited contact for limited concern.','Pressure to be constantly available may exhaust your care.','Offer one form of contact you can sustain, such as a planned one-to-one check-in.'],
    LL:['Selective independence','You may prefer autonomy and directness over frequent social negotiation. That can protect focus and boundaries.','People might receive too little information about what you value in them.','When declining a group request, add one sentence of appreciation or intent.']},mixed:'The amount of contact and accommodation you want may depend heavily on the person and setting.'},
  {ids:'EC',name:'Energy and structure',variants:{
    HH:['Visible momentum','Contact and clear plans may reinforce each other; a collaborative deadline could help you start and finish.','A packed diary may leave no room for quiet thought.','Schedule one shared checkpoint and one uninterrupted work block.'],
    HL:['People-powered starts','Conversation may supply momentum more reliably than a rigid private routine.','Many starts can compete for a finish line.','Tell one person your next physical step and choose a stop time.'],
    LH:['Independent follow-through','A quiet, ordered environment may let you work steadily without much social prompting.','Your work may remain unseen until a late stage.','Share a short progress note at a fixed point, then return to protected focus.'],
    LL:['Low-pressure autonomy','You might do best with flexible tasks and fewer demands for constant social or procedural performance.','Unclear priorities can allow important tasks to drift.','Place one visible two-minute starter beside a gentle external reminder.']},mixed:'Your preferred amount of contact and structure may change with the task.'},
  {ids:'EN',name:'Social exposure and stress',variants:{
    HH:['Connection with a sensitive alarm','You may seek people while being affected by uncertainty or social evaluation. Warmth and clear signals may matter especially in high-stakes settings.','A delayed reply could take up more space than the evidence warrants.','Agree a reasonable reply window and do something absorbing before checking again.'],
    HL:['Ease in company','You may approach social settings with relative steadiness. This could make visible roles comfortable.','A calm exterior can hide a specific need for support.','After one demanding event, check whether you need recovery even if it felt easy at the time.'],
    LH:['Protected connection','You may prefer smaller encounters and feel uncertainty strongly; a known person and predictable plan could make contact easier.','Avoiding all unfamiliar situations can shrink choices you actually want.','Choose one brief, low-stakes encounter with an exit plan.'],
    LL:['Quiet steadiness','Solitude and a relatively even response to everyday stress may suit independent work and restoration.','Others may assume you need nothing because you appear composed.','Tell someone one specific form of support that would still be welcome.']},mixed:'Social contact and stress need separate observations; one score does not explain the other.'},
  {ids:'EO',name:'People and ideas',variants:{
    HH:['Exploring aloud','Conversation may help you generate and connect new ideas. A curious group could be especially energising.','Interesting discussion can replace deciding or finishing.','End one conversation with a written idea to test by Friday.'],
    HL:['Practical company','You may enjoy people most when a shared activity has a concrete purpose.','Abstract discussion may feel remote even when it contains a useful option.','Ask a group to show one real example before deciding.'],
    LH:['Private exploration','You may prefer to think deeply or experiment on your own before sharing.','A promising idea can stay private too long to gain feedback.','Share an early sketch with one trusted person, not a whole audience.'],
    LL:['Familiar, quieter routes','Known people and concrete activities may be a comfortable base.','A useful new option may be dismissed because its first explanation is abstract.','Request a practical demonstration from someone you trust.']},mixed:'Novelty of ideas and amount of social contact may pull in different directions.'},
  {ids:'AC',name:'Care and commitments',variants:{
    HH:['The dependable helper','You may take both people and duties seriously, so others could rely on you.','Reliability can become overcommitment when every request feels important.','Before saying yes, check the calendar and name one limit.'],
    HL:['Warmth with flexible follow-through','You may want to help and connect, while rigid schedules may not suit you.','Good intentions might exceed available time or organisation.','Offer a specific small action you can deliver, with a reminder.'],
    LH:['Principled independence','You may hold high standards without automatically accommodating requests. This can protect quality and boundaries.','Feedback may sound like a verdict rather than collaboration.','State the standard and invite one practical alternative.'],
    LL:['Freedom from imposed scripts','You may resist both social pressure and rigid systems, making autonomy valuable.','Others may not know when to expect a decision or contribution.','Agree one clear deliverable and a check-in date while keeping method flexible.']},mixed:'Cooperation and organisation may be different strengths in different roles.'},
  {ids:'AN',name:'Sensitivity and boundaries',variants:{
    HH:['Attuned under pressure','You may notice people’s feelings and also register uncertainty strongly. This could support empathy while making unresolved tension tiring.','You may infer that another person is upset without enough information.','Ask one neutral question, then wait for the answer before repairing.'],
    HL:['Steady consideration','You may offer care without being strongly pulled into every moment of tension.','Someone might read steadiness as not noticing their distress.','Reflect back what you heard before moving to solutions.'],
    LH:['Protective candour','You may respond strongly to uncertainty and prefer directness to smoothing it over.','Urgency can make a necessary boundary sound harsher than intended.','Pause, name the concrete concern, and ask for one fact you need.'],
    LL:['Clear distance','You may be comfortable with direct limits and less swayed by everyday emotional turbulence.','Someone close to you may need a warmer signal than your practical answer supplies.','Add “I care about this” before the decision or boundary.']},mixed:'Concern for others and stress sensitivity may rise or fall separately.'},
  {ids:'AO',name:'Care and curiosity',variants:{
    HH:['Curious about perspectives','You may enjoy ideas and want to understand another person’s view.','Exploring every perspective can delay stating what you need.','After listening, say which part you understand and where your boundary sits.'],
    HL:['Concrete care','You may show concern through dependable, practical acts rather than abstract discussion.','Someone might want to be heard before receiving a fix.','Ask “Would listening or practical help be better right now?”'],
    LH:['Independent exploration','You may pursue unconventional ideas without needing broad agreement.','A novel proposal might miss how it affects other people.','Ask one affected person what the change would cost them.'],
    LL:['Plainspoken pragmatism','You may value direct, tested answers over social or conceptual ornament.','Others may experience this as dismissive if their meaning differs.','Ask for one concrete example of what matters to them first.']},mixed:'Intellectual curiosity does not determine kindness, and cooperation does not determine novelty.'},
  {ids:'CN',name:'Standards and stress',variants:{
    HH:['Careful under pressure','You may use planning to manage uncertainty. This can make you prepared, especially when the stakes are real.','Checking can continue after the useful work is finished.','Set a “good enough” criterion and one final review time before starting.'],
    HL:['Calm reliability','You may keep commitments without feeling heavily pulled by everyday alarm.','Others might add more work because you look able to carry it.','Reserve recovery time on the plan, not only deadlines.'],
    LH:['Stress without a stable system','You may feel urgency while finding fixed routines hard to maintain; the mismatch can feel like a personal failing.','An elaborate rescue plan could be too costly to start.','Put one next action and one check time on a visible card.'],
    LL:['Flexible steadiness','You may tolerate change and resist overplanning, useful in fluid settings.','A quiet problem may remain unattended without a cue.','Use one external reminder for the few commitments that truly matter.']},mixed:'Organisation and stress may vary independently; identify which part of a task is costly.'},
  {ids:'CO',name:'Structure and possibility',variants:{
    HH:['Ideas with an execution route','You may enjoy new possibilities and have the structure to turn some into projects.','A detailed plan for every idea can overload your time.','Choose one idea and define a test small enough to finish this week.'],
    HL:['Practical systems','You may prefer clear methods and evidence over novelty for its own sake.','A familiar process can persist past the point it helps.','Run one controlled trial of an alternative, with a clear comparison.'],
    LH:['Many possibilities, light scaffolding','You may generate alternatives more easily than you settle into a routine.','A promising idea may vanish between inspiration and action.','Capture the idea and schedule a 15-minute prototype, not a whole plan.'],
    LL:['Flexible practicality','You may prefer responding to what is concrete in front of you.','Without a minimal system, a useful future option may be overlooked.','Keep one short list of next actions and revisit it once a week.']},mixed:'You might be highly structured in one interest and exploratory or improvisational in another.'},
  {ids:'NO',name:'Stress and imagination',variants:{
    HH:['Many possible futures','Imagination may help you foresee options, while stress sensitivity can make some imagined risks feel immediate.','Thinking through every scenario may delay action.','Write one likely scenario, one less likely one, and the next checkable fact.'],
    HL:['Concrete vigilance','You may notice possible problems and prefer clear, practical information.','A vague warning can feel urgent without giving you a usable response.','Ask what observable sign would justify action and when to check.'],
    LH:['Exploration with steadier footing','You may try unfamiliar ideas without strong everyday alarm.','It can be easy to underestimate the cost of a new commitment.','Try a reversible, time-limited version first.'],
    LL:['Familiar steadiness','Known routines and a relatively even stress response may be a useful base.','A new concern might not register until it has become concrete.','Add a periodic reality check, without monitoring constantly.']},mixed:'The imagination items and stress items may interact differently with the situation.'}
];

const LENSES = [
  {id:'relationships',title:'Relationships',ids:'EAN',question:'Think of one recent interaction. What did you want, what did you assume the other person wanted, and what did you actually observe?',contexts:'A delayed reply, an invitation, a request or a disagreement',fit:'Try a clear request, a boundary, or a lower-pressure form of contact, then notice what changes.'},
  {id:'work',title:'Work & study',ids:'ECO',question:'Compare a task that flowed with one that stalled. Was the difference people, structure, interest, resources or stakes?',contexts:'A shared project, solo task, deadline or new idea',fit:'Adjust one work condition: contact, a visible next step, or room to test an idea.'},
  {id:'decisions',title:'Decisions',ids:'CNO',question:'Which part gets stuck: generating options, tolerating uncertainty, deciding a criterion or acting after the choice?',contexts:'A choice with several reasonable options',fit:'Set a decision deadline, choose one criterion and test a reversible step.'},
  {id:'stress',title:'Stress & recovery',ids:'NCA',question:'When did a demanding moment ease? Was it information, support, structure, a boundary, or simply time?',contexts:'An unresolved message, a busy week or a mistake',fit:'Separate the real demand from the alarm; protect recovery and choose one proportionate action.'},
  {id:'motivation',title:'Motivation',ids:'OCE',question:'What actually supplied momentum last time: curiosity, a person, a deadline, or a very small starter?',contexts:'An important task you have not begun',fit:'Use one starter that matches the source of energy you observed, not an idealised routine.'},
  {id:'roles',title:'Roles & self-story',ids:'AEO',question:'Where does your self-description fit poorly? What role, skill or relationship might explain the difference?',contexts:'Being different with friends, family, colleagues or alone',fit:'Describe the situation and learned role as well as the tendency; do not make one role your entire identity.'}
];

const CONTRASTS = [
  {items:[21,31],name:'Conversation versus crowds',first:'starting conversations',second:'talking to many people at parties'},
  {items:[11,46],name:'Familiarity and strangers',first:'comfort around people',second:'being quiet around strangers',secondReverse:true},
  {items:[23,43],name:'Starting versus schedules',first:'doing chores promptly',second:'following a schedule'},
  {items:[33,28],name:'Order versus resetting',first:'liking order',second:'putting belongings back',secondReverse:true},
  {items:[14,49],name:'Worry versus low mood',first:'worrying',second:'feeling blue'},
  {items:[15,40],name:'Imagination versus words',first:'a vivid imagination',second:'using difficult words'},
  {items:[17,37],name:'Empathy versus availability',first:'sympathising',second:'making time for others'},
  {items:[3,48],name:'Preparation versus precision',first:'being prepared',second:'being exacting in work'},
  {items:[4,34],name:'Stress versus shifts',first:'getting stressed easily',second:'frequent mood changes'}
];

const side=s=>s.score>=26?'H':s.score<=14?'L':'M';
const signal=s=>`${s.trait.name} ${s.score}/40`;
const tone=s=>s.score>=26?'leans higher':s.score<=14?'leans lower':'sits near the midpoint';
const lensSignal={
  E:{H:'Contact may supply momentum, though the kind of company still matters.',L:'A quieter or one-to-one setting may give you more space.',M:'The useful amount of contact may change with the task and people.'},
  A:{H:'Maintaining care may matter, so notice whether your own need is also being voiced.',L:'Clarity and limits may come easily; check whether the other person can hear your intent.',M:'Cooperation and candour may need a fresh balance here.'},
  C:{H:'A plan may be helpful, but the standard or stopping point might need adjusting.',L:'A small external cue may work better than an elaborate plan.',M:'Check whether you need more structure or more freedom in this setting.'},
  N:{H:'Uncertainty may feel pressing, so an agreed check-in or recovery interval could help.',L:'You may stay relatively steady, while still needing to notice less obvious strain.',M:'The stakes and current load may change the strength of the stress signal.'},
  O:{H:'Possibilities may be engaging; a small test can make one of them usable.',L:'A concrete example may be more useful than an abstract promise.',M:'Choose when exploration helps and when a familiar option is enough.'}
};
const rawLabel=v=>['','very inaccurate','mostly inaccurate','neither accurate nor inaccurate','mostly accurate','very accurate'][v]||'';
export const profileSources=[
  ['McCrae & Costa, Personality in Adulthood, 2nd ed., chapters 3 and 10–11','https://archive.org/details/personalityinadu0000robe'],
  ['IPIP 50-item sample and scoring key','https://www.ipip.ori.org/New_IPIP-50-item-scale.htm'],
  ['Fleeson & Jayawickreme, Whole Trait Theory (2015)','https://pubmed.ncbi.nlm.nih.gov/26097268/']
];

export function buildProfile(scores,answers,items){
  const by=Object.fromEntries(scores.map(s=>[s.trait.id,s]));
  const ordered=[...scores].sort((a,b)=>Math.abs(b.score-20)-Math.abs(a.score-20));
  const prominent=ordered.filter(s=>Math.abs(s.score-20)>=6);
  const summary=prominent.length
    ? `Your five positions: ${scores.map(s=>`${s.trait.name} ${tone(s)} (${s.score}/40)`).join('; ')}. Together they may describe a style, but the same tendency can help or cost you depending on the role, demands and support around you.`
    : 'The five scale positions are close to the response midpoint. The interesting story may lie in particular items and situations rather than a strong overall trait label.';
  const pairs=PAIRS.map(p=>{
    const [a,b]=[by[p.ids[0]],by[p.ids[1]]],key=side(a)+side(b),variant=p.variants[key];
    const strength=Math.abs(a.score-20)+Math.abs(b.score-20);
    return {id:p.ids,name:p.name,signals:[signal(a),signal(b)],strength,heading:variant?.[0]||'A context-dependent combination',reading:variant?.[1]||p.mixed,cost:variant?.[2]||'A single score cannot tell which side shows up in a particular setting.',step:variant?.[3]||'Compare two situations where this combination felt different.',test:`Can you find a recent example that supports this possibility and one that challenges it? What changed between them?`,alternatives:'A role, current stress, resources, culture, skill or a learned habit could produce a similar pattern. The questionnaire does not distinguish these causes.'};
  }).sort((a,b)=>b.strength-a.strength);
  const contrasts=CONTRASTS.flatMap(c=>{
    const [x,y]=c.items.map(n=>answers[n-1]);
    const v=c.secondReverse?6-y:y;
    if(!Number.isInteger(x)||!Number.isInteger(y)||Math.abs(x-v)<2)return [];
    return [{id:`item-${c.items.join('-')}`,name:c.name,heading:`${c.first} may differ from ${c.second}`,reading:`You rated “I ${items[c.items[0]-1].text.toLowerCase()}” ${rawLabel(x)}, and “I ${items[c.items[1]-1].text.toLowerCase()}” ${rawLabel(y)}. This could point to a useful distinction, or simply the wording and context of these two statements.`,test:`Where in your life does ${c.first} differ from ${c.second}? What else might explain the gap?`,alternatives:'Two individual responses are too little to identify a facet, motive or reliable pattern.'}];
  });
  const featured=[],covered=new Set();
  while(featured.length<3){
    const next=pairs.filter(p=>!featured.includes(p)).sort((a,b)=>((b.id.split('').filter(id=>!covered.has(id)).length*100+b.strength)-(a.id.split('').filter(id=>!covered.has(id)).length*100+a.strength)))[0];
    if(!next)break;featured.push(next);for(const id of next.id)covered.add(id);
  }
  const lenses=LENSES.map(l=>{
    const selected=[...l.ids].map(id=>by[id]);
    const pair=pairs.find(p=>l.ids.includes(p.id[0])&&l.ids.includes(p.id[1]));
    const remaining=scores.filter(s=>!l.ids.includes(s.trait.id));
    return {...l,signals:selected.map(signal),background:remaining.map(s=>`${s.trait.name} ${s.score}/40: ${lensSignal[s.trait.id][side(s)]}`),hypothesis:`One possible reading: ${pair.reading} ${lensSignal[selected[2].trait.id][side(selected[2])]}`,cost:pair.cost,alternative:pair.alternatives,example:l.contexts};
  });
  return {summary,pairs,featured,contrasts,lenses};
}
