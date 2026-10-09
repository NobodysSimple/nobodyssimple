import { escapeHTML as esc, safeHref } from "./core.mjs";

const action = (label, href) => ({ label, href });
const service = (country, region, name, type, description, topics, contact, url, availability, note = "") => ({
  country,
  region,
  name,
  type,
  description,
  topics,
  contact,
  url,
  availability,
  note,
});

export const referralCountries = [
  ["GB", "United Kingdom"],
  ["IE", "Ireland"],
  ["US", "United States"],
  ["CA", "Canada"],
  ["AU", "Australia"],
  ["NZ", "New Zealand"],
  ["FR", "France"],
  ["DE", "Germany"],
  ["ES", "Spain"],
  ["IT", "Italy"],
  ["NL", "Netherlands"],
  ["BE", "Belgium"],
  ["PL", "Poland"],
  ["CZ", "Czechia"],
  ["IN", "India"],
  ["SG", "Singapore"],
  ["HK", "Hong Kong"],
  ["JP", "Japan"],
  ["MY", "Malaysia"],
  ["IL", "Israel"],
  ["ZA", "South Africa"],
  ["AR", "Argentina"],
  ["BR", "Brazil"],
  ["CL", "Chile"],
  ["MX", "Mexico"],
];

const countryName = new Map(referralCountries);
const global = "GLOBAL";

export const emergencyNumbers = {
  GB: "999 or 112",
  IE: "112 or 999",
  US: "911",
  CA: "911",
  AU: "000",
  NZ: "111",
  IN: "112",
  SG: "995 for ambulance/fire · 999 for police",
  FR: "112",
  DE: "112",
  ES: "112",
  IT: "112",
  NL: "112",
  BE: "112",
  PL: "112",
  CZ: "112",
  IL: "100 police · 101 MDA ambulance",
};

