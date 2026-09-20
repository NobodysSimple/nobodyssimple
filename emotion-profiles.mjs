const meaning = {
  Fear: "A family of responses to possible danger, uncertainty, or vulnerability. It ranges from mild unease to intense alarm.",
  Anger:
    "A family of responses to obstruction, boundary violation, frustration, or perceived unfairness. The word alone does not tell us what happened.",
  Sadness:
    "A family of responses often connected with loss, disconnection, disappointment, or an unmet longing.",
  Surprise:
    "A response to an event that differs from expectation. What it becomes can depend on what you learn next.",
  Joy: "A broad family of pleasant experiences, from quiet contentment to lively excitement.",
  Love: "A family of warm, tender, admiring, caring, or attracted experiences; these words do not imply reciprocity or consent.",
  Scared:
    "A sense of threat, uncertainty, or possible harm that feels close enough to matter.",
  Frightened: "Fear that has become vivid and immediate.",
  Helpless:
    "Feeling unable to see an effective way to protect or help yourself.",
  Terrified: "Very intense fear when a threat feels overwhelming.",
  Panic:
    "A sudden surge of alarm and urgency; the body may feel ready to escape or act.",
  Hysterical:
    "An old-fashioned, often dismissive word for extreme, hard-to-contain distress; it is not a diagnosis.",
  Insecure: "Uncertain about your safety, standing, ability, or acceptance.",
  Inferior: "Feeling lesser than someone else in a particular comparison.",
  Inadequate: "Feeling that your abilities or resources may not meet a demand.",
  Nervous: "Uneasy anticipation when an outcome is uncertain.",
  Worried:
    "Repeated concern about something that might happen or needs attention.",
  Anxious:
    "Uneasy anticipation that may persist even when the danger is not immediate.",
  Horrified:
    "Strong fear or shock in response to something experienced as appalling or threatening.",
  Mortified:
    "Acute embarrassment or exposure that can feel intensely threatening.",
  Dreadful: "A heavy expectation that something bad or difficult is coming.",
  Enraged:
    "Very intense anger when something feels harmful, obstructive, or unjust.",
  Hateful:
    "Hostile rejection or intense aversion; the word can describe a stance, not a whole person.",
  Hostile:
    "A defensive, antagonistic stance that may arise when safety or respect feels threatened.",
  Exasperated: "Anger and frustration after repeated obstruction or strain.",
  Agitated:
    "A keyed-up, unsettled state that can combine anger, worry, or overload.",
  Frustrated: "Tension when progress or an important goal is blocked.",
  Irritable:
    "A lowered threshold for annoyance; small demands may feel unusually difficult.",
  Annoyed:
    "Mild anger or displeasure in response to a nuisance or boundary crossing.",
  Aggravated: "Annoyance intensified by added friction or repetition.",
  Envious:
    "Painful comparison focused on something another person has that you want.",
  Resentful:
    "Lingering anger when a cost, unfairness, or unmet expectation feels unresolved.",
  Jealous:
    "Threatened concern about losing attention, closeness, or a valued place.",
  Disgusted:
    "Strong aversion or rejection toward something experienced as contaminating, offensive, or unacceptable.",
  Contemptuous:
    "A distancing sense that someone or something is beneath regard; it can obscure their full humanity.",
  Revolted:
    "A strong urge to reject or get away from something experienced as repellent.",
  Distressed:
    "Significant emotional pain when demands, loss, or threat feel difficult to bear.",
  Agonized:
    "Intense distress around a painful conflict, loss, or difficult choice.",
  Hurt: "Emotional pain following perceived rejection, injury, or disappointment.",
  Melancholic: "A subdued, reflective sadness that may feel slow or lingering.",
  Depressed:
    "A low or heavy mood word; if this is persistent or affecting daily life, consider support rather than using the label alone.",
  Sorrowful:
    "Sadness connected with loss, compassion, or something deeply regretted.",
  Disappointed:
    "Low or painful feeling when an expected outcome does not happen.",
  Dismayed:
    "Disappointment mixed with alarm when something seems worse than expected.",
  Displeased: "Mild-to-moderate dissatisfaction with how something has gone.",
  Shameful:
    "A sense of being exposed or bad in others’ eyes; an action and a whole identity are not the same thing.",
  Regretful:
    "Pain about a past choice or missed possibility, often with a wish to respond differently now.",
  Guilty:
    "Concern that you may have caused harm or broken an obligation; guilt can be informative but is not proof.",
  Neglected:
    "Feeling unseen or insufficiently cared for in a relationship or setting.",
  Isolated:
    "Feeling separate from other people or support, whether alone or among others.",
  Lonely:
    "A felt gap between the connection you want and the connection you experience.",
  Hopeless:
    "Difficulty seeing a workable future or route forward in this moment; it does not establish that none exists.",
  Anguished:
    "Very intense emotional pain, often involving loss, conflict, or fear.",
  Powerless:
    "Feeling that your actions have little effect on an important situation.",
  Stunned: "Temporarily unable to take in an unexpected event.",
  Shocked:
    "A sharp response to something surprising, disturbing, or hard to reconcile.",
  Confused:
    "Difficulty making sense of information, feelings, or competing possibilities.",
  Disillusioned:
    "Let down when an ideal, belief, or trusted picture no longer fits.",
  Perplexed: "Puzzled by something that does not yet make sense.",
  Amazed: "Strong surprise with a sense of wonder or admiration.",
  Astonished: "A powerful response to something far outside expectation.",
  "Awe-struck":
    "Wonder before something experienced as vast, powerful, or beyond the ordinary.",
  Overcome:
    "Feeling that the intensity of an experience is temporarily more than you can contain.",
  Speechless: "So surprised or moved that words are hard to find.",
  Astounded: "Strong amazement at something very unexpected.",
  Moved: "Emotionally touched by something meaningful or affecting.",
  Stimulated:
    "More mentally or emotionally activated by something engaging; not necessarily pleasant.",
  Touched:
    "Warm emotional response to care, kindness, beauty, or significance.",
  Content: "A settled sense that things are sufficiently okay for now.",
  Thankful: "Appreciation for a benefit, act of care, or good circumstance.",
  Pleased: "Quiet satisfaction when something goes well or meets a hope.",
  Happy:
    "A broad positive feeling that can range from quiet ease to lively delight.",
  Amused: "Light pleasure from something playful, funny, or unexpected.",
  Delighted: "Strong positive pleasure about something welcome.",
  Cheerful: "A buoyant, positive tone that may make engagement feel easier.",
  Jovial: "Lively, good-humoured warmth, often shared socially.",
  Playful:
    "An open, exploratory wish to engage without needing a serious outcome.",
  Proud:
    "Satisfaction in effort, growth, achievement, or something you stand behind.",
  Triumphant:
    "Strong satisfaction after overcoming an obstacle or reaching a valued goal.",
  Illustrious:
    "A rare, formal word for celebrated distinction; in the wheel it suggests glowing pride or recognition.",
  Optimistic: "An expectation that a favourable possibility may be reachable.",
  Eager: "Forward-looking interest with a wish to begin or get closer.",
  Hopeful: "A sense that a valued possibility remains open.",
  Enthusiastic: "Energetic interest and willingness to engage.",
  Excited:
    "High activation linked to something anticipated or stimulating; it can mix with nerves.",
  Zealous:
    "Intense committed enthusiasm; it can become costly if rest or other perspectives disappear.",
  Elated: "Very high positive uplift after a meaningful or welcome event.",
  Euphoric:
    "Exceptionally intense positive uplift; intensity alone does not explain its cause or duration.",
  Jubilant: "Lively celebration after a shared or important success.",
  Enthralled: "Absorbed by something that holds your attention or fascination.",
  Enchanted:
    "A softened sense of delight or wonder toward someone, somewhere, or something.",
  Rapturous: "Very intense delight or admiration.",
  Desirous: "A pull toward a wanted person, experience, or outcome.",
  Passionate:
    "Strong emotional investment and energy toward something important or wanted.",
  Infatuated: "Intense, often idealised attraction that can narrow attention.",
  Romantic:
    "A wish for affection, closeness, or a romantic meaning in an experience.",
  Attractive:
    "Feeling drawn to someone or something; the word can mean appealing, not necessarily mutual.",
  Enamored:
    "Strong fondness or attraction that may colour attention toward its object.",
  Longing:
    "A sustained pull toward a person, place, experience, or possibility that feels absent.",
  Sentimental:
    "Tender feeling linked to personal meaning, memory, or attachment.",
  Affectionate: "Warm fondness expressed through closeness or care.",
  Tender:
    "Gentle warmth and sensitivity toward someone or something vulnerable or valued.",
  Caring: "Concern that another person’s wellbeing matters to you.",
  Compassionate:
    "Concern for suffering paired with a wish to respond helpfully, while respecting limits.",
  Peaceful: "Low-tension ease, safety, or acceptance in the present moment.",
  Tranquil: "Quiet, settled calm with little felt agitation.",
  Satisfied:
    "A sense that a need, effort, or expectation has been sufficiently met.",
};
const metaphors = {
  Fear: "an alarm bell asking for a closer look—not a verdict that danger is certain.",
  Anger:
    "a boundary flare or engine revving; it can point to obstruction, harm, or a need for space.",
  Sadness:
    "a slower tide that can accompany loss, unmet longing, or the need to pause and care.",
  Surprise:
    "a camera refocusing after the scene changes; its direction depends on what you discover.",
  Joy: "sunlight or a spark of approach—sometimes quiet, sometimes bright and fast.",
  Love: "a thread of attention or care connecting you to someone or something that matters.",
};
const possible = {
  Fear: "safety, reliable information, support, time, or a manageable plan",
  Anger: "a boundary, fairness, repair, agency, or space to cool before acting",
  Sadness: "care, rest, company, grieving, or recognition of what mattered",
  Surprise: "time to orient, ask questions, and update your understanding",
  Joy: "time to savour, share, play, or continue what feels meaningful",
  Love: "connection, reciprocity, tenderness, consent, or protected space",
};
const confused = {
  Fear: "worry, excitement, pain, hunger, and sensory overload can feel similar in the body.",
  Anger: "fear, shame, exhaustion, and feeling blocked can sit beside anger.",
  Sadness:
    "fatigue, loneliness, disappointment, and physical illness can overlap.",
  Surprise: "fear, delight, confusion, and disbelief may appear together.",
  Joy: "relief, excitement, pride, and social pressure can feel similar or mix.",
  Love: "attraction, attachment, admiration, care, longing, and obligation are not identical.",
};
export function profileFor(emotion) {
  const family = emotion.family,
    word = emotion.label;
  const definition =
    meaning[word] ||
    `${word} is one way people describe a ${family.toLowerCase()}-family experience. Your own use of the word may differ.`;
  const nuance = emotion.parent
    ? ` The wheel places it within “${emotion.parent}”; that is one useful family resemblance, not a rule.`
    : "";
  const sensation =
    family === "Fear" || family === "Anger" || family === "Surprise"
      ? "Some people notice a faster heartbeat, muscle tension, warmth, quicker thoughts, or an urge to act; others do not."
      : family === "Sadness"
        ? "Some people notice heaviness, tears, lower energy, or a wish to withdraw; others do not."
        : "Some people notice warmth, an open posture, a smile, calmer breathing, or more energy; others do not.";
  const thought =
    family === "Fear"
      ? "“What might happen? Am I safe? What do I need to check?”"
      : family === "Anger"
        ? "“That is not okay. What boundary or change matters here?”"
        : family === "Sadness"
          ? "“Something important may be missing, lost, or different than I hoped.”"
          : family === "Surprise"
            ? "“What just happened? How should I understand this?”"
            : family === "Joy"
              ? "“This matters to me. Can I stay with or share this?”"
              : "“I feel drawn to, protective of, or connected with this.”";
  const situations =
    family === "Fear"
      ? "uncertainty, perceived threat, risk, evaluation, or a change in safety."
      : family === "Anger"
        ? "a blocked goal, crossed boundary, unfairness, or repeated frustration."
        : family === "Sadness"
          ? "loss, separation, disappointment, loneliness, or an unmet need."
          : family === "Surprise"
            ? "unexpected news, an unfamiliar event, or a change in expectation."
            : family === "Joy"
              ? "connection, progress, play, relief, achievement, or something enjoyable."
              : "care, closeness, attraction, memory, admiration, or a valued bond.";
  return {
    definition: definition + nuance,
    analogy: metaphors[family],
    function: `It may draw attention to ${family === "Fear" ? "possible risk or uncertainty" : family === "Anger" ? "a blocked goal, boundary, or possible injustice" : family === "Sadness" ? "loss, connection, or something that mattered" : family === "Surprise" ? "a mismatch between expectation and event" : family === "Joy" ? "a rewarding, connecting, or meaningful experience" : "care, attachment, or a valued connection"}. It does not prove what caused the feeling or prescribe what to do.`,
    situations,
    body: sensation,
    thought,
    need: possible[family],
    confused: confused[family],
    support:
      "You might first check your body state and surroundings, then choose: more information, a pause, support, a boundary, a small action, or simply room to feel it. You do not have to force the feeling away.",
  };
}

