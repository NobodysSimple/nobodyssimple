/* Eleven balanced, plain-language topic families for every starting point.
 * The 518 existing entries are classified once; relevance sorting changes by
 * starting goal, not which subjects the person is allowed to explore.
 * Families are navigation aids, not medical or diagnostic categories.
 */
export const NAV_THEMES=Object.freeze([
 {id:'mood',title:'Feelings & mental health',short:'Anxiety, mood, distress and unusual experiences',icon:'♡',
  domains:['feel','clinical','experiences']},
 {id:'thinking',title:'Thinking, habits & focus',short:'Worry, overthinking, concentration and repeated habits',icon:'◇',
  domains:['think','behaviour','focus']},
 {id:'connection',title:'Relationships & connection',short:'Love, friendship, trust, caring and belonging',icon:'◎',
  domains:['relate','social']},
 {id:'family',title:'Family, harm & safety',short:'Family experiences, coercion, boundaries and protection',icon:'♧',
  domains:['family','harm','safety']},
 {id:'identity',title:'Identity & self-image',short:'Gender, orientation, self-worth and appearance',icon:'✦',
  domains:['identity','lgbtq','appearance']},
 {id:'culture',title:'Culture, faith & migration',short:'Racism, religion, community and moving countries',icon:'✳',
  domains:['culture','faith','migration']},
 {id:'health',title:'Body, sleep & intimacy',short:'Physical wellbeing, sleep, sexuality and reproductive health',icon:'◌',
  domains:['body','sexuality']},
 {id:'access',title:'Neurodivergence & disability',short:'Neurotypes, accessibility, chronic conditions and support',icon:'▤',
  domains:['neuro','disability']},
 {id:'work',title:'Work, learning & getting things done',short:'Study, jobs, decisions, motivation and organisation',icon:'↗',
  domains:['work','education','act']},
 {id:'society',title:'Money, technology & society',short:'Financial pressure, digital life and wider social conditions',icon:'⌁',
  domains:['inequality','digital','environment']},
 {id:'changes',title:'Life changes, grief & growth',short:'Loss, trauma, life stages, adjustment and personal growth',icon:'☼',
  domains:['change','trauma','lifespan','growth']}
].map(t=>Object.freeze({...t,domains:Object.freeze(t.domains)})));

// Some entries are better understood by their concrete subject than by their
// catalogue's broad original domain. Nine related entries shift from the busy
// transitions family into connection, balancing both themes without arbitrary
// splitting or changing the underlying topic domain or URL.
export const TOPIC_THEME_OVERRIDES=Object.freeze({
 'betrayal-trauma':'connection',
 'post-trauma-trust':'connection',
 'older-adult-loneliness':'connection',
 'building-belonging':'connection',
 'sustaining-healthy-relationships':'connection',
 'feeling-connected':'connection',
 'end-of-life-caregiving':'connection',
 'parenting-teenager':'connection',
 'empty-nest-transition':'connection'
});
export const THEME_FOR_DOMAIN=Object.freeze(Object.fromEntries(
 NAV_THEMES.flatMap(theme=>theme.domains.map(domain=>[domain,theme.id]))
));
export const topicTheme=topic=>topic?TOPIC_THEME_OVERRIDES[topic.id]||THEME_FOR_DOMAIN[topic.domain]||null:null;
export const topicsInTheme=(topics,themeId)=>topics.filter(p=>topicTheme(p)===themeId);
export const matchingTopics=(topics,query)=>{
 const clean=x=>String(x??'').toLocaleLowerCase().replace(/[’']/g,'').replace(/[^\p{L}\p{N}]+/gu,' ').trim();
 const words=clean(query).split(/\s+/).filter(Boolean);
 if(!words.length)return topics;
 return topics.filter(p=>words.every(w=>clean([p.id,p.title,p.hint,...(p.aliases||[])].join(' ')).includes(w)));
};