export const referralServices = [
  service(global, "Worldwide", "Find A Helpline", "Live directory", "Verified helplines across 150+ countries. Search by country, topic and contact method.", ["crisis", "suicide", "mental health", "domestic abuse", "sexual violence", "LGBTQIA+", "youth", "substance use", "bereavement", "veterans", "Indigenous", "worried about someone else"], {}, "https://findahelpline.com/", "Directory availability varies by service", "Use when your country is not listed or you are travelling."),
  service(global, "Worldwide", "Befrienders Worldwide", "Live directory", "Emotional support and suicide-prevention centres around the world.", ["crisis", "suicide", "mental health", "general listening"], {}, "https://www.befrienders.org/", "Centre availability varies", "Use as a second global route when you need a listening service."),

  service("GB", "United Kingdom", "NHS 111 mental-health option", "Urgent mental-health routing", "Urgent mental-health support in England.", ["crisis", "mental health", "worried about someone else"], { phone: action("Call 111", "tel:111") }, "https://www.nhs.uk/nhs-services/mental-health-services/where-to-get-urgent-help-for-mental-health/", "24/7 routing", "Call 111 and select the mental-health option."),
  service("GB", "United Kingdom", "Samaritans", "Crisis and listening support", "Emotional support when you are struggling or thinking about suicide.", ["crisis", "suicide", "general listening", "worried about someone else"], { phone: action("Call 116 123", "tel:116123") }, "https://www.samaritans.org/", "24/7", "UK and Ireland."),
  service("GB", "United Kingdom", "Shout", "Text crisis support", "Confidential text-based support from trained volunteers.", ["crisis", "suicide", "general listening"], { text: action("Text SHOUT to 85258", "sms:85258?body=SHOUT") }, "https://giveusashout.org/get-help/", "24/7", "Text SHOUT to 85258."),
  service("GB", "United Kingdom", "PAPYRUS HOPELINE247", "Youth suicide support", "Support for people under 35 with suicidal thoughts, and anyone worried about a young person.", ["crisis", "suicide", "youth", "worried about someone else"], { phone: action("Call 0800 068 4141", "tel:08000684141"), text: action("Text 88247", "sms:88247") }, "https://www.papyrus-uk.org/", "24/7", "For under-35s and people supporting a young person."),
  service("GB", "United Kingdom", "National Domestic Abuse Helpline", "Domestic-abuse support", "Support and safety planning for people experiencing domestic abuse in England.", ["domestic abuse", "crisis"], { phone: action("Call 0808 2000 247", "tel:08082000247") }, "https://www.nationaldahelpline.org.uk/", "24/7", "England."),
  service("GB", "United Kingdom", "Rape Crisis support line", "Sexual-violence support", "Support after rape, sexual assault or sexual abuse.", ["sexual violence", "crisis"], { phone: action("Call 0808 500 2222", "tel:08085002222"), chat: action("Open online chat", "https://rapecrisis.org.uk/get-help/want-to-talk/") }, "https://rapecrisis.org.uk/get-help/want-to-talk/", "24/7", "England and Wales."),
  service("GB", "United Kingdom", "The Mix", "Youth support", "Information and emotional support for people under 25.", ["youth", "mental health", "general listening"], { phone: action("Call 0808 808 4994", "tel:08088084994") }, "https://www.themix.org.uk/", "Check current hours", "Specialist youth support."),
  service("GB", "United Kingdom", "Switchboard LGBT+", "LGBTQIA+ listening support", "Information, support and referral for LGBTQIA+ people.", ["LGBTQIA+", "general listening"], { phone: action("Call 0800 0119 100", "tel:08000119100") }, "https://switchboard.lgbt/", "Check current hours", "LGBTQIA+ service."),
  service("GB", "United Kingdom", "Campaign Against Living Miserably (CALM)", "Crisis support", "Support for anyone who is struggling, particularly around suicide.", ["crisis", "suicide", "general listening"], { phone: action("Call 0800 58 58 58", "tel:0800585858") }, "https://www.thecalmzone.net/", "Check current hours", "Specialist service for people in the UK."),
  service("GB", "United Kingdom", "FRANK", "Substance-use support", "Information and support about drugs and alcohol.", ["substance use", "mental health"], { phone: action("Call 0300 123 6600", "tel:03001236600") }, "https://www.talktofrank.com/", "Check current hours", "Specialist substance-use information and referral."),
  service("GB", "United Kingdom", "Cruse Bereavement Support", "Bereavement support", "Support after someone has died.", ["bereavement", "general listening"], { phone: action("Call 0808 808 1677", "tel:08088081677") }, "https://www.cruse.org.uk/", "Check current hours", "UK bereavement support."),
  service("IE", "Ireland", "Samaritans", "Crisis and listening support", "Emotional support when you are struggling or thinking about suicide.", ["crisis", "suicide", "general listening", "worried about someone else"], { phone: action("Call 116 123", "tel:116123") }, "https://www.samaritans.org/", "24/7", "UK and Ireland."),
  service("IE", "Ireland", "Women’s Aid", "Domestic-abuse support", "Support for women experiencing domestic abuse in Ireland.", ["domestic abuse", "crisis"], { phone: action("Call 1800 341 900", "tel:1800341900") }, "https://www.womensaid.ie/", "Check current hours", "Ireland."),

  service("US", "United States", "988 Suicide & Crisis Lifeline", "Crisis support", "Call, text or chat with trained crisis counsellors.", ["crisis", "suicide", "mental health", "worried about someone else"], { phone: action("Call 988", "tel:988"), text: action("Text 988", "sms:988"), chat: action("Open chat", "https://988lifeline.org/") }, "https://988lifeline.org/", "24/7", "US."),
  service("US", "United States", "Veterans Crisis Line", "Veterans crisis support", "Crisis support for veterans, service members, National Guard, Reserve and their loved ones.", ["crisis", "suicide", "veterans", "worried about someone else"], { phone: action("Call 988, then press 1", "tel:988"), text: action("Text 838255", "sms:838255"), chat: action("Open chat", "https://www.veteranscrisisline.net/") }, "https://www.veteranscrisisline.net/", "24/7", "Press 1 after calling 988."),
  service("US", "United States", "SAMHSA National Helpline", "Treatment and referral", "Mental-health and substance-use treatment information and referral.", ["mental health", "substance use"], { phone: action("Call 1-800-662-4357", "tel:18006624357") }, "https://www.samhsa.gov/find-help/helplines/national-helpline", "24/7", "US treatment and referral service."),
  service("US", "United States", "RAINN National Sexual Assault Hotline", "Sexual-violence support", "Support and information after sexual assault.", ["sexual violence", "crisis"], { phone: action("Call 800-656-HOPE", "tel:18006564673"), text: action("Text HOPE to 64673", "sms:64673?body=HOPE"), chat: action("Open chat", "https://rainn.org/help-and-healing/hotline/") }, "https://rainn.org/help-and-healing/hotline/", "Check current hours", "US."),
  service("US", "United States", "National Domestic Violence Hotline", "Domestic-abuse support", "Safety planning and support for people experiencing domestic violence.", ["domestic abuse", "crisis", "worried about someone else"], { phone: action("Call 1-800-799-SAFE", "tel:18007997233"), text: action("Text START to 88788", "sms:88788?body=START"), chat: action("Open chat", "https://www.thehotline.org/get-help/") }, "https://www.thehotline.org/get-help/", "24/7", "US."),
  service("US", "United States", "The Trevor Project", "LGBTQIA+ youth support", "Crisis support for LGBTQIA+ young people.", ["LGBTQIA+", "youth", "crisis", "suicide"], { phone: action("Call 1-866-488-7386", "tel:18664887386"), text: action("Text START to 678678", "sms:678678?body=START"), chat: action("Open chat", "https://www.thetrevorproject.org/get-help/") }, "https://www.thetrevorproject.org/get-help/", "Check current hours", "US LGBTQIA+ youth service."),

  service("CA", "Canada", "9-8-8 Suicide Crisis Helpline", "Crisis support", "Call or text for suicide-prevention and crisis support.", ["crisis", "suicide", "mental health", "worried about someone else"], { phone: action("Call 9-8-8", "tel:988"), text: action("Text 9-8-8", "sms:988") }, "https://988.ca/", "24/7/365", "Canada."),
  service("CA", "Canada", "Hope for Wellness", "Indigenous support", "Counselling and crisis intervention for First Nations, Inuit and Métis people.", ["Indigenous", "crisis", "mental health"], { phone: action("Call 1-855-242-3310", "tel:18552423310"), chat: action("Open online support", "https://www.hopeforwellness.ca/") }, "https://www.hopeforwellness.ca/", "24/7", "First Nations, Inuit and Métis support."),
  service("CA", "Canada", "Kids Help Phone", "Youth support", "Support for young people across Canada.", ["youth", "crisis", "mental health"], { phone: action("Call 1-800-668-6868", "tel:18006686868"), text: action("Text CONNECT to 686868", "sms:686868?body=CONNECT") }, "https://kidshelpphone.ca/", "Check current hours", "Canada."),
  service("CA", "Canada", "ShelterSafe", "Domestic-abuse directory", "A directory for finding nearby shelters and domestic-abuse services.", ["domestic abuse", "crisis"], {}, "https://sheltersafe.ca/", "Directory availability varies", "Canada."),

  service("AU", "Australia", "Lifeline Australia", "Crisis and listening support", "Crisis support and suicide prevention.", ["crisis", "suicide", "general listening"], { phone: action("Call 13 11 14", "tel:131114"), text: action("Text 0477 13 11 14", "sms:0477131114"), chat: action("Open chat", "https://www.lifeline.org.au/get-help/") }, "https://www.lifeline.org.au/get-help/", "24/7", "Australia."),
  service("AU", "Australia", "1800RESPECT", "Sexual/domestic-violence support", "Support for people affected by sexual assault, domestic or family violence.", ["domestic abuse", "sexual violence", "crisis"], { phone: action("Call 1800 737 732", "tel:1800737732"), text: action("Text 0458 737 732", "sms:0458737732"), chat: action("Open chat", "https://www.1800respect.org.au/") }, "https://www.1800respect.org.au/", "Check current hours", "Australia."),
  service("AU", "Australia", "Beyond Blue", "Mental-health support", "Information and support for anxiety, depression and suicide concerns.", ["mental health", "crisis", "suicide"], { phone: action("Call 1300 22 4636", "tel:1300224636") }, "https://www.beyondblue.org.au/", "Check current hours", "Australia."),
  service("AU", "Australia", "Kids Helpline", "Youth support", "Counselling and support for young people.", ["youth", "crisis", "mental health"], { phone: action("Call 1800 55 1800", "tel:1800551800") }, "https://kidshelpline.com.au/", "Check current hours", "Australia."),
  service("AU", "Australia", "MensLine Australia", "Men’s support", "Telephone and online support for men.", ["mental health", "crisis", "general listening"], { phone: action("Call 1300 78 99 78", "tel:1300789978") }, "https://mensline.org.au/", "24/7", "Australia."),
  service("AU", "Australia", "National Alcohol and Other Drug Hotline", "Substance-use support", "Information, support and referral for alcohol and other drug concerns.", ["substance use", "mental health"], { phone: action("Call 1800 250 015", "tel:1800250015") }, "https://www.health.gov.au/contacts/national-alcohol-and-other-drug-hotline", "Check current hours", "Australia."),
  service("AU", "Australia", "Griefline", "Bereavement support", "Support for people experiencing grief and loss.", ["bereavement", "general listening"], { phone: action("Call 1300 845 745", "tel:1300845745") }, "https://griefline.org.au/", "Check current hours", "Australia."),

  service("NZ", "New Zealand", "1737 Need to Talk?", "Crisis and listening support", "Free call or text support from a trained counsellor.", ["crisis", "suicide", "mental health", "general listening"], { phone: action("Call 1737", "tel:1737"), text: action("Text 1737", "sms:1737") }, "https://1737.org.nz/", "24/7", "New Zealand."),
  service("NZ", "New Zealand", "Lifeline Aotearoa", "Crisis and listening support", "Crisis support and suicide prevention.", ["crisis", "suicide", "general listening"], { phone: action("Call 0800 543 354", "tel:0800543354"), text: action("Text HELP to 4357", "sms:4357?body=HELP") }, "https://www.lifeline.org.nz/", "Check current hours", "Crisis line: 0508 828 865."),
  service("NZ", "New Zealand", "Youthline", "Youth support", "Support for young people and people supporting them.", ["youth", "crisis", "mental health", "worried about someone else"], { phone: action("Call 0800 376 633", "tel:0800376633"), text: action("Text 234", "sms:234"), chat: action("Open webchat", "https://youthline.co.nz/") }, "https://youthline.co.nz/", "Check current hours", "New Zealand."),
  service("NZ", "New Zealand", "Outline", "LGBTQIA+ support", "Support for LGBTQIA+ people in New Zealand.", ["LGBTQIA+", "general listening", "crisis"], { phone: action("Call 0800 688 5463", "tel:08006885463") }, "https://outline.org.nz/", "Check current hours", "New Zealand."),

  service("FR", "Europe", "3114", "Suicide-prevention support", "National suicide-prevention line.", ["crisis", "suicide", "mental health"], { phone: action("Call 3114", "tel:3114") }, "https://3114.fr/", "24/7", "France."),
  service("DE", "Europe", "TelefonSeelsorge", "Crisis and listening support", "Confidential emotional support by phone.", ["crisis", "suicide", "general listening"], { phone: action("Call 0800 111 0 111", "tel:08001110111") }, "https://www.telefonseelsorge.de/", "Day and night", "Other numbers: 0800 111 0 222 and 116 123."),
  service("ES", "Europe", "024", "Suicide-prevention support", "National suicide-prevention line and online chat.", ["crisis", "suicide", "mental health"], { phone: action("Call 024", "tel:024"), chat: action("Open online chat", "https://www.sanidad.gob.es/linea024/home.htm") }, "https://www.sanidad.gob.es/linea024/home.htm", "24/7", "Spain."),
  service("IT", "Europe", "Telefono Amico Italia", "Crisis and listening support", "Phone and WhatsApp emotional support.", ["crisis", "suicide", "general listening"], { phone: action("Call 02 2327 2327", "tel:0223272327"), text: action("WhatsApp 324 011 7252", "https://wa.me/393240117252") }, "https://www.telefonoamico.it/", "Phone 24/7 · WhatsApp varies", "Italy."),
  service("NL", "Europe", "113 Zelfmoordpreventie", "Suicide-prevention support", "Phone, chat and online support.", ["crisis", "suicide", "mental health"], { phone: action("Call 113 or 0800-0113", "tel:113"), chat: action("Open chat", "https://www.113.nl/") }, "https://www.113.nl/", "Day and night", "Netherlands."),
  service("BE", "Europe", "1813", "Suicide-prevention support", "Suicide-prevention line.", ["crisis", "suicide", "mental health"], { phone: action("Call 1813", "tel:1813") }, "https://www.zelfmoord1813.be/", "24/7", "Dutch-speaking Belgium."),
  service("PL", "Europe", "Centrum Wsparcia", "Crisis support", "Crisis support line.", ["crisis", "suicide", "mental health"], { phone: action("Call 800 70 2222", "tel:800702222") }, "https://liniawsparcia.pl/", "24/7", "Poland."),
  service("PL", "Europe", "116 123 adult support", "Listening support", "Adult emotional support line.", ["crisis", "general listening"], { phone: action("Call 116 123", "tel:116123") }, "https://116sos.pl/", "Check current hours", "Poland."),
  service("PL", "Europe", "116 111 young people", "Youth support", "Support for children and young people.", ["youth", "crisis", "mental health"], { phone: action("Call 116 111", "tel:116111") }, "https://116111.pl/", "Check current hours", "Poland."),
  service("CZ", "Europe", "Czech crisis and child helplines", "Crisis and youth support", "Czech national 116 services, including adult and youth support.", ["crisis", "suicide", "youth", "domestic abuse"], { phone: action("Call 116 123", "tel:116123") }, "https://portal.gov.cz/en/informace/116-INF-415", "Check current hours", "116 123 adult support · 116 111 young people · 116 016/116 006 violence and crime support."),

  service("IN", "Asia", "Tele-MANAS", "Mental-health support", "National mental-health support line.", ["crisis", "mental health", "suicide"], { phone: action("Call 14416", "tel:14416") }, "https://dghs.mohfw.gov.in/national-mental-health-programme.php", "Check current hours", "Also 1800-89-14416."),
  service("SG", "Asia", "Samaritans of Singapore", "Crisis and listening support", "Emotional support and suicide prevention.", ["crisis", "suicide", "general listening"], { phone: action("Call 1767", "tel:1767"), text: action("WhatsApp 9151 1767", "https://wa.me/6591511767") }, "https://www.sos.org.sg/", "24/7", "Singapore."),
  service("HK", "Asia", "Samaritan Befrienders Hong Kong", "Crisis and listening support", "Emotional support and suicide prevention.", ["crisis", "suicide", "general listening"], { phone: action("Call 2389 2222", "tel:23892222") }, "https://sbhk.org.hk/", "Check current hours", "Hong Kong."),
  service("HK", "Asia", "The Samaritans Hong Kong", "Crisis and listening support", "Emotional support and suicide prevention.", ["crisis", "suicide", "general listening"], { phone: action("Call +852 2896 0000", "tel:+85228960000") }, "https://samaritans.org.hk/", "Check current hours", "Hong Kong."),
  service("HK", "Asia", "Suicide Prevention Services", "Suicide-prevention support", "Suicide-prevention support.", ["crisis", "suicide"], { phone: action("Call 2382 0000", "tel:23820000") }, "https://www.sps.org.hk/", "Check current hours", "Hong Kong."),
  service("HK", "Asia", "Mental Health Direct", "Mental-health support", "Mental-health information and support.", ["mental health", "crisis"], { phone: action("Call 2466 7350", "tel:24667350") }, "https://www.ha.org.hk/", "Check current hours", "Hong Kong."),
  service("JP", "Asia", "Yorisoi Hotline", "Crisis and listening support", "Support including a foreign-language route.", ["crisis", "suicide", "general listening"], { phone: action("Call 0120-279-338", "tel:0120279338") }, "https://www.since2011.net/yorisoi/", "Check current hours", "Press 2 for the foreign-language route."),
  service("MY", "Asia", "Befrienders KL", "Crisis and listening support", "Emotional support and suicide prevention.", ["crisis", "suicide", "general listening"], { phone: action("Call +603-7627 2929", "tel:+60376272929") }, "https://befrienders.org.my/", "24 hours", "Malaysia."),

  service("IL", "Middle East", "ERAN", "Crisis and listening support", "Emotional first aid and crisis support.", ["crisis", "suicide", "general listening"], { phone: action("Call 1201", "tel:1201"), chat: action("Open written support", "https://en.eran.org.il/") }, "https://en.eran.org.il/", "Check current hours", "Israel."),
  service("ZA", "Africa", "SADAG Suicide Crisis Line", "Suicide-prevention support", "Suicide crisis support.", ["crisis", "suicide"], { phone: action("Call 0800 567 567", "tel:0800567567") }, "https://www.sadag.org/", "Check current hours", "South Africa."),
  service("ZA", "Africa", "SADAG Mental Health Line", "Mental-health support", "Mental-health information and support.", ["mental health", "crisis"], { phone: action("Call 0800 456 789", "tel:0800456789") }, "https://www.sadag.org/", "Check current hours", "South Africa."),
  service("ZA", "Africa", "SADAG Substance Abuse Line", "Substance-use support", "Support for substance-use concerns.", ["substance use", "mental health"], { phone: action("Call 0800 12 13 14", "tel:0800121314") }, "https://www.sadag.org/", "Check current hours", "South Africa."),
  service("ZA", "Africa", "LifeLine South Africa", "Crisis and listening support", "Emotional support and counselling referral.", ["crisis", "mental health", "general listening"], { phone: action("Call 0861 322 322", "tel:0861322322") }, "https://lifeline.co.za/", "Check current hours", "South Africa."),
  service("AR", "Latin America", "Centro de Asistencia al Suicida", "Suicide-prevention support", "Suicide-prevention line.", ["crisis", "suicide"], { phone: action("Call 135", "tel:135") }, "https://www.asistenciaalsuicida.org.ar/", "Check current hours", "135 in Buenos Aires/GBA · (011) 5275-1135 or 0800 345 1435 elsewhere."),
  service("BR", "Latin America", "CVV", "Crisis and listening support", "Emotional support by phone and online.", ["crisis", "suicide", "general listening"], { phone: action("Call 188", "tel:188"), chat: action("Open chat", "https://cvv.org.br/") }, "https://cvv.org.br/", "24/7", "Brazil."),
  service("CL", "Latin America", "*4141", "Youth suicide-prevention support", "Suicide-prevention line for young people.", ["crisis", "suicide", "youth"], { phone: action("Call *4141", "tel:*4141") }, "https://www.ventanillaunicasocial.gob.cl/ficha/310/fono-prevencion-suicidio", "Check current hours", "Chile."),
  service("MX", "Latin America", "Línea de la Vida", "Crisis and mental-health support", "National crisis, mental-health and substance-use support.", ["crisis", "suicide", "mental health", "substance use"], { phone: action("Call 800 911 2000", "tel:8009112000") }, "https://www.gob.mx/conasama/es/articulos/linea-de-la-vida-800-911-2000", "24/7/365", "Mexico."),
];

