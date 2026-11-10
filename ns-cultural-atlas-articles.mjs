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
 ],"Collective creativity depends on networks of people and histories that an audience may never see.","What public celebration reveals the creativity of people usually overlooked?","https://ich.unesco.org/en/RL/frevo-performing-arts-of-the-carnival-of-recife-00603","Pernambuco")
]);
export const articlesForCountry=code=>CULTURE_ARTICLES.filter(a=>a.country===code);
export const articleCountries=Object.freeze([...new Set(CULTURE_ARTICLES.map(a=>a.country))]);
export const articleById=id=>CULTURE_ARTICLES.find(a=>a.id===id)||null;
