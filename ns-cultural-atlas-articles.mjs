/* Nobody's Simple — Cultural Psychology Atlas editorial seed collection.
 * Traditions are community practices, not psychological traits of a nationality.
 * Reflections are editorial interpretations, not clinical efficacy claims.
 * Every entry identifies a documentary source and a question for the reader.
 */
const article=(id,country,title,theme,place,body,reflection,question,source,region='')=>Object.freeze({
 id,country,title,theme,place,body:Object.freeze(body),psychology:body[1]||'',reflection,question,
 source:Object.freeze({label:source.includes('ich.unesco.org')?'UNESCO Intangible Cultural Heritage':source.includes('whc.unesco.org')?'UNESCO World Heritage Centre':source.includes('cornwall.gov.uk')?'Cornwall Council':source.includes('nls.uk')?'National Library of Scotland':source.includes('gov.wales')?'Welsh Government':source.includes('mbie.govt.nz')?'New Zealand Government':source.includes('cherokee.org')?'Cherokee Nation':source.includes('nps.gov')?'US National Park Service':source.includes('abudhabiculture.ae')?'Abu Dhabi Department of Culture and Tourism, Heritage Register':'Documentary source',url:source}),region
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
 'https://ich.unesco.org/en/RL/argan-practices-and-know-how-concerning-the-argan-tree-00955'),
 article("irish-harping","IRL","Irish harping: a sound that travels across generations","Memory & continuity","Communities across the island of Ireland",[
  "UNESCO documents Irish harping as a living musical practice, learned by listening, playing with others and, increasingly, through written notation. Contemporary musicians preserve older repertoires while making room for new instruments and styles.",
  "A familiar sound can carry more than a tune. Hearing a piece that relatives or neighbours know may locate someone within a story stretching beyond their own lifetime. This is a possible way to think about collective memory, not evidence that a musical tradition produces one particular psychological effect.",
  "Revival also involves decisions about who teaches, who has access and what counts as authentic. A tradition stays alive through people negotiating change, rather than by requiring every performer to reproduce the past exactly."
 ],"Cultural continuity can be practised and revised; it need not depend on an unchanging version of the past.","Which sound or song connects you to a place, person or memory?","https://ich.unesco.org/en/RL/irish-harping-01461"),
 article("fado","PRT","Fado: when a city sings more than one history","Emotion & migration","Lisbon, Portugal",[
  "Fado brings singing, poetry and instruments into gathering places in Lisbon. UNESCO describes a genre shaped by several streams of music, urban life and migration, rather than a timeless expression belonging to one uniform national character.",
  "Songs can offer a public language for feelings that are hard to explain in conversation. An audience may recognise loss, affection or uncertainty without assuming that everyone hears the same meaning. This is an interpretive possibility, not a measured effect of fado on mood.",
  "Describing fado as simply sad would miss its changing repertoire, communities and performance settings. It also risks erasing the people and histories that shaped the music. A living art can carry conflicting emotions at once."
 ],"Shared art can make emotions communicable without making those emotions identical for everyone.","Is there a piece of music that helps you recognise a feeling without settling what it means?","https://ich.unesco.org/en/RL/fado-00563"),
 article("rebetiko","GRC","Rebetiko: whose stories become a city's soundtrack?","Class & belonging","Urban communities in Greece",[
  "Rebetiko developed among lower- and working-class urban communities in the early twentieth century. UNESCO describes a tradition of song, dance and performance that travelled from informal face-to-face learning into recordings, schools and new public settings.",
  "This history invites a question about cultural recognition. Music associated with marginalised people can become valued national heritage, yet that change does not automatically erase the inequality or stigma in its earlier social world.",
  "Rather than treating music as proof of a whole population's emotional style, we can ask who was allowed to perform, whose experiences entered the lyrics and how later audiences understand them. Recognition changes the social meaning of an art without giving it only one meaning."
 ],"What a society celebrates today may once have been dismissed because of who created it.","What creative expression has helped you understand a group whose experience differs from yours?","https://ich.unesco.org/en/RL/rebetiko-01291"),
 article("szopka","POL","Kraków's szopka: building a city out of memory","Place & imagination","Kraków, Poland",[
  "Each year, makers in Kraków construct elaborate szopka nativity scenes drawing on the city's architecture and public life. UNESCO describes a December gathering where these creations are displayed, and skills are passed on through workshops and repeated participation.",
  "Making a model city can become a way of noticing which buildings, stories and changes feel worth keeping. Objects can prompt conversation across generations because a familiar place is represented differently by each maker.",
  "This is not evidence that craft prevents loneliness or preserves every historical perspective. Public heritage always involves choices about what is remembered, who participates and which parts of the city are left out of the picture."
 ],"The places we recreate reveal what we notice, remember and choose to pass on.","Which place would you recreate to explain something important about your life?","https://ich.unesco.org/en/RL/nativity-scene-szopka-tradition-in-krakow-01362"),
 article("pizzaiuolo","ITA","Neapolitan pizzaiuolo: learning by watching hands","Apprenticeship & skill","Naples, Campania, Italy",[
  "UNESCO describes the art of the Neapolitan pizzaiuolo as a skilled sequence of preparing dough, handling it and baking it in a wood-fired oven. Knowledge is transmitted in workshops and homes, especially through observation of experienced makers.",
  "A learner may acquire timing and judgement through repeated work alongside somebody else. The example challenges the assumption that all important knowledge can be captured in written instructions: practical understanding can involve sensory attention and social feedback.",
  "Celebrating craftsmanship should not romanticise unpaid labour, rigid hierarchies or unsafe conditions. The cultural value lies in particular histories and relationships of teaching, not in the claim that traditional methods are always superior."
 ],"Some abilities are built through guided participation, not just explanation.","What skill became easier when you watched someone experienced do it?","https://ich.unesco.org/en/RL/art-of-neapolitan-pizzaiolo-00722","Campania"),
 article("petrykivka","UKR","Petrykivka painting: making home into a living canvas","Creativity & identity","Petrykivka, Ukraine",[
  "Petrykivka decorative painting uses intricate plant and animal motifs on household surfaces and objects. UNESCO describes a practice passed between generations and taught in local schools, with individual makers renewing its patterns rather than merely copying them.",
  "The practice offers a way to understand home as something people actively make meaningful. Decorating a familiar object may connect memory, environment and identity through materials that are touched and seen in everyday life.",
  "Symbols are not universal psychological tests: a bird or flower does not mean the same thing in every tradition. To understand an image, we need the makers' accounts and the circumstances in which it is created, taught and displayed."
 ],"Making meaning can happen through objects and places, not only spoken stories.","What object or image makes a place feel like yours?","https://ich.unesco.org/en/RL/petrykivka-decorative-painting-as-a-phenomenon-of-the-ukrainian-ornamental-folk-art-00893","Dnipropetrovsk"),
 article("flamenco","ESP","Flamenco: an emotion is not a national personality","Expression & interpretation","Andalusia and other regions of Spain",[
  "Flamenco brings together song, dance and instrumental performance. UNESCO describes Andalusia as its heartland while also recognising other regional roots and the essential contribution of Gitano (Roma) communities to its development and transmission.",
  "A performance can make grief, joy, longing or tension perceptible through voice, rhythm and movement. Yet a powerful artistic expression should not be mistaken for evidence that people in the surrounding region feel emotions more intensely than anyone else.",
  "Whose contribution is acknowledged matters. Stories that call flamenco simply Spanish can make it easier to overlook specific communities, generations of teachers and changing social relationships that helped shape the tradition."
 ],"The language of an art form can express emotion without defining the personality of its makers or audiences.","When has a performance helped you understand a feeling you could not easily name?","https://ich.unesco.org/en/RL/flamenco-00363","Andalusia"),
 article("argungu","NGA","Argungu: a fishing festival and the work of peace","Cooperation & history","Argungu, Kebbi State, Nigeria",[
  "The Argungu fishing and cultural festival brings communities together around river competitions, music and other activities in north-western Nigeria. UNESCO also connects its history with relations between Argungu and neighbouring Sokoto communities.",
  "A shared event may give people a reason to cooperate across differences, but festivals do not resolve every political tension. Their social meaning comes from the particular relationships, institutions and local histories that surround participation.",
  "The festival also depends on knowledge of river conditions and fishing practices passed down through families and specialist roles. That makes ecological expertise part of cultural memory, not merely a colourful backdrop to competition."
 ],"Shared celebration can create occasions for cooperation while still leaving difficult histories worth examining.","What local event helps people cooperate who might otherwise rarely meet?","https://ich.unesco.org/en/RL/argungu-international-fishing-and-cultural-festival-00901","Kebbi"),
 article("isukuti","KEN","Isukuti: the knowledge carried by a drumbeat","Transmission & change","Isukha and Idakho communities, western Kenya",[
  "Isukuti combines drumming, singing and energetic movement at celebrations and other significant occasions among Isukha and Idakho communities. UNESCO places the tradition on its list of heritage in need of urgent safeguarding because transmission and performance have declined.",
  "The important psychological question is not whether dancing automatically creates belonging. It is how people learn the rhythm, roles and meanings of an occasion through repeated participation with other people.",
  "Safeguarding is not simply preserving an entertaining performance for visitors. UNESCO records obstacles such as ageing practitioners, limited resources and shifting audiences. Supporting continuity requires listening to the people who carry the knowledge."
 ],"Keeping a practice alive involves relationships, resources and opportunities to teach, not nostalgia alone.","What knowledge in your community might disappear if nobody had time to teach it?","https://ich.unesco.org/en/RL/isukuti-dance-of-isukha-and-idakho-communities-of-western-kenya-00981","Kakamega"),
 article("barkcloth","UGA","Buganda barkcloth: a material that carries social history","Craft & social meaning","Buganda, southern Uganda",[
  "Barkcloth making is a longstanding craft among the Baganda people. UNESCO describes how makers harvest and work the inner bark of the mutuba tree, turning it into cloth used in ceremonies and other parts of community life.",
  "An object can hold several kinds of meaning at once: practical usefulness, skilled labour, status and ritual significance. Looking only at the finished fabric would miss the people, material knowledge and historical circumstances behind it.",
  "The craft's fortunes have changed with trade, new fabrics and modern revival efforts. Its history reminds us that cultural continuity is shaped by economies and institutions as well as by personal attachment to a tradition."
 ],"Material objects can communicate identity and belonging, but their significance depends on a particular social history.","What everyday material carries a history you rarely stop to consider?","https://ich.unesco.org/en/RL/barkcloth-making-in-uganda-00139"),
 article("fichee","ETH","Fichee-Chambalaalla: a new year made through relationships","Ritual & reciprocity","Sidama communities, Ethiopia",[
  "Fichee-Chambalaalla marks the Sidama New Year. UNESCO describes an oral history about a woman visiting relatives and sharing a special meal, as well as festivities that carry knowledge of social relationships and community values.",
  "A new year is not only a change of date. Making visits, sharing food and gathering can provide a structure for recognising obligations, affection and the possibility of renewing relationships.",
  "The practice belongs to Sidama communities, not to a single Ethiopian way of celebrating. A reflective lesson about renewal should not erase the different histories, beliefs or everyday constraints of people who take part."
 ],"Collective time can be made meaningful through acts of recognition and reciprocity.","What yearly occasion gives you a chance to reconnect or begin again?","https://ich.unesco.org/en/RL/fichee-chambalaalla-new-year-festival-of-the-sidama-people-01054","Sidama"),
 article("mbende","ZWE","Mbende Jerusarema: how a dance survives judgement","Power & adaptation","Zezuru Shona communities, eastern Zimbabwe",[
  "Mbende Jerusarema is a dance associated particularly with Zezuru Shona communities in eastern Zimbabwe. UNESCO describes its distinctive drumming and movement and records how criticism by Christian missionaries influenced the names and meanings attached to it.",
  "The same act can be labelled unacceptable, sacred, entertaining or a symbol of cultural pride depending on who holds power to interpret it. That makes this tradition a useful starting point for examining how moral judgement operates within historical relationships.",
  "Modern tourist and political performances have also changed the dance's setting. Survival is not the same as remaining untouched: cultural expressions can be transformed by the conditions in which people earn a living or seek recognition."
 ],"A tradition's meaning is shaped not only by performers, but also by those with the power to judge or display it.","Have you seen an activity judged differently when the audience or institution changed?","https://ich.unesco.org/en/RL/mbende-jerusarema-dance-00169"),
 article("zafimaniry","MDG","Zafimaniry woodcraft: knowledge built into the home","Ecology & belonging","Zafimaniry communities, south-eastern Madagascar",[
  "UNESCO documents Zafimaniry woodcraft through houses, tools and carved surfaces made with specialised knowledge of different tree species. Patterns can express ideas about relationships and social life; craftsmanship is intertwined with the material environment.",
  "This suggests that a home may be a living record of skills and values rather than only a private shelter. Yet the symbolism belongs to particular communities: outside viewers cannot safely assign a psychological meaning to each design on sight.",
  "UNESCO also describes deforestation and pressures from tourism. Admiring a beautiful tradition without considering access to resources and the makers' livelihoods would leave out essential conditions for its future."
 ],"Cultural knowledge is sustained by environments and livelihoods as well as by memory.","Which local skill depends on a place or resource that is changing?","https://ich.unesco.org/en/RL/woodcrafting-knowledge-of-the-zafimaniry-00080"),
 article("gnawa","MAR","Gnawa: rhythm, ancestry and the limits of translation","Spiritual meaning & history","Gnawa communities in Morocco",[
  "UNESCO describes Gnawa as a set of musical, spiritual and communal practices shaped by African, Arab-Muslim and Amazigh influences and histories of enslavement and displacement. Performances may involve distinctive instruments, rhythm and all-night ceremonies.",
  "From outside, it can be tempting to describe ritual through familiar psychological terms such as catharsis or emotion regulation. Those ideas may prompt questions, but they cannot replace practitioners' own spiritual explanations or establish clinical effects.",
  "The tradition's present life includes both community settings and public festivals. Understanding it requires holding together memory of injustice, living religious meaning, artistry and changing opportunities for musicians."
 ],"A psychological lens can illuminate part of a tradition without overriding its own meanings.","When have you realised that your explanation of someone's practice left out what it meant to them?","https://ich.unesco.org/en/RL/gnawa-01170"),
 article("drametse","BTN","Drametse mask dance: meaning beyond the performance","Ritual & interpretation","Drametse, eastern Bhutan",[
  "The mask dance of the drums from Drametse is performed in a religious festival linked to a monastery in eastern Bhutan. UNESCO describes masked dancers, a drum-and-cymbal orchestra and sequences associated with peaceful and wrathful deities.",
  "An outsider might focus only on striking costumes or movement. For participating communities, however, the performance has spiritual significance that cannot be translated faithfully into a generic lesson about mindfulness or emotion regulation.",
  "UNESCO also records concerns about transmission and rehearsal opportunities. A living ritual depends on practitioners, teachers and the settings that give it meaning; preserving images of the dance is not the same as supporting that living practice."
 ],"Understanding a practice means taking its participants' interpretations seriously, not only analysing what an observer sees.","When has the meaning of an event changed after you learned what it meant to participants?","https://ich.unesco.org/en/RL/mask-dance-of-the-drums-from-drametse-00161"),
 article("sbek-thom","KHM","Sbek Thom: the stories moving behind a screen","Storytelling & continuity","Khmer communities, Cambodia",[
  "Sbek Thom is a Khmer shadow theatre using large carved leather figures. UNESCO describes its ceremonial history and its later development as an artistic performance, while maintaining religious and cultural dimensions.",
  "A story told through shadows relies on a shared convention: spectators understand characters and action although they see silhouettes rather than a full scene. This offers a way to think about how meaning is made collaboratively by performers and audiences.",
  "Calling the practice simply a creative therapy would replace a specific heritage with an outsider's purpose. Its survival also depends on trained performers and craftsmen, as well as on the social institutions that support them."
 ],"Stories can use simple visible forms to carry meanings that depend on shared knowledge and history.","What story or performance means more to you because of how it was passed down?","https://ich.unesco.org/en/RL/sbek-thom-khmer-shadow-theatre-00108"),
 article("angklung","IDN","Angklung: the music no one makes alone","Coordination & cooperation","Communities in Indonesia",[
  "Angklung instruments contain tuned bamboo tubes that sound when shaken or tapped. UNESCO explains that an individual instrument typically makes only one note or chord, so melodies are produced when several players coordinate their parts.",
  "This gives a concrete example of interdependence: the outcome is not simply the sum of isolated talent but requires timing, listening and awareness of other people's contributions. It does not establish that playing angklung improves cooperation in every group.",
  "The instrument also has histories linked to ceremonies, agriculture and changing musical education. Reducing it to a team-building exercise would erase the knowledge of craftspeople and communities who maintain the tradition."
 ],"Cooperation can be designed into a task: sometimes success requires attentive coordination rather than individual performance.","When did your contribution matter because someone else's part was different from yours?","https://ich.unesco.org/en/RL/indonesian-angklung-00393"),
 article("rukada-natya","LKA","Rūkada Nātya: puppets that speak to a village","Moral stories & learning","Southern coastal communities, Sri Lanka",[
  "Rūkada Nātya is a tradition of string-puppet drama associated with performing families in southern Sri Lanka. UNESCO describes performances that entertain audiences and present moral stories, alongside the craftsmanship and skills needed to produce them.",
  "Stories can create a safe distance from a difficult question: a character can face a dilemma before people discuss it directly. That is an editorial interpretation of how theatre may invite reflection, not evidence of a therapeutic effect.",
  "The practice is tied to particular lineages and coastal towns. Treating it as a generic national characteristic would obscure who has performed it, how the art is taught and what choices those practitioners face today."
 ],"Fiction and performance can invite discussion of values without prescribing one answer to every audience.","What fictional character helped you think differently about a real decision?","https://ich.unesco.org/en/RL/rkada-ntya-traditional-string-puppet-drama-in-sri-lanka-01370","Southern"),
 article("khon","THA","Khon: the social lessons inside a masked drama","Roles & social norms","Thailand",[
  "Khon combines masked dance, narrative, music, elaborate costume and craft. UNESCO describes dramatic episodes involving Rama and other characters, together with a long history of court performance and teaching in modern institutions.",
  "The production invites a question about the relationship between art and social norms. Stories can make values such as duty, hierarchy and justice memorable, but audiences may also interpret those values differently across generations.",
  "A mask does not reveal a single Thai psychology. The tradition exists within distinct religious, political and educational histories, and a description of its themes should not be confused with approval of every role or hierarchy represented."
 ],"Stories can transmit social expectations, which people may preserve, reinterpret or challenge.","Which story taught you a social rule that you later reconsidered?","https://ich.unesco.org/en/RL/khon-masked-dance-drama-01385"),
 article("hudhud","PHL","Hudhud: memory that lives in a shared voice","Oral memory & community","Ifugao communities, northern Philippines",[
  "The Hudhud chants of the Ifugao contain lengthy narratives associated with rice cultivation, harvest and funeral occasions. UNESCO describes elderly women as important narrators and explains that the chants preserve stories, beliefs and customary knowledge.",
  "Written archives are not the only way a community remembers. Repetition, alternating voices and occasions for performance can support transmission, although this does not mean that oral memory is infallible or identical for every listener.",
  "UNESCO records pressures on this heritage as agricultural practices and community life change. Safeguarding depends on the wishes and circumstances of narrators and learners, not simply recording a song and assuming the work is finished."
 ],"Who gets the opportunity to tell and retell a story matters for whose knowledge survives.","Who in your life remembers stories that no photograph or document fully captures?","https://ich.unesco.org/en/RL/hudhud-chants-of-the-ifugao-00015"),
 article("mangal","BGD","Mangal Shobhajatra: making hope visible in public","Collective identity & agency","Dhaka, Bangladesh",[
  "Mangal Shobhajatra is a public procession associated with the Bengali New Year and organised through Dhaka University's Faculty of Fine Art. UNESCO traces it to students who sought collective hope during a period of military rule.",
  "Masks and large artworks make ideas such as courage, peace and opposition to harm visible in the street. The example suggests that making things together can be a form of public expression, but a procession cannot by itself prove social unity or political change.",
  "The political history matters. Describing the event only as a cheerful annual festival would remove the conditions that shaped it and the work of students and teachers who create its visual language."
 ],"Public creativity can be one way a community expresses shared hopes and disagreements.","What public artwork or gathering has helped you see a concern as something people share?","https://ich.unesco.org/en/RL/mangal-shobhajatra-on-pahela-baishakh-01091","Dhaka"),
 article("naadam","MNG","Naadam: competition inside a larger community","Achievement & belonging","Mongolia",[
  "Naadam is a festival involving wrestling, archery and horse racing alongside music, food, craft and ceremonial traditions. UNESCO describes its connection to Mongolian pastoral histories and its opportunities for community involvement.",
  "Competition often looks like a story about individual winners. In this setting, however, participation also depends on teachers, family knowledge, organisers, spectators and rituals that give achievement a shared meaning.",
  "The festival is not evidence that everyone in Mongolia values competition in the same way. Its distinctive sports also require skill and appropriate safety, and should not be reduced to an invitation for readers to imitate them."
 ],"Achievement can be personal and collective at the same time; a winner depends on a wider social world.","What achievement of yours relied on people whose contributions went unnoticed?","https://ich.unesco.org/en/RL/naadam-mongolian-traditional-festival-00395"),
 article("haenyeo","KOR","Jeju haenyeo: expertise beneath the surface","Gender & practical knowledge","Jeju Island, Republic of Korea",[
  "Jeju haenyeo are women divers who gather seafood without oxygen tanks and transmit knowledge about marine conditions and safety through practice and community organisations. UNESCO describes experience-based roles through which senior divers guide less experienced members.",
  "Their work complicates simple assumptions about who possesses expertise or authority. Skilled judgement here is embodied and ecological, developed under difficult material conditions rather than guaranteed by a formal title.",
  "Admiring resilience should not hide danger, changing livelihoods or the challenge of passing on knowledge. The psychological lesson is not to push past physical limits, but to notice the expertise that social stereotypes can make invisible."
 ],"Expertise may be embodied, local and socially undervalued, even when it requires exceptional judgement.","Whose practical knowledge deserves more recognition in your community?","https://ich.unesco.org/en/RL/culture-of-jeju-haenyeo-female-divers-01068","Jeju"),
 article("kumbh-mela","IND","Kumbh Mela: what makes a gathering meaningful?","Belief & collective ritual","Pilgrimage sites across India",[
  "Kumbh Mela is a major Hindu pilgrimage held in rotation at different Indian cities and associated with bathing in sacred rivers. UNESCO documents religious knowledge, institutions and teaching relationships that give this large gathering its form.",
  "From the outside it may be described as a crowd; for participants, it can be an act of devotion with meanings that differ across traditions and personal histories. Crowd size alone does not tell us how a person experiences belonging, faith or risk.",
  "A respectful psychological reading distinguishes participants' sacred understandings from social-scientific hypotheses. It also considers practical conditions such as travel, access, organisation and safety rather than treating collective belief as the only explanation."
 ],"The same gathering can be logistical, social and spiritual at once; no single lens captures every participant's experience.","What event has meant something different to you than it appeared to mean to an outsider?","https://ich.unesco.org/en/RL/kumbh-mela-01258"),
 article("dragon-boat","CHN","Dragon Boat Festival: memory moves with a calendar","Ritual & local difference","Multiple regions of China",[
  "UNESCO describes Dragon Boat Festival traditions associated with the fifth day of the fifth lunar month, including races, foods, memorial ceremonies and protective customs. The people remembered and the details of celebration vary across regions.",
  "A repeated date can be a cue for stories and relationships to be renewed. Calendars do more than measure time: communities can use them to make certain memories and responsibilities visible again.",
  "It would be inaccurate to call the festival one uniform Chinese ritual or a proven wellbeing intervention. Its regional variation matters, and a meaningful practice for one family may be unfamiliar or differently understood by another."
 ],"Ritual calendars can hold stories together while allowing local communities to remember different things.","What date means more to you than the number printed on a calendar?","https://ich.unesco.org/en/RL/dragon-boat-festival-00225"),
 article("reggae","JAM","Reggae: when music becomes a public argument","Voice & social change","Kingston and wider Jamaican communities",[
  "UNESCO traces reggae to musical cultures shaped by marginalised communities, particularly in western Kingston. Its development drew on earlier Jamaican forms and wider international influences, and its lyrics often address injustice, love, faith and humanity.",
  "Music can allow experiences excluded from official conversations to be heard in public. That does not make every reggae song political, nor does it prove that listening changes anyone's attitudes. It draws attention to who receives a platform.",
  "As reggae moved into international markets, its meanings also multiplied. Understanding its social history requires attention to creators, changing audiences and the difference between cultural recognition and material equality."
 ],"Art can create a public voice for experiences that institutions or everyday conversation overlook.","What song has helped you understand an experience you had not previously noticed?","https://ich.unesco.org/en/RL/reggae-music-of-jamaica-01398","Kingston"),
 article("taquile","PER","Taquile textiles: wearing a community's calendar","Time & cultural memory","Taquile Island, Lake Titicaca, Peru",[
  "Textile making on Taquile Island is woven into daily life across generations. UNESCO describes garments such as knitted chullo hats and calendar waistbands whose patterns can refer to agricultural cycles, histories and community knowledge.",
  "The cloth suggests that time can be remembered materially. A garment may record relationships with seasons, work and celebrations without relying on a written diary, although its meanings still depend on people able to interpret it.",
  "Tourism has created opportunities but also changed production and demand. Admiring a textile without asking how its makers live and who benefits from sales would leave out part of the story."
 ],"Objects can hold a community's sense of time, but their meaning changes with the conditions of their production.","What item in your home tells a story about how your family or community marks time?","https://ich.unesco.org/en/RL/taquile-and-its-textile-art-00166","Puno"),
 article("tango-argentina","ARG","Tango in Buenos Aires: a dance born from crossings","Migration & identity","Buenos Aires, Argentina",[
  "UNESCO describes tango as a shared heritage of Argentina and Uruguay that developed around Buenos Aires and Montevideo. Its musical, poetic and dance forms emerged from encounters among immigrant, Afro-descendant and local communities.",
  "Tango invites a question about identity: what later seems like an established tradition may originally have grown from people negotiating difference in a changing city. Shared forms do not require everyone to begin with the same history.",
  "Reducing tango to a romantic couple or to one country's exclusive invention would hide its cross-border roots and range of practitioners. The social history is as important as the famous stage image."
 ],"Some of the most recognisable cultural forms emerge through contact and exchange rather than isolation.","What part of your identity was shaped by people or places that were not originally your own?","https://ich.unesco.org/en/RL/tango-00258","Buenos Aires"),
 article("tango-uruguay","URY","Tango in Montevideo: heritage does not stop at borders","Shared heritage & belonging","Montevideo, Uruguay",[
  "Montevideo is one of the two cities UNESCO identifies with tango's formation, alongside Buenos Aires. The tradition includes singers, musicians, dancers, teachers and social venues that preserve and continually adapt its music and movement.",
  "A national map might invite us to give tango one fixed address. Its history makes that difficult: communities and creative practices often travel between ports, neighbourhoods and borders, and are reshaped by those journeys.",
  "Recognising a shared Argentine–Uruguayan heritage does not make the two cities interchangeable. Each has its own practitioners and stories. Cultural comparison works best when it makes room for shared origins and local differences at once."
 ],"Borders can help us organise geography without neatly containing the histories of cultural practices.","What tradition feels like home to people in more than one place?","https://ich.unesco.org/en/RL/tango-00258","Montevideo"),
 article("joumou","HTI","Joumou soup: how a meal remembers freedom","History & dignity","Haiti",[
  "Joumou soup is prepared and shared for Haitian Independence Day on the first of January. UNESCO describes how a dish once associated with exclusion under slavery became a symbol of freedom, dignity and collective history.",
  "Food can be a way of telling a historical story without giving a speech. Making and sharing a meal may connect ordinary care with remembrance of political struggle, though people's personal experiences of the occasion are not all identical.",
  "The soup is not simply a comforting recipe detached from history. Its meaning depends partly on who was denied it, who reclaimed it and who does the work of preparing it today. Celebration and unequal labour can coexist."
 ],"The meaning of an ordinary object can change when people reclaim it in the context of a larger history.","What food or object reminds you of a struggle or change that matters to your community?","https://ich.unesco.org/en/RL/joumou-soup-01853"),
 article("mariachi","MEX","Mariachi: carrying a place through song","Home & belonging","Communities in Mexico",[
  "UNESCO describes mariachi as a musical practice with string instruments, singing and, in many modern ensembles, trumpets. Its repertoire includes songs of home, love, landscapes and history, learned by ear and through performance.",
  "A familiar song can connect a listener to a hometown or community even when they are far away. That possibility is about remembered meaning rather than proof that all listeners feel nostalgia or belonging in the same way.",
  "Mariachi is not one fixed sound or an expression of every Mexican person's identity. It has changed across generations, regions and audiences, and those changes are part of its living cultural history."
 ],"Belonging may be carried through sound and shared memory, not just through a permanent location.","What song makes you remember a person or place when you are somewhere else?","https://ich.unesco.org/en/RL/mariachi-string-music-song-and-trumpet-00575"),
 article("frevo","BRA","Frevo: a city turns movement into invention","Creativity & collective life","Recife, Pernambuco, Brazil",[
  "Frevo blends fast-paced music and dance, particularly during carnival in Recife. UNESCO describes a lively artistic form shaped by marching bands, other musical influences and movement histories connected to capoeira.",
  "Public celebration can make creativity visible in the body of a city: musicians, dancers, associations and craftspeople contribute to an event that no single performer owns. That is a useful image of collective creation, not a tested psychological outcome.",
  "Frevo should not be treated as a generic invitation to dance stress away. Its distinctive history, religious associations and communities of practitioners deserve attention, as do the institutions that help them teach younger generations."
 ],"Collective creativity depends on networks of people and histories that an audience may never see.","What public celebration reveals the creativity of people usually overlooked?","https://ich.unesco.org/en/RL/frevo-performing-arts-of-the-carnival-of-recife-00603","Pernambuco"),
 article("gaelic-stories","GBR","Scottish Gaelic stories: whose voices become the archive?","Language & memory","Gaelic-speaking communities, Scotland",[
  "The National Library of Scotland documents the collecting of Gaelic folktales by John Francis Campbell and his collaborators. The records include differing versions, storytellers' names and the places in which stories were heard.",
  "An oral story is never merely information waiting to be written down. It is also a relationship between narrator, listener, language and place. Preserving a text can protect some knowledge while changing the way it is encountered.",
  "Gaelic-speaking communities are diverse, and Scotland cannot be represented by one language or one historical experience. The wider question is whose voices become authoritative when institutions create an archive."
 ],"Collecting stories can preserve memory while also changing who controls and interprets it.","Whose story would you want recorded in their own words?","https://www.nls.uk/collections/stories/literature-and-poetry/john-francis-campbell-of-islay/","Scotland"),
 article("cornish-language","GBR","Kernewek: what happens when a language is recognised?","Language & recognition","Cornwall, England",[
  "Cornwall Council describes the Cornish language, Kernewek, as a living focus of language development and cultural identity. Cornish received stronger recognition under the European Charter for Regional or Minority Languages in 2025, following earlier protections.",
  "Recognition can change the social conditions in which people learn, speak and encounter a language. A public sign or community class may make a formerly marginalised identity more visible, though formal status alone does not guarantee everyday use.",
  "Cornish identity is not a single opinion, accent or ancestry test. The question is how institutions, teachers and families create genuine opportunities for those who want to participate, without requiring everyone to do so."
 ],"A language's future depends not only on personal pride, but also on public opportunities to use it.","What would make a local language or dialect feel welcome in your everyday surroundings?","https://www.cornwall.gov.uk/parks-leisure-and-culture/the-cornish-language/cornish-language-programme/","Cornwall"),
 article("welsh-eisteddfod","GBR","The Eisteddfod: when language becomes a public stage","Collective identity & expression","Wales, United Kingdom",[
  "The Welsh Government marks the Eisteddfod's long history from a gathering of poets and musicians at Cardigan Castle in 1176. Contemporary Eisteddfod events bring Welsh-language arts, competitions and community participation into public view.",
  "A language is not only a tool for exchanging information. It may carry humour, artistry and forms of belonging that become easier to sustain when people have places to hear and create in it.",
  "Celebration is not the same as guaranteed linguistic equality. Access, education, funding and the experience of learners can all shape who feels able to take part, and who remains outside the event."
 ],"Cultural participation depends on the institutions and invitations that make expression possible.","What kind of public event would help a language or local art form feel like it belongs to everyone interested?","https://www.gov.wales/celebrating-850-years-eisteddfod-and-inspiring-new-audiences","Wales"),
 article("cherokee-language","USA","Cherokee language learning: survival takes infrastructure","Language & self-determination","Cherokee Nation, Oklahoma, United States",[
  "The Cherokee Nation Language Department describes immersion schooling, community and online classes, a master-apprentice programme and technology work intended to increase everyday Cherokee language use.",
  "Language revitalisation is sometimes framed as a matter of individuals caring enough. The department's programmes show why that is incomplete: teachers, school places, resources, technology and sustained governance all help make learning feasible.",
  "Cherokee Nation is a sovereign tribal nation, not a cultural subdivision of Oklahoma or a label for all Indigenous peoples in the United States. Its own priorities and public programmes should lead the description."
 ],"Cultural continuity can depend on collective institutions and self-determination as much as personal motivation.","What knowledge would be harder to pass on without schools, teachers or community institutions?","https://umbraco.cherokee.org/all-services/language-department/","Oklahoma"),
 article("new-orleans-jazz","USA","New Orleans jazz: creativity at the crossroads","Migration & social history","New Orleans, Louisiana, United States",[
  "The US National Park Service traces New Orleans jazz through interactions among African American musical traditions and many other communities, in neighbourhoods, parades, clubs and changing commercial settings.",
  "A familiar musical style may sound like the achievement of exceptional individuals, but its emergence also depends on who lived together, where performers could work and what sounds were shared or excluded.",
  "Stories of creative exchange need to keep segregation, inequality and African American contributions in view. Celebrating innovation without those social conditions would turn a complex history into a cheerful but incomplete legend."
 ],"Artistic innovation may emerge from encounters shaped by unequal power as well as shared curiosity.","Where does a celebrated art form hide the difficult conditions under which it developed?","https://www.nps.gov/jazz/learn/historyculture/index.htm","Louisiana"),
 article("budj-bim","AUS","Budj Bim: an engineering map made over generations","Ecology & knowledge","Gunditjmara Country, Victoria, Australia",[
  "UNESCO documents the Budj Bim Cultural Landscape on Gunditjmara Country in south-eastern Australia. Its channels, weirs and ponds formed an extensive aquaculture system for harvesting kooyang, or short-finned eel.",
  "The site challenges a narrow idea that sophisticated knowledge must be written, recent or formally credentialled. Environmental observation, engineering and intergenerational teaching can be visible in a landscape itself.",
  "This remains a living Gunditjmara cultural landscape, not a generic lesson about all Aboriginal Australians. The rights and knowledge of Traditional Owners matter when the place is described, managed or visited."
 ],"Expertise can be embedded in land, ecological relationships and the work of successive generations.","What landscape near you contains evidence of knowledge that ordinary maps tend to ignore?","https://whc.unesco.org/en/list/1577/","Victoria"),
 article("matariki","NZL","Matariki: a new year for memory and renewal","Time & belonging","Māori communities across Aotearoa New Zealand",[
  "The New Zealand Government describes Matariki as a public holiday created to recognise the Māori New Year, with remembrance of people who have died, gratitude for the present and planning for the future among its public themes.",
  "Calendars can give communities permission to stop and pay attention to things that are otherwise crowded out. Remembrance and anticipation can coexist in the same occasion without being reduced to a universal wellbeing exercise.",
  "Māori knowledge is not one uniform set of customs. Local iwi and hapū traditions differ, and public recognition should not override the authority of the people who maintain those understandings."
 ],"A calendar can organise collective attention, but the meanings of an occasion belong to participating communities.","What annual ritual gives you space to remember, appreciate and decide what comes next?","https://www.mbie.govt.nz/business-and-employment/employment-and-skills/employment-legislation-reviews/matariki/matariki-public-holiday"),
 article("vanuatu-sand","VUT","Vanuatu sand drawing: a line can hold a library","Knowledge & interpretation","Central and northern Vanuatu",[
  "UNESCO describes sand drawings made in a continuous movement on sand, ash or clay in parts of Vanuatu. Patterns may carry information about stories, kinship, rituals and practical knowledge among communities speaking different languages.",
  "The visible shape can look simple to someone unfamiliar with its conventions, yet the maker and audience may recognise layers of instruction, history and communication. Meaning does not reside in the lines alone.",
  "The tradition includes knowledge that may be sacred or restricted. Treating every drawing as public decoration or copying unfamiliar designs can erase the role of expert practitioners and community decisions about sharing."
 ],"A visible pattern can contain knowledge whose meaning depends on relationships and rules of interpretation.","Where have you mistaken an unfamiliar form of knowledge for something merely decorative?","https://ich.unesco.org/en/RL/vanuatu-sand-drawings-00073"),
 article("tonga-lakalaka","TON","Lakalaka: a celebration made through coordinated voices","Collective expression","Communities across Tonga",[
  "Lakalaka combines dance, sung speech and carefully organised group performance in Tonga. UNESCO documents its importance at public events, including commemorations and major celebrations.",
  "The performance makes coordination visible, yet its significance cannot be reduced to the claim that group exercise creates happiness. Poetry, movement, community roles and knowledge of the occasion all contribute to how people understand it.",
  "Participation takes place in real social settings that include status and responsibility as well as solidarity. A careful reading can admire the artistry without pretending that every community member has the same experience."
 ],"Shared performance can communicate public meanings while leaving room for differences in individual experience.","When does participating in something together feel different from watching it alone?","https://ich.unesco.org/en/RL/lakalaka-dances-and-sung-speeches-of-tonga-00072"),
 article("ebru","TUR","Ebru marbling: learning to work with uncertainty","Craft & attention","Communities of ebru makers in Türkiye",[
  "UNESCO describes ebru as a craft in which pigments are moved across a prepared liquid surface before patterns are transferred to paper. Apprentices learn techniques and judgement through sustained guidance from skilled practitioners.",
  "Because the material responds to movement, learning demands attention to what the process actually does rather than complete control over a fixed outcome. That is a useful analogy for experimentation, not evidence of a clinical treatment.",
  "Ebru belongs to particular artistic histories and communities. The patterns and practices should not be separated from the people who teach, adapt and sustain them."
 ],"Good craft involves deliberate technique and responsiveness to conditions that cannot be controlled perfectly.","What activity has taught you to adjust your approach instead of forcing an exact result?","https://ich.unesco.org/en/RL/ebru-turkish-art-of-marbling-00644"),
 article("dutch-millers","NLD","Dutch millers: a machine still needs a community","Technology & apprenticeship","Windmill and watermill communities, Netherlands",[
  "UNESCO describes millers who keep windmills and watermills operating through practical knowledge of weather, machinery, repair and safety. Volunteer guilds and instructors have helped maintain these skills as commercial milling has changed.",
  "Technology is often described as the replacement of human knowledge. This craft shows a different relationship: a machine can make skilled observation and collective teaching more important, not less.",
  "Preserving a landmark without the ability to operate it would save a visible structure but lose part of its living history. Safeguarding therefore concerns people, training and resources as well as buildings."
 ],"An invention's cultural life may depend on skills and relationships hidden behind the machine.","What useful knowledge in your community would disappear if only the object survived?","https://ich.unesco.org/en/RL/craft-of-the-miller-operating-windmills-and-watermills-01265"),
 article("tahteeb","EGY","Tahteeb: the rules that turn competition into a game","Rules & respect","Upper Egypt",[
  "UNESCO describes tahteeb as a festive stick game with historical links to martial practice in Egypt. Modern participants demonstrate control and skill within conventions that prohibit striking, while musicians and audiences shape the occasion.",
  "The same movement can mean aggression in one setting and a controlled performance in another. The social rules, permissions and risks make an enormous difference to the meaning of a behaviour.",
  "This does not mean violence can be explained away as play. The important distinction is whether participants share the rules, can act safely and understand the activity's particular history."
 ],"Behaviour gains meaning from rules, intentions and the social setting, not from its appearance alone.","When has understanding the rules changed how you interpreted someone's behaviour?","https://ich.unesco.org/en/RL/tahteeb-stick-game-01189"),
 article("barranquilla","COL","Barranquilla Carnival: who gets to tell the public story?","Humour & power","Barranquilla, Atlántico, Colombia",[
  "UNESCO describes Barranquilla Carnival as a meeting place of African, Indigenous and European musical and dance histories, with costumes, performances and satire of public affairs.",
  "Humour can make political criticism more visible and accessible, but it does not erase inequalities between performers, organisers and audiences. An event's reach can increase while some contributors gain less recognition.",
  "Commercialisation may support livelihoods and also change which expressions receive attention. Both possibilities matter: protecting culture is not simply a choice between keeping it frozen and letting the market decide everything."
 ],"Public celebration can preserve collective creativity while also exposing tensions over recognition and resources.","What does a joke or performance allow people to say that ordinary public speech might discourage?","https://ich.unesco.org/en/RL/carnival-of-barranquilla-00051","Atlántico"),
 article("qoylluriti","PER","Qoyllurit’i: pilgrimage across different worlds of meaning","Faith & community","Cusco region, Peru",[
  "UNESCO describes the pilgrimage to the sanctuary of the Lord of Qoyllurit’i as bringing together Catholic traditions, older Andean sacred understandings, processions and dances performed by communities from different places.",
  "The gathering challenges an easy division between religious belief, landscape and social relationships. For participants, physical journeys and shared actions can be tied to histories and meanings that cannot be captured by an outsider's single explanation.",
  "A pilgrimage is not automatically a therapeutic practice. Large gatherings also involve organisation, travel and material demands, while people can take part for different reasons."
 ],"One practice may contain spiritual, social and geographical meanings that should not be forced into a single category.","When have different beliefs or traditions met in a place that mattered to you?","https://ich.unesco.org/en/RL/pilgrimage-to-the-sanctuary-of-the-lord-of-qoylluriti-00567","Cusco"),
 article("mauritian-sega","MUS","Sega tipik: whose history is heard in a dance?","Memory & expression","Creole communities, Mauritius",[
  "UNESCO identifies traditional Mauritian sega as a performing art associated particularly with the Creole community. Singing, instruments and movement connect informal family occasions with public performance and cultural history.",
  "A performance can carry experiences of hardship and continuity without every song expressing the same emotion. The psychological invitation is to ask how art creates space for a voice that might be overlooked elsewhere.",
  "Treating sega as simply an island entertainment would miss the people and histories behind it. Public recognition creates opportunities, but the conditions of transmission and ownership still matter."
 ],"Cultural expressions can hold social memory without reducing their practitioners to that history.","What music or performance makes you curious about the lives of the people who created it?","https://ich.unesco.org/en/RL/traditional-mauritian-sega-01003"),
 article("kankurang-senegal","SEN","Kankurang: initiation and the authority to interpret","Social roles & continuity","Manding communities, Senegal",[
  "UNESCO records the Kankurang as an initiatory rite practised in Manding communities across parts of Senegal and The Gambia. It combines distinctive masked appearances, community roles and knowledge transmitted within particular social settings.",
  "A public observer may see spectacle; participants may understand responsibilities and spiritual meanings governed by rules about who may know and do what. Those differences warn against assuming every visible symbol is available for outside reinterpretation.",
  "UNESCO also records pressures on sacred spaces and transmission. The practice raises serious questions about rights, safeguarding and changing norms, rather than offering a template to imitate."
 ],"Understanding a ritual requires attention to its custodians, social rules and contested changes.","When should curiosity give way to respect for a community's decision not to share everything?","https://ich.unesco.org/en/RL/kankurang-manding-initiatory-rite-00143","Casamance"),
 article("kankurang-gambia","GMB","Kankurang across a border: a shared Manding heritage","Belonging & borders","Manding communities, The Gambia",[
  "The Kankurang tradition is documented by UNESCO as shared between Manding communities in The Gambia and Senegal. Its stories and practices do not stop neatly at the modern national boundary.",
  "The example shows why cultural maps and political maps answer different questions. A border may organise government, but kinship, language and ritual histories can follow other routes.",
  "Recognising shared heritage should not suggest that all Manding communities practise the rite identically. Particular custodians, restrictions and local histories determine how it is maintained."
 ],"The lived geography of culture can cross the lines used to draw a state.","What part of your family's story crosses a border that a map treats as decisive?","https://ich.unesco.org/en/RL/kankurang-manding-initiatory-rite-00143"),
 article("mongolian-calligraphy","MNG","Mongolian calligraphy: when a writing system needs teachers","Language & apprenticeship","Mongolia",[
  "UNESCO describes calligraphy in the classical Mongolian script as a demanding artistic practice transmitted through long periods of mentoring. Letters and strokes are used in invitations, correspondence and other forms of public and private writing.",
  "A script can carry practical communication and identity at the same time. Continuing a demanding craft requires more than admiration for its beauty: people need teachers, time and opportunities to practise.",
  "UNESCO has flagged threats to transmission associated with rapid social change and training costs. The lesson is not that modern life is inherently destructive, but that valued skills require deliberate institutional support."
 ],"Cultural preservation is practical work: an admired symbol still needs someone able to teach it.","What skill would you want to pass on, and what resources would make teaching it realistic?","https://ich.unesco.org/en/USL/mongolian-calligraphy-00873"),
 article("belgian-beer","BEL","Belgian brewing: expertise behind a familiar social ritual","Craft & moderation","Brewing communities, Belgium",[
  "UNESCO documents a wide range of brewing knowledge and social practices in Belgium, including specialist makers, community gatherings and education in the craft.",
  "It is easy to read a drink simply as consumption while overlooking agriculture, work, knowledge and social customs. Recognising those layers does not mean overlooking the health risks of alcohol or suggesting that drinking is needed for belonging.",
  "The practice also changes with entrepreneurship, environmental concerns and public health. A cultural tradition can be understood seriously without romanticising every part of it."
 ],"Appreciating craft and cultural meaning does not require overlooking a practice's costs or risks.","How could people preserve a gathering's social value without depending on the substance traditionally served?","https://ich.unesco.org/en/RL/beer-culture-in-belgium-01062"),
 article("kabuki","JPN","Kabuki: the theatre that makes roles visible","Identity & performance","Japanese theatre communities",[
  "UNESCO traces kabuki theatre to Japan's Edo period and describes its stylised roles, performance conventions, costumes and theatrical devices. The practice has changed with its audiences and social status over several centuries.",
  "On a stage, a character is created through gestures and agreed conventions that an audience learns to read. That offers a way to question how we interpret roles, without claiming everyday identity is merely acting.",
  "Gendered casting and historical changes in access also matter. A cultural form can be admired for its artistry while its social conventions remain open to historical analysis and discussion."
 ],"A role can be socially learned and artistically powerful without describing every person outside the stage.","What familiar social role feels natural until you notice the conventions that sustain it?","https://ich.unesco.org/en/RL/kabuki-theatre-00163"),
 article('turkish-coffee','TUR','Turkish coffee: hospitality with time to talk','Hospitality & attention','Coffee-house and family traditions in Türkiye',[
  'UNESCO describes Turkish coffee as a preparation tradition and a social setting: people meet over small cups to talk, share news and take part in family and ceremonial occasions.',
  'Psychologically, hospitality is a structured invitation to connect. The host offers a shared object and a familiar sequence; that can lower the effort of beginning a conversation and create room for everyday concerns.',
  'This is a lens on one living tradition, not a claim that all Turkish people drink coffee or that coffee itself improves wellbeing. The social value can be considered separately from the beverage.'
 ],'Connection can be supported by a repeated welcome and time set aside for conversation.','What small, familiar gesture helps people feel there is room to talk?','https://ich.unesco.org/en/RL/turkish-coffee-culture-and-tradition-00645'),
 article('mahadra','MRT','Mahadra: learning held together by trust','Learning & community','Mauritanian community learning circles',[
  'UNESCO describes the mahadra as a community system for passing on traditional knowledge and oral expression. Its teaching relationship is based on commitment and trust between teachers and students.',
  'Psychologically, learning depends on more than information transfer. A dependable relationship can make it easier to ask questions, practise publicly and accept correction without treating a mistake as rejection.',
  'The mahadra has its own religious and social setting. This example invites reflection on trust in learning, not a claim that one educational model suits every learner.'
 ],'Trust and belonging can be part of the conditions that make sustained learning possible.','What helps you feel safe enough to be a beginner?','https://ich.unesco.org/en/RL/mahadra-a-community-system-for-transmission-of-traditional-knowledge-and-oral-expressions-01960'),
 article('xeer-ciise-djibouti','DJI','Xeer Ciise: community rules that make repair imaginable','Justice & reconciliation','Somali-Issa communities of Djibouti',[
  'Xeer Ciise is an oral customary legal system practised by Somali-Issa communities across the Horn of Africa. UNESCO describes rules for governance and social conduct, including a justice approach centred on reconciliation and compensation.',
  'Psychologically, repair changes the question after harm from “Who is the bad person?” to “What happened, who was affected, and what could restore safety or balance?” A shared process can make accountability more concrete than private intention alone.',
  'This is a specific customary system with its own authority and history. It should not be treated as a template for every community or as a substitute for protections against coercion and abuse.'
 ],'Accountability can include both naming harm and organising a path toward repair.','What would make an apology or repair feel real to the person affected?','https://ich.unesco.org/en/RL/xeer-ciise-oral-customary-laws-of-somali-issa-communities-in-ethiopia-djibouti-and-somalia-02087'),
 article('xeer-ciise-somalia','SOM','Xeer Ciise: belonging through shared responsibility','Belonging & social conduct','Somali-Issa communities of Somalia',[
  'Xeer Ciise is an oral customary legal system maintained among Somali-Issa communities in Somalia, Djibouti and Ethiopia. UNESCO describes it as a framework for governance, community justice and shared social principles.',
  'Psychologically, belonging is not only a feeling of closeness; it can also be a set of responsibilities people expect one another to uphold. Shared rules make those expectations visible and give a community language for addressing breaches.',
  'The system belongs to Somali-Issa communities and has internal complexity. Describing its social function does not imply that all members agree or that customary authority is automatically fair in every case.'
 ],'Shared expectations can turn belonging into practical obligations, while accountability remains open to scrutiny.','Which shared responsibilities make a group feel dependable to you?','https://ich.unesco.org/en/RL/xeer-ciise-oral-customary-laws-of-somali-issa-communities-in-ethiopia-djibouti-and-somalia-02087'),
 article('gada','ETH','The Gada system: rotating responsibility and public accountability','Governance & responsibility','Oromo communities in Ethiopia',[
  'The Gada system is an Indigenous Oromo system of governance organised around age-sets and changing periods of responsibility. UNESCO records its political, social and cultural roles, including ways of teaching norms and resolving disputes.',
  'Psychologically, rotating roles can distribute responsibility across a life course instead of locating authority permanently in one person. Public expectations and shared procedures also make leadership answerable to a wider group.',
  'Gada is a living Oromo institution with histories and practices that vary. This discussion focuses on how roles and accountability are organised, not on treating the system as an ideal or universal model.'
 ],'Clear roles and reviewable authority can shape how a group understands responsibility.','Where would a shared process make leadership or decision-making more accountable?','https://ich.unesco.org/en/RL/gada-system-an-indigenous-democratic-socio-political-system-of-the-oromo-01164'),
 article('ngondo','CMR','Ngondo: a shared ritual for carrying community concerns','Ritual & collective voice','Sawa communities around the Wouri River, Cameroon',[
  'Ngondo is an annual tradition among Sawa communities in Cameroon, combining public festivities with sacred practices around the Wouri River. UNESCO describes a ritual in which community wishes and grievances are carried in a canoe and a message is later shared.',
  'Psychologically, a collective ritual can give private worries a public form. Naming concerns through an agreed sequence may help people recognise that uncertainty is shared, and that the group has a way to attend to it.',
  'Ngondo is a sacred Sawa tradition, not a general-purpose wellbeing exercise. Its meaning rests with the communities who practise and transmit it.'
 ],'Shared rituals can make collective concerns speakable without making them identical.','How could a group make space for concerns that are usually carried alone?','https://ich.unesco.org/en/RL/ngondo-worship-of-water-oracles-and-associated-cultural-traditions-among-the-sawa-02140'),
 article('nguon','CMR','Nguon: a tradition that makes power answer questions','Accountability & voice','Bamoun community, Cameroon',[
  'Nguon is a Bamoun tradition involving a relationship between the monarch and the community. UNESCO describes a process in which community views are gathered, grievances are presented publicly and governance is discussed.',
  'Psychologically, voice matters when people can see how feedback travels into a decision. A formal route for criticism can reduce the burden on individuals to challenge authority alone and can communicate that disagreement has a place.',
  'Nguon has a specific Bamoun history and ritual structure. It is not evidence that every public hearing is safe or that traditional authority is always accountable.'
 ],'A visible route from feedback to response can make participation feel consequential.','When you raise a concern, what would help you know it was genuinely heard?','https://ich.unesco.org/en/RL/nguon-rituals-of-governance-and-associated-expressions-in-the-bamoun-community-01955'),
 article('mvet-oyeng','CMR','Mvet Oyeng: an epic learned in company','Storytelling & shared memory','Ekang communities in Central Africa',[
  'Mvet Oyeng brings together epic singing, dance and a string instrument among Ekang communities. UNESCO describes stories passed on informally through ritual and hands-on learning.',
  'Psychologically, a shared story can act as a memory structure: listeners meet characters, choices and consequences together, then use them to discuss what matters. Learning the performance also links knowledge to relationships, not only to a written text.',
  'The stories belong to the communities who carry them. This reflection is about storytelling and memory, not a claim that one narrative represents every Ekang person.'
 ],'Stories can help a community remember and interpret experience together.','Which story has helped you think through a difficult choice?','https://ich.unesco.org/en/RL/mvet-oyeng-musical-art-practices-and-skills-associated-with-the-ekang-community-02253'),
 article('mwazindika','KEN','Mwazindika: dance, story and communal wellbeing','Movement & shared meaning','Daida community, Kenya',[
  'Mwazindika is a spiritual dance of the Daida community in Kenya, combining music, movement, ritual and storytelling at important moments, including rites of passage and times of crisis. UNESCO records that practitioners understand it as supporting physical, mental and spiritual wellbeing.',
  'Psychologically, coordinated movement and rhythm can organise attention and provide a shared way to express what is difficult to say directly. In this tradition, those actions sit inside relationships with elders, ancestors and community history.',
  'The practice is specifically Daida and spiritual. The atlas describes what its custodians say it means; it does not turn the dance into a clinical technique or invite outsiders to copy sacred elements.'
 ],'Movement can carry meaning and emotion within a community’s own spiritual framework.','What forms of expression help you feel accompanied during a difficult time?','https://ich.unesco.org/en/USL/mwazindika-spiritual-dance-of-the-daida-community-of-kenya-02297'),
 article('xoe','VNM','Xòe dance: learning harmony by moving together','Coordination & belonging','Tai communities of north-west Viet Nam',[
  'Xòe is a dance practised by Tai communities in north-west Viet Nam at rituals, weddings, festivals and other gatherings. UNESCO describes circle dances in which people hold hands and move in time, expressing wishes for health and harmony.',
  'Psychologically, synchronised action can make cooperation tangible: each person adjusts to the shared rhythm and to the person beside them. The circle offers a physical model of participation in which no single dancer has to carry the whole performance.',
  'Xòe includes distinct forms and meanings. The psychological idea concerns this described practice; it should not be turned into a claim about the personality of Tai people or all Vietnamese communities.'
 ],'Shared rhythm can make mutual adjustment visible and felt.','What activity helps you experience cooperation rather than only talk about it?','https://ich.unesco.org/en/RL/art-of-xoe-dance-of-the-tai-people-in-viet-nam-01575'),
 article('compas','HTI','Compas: music as a place to meet and express','Expression & social connection','Haitian music and dance communities',[
  'Compas is a Haitian music and dance genre whose lyrics and performances address themes including love, freedom, peace and resistance. UNESCO describes it as bringing together people across generations and backgrounds.',
  'Psychologically, music gives emotion a shared rhythm and language. Dancing also coordinates attention between people, creating a form of connection that does not depend on lengthy explanation or identical experiences.',
  'Compas is a living Haitian art form with varied practitioners. Its value is not reducible to a mental-health effect, and no single performance speaks for every Haitian listener.'
 ],'Shared art can help people express emotion and recognise one another.','What song has helped you feel connected to people whose experiences differ from yours?','https://ich.unesco.org/en/RL/the-compas-of-haiti-02273'),
 article('palenque-kuagro','COL','Kuagro: friendship organised as mutual responsibility','Friendship & solidarity','Palenque de San Basilio, Colombia',[
  'In the cultural space of Palenque de San Basilio, kuagro are age-group networks with shared rights and duties. UNESCO describes members working together in daily life and at important events.',
  'Psychologically, friendship becomes more dependable when care is expressed through actions and recognised responsibilities. A network can spread practical support across several relationships rather than expecting one person to meet every need.',
  'Kuagro belongs to the history and social organisation of Palenque de San Basilio. It is not a model to extract from its context or a claim that all friendship networks work the same way.'
 ],'Reliable relationships often combine affection with practical, shared responsibility.','What kind of support would you like your friendships to include more often?','https://ich.unesco.org/en/RL/cultural-space-of-palenque-de-san-basilio-00102'),
 article('washi','JPN','Washi: patient craft and the value of guided practice','Attention & apprenticeship','Washi-making communities in Japan',[
  'Washi is handmade Japanese paper made from plant fibres through a sequence of preparation and forming. UNESCO describes skills passed through craft families, preservation groups and local teaching.',
  'Psychologically, apprenticeship turns a complex skill into observable steps. A learner can watch, try, receive feedback and gradually take on responsibility, which gives progress a shape beyond “be good at this now.”',
  'Washi is a living craft with different makers and settings. This lesson concerns how knowledge can be transmitted through practice; it is not a claim that every person learns best in the same way.'
 ],'Breaking a skill into visible steps can make learning and feedback easier to bear.','What complex task could you approach through watching, trying and adjusting?','https://ich.unesco.org/en/RL/washi-craftsmanship-of-traditional-japanese-hand-made-paper-02291'),
 article('gusle','SRB','Gusle singing: memory performed with an audience','Historical memory & identity','Serbian gusle communities',[
  'Gusle singers perform epic poetry with a single-string instrument. UNESCO describes the practice as a form of historical memory and notes that audiences and performers shape the telling together.',
  'Psychologically, remembering is not only retrieving facts; stories organise events into meaning. A live audience also signals which details matter, keeping memory social and open to interpretation.',
  'Epic performance is not a neutral record of all history. The stories and their meanings need to be understood in their historical setting and alongside other accounts.'
 ],'Stories can preserve memory while also shaping how a community interprets it.','Whose stories are central to the history you were taught, and whose are missing?','https://ich.unesco.org/en/RL/singing-to-the-accompaniment-of-the-gusle-01377'),
 article('khoomei','MNG','Khoomei: listening as a relationship with place','Attention & environment','Mongolian throat-singing traditions',[
  'Khoomei is a Mongolian style of singing in which one performer creates several simultaneous tones. UNESCO describes songs connected with ritual, respect for the natural world, ancestors and cultural identity.',
  'Psychologically, attentive listening can change what stands out in an environment. The practice invites a relationship with place in which sound is not background but something to notice, learn and respond to.',
  'Khoomei has specific musical and cultural lineages. This reflection does not treat it as a generic mindfulness method or suggest that one sound carries the same meaning for every listener.'
 ],'Attention can be trained through a tradition’s own ways of listening to place.','What changes when you listen to a familiar place as if it had something to teach you?','https://ich.unesco.org/en/RL/mongolian-art-of-singing-khoomei-00210'),
 article('sebeiba','DZA','Sebeïba: turning rivalry into shared performance','Conflict & social repair','Tuareg communities of Djanet, Algeria',[
  'Sebeïba is an annual ritual and ceremony practised in Djanet, Algeria. UNESCO describes two communities preparing and performing together in a tradition that includes music, dance and ceremonial dress.',
  'Psychologically, a shared performance can give tension boundaries: people meet through agreed roles, rules and timing. It offers a way to recognise difference while creating a common event that neither group can stage alone.',
  'Sebeïba is a specific Tuareg tradition with sacred and local meaning. It should not be reduced to a general conflict-resolution exercise or copied without the community’s consent.'
 ],'Shared rules can create a setting where groups encounter one another without erasing difference.','What kind of shared activity might make cooperation possible when trust is low?','https://ich.unesco.org/en/RL/ritual-and-ceremonies-of-sebeiba-in-the-oasis-of-djanet-algeria-00665'),
 article('khidr-feast','IRQ','The Khidr Elias feast: vows, food and shared belonging','Ritual & social ties','Central Iraq, communities along the Tigris',[
  'The Khidr Elias feast brings people together in a religious tradition that includes vows, shared food and dance. UNESCO documents the practice among communities along the Tigris in central Iraq.',
  'A shared ritual connects personal commitments with group recognition. People make vows in a setting where others can witness them, and shared food creates time for those commitments to be discussed and remembered.',
  'The feast’s religious meanings belong to the communities who practise it. This account follows the local description of the event and its social setting.'
 ],'The feast gives personal commitments a social setting and shared memory.','Which hopes or commitments would you want trusted people to witness?','https://ich.unesco.org/en/RL/khidr-elias-feast-and-its-vows-01159'),
 article('visoko-singing','BGR','Visoko singing: a voice learned in a village choir','Identity & group learning','Dolen and Satovcha, Bulgaria',[
  'Visoko multipart singing is a vocal tradition maintained by singing groups in the Bulgarian villages of Dolen and Satovcha. UNESCO describes it as an important marker of local identity.',
  'Psychologically, group singing requires listening and adjustment: each voice contributes while responding to others. Repeated practice can turn membership into a skill people enact together, rather than an abstract label.',
  'The form belongs to specific villages and performers. This is a reflection on shared practice and identity, not a claim that all Bulgarians sing this way or experience belonging identically.'
 ],'Group performance can make mutual listening part of how identity is practised.','Where do you feel you belong because of something you do together?','https://ich.unesco.org/en/RL/visoko-multipart-singing-from-dolen-and-satovcha-south-western-bulgaria-00967'),
 article('xooy','SEN','Xooy: gathering to face uncertainty together','Uncertainty & shared interpretation','Serer community in Senegal',[
  'Xooy is a nocturnal divination ceremony among Serer communities in Senegal, held before the rainy season. UNESCO describes seers addressing community concerns such as rain, illness and harvest through a public gathering of stories, songs and interpretation.',
  'Psychologically, uncertainty can feel less isolating when a group gives it a shared language. A ceremony can organise attention around common concerns, even though its spiritual explanations differ from psychological science.',
  'Xooy is a Serer spiritual practice, not a forecasting method endorsed by this atlas. Its meaning should be described through its custodians rather than translated into a clinical technique.'
 ],'Communities develop different ways to face uncertainty and make shared concerns visible.','When uncertainty is shared, what helps a group respond without pretending to know everything?','https://ich.unesco.org/en/RL/xooy-a-divination-ceremony-among-the-serer-of-senegal-00878'),
 article('joking-relationships','NER','Joking relationships: humour with duties attached','Humour & reconciliation','Ethnolinguistic communities in Niger',[
  'UNESCO describes joking relationships in Niger as playful exchanges between people from particular communities. The practice can include obligations to tell the truth, offer help and settle disputes peacefully.',
  'Psychologically, humour can soften a difficult conversation when people share trust and understand the boundaries. Here it is not only a joke: the relationship also carries expectations of honesty, assistance and repair.',
  'These relationships are specific to particular communities and histories. Humour can also harm when consent or trust is absent, so this practice should not be used to excuse teasing or pressure.'
 ],'Humour can support connection when it sits inside trust and mutual responsibility.','When does humour help you say something hard, and when does it shut someone down?','https://ich.unesco.org/en/RL/practices-and-expressions-of-joking-relationships-in-niger-01009'),
 article('guarania','PRY','Guarania: belonging carried in song','Music & shared identity','Paraguay and Paraguayan diaspora',[
  'Guarania is a musical genre from Paraguay that uses the Guarani language and combines Indigenous and popular musical elements. UNESCO describes it as part of family and community life and as a source of belonging for Paraguayans and diaspora communities.',
  'Psychologically, a shared song can link language, emotion and memory. Hearing familiar words and rhythms may make a distant place or relationship feel present, while learning the music gives belonging an active form.',
  'People relate to Guarania in different ways; music does not create one uniform national identity. This story focuses on the connection its practitioners describe between music, language and belonging.'
 ],'Music can connect language and memory with a felt sense of belonging.','What song or sound helps you feel connected to a place or person?','https://ich.unesco.org/en/RL/guarania-sound-of-paraguayan-soul-02128'),
 article('intore','RWA','Intore: discipline, expression and group performance','Movement & collective learning','Rwandan dance troupes',[
  'Intore is a Rwandan dance performed by a troupe. UNESCO describes it as a living performance practice that is taught and sustained by its practitioners.',
  'Psychologically, learning a group performance combines personal expression with attention to other people. Rehearsal can develop timing, confidence and a sense of shared responsibility because each performer’s action changes the whole pattern.',
  'Intore has a particular Rwandan history and cultural meaning. The learning lens here does not claim that every performer has the same experience or that dance is automatically therapeutic.'
 ],'Group performance asks people to balance individual expression with shared timing.','Where do you want to contribute your own style while still working in step with others?','https://ich.unesco.org/en/RL/intore-02129'),
 article('kalela','ZMB','Kalela: learning a dance by watching and joining','Apprenticeship & participation','Luapula Province, Zambia',[
  'Kalela is a dance tradition from Zambia’s Luapula Province, performed at ceremonies, funerals, harvest celebrations and public events. UNESCO describes skills passed on through song, poetry, observation and participation.',
  'Psychologically, observation lowers the cost of trying something unfamiliar: a learner can first notice the pattern, then join with support. Public participation also makes knowledge visible and gives younger people a route into the practice.',
  'Kalela groups and performers sustain the tradition in their own ways. The learning idea is useful to consider without assuming that watching alone is enough or that formal lessons are unnecessary.'
 ],'People can learn by watching, trying, and receiving guidance in a real setting.','What would make it easier for you to join in before you feel fully confident?','https://ich.unesco.org/en/RL/kalela-dance-01698'),
 article('light-rum-masters','CUB','Light rum masters: expertise built over a lifetime','Apprenticeship & responsible practice','Cuban rum-making knowledge',[
  'UNESCO describes the knowledge of Cuba’s light-rum masters as a long apprenticeship involving the history of barrels, ageing cellars and the qualities of different blends. Knowledge passes between generations of specialists.',
  'Psychologically, expertise grows through noticing patterns that beginners cannot yet see. Guided practice and repeated comparison help a learner turn sensations and memories into reliable judgement.',
  'This story is about craft knowledge, not an endorsement of alcohol use. UNESCO notes that the guild advocates responsible consumption; social connection and mastery should never depend on drinking.'
 ],'Expertise develops through careful attention, feedback and accumulated experience.','What skill might improve if you kept a record of what you notice and learn?','https://ich.unesco.org/en/RL/knowledge-of-the-light-rum-masters-01724'),
  article('uae-henna','ARE','Henna in Dubai and the UAE: craft, adornment and the wedding ritual','Ritual & social connection','Dubai, United Arab Emirates, with heritage accounts from Abu Dhabi and Al Ain',[
  'Dubai’s official culture guide describes henna body art as a living part of the city’s beauty culture, while Abu Dhabi’s heritage register preserves older UAE accounts of cultivation, family use and ceremony. Read together, these sources connect present-day Dubai with a wider Emirati practice.',
  'The register names the al-muhannya or al-hannaya, a skilled henna practitioner who prepares paste and decorates hands and feet. In an Al Ain wedding account, the bride’s friends gather to sing and take on responsibilities around her henna ceremony.',
  'The mark stays on the body as the wedding approaches. The ceremony brings a bride, her friends and a practitioner into a shared piece of work, and the changing design gives the transition a visible form.'
 ],'UAE heritage accounts show how adornment can hold skill, recognition and a place in family ceremony.','Which part of preparing for an important change helps you feel accompanied?','https://abudhabiculture.ae/en/cultural-heritage/intangible/heritage-register/social-practices/henna'),
article('henna-rituals',['DZA','BHR','EGY','IRQ','JOR','KWT','MRT','MAR','OMN','PSE','QAT','SAU','SDN','TUN','YEM'],'Henna rituals: adornment, communication and shared care','Ritual & social connection','Communities across North Africa and the Middle East',[
  'Henna is a plant dye made from Lawsonia inermis leaves. UNESCO’s 2024 multinational file documents its cultivation, preparation and use across communities in North Africa and the Middle East, including the United Arab Emirates.',
  'The plant paste becomes a temporary mark on skin, hair or nails. Across the countries in this listing, its preparation, designs and occasions vary; family teaching, music and oral expression are part of the cultural record.',
  'Weddings and births are among the occasions where henna can make a transition visible. The practice connects a material skill with adornment, family memory and the social life around an event.'
 ],'Careful attention to appearance can also be a way of marking relationships and life events.','Which small act of preparation helps you feel seen or supported during an important moment?','https://ich.unesco.org/en/RL/henna-rituals-aesthetic-and-social-practices-02116'),
 article('nowruz','IRN','Nowruz: a new year made through renewal and return','Renewal & continuity','Communities celebrating Nowruz across Central and West Asia',[
  'Nowruz is a spring new-year tradition shared across many countries and communities, with names and customs that vary by language and place. UNESCO describes it as a time associated with renewal, family visits, food and public celebration.',
  'Psychologically, a calendar ritual can make change easier to notice. A shared date offers a prompt to reconnect, remember what has passed and choose what to carry into the next season.',
  'Nowruz is not one uniform celebration, and the meaning of the new year differs among its practitioners. This story treats renewal as a question raised by the tradition, not a fixed belief held by everyone in the region.'
 ],'A shared marker in time can help people reflect, reconnect and begin again.','What would you like to carry forward, and what are you ready to leave behind?','https://ich.unesco.org/en/RL/nowruz-02097'),
 article('kebaya','IDN','Kebaya: clothing, identity and changing meanings','Identity & expression','Kebaya traditions across Southeast Asia',[
  'Kebaya is a garment with related traditions across Brunei Darussalam, Indonesia, Malaysia, Singapore and Thailand. UNESCO describes knowledge, skills and social practices connected with making, wearing and transmitting it.',
  'Psychologically, clothing can help people negotiate identity between personal choice and social expectation. A garment may communicate belonging, memory or occasion, while each wearer can interpret that meaning differently.',
  'Kebaya styles and meanings vary across communities and generations. The point is not that clothing reveals a person’s inner self, but that it can become one resource people use to express and negotiate identity.'
 ],'Clothing can be one way people express identity while responding to shared meanings.','When does what you wear feel like your own choice, and when does it feel like an expectation?','https://ich.unesco.org/en/RL/kebaya-knowledge-skills-traditions-and-practices-02090'),
 article('pysanka-estonia',['EST','UKR'],'Pysanka: wishes, gifts and family memory','Ritual & family meaning','Ukrainian communities, including Ukrainians in Estonia',[
  'Pysanka is the Ukrainian art of decorating eggs with wax-resist patterns. UNESCO describes symbols carrying personal wishes and family traditions, with decorated eggs exchanged as gifts and kept for important occasions.',
  'Psychologically, a gift can make care visible: the object carries time, intention and a message that can be revisited later. Making and exchanging it also gives family members a shared activity through which knowledge travels.',
  'Pysanka has specific Ukrainian meanings and is also practised by Ukrainians living in Estonia. This article does not suggest that the tradition is shared by every Estonian or that every Ukrainian family practises it.'
 ],'Making and giving an object can turn memory and care into something people can hold.','What handmade or chosen object has carried a message you still remember?','https://ich.unesco.org/en/RL/pysanka-ukrainian-tradition-and-art-of-decorating-eggs-02134')

]);
export const articlesForCountry=code=>CULTURE_ARTICLES.filter(a=>Array.isArray(a.country)?a.country.includes(code):a.country===code);
export const articleCountries=Object.freeze([...new Set(CULTURE_ARTICLES.flatMap(a=>Array.isArray(a.country)?a.country:[a.country]))]);
export const articleById=id=>CULTURE_ARTICLES.find(a=>a.id===id)||null;