const primaryByCountry = {
  GB: "Samaritans",
  IE: "Samaritans",
  US: "988 Suicide & Crisis Lifeline",
  CA: "9-8-8 Suicide Crisis Helpline",
  AU: "Lifeline Australia",
  NZ: "1737 Need to Talk?",
  FR: "3114",
  DE: "TelefonSeelsorge",
  ES: "024",
  IT: "Telefono Amico Italia",
  NL: "113 Zelfmoordpreventie",
  BE: "1813",
  PL: "Centrum Wsparcia",
  CZ: "Czech crisis and child helplines",
  IN: "Tele-MANAS",
  SG: "Samaritans of Singapore",
  HK: "The Samaritans Hong Kong",
  JP: "Yorisoi Hotline",
  MY: "Befrienders KL",
  IL: "ERAN",
  ZA: "SADAG Suicide Crisis Line",
  AR: "Centro de Asistencia al Suicida",
  BR: "CVV",
  CL: "*4141",
  MX: "Línea de la Vida",
};

const topicLabels = [
  ["crisis", "Crisis or suicide support"],
  ["domestic abuse", "Domestic abuse"],
  ["sexual violence", "Sexual violence"],
  ["LGBTQIA+", "LGBTQIA+ support"],
  ["youth", "Young people"],
  ["substance use", "Alcohol or drugs"],
  ["bereavement", "Bereavement"],
  ["veterans", "Veterans and service members"],
  ["Indigenous", "Indigenous support"],
  ["worried about someone else", "Worried about someone else"],
];

