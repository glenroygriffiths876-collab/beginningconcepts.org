/* Gia — Beginning Concepts' browser-based, knowledge-guided business concierge. */
(()=>{"use strict";
const EMAIL="beginningconcepts.org@gmail.com",PIC="assets/gia-avatar.jpg";
const wrap=document.createElement("div");wrap.id="giaExperience";
wrap.innerHTML='<button class="gia-launch" id="giaLaunch" type="button" aria-controls="giaPanel" aria-expanded="false" aria-label="Chat with Gia"><span class="gia-label">Ask Gia ↗</span><span class="gia-face"><img src="'+PIC+'" alt=""><span class="gia-ping"></span></span></button>'
+'<section class="gia-panel" id="giaPanel" role="dialog" aria-modal="false" aria-labelledby="giaTitle" hidden>'
+'<div class="gia-head"><img src="'+PIC+'" alt=""><div class="gia-head-copy"><h2 id="giaTitle">Gia</h2><p>Beginning Concepts digital guide</p></div><button class="gia-close" id="giaClose" type="button" aria-label="Close Gia chat">×</button></div>'
+'<div class="gia-chat" id="giaMessages" role="log" aria-label="Conversation with Gia" aria-live="polite"></div>'
+'<div class="gia-tools" id="giaQuick" aria-label="Suggestions"></div>'
+'<div class="gia-input"><form id="giaForm"><label class="sr" for="giaQuestion">Message Gia</label><input id="giaQuestion" maxlength="600" autocomplete="off" placeholder="Ask Gia about your idea..." required><button class="gia-send" type="submit" aria-label="Send message">➤</button></form><p class="gia-footnote">Knowledge-guided assistant; no live generative AI yet. Chat stays in this tab. Enquiries send only when you approve an email draft.</p></div></section>';
document.body.append(wrap);
const panel=document.getElementById("giaPanel"),launcher=document.getElementById("giaLaunch"),close=document.getElementById("giaClose"),log=document.getElementById("giaMessages"),quick=document.getElementById("giaQuick"),question=document.getElementById("giaQuestion");
let first=true,returnFocus=null,brief=null;
const answers={
websites:"Beginning Concepts creates custom, responsive websites designed around each organisation's needs. For an online shop, we can design the page layout, create branded product images and campaign banners, and build the shopping experience. We can also discuss content structure, contact tools, accessibility, domains, hosting and future updates. Actual features and scope are agreed during planning.",
apps:"We explore custom digital applications including booking and ordering experiences, portals, dashboards, directories and business workflow tools. Requirements for user accounts, databases and security must be assessed before selecting the technology.",
ai:"Gia is Beginning Concepts' signature virtual assistant identity. We can customise her knowledge and user experience for businesses, service guides and educational platforms. This site's version is knowledge-guided; open-ended generative AI requires a secured backend.",
learning:"Our educational solutions can include interactive lessons, visual learning activities, resource libraries, training tools, quizzes and accessibility-conscious experiences. Tell us about your learners and the outcomes you want.",
digital:"We can discuss searchable directories, resource hubs, QR-code entry points, interactive manuals, forms and other customised digital experiences. Start with the challenge you need technology to solve.",
cost:"We do not have a published price list. A quotation depends on scope, design, technical features and maintenance needs. I can prepare a project enquiry for the team to review.",
timeline:"Project timings depend on complexity, content, feedback and approvals. A deadline isn't confirmed until the team agrees to it; I can include your preferred dates in the brief.",
hosting:"Domains, subdomains, Cloudflare DNS and hosting can be considered. Static sites may use free hosting, while secure accounts, databases or live AI often require a separate backend. We won't promise a hosting configuration before reviewing it.",
maintenance:"Maintenance, changes and support can be discussed as part of the project. The arrangements need to be specifically agreed.",
contact:"Contact Beginning Concepts at beginningconcepts.org@gmail.com. You can email the team directly or prepare an enquiry with me.",
privacy:"This version of Gia keeps the conversation in browser memory and doesn't upload it to a server or external AI model. Nothing is sent until you use your email application to send an enquiry. Please avoid entering sensitive personal information.",
process:"Start by sharing your goal and audience. We can then discuss the features, design direction, technical needs, cost and delivery plan. I can help you prepare the first project brief."
};
const patterns=[["work",/\b(portfolio|our work|past work|your work|examples|what have you built|projects you.ve built|waps|hstu|hanover ?jpa|hanoverjpa|justices? of the peace|velora|case stud(?:y|ies))\b/i],["cost",/\b(price|cost|quote|quotations|pricing|budget|fee|payment|free)\b/i],["timeline",/\b(timeline|deadline|delivery|how long|turnaround|duration)\b/i],["hosting",/\b(domain|subdomain|dns|cloudflare|github|hosting|host|deploy)\b/i],["maintenance",/\b(maintenance|update|ongoing|support|bug|repair)\b/i],["privacy",/\b(privacy|secure|security|data collection|data stored)\b/i],["contact",/\b(contact|email|phone|whatsapp|reach you|call you)\b/i],["ai",/\b(gia|chatbot|chat bot|virtual assistant|ai assistant|artificial intelligence|automation)\b/i],["learning",/\b(learning|education|school|course|training|children|lesson|lms|quiz|worksheet|accessible)\b/i],["websites",/\b(website|webpage|web page|web design|site|landing page|portfolio|online store)\b/i],["apps",/\b(app|apps|application|portal|dashboard|booking|ordering|software)\b/i],["digital",/\b(services|what do you do|digital|directory|qr code|manual|resource hub|digital tool)\b/i],["process",/\b(get started|start a project|steps|your process)\b/i]];
const briefQuestions=[
["service","What would you like to build—website, application, Gia chatbot, learning platform or another digital solution?"],
["goal","What is the main goal and who will use it?"],
["features","What pages or important features should it include? You can say 'not sure yet'."],
["timing","Do you have a preferred deadline? 'Flexible' is fine too."]
];
function add(text,person="gia",action){let row=document.createElement("div");row.className="gia-line "+(person==="user"?"gia-user":"gia-agent");if(person!=="user"){let img=document.createElement("img");img.src=PIC;img.alt="";img.className="gia-mini";row.append(img)}let bubble=document.createElement("div");bubble.className="gia-msg";bubble.textContent=text;if(action){const link=document.createElement("a");link.href=action.href;link.textContent=action.label;link.className="gia-email";if(/^https:\/\//.test(action.href)){link.target="_blank";link.rel="noopener noreferrer"}bubble.append(document.createElement("br"),link)}row.append(bubble);log.append(row);log.scrollTop=log.scrollHeight}
function chips(arr){quick.replaceChildren();arr.forEach(([label,key])=>{let b=document.createElement("button");b.type="button";b.className="gia-chip";b.textContent=label;b.dataset.giaTopic=key;quick.append(b)})}
function options(){chips([["Websites","websites"],["Apps","apps"],["AI & Gia","ai"],["Learning","learning"],["Our work","work"],["Project brief","brief"]])}
function mail(subject,body){return "mailto:"+EMAIL+"?subject="+encodeURIComponent(subject)+"&body="+encodeURIComponent(body)}
function open(){returnFocus=document.activeElement;panel.hidden=false;launcher.setAttribute("aria-expanded","true");if(first){first=false;add("Hello! I'm Gia, your Beginning Concepts digital guide. ✨\n\nI can explain our custom websites, apps, Gia assistants and learning tools—or help you prepare a project enquiry. What would you like to build?");options()}question.focus()}
function hide(){panel.hidden=true;launcher.setAttribute("aria-expanded","false");(returnFocus?.focus?returnFocus:launcher).focus()}
launcher.addEventListener("click",()=>panel.hidden?open():hide());close.addEventListener("click",hide);
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!panel.hidden){e.stopPropagation();hide()}});
document.querySelectorAll("[data-gia-open]").forEach(b=>b.addEventListener("click",()=>{const nav=document.getElementById("nav"),menu=document.getElementById("menu");nav?.classList.remove("open");menu?.setAttribute("aria-expanded","false");menu?.setAttribute("aria-label","Open navigation");if(panel.hidden)open();else question.focus();if(b.dataset.giaTopic)topic(b.dataset.giaTopic)}));
function startBrief(){brief={step:0,values:{}};add("I'll prepare an enquiry with you, one step at a time. Nothing is sent automatically.");add(briefQuestions[0][1]);chips([["Cancel brief","cancel"]])}
function endBrief(){const a=brief.values,body="Hello Beginning Concepts,\n\nI would like to discuss a project.\n\nType of project: "+a.service+"\nGoal and audience: "+a.goal+"\nImportant features: "+a.features+"\nPreferred timeframe: "+a.timing+"\n\nPlease let me know the next steps.\nThank you.";
add("Here's the project brief I've prepared:\n\n"+body+"\n\nSelect the email draft below, review it and send it when you're ready.","gia",{label:"Open email draft ↗",href:mail("New project enquiry | Beginning Concepts",body)});brief=null;chips([["Start another brief","brief"],["Services","services"],["Contact","contact"]])}
function topic(key,echo=false){if(echo)add(key==="brief"?"Start a project enquiry":key,"user");
if(key==="brief"){startBrief();return}
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
function respond(text){if(brief){const [key]=briefQuestions[brief.step];brief.values[key]=text;brief.step++;if(brief.step===briefQuestions.length)endBrief();else add(briefQuestions[brief.step][1]);return}
let s=text.trim();
if(/\b(start|prepare|create|write|make)\b.*\b(brief|enquiry|project inquiry)\b/i.test(s)){topic("brief");return}
if(/^(hi|hey|hello|good morning|good afternoon|good evening|who are you)\b/i.test(s)){add("Hello! I'm Gia. I'm here to help you explore Beginning Concepts and prepare an enquiry.");options();return}
let found=patterns.filter(([k,p])=>p.test(s)).map(x=>x[0]);if(found.length>1&&found.some(k=>["websites","apps","ai","learning"].includes(k))){const relevant=found.filter(k=>["websites","apps","ai","learning","digital"].includes(k));if(relevant.length>1){add("Your idea may combine "+relevant.join(", ")+". Let's explore one part first, or create a project brief with all the requirements.");chips([...relevant.map(k=>[k.charAt(0).toUpperCase()+k.slice(1),k]),["Project brief","brief"]]);return}}
topic(found[0]||"unknown")}
quick.addEventListener("click",e=>{let b=e.target.closest("[data-gia-topic]");if(b)topic(b.dataset.giaTopic,true)});
document.getElementById("giaForm").addEventListener("submit",e=>{e.preventDefault();let s=question.value.trim();if(!s)return;question.value="";add(s,"user");respond(s);question.focus()});
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
