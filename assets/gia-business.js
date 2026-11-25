/* Gia — Beginning Concepts' browser-based, knowledge-guided business concierge. */
(()=>{"use strict";
const EMAIL="beginningconcepts.org@gmail.com",PIC="assets/gia-avatar.jpg";
const wrap=document.createElement("div");wrap.id="giaExperience";
wrap.innerHTML='<button class="gia-launch" id="giaLaunch" type="button" aria-controls="giaPanel" aria-expanded="false" aria-label="Chat with Gia"><span class="gia-label">Ask Gia ↗</span><span class="gia-face"><img src="'+PIC+'" alt=""><span class="gia-ping"></span></span></button>'
+'<section class="gia-panel" id="giaPanel" role="dialog" aria-modal="false" aria-labelledby="giaTitle" hidden>'
+'<div class="gia-head"><img src="'+PIC+'" alt=""><div class="gia-head-copy"><h2 id="giaTitle">Gia</h2><p>Business &amp; digital solutions guide</p></div><button class="gia-close" id="giaClose" type="button" aria-label="Close Gia chat">×</button></div>'
+'<div class="gia-chat" id="giaMessages" role="log" aria-label="Conversation with Gia" aria-live="polite"></div>'
+'<div class="gia-tools" id="giaQuick" aria-label="Suggestions"></div>'
+'<div class="gia-input"><form id="giaForm"><label class="sr" for="giaQuestion">Message Gia</label><input id="giaQuestion" maxlength="600" autocomplete="off" placeholder="Ask Gia about your idea..." required><button class="gia-send" type="submit" aria-label="Send message">➤</button></form><p class="gia-footnote">Messages may be processed by Cloudflare AI. Avoid sensitive information. Enquiries are sent only when you approve an email draft.</p></div></section>';
document.body.append(wrap);
const panel=document.getElementById("giaPanel"),launcher=document.getElementById("giaLaunch"),close=document.getElementById("giaClose"),log=document.getElementById("giaMessages"),quick=document.getElementById("giaQuick"),question=document.getElementById("giaQuestion");
let first=true,returnFocus=null,brief=null;
const conversation=[]; let busy=false; const endpoint="https://gia-ai.glenroygriffiths876.workers.dev/";
const answers={
websites:"Beginning Concepts creates custom, responsive websites designed around each organisation's needs. For an online shop, we can design the page layout, create branded product images and campaign banners, and build the shopping experience. We can also discuss content structure, contact tools, accessibility, domains, hosting and future updates. Actual features and scope are agreed during planning.",
apps:"We explore custom digital applications including booking and ordering experiences, portals, dashboards, directories and business workflow tools. Requirements for user accounts, databases and security must be assessed before selecting the technology.",
ai:"Gia is Beginning Concepts' signature virtual assistant identity. We can customise her knowledge and user experience for businesses, service guides and educational platforms. This site combines AI conversation with a knowledge-guided fallback.",
learning:"Our educational solutions can include interactive lessons, visual learning activities, resource libraries, training tools, quizzes and accessibility-conscious experiences. Tell us about your learners and the outcomes you want.",
digital:"We can discuss searchable directories, resource hubs, QR-code entry points, interactive manuals, forms and other customised digital experiences. Start with the challenge you need technology to solve.",
cost:"Websites start at J$10,000 (USD equivalent available). Ask me for a preliminary estimate based on your requirements.",
timeline:"Project timings depend on complexity, content, feedback and approvals. A deadline isn't confirmed until the team agrees to it; I can include your preferred dates in the brief.",
hosting:"Domains, subdomains, Cloudflare DNS and hosting can be considered. Static sites may use free hosting, while secure accounts, databases or live AI often require a separate backend. We won't promise a hosting configuration before reviewing it.",
maintenance:"Maintenance, changes and support can be discussed as part of the project. The arrangements need to be specifically agreed.",
contact:"Contact Beginning Concepts at beginningconcepts.org@gmail.com. You can email the team directly or prepare an enquiry with me.",
privacy:"Gia keeps conversation context in this tab and may send recent messages to Cloudflare AI for processing. Project enquiries are sent only through your email application when you approve them. Avoid sensitive information.",
process:"Start by sharing your goal and audience. We can then discuss the features, design direction, technical needs, cost and delivery plan. I can help you prepare the first project brief."
};
const patterns=[["work",/\b(portfolio|our work|past work|your work|examples|what have you built|projects you.ve built|waps|hstu|hanover ?jpa|hanoverjpa|justices? of the peace|velora|case stud(?:y|ies))\b/i],["cost",/\b(price|cost|quote|quotations|pricing|budget|fee|payment|free)\b/i],["timeline",/\b(timeline|deadline|delivery|how long|turnaround|duration)\b/i],["hosting",/\b(domain|subdomain|dns|cloudflare|github|hosting|host|deploy)\b/i],["maintenance",/\b(maintenance|update|ongoing|support|bug|repair)\b/i],["privacy",/\b(privacy|secure|security|data collection|data stored)\b/i],["contact",/\b(contact|email|phone|whatsapp|reach you|call you)\b/i],["ai",/\b(gia|chatbot|chat bot|virtual assistant|ai assistant|artificial intelligence|automation)\b/i],["learning",/\b(learning|education|school|course|training|children|lesson|lms|quiz|worksheet|accessible)\b/i],["websites",/\b(website|webpage|web page|web design|site|landing page|portfolio|online store)\b/i],["apps",/\b(app|apps|application|portal|dashboard|booking|ordering|software)\b/i],["digital",/\b(services|what do you do|digital|directory|qr code|manual|resource hub|digital tool)\b/i],["process",/\b(get started|start a project|steps|your process)\b/i]];
const briefQuestions=[
["service","What would you like to build—website, application, Gia chatbot, learning platform or another digital solution?"],
["goal","What is the main goal and who will use it?"],
["features","What pages or important features should it include? You can say 'not sure yet'."],
["timing","Do you have a preferred deadline? 'Flexible' is fine too."]
];
function add(text,person="gia",action){conversation.push({role:person==="user"?"user":"assistant",content:text});if(conversation.length>20)conversation.shift();let row=document.createElement("div");row.className="gia-line "+(person==="user"?"gia-user":"gia-agent");if(person!=="user"){let img=document.createElement("img");img.src=PIC;img.alt="";img.className="gia-mini";row.append(img)}let bubble=document.createElement("div");bubble.className="gia-msg";bubble.textContent=text;if(action){const link=document.createElement("a");link.href=action.href;link.textContent=action.label;link.className="gia-email";if(/^https:\/\//.test(action.href)){link.target="_blank";link.rel="noopener noreferrer"}bubble.append(document.createElement("br"),link)}row.append(bubble);log.append(row);log.scrollTop=log.scrollHeight}
function chips(arr){quick.replaceChildren();arr.forEach(([label,key])=>{let b=document.createElement("button");b.type="button";b.className="gia-chip";b.textContent=label;b.dataset.giaTopic=key;quick.append(b)})}
function options(){chips([["Websites","websites"],["Apps","apps"],["AI & Gia","ai"],["Learning","learning"],["Our work","work"],["Pricing","cost"],["Project brief","brief"]])}
function mail(subject,body){return "mailto:"+EMAIL+"?subject="+encodeURIComponent(subject)+"&body="+encodeURIComponent(body)}
function open(){returnFocus=document.activeElement;panel.hidden=false;launcher.setAttribute("aria-expanded","true");if(first){first=false;add("Hello! I'm Gia, your Beginning Concepts digital guide. ✨\n\nI can explain our custom websites, apps, Gia assistants and learning tools—or help you prepare a project enquiry. What would you like to build?");options()}question.focus()}
function hide(){panel.hidden=true;launcher.setAttribute("aria-expanded","false");(returnFocus?.focus?returnFocus:launcher).focus()}
launcher.addEventListener("click",()=>panel.hidden?open():hide());close.addEventListener("click",hide);
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!panel.hidden){e.stopPropagation();hide()}});
document.querySelectorAll("[data-gia-open]").forEach(b=>b.addEventListener("click",()=>{const nav=document.getElementById("nav"),menu=document.getElementById("menu");nav?.classList.remove("open");menu?.setAttribute("aria-expanded","false");menu?.setAttribute("aria-label","Open navigation");if(panel.hidden)open();else question.focus();if(b.dataset.giaTopic)topic(b.dataset.giaTopic)}));
function startBrief(){brief=lastNeed?{step:1,values:{service:lastNeed+" — "+lastIdea}}:{step:0,values:{}};add("I'll prepare an enquiry with you, one step at a time. Nothing is sent automatically.");add(briefQuestions[brief.step][1]);chips([["Cancel brief","cancel"]])}
function endBrief(){const a=brief.values,body="Hello Beginning Concepts,\n\nI would like to discuss a project.\n\nType of project: "+a.service+"\nGoal and audience: "+a.goal+"\nImportant features: "+a.features+"\nPreferred timeframe: "+a.timing+"\n\nPlease let me know the next steps.\nThank you.";
add("Here's the project brief I've prepared:\n\n"+body+"\n\nSelect the email draft below, review it and send it when you're ready.","gia",{label:"Open email draft ↗",href:mail("New project enquiry | Beginning Concepts",body)});brief=null;chips([["Start another brief","brief"],["Services","services"],["Contact","contact"]])}
function topic(key,echo=false){if(echo)add(key==="brief"?"Start a project enquiry":key,"user");
if(key==="cost"){pricing=null;priceFlow("");return}
if(key==="cancel-pricing"){priceFlow("cancel");return}
if(key==="brief"){pricing=null;startBrief();return}
if(key==="cancel"){brief=null;add("Project brief cancelled. What would you like to explore instead?");options();return}
if(key==="work"){add("Here are four examples of our work. The links open in a new tab so you can return to our conversation.");
add("WAPS Communication — a free, caregiver-guided communication platform with visual and everyday support tools.","gia",{label:"Explore WAPS Communication ↗",href:"https://waps.beginningconcepts.org/"});
add("HSTU Resource Repository — a digital hub for public-health strategic information resources and learning materials.","gia",{label:"Explore the HSTU Repository ↗",href:"https://hstu-repository.moh.gov.jm/"});
add("Hanover JPA — the website for the Hanover Justices of the Peace Association.","gia",{label:"Explore Hanover JPA ↗",href:"https://hanoverjpa.com/"});
add("VELORA-TV — a free, TV-friendly streaming interface and entertainment discovery experience.","gia",{label:"Explore VELORA-TV ↗",href:"https://velora.beginningconcepts.org/"});
chips([["Our services","services"],["Start a project","brief"],["Contact","contact"]]);return}
if(key==="services"){add("Our focus areas: custom websites, tailored digital applications, personalised Gia chatbots, educational tools and practical digital solutions.");chips([["Websites","websites"],["Apps","apps"],["AI & Gia","ai"],["Learning","learning"],["Digital solutions","digital"],["Our work","work"],["Project brief","brief"]]);return}
add(answers[key]||"I can help explore our services or prepare a project enquiry. I won't guess about unconfirmed details.", "gia",key==="contact"?{label:"Email Beginning Concepts ↗",href:mail("Enquiry | Beginning Concepts","Hello Beginning Concepts,\n\nI would like to enquire about your services.\n\n")}:null);
chips([["Start a project","brief"],["View services","services"],["Costs","cost"],["Contact","contact"]])}

let lastNeed="", lastIdea="";
// Deterministic introductory pricing; estimates are not binding quotations.
const pricingPackages={website:["Starter website",10000],business:["Small business website",25000],professional:["Professional website",45000],shop:["Online store",35000],app:["Custom web application",50000],ai:["AI chatbot",20000],game:["Educational game",15000],course:["Online course",25000]};
let pricing=null;
let usdRate=1/160, fxLive=false;
function usdAmount(jmd){return "US$"+Math.round(jmd*usdRate).toLocaleString("en-US")}
function dualPrice(jmd){return "J$"+jmd.toLocaleString("en-JM")+" (approx. "+usdAmount(jmd)+")"}
function updateOfferCurrency(){const el=document.getElementById("bcOfferUSD");if(el){el.textContent="≈ "+usdAmount(10000);el.title=fxLive?"Indicative daily exchange rate":"Illustrative fallback rate: J$160 per US$1"}}
updateOfferCurrency();
(async()=>{try{const res=await fetch("https://open.er-api.com/v6/latest/USD",{signal:AbortSignal.timeout(6000)});if(!res.ok)return;const data=await res.json();const rate=Number(data.rates?.JMD);if(data.result==="success"&&rate>100&&rate<300){usdRate=1/rate;fxLive=true;updateOfferCurrency()}}catch(_){}})();

function pricingKind(s){return /online store|e.commerce|shopping cart|checkout/.test(s)?"shop":/chatbot|chat bot|ai assistant/.test(s)?"ai":/educational game|learning game|\bgame\b/.test(s)?"game":/course|training/.test(s)?"course":/\bapp(s|lication)?\b/.test(s)?"app":/professional website/.test(s)?"professional":/small business website|multi.page/.test(s)?"business":/website|web site|webpage|restaurant|salon|barber|landing page/.test(s)?"website":null}
function priceFlow(input){
 const n=input.toLowerCase().trim();
 if(/^(cancel|exit|stop|new topic|cancel pricing)$/.test(n)){pricing=null;add("Pricing conversation closed.");options();return}
 if(!pricing)pricing={kind:null,details:[],stage:0};
 if(/institution|government|hospital|enterprise|sensitive data|medical records|complex integration/.test(n)){pricing=null;add("This project needs a tailored assessment rather than an automated price.","gia",{label:"Request a formal quotation",href:mail("Custom project quotation",input)});options();return}
 if(pricing.stage===0){pricing.kind=pricingKind(n)||pricingKind(lastIdea.toLowerCase());if(!pricing.kind){add("Our websites start at "+dualPrice(10000)+". What would you like to build: a website, online store, app, chatbot, educational game or online course?");chips([["Cancel pricing","cancel-pricing"]]);return}pricing.details.push(input);pricing.stage=1;add("Our "+pricingPackages[pricing.kind][0].toLowerCase()+" starts at "+dualPrice(pricingPackages[pricing.kind][1])+". What features do you need? For websites, tell me the total number of pages and whether you need an interactive menu, WhatsApp, booking, payments, accounts, a dashboard or a database. You can say basic if unsure.");chips([["Cancel pricing","cancel-pricing"]]);return}
 if(pricing.stage===1){pricing.details.push(input);pricing.stage=2;add("Do you already have your logo, text and images? Do you need a custom domain, hosting or ongoing maintenance?");return}
 pricing.details.push(input);
 const scope=pricing.details.join("\n"), t=scope.toLowerCase(), k=pricing.kind, base=pricingPackages[k];let items=[base];
 if(["website","business","professional"].includes(k)){const m=t.match(/(\d+)\s*(?:web\s*)?pages?\b/);const included=k==="website"?1:k==="business"?5:1;if(m&&Number(m[1])>included&&Number(m[1])<=50)items.push(["Additional pages",3000*(Number(m[1])-included)]);if(/interactive menu/.test(t)&&!/no interactive menu/.test(t))items.push(["Interactive menu",5000]);}
 const total=items.reduce((a,b)=>a+b[1],0);
 const uncertain=/booking|payment|accounts|dashboard|database|custom integration|more than|complex|\b(?:six|seven|eight|nine|ten) pages\b/.test(t);
 const summary=items.map(x=>x[0]+": "+dualPrice(x[1])).join("\n")+"\nStarting estimate: "+dualPrice(total)+"\nUSD amounts are indicative ("+(fxLive?"daily reference rate":"fallback J$160 per US$1")+"); final exchange rate confirmed in quotation.";
 const body="Project requirements:\n"+scope+"\n\n"+summary+"\nAdditional features, content creation, domain, hosting and maintenance subject to assessment. Not a binding quotation.";
 add(summary+"\n\n"+(uncertain?"Additional functionality requires individual assessment. ":"")+"Domain, hosting, content creation and maintenance are separate where required. This is a preliminary starting estimate, not a final quotation.","gia",{label:"Request official quotation",href:mail("Project pricing enquiry",body)});pricing=null;options();
}

const demos={shop:["Try our shop demo","https://beginningconcepts.org/shop/?v=design-studio"],course:["Try our course demo","https://beginningconcepts.org/course-demo/"],game:["Try our game demo","https://beginningconcepts.org/game-demo/index.html"]};
function recommend(kind,idea){
lastNeed=kind;lastIdea=idea;
const advice={
shop:"A mobile-friendly catalogue with product photos, prices and an ordering flow would be a useful starting point. We can discuss WhatsApp ordering or a more advanced checkout. What products do you sell, and how do customers order today?",
course:"An interactive learning platform could combine lessons, quizzes and progress tracking. Who are your learners, and what should they be able to do after training?",
game:"A custom learning game could use visual prompts, matching and feedback. What age group and learning skill should it target?",
booking:"A booking platform could show services and available appointments, with confirmations. Do you need customers to book independently or request appointments for approval?",
website:"A responsive website could introduce your business, showcase services and make enquiries easy. Who is your target audience, and what action should visitors take?",
assistant:"A customised assistant could answer service questions and guide visitors to the right resources. What questions do your customers ask most often?"
};
const d=demos[kind];add(advice[kind],"gia",d?{label:d[0],href:d[1]}:null);chips([["Prepare my enquiry","brief"],["Costs","cost"],["Our work","work"]]);
}
function smarter(s){
const n=s.toLowerCase().replace(/\b(mi|meh)\b/g,"i").replace(/\b(wah|waan|wanna)\b/g,"want").replace(/\b(fi)\b/g,"to").replace(/\b(webiste|wesite|websit)\b/g,"website").replace(/\b(buisness|busines)\b/g,"business");
if(/\b(demo|sample|try)\b/.test(n)){let k=/shop|store|order/.test(n)?"shop":/course|training|lesson/.test(n)?"course":/game|matching/.test(n)?"game":null;if(k){add("You can explore this interactive example of our capabilities.","gia",{label:demos[k][0],href:demos[k][1]});return true}if(/demo|sample/.test(n)){Object.values(demos).forEach(d=>add(d[0],"gia",{label:"Open demo",href:d[1]}));return true}}
if(/\b(how much|cost|price|budget|quote|deadline|how long)\b/.test(n)){add((lastNeed?"For the "+lastNeed+" solution we discussed: ":"")+(/\b(deadline|how long)\b/.test(n)?answers.timeline:answers.cost));chips([["Prepare my enquiry","brief"],["Contact","contact"]]);return true}
if(/\b(farm|farmer|produce|sell|selling|shop|restaurant|menu|retail|boutique|orders|ordering)\b/.test(n)){recommend("shop",s);return true}
if(/\b(appointment|booking|salon|barber|reservation)\b/.test(n)){recommend("booking",s);return true}
if(/\b(game|matching|spelling)\b/.test(n)){recommend("game",s);return true}
if(/\b(course|training|teach|school|learners|lms)\b/.test(n)){recommend("course",s);return true}
if(/\b(chatbot|virtual assistant|ai assistant)\b/.test(n)){recommend("assistant",s);return true}
if(/\b(website|webpage|landing page)\b/.test(n)&&/\b(want|need|build|create|business|make)\b/.test(n)){recommend("website",s);return true}
if(lastNeed&&/^(yes|sure|okay|ok|please|that sounds good)\b/.test(n)){startBrief();return true}
if(lastNeed&&!patterns.some(([k,p])=>p.test(n))){lastIdea=(lastIdea+"; "+s).slice(0,1200);add("I've noted that detail for your "+lastNeed+" idea. Would you like to prepare a project enquiry so our team can review your requirements?");chips([["Prepare my enquiry","brief"],["Costs","cost"],["Contact","contact"]]);return true}
return false;
}

function respond(text){if(brief){const [key]=briefQuestions[brief.step];brief.values[key]=text;brief.step++;if(brief.step===briefQuestions.length)endBrief();else add(briefQuestions[brief.step][1]);return}
let s=text.trim();
if(/\b(start|prepare|create|write|make)\b.*\b(brief|enquiry|project inquiry)\b/i.test(s)){topic("brief");return}
if(/^(hi|hey|hello|good morning|good afternoon|good evening|who are you)\b/i.test(s)){add("Hello! I'm Gia. I'm here to help you explore Beginning Concepts and prepare an enquiry.");options();return}
if(smarter(s))return;
let found=patterns.filter(([k,p])=>p.test(s)).map(x=>x[0]);if(found.length>1&&found.some(k=>["websites","apps","ai","learning"].includes(k))){const relevant=found.filter(k=>["websites","apps","ai","learning","digital"].includes(k));if(relevant.length>1){add("Your idea may combine "+relevant.join(", ")+". Let's explore one part first, or create a project brief with all the requirements.");chips([...relevant.map(k=>[k.charAt(0).toUpperCase()+k.slice(1),k]),["Project brief","brief"]]);return}}
topic(found[0]||"unknown")}
const send=document.querySelector(".gia-send");
const allowedLinks=["https://beginningconcepts.org/","https://beginningconcepts.org/shop/?v=design-studio","https://beginningconcepts.org/course-demo/","https://beginningconcepts.org/game-demo/index.html","https://waps.beginningconcepts.org/","https://hstu-repository.moh.gov.jm/","https://hanoverjpa.com/","https://velora.beginningconcepts.org/"];
const voice=document.createElement("button");voice.type="button";voice.className="gia-chip";voice.textContent="Read replies aloud";voice.setAttribute("aria-pressed","false");
let speak=false;
if("speechSynthesis" in window){document.querySelector(".gia-input").prepend(voice);voice.addEventListener("click",()=>{speak=!speak;voice.setAttribute("aria-pressed",String(speak));voice.textContent=speak?"Stop reading replies":"Read replies aloud";if(!speak)window.speechSynthesis.cancel()})}
const SpeechRecognition=window.SpeechRecognition||window.webkitSpeechRecognition;
const mic=document.createElement("button");mic.type="button";mic.className="gia-mic";mic.setAttribute("aria-label","Dictate message");mic.title="Dictate message";mic.setAttribute("aria-pressed","false");
const micIcon='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="2" width="6" height="13" rx="3"/><path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3M9 22h6"/></svg>';
const stopIcon='<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>';
mic.innerHTML=micIcon;send.before(mic);
const dictationStatus=document.createElement("p");dictationStatus.className="gia-dictation-status";dictationStatus.setAttribute("role","status");dictationStatus.hidden=true;document.getElementById("giaForm").after(dictationStatus);
let activeRecognition=null;
function status(message){dictationStatus.textContent=message;dictationStatus.hidden=!message}
function resetMic(){activeRecognition=null;mic.innerHTML=micIcon;mic.setAttribute("aria-pressed","false");mic.setAttribute("aria-label","Dictate message");mic.title="Dictate message";mic.classList.remove("is-listening");}
mic.addEventListener("click",()=>{
if(activeRecognition){try{activeRecognition.stop();status("Finishing dictation…")}catch(_){resetMic()}return}
if(!SpeechRecognition){status("Dictation is unavailable in this browser. Try Chrome or Edge, or type your message.");return}
if(busy)return;
const rec=new SpeechRecognition();rec.lang="en-JM";rec.continuous=true;rec.interimResults=true;
const prefix=question.value.trim();let failed=false;
activeRecognition=rec;mic.innerHTML=stopIcon;mic.classList.add("is-listening");mic.setAttribute("aria-pressed","true");mic.setAttribute("aria-label","Stop dictation");mic.title="Stop dictation";status("Listening… tap to finish.");
rec.onresult=e=>{let transcript="";for(let i=0;i<e.results.length;i++)transcript+=e.results[i][0].transcript+" ";question.value=[prefix,transcript.trim()].filter(Boolean).join(" ").slice(0,600)};
rec.onerror=e=>{failed=true;status(e.error==="not-allowed"?"Allow microphone access to dictate.": "Dictation unavailable. You can still type.");resetMic()};
rec.onend=()=>{if(activeRecognition===rec)resetMic();if(!failed){status("");if(!panel.hidden)question.focus()}};
try{rec.start()}catch(_){resetMic();status("Unable to start microphone. Please try again.")}
});
close.addEventListener("click",()=>{if(activeRecognition)activeRecognition.stop()});
launcher.addEventListener("click",()=>{if(panel.hidden&&activeRecognition)activeRecognition.stop()});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&activeRecognition)activeRecognition.stop()});
async function askAI(s){
if(!brief&&(pricing||/\b(how much|costs?|prices?|pricing|quotes?|quotation|budget|afford|fees?|rates?|charge|estimate|usd|jmd|us dollars|american dollars)\b/i.test(s))){priceFlow(s);return}
if(brief||/\b(start|prepare|create|write|make)\b.*\b(brief|enquiry|project inquiry)\b/i.test(s)){respond(s);return}
busy=true;send.disabled=true;quick.inert=true;question.setAttribute("aria-busy","true");
const pending=document.createElement("p");pending.className="gia-footnote";pending.textContent="Gia is thinking…";log.append(pending);log.scrollTop=log.scrollHeight;
const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),18000);
try{
const res=await fetch(endpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:s,history:conversation.slice(0,-1).slice(-8)}),signal:controller.signal});
if(!res.ok)throw Error("AI unavailable");
const data=await res.json();if(typeof data.reply!=="string"||!data.reply.trim())throw Error("Empty response");
pending.remove();const reply=data.reply.trim();add(reply);lastIdea=(lastIdea?lastIdea+"; ":"")+s;lastIdea=lastIdea.slice(-1200);if(!lastNeed)lastNeed="custom digital solution";
allowedLinks.filter(url=>reply.includes(url)&&url!=="https://beginningconcepts.org/").forEach(url=>add("Explore this resource:","gia",{label:"Open resource ↗",href:url}));
chips([["Prepare my enquiry","brief"],["Our work","work"],["Contact","contact"]]);
if(speak){const utterance=new SpeechSynthesisUtterance(reply);utterance.lang="en-JM";window.speechSynthesis.speak(utterance)}
}catch(_){pending.remove();add("Live AI is temporarily unavailable. I can still help using our business guide.");respond(s)}
finally{clearTimeout(timeout);pending.remove();busy=false;send.disabled=false;quick.inert=false;question.removeAttribute("aria-busy");if(!panel.hidden)question.focus()}
}
quick.addEventListener("click",e=>{if(busy)return;let b=e.target.closest("[data-gia-topic]");if(b)topic(b.dataset.giaTopic,true)});
document.getElementById("giaForm").addEventListener("submit",e=>{e.preventDefault();let s=question.value.trim();if(!s||busy)return;if(activeRecognition){activeRecognition.stop();return}question.value="";add(s,"user");askAI(s)});
/* Gia's cinema: play the spoken welcome once, then keep future loops silent. */
const video=document.getElementById("brandVideo");
const frame=document.getElementById("brandCinema"),sound=document.getElementById("brandSound");
const playButton=document.getElementById("brandPlay"),videoStatus=document.getElementById("brandVideoStatus");
if(video&&frame&&sound&&playButton&&videoStatus){
  const heardKey="beginning-concepts-gia-welcome-heard-v1";
  let heardThisTab=false;
  try{heardThisTab=sessionStorage.getItem(heardKey)==="1"}catch(_){}
  function rememberHeard(){
    heardThisTab=true;
    try{sessionStorage.setItem(heardKey,"1")}catch(_){}
  }
  function updateSoundControl(){
    const audible=!video.muted;
    sound.disabled=!!video.error;
    sound.textContent=audible?"♪ Mute Gia":"♫ Hear Gia";
    sound.setAttribute("aria-pressed",String(audible));
    sound.setAttribute("aria-label",audible?"Mute Gia's welcome":"Replay Gia's welcome once with sound");
    sound.title=audible?"Mute Gia":"Hear Gia's welcome once";
  }
  function showPlay(label){
    playButton.hidden=false;
    playButton.querySelector(".bc-play-text").textContent=label;
  }
  function ready(){
    frame.classList.add("is-ready");
    videoStatus.textContent="";
    updateSoundControl();
  }
  function startVideo(withSound,rewind=false){
    if(video.error)return;
    if(rewind){
      video.pause();
      try{video.currentTime=0}catch(_){}
    }
    video.loop=false; // The 'ended' event must fire so we can mute each subsequent loop.
    video.muted=!withSound;
    if(withSound)video.volume=0.75;
    updateSoundControl();
    const promise=video.play();
    if(promise&&typeof promise.catch==="function"){
      promise.catch(()=>{
        if(withSound){
          // Mobile browsers frequently forbid unsolicited audio. Keep the visual film going.
          video.muted=true;
          updateSoundControl();
          const silent=video.play();
          if(silent&&typeof silent.catch==="function"){
            silent.catch(()=>showPlay("▶ Play Gia's film"));
          }
        }else{
          showPlay("▶ Play Gia's film");
        }
      });
    }
  }
  video.addEventListener("loadeddata",ready);
  video.addEventListener("canplay",ready);
  video.addEventListener("playing",()=>{
    ready();
    playButton.hidden=true;
    if(!video.muted)rememberHeard();
  });
  video.addEventListener("ended",()=>{
    // Only the first complete run may contain sound; the rest are quiet.
    video.muted=true;
    updateSoundControl();
    try{video.currentTime=0}catch(_){}
    startVideo(false);
  });
  video.addEventListener("pause",()=>{
    if(!video.ended&&!video.error&&!document.hidden)
      showPlay("▶ Resume Gia's film");
  });
  video.addEventListener("error",()=>{
    frame.classList.remove("is-ready");
    sound.disabled=true;
    videoStatus.textContent="Video unavailable here. You can open Gia's film directly.";
    showPlay("▶ Open video");
  });
  playButton.addEventListener("click",()=>{
    if(video.error){
      window.open("assets/beginning-concepts-gia.mp4","_blank","noopener");
      return;
    }
    // The click is a browser-approved gesture: make the welcome audible once.
    startVideo(true,true);
  });
  sound.addEventListener("click",()=>{
    if(video.error)return;
    if(!video.muted){
      video.muted=true;
      updateSoundControl();
    }else{
      // Explicit replay, with Gia's voice once; all following cycles will be muted.
      startVideo(true,true);
    }
  });
  document.addEventListener("visibilitychange",()=>{
    if(document.hidden){
      if(!video.muted){video.muted=true;updateSoundControl()}
    }else if(video.paused&&!video.error){
      // Never unexpectedly restart spoken audio when returning to the tab.
      startVideo(false);
    }
  });
  if(video.readyState>=2)ready();
  // Try speaking once when the browser permits it; fall back to muted autoplay.
  // Reloading the same tab won't automatically repeat an introduction already heard.
  startVideo(!heardThisTab);
}

})();