function guessedCountry() {
  const language = String(navigator.language || "").toLowerCase();
  if (language.includes("en-gb")) return "GB";
  if (language.includes("en-au")) return "AU";
  if (language.includes("en-nz")) return "NZ";
  if (language.includes("en-ca")) return "CA";
  if (language.includes("en-us")) return "US";
  return "";
}

function serviceCard(item, featured = false) {
  const actions = Object.values(item.contact || {})
    .filter(Boolean)
    .map((a) => `<a class="button ${featured ? "" : "secondary"} small" href="${esc(safeHref(a.href))}" ${a.href.startsWith("http") ? 'target="_blank" rel="noopener noreferrer"' : ""}>${esc(a.label)}</a>`)
    .join("");
  const official = safeHref(item.url);
  return `<article class="referral-card ${featured ? "referral-card-featured" : ""}"><p class="eyebrow">${esc(item.region)} · ${esc(item.type)}</p><h3>${esc(item.name)}</h3><p>${esc(item.description)}</p><div class="referral-meta"><span><strong>Availability:</strong> ${esc(item.availability)}</span>${item.note ? `<span>${esc(item.note)}</span>` : ""}</div><div class="referral-actions">${actions}${official ? `<a class="referral-official" href="${esc(official)}" target="_blank" rel="noopener noreferrer">Official service ↗</a>` : ""}</div></article>`;
}

