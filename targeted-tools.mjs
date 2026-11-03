/* Original activities; source links support the approach, not clinical validation. */
export const targetedTools = [
  {
    "id": "anger-pause",
    "title": "Pause before anger becomes an action",
    "group": "calm",
    "short": "Build a safe pause-and-return plan before sending, shouting or confronting.",
    "tags": [
      "anger",
      "angry",
      "rage",
      "frustration",
      "conflict"
    ],
    "fields": [
      {
        "id": "context",
        "type": "textarea",
        "label": "What tells you to pause before the peak?",
        "placeholder": "My voice gets louder; I start typing accusations."
      },
      {
        "id": "options",
        "type": "checks",
        "label": "Choose any workable options—or leave these blank",
        "options": [
          "Put the message in drafts",
          "Step into a safe quieter space",
          "Ask for a pause without demanding a reply",
          "Call a trusted person outside the conflict"
        ]
      },
      {
        "id": "plan",
        "type": "textarea",
        "label": "What can you say and when will you check back?",
        "placeholder": "I need a pause. I will check whether I can talk at 7. You can take space too."
      },
      {
        "id": "review",
        "type": "textarea",
        "label": "What will tell you to keep, adapt or stop this plan?",
        "placeholder": "Name one useful sign and one reason to change the plan. No improvement is information, not failure."
      }
    ],
    "prompts": [
      "Notice the earliest warning: jaw, pace, voice or urge. Pause the exchange rather than trying to win it.",
      "If safe, create distance and say when you will check back. Do not drive while highly agitated or block someone from leaving.",
      "Return only when you can speak safely; otherwise arrange support or more time."
    ],
    "guidance": {
      "steps": [
        "Notice the earliest warning: jaw, pace, voice or urge. Pause the exchange rather than trying to win it.",
        "If safe, create distance and say when you will check back. Do not drive while highly agitated or block someone from leaving.",
        "Return only when you can speak safely; otherwise arrange support or more time."
      ],
      "limits": "If you may hurt yourself or someone else, prioritise distance and urgent real-world help. This is not a crisis plan.",
      "sources": [
        [
          "NHS: anger",
          "https://www.nhs.uk/mental-health/feelings-symptoms-behaviours/feelings-and-symptoms/anger/"
        ]
      ],
      "outcome": "A specific plan based on your choices, which you can save, copy or download.",
      "rationale": "An original planning exercise informed by the linked background guidance; the exact app activity has not been clinically tested."
    }
  },
  {
    "id": "resentment-load",
    "title": "Turn resentment into a fair-load request",
    "group": "relate",
    "short": "Name an unequal demand and ask for a concrete redistribution.",
    "tags": [
      "resentment",
      "unfair",
      "burden",
      "anger",
      "chores",
      "caregiver"
    ],
    "fields": [
      {
        "id": "context",
        "type": "textarea",
        "label": "Which recurring demand feels unfair?",
        "placeholder": "I notice, plan and arrange every appointment."
      },
      {
        "id": "options",
        "type": "checks",
        "label": "Choose any workable options—or leave these blank",
        "options": [
          "Transfer a whole task including planning",
          "Agree a rota",
          "Reduce the standard together",
          "Stop an optional task",
          "Request outside practical help"
        ]
      },
      {
        "id": "plan",
        "type": "textarea",
        "label": "Write the request and a review date.",
        "placeholder": "Can you own booking and transport for the next appointment? Let us review after it."
      },
      {
        "id": "review",
        "type": "textarea",
        "label": "What will tell you to keep, adapt or stop this plan?",
        "placeholder": "Name one useful sign and one reason to change the plan. No improvement is information, not failure."
      }
    ],
    "prompts": [
      "List one repeated task and who currently carries planning as well as doing.",
      "Separate the impact you know from the intention you are guessing.",
      "Ask for a named owner and review date, not a vague promise to help more."
    ],
    "guidance": {
      "steps": [
        "List one repeated task and who currently carries planning as well as doing.",
        "Separate the impact you know from the intention you are guessing.",
        "Ask for a named owner and review date, not a vague promise to help more."
      ],
      "limits": "A negotiation tool is unsuitable where disagreement brings intimidation or retaliation.",
      "sources": [
        [
          "NHS: anger",
          "https://www.nhs.uk/mental-health/feelings-symptoms-behaviours/feelings-and-symptoms/anger/"
        ]
      ],
      "outcome": "A specific plan based on your choices, which you can save, copy or download.",
      "rationale": "An original planning exercise informed by the linked background guidance; the exact app activity has not been clinically tested."
    }
  },
  {
    "id": "shame-context",
    "title": "Work through shame without attacking yourself",
    "group": "feel",
    "short": "Separate an event from a global judgement about your worth.",
    "tags": [
      "shame",
      "embarrassed",
      "humiliation",
      "self",
      "criticism"
    ],
    "fields": [
      {
        "id": "context",
        "type": "textarea",
        "label": "What happened, and what label did you give yourself?",
        "placeholder": "I stumbled over my words; I called myself pathetic."
      },
      {
        "id": "options",
        "type": "checks",
        "label": "Choose any workable options—or leave these blank",
        "options": [
          "Use a neutral description",
          "Imagine a fair response to a friend",
          "Ask for support without recounting everything",
          "Repair a specific action if needed"
        ]
      },
      {
        "id": "plan",
        "type": "textarea",
        "label": "What is a fairer sentence and one helpful action?",
        "placeholder": "I lost my words in a stressful moment. I can send the key point in writing."
      },
      {
        "id": "review",
        "type": "textarea",
        "label": "What will tell you to keep, adapt or stop this plan?",
        "placeholder": "Name one useful sign and one reason to change the plan. No improvement is information, not failure."
      }
    ],
    "prompts": [
      "Write the event without labels such as worthless or broken.",
      "Include pressure, knowledge and choices available at the time; context is not the same as excusing harm.",
      "Choose care, a proportionate repair, or safe disclosure to someone trustworthy."
    ],
    "guidance": {
      "steps": [
        "Write the event without labels such as worthless or broken.",
        "Include pressure, knowledge and choices available at the time; context is not the same as excusing harm.",
        "Choose care, a proportionate repair, or safe disclosure to someone trustworthy."
      ],
      "limits": "You need not revisit traumatic detail or disclose an experience to use this tool.",
      "sources": [
        [
          "CCI: self-compassion",
          "https://www.cci.health.wa.gov.au/Resources/Looking-After-Yourself/Self-Compassion"
        ]
      ],
      "outcome": "A specific plan based on your choices, which you can save, copy or download.",
      "rationale": "An original planning exercise informed by the linked background guidance; the exact app activity has not been clinically tested."
    }
  },
  {
    "id": "guilt-responsibility",
    "title": "Sort guilt into repair and what was not yours",
    "group": "feel",
    "short": "Distinguish a specific responsibility from hindsight and impossible control.",
    "tags": [
      "guilt",
      "responsibility",
      "blame",
      "regret"
    ],
    "fields": [
      {
        "id": "context",
        "type": "textarea",
        "label": "What action do you regret, and what was actually within your control?",
        "placeholder": "I missed a commitment; I could have sent a short message."
      },
      {
        "id": "options",
        "type": "checks",
        "label": "Choose any workable options—or leave these blank",
        "options": [
          "Acknowledge the impact once",
          "Offer a practical repair",
          "Change the future arrangement",
          "Recognise a limit I could not control"
        ]
      },
      {
        "id": "plan",
        "type": "textarea",
        "label": "What repair or release of responsibility fits the facts?",
        "placeholder": "I will apologise for not messaging and set a reminder next time."
      },
      {
        "id": "review",
        "type": "textarea",
        "label": "What will tell you to keep, adapt or stop this plan?",
        "placeholder": "Name one useful sign and one reason to change the plan. No improvement is information, not failure."
      }
    ],
    "prompts": [
      "Name the action you regret and what you knew then.",
      "List other contributors and what you could not control. Avoid assigning invented percentages.",
      "If repair is needed, choose one proportionate step; repeated confession is not required."
    ],
    "guidance": {
      "steps": [
        "Name the action you regret and what you knew then.",
        "List other contributors and what you could not control. Avoid assigning invented percentages.",
        "If repair is needed, choose one proportionate step; repeated confession is not required."
      ],
      "limits": "If checking, confessing or reassurance-seeking is repetitive and hard to stop, a worksheet can feed that loop; seek tailored support.",
      "sources": [
        [
          "CCI: self-compassion",
          "https://www.cci.health.wa.gov.au/Resources/Looking-After-Yourself/Self-Compassion"
        ]
      ],
      "outcome": "A specific plan based on your choices, which you can save, copy or download.",
      "rationale": "An original planning exercise informed by the linked background guidance; the exact app activity has not been clinically tested."
    }
  },
  {
    "id": "jealousy-request",
    "title": "Handle jealousy without monitoring someone",
    "group": "relate",
    "short": "Turn a feared loss or comparison into an honest need and a respectful choice.",
    "tags": [
      "jealous",
      "envy",
      "insecure",
      "comparison",
      "relationship"
    ],
    "fields": [
      {
        "id": "context",
        "type": "textarea",
        "label": "What happened, what did you fear, and what is still unknown?",
        "placeholder": "A reply was late; I feared losing the relationship; I do not know why."
      },
      {
        "id": "options",
        "type": "checks",
        "label": "Choose any workable options—or leave these blank",
        "options": [
          "Ask one clear question",
          "Request planned time together",
          "Pause comparison-heavy content",
          "Discuss an agreement mutually",
          "Choose space to decide what I need"
        ]
      },
      {
        "id": "plan",
        "type": "textarea",
        "label": "Write a request or action within your control.",
        "placeholder": "Could we arrange a call tomorrow? I want to feel connected, not supervise you."
      },
      {
        "id": "review",
        "type": "textarea",
        "label": "What will tell you to keep, adapt or stop this plan?",
        "placeholder": "Name one useful sign and one reason to change the plan. No improvement is information, not failure."
      }
    ],
    "prompts": [
      "Separate observed facts from predictions about rejection or betrayal.",
      "Identify whether you need connection, clarity, reassurance or a boundary.",
      "Make a request that respects refusal; do not inspect devices, demand passwords or track someone."
    ],
    "guidance": {
      "steps": [
        "Separate observed facts from predictions about rejection or betrayal.",
        "Identify whether you need connection, clarity, reassurance or a boundary.",
        "Make a request that respects refusal; do not inspect devices, demand passwords or track someone."
      ],
      "limits": "This cannot decide whether trust is justified. Genuine breaches and coercion need more than reframing.",
      "sources": [
        [
          "CCI: self-compassion",
          "https://www.cci.health.wa.gov.au/Resources/Looking-After-Yourself/Self-Compassion"
        ]
      ],
      "outcome": "A specific plan based on your choices, which you can save, copy or download.",
      "rationale": "An original planning exercise informed by the linked background guidance; the exact app activity has not been clinically tested."
    }
  },
  {
    "id": "rejection-response",
    "title": "Steady yourself after rejection or criticism",
    "group": "feel",
    "short": "Separate hurt, useful feedback and conclusions you cannot yet know.",
    "tags": [
      "rejection",
      "criticism",
      "rejection",
      "sensitivity",
      "RSD",
      "ADHD",
      "hurt"
    ],
    "fields": [
      {
        "id": "context",
        "type": "textarea",
        "label": "What was actually said, and what did you hear it as meaning?",
        "placeholder": "Please revise this section became I am terrible at everything."
      },
      {
        "id": "options",
        "type": "checks",
        "label": "Choose any workable options—or leave these blank",
        "options": [
          "Ask which part needs changing",
          "Take one useful point",
          "Ask for respectful wording",
          "Discuss it with a trusted person",
          "Do not respond yet"
        ]
      },
      {
        "id": "plan",
        "type": "textarea",
        "label": "What response fits the evidence rather than the worst prediction?",
        "placeholder": "Which two changes would make this section clearer?"
      },
      {
        "id": "review",
        "type": "textarea",
        "label": "What will tell you to keep, adapt or stop this plan?",
        "placeholder": "Name one useful sign and one reason to change the plan. No improvement is information, not failure."
      }
    ],
    "prompts": [
      "Pause a nonurgent reply while the first wave is strongest.",
      "Sort the message into specific feedback, preference, unclear meaning and disrespect.",
      "Choose clarification, one change, a boundary or no response."
    ],
    "guidance": {
      "steps": [
        "Pause a nonurgent reply while the first wave is strongest.",
        "Sort the message into specific feedback, preference, unclear meaning and disrespect.",
        "Choose clarification, one change, a boundary or no response."
      ],
      "limits": "Intense rejection feelings are not a diagnosis; do not assume others meant well when there is evidence of mistreatment.",
      "sources": [
        [
          "CCI: self-compassion",
          "https://www.cci.health.wa.gov.au/Resources/Looking-After-Yourself/Self-Compassion"
        ]
      ],
      "outcome": "A specific plan based on your choices, which you can save, copy or download.",
      "rationale": "An original planning exercise informed by the linked background guidance; the exact app activity has not been clinically tested."
    }
  },
  {
    "id": "grief-date",
    "title": "Plan for a grief wave or difficult anniversary",
    "group": "feel",
    "short": "Prepare choices for a difficult date without imposing a timeline for grief.",
    "tags": [
      "grief",
      "bereavement",
      "loss",
      "anniversary",
      "sadness"
    ],
    "fields": [
      {
        "id": "context",
        "type": "textarea",
        "label": "Which date or reminder is approaching?",
        "placeholder": "A birthday, breakup anniversary or place linked to a loss."
      },
      {
        "id": "options",
        "type": "checks",
        "label": "Choose any workable options—or leave these blank",
        "options": [
          "Mark it privately",
          "Invite chosen company",
          "Keep the day ordinary",
          "Shorten an event",
          "Ask others not to question me"
        ]
      },
      {
        "id": "plan",
        "type": "textarea",
        "label": "What will you arrange, and what is your fallback?",
        "placeholder": "A short walk with a friend; cancel by text if I need quiet."
      },
      {
        "id": "review",
        "type": "textarea",
        "label": "What will tell you to keep, adapt or stop this plan?",
        "placeholder": "Name one useful sign and one reason to change the plan. No improvement is information, not failure."
      }
    ],
    "prompts": [
      "Choose what you do and do not want from the occasion.",
      "Arrange one support and an exit or shorter version.",
      "Allow remembering and ordinary activities to coexist; neither proves how much you care."
    ],
    "guidance": {
      "steps": [
        "Choose what you do and do not want from the occasion.",
        "Arrange one support and an exit or shorter version.",
        "Allow remembering and ordinary activities to coexist; neither proves how much you care."
      ],
      "limits": "Skip memory prompts if they feel overwhelming. There is no required sequence or deadline for grief.",
      "sources": [
        [
          "NHS: grief and loss",
          "https://www.nhs.uk/mental-health/feelings-symptoms-behaviours/feelings-and-symptoms/grief-bereavement-loss/"
        ]
      ],
      "outcome": "A specific plan based on your choices, which you can save, copy or download.",
      "rationale": "An original planning exercise informed by the linked background guidance; the exact app activity has not been clinically tested."
    }
  },
  {
    "id": "low-mood-reconnect",
    "title": "Plan one activity when nothing feels appealing",
    "group": "feel",
    "short": "Choose a small care, connection or interest activity without waiting for motivation.",
    "tags": [
      "low",
      "mood",
      "depression",
      "anhedonia",
      "withdrawal",
      "sadness"
    ],
    "fields": [
      {
        "id": "context",
        "type": "textarea",
        "label": "What has dropped away, and what feels feasible today?",
        "placeholder": "I have stopped answering friends; a short voice note seems possible."
      },
      {
        "id": "options",
        "type": "checks",
        "label": "Choose any workable options—or leave these blank",
        "options": [
          "A two-line message",
          "Sit somewhere different",
          "Prepare an easy meal",
          "Five minutes with a familiar interest",
          "Ask someone to join a small task"
        ]
      },
      {
        "id": "plan",
        "type": "textarea",
        "label": "When, where and what is the smaller fallback?",
        "placeholder": "After lunch I will send one line; if words are hard, send an agreed emoji."
      },
      {
        "id": "review",
        "type": "textarea",
        "label": "What will tell you to keep, adapt or stop this plan?",
        "placeholder": "Name one useful sign and one reason to change the plan. No improvement is information, not failure."
      }
    ],
    "prompts": [
      "Pick one activity small enough for today, not a whole routine.",
      "Set a time, access support and a permission-to-stop point.",
      "Afterwards note connection, ease or effort—not only whether mood improved."
    ],
    "guidance": {
      "steps": [
        "Pick one activity small enough for today, not a whole routine.",
        "Set a time, access support and a permission-to-stop point.",
        "Afterwards note connection, ease or effort—not only whether mood improved."
      ],
      "limits": "Persistent low mood, major changes or difficulty meeting basic needs deserve support. Do not push through exhaustion.",
      "sources": [
        [
          "NHS: low mood",
          "https://www.nhs.uk/mental-health/feelings-symptoms-behaviours/feelings-and-symptoms/low-mood-sadness-depression/"
        ]
      ],
      "outcome": "A specific plan based on your choices, which you can save, copy or download.",
      "rationale": "An original planning exercise informed by the linked background guidance; the exact app activity has not been clinically tested."
    }
  },
  {
    "id": "panic-preparation",
    "title": "Make a plan for a familiar panic episode",
    "group": "calm",
    "short": "Prepare a brief response for familiar episodes and identify when to seek medical help.",
    "tags": [
      "panic",
      "anxiety",
      "frightened",
      "fear",
      "panic",
      "attack"
    ],
    "fields": [
      {
        "id": "context",
        "type": "textarea",
        "label": "What has helped in familiar episodes, and what tends to worsen them?",
        "placeholder": "Simple language helps; repeated questions and forced deep breaths do not."
      },
      {
        "id": "options",
        "type": "checks",
        "label": "Choose any workable options—or leave these blank",
        "options": [
          "Look at a stable object",
          "Feel contact with a chair",
          "Let breathing stay comfortable",
          "Ask for quiet company",
          "Use an agreed support message"
        ]
      },
      {
        "id": "plan",
        "type": "textarea",
        "label": "Write a short reminder and who you can contact.",
        "placeholder": "I can pause and take one step at a time. Please stay nearby without lots of questions."
      },
      {
        "id": "review",
        "type": "textarea",
        "label": "What will tell you to keep, adapt or stop this plan?",
        "placeholder": "Name one useful sign and one reason to change the plan. No improvement is information, not failure."
      }
    ],
    "prompts": [
      "Prepare this while relatively settled; keep only steps you find tolerable.",
      "Choose an external anchor and a trusted contact; breath focus is optional.",
      "Plan how to resume or get support afterwards, without treating distress as a test of willpower."
    ],
    "guidance": {
      "steps": [
        "Prepare this while relatively settled; keep only steps you find tolerable.",
        "Choose an external anchor and a trusted contact; breath focus is optional.",
        "Plan how to resume or get support afterwards, without treating distress as a test of willpower."
      ],
      "limits": "New, severe or unusual chest pain, fainting or breathing difficulty must not be assumed to be panic; get urgent medical help.",
      "sources": [
        [
          "NHS: anxiety and panic",
          "https://www.nhs.uk/mental-health/feelings-symptoms-behaviours/feelings-and-symptoms/anxiety-fear-panic/"
        ]
      ],
      "outcome": "A specific plan based on your choices, which you can save, copy or download.",
      "rationale": "An original planning exercise informed by the linked background guidance; the exact app activity has not been clinically tested."
    }
  },
  {
    "id": "disappointment-reset",
    "title": "Adjust a plan after disappointment",
    "group": "decide",
    "short": "Acknowledge a lost outcome and decide what can still matter.",
    "tags": [
      "disappointment",
      "setback",
      "failure",
      "expectations"
    ],
    "fields": [
      {
        "id": "context",
        "type": "textarea",
        "label": "What did you hope for, and what does losing it mean?",
        "placeholder": "I wanted this role because I value useful work and stability."
      },
      {
        "id": "options",
        "type": "checks",
        "label": "Choose any workable options—or leave these blank",
        "options": [
          "Pause before choosing again",
          "Ask for specific feedback",
          "Try a different route to the same value",
          "Reduce the goal",
          "Let this goal go"
        ]
      },
      {
        "id": "plan",
        "type": "textarea",
        "label": "What remains important and what happens next?",
        "placeholder": "Useful work still matters. I will review two different roles on Friday."
      },
      {
        "id": "review",
        "type": "textarea",
        "label": "What will tell you to keep, adapt or stop this plan?",
        "placeholder": "Name one useful sign and one reason to change the plan. No improvement is information, not failure."
      }
    ],
    "prompts": [
      "Name what you wanted and what did not happen.",
      "Separate the lost outcome from values or needs that still matter.",
      "Choose rest, revision, another route or closure rather than forcing immediate positivity."
    ],
    "guidance": {
      "steps": [
        "Name what you wanted and what did not happen.",
        "Separate the lost outcome from values or needs that still matter.",
        "Choose rest, revision, another route or closure rather than forcing immediate positivity."
      ],
      "limits": "Loss does not always contain a lesson or benefit. Acknowledging pain can be enough for now.",
      "sources": [
        [
          "CCI: self-compassion",
          "https://www.cci.health.wa.gov.au/Resources/Looking-After-Yourself/Self-Compassion"
        ]
      ],
      "outcome": "A specific plan based on your choices, which you can save, copy or download.",
      "rationale": "An original planning exercise informed by the linked background guidance; the exact app activity has not been clinically tested."
    }
  },
  {
    "id": "loneliness-contact",
    "title": "Make a low-pressure connection plan",
    "group": "relate",
    "short": "Match a social step to the kind of connection and energy you have.",
    "tags": [
      "loneliness",
      "isolated",
      "friendship",
      "belonging",
      "social"
    ],
    "fields": [
      {
        "id": "context",
        "type": "textarea",
        "label": "What kind of contact is missing?",
        "placeholder": "Quiet company while doing separate tasks, rather than a large gathering."
      },
      {
        "id": "options",
        "type": "checks",
        "label": "Choose any workable options—or leave these blank",
        "options": [
          "Invite one person for a short walk",
          "Attend a recurring interest group",
          "Send a specific low-pressure message",
          "Ask for remote company",
          "Try a shared activity with a clear end"
        ]
      },
      {
        "id": "plan",
        "type": "textarea",
        "label": "Write the invitation and an alternative.",
        "placeholder": "Free for a 15-minute call this week? No pressure if not; I can ask another friend."
      },
      {
        "id": "review",
        "type": "textarea",
        "label": "What will tell you to keep, adapt or stop this plan?",
        "placeholder": "Name one useful sign and one reason to change the plan. No improvement is information, not failure."
      }
    ],
    "prompts": [
      "Choose company, shared activity, emotional closeness or practical help.",
      "Make one invitation specific, small and easy to decline.",
      "Have a fallback that does not treat one unavailable person as a verdict about you."
    ],
    "guidance": {
      "steps": [
        "Choose company, shared activity, emotional closeness or practical help.",
        "Make one invitation specific, small and easy to decline.",
        "Have a fallback that does not treat one unavailable person as a verdict about you."
      ],
      "limits": "Prioritise safe and reciprocal relationships; more contact is not automatically better.",
      "sources": [
        [
          "NHS: low mood",
          "https://www.nhs.uk/mental-health/feelings-symptoms-behaviours/feelings-and-symptoms/low-mood-sadness-depression/"
        ]
      ],
      "outcome": "A specific plan based on your choices, which you can save, copy or download.",
      "rationale": "An original planning exercise informed by the linked background guidance; the exact app activity has not been clinically tested."
    }
  },
  {
    "id": "perfection-finish",
    "title": "Decide when a task is good enough to finish",
    "group": "think",
    "short": "Set a task-specific stopping rule before another round of checking.",
    "tags": [
      "perfectionism",
      "overchecking",
      "revision",
      "endless",
      "standards"
    ],
    "fields": [
      {
        "id": "context",
        "type": "textarea",
        "label": "What are the essential completion criteria?",
        "placeholder": "The email contains the date, question and attachment; tone is respectful."
      },
      {
        "id": "options",
        "type": "checks",
        "label": "Choose any workable options—or leave these blank",
        "options": [
          "One factual check then send",
          "Time-limit cosmetic changes",
          "Ask for requirements once",
          "Submit a rough version for feedback"
        ]
      },
      {
        "id": "plan",
        "type": "textarea",
        "label": "What is the stopping rule and predicted outcome?",
        "placeholder": "After checking the attachment once I will send; I predict a minor typo will be tolerable."
      },
      {
        "id": "review",
        "type": "textarea",
        "label": "What will tell you to keep, adapt or stop this plan?",
        "placeholder": "Name one useful sign and one reason to change the plan. No improvement is information, not failure."
      }
    ],
    "prompts": [
      "Choose a low-stakes task and define its actual purpose.",
      "Set observable completion criteria and a review limit.",
      "Finish, then compare the feared consequence with what occurred."
    ],
    "guidance": {
      "steps": [
        "Choose a low-stakes task and define its actual purpose.",
        "Set observable completion criteria and a review limit.",
        "Finish, then compare the feared consequence with what occurred."
      ],
      "limits": "Do not reduce safety-critical checks. Repetitive checking linked to OCD needs a tailored approach.",
      "sources": [
        [
          "CCI: perfectionism",
          "https://cci.health.wa.gov.au/Home/Resources/Looking-After-Yourself/Perfectionism"
        ]
      ],
      "outcome": "A specific plan based on your choices, which you can save, copy or download.",
      "rationale": "An original planning exercise informed by the linked background guidance; the exact app activity has not been clinically tested."
    }
  },
  {
    "id": "shutdown-card",
    "title": "Prepare a card for when speaking is difficult",
    "group": "calm",
    "short": "Write a message you can show or copy when spoken communication is difficult.",
    "tags": [
      "autism",
      "autistic",
      "shutdown",
      "speech",
      "AAC",
      "communication",
      "neurodivergent"
    ],
    "fields": [
      {
        "id": "context",
        "type": "textarea",
        "label": "What should the card say about your needs?",
        "placeholder": "Speaking is difficult right now. I may understand more than I can reply to."
      },
      {
        "id": "options",
        "type": "checks",
        "label": "Choose any workable options—or leave these blank",
        "options": [
          "Give me time",
          "Use one written question",
          "Offer yes/no choices",
          "Do not touch without asking",
          "Reduce light and noise",
          "Let me use my usual communication aid"
        ]
      },
      {
        "id": "plan",
        "type": "textarea",
        "label": "What help is welcome, and who may be contacted?",
        "placeholder": "Please help me reach a quieter place. Ask before calling anyone."
      },
      {
        "id": "review",
        "type": "textarea",
        "label": "What will tell you to keep, adapt or stop this plan?",
        "placeholder": "Name one useful sign and one reason to change the plan. No improvement is information, not failure."
      }
    ],
    "prompts": [
      "Prepare the wording now; it can describe needs without disclosing a diagnosis.",
      "Choose how others should communicate and what they should avoid.",
      "Download or copy the result for easy access outside this app."
    ],
    "guidance": {
      "steps": [
        "Prepare the wording now; it can describe needs without disclosing a diagnosis.",
        "Choose how others should communicate and what they should avoid.",
        "Download or copy the result for easy access outside this app."
      ],
      "limits": "New sudden loss of speech or other neurological symptoms needs urgent medical assessment; do not label it a shutdown automatically.",
      "sources": [
        [
          "Autistica: supporting meltdowns and shutdowns",
          "https://www.autistica.org.uk/what-is-autism/supporting-meltdowns"
        ]
      ],
      "outcome": "A specific plan based on your choices, which you can save, copy or download.",
      "rationale": "An original planning exercise informed by the linked background guidance; the exact app activity has not been clinically tested."
    }
  },
  {
    "id": "meltdown-plan",
    "title": "Prepare an overload and recovery plan",
    "group": "calm",
    "short": "Plan environmental changes and support before overload peaks.",
    "tags": [
      "autism",
      "autistic",
      "meltdown",
      "overload",
      "neurodivergent"
    ],
    "fields": [
      {
        "id": "context",
        "type": "textarea",
        "label": "What early signs and situations matter for you?",
        "placeholder": "Sounds merge; speech becomes hard; the room feels impossible to stay in."
      },
      {
        "id": "options",
        "type": "checks",
        "label": "Choose any workable options—or leave these blank",
        "options": [
          "Reduce demands",
          "Offer an agreed exit",
          "Stop repeated questions",
          "Keep familiar sensory aids available",
          "Offer space without abandoning safety"
        ]
      },
      {
        "id": "plan",
        "type": "textarea",
        "label": "What should a supporter do first and after the peak?",
        "placeholder": "Show the quiet-room option; afterwards allow recovery before discussing what happened."
      },
      {
        "id": "review",
        "type": "textarea",
        "label": "What will tell you to keep, adapt or stop this plan?",
        "placeholder": "Name one useful sign and one reason to change the plan. No improvement is information, not failure."
      }
    ],
    "prompts": [
      "Build this when settled; a person in acute overload should not have to complete a form.",
      "List early signals and what another person can reduce.",
      "Plan recovery without an immediate explanation, apology or performance demand."
    ],
    "guidance": {
      "steps": [
        "Build this when settled; a person in acute overload should not have to complete a form.",
        "List early signals and what another person can reduce.",
        "Plan recovery without an immediate explanation, apology or performance demand."
      ],
      "limits": "This is preparation, not a restraint plan. If anyone is in immediate danger, prioritise safety and urgent help.",
      "sources": [
        [
          "Autistica: supporting meltdowns and shutdowns",
          "https://www.autistica.org.uk/what-is-autism/supporting-meltdowns"
        ]
      ],
      "outcome": "A specific plan based on your choices, which you can save, copy or download.",
      "rationale": "An original planning exercise informed by the linked background guidance; the exact app activity has not been clinically tested."
    }
  },
  {
    "id": "burnout-adjustments",
    "title": "Reduce demands when capacity has dropped",
    "group": "calm",
    "short": "Turn a sustained drop in capacity into concrete temporary adjustments.",
    "tags": [
      "autistic",
      "burnout",
      "fatigue",
      "exhaustion",
      "neurodivergent",
      "masking"
    ],
    "fields": [
      {
        "id": "context",
        "type": "textarea",
        "label": "What is harder than usual and which demands are draining you?",
        "placeholder": "Shopping and meetings now leave me unable to manage the rest of the day."
      },
      {
        "id": "options",
        "type": "checks",
        "label": "Choose any workable options—or leave these blank",
        "options": [
          "Reduce meeting frequency",
          "Use written updates",
          "Arrange practical help",
          "Protect lower-input time",
          "Pause optional commitments"
        ]
      },
      {
        "id": "plan",
        "type": "textarea",
        "label": "What adjustment will you request and when will you review it?",
        "placeholder": "For two weeks, use written updates instead of daily calls; review with support."
      },
      {
        "id": "review",
        "type": "textarea",
        "label": "What will tell you to keep, adapt or stop this plan?",
        "placeholder": "Name one useful sign and one reason to change the plan. No improvement is information, not failure."
      }
    ],
    "prompts": [
      "Compare current capacity with your own usual level, not someone else’s output.",
      "Choose demands to pause, reduce or delegate and preserve essential care.",
      "Arrange a review with support rather than promising a rapid return to normal."
    ],
    "guidance": {
      "steps": [
        "Compare current capacity with your own usual level, not someone else’s output.",
        "Choose demands to pause, reduce or delegate and preserve essential care.",
        "Arrange a review with support rather than promising a rapid return to normal."
      ],
      "limits": "Burnout can overlap with depression, sleep or physical-health problems. New or persistent deterioration warrants assessment; this tool cannot determine the cause.",
      "sources": [
        [
          "National Autistic Society: autistic fatigue",
          "https://www.autism.org.uk/advice-and-guidance/mental-health/autistic-fatigue/autistic-adults"
        ]
      ],
      "outcome": "A specific plan based on your choices, which you can save, copy or download.",
      "rationale": "An original planning exercise informed by the linked background guidance; the exact app activity has not been clinically tested."
    }
  },
  {
    "id": "time-reality",
    "title": "Plan using how long tasks actually take",
    "group": "decide",
    "short": "Include preparation, travel and transitions in one realistic time estimate.",
    "tags": [
      "ADHD",
      "time",
      "blindness",
      "lateness",
      "time",
      "estimation",
      "executive",
      "function"
    ],
    "fields": [
      {
        "id": "context",
        "type": "textarea",
        "label": "What are the stages and your estimates?",
        "placeholder": "Find items: 5 min; get ready: 15; travel: 20; enter building: 5."
      },
      {
        "id": "options",
        "type": "checks",
        "label": "Choose any workable options—or leave these blank",
        "options": [
          "Add a prepare-to-leave reminder",
          "Include transition time",
          "Use a visible clock",
          "Pack essentials earlier",
          "Ask for a realistic start window"
        ]
      },
      {
        "id": "plan",
        "type": "textarea",
        "label": "What did it actually take and what will change next time?",
        "placeholder": "Preparation took 20 rather than 5 minutes; set the first reminder earlier."
      },
      {
        "id": "review",
        "type": "textarea",
        "label": "What will tell you to keep, adapt or stop this plan?",
        "placeholder": "Name one useful sign and one reason to change the plan. No improvement is information, not failure."
      }
    ],
    "prompts": [
      "Choose one everyday task and estimate each stage separately.",
      "Record actual elapsed time once without judging yourself.",
      "Use the observation to adjust the next plan and add a realistic buffer."
    ],
    "guidance": {
      "steps": [
        "Choose one everyday task and estimate each stage separately.",
        "Record actual elapsed time once without judging yourself.",
        "Use the observation to adjust the next plan and add a realistic buffer."
      ],
      "limits": "This is an organisational aid, not a test for ADHD. A single attempt does not establish a reliable average.",
      "sources": [
        [
          "NHS: adult ADHD",
          "https://www.nhs.uk/conditions/adhd-adults/"
        ]
      ],
      "outcome": "A specific plan based on your choices, which you can save, copy or download.",
      "rationale": "An original planning exercise informed by the linked background guidance; the exact app activity has not been clinically tested."
    }
  },
  {
    "id": "memory-offload",
    "title": "Keep instructions outside your working memory",
    "group": "think",
    "short": "Create one reliable place to capture and resume a multi-step task.",
    "tags": [
      "ADHD",
      "working",
      "memory",
      "forgetful",
      "instructions",
      "executive",
      "function"
    ],
    "fields": [
      {
        "id": "context",
        "type": "textarea",
        "label": "Which instruction or sequence keeps disappearing?",
        "placeholder": "After opening the portal, I forget which attachment was requested."
      },
      {
        "id": "options",
        "type": "checks",
        "label": "Choose any workable options—or leave these blank",
        "options": [
          "Request written instructions",
          "Read back the key requirement",
          "Use a now/next checklist",
          "Leave a restart marker",
          "Keep materials together"
        ]
      },
      {
        "id": "plan",
        "type": "textarea",
        "label": "What will you capture and where will you find it?",
        "placeholder": "Pin the request beside the portal; tick each attachment after uploading."
      },
      {
        "id": "review",
        "type": "textarea",
        "label": "What will tell you to keep, adapt or stop this plan?",
        "placeholder": "Name one useful sign and one reason to change the plan. No improvement is information, not failure."
      }
    ],
    "prompts": [
      "Capture the instruction in a format you can use: text, audio or a photograph with permission.",
      "Keep only the current step and next step visible.",
      "Mark the restart point before interruptions; do not rely on remembering it later."
    ],
    "guidance": {
      "steps": [
        "Capture the instruction in a format you can use: text, audio or a photograph with permission.",
        "Keep only the current step and next step visible.",
        "Mark the restart point before interruptions; do not rely on remembering it later."
      ],
      "limits": "Do not record other people or confidential material without appropriate permission.",
      "sources": [
        [
          "NHS: adult ADHD",
          "https://www.nhs.uk/conditions/adhd-adults/"
        ]
      ],
      "outcome": "A specific plan based on your choices, which you can save, copy or download.",
      "rationale": "An original planning exercise informed by the linked background guidance; the exact app activity has not been clinically tested."
    }
  },
  {
    "id": "impulse-pause",
    "title": "Put a pause between an urge and a choice",
    "group": "decide",
    "short": "Create a short delay for a nonurgent purchase, post or commitment.",
    "tags": [
      "ADHD",
      "impulsivity",
      "impulse",
      "buying",
      "posting",
      "spending",
      "urgency"
    ],
    "fields": [
      {
        "id": "context",
        "type": "textarea",
        "label": "What is the urge and what makes it feel urgent?",
        "placeholder": "Buy a gadget now because the offer ends tonight."
      },
      {
        "id": "options",
        "type": "checks",
        "label": "Choose any workable options—or leave these blank",
        "options": [
          "Save to a wish list",
          "Remove one-click purchase",
          "Write a draft without sending",
          "Check existing budget",
          "Ask for time before committing"
        ]
      },
      {
        "id": "plan",
        "type": "textarea",
        "label": "When will you revisit and what will you check?",
        "placeholder": "Tomorrow after breakfast: total cost, whether I need it and what I would give up."
      },
      {
        "id": "review",
        "type": "textarea",
        "label": "What will tell you to keep, adapt or stop this plan?",
        "placeholder": "Name one useful sign and one reason to change the plan. No improvement is information, not failure."
      }
    ],
    "prompts": [
      "Name the urge and the need it might be serving.",
      "Put the action somewhere reversible: draft, wish list or unanswered invitation.",
      "Revisit at a chosen time using cost, priorities and consequences."
    ],
    "guidance": {
      "steps": [
        "Name the urge and the need it might be serving.",
        "Put the action somewhere reversible: draft, wish list or unanswered invitation.",
        "Revisit at a chosen time using cost, priorities and consequences."
      ],
      "limits": "For dangerous impulses, gambling harm or unmanageable spending, a short delay alone is not enough support.",
      "sources": [
        [
          "NHS: adult ADHD",
          "https://www.nhs.uk/conditions/adhd-adults/"
        ]
      ],
      "outcome": "A specific plan based on your choices, which you can save, copy or download.",
      "rationale": "An original planning exercise informed by the linked background guidance; the exact app activity has not been clinically tested."
    }
  },
  {
    "id": "change-preview",
    "title": "Prepare for an unexpected change",
    "group": "calm",
    "short": "Restore enough predictability when a plan changes.",
    "tags": [
      "autism",
      "routine",
      "uncertainty",
      "change",
      "neurodivergent",
      "predictability"
    ],
    "fields": [
      {
        "id": "context",
        "type": "textarea",
        "label": "What changed, and what remains predictable?",
        "placeholder": "The room changed, but the start time and person meeting me are the same."
      },
      {
        "id": "options",
        "type": "checks",
        "label": "Choose any workable options—or leave these blank",
        "options": [
          "Ask for a photo or map",
          "Confirm the next two steps",
          "Keep a familiar item",
          "Request extra transition time",
          "Choose an agreed backup"
        ]
      },
      {
        "id": "plan",
        "type": "textarea",
        "label": "What information or support will you request?",
        "placeholder": "Please send the entrance location and tell me who will meet me."
      },
      {
        "id": "review",
        "type": "textarea",
        "label": "What will tell you to keep, adapt or stop this plan?",
        "placeholder": "Name one useful sign and one reason to change the plan. No improvement is information, not failure."
      }
    ],
    "prompts": [
      "Write what changed and what is still the same.",
      "Find only the information needed for the next transition.",
      "Keep one familiar anchor and ask for a clearer sequence."
    ],
    "guidance": {
      "steps": [
        "Write what changed and what is still the same.",
        "Find only the information needed for the next transition.",
        "Keep one familiar anchor and ask for a clearer sequence."
      ],
      "limits": "Do not use this to force exposure to overwhelming settings; changing the demand may be the useful step.",
      "sources": [
        [
          "Autistica: supporting meltdowns and shutdowns",
          "https://www.autistica.org.uk/what-is-autism/supporting-meltdowns"
        ]
      ],
      "outcome": "A specific plan based on your choices, which you can save, copy or download.",
      "rationale": "An original planning exercise informed by the linked background guidance; the exact app activity has not been clinically tested."
    }
  },
  {
    "id": "processing-request",
    "title": "Ask for communication you can process",
    "group": "relate",
    "short": "Turn a processing barrier into a specific communication request.",
    "tags": [
      "autism",
      "ADHD",
      "processing",
      "time",
      "auditory",
      "communication",
      "neurodivergent"
    ],
    "fields": [
      {
        "id": "context",
        "type": "textarea",
        "label": "Which part of communication is difficult here?",
        "placeholder": "Several questions arrive before I have answered the first."
      },
      {
        "id": "options",
        "type": "checks",
        "label": "Choose any workable options—or leave these blank",
        "options": [
          "One question at a time",
          "Written summary",
          "Longer response time",
          "Direct wording",
          "Quiet setting",
          "Use my communication aid"
        ]
      },
      {
        "id": "plan",
        "type": "textarea",
        "label": "Write your preferred request.",
        "placeholder": "Please ask one question, then give me time. A written summary would help."
      },
      {
        "id": "review",
        "type": "textarea",
        "label": "What will tell you to keep, adapt or stop this plan?",
        "placeholder": "Name one useful sign and one reason to change the plan. No improvement is information, not failure."
      }
    ],
    "prompts": [
      "Identify whether pace, format, ambiguity or competing input is the barrier.",
      "Request one change that makes the message usable.",
      "Check understanding without pretending you understood to end the conversation."
    ],
    "guidance": {
      "steps": [
        "Identify whether pace, format, ambiguity or competing input is the barrier.",
        "Request one change that makes the message usable.",
        "Check understanding without pretending you understood to end the conversation."
      ],
      "limits": "Support needs do not require disclosing a diagnosis to this app. Keep only the details you want to share.",
      "sources": [
        [
          "NHS England: accessible information",
          "https://www.england.nhs.uk/long-read/accessible-information-standard-requirements-dapb1605/"
        ]
      ],
      "outcome": "A specific plan based on your choices, which you can save, copy or download.",
      "rationale": "An original planning exercise informed by the linked background guidance; the exact app activity has not been clinically tested."
    }
  },
  {
    "id": "reading-access",
    "title": "Make a reading or writing task more accessible",
    "group": "think",
    "short": "Match the format of a task to the part that is causing difficulty.",
    "tags": [
      "dyslexia",
      "reading",
      "writing",
      "spelling",
      "literacy",
      "access",
      "neurodivergent"
    ],
    "fields": [
      {
        "id": "context",
        "type": "textarea",
        "label": "What part of this task creates the barrier?",
        "placeholder": "I understand spoken material but lose my place in long written instructions."
      },
      {
        "id": "options",
        "type": "checks",
        "label": "Choose any workable options—or leave these blank",
        "options": [
          "Text-to-speech",
          "Speech-to-text",
          "Shorter chunks",
          "Clear headings",
          "Extra processing time",
          "Proofread separately from drafting"
        ]
      },
      {
        "id": "plan",
        "type": "textarea",
        "label": "What format will you test and how will you judge fit?",
        "placeholder": "Listen to one paragraph while following the text; compare effort with reading alone."
      },
      {
        "id": "review",
        "type": "textarea",
        "label": "What will tell you to keep, adapt or stop this plan?",
        "placeholder": "Name one useful sign and one reason to change the plan. No improvement is information, not failure."
      }
    ],
    "prompts": [
      "Separate understanding ideas from decoding, spelling and formatting.",
      "Trial one accessible format on a short section.",
      "Check whether it reduces effort or errors before applying it to everything."
    ],
    "guidance": {
      "steps": [
        "Separate understanding ideas from decoding, spelling and formatting.",
        "Trial one accessible format on a short section.",
        "Check whether it reduces effort or errors before applying it to everything."
      ],
      "limits": "No font, colour or technology suits everyone. This is not a dyslexia assessment or a promised treatment.",
      "sources": [
        [
          "NHS: dyslexia in adults",
          "https://www.nhs.uk/conditions/dyslexia-in-adults/"
        ]
      ],
      "outcome": "A specific plan based on your choices, which you can save, copy or download.",
      "rationale": "An original planning exercise informed by the linked background guidance; the exact app activity has not been clinically tested."
    }
  },
  {
    "id": "coordination-plan",
    "title": "Adapt a task that is hard to coordinate",
    "group": "decide",
    "short": "Change equipment, positioning or sequence instead of simply trying harder.",
    "tags": [
      "dyspraxia",
      "DCD",
      "coordination",
      "motor",
      "planning",
      "daily",
      "living"
    ],
    "fields": [
      {
        "id": "context",
        "type": "textarea",
        "label": "Which step is difficult, and what makes it harder?",
        "placeholder": "Holding a container steady while opening it; rushing and clutter make it worse."
      },
      {
        "id": "options",
        "type": "checks",
        "label": "Choose any workable options—or leave these blank",
        "options": [
          "Stable non-slip surface",
          "Seated setup",
          "Easy-grip equipment",
          "Picture sequence",
          "Extra time",
          "Ask for practical assistance"
        ]
      },
      {
        "id": "plan",
        "type": "textarea",
        "label": "What adaptation will you try safely?",
        "placeholder": "Clear the surface and use a suitable non-slip mat before opening the container."
      },
      {
        "id": "review",
        "type": "textarea",
        "label": "What will tell you to keep, adapt or stop this plan?",
        "placeholder": "Name one useful sign and one reason to change the plan. No improvement is information, not failure."
      }
    ],
    "prompts": [
      "Name the precise movement or sequence that creates difficulty.",
      "Break it into stable steps and identify a practical aid or safer setup.",
      "Try an adaptation on a low-risk version; ask for occupational-therapy advice where needed."
    ],
    "guidance": {
      "steps": [
        "Name the precise movement or sequence that creates difficulty.",
        "Break it into stable steps and identify a practical aid or safer setup.",
        "Try an adaptation on a low-risk version; ask for occupational-therapy advice where needed."
      ],
      "limits": "Do not practise risky movements with hot, sharp or heavy items alone. New or worsening coordination problems need medical review.",
      "sources": [
        [
          "NHS: dyspraxia in adults",
          "https://www.nhs.uk/conditions/developmental-coordination-disorder-dyspraxia-in-adults/"
        ]
      ],
      "outcome": "A specific plan based on your choices, which you can save, copy or download.",
      "rationale": "An original planning exercise informed by the linked background guidance; the exact app activity has not been clinically tested."
    }
  },
  {
    "id": "appointment-brief",
    "title": "Prepare a short brief for a support appointment",
    "group": "think",
    "short": "Make the main concern, daily impact and access needs easier to communicate.",
    "tags": [
      "appointment",
      "doctor",
      "health",
      "advocate",
      "communication",
      "symptoms",
      "access"
    ],
    "fields": [
      {
        "id": "context",
        "type": "textarea",
        "label": "What is the concern and how does it affect everyday life?",
        "placeholder": "For three weeks I have struggled to sleep and missed morning commitments."
      },
      {
        "id": "options",
        "type": "checks",
        "label": "Choose any workable options—or leave these blank",
        "options": [
          "Bring written notes",
          "Ask for a written plan",
          "Request processing time",
          "Bring a supporter with consent",
          "Ask how to follow up"
        ]
      },
      {
        "id": "plan",
        "type": "textarea",
        "label": "What are your top two questions and access request?",
        "placeholder": "What should we check? What is the next step? Please write the plan down."
      },
      {
        "id": "review",
        "type": "textarea",
        "label": "What will tell you to keep, adapt or stop this plan?",
        "placeholder": "Name one useful sign and one reason to change the plan. No improvement is information, not failure."
      }
    ],
    "prompts": [
      "Choose the most important concern and a concrete example.",
      "Include onset, changes and current support without trying to diagnose yourself.",
      "Write the questions you want answered and how you need information provided."
    ],
    "guidance": {
      "steps": [
        "Choose the most important concern and a concrete example.",
        "Include onset, changes and current support without trying to diagnose yourself.",
        "Write the questions you want answered and how you need information provided."
      ],
      "limits": "Do not use appointment preparation to delay urgent care for new severe symptoms.",
      "sources": [
        [
          "NHS England: accessible information",
          "https://www.england.nhs.uk/long-read/accessible-information-standard-requirements-dapb1605/"
        ]
      ],
      "outcome": "A specific plan based on your choices, which you can save, copy or download.",
      "rationale": "An original planning exercise informed by the linked background guidance; the exact app activity has not been clinically tested."
    }
  },
  {
    "id": "care-balance",
    "title": "Ask for help when caring for someone is too much",
    "group": "relate",
    "short": "Separate essential care from the expectation that you must do every part alone.",
    "tags": [
      "caregiver",
      "carer",
      "burden",
      "burnout",
      "help",
      "family",
      "responsibility"
    ],
    "fields": [
      {
        "id": "context",
        "type": "textarea",
        "label": "What responsibility is hardest to sustain?",
        "placeholder": "Transport, calls and paperwork around repeated appointments."
      },
      {
        "id": "options",
        "type": "checks",
        "label": "Choose any workable options—or leave these blank",
        "options": [
          "Ask someone to handle transport",
          "Share appointment administration",
          "Arrange a planned break",
          "Request a carer-support discussion",
          "Simplify an optional task"
        ]
      },
      {
        "id": "plan",
        "type": "textarea",
        "label": "Who will you ask, for what, and what is the backup?",
        "placeholder": "Ask my sibling to organise transport this week; if unavailable, ask the service about options."
      },
      {
        "id": "review",
        "type": "textarea",
        "label": "What will tell you to keep, adapt or stop this plan?",
        "placeholder": "Name one useful sign and one reason to change the plan. No improvement is information, not failure."
      }
    ],
    "prompts": [
      "List one essential responsibility and the tasks around it.",
      "Identify who can safely share the work, including formal support where available.",
      "Ask for a specific task and timing while protecting the cared-for person’s needs."
    ],
    "guidance": {
      "steps": [
        "List one essential responsibility and the tasks around it.",
        "Identify who can safely share the work, including formal support where available.",
        "Ask for a specific task and timing while protecting the cared-for person’s needs."
      ],
      "limits": "Do not abandon essential care or assume another person has taken over without agreement. This tool is not a care assessment.",
      "sources": [
        [
          "National Autistic Society: autistic fatigue",
          "https://www.autism.org.uk/advice-and-guidance/mental-health/autistic-fatigue/autistic-adults"
        ]
      ],
      "outcome": "A specific plan based on your choices, which you can save, copy or download.",
      "rationale": "An original planning exercise informed by the linked background guidance; the exact app activity has not been clinically tested."
    }
  }
];
