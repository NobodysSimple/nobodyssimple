/* Progressive disclosure for the needs-first navigator.
 * Every Atlas domain belongs to exactly one plain-language theme.
 * The theme is a browsing aid, not a clinical classification.
 */
export const NAV_THEMES=Object.freeze([
 {id:'emotions',title:'Feelings & mental wellbeing',short:'Feelings, thoughts, stress and difficult patterns',icon:'♡',
  domains:['feel','think','experiences','clinical','trauma','behaviour']},
 {id:'people',title:'Relationships & safety',short:'Family, friendship, conflict, support and protection',icon:'◎',
  domains:['relate','family','social','harm','safety']},
 {id:'identity',title:'Identity & belonging',short:'Who we are, community, faith and cultural experience',icon:'◇',
  domains:['identity','lgbtq','culture','faith','migration']},
 {id:'health',title:'Body, health & access',short:'Physical wellbeing, neurodivergence and accessibility',icon:'◌',
  domains:['body','neuro','disability','appearance','sexuality']},
 {id:'everyday',title:'Everyday life & change',short:'Getting things done, learning, transitions and growth',icon:'↗',
  domains:['act','focus','work','education','change','growth','lifespan']},
 {id:'society',title:'The world around us',short:'Money, inequality, technology and the environment',icon:'✧',
  domains:['inequality','digital','environment']}
].map(t=>Object.freeze({...t,domains:Object.freeze(t.domains)})));
export const THEME_FOR_DOMAIN=Object.freeze(Object.fromEntries(
 NAV_THEMES.flatMap(theme=>theme.domains.map(domain=>[domain,theme.id]))
));
export const topicTheme=topic=>THEME_FOR_DOMAIN[topic?.domain]||null;
export const topicsInTheme=(topics,themeId,domain='')=>topics.filter(p=>
 topicTheme(p)===themeId&&(!domain||p.domain===domain));
export const matchingTopics=(topics,query)=> {
 const needle=String(query||'').toLocaleLowerCase().replace(/[’']/g,'').replace(/[^\\p{L}\\p{N}]+/gu,' ').trim();
 const words=needle.split(/\\s+/).filter(Boolean);
 if(!words.length)return topics;
 const clean=x=>String(x??'').toLocaleLowerCase().replace(/[’']/g,'').replace(/[^\\p{L}\\p{N}]+/gu,' ').trim();
 return topics.filter(p=>words.every(w=>clean([p.id,p.title,p.hint,...(p.aliases||[])].join(' ')).includes(w)));
};