function renderEmergency(country) {
  const number = emergencyNumbers[country];
  const place = countryName.get(country) || "your area";
  return `<div class="support-emergency"><div><p class="eyebrow">If there is immediate danger</p><h2>Call emergency services now.</h2><p>If you might act on thoughts of harming yourself or someone else, or someone is in immediate danger, call ${number ? `<strong>${esc(number)}</strong>` : "your local emergency number"} in ${esc(place)}. If you can, ask someone nearby to stay with you.</p></div>${number ? `<a class="button bright" href="${esc(safeHref(`tel:${number.split(" ")[0]}`))}">Call ${esc(number)} ↗</a>` : `<a class="button bright" href="https://findahelpline.com/" target="_blank" rel="noopener noreferrer">Find local help ↗</a>`}</div>`;
}

export function renderSupport(main) {
  const defaultCountry = guessedCountry();
  main.innerHTML = `<div class="wrap support-page"><section class="support-intro"><p class="eyebrow">Real-world support</p><h1>If you need a person, start here.</h1><p class="lead">These are crisis lines, listening services, specialist organisations and live directories outside Nobody’s Simple. You do not need to finish a reflection or use a tool before reaching out.</p><p class="fine">Choose your country to see the most relevant options. You can change it at any time, including if you are travelling.</p></section><div id="support-emergency"></div><section class="support-controls" aria-label="Find a support service"><label>Country or area<select id="referral-country"><option value="">Choose your country or use global directories</option>${referralCountries.map(([code, label]) => `<option value="${code}" ${code === defaultCountry ? "selected" : ""}>${esc(label)}</option>`).join("")}</select></label><label>What kind of support do you need?<select id="referral-topic"><option value="">Show all support</option>${topicLabels.map(([value, label]) => `<option value="${esc(value)}">${esc(label)}</option>`).join("")}</select></label></section><section id="support-primary"></section><section class="support-directory"><div class="section-head"><div><p class="eyebrow">Browse the directory</p><h2>More services and specialist routes.</h2></div><p class="fine" id="support-count"></p></div><div class="referral-grid" id="support-results"></div></section><section class="support-note"><h3>A note about this list</h3><p>Services can change their hours or contact routes. Check the official service page before relying on a limited-hours option. If your country is not listed, start with <a href="https://findahelpline.com/" target="_blank" rel="noopener noreferrer">Find A Helpline ↗</a> or <a href="https://www.befrienders.org/" target="_blank" rel="noopener noreferrer">Befrienders Worldwide ↗</a>.</p><p class="fine">Nobody’s Simple is not an emergency service, does not diagnose, and cannot provide treatment.</p></section></div>`;

  const country = document.getElementById("referral-country");
  const topic = document.getElementById("referral-topic");
  const update = () => {
    const selected = country.value;
    const selectedTopic = topic.value;
    document.getElementById("support-emergency").innerHTML = renderEmergency(selected);
    const primaryName = primaryByCountry[selected];
    const primary = referralServices.find((item) => item.name === primaryName);
    document.getElementById("support-primary").innerHTML = primary
      ? `<section class="support-primary"><div><p class="eyebrow">A first route${countryName.get(selected) ? ` in ${esc(countryName.get(selected))}` : ""}</p><h2>Talk to someone now.</h2><p>Start with a crisis or listening service. You can choose another route below if this is not the right fit.</p></div>${serviceCard(primary, true)}</section>`
      : `<section class="support-primary"><div><p class="eyebrow">Country not selected</p><h2>Find a live directory.</h2><p>Find A Helpline can help you locate a current service by country and topic. Befrienders Worldwide is another route for emotional support centres.</p></div><div class="referral-actions"><a class="button" href="https://findahelpline.com/" target="_blank" rel="noopener noreferrer">Find A Helpline ↗</a><a class="button secondary" href="https://www.befrienders.org/" target="_blank" rel="noopener noreferrer">Befrienders Worldwide ↗</a></div></section>`;
    const local = selected ? referralServices.filter((item) => item.country === selected || item.country === global) : referralServices.filter((item) => item.country === global);
    const filtered = local.filter((item) => !selectedTopic || item.topics.includes(selectedTopic));
    document.getElementById("support-count").textContent = `${filtered.length} ${filtered.length === 1 ? "route" : "routes"}`;
    document.getElementById("support-results").innerHTML = filtered.length ? filtered.map((item) => serviceCard(item)).join("") : `<p class="notice">No matching route is listed for this country and topic yet. Try a different topic or use Find A Helpline.</p>`;
  };
  country.addEventListener("change", update);
  topic.addEventListener("change", update);
  update();
}
