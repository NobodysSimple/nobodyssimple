/* Nobody's Simple — Cultural Psychology Atlas editorial seed collection.
 * Traditions are community practices, not psychological traits of a nationality.
 * Reflections are editorial interpretations, not clinical efficacy claims.
 * Every entry identifies a documentary source and a question for the reader.
 */
const article=(id,country,title,theme,place,body,reflection,question,source,region='')=>Object.freeze({
 id,country,title,theme,place,body:Object.freeze(body),reflection,question,
 source:Object.freeze({label:'UNESCO Intangible Cultural Heritage',url:source}),region
});
export const CULTURE_ARTICLES=Object.freeze([
 article('washoku','JPN','Washoku: how a meal can hold memory','Ritual & belonging','Japan',
 [
 'Washoku is not simply a particular menu. UNESCO describes a set of food-related skills and social practices, notably visible at New Year, when particular dishes and seasonal ingredients carry meaning for families and communities.',
 'The psychological invitation is to notice how ordinary actions become anchors for continuity. A shared preparation can connect people to a season, place or family history without requiring everyone to share exactly the same beliefs.',
 'Yet traditions can also involve labour and expectations. The lesson is not that every family should preserve a ritual unchanged, but that we can choose small repeated acts that make relationships and values visible.'
 ],
 'A ritual gives an ordinary activity a shared meaning; it is not proof that one culture has better mental health.',
 'Is there a simple practice you would like to keep, adapt or create with people you care about?',
 'https://ich.unesco.org/en/RL/washoku-traditional-dietary-cultures-of-the-japanese-notably-for-the-new-year-00869'),
 article('ainu-dance','JPN','Ainu dance: identity through movement','Identity & community','Hokkaidō, Japan',
 [
 'Traditional Ainu dance belongs to the Ainu, an Indigenous people associated particularly with Hokkaidō. UNESCO records dance at ceremonies, festivals and everyday gatherings, in forms that can invoke relationships with nature and the spiritual world.',
 'A dance may be more than entertainment: it can carry knowledge that is difficult to reduce to sentences. Movement, rhythm and participation can be ways of expressing belonging across generations.',
 'The practice should not be treated as a generic Japanese wellness exercise. Its cultural context, history and living custodians matter, particularly when outsiders wish to learn from it.'
 ],
 'Identity can be carried through embodied, communal practices, not only personal descriptions.',
 'What activity helps you express belonging without having to explain yourself?',
 'https://ich.unesco.org/en/RL/traditional-ainu-dance-00278','Hokkaid'),
 article('day-of-dead','MEX','Día de los Muertos: remembrance as an active relationship','Grief & meaning','Indigenous communities in Mexico',
 [
 'UNESCO describes Indigenous festivities dedicated to the dead in parts of Mexico, where families prepare offerings, paths and spaces that welcome the memory and symbolic return of loved ones.',
 'One psychological idea worth exploring is continuing bonds: bereavement need not require abandoning every connection with a person who has died. Remembrance can coexist with everyday life.',
 'There is no single Mexican way to grieve, and participating communities have distinct practices. The invitation is not to copy sacred symbols, but to consider whether remembrance can be personal, social and meaningful.'
 ],
 'Grief can include a continuing relationship with memory as well as adapting to absence.',
 'What would a respectful way of remembering someone look like in your own context?',
 'https://ich.unesco.org/en/RL/indigenous-festivity-dedicated-to-the-dead-00054'),
 article('kimjang','KOR','Kimjang: cooperation that leaves something behind','Care & cooperation','Republic of Korea',
 [
 'Kimjang is the seasonal practice of preparing and sharing quantities of kimchi. UNESCO documents how family and community members exchange knowledge, labour and food in anticipation of winter.',
 'It offers an example of care that is practical rather than only verbal. Helping another person prepare for an upcoming need can communicate reliability, inclusion and mutual dependence.',
 'That does not imply that everyone enjoys or participates in kimjang, or that unpaid group labour is automatically fair. Reciprocity and the right to choose matter.'
 ],
 'Support may be experienced through coordinated action, not only reassurance.',
 'What small practical contribution could make life easier for someone in your community?',
 'https://ich.unesco.org/en/RL/kimjang-00881'),
 article('jang','KOR','Jang making: patience and intergenerational knowledge','Learning & patience','Republic of Korea',
 [
 'Making jang—fermented sauces and pastes—draws on knowledge of ingredients, conditions and time. Korean heritage descriptions document skills passed through households and community teaching.',
 'The psychological theme here is patient attention. Some valued outcomes develop through monitoring and adjustment, not instant feedback. Care for a long process can hold family memories as well as technique.',
 'But tradition is not an obligation to reproduce rigid family roles. Learning can preserve knowledge while also opening it to new people and approaches.'
 ],
 'Long processes can help us reconsider the assumption that worthwhile progress is always quick.',
 'Where in your life would it help to recognise gradual progress?',
 'https://unesco.mofa.go.kr/unesco-en/brd/m_8666/view.do?seq=761009'),
 article('sauna','FIN','Sauna culture: making a place for pause','Rest & community','Finland',
 [
 'UNESCO describes Finnish sauna traditions as involving more than washing. Saunas can be domestic or public, with varied practices and meanings connected to rest, shared time and continuity.',
 'A useful psychological question is what makes a place feel different from the demands outside it. A pause may become easier when the setting, sequence and expectations all signal a change of pace.',
 'Heat exposure is not appropriate for everybody; the lesson is about deliberate boundaries around rest rather than a medical recommendation to use saunas.'
 ],
 'Rest can be supported by environments and social customs, not only individual willpower.',
 'What signals could help you make room for rest in a way that suits your body?',
 'https://ich.unesco.org/en/RL/sauna-culture-in-finland-01596'),
 article('batik','IDN','Batik: stories held in pattern','Identity & creativity','Indonesia',
 [
 'Indonesian batik uses wax-resist dyeing techniques. UNESCO describes motifs associated with life events, local influences and family transmission, alongside ongoing creativity by craftspeople.',
 'A pattern may hold information about history, celebration, identity or aspiration. This suggests an alternative to the idea that meaningful self-expression must always be a spoken explanation.',
 'There are many regional batik traditions and contemporary adaptations. The practice is a living craft, not a single fixed symbol of everyone who lives in Indonesia.'
 ],
 'Art and material objects can act as vessels for personal and collective identity.',
 'What object, pattern or artwork says something important about your life?',
 'https://ich.unesco.org/en/RL/batik-00170'),
 article('capoeira','BRA','The capoeira circle: learning by joining in','Learning & mutual respect','Afro-Brazilian communities',
 [
 'In a capoeira roda, participants combine movement with singing, rhythm and social rules. UNESCO describes the circle as a site for observation, imitation, instruction and the memory of resistance to oppression.',
 'A psychological insight is that learning is often relational. People acquire skill through rhythm, feedback, shared attention and trusted guidance, not simply through being told what to do.',
 'The practice is rooted in Afro-Brazilian history; treating it as a generic productivity hack would erase part of what makes it meaningful.'
 ],
 'Knowledge can live within relationships, performance and collective memory.',
 'Who has helped you learn a difficult skill through doing rather than explaining?',
 'https://ich.unesco.org/en/RL/roda-of-capoeira-00892'),
 article('kente','GHA','Kente: what cloth can say','Identity & communication','Weaving communities in Ghana',
 [
 'Kente is woven from strips of fabric, and its colours and designs can communicate social meaning. UNESCO notes that finished textiles may be named with proverbs, sayings or social situations.',
 'Clothing and objects can be forms of storytelling. That matters psychologically because identity is not limited to the private interior self: it is also negotiated through shared signs and relationships.',
 'Meanings vary by community and use. The lesson is to ask who creates the symbol, who interprets it and who has the authority to explain it.'
 ],
 'Objects can communicate values and histories, but interpretation depends on cultural context.',
 'What visible sign of belonging matters to you, and who gets to define its meaning?',
 'https://ich.unesco.org/en/RL/craftsmanship-of-traditional-woven-textile-kente-02130'),
 article('yoga','IND','Yoga: attention, body and tradition','Attention & embodiment','India',
 [
 'UNESCO describes yoga as an Indian tradition encompassing postures, breathing, meditation, chanting and philosophical approaches to the relationship between body and mind.',
 'Its history is broader than a modern fitness routine. An interesting psychological question is how deliberate attention to movement and breathing changes the way someone notices an experience.',
 'Yoga is practised in many forms, and neither its origins nor its cultural meaning should be reduced to a universal treatment claim. Participation and safety depend on the person and setting.'
 ],
 'Embodied practices invite us to observe experience rather than rely solely on verbal analysis.',
 'When do you become more aware of how your body and attention interact?',
 'https://ich.unesco.org/en/RL/yoga-01163'),
 article('garba','IND','Garba: how a circle makes participation possible','Collective participation','Gujarat, India',
 [
 'Garba is a devotional dance associated with Navaratri in Gujarat. UNESCO describes circular movement, clapping, music and knowledge shared through community practice.',
 'The form offers a way to think about participation: learning the shared rhythm can make an activity accessible without expecting everybody to take a solo role.',
 'Garba also has particular religious and cultural meanings. Appreciating an idea about participation does not mean detaching the practice from the communities that sustain it.'
 ],
 'A shared structure can support participation without making everyone perform identically.',
 'What group activity feels welcoming because the rules are clear and participation is shared?',
 'https://ich.unesco.org/en/RL/garba-of-gujarat-01962','Gujarat'),
 article('castells','ESP','Castells: trust is built from the bottom','Cooperation & trust','Catalonia, Spain',
 [
 'In Catalonia, teams called castellers build human towers at public festivals. UNESCO describes the coordinated base, musicians, training and roles through which different members support the whole structure.',
 'The striking psychological image is that a visible achievement depends on less visible preparation and collective responsibility. Trust is not merely a feeling: it also involves reliable practices and attention to risk.',
 'These towers require specialised training and safety procedures; they are not something to imitate as an exercise. The metaphor is about mutual support, not taking greater physical risks.'
 ],
 'Strong collective achievement often depends on support that is easy to overlook.',
 'Who forms the base for something you are able to do, and how is that support recognised?',
 'https://ich.unesco.org/en/RL/human-towers-00364','Catal'),
 article('french-meal','FRA','The celebratory meal: making room for togetherness','Ritual & connection','France',
 [
 'UNESCO describes the gastronomic meal of the French as a social practice marking important occasions, with preparation, a sequence of courses and attention to shared enjoyment.',
 'The psychology worth considering is how an occasion becomes more memorable when people deliberately mark it. The sequence and attention may signal: this moment matters enough to slow down for.',
 'This is a documented tradition, not a claim about the eating habits or happiness of every French person. Many ways of gathering can create comparable meaning.'
 ],
 'Ceremony can help people notice and share the significance of a moment.',
 'What ordinary gathering could become more meaningful with one small intentional ritual?',
 'https://ich.unesco.org/en/RL/gastronomic-meal-of-the-french-2010-00437'),
 article('tea','CHN','Tea and hospitality: an invitation to connect','Hospitality & belonging','Communities across China',
 [
 'UNESCO records diverse tea-growing, preparation and sharing practices in China. Serving tea appears in homes, workplaces, celebrations and ceremonies across different communities.',
 'The psychological possibility is that hospitality can be communicated in small repeated actions. Offering time, a place to sit or a drink may lower the effort needed to begin a conversation.',
 'There is no single Chinese tea custom, and tea is not a solution to loneliness. The value lies in noticing how a social gesture can make room for connection.'
 ],
 'Small rituals of welcome can create opportunities for social connection.',
 'How do you show someone they are welcome without needing a long conversation?',
 'https://ich.unesco.org/en/RL/traditional-tea-processing-techniques-and-associated-social-practices-in-china-01884'),
 article('argan','MAR','Argan knowledge: care across generations','Skill & community','South-west Morocco',
 [
 'UNESCO documents traditional knowledge around the argan tree in south-west Morocco, including extraction techniques and skills transmitted by rural women and other community members.',
 'This is an example of expertise that is often practical, local and learned through participation. Such knowledge can be overlooked when formal qualifications are treated as the only evidence of skill.',
 'These traditions also involve livelihoods, labour and changing economic conditions. Admiration should include attention to the people whose work sustains them.'
 ],
 'Intergenerational and practical expertise deserves recognition alongside academic knowledge.',
 'Whose skill or labour do you depend on without often noticing it?',
 'https://ich.unesco.org/en/RL/argan-practices-and-know-how-concerning-the-argan-tree-00955')
]);
export const articlesForCountry=code=>CULTURE_ARTICLES.filter(a=>a.country===code);
export const articleCountries=Object.freeze([...new Set(CULTURE_ARTICLES.map(a=>a.country))]);
export const articleById=id=>CULTURE_ARTICLES.find(a=>a.id===id)||null;
