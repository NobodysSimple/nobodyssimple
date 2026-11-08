/* Additional user-language difficulties spanning dimensions shown in HiTOP and
 * functional / structural challenges omitted by diagnostic-only taxonomies.
 * Distinguish a reported experience from a diagnostic construct. */
const groups={
 feel:[
 ['anhedonia','Things I used to enjoy feel flat','Loss of interest, pleasure or reward','pleasure enjoyment motivation'),
 ['irritability','I am easily irritated','Persistent annoyance or low frustration tolerance','agitated irritable frustration'),
 ['hopelessness','The future feels hopeless','Beliefs that improvement is impossible','hopeless pessimism'),
 ['mood-shifts','My moods change very quickly','Emotion shifts that are distressing or disruptive','emotional lability unstable mood'),
 ['sudden-distress','Distress arrives without warning','Unexpected surges of upset or emotional activation','distress overwhelmed'),
 ['self-blame','I blame myself for everything','Taking excessive responsibility for negative events','guilt self blame'),
 ['shame-after-sex','I feel ashamed after intimacy','Shame, values, messages or unwanted experiences','sexual shame')
 ],
 think:[
 ['obsessional-doubt','I cannot shake a specific doubt','A persistent unwanted doubt that asks to be resolved','obsession obsessive doubt'),
 ['ritual-checking','I feel driven to repeat checks or rituals','Repetitive acts to reduce doubt or distress','compulsions checking ocd'),
 ['mental-rituals','I repeat things in my head to feel safe','Counting, replaying, neutralising or mental checking','mental compulsions rituals'),
 ['moral-uncertainty','I worry that I am a bad person','Moral, responsibility or guilt-based obsessional doubts','scrupulosity morals guilt'),
 ['relationship-obsessions','I keep questioning whether a relationship is right','Repeated relationship checking and certainty seeking','relationship ocd rumination'),
 ['jealousy-rumination','I repeatedly worry about jealousy or betrayal','Rumination about relational threat or uncertainty','jealous betrayal'),
 ['catastrophizing','My mind jumps to disaster','Worst-case interpretations feel inevitable','catastrophic fear'),
 ['ruminative-guilt','I repeatedly replay things I regret','Past-event replay and self-blame','rumination guilt regret'),
 ['perceptual-uncertainty','I am unsure if my perceptions are reliable','Unusual experiences and distress about interpretation','perceptual distrust')
 ],
 act:[
 ['unplanned-impulses','I act before thinking things through','Impulsive choices with unwanted consequences','impulsivity risk'),
 ['risk-taking','I keep taking risks that worry me','Repeated hazardous or impulsive behaviour','risk taking'),
 ['compulsive-buying','I buy things to cope and regret it','Repeated spending under emotional pressure','shopping impulsive spending'),
 ['binge-scroll','I cannot stop scrolling','Automatic digital checking that displaces valued activities','phone doomscrolling social media'),
 ['workaholism','I cannot stop working','Overworking that interferes with recovery and life','workaholism compulsive'),
 ['task-switching','I jump between tasks and finish none','Frequent switching and interrupted completion','multitasking'),
 ['habit-urges','I get strong urges I struggle to resist','Repeated urges and learned habit cycles','urge impulse craving'),
 ['risky-sex','I make sexual decisions I later regret','Sexual decisions that conflict with safety or values','risky sexual behaviour')
 ],
 relate:[
 ['interpersonal-passivity','I struggle to speak up for myself','Unwanted interpersonal passivity or compliance','submissive passive'),
 ['fear-abandonment','I fear that people will leave me','Abandonment worry and relationship threat','abandonment anxiety'),
 ['interpersonal-withdrawal','I withdraw even when I want connection','Avoiding closeness, communication or reciprocity','withdrawal avoidance'),
 ['conflict-escalation','Arguments escalate too quickly','Escalating reactivity and difficulty pausing','aggressive arguments'),
 ['resentment','I feel resentful but say nothing','Unspoken needs and repeated resentment','resentment'),
 ['controlling-impulses','I want to control what others do','Attempts to manage others to reduce uncertainty','controlling dominance'),
 ['aggressive-urges','I am concerned about aggressive urges','Physical or verbal aggression risk','anger aggression'),
 ['dishonesty-patterns','I keep hiding or distorting the truth','A pattern of deception that harms trust','lying dishonesty'),
 ['difficulty-apologising','I find it hard to apologise','Defensiveness, responsibility and repair','apology blame'),
 ['intimacy-communication','I cannot say what I want sexually','Sexual boundaries, consent and communication','sexual needs intimacy'),
 ['relationship-submission','I worry about my submissive preferences','Consent, choice and shame around relational roles','sub submissive kink'),
 ['attachment-insecurity','I struggle to feel secure in close relationships','Insecurity, threat and trust patterns','attachment insecurity')
 ],
 body:[
 ['sleep-onset','I cannot fall asleep','Prolonged time awake before sleep','insomnia sleep onset'),
 ['sleep-maintenance','I keep waking during the night','Interrupted sleep or waking repeatedly','sleep insomnia'),
 ['early-waking','I wake too early and cannot return to sleep','Early waking and reduced rest','insomnia early'),
 ['nightmare-distress','Nightmares affect my sleep','Distressing dreams and fear of sleep','nightmares sleep'),
 ['daytime-sleepiness','I struggle to stay awake during the day','Sleepiness with functional impact','sleep apnea fatigue'),
 ['physical-panic','Physical sensations frighten me','Alarm about bodily changes and their meaning','panic somatic'),
 ['chronic-headache','Headaches interfere with my life','Recurring head pain and its impact','headache migraine'),
 ['stomach-distress','Stress and stomach symptoms trouble me','Gastrointestinal symptoms and uncertainty','stomach ibs gastrointestinal'),
 ['somatic-worry','I have persistent unexplained symptoms','Distressing physical symptoms requiring appropriate assessment','somatic physical symptoms'),
 ['appetite-loss','I have lost my appetite','Changes in appetite and eating','appetite loss'),
 ['binge-eating','I have episodes of eating beyond my control','Loss-of-control eating and distress','binge eating'),
 ['food-restriction','I feel driven to restrict food','Restrictive eating and possible health risk','restrict anorexia'),
 ['purging-urges','I have urges to purge after eating','Purging behaviour and physical safety risks','purge bulimia'),
 ['sexual-pain','Sexual activity causes pain','Pain, health and intimacy concerns','sexual pain'),
 ['low-desire','I am concerned about low sexual desire','Desire changes and personal distress','libido desire'),
 ['body-checking','I repeatedly check my appearance','Appearance monitoring and reassurance','body image'),
 ['sensory-seeking','I seek strong sensory stimulation','Sensory regulation and preferences','sensory seeking')
 ],
 identity:[
 ['identity-conflict','Different parts of me feel incompatible','Multiple roles, belonging and competing expectations','self identity conflict'),
 ['identity-insecurity','I feel uncertain about who I really am','Self-concept instability and context','identity instability'),
 ['imposter-feelings','I feel like a fraud despite evidence','Imposter beliefs and self-evaluation','imposter'),
 ['self-concealment','I hide important parts of myself','Concealment, safety and identity','masking'),
 ['social-comparison','I constantly compare myself with others','Self-evaluation through comparison','comparison envy'),
 ['purpose-loss','Life has lost its sense of purpose','Meaning, goals and direction','meaning anhedonia'),
 ['approval-dependence','My self-worth depends on approval','External validation and self-respect','validation dependence')
 ],
 focus:[
 ['hyperactivity','I struggle with restlessness or activity','Marked restlessness or difficult-to-control movement','hyperactive restless'),
 ['attention-drift','My attention keeps drifting','Sustained attention and context','attention drift'),
 ['hyperfocus-cost','I lose track of time in one activity','Absorption that crowds out other needs','hyperfocus'),
 ['time-blindness','I lose track of time or deadlines','Time estimation and prospective planning','time blindness'),
 ['planning-overload','Planning itself overwhelms me','Executive demands and sequencing','planning executive'),
 ['learning-block','I get stuck when learning something new','Learning, instruction, comprehension and context','learning difficulty')
 ],
 change:[
 ['adjustment-stress','I cannot settle after a major change','Transitions, uncertainty and loss of routine','adjustment'),
 ['anticipatory-grief','I am grieving something before it happens','Anticipatory loss and uncertainty','grief'),
 ['traumatic-loss','A loss still feels frightening or unreal','Grief complicated by traumatic reactions','traumatic grief'),
 ['life-regret','I cannot stop thinking about missed opportunities','Regret and counterfactual thinking','regret'),
 ['uncertainty-future','I dread an uncertain transition','Practical uncertainty and future threat','transition worry')
 ],
 work:[
 ['workplace-bullying','I am being bullied at work or school','Hostile behaviour and unequal power','bullying'),
 ['academic-burnout','Study is draining all my energy','Education pressure, exhaustion and recovery','burnout university'),
 ['financial-insecurity','I am afraid I cannot afford essentials','Material insecurity and practical options','poverty debt bills'),
 ['housing-instability','I may lose my home or housing','Housing safety and material resources','homeless housing'),
 ['caregiver-burnout','Caring is leaving me exhausted','Care demands and support constraints','carer caregiver'),
 ['institutional-injustice','I am dealing with an unfair institution','Power, access and institutional processes','discrimination'),
 ['access-needs','My environment does not meet my needs','Accessibility and reasonable adjustments','disability accommodations')
 ],
 experiences:[
 ['derealisation','My surroundings do not feel real','Detachment or perceptual unreality','derealization dissociation'),
 ['depersonalisation','I feel disconnected from myself','Detachment from sense of self','depersonalization dissociation'),
 ['flashbacks','Memories feel as if they are happening again','Intrusive trauma memories and present safety','flashbacks trauma'),
 ['hypervigilance','I am constantly on guard for danger','Heightened vigilance and threat perception','hypervigilance'),
 ['elevated-mood','My mood and energy are unusually elevated','Changes in sleep, energy and activity','mania hypomania'),
 ['grandiose-beliefs','I feel unusually powerful or invulnerable','Marked changes in confidence and judgment','grandiosity'),
 ['substance-craving','I feel driven to drink or use a substance','Craving, dependence and support','addiction craving'),
 ['alcohol-harm','Drinking is causing me problems','Alcohol use with consequences','alcohol'),
 ['drug-harm','Substances are causing me problems','Drug-related harm and support','substance drugs'),
 ['withdrawal-worries','I am worried about withdrawal symptoms','Substance withdrawal may need medical care','withdrawal substances')
 ],
 safety:[
 ['unsafe-home','Someone at home makes me feel unsafe','Threats, coercion or violence risk','domestic abuse'),
 ['self-injury','I have urges to injure myself','Self-harm urges and support','self harm self injury'),
 ['suicidal-thoughts','I am thinking about ending my life','Urgent human support and safety','suicide suicidal'),
 ['danger-others','I fear I could seriously hurt someone','Risk to others and urgent support','violence danger')
 ]
};
const clinical=new Set(['binge-eating','food-restriction','purging-urges','grandiose-beliefs','elevated-mood','alcohol-harm','drug-harm','withdrawal-worries','flashbacks','derealisation','depersonalisation']);
const danger=new Set(['suicidal-thoughts','self-injury','danger-others','unsafe-home','purging-urges','food-restriction','withdrawal-worries','aggressive-urges','workplace-bullying']);
export const extendedProblemIndex=Object.freeze(Object.entries(groups).flatMap(([domain,items])=>items.map(([id,title,hint,aliases])=>
 Object.freeze({id,title,hint,domain,aliases:aliases.split(' '),tools:[],medical:clinical.has(id),needsHuman:danger.has(id)}))));