export const stateItems = [
  ["Tired", "low energy or sleep pressure"],
  ["Sleepy", "a pull toward sleep or difficulty staying alert"],
  ["Exhausted", "very depleted energy; rest or health factors may matter"],
  ["Wired", "high activation alongside tiredness or difficulty settling"],
  ["Restless", "movement or change feels needed"],
  ["Hungry", "food timing or access may be affecting the moment"],
  [
    "Hangry",
    "a casual label for hunger overlapping with irritability; it is a cue to check, not a diagnosis",
  ],
  ["Thirsty", "fluid needs may be worth checking"],
  ["Ill or in pain", "physical discomfort may be part of the picture"],
  ["Overstimulated", "sensory input may feel too intense right now"],
  ["Understimulated", "more movement, novelty, or sensory input may be wanted"],
  ["Lonely", "desired connection and experienced connection may differ"],
  [
    "Sexually aroused",
    "sexual activation; this never implies consent or an obligation to act",
  ],
  ["Caffeine-heavy", "recent caffeine may be part of your state"],
  ["Foggy", "thinking may feel slower or less clear"],
  ["Numb", "less sensation or emotional access than you expect"],
  ["Frazzled", "several demands may be competing for attention"],
  ["Overloaded", "current demands may exceed the capacity available right now"],
];
