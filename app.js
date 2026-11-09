/* Portfolio de Kadidiatou Ibrahima Bagayoko : scripts du site (sortis de index.html pour la politique de securite CSP). */

/* ===== LIGHTBOX ===== */
window.LB={list:[],i:0};function closeLight(){document.getElementById('gLight').classList.remove('open');}function openLB(list){LB.list=list;LB.i=0;var im=document.getElementById('gLightImg');im.src=list[0];document.getElementById('gLight').classList.add('open');im.style.cursor=list.length>1?'pointer':'';}document.getElementById('gLightImg').addEventListener('click',function(e){if(LB.list.length>1){e.stopPropagation();LB.i=(LB.i+1)%LB.list.length;this.src=LB.list[LB.i];}});

let currentLang = 'fr';
/* ===== IMAGES : manifeste images.json (genere par "npm run images") =====
   Le site ne devine plus les extensions : il lit la liste des images reellement presentes.
   Si le manifeste manque, secours silencieux : chemin img/<nom>.webp, et image masquee si absente. */
const IMG={m:null};
IMG.ready=fetch('images.json').then(r=>r.ok?r.json():null).catch(()=>null).then(j=>{IMG.m=(j&&j.images)||null;return IMG.m;});
function imgGet(name){if(!name)return null;if(IMG.m)return IMG.m[name]||null;return {src:'img/'+name+'.webp'};}
function imgSrc(name,small){const i=imgGet(name);return i?(small&&i.sm?i.sm:i.src):null;}
function imgNames(re){return IMG.m?Object.keys(IMG.m).filter(k=>re.test(k)).sort((a,b)=>a.localeCompare(b,'en',{numeric:true})):[];}
function imgApply(el,name,small){const i=imgGet(name);if(!i)return false;const s=small&&i.sm;const w=s?i.smw:i.w,h=s?i.smh:i.h;if(w&&h){el.width=w;el.height=h;}el.src=s?i.sm:i.src;return true;}
document.addEventListener('error',e=>{const t=e.target;if(t&&t.tagName==='IMG')t.style.visibility='hidden';},true);
document.addEventListener('load',e=>{const t=e.target;if(t&&t.tagName==='IMG')t.style.visibility='';},true);
IMG.ready.then(()=>document.querySelectorAll('img[data-img]').forEach(el=>{if(!imgApply(el,el.dataset.img,!!el.dataset.sm))el.remove();}));

/* ===== QUESTIONS SUGGÉRÉES ===== */
const CANNED={fr:{profil:`Kadidiatou Bagayoko évolue à l'intersection du business, de la data et de l'IA. Étudiante en 3ème année de Bachelor en Intelligence Artificielle, spécialisation Data & IA à l'ECE Paris, et major de promotion B2, elle part du besoin métier et de l'audit des processus pour aller jusqu'au cadrage, au pilotage et à la réalisation technique : Python, SQL, Machine Learning, NLP et IA générative. Son objectif : relier enjeux business et possibilités technologiques pour livrer des solutions utiles et exploitables.`,
why:`Kadidiatou allie stratégie, technique et business. Elle analyse les problématiques, identifie les approches adaptées et contribue à leur mise en œuvre technique, en s'impliquant dans chaque projet comme si c'était le sien. Chez Skills4Mind, elle a réalisé **le meilleur projet en entreprise** et la meilleure intégration lors de la mise en situation professionnelle. **Major de promotion B2**, elle se distingue par sa rigueur, son adaptabilité, son énergie positive et sa capacité d'apprentissage.`,
exp:`Kadidiatou associe conseil, data et réalisation technique. Au Consulat du Mali, elle a audité des processus et présenté ses recommandations au Consul général. Chez Skills4Mind, elle a coordonné et piloté une équipe de 4 sur TCIM, de la classification IA au dashboard de conformité. Chez Femmes Audacieuses, elle a analysé l'audience et structuré la communication en ligne, pour une hausse estimée de 30 % de l'engagement.`,
tcim:`Chez Skills4Mind, Kadidiatou a coordonné et piloté une équipe de 4 en méthode Agile sur TCIM, une solution de protection de données sensibles de bout en bout. Le projet réunit une classification par Machine Learning (TF-IDF et Random Forest, 82,5 % de précision, 100 % de recall sur le corpus de test), un chiffrement automatique, une application Flask avec base PostgreSQL et un dashboard de conformité en temps réel. Il a été distingué comme meilleur projet en entreprise, avec la meilleure intégration lors de la mise en situation professionnelle.`,
team:`Oui. Chez Skills4Mind, Kadidiatou a coordonné une **équipe de 4** en méthode Agile sur le projet TCIM. Pour son projet de fin d'études, elle est **cheffe de projet** d'une équipe de 5, avec Scrum et Jira. Elle est aussi déléguée adjointe de sa promotion de 3ème année de Bachelor. En robotique, son équipe a remporté la première place du défi de conception.`,
ia:`Kadidiatou travaille l'IA sur trois fronts. Machine Learning et NLP : un classifieur supervisé (TF-IDF, Random Forest) à 82,5 % de précision. IA générative : l'évaluation de la robustesse de 6 LLMs open source avec 250 prompts adversariaux. Applied AI : avec Embedding Lab, en cours, elle construit le moteur sémantique d'un agent IA et explore la recherche vectorielle et le RAG. Stack : Python, Scikit-learn, Hugging Face, Flask, Docker.`,
ecom:`Kadidiatou a transformé près de 400 000 transactions e-commerce en indicateurs de pilotage : nettoyage de 541 909 lignes avec Python et Pandas (397 884 exploitables), dashboard Streamlit et Plotly avec 6 KPI et 6 graphiques. Insights : 8,91 M£ de chiffre d'affaires, 82 % au Royaume-Uni, pic en novembre 2011 (1,16 M£), jeudi premier jour de vente, panier moyen de 481 £.`,
dispo:`Oui. Kadidiatou est disponible dès novembre 2026 pour une alternance Data & IA, partout en France. Rythme de 3 semaines en entreprise et 2 semaines à l'école, puis 100 % en entreprise dès mars 2027. Pour échanger sur une opportunité, le plus simple est de lui écrire.`,
awards:`**Major de promotion B2**, ECE Paris, promotion 2025-2026, 19/20 de moyenne.\n**1ère place** à un concours de robotique par équipe.\n**Invitée par OMNES Education** à une interview en anglais sur l'IA et l'IA générative.\n**Mise à l'honneur par Orbite Média** parmi les talents africains rencontrés à VivaTech.\n**Ambassadrice de l'ECE** : représente l'école aux journées portes ouvertes et aux forums.`,
edu:`Kadidiatou prépare un Bachelor en Intelligence Artificielle à l'ECE Paris (2024-2027), avec une spécialisation en Data & IA. Elle est major de promotion de sa deuxième année (B2), en 2025-2026, avec une moyenne de 19/20.\n**Data & IA** : Data Mining, Machine Learning avancé, Python avancé et bibliothèques dédiées à l'IA.\n**Développement** : développement web et conception d'applications.\n**Bases de données** : SQL et NoSQL.\n**Mathématiques** : mathématiques avancées.\n**Gestion et communication** : gestion de projet et communication en contexte professionnel.\n**Langues** : anglais avancé (C1).\nElle travaille aussi sur son projet de fin d'études : une plateforme de matching entre compétences et opportunités, avec une analyse explicable des écarts de compétences.`},
en:{profil:`Kadidiatou Bagayoko works at the intersection of business, data and AI. A third-year student in the Bachelor in Artificial Intelligence, specializing in Data & AI at ECE Paris, and top of the B2 class, she starts from the business need and the process audit and carries it through to scoping, project management and technical delivery: Python, SQL, Machine Learning, NLP and generative AI. Her goal: connecting business challenges with technological possibilities to deliver useful, actionable solutions.`,
why:`Kadidiatou combines strategy, technology and business. She analyzes problems, identifies the right approaches and contributes to their technical implementation, treating every project as if it were her own. At Skills4Mind, she delivered **the best in-company project** and achieved the best integration during the professional placement. **Top of the B2 class**, she stands out for her rigor, adaptability, positive energy and ability to learn.`,
exp:`Kadidiatou combines consulting, data and technical delivery. At the Consulate of Mali, she audited processes and presented her recommendations to the Consul General. At Skills4Mind, she coordinated and led a team of 4 on TCIM, from AI classification to the compliance dashboard. At Femmes Audacieuses, she analyzed the audience and structured the online communication, for an estimated 30% increase in engagement.`,
tcim:`At Skills4Mind, Kadidiatou coordinated and led a team of 4 in Agile on TCIM, an end-to-end solution for protecting sensitive data. The project combines Machine Learning classification (TF-IDF and Random Forest, 82.5% precision, 100% recall on the test set), automatic encryption, a Flask application with a PostgreSQL database and a real-time compliance dashboard. It was recognized as the best in-company project, with the best integration during the professional placement.`,
team:`Yes. At Skills4Mind, Kadidiatou coordinated a **team of 4** in Agile on the TCIM project. For her final-year project, she is **project lead** of a team of 5, using Scrum and Jira. She is also deputy class representative of her third-year Bachelor class. In robotics, her team won first place in the robot design challenge.`,
ia:`Kadidiatou works on AI on three fronts. Machine Learning and NLP: a supervised classifier (TF-IDF, Random Forest) with 82.5% precision. Generative AI: evaluating the robustness of 6 open-source LLMs with 250 adversarial prompts. Applied AI: with Embedding Lab, in progress, she is building the semantic engine of an AI agent and exploring vector search and RAG. Stack: Python, Scikit-learn, Hugging Face, Flask, Docker.`,
ecom:`Kadidiatou turned nearly 400,000 e-commerce transactions into management indicators: cleaning 541,909 rows with Python and Pandas (397,884 usable), and a Streamlit and Plotly dashboard with 6 KPIs and 6 charts. Insights: £8.91M in revenue, 82% in the United Kingdom, a peak in November 2011 (£1.16M), Thursday as the top sales day, and a £481 average basket.`,
dispo:`Yes. Kadidiatou is available from November 2026 for a Data & AI apprenticeship, anywhere in France. The schedule is 3 weeks at the company and 2 weeks at school, then 100% at the company from March 2027. To discuss an opportunity, the simplest way is to write to her.`,
awards:`**Top of the B2 class**, ECE Paris, class of 2025-2026, 19/20 average.\n**1st place** in a team robotics competition.\n**Invited by OMNES Education** to an interview in English on AI and generative AI.\n**Featured by Orbite Média** among the African talents met at VivaTech.\n**ECE Ambassador**: represents the school at open days and forums.`,
edu:`Kadidiatou is studying for a Bachelor in Artificial Intelligence at ECE Paris (2024-2027), with a specialization in Data & AI. She is top of her second-year class (B2) in 2025-2026, with a 19/20 average.\n**Data & AI**: Data Mining, advanced Machine Learning, advanced Python and AI-dedicated libraries.\n**Development**: web development and application design.\n**Databases**: SQL and NoSQL.\n**Mathematics**: advanced mathematics.\n**Management and communication**: project management and communication in a professional context.\n**Languages**: advanced English (C1).\nShe is also working on her final-year project: a platform matching skills with opportunities, with an explainable analysis of skill gaps.`}};
const SUGGESTIONS={fr:[["profil", "Présentation du profil"], ["why", "Pourquoi la recruter ?"], ["exp", "Parle-moi de ses expériences"], ["tcim", "Son projet TCIM ?"], ["team", "A-t-elle dirigé une équipe ?"], ["ia", "Ses compétences en IA ?"], ["ecom", "Son projet e-commerce ?"], ["dispo", "Est-elle disponible ?"], ["awards", "Distinctions et engagement ?"], ["edu", "Sa formation ?"]],en:[["profil", "Profile overview"], ["why", "Why hire her?"], ["exp", "Tell me about her experience"], ["tcim", "Her TCIM project?"], ["team", "Has she led a team?"], ["ia", "Her AI skills?"], ["ecom", "Her e-commerce project?"], ["dispo", "Is she available?"], ["awards", "Awards and engagement?"], ["edu", "Her education?"]]};



/* ===== TRADUCTION ===== */
function toggleLang(){
  currentLang = currentLang==='fr'?'en':'fr';
  document.querySelectorAll('.lang-btn').forEach(b=>b.textContent = currentLang==='fr'?'EN':'FR');
  document.documentElement.lang = currentLang;
  document.querySelectorAll('[data-fr]').forEach(el=>{
    if(el.tagName==='INPUT'){el.placeholder = currentLang==='fr'?'Posez votre question...':'Ask your question...';}
    else{el.innerHTML = el.getAttribute('data-'+currentLang);}
  });
  setHeadLang();
  // le chat suit la langue du site, sauf si le visiteur a choisi une langue dans le chat
  if(!chatLangChoice)chatHistory=[];
  applyChatLang();
}
/* Titre, description et libelles ARIA dans la langue choisie */
function setHeadLang(){
  const t=document.querySelector('title'),d=document.querySelector('meta[name="description"]');
  if(t){if(!t.dataset.frContent)t.dataset.frContent=t.textContent;document.title=t.dataset[currentLang+'Content']||document.title;}
  if(d){if(!d.dataset.frContent)d.dataset.frContent=d.content;d.content=d.dataset[currentLang+'Content']||d.content;}
  document.querySelectorAll('[data-fr-aria]').forEach(el=>{const v=el.getAttribute('data-'+currentLang+'-aria');if(v)el.setAttribute('aria-label',v);});
  document.querySelectorAll('[data-fr-alt]').forEach(el=>{const v=el.getAttribute('data-'+currentLang+'-alt');if(v)el.alt=v;});
}

/* ===== CHATBOT ===== */
/* Questions libres : desactivees. Pour les rouvrir, mettre CHAT_FREE a true ici ET CHAT_FREE_ENABLED=true sur Vercel
   (sinon /api/chat repond 503). Voir MAINTENANCE.md, "Rouvrir les questions libres". */
const CHAT_FREE=false;
const MAIL={to:'kadibaga22@gmail.com',
  fr:{subject:'Question depuis votre portfolio',body:"Bonjour Kadi,\n\nJ'ai consulté votre portfolio et j'aimerais vous poser une question :\n\n"},
  en:{subject:'Question from your portfolio',body:'Hello Kadi,\n\nI visited your portfolio and would like to ask you a question:\n\n'}};
function mailtoHref(lang){const m=MAIL[lang];return 'mailto:'+MAIL.to+'?subject='+encodeURIComponent(m.subject)+'&body='+encodeURIComponent(m.body);}
function updateMailto(){const a=document.getElementById('chatMail');if(a)a.href=mailtoHref(chatLang());}

/* ===== LANGUE DU CHAT =====
   Bouton FR | EN dans l'en-tete du chat, independant de la langue du site.
   Choix garde pour la session (sessionStorage) ; sans choix, le chat suit la langue du site.
   Les messages issus des questions suggerees gardent l'id de leur reponse (data-canned) :
   ils sont re-rendus dans l'autre langue sans appel reseau. */
let chatLangChoice=null;
try{const v=sessionStorage.getItem('kb-chat-lang');if(v==='fr'||v==='en')chatLangChoice=v;}catch(e){}
function chatLang(){return chatLangChoice||currentLang;}
function setChatLang(l){
  if(l!=='fr'&&l!=='en')return;
  if(l!==chatLang())chatHistory=[];
  chatLangChoice=l;
  try{sessionStorage.setItem('kb-chat-lang',l);}catch(e){}
  applyChatLang();
}
function applyChatLang(){
  const modal=document.getElementById('chatModal');if(!modal)return;
  const l=chatLang();
  modal.querySelector('.chat-panel').lang=l;
  modal.querySelectorAll('[data-fr]').forEach(el=>{if(el.tagName!=='INPUT')el.innerHTML=el.getAttribute('data-'+l);});
  modal.querySelectorAll('[data-fr-aria]').forEach(el=>{const v=el.getAttribute('data-'+l+'-aria');if(v)el.setAttribute('aria-label',v);});
  modal.querySelectorAll('.msg[data-canned]').forEach(el=>{
    const id=el.dataset.canned;
    if(el.dataset.kind==='q'){const s=SUGGESTIONS[l].find(x=>x[0]===id);if(s)el.textContent=s[1];}
    else if(el.dataset.ready&&CANNED[l][id])el.innerHTML=mdToHtml(CANNED[l][id]);
  });
  const inp=document.getElementById('chatInput');if(inp)inp.placeholder=l==='fr'?'Posez votre question...':'Ask your question...';
  modal.querySelectorAll('[data-act="chat-lang"]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.lang===l)));
  renderSuggestions();
  updateMailto();
}
function setupChatFooter(){
  updateMailto();
  if(!CHAT_FREE)return;
  const box=document.getElementById('chatContact');
  const row=document.createElement('div');row.className='chat-input-row';
  row.innerHTML='<input class="chat-input" id="chatInput" maxlength="1000" data-fr="" data-en="" aria-label="Question"><button class="chat-send" data-act="chat-send" data-fr="Envoyer" data-en="Send"></button>';
  box.replaceWith(row);
  const input=row.querySelector('input'),btn=row.querySelector('button');
  input.placeholder=chatLang()==='fr'?'Posez votre question...':'Ask your question...';btn.textContent=chatLang()==='fr'?'Envoyer':'Send';
  input.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.isComposing)sendMessage();});
}
function renderSuggestions(){
  const row=document.getElementById('suggestionsRow');
  row.innerHTML='';
  SUGGESTIONS[chatLang()].forEach(([id,q])=>{
    // vrai bouton : atteignable au clavier (Tab), active par Entree et Espace
    const sp=document.createElement('button');
    sp.type='button';sp.className='suggestion';sp.textContent=q;
    sp.onclick=()=>askCanned(id,q);
    row.appendChild(sp);
  });
  updateSuggMore();
}
/* Fleche "plus de questions" : visible seulement s'il reste des questions a faire defiler */
function updateSuggMore(){
  const row=document.getElementById('suggestionsRow'),b=document.getElementById('suggMore');if(!row||!b)return;
  const more=row.scrollHeight-row.clientHeight>1&&row.scrollTop+row.clientHeight<row.scrollHeight-1;
  if(!more&&document.activeElement===b){const n=document.getElementById('chatMail')||document.querySelector('#chatModal [data-act="chat-close"]');if(n)n.focus({preventScroll:true});}
  b.hidden=!more;
}
function scrollSugg(){
  const row=document.getElementById('suggestionsRow');
  row.scrollBy({top:Math.max(40,Math.round(row.clientHeight*.8)),behavior:'auto'});
  updateSuggMore();
}
(function(){const row=document.getElementById('suggestionsRow');if(row)row.addEventListener('scroll',updateSuggMore,{passive:true});addEventListener('resize',updateSuggMore);})();
function askCanned(id,q){
  const u=addMessage(q,'user');u.dataset.canned=id;u.dataset.kind='q';
  const bot=addMessage('…','bot');bot.dataset.canned=id;bot.dataset.kind='a';
  chatHistory.push({role:'user',content:q},{role:'assistant',content:CANNED[chatLang()][id]});
  // langue lue au moment de l'affichage : un changement de langue pendant l'attente est respecte
  setTimeout(()=>{bot.dataset.ready='1';bot.innerHTML=mdToHtml(CANNED[chatLang()][id]);const m=document.getElementById('chatMessages');m.scrollTop=m.scrollHeight;},550);
}
function openChat(){document.getElementById('chatModal').classList.add('open');updateSuggMore();}
function closeChat(){document.getElementById('chatModal').classList.remove('open');}

let chatHistory=[];
async function sendMessage(){
  const input=document.getElementById('chatInput');
  const msg=input.value.trim();
  if(!msg)return;
  input.value='';
  const lang=chatLang();
  const hit=SUGGESTIONS[lang].find(x=>x[1].toLowerCase()===msg.toLowerCase());
  if(hit){askCanned(hit[0],msg);return;}
  addMessage(msg,'user');
  const typing=addMessage('…','bot');
  // La cle Groq et la base de connaissances restent sur le serveur (/api/chat).
  // Historique borne aux limites du serveur : 6 messages, 3900 caracteres chacun, 11000 au total.
  const hist=[];let total=0;
  for(let k=chatHistory.length-1;k>=0&&hist.length<6;k--){const c=chatHistory[k].content.slice(0,3900);if(total+c.length>11000)break;total+=c.length;hist.unshift({role:chatHistory[k].role,content:c});}
  try{
    const ctl=new AbortController();const to=setTimeout(()=>ctl.abort(),28000);
    const res=await fetch('/api/chat',{signal:ctl.signal,method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({lang,message:msg.slice(0,1000),history:hist})
    });
    clearTimeout(to);
    if(!res.ok)throw new Error('HTTP '+res.status);
    const data=await res.json();
    const reply=String((data&&data.reply)||'').trim();
    if(!reply)throw new Error('empty');
    chatHistory.push({role:'user',content:msg},{role:'assistant',content:reply});
    typing.innerHTML=mdToHtml(reply);
  }catch(e){
    const quota=/429/.test(String(e.message));const slow=e.name==='AbortError'||/504/.test(String(e.message));
    typing.textContent=lang==='fr'
      ?(quota?"Beaucoup de questions en ce moment, réessayez dans une minute.":slow?"La réponse met trop de temps, réessayez.":"Le chat est momentanément indisponible. Les questions suggérées ci-dessous fonctionnent toujours. Pour toute autre question, contactez Kadidiatou directement : kadibaga22@gmail.com")
      :(quota?"Lots of questions right now, please try again in a minute.":slow?"The answer is taking too long, please try again.":"The chat is temporarily unavailable. The suggested questions below still work. For anything else, contact Kadidiatou directly: kadibaga22@gmail.com");
  }
  const m=document.getElementById('chatMessages');m.scrollTop=m.scrollHeight;
}
/* Bulle de message ; les reponses de l'assistante sont precedees de son avatar (symbole #bot-ico de index.html). */
function addMessage(text,type){
  const m=document.getElementById('chatMessages');
  const d=document.createElement('div');
  d.className='msg '+type;d.textContent=text;
  if(type==='bot'){
    const row=document.createElement('div');row.className='msg-row bot';
    row.innerHTML='<span class="bot-ava" aria-hidden="true"><svg focusable="false"><use href="#bot-ico"/></svg></span>';
    row.appendChild(d);m.appendChild(row);
  }else m.appendChild(d);
  m.scrollTop=m.scrollHeight;return d;
}
/* Echappement HTML : tout texte venant du modele ou du manifeste passe par ici avant innerHTML. */
function escHtml(t){return String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');}
/* Mise en forme des reponses du chatbot. Securite (XSS) :
   1. les liens sont reperes sur le texte BRUT, puis chaque morceau (texte et lien) est echappe :
      aucune balise ni aucun attribut venant du modele n'est interprete ;
   2. seules nos propres balises sont ajoutees (strong, a, p, ul, li) ;
   3. liens : uniquement https:// (nouvel onglet, noopener noreferrer) et adresses email (mailto:),
      donc jamais de javascript: ni de data:. Un lien s'arrete aux espaces, guillemets, chevrons et a la ponctuation finale. */
const LINK_RE=/\bhttps:\/\/[^\s<>"'`*]*[^\s<>"'`*.,;:!?)\]]|[\w.+-]+@[\w-]+(?:\.[\w-]+)+/g;
function linkify(raw){
  let html='',last=0;
  raw.replace(LINK_RE,(m,off)=>{
    const e=escHtml(m);
    html+=escHtml(raw.slice(last,off))+(m.startsWith('https://')?'<a href="'+e+'" target="_blank" rel="noopener noreferrer">'+e+'</a>':'<a href="mailto:'+e+'">'+e+'</a>');
    last=off+m.length;return m;
  });
  return html+escHtml(raw.slice(last));
}
function mdToHtml(t){
  let s=linkify(String(t));
  s=s.replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>');
  const lines=s.split(/\n/);let out='';let inList=false;
  for(let ln of lines){
    const t2=ln.trim();
    if(/^[-•]\s+/.test(t2)){ if(!inList){out+='<ul>';inList=true;} out+='<li>'+t2.replace(/^[-•]\s+/,'')+'</li>'; }
    else{ if(inList){out+='</ul>';inList=false;} if(t2==='')out+=''; else out+='<p>'+t2+'</p>'; }
  }
  if(inList)out+='</ul>';
  return out;
}

/* ===== PROJETS ===== */
const projectData={
  'tcim':{title:{fr:'Protection de données par IA : TCIM',en:'AI Data Protection: TCIM'},img:'projet-tcim',link:'',linkLabel:{fr:'Voir la démo →',en:'Watch the demo →'},
    intro:{fr:"Chez Skills4Mind, Kadidiatou a coordonné et piloté une équipe de 4 en méthode Agile sur TCIM : protéger des données sensibles de bout en bout, de l'analyse des données à leur protection, leur exploitation et leur suivi.",en:"At Skills4Mind, Kadidiatou coordinated and led a team of 4 in Agile on TCIM: protecting sensitive data end to end, from data analysis to protection, use and monitoring."},
    points:[
      {fr:['Classification intelligente',"modèle de Machine Learning supervisé (TF-IDF + Random Forest, scikit-learn) qui détecte automatiquement les données sensibles. 82,5 % de précision et 100 % de recall sur le corpus de test (environ 190 textes annotés), avec un arbitrage assumé en faveur du recall pour ne laisser passer aucune donnée sensible."],en:['Smart classification','supervised Machine Learning model (TF-IDF + Random Forest, scikit-learn) that automatically detects sensitive data. 82.5% precision and 100% recall on the test set (about 190 annotated texts), with a deliberate trade-off in favour of recall so that no sensitive data slips through.']},
      {fr:['Chiffrement automatique','Fernet (AES-128-CBC + HMAC-SHA256). Toute donnée jugée sensible est chiffrée sans intervention humaine, avec confidentialité et intégrité garanties.'],en:['Automatic encryption','Fernet (AES-128-CBC + HMAC-SHA256). Any data judged sensitive is encrypted with no human intervention, guaranteeing confidentiality and integrity.']},
      {fr:['Pilotage et conformité en temps réel',"PostgreSQL, requêtes SQL d'agrégation, dashboard suivant les indicateurs clés et un score de conformité RGPD pondéré, exportable en rapport."],en:['Real-time monitoring and compliance','PostgreSQL, SQL aggregation queries, a dashboard tracking key indicators and a weighted GDPR compliance score, exportable as a report.']},
      {fr:['Ingénierie des données','migration SQLite vers PostgreSQL, données synthétiques avec Faker, aucune vraie donnée patient manipulée. API Flask et application complète.'],en:['Data engineering','migration from SQLite to PostgreSQL, synthetic data with Faker, no real patient data handled. Flask API and full application.']},
      {fr:['Pilotage',"organisation des travaux, suivi de l'avancement et articulation des composantes (Machine Learning, sécurité, API, base de données), avec cohérence entre objectifs fonctionnels, choix techniques et livrables."],en:['Project management','organizing the work, tracking progress and bringing the components together (Machine Learning, security, API, database), keeping functional goals, technical choices and deliverables consistent.']},
      {fr:['Distinction','meilleur projet en entreprise et meilleure intégration lors de la mise en situation professionnelle.'],en:['Distinction','best in-company project and best integration during the professional placement.']}
    ],tags:['Python','Scikit-learn','Flask','PostgreSQL','Chart.js']},
  'ecommerce':{title:{fr:'Dashboard e-commerce : analyse de ventes',en:'E-commerce dashboard: sales analysis'},img:'projet-ecommerce',link:'https://github.com/Kadi2207/ecommerce-dashboard-analytics',linkLabel:{fr:'Voir sur GitHub →',en:'View on GitHub →'},
    intro:{fr:"Dashboard interactif (Streamlit et Plotly) construit sur près de 400 000 lignes de transactions : 6 KPI, 6 graphiques et un tableau filtrable pour passer des données brutes à des décisions chiffrées.",en:"Interactive dashboard (Streamlit and Plotly) built on nearly 400,000 transaction rows: 6 KPIs, 6 charts and a filterable table to go from raw data to quantified decisions."},
    points:[
      {fr:['Données','541 909 lignes nettoyées en 397 884 exploitables (Python, Pandas).'],en:['Data','541,909 rows cleaned into 397,884 usable ones (Python, Pandas).']},
      {fr:['Performance',"8,91 M£ de chiffre d'affaires, 18 532 factures, 4 338 clients, panier moyen de 481 £."],en:['Performance','£8.91M in revenue, 18,532 invoices, 4,338 customers, £481 average basket.']},
      {fr:['Concentration',"le Royaume-Uni représente 82 % du chiffre d'affaires."],en:['Concentration','the United Kingdom accounts for 82% of revenue.']},
      {fr:['Saisonnalité','novembre 2011, mois le plus fort (1,16 M£).'],en:['Seasonality','November 2011, the strongest month (£1.16M).']},
      {fr:["Comportement d'achat",'jeudi, jour le plus fort (1,98 M£).'],en:['Buying behaviour','Thursday, the strongest day (£1.98M).']},
      {fr:['Ce que cela démontre','transformer un volume important de transactions en indicateurs de pilotage et en tendances lisibles par des décideurs.'],en:['What it shows','turning a large volume of transactions into management indicators and trends that decision-makers can read.']},
      {fr:['Limites',"données jusqu'au 9 décembre 2011, retours et annulations exclus."],en:['Limits','data up to 9 December 2011, returns and cancellations excluded.']}
    ],tags:['Python','Pandas','Streamlit','Plotly']},
  'revops':{title:{fr:'Audit RevOps & Migration CRM',en:'RevOps Audit & CRM Migration'},img:'projet-revops',link:'https://github.com/Kadi2207/revops-crm-migration-analysis',linkLabel:{fr:'Voir sur GitHub →',en:'View on GitHub →'},desc:{fr:"Audit qualité et analyse RevOps d'une migration CRM. Notebook Python de nettoyage écrit ligne par ligne (5 234 contacts, 734 sociétés) : normalisation de la casse, correction de typos par dictionnaire, standardisation des champs. Pratique HubSpot réelle : création de propriétés, import de 950 contacts avec mapping et 0 erreur, base juridique RGPD.",en:"Data-quality audit and RevOps analysis of a CRM migration. Python cleaning notebook written line by line (5,234 contacts, 734 companies): case normalization, typo correction via dictionary, field standardization. Real HubSpot practice: property creation, import of 950 contacts with mapping and 0 errors, GDPR legal basis."},tags:['Python','Pandas','HubSpot','RevOps']},
  'wmdp':{title:{fr:'Évaluation de robustesse de LLMs',en:'LLM Robustness Evaluation'},img:'projet-wmdp',link:'https://github.com/Kadi2207/wmdp-cyber',linkLabel:{fr:'Voir sur GitHub →',en:'View on GitHub →'},desc:{fr:"Hackathon ECE Paris mené en autonomie, encadré par deux enseignants. Conception d'un corpus de 250 prompts adversariaux (5 types de reformulation) et d'un pipeline Python interrogeant 6 LLMs open-source (Llama-3.2, Llama-3.3, Qwen2.5, DeepSeek-R1) via l'API Hugging Face, avec scoring automatisé des réponses. Dépôt propre : docker-compose, README professionnel, rapport PDF.",en:"ECE Paris hackathon done independently, supervised by two teachers. Designed a corpus of 250 adversarial prompts (5 reformulation types) and a Python pipeline querying 6 open-source LLMs (Llama-3.2, Llama-3.3, Qwen2.5, DeepSeek-R1) via the Hugging Face API, with automated response scoring. Clean repo: docker-compose, professional README, PDF report."},tags:['Python','Hugging Face','LLM','Docker']},
  'candy':{title:{fr:'CandyECE : Jeu Candy Crush en C',en:'CandyECE: Candy Crush game in C'},link:'',desc:{fr:"Développement complet du jeu Candy Crush en langage C. Grille 15×15, 4 niveaux de difficulté (bonbons, obstacles, jokers, cascade), calcul de score par regroupement, sauvegarde dans un fichier. Projet en équipe avec présentation et graphe d'appel Doxygen.",en:"Full development of the Candy Crush game in C. 15×15 grid, 4 difficulty levels (candies, obstacles, jokers, cascade), group-based scoring, file save. Team project with presentation and Doxygen call graph."},tags:['C','Algorithmique','CodeBlocks']},
  'lms':{title:{fr:'Plateforme LMS',en:'LMS Platform'},img:'projet-lms',link:'',desc:{fr:"Conception d'une plateforme de gestion de l'apprentissage type Blackboard. Gestion des cours et ressources, devoirs et examens en ligne avec système anti-triche, forums et messagerie, tableaux de bord et reporting, authentification SSO. Conforme RGPD.",en:"Design of a Blackboard-style learning management platform. Course and resource management, online assignments and exams with anti-cheating, forums and messaging, dashboards and reporting, SSO authentication. GDPR compliant."},tags:['Web','LMS','SSO','RGPD']},
  'bijoux':{title:{fr:'Boutique de bijoux',en:'Jewelry store'},img:'boutique-bijou1',imgs:['boutique-bijou1','boutique-bijou2'],link:'',desc:{fr:"Conception complète d'une boutique de bijoux en ligne sur WordPress avec le thème Kadence, par initiative personnelle. Design responsive, catalogue produits, tunnel d'achat et optimisation UX/UI de bout en bout.",en:"Full design of an online jewelry store on WordPress with the Kadence theme, personal initiative. Responsive design, product catalog, checkout funnel and end-to-end UX/UI optimization."},tags:['WordPress','UX/UI','E-commerce']},
  'veloMax':{title:{fr:'VéloMax : Base de données',en:'VéloMax: Database'},link:'',desc:{fr:"Projet de base de données : modélisation (JMerise) et création d'une base relationnelle, puis développement d'une application console de gestion. Stack XAMPP / MariaDB avec menu de lancement.",en:"Database project: modeling (JMerise) and building a relational database, then developing a console management application. XAMPP / MariaDB stack with a launch menu."},tags:['SQL','MariaDB','JMerise']}

};

function openProject(key){
  const p=projectData[key];
  document.getElementById('projTitle').textContent=p.title[currentLang];
  document.getElementById('projDesc').textContent=(p.intro||p.desc)[currentLang];
  // puces de la fiche detaillee : intitule en gras + texte, construits sans HTML brut
  const ul=document.getElementById('projPoints');ul.textContent='';
  (p.points||[]).forEach(pt=>{const [k,v]=pt[currentLang];const li=document.createElement('li');const b=document.createElement('strong');b.textContent=k;li.append(b,(currentLang==='fr'?' : ':': ')+v);ul.appendChild(li);});
  ul.style.display=p.points?'':'none';
  const img=document.getElementById('projImg');
  img.onclick=null;img.style.cursor='';
  const list=(p.imgs||[p.img]).filter(n=>imgGet(n));
  if(list.length&&imgApply(img,list[0])){
    img.style.display='block';
    // 2e image chargee seulement au clic
    if(list.length>1){let k=0;img.style.cursor='pointer';img.onclick=()=>{k=(k+1)%list.length;imgApply(img,list[k]);};}
  }
  else{img.style.display='none';}
  const td=document.getElementById('projTags');td.innerHTML='';
  p.tags.forEach(t=>{const s=document.createElement('span');s.className='tag';s.textContent=t;td.appendChild(s);});
  const link=document.getElementById('projLink');
  if(p.link&&p.link.indexOf('LIEN_')!==0){link.style.display='';link.href=p.link;link.textContent=p.linkLabel[currentLang];}else{link.style.display='none';}
  document.getElementById('projectModal').classList.add('open');
}
function closeProject(){document.getElementById('projectModal').classList.remove('open');}

/* ===== CERTIFICATIONS ===== */
const certData={
  'aws':{name:'AWS Cloud Foundations',org:'Amazon Web Services',id:'ID: f4bb5cf1-902a-4336-9372-0b41a9ac4d16',link:'https://www.credly.com/badges/f4bb5cf1-902a-4336-9372-0b41a9ac4d16',linkLabel:{fr:'Voir le badge Credly →',en:'View Credly badge →'},bg:'linear-gradient(135deg,#FF9900,#FF6600)',img:'cert-aws'},
  'aigenai':{name:'AI & GenAI : Level 2',org:'Liora.io',id:'ID: b790e3cd-ee26-4cde-9efb-8b29a1a328ec',link:'https://files.datascientest.com/certification/b790e3cd-ee26-4cde-9efb-8b29a1a328ec.pdf',bg:'linear-gradient(135deg,#667eea,#764ba2)',img:'cert-aigenai'},
  'prompt':{name:'Prompt Engineering Fundamentals',org:'Datascientest',id:'ID: 7ea44b89-fdaf-42fc-accb-836379ef2ef5',link:'https://files.datascientest.com/certification/7ea44b89-fdaf-42fc-accb-836379ef2ef5.pdf',bg:'linear-gradient(135deg,#06b6d4,#0284c7)',img:'cert-prompt'},
  'structuring':{name:'Structuring Data & GenAI Tools',org:'OMNES Education',id:'OMNES Education, 2025',link:'',bg:'linear-gradient(135deg,#8b5cf6,#6d28d9)',img:'cert-structuring'},
  'programming':{name:'Programming Niveau 1',org:'Datascientest',id:'ID: 6b58e001-7972-4f3e-988a-a7d7a9340ce9',link:'https://files.datascientest.com/certification/6b58e001-7972-4f3e-988a-a7d7a9340ce9.pdf',bg:'linear-gradient(135deg,#10b981,#059669)',img:'cert-programming'},
  'nocode':{name:'No Code Final : TechAway',org:'Datascientest × OMNES',id:'ID: 0c1a7a6f-c731-46c6-a80c-a54ca84a76f7',link:'https://files.datascientest.com/certification/0c1a7a6f-c731-46c6-a80c-a54ca84a76f7.pdf',bg:'linear-gradient(135deg,#f59e0b,#d97706)',img:'cert-nocode'},
  'sheets':{name:'Google Sheets Marketing',org:'Datascientest',id:'ID: b3bf7f96-c814-4058-9838-619b5288d174',link:'https://files.datascientest.com/certification/b3bf7f96-c814-4058-9838-619b5288d174.pdf',bg:'linear-gradient(135deg,#22c55e,#16a34a)',img:'cert-market'},
  'sheetsqcm':{name:'QCM Google Sheets : No Code TechAway Niv.1',org:'Datascientest',id:'ID: 48caed53-616a-406b-9a80-a274916807d8',link:'https://files.datascientest.com/certification/48caed53-616a-406b-9a80-a274916807d8.pdf',bg:'linear-gradient(135deg,#ec4899,#be185d)',img:'cert-sheets'}
};
function openCert(key){
  const c=certData[key];
  document.getElementById('cModalLogo').style.display='none';
  document.getElementById('cModalName').textContent=c.name;
  document.getElementById('cModalOrg').textContent=c.org;
  document.getElementById('cModalId').textContent=c.id;
  // lien officiel : libelle "Ouvrir PDF" pour un PDF, libelle propre sinon (badge Credly) ; masque s'il n'y en a pas
  const link=document.getElementById('cModalLink'),lbl=c.linkLabel||{fr:'Ouvrir PDF →',en:'Open PDF →'};
  link.setAttribute('data-fr',lbl.fr);link.setAttribute('data-en',lbl.en);link.textContent=lbl[currentLang];
  if(c.link)link.href=c.link;else link.removeAttribute('href');
  // certificat en grand dans un nouvel onglet (image du site), masque si l'image manque
  const tab=document.getElementById('cModalTab'),full=imgGet(c.img)?imgSrc(c.img):null;
  if(full){tab.href=full;tab.style.display='';}else{tab.removeAttribute('href');tab.style.display='none';}
  const iframe=document.getElementById('cModalIframe'),cimg=document.getElementById('cModalImg');
  iframe.style.display='none';cimg.style.display='none';
  const showPdf=()=>{cimg.style.display='none';if(c.link){iframe.src=c.link;iframe.style.display='block';}};
  // image pleine taille chargee seulement a l'ouverture ; PDF officiel en secours
  cimg.onerror=showPdf;cimg.onload=null;
  if(imgGet(c.img)&&imgApply(cimg,c.img)){cimg.style.display='block';}else{showPdf();}
  link.style.display=c.link?'':'none';
  document.getElementById('certModal').classList.add('open');
}
function closeCert(){
  document.getElementById('certModal').classList.remove('open');
  document.getElementById('cModalIframe').src='';
  const ci=document.getElementById('cModalImg');ci.onerror=null;ci.onload=null;ci.removeAttribute('src');
  document.getElementById('cModalImg').style.display='none';
  document.getElementById('cModalIframe').style.display='none';
}


/* ===== GALERIE : carrousel 3D (liste galerie-N lue dans images.json) ===== */
(function(){
  const track=document.getElementById('gTrack'),stage=document.getElementById('gStage'),bar=document.getElementById('gBar');
  const ticks=document.getElementById('gTicks'),now=document.getElementById('gNow'),tot=document.getElementById('gTot');
  const light=document.getElementById('gLight');
  const items=[];let idx=0;
  const pad=n=>String(n).padStart(2,'0');
  // Seules la carte active et ses 2 voisines de chaque cote (celles visibles a l'ecran) sont chargees,
  // et seulement quand la galerie approche de l'ecran.
  let armed=false;
  function loadNear(){
    if(!armed)return;
    items.forEach((el,k)=>{if(Math.abs(k-idx)<=2){const im=el.firstChild;if(!im.getAttribute('src'))im.src=im.dataset.src;}});
  }
  new IntersectionObserver((es,o)=>{if(es[0].isIntersecting){armed=true;loadNear();o.disconnect();}},{rootMargin:'600px 0px'}).observe(stage);
  function layout(){
    if(!items.length)return;
    const el=items[idx];
    const c=el.offsetLeft+el.offsetWidth/2;
    track.style.transform='translateX('+(stage.clientWidth/2-c)+'px)';
  }
  function go(i){
    idx=Math.max(0,Math.min(items.length-1,i));
    items.forEach((el,k)=>{el.className='g-item'+(k===idx?' is-active':k<idx?' is-prev':' is-next');});
    [...ticks.children].forEach((t,k)=>t.classList.toggle('on',k===idx));
    now.textContent=pad(idx+1);layout();loadNear();
  }
  // clic sur le fond (ou sur une photo seule) : ferme la visionneuse
  light.onclick=closeLight;
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape')closeLight();
    // Entree ou Espace sur la galerie : ouvre la photo active en grand
    if((e.key==='Enter'||e.key===' ')&&document.activeElement===stage&&items[idx]){e.preventDefault();openLB([items[idx].dataset.full]);return;}
    const r=stage.getBoundingClientRect();
    if((e.key==='ArrowRight'||e.key==='ArrowLeft')&&r.top<innerHeight&&r.bottom>0&&document.activeElement===stage){go(idx+(e.key==='ArrowRight'?1:-1));}
  });
  let sx=0,dx=0,down=false;
  stage.addEventListener('pointerdown',e=>{down=true;sx=e.clientX;dx=0;stage.classList.add('drag');});
  addEventListener('pointermove',e=>{if(down)dx=e.clientX-sx;});
  addEventListener('pointerup',()=>{if(!down)return;down=false;stage.classList.remove('drag');if(Math.abs(dx)>50)go(idx+(dx<0?1:-1));});
  addEventListener('resize',layout);
  IMG.ready.then(()=>{
    const list=imgNames(/^galerie-\d+$/);
    if(!list.length){stage.innerHTML='<div class="g-empty">Photos à venir</div>';bar.style.display='none';return;}
    list.forEach((name,i)=>{
      const info=imgGet(name);
      const d=document.createElement('div');d.className='g-item';
      const im=document.createElement('img');im.alt='';im.draggable=false;im.decoding='async';
      if(info.smw&&info.smh){im.width=info.smw;im.height=info.smh;im.style.setProperty('--r',(info.smw/info.smh).toFixed(4));}
      im.dataset.src=info.sm||info.src;
      d.appendChild(im);
      // photo pleine taille chargee seulement a l'agrandissement
      d.dataset.full=info.src;
      d.addEventListener('click',()=>{if(Math.abs(dx)>6)return;if(i===idx)openLB([info.src]);else go(i);});
      track.appendChild(d);items.push(d);
      const t=document.createElement('button');t.className='g-tick';t.setAttribute('aria-label','Photo '+(i+1));t.onclick=()=>go(i);ticks.appendChild(t);
    });
    tot.textContent=pad(list.length);
    document.getElementById('gPrev').onclick=()=>go(idx-1);
    document.getElementById('gNext').onclick=()=>go(idx+1);
    if(list.length<2)bar.style.display='none';
    go(Math.min(1,list.length-1));
    setTimeout(layout,400);
  });
})();


/* ===== ANIMATIONS SUPPLEMENTAIRES ===== */
function stripClick(el,key){
  if(el.classList.contains('active')){openProject(key);return;}
  document.querySelectorAll('.strip').forEach(x=>{x.classList.remove('active');x.setAttribute('aria-expanded','false');});el.classList.add('active');el.setAttribute('aria-expanded','true');
  // mobile (volets en colonne) : quand le volet du dessus se referme, le volet ouvert remonte ; on le ramene dans l'ecran
  if(matchMedia('(max-width:900px)').matches){
    const rm=matchMedia('(prefers-reduced-motion:reduce)').matches;
    let done=false;const go=()=>{if(done)return;done=true;el.removeEventListener('transitionend',onEnd);el.scrollIntoView({block:'nearest',behavior:rm?'auto':'smooth'});};
    const onEnd=e=>{if(e.target===el&&e.propertyName==='height')go();};
    if(rm)go();else{el.addEventListener('transitionend',onEnd);setTimeout(go,900);}
  }
}
(function(){
  const strips=document.querySelectorAll('.strip');
  if(matchMedia('(hover:hover)').matches){strips.forEach(el=>el.addEventListener('mouseenter',()=>{strips.forEach(x=>{x.classList.remove('active');x.setAttribute('aria-expanded','false');});el.classList.add('active');el.setAttribute('aria-expanded','true');}));}
  // Entree et Espace : geres par le gestionnaire commun des [role="button"][data-act] (plus de double declenchement)
  // marquee
  const words=['Python','SQL','Machine Learning','NLP','Flask','PostgreSQL','Power BI','Streamlit','LLMs','Hugging Face','Docker','RGPD','Pandas','Scikit-learn'];
  const mt=document.getElementById('marqTrack');
  if(mt){mt.innerHTML=words.concat(words).map(w=>'<span>'+w+'</span>').join('');}
  // stagger index
  document.querySelectorAll('.projects-grid,.cert-grid,.speak-grid,.exp-list,.skills-grid').forEach(g=>[...g.children].forEach((c,i)=>c.style.setProperty('--i',i)));
  // progress bar
  const pb=document.getElementById('progress');
  let pbq=0;
  function prog(){pbq=0;const h=document.documentElement;const m=h.scrollHeight-innerHeight;pb.style.transform='scaleX('+(m>0?scrollY/m:0)+')';}
  addEventListener('scroll',()=>{if(!pbq)pbq=requestAnimationFrame(prog);},{passive:true});prog();
  // animations en boucle mises en pause quand leur section sort de l'ecran
  const offObs=new IntersectionObserver(es=>es.forEach(e=>e.target.classList.toggle('is-off',!e.isIntersecting)),{rootMargin:'100px 0px'});
  document.querySelectorAll('section,.marquee').forEach(el=>offObs.observe(el));
  if(matchMedia('(hover:hover) and (pointer:fine)').matches&&!matchMedia('(prefers-reduced-motion:reduce)').matches){
    // tilt on project cards
    document.querySelectorAll('.project-card,.cert-card').forEach(c=>{
      c.addEventListener('mousemove',e=>{const r=c.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;c.style.transition='transform .12s';c.style.transform='perspective(900px) rotateX('+(-y*7)+'deg) rotateY('+(x*9)+'deg) translateY(-7px)';});
      c.addEventListener('mouseleave',()=>{c.style.transition='transform .5s';c.style.transform='';});
    });
    // magnetic gold buttons
    document.querySelectorAll('.btn-or').forEach(b=>{
      b.addEventListener('mousemove',e=>{const r=b.getBoundingClientRect();b.style.transform='translate('+((e.clientX-r.left-r.width/2)*.18)+'px,'+((e.clientY-r.top-r.height/2)*.28)+'px)';});
      b.addEventListener('mouseleave',()=>{b.style.transform='';});
    });
  }
})();


document.querySelectorAll('.cert-card').forEach(c=>c.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();c.click();}}));


/* ===== PRISE DE PAROLE : dossiers en verre ===== */
(function(){
  const NS='http://www.w3.org/2000/svg';
  const FRONT='M0 22A22 22 0 0 1 22 0L118 0C144 0 146 32 172 32L318 32A22 22 0 0 1 340 54L340 176A22 22 0 0 1 318 198L22 198A22 22 0 0 1 0 176Z';
  const CUE='<span class="tap-cue" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 14a8 8 0 0 1-8 8"/><path d="M18 11v-1a2 2 0 0 0-2-2a2 2 0 0 0-2 2"/><path d="M14 10V9a2 2 0 0 0-2-2a2 2 0 0 0-2 2v1"/><path d="M10 9.5V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v10"/><path d="M18 11a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/></svg></span>';
  const roots=document.querySelectorAll('.gf-root');
  function fit(r){const k=r.clientWidth/340;r.style.height=(326*k)+'px';r.querySelector('.gf-stage').style.transform='translateY('+(54*k)+'px) scale('+k+')';}
  function h(str){let x=2166136261;for(let i=0;i<str.length;i++){x=Math.imul(x^str.charCodeAt(i),16777619);}return (x>>>0)/4294967296;}
  function files(n){return imgNames(new RegExp('^parole-'+n+'(-\\d+)?$')).map(x=>imgSrc(x,true));}
  roots.forEach(async r=>{
    const n=r.dataset.n,ck=r.dataset.cert;
    r.innerHTML='<div class="gf-stage"><div class="gf-tilt"><div class="gf-shadow"></div><div class="gf-back"></div><div class="gf-files" role="list"></div><div class="gf-front"><div class="gf-tint"></div><svg class="gf-rim" viewBox="0 0 340 198" aria-hidden="true"><path d="'+FRONT+'"/></svg><button type="button" class="gf-hit" aria-expanded="false"></button><div class="gf-label"><span class="gf-title" data-fr="'+r.dataset.titleFr+'" data-en="'+r.dataset.titleEn+'">'+r.dataset.titleFr+'</span><span class="gf-meta" data-fr="'+r.dataset.metaFr+'" data-en="'+r.dataset.metaEn+'">'+r.dataset.metaFr+'</span></div></div>'+CUE+'</div></div>';
    const hit=r.querySelector('.gf-hit');hit.setAttribute('aria-label',r.dataset.titleFr);
    const fl=r.querySelector('.gf-files');fl.setAttribute('inert','');
    fit(r);new ResizeObserver(()=>fit(r)).observe(r);
    // lumière et parallaxe
    r.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;const b=r.getBoundingClientRect();r.style.setProperty('--gf-px',(((e.clientX-b.left)/b.width)*2-1).toFixed(3));r.style.setProperty('--gf-py',(((e.clientY-b.top)/b.height)*2-1).toFixed(3));});
    r.addEventListener('pointerleave',()=>{r.style.setProperty('--gf-px',0);r.style.setProperty('--gf-py',0);});
    function setOpen(v){if(v){roots.forEach(o=>{if(o!==r)o._close&&o._close();});}r.toggleAttribute('data-open',v);hit.setAttribute('aria-expanded',v);fl.toggleAttribute('inert',!v);}
    r._close=()=>setOpen(false);
    hit.addEventListener('click',()=>{if(ck){openCert(ck);return;}setOpen(!r.hasAttribute('data-open'));});
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&r.hasAttribute('data-open')){setOpen(false);hit.focus();}});
    document.addEventListener('pointerdown',e=>{if(r.hasAttribute('data-open')&&!r.contains(e.target))setOpen(false);});
    // contenu
    await IMG.ready;
    const cn=ck&&certData[ck]&&certData[ck].img;
    let list;if(ck){const s=imgGet(cn)?imgSrc(cn,true):null;list=s?[s]:[];}else list=files(n);
    const back=r.querySelector('.gf-back');
    // vignette chargee a l'approche (lazy) ; certificat entier visible (contain)
    if(list[0]){const im=document.createElement('img');im.className='gf-art'+(ck?' gf-art--doc':'');im.alt='';im.loading='lazy';im.decoding='async';im.src=list[0];im.draggable=false;back.appendChild(im);}
    const shown=ck?[]:list.slice(-4);
    shown.forEach((src,v)=>{
      const cnt=shown.length;const slot=cnt<=1?0:(v/(cnt-1))*2-1;
      const b=document.createElement('button');b.type='button';b.className='gf-sheet'+(src?' gf-sheet--img':'');
      const j=h('p'+n+v);
      b.style.cssText='--gf-slot:'+slot+';--gf-depth:'+(cnt-1-v)+';--gf-jx:'+((j-.5)*10).toFixed(2)+'px;--gf-jr:'+((h('r'+n+v)-.5)*3.2).toFixed(2)+'deg;z-index:'+(v+1);
      b.innerHTML=(src?'<img src="'+escHtml(src)+'" alt="" draggable="false">':'')+'<span class="gf-sheet-name">'+(src?'Photo '+(v+1):'Photos à venir')+'</span>';
      if(src)b.onclick=()=>openLB([src]);
      const slotEl=document.createElement('div');slotEl.setAttribute('role','listitem');slotEl.style.display='contents';slotEl.appendChild(b);fl.appendChild(slotEl);
    });
  });
})();


/* ===== PRISE DE PAROLE : badges sur rail (pendule) ===== */
(function(){
  const rm=matchMedia('(prefers-reduced-motion:reduce)').matches;
  const items=[...document.querySelectorAll('.lan')].map((el,i)=>({el,p:el.querySelector('.lan-pivot'),b:el.querySelector('.lan-badge'),a:0,v:0,drag:false,sx:0,sa:0,moved:false,ph:i*1.7,src:null}));
  const rail=document.querySelector('.lan-rail');
  // vignettes chargees a l'approche du rail ; grandes photos seulement au clic (lightbox)
  IMG.ready.then(()=>{
    items.forEach(it=>{const names=imgNames(new RegExp('^parole-'+it.el.dataset.n+'(-\\d+)?$'));it.all=names.map(x=>imgSrc(x));it.src=it.all[0]||null;it.thumb=names[0]?imgSrc(names[0],true):null;});
    new IntersectionObserver((es,o)=>{if(!es[0].isIntersecting)return;items.forEach(it=>{if(it.thumb)it.el.querySelector('.lan-photo').style.backgroundImage='url("'+it.thumb+'")';});o.disconnect();},{rootMargin:'500px 0px'}).observe(rail);
  });
  items.forEach(it=>{
    it.b.addEventListener('pointerdown',e=>{it.drag=true;it.moved=false;it.sx=e.clientX;it.sa=it.a;it.b.setPointerCapture(e.pointerId);});
    it.b.addEventListener('pointermove',e=>{if(!it.drag)return;const dx=e.clientX-it.sx;if(Math.abs(dx)>4)it.moved=true;it.a=Math.max(-38,Math.min(38,it.sa+dx*.25));it.v=0;});
    const end=()=>{it.drag=false;};
    it.b.addEventListener('pointerup',end);it.b.addEventListener('pointercancel',end);
    it.b.addEventListener('click',()=>{if(it.moved||!it.src)return;openLB(it.all);});
    it.b.addEventListener('keydown',e=>{if(e.key==='ArrowLeft')it.v-=3;if(e.key==='ArrowRight')it.v+=3;});
    it.el.addEventListener('pointerenter',e=>{if(!it.drag&&e.pointerType!=='touch')it.v+=(Math.random()<.5?-1:1)*1.6;});
  });
  // boucle requestAnimationFrame arretee completement quand le rail est hors ecran
  let t=0,vis=false,raf=0;
  new IntersectionObserver(es=>{vis=es[0].isIntersecting;if(vis&&!raf)raf=requestAnimationFrame(tick);},{threshold:0}).observe(rail);
  function tick(){
    raf=0;if(!vis)return;t+=.016;
    items.forEach(it=>{
      if(!it.drag){const sway=rm?0:Math.sin(t*.9+it.ph)*1.2;it.v+=(-.045*(it.a-sway));it.v*=.965;it.a+=it.v;}
      it.p.style.setProperty('--ang',it.a.toFixed(2)+'deg');
    });
    raf=requestAnimationFrame(tick);
  }
})();

/* ===== ANIMATIONS : reveal au scroll ===== */
const revObs=new IntersectionObserver((entries)=>{
  entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('on');revObs.unobserve(e.target);}});
},{threshold:0.12});
document.querySelectorAll('.reveal').forEach(el=>revObs.observe(el));

/* ===== ANIMATIONS : compteurs =====
   Les valeurs finales sont ecrites en dur dans index.html (lisibles sans JavaScript et par les robots).
   Le decompte ne joue qu'avec JavaScript, jamais en prefers-reduced-motion, et finit sur le texte exact de la langue. */
if(!matchMedia('(prefers-reduced-motion:reduce)').matches){
  const countObs=new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){animateCount(e.target);countObs.unobserve(e.target);}
    });
  },{threshold:0.5});
  document.querySelectorAll('[data-count]').forEach(el=>countObs.observe(el));
}
function animateCount(el){
  const target=parseFloat(el.dataset.count);
  const decimals=el.dataset.plain?0:(el.dataset.count.split('.')[1]||'').length;
  const final=()=>el.getAttribute('data-'+currentLang)||el.textContent;
  // le nombre anime remplace celui du texte final ("8,91 M£", "£8.91M"...), au format de la langue
  const fmt=v=>final().replace(/\d[\d\s.,  ]*\d|\d/,(decimals?v:Math.floor(v)).toLocaleString(currentLang==='en'?'en-GB':'fr-FR',{minimumFractionDigits:decimals,maximumFractionDigits:decimals}));
  const dur=1400;const t0=performance.now();
  function step(now){
    const prog=Math.min((now-t0)/dur,1);
    if(prog<1){el.textContent=fmt(target*(1-Math.pow(1-prog,3)));requestAnimationFrame(step);}
    else el.textContent=final();
  }
  requestAnimationFrame(step);
}

/* ===== close navmenu on link click (mobile) ===== */
document.querySelectorAll('#navmenu a').forEach(a=>a.addEventListener('click',()=>document.getElementById('navmenu').classList.remove('open')));

function toggleTheme(){
  const cur=document.documentElement.getAttribute('data-theme')==='dark'?'light':'dark';
  document.documentElement.setAttribute('data-theme',cur);
  syncThemeSwitch();
  try{localStorage.setItem('kb-theme',cur);}catch(e){}
}
function syncThemeSwitch(){const dark=document.documentElement.getAttribute('data-theme')==='dark';document.querySelectorAll('.theme-switch').forEach(b=>b.setAttribute('aria-checked',String(dark)));}
(function(){
  let t='light';
  try{t=localStorage.getItem('kb-theme')|| (matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');}catch(e){}
  document.documentElement.setAttribute('data-theme',t);
  syncThemeSwitch();
})();

/* ===== CLAVIER : cartes cliquables (role=button) et modales (focus piege, Escape, retour du focus) ===== */
document.addEventListener('keydown',e=>{
  if((e.key==='Enter'||e.key===' ')&&e.target.matches&&e.target.matches('[role="button"][data-act]:not(button)')){e.preventDefault();e.target.click();}
});
(function(){
  const closers={chatModal:closeChat,projectModal:closeProject,certModal:closeCert,gLight:closeLight};
  const FOC='a[href],button:not([disabled]),input,textarea,select,iframe,[tabindex]:not([tabindex="-1"])';
  const focusables=m=>[...m.querySelectorAll(FOC)].filter(el=>el.getClientRects().length&&getComputedStyle(el).visibility!=='hidden');
  const stack=[];
  for(const id of Object.keys(closers)){
    const m=document.getElementById(id);if(!m)continue;
    if(!m.hasAttribute('tabindex'))m.tabIndex=-1;
    new MutationObserver(()=>{
      const open=m.classList.contains('open'),i=stack.findIndex(s=>s.m===m);
      if(open&&i<0){stack.push({m,back:document.activeElement});const f=focusables(m);(f[0]||m).focus({preventScroll:true});}
      else if(!open&&i>=0){const s=stack.splice(i,1)[0];if(s.back&&s.back.focus)s.back.focus({preventScroll:true});}
    }).observe(m,{attributes:true,attributeFilter:['class']});
  }
  document.addEventListener('keydown',e=>{
    const top=stack[stack.length-1];if(!top)return;
    if(e.key==='Escape'){e.preventDefault();closers[top.m.id]();return;}
    if(e.key!=='Tab')return;
    const f=focusables(top.m);if(!f.length){e.preventDefault();top.m.focus();return;}
    const a=f[0],z=f[f.length-1],cur=document.activeElement;
    if(!top.m.contains(cur)||(e.shiftKey&&cur===a)||(!e.shiftKey&&cur===z)){e.preventDefault();(e.shiftKey?z:a).focus();}
  });
})();
renderSuggestions();

/* ===== ACTIONS : remplacent les onclick en ligne (compatibles avec la politique de securite CSP) ===== */
document.addEventListener('click',e=>{
  const el=e.target.closest('[data-act]');if(!el)return;
  const k=el.dataset.key;
  switch(el.dataset.act){
    case 'nav':document.getElementById('navmenu').classList.toggle('open');break;
    case 'theme':toggleTheme();break;
    case 'lang':toggleLang();break;
    case 'chat-open':openChat();break;
    case 'chat-overlay':if(e.target===el)closeChat();break;
    case 'chat-close':closeChat();break;
    case 'chat-lang':setChatLang(el.dataset.lang);break;
    case 'sugg-more':scrollSugg();break;
    case 'chat-send':if(CHAT_FREE)sendMessage();break;
    case 'project':openProject(k);break;
    case 'strip':stripClick(el,k);break;
    case 'project-overlay':if(e.target===el)closeProject();break;
    case 'project-close':closeProject();break;
    case 'cert-overlay':if(e.target===el)closeCert();break;
    case 'cert-close':closeCert();break;
    case 'light-close':closeLight();break;
    case 'rec-open':{const s=imgSrc('recommandation-femmes-audacieuses');if(s)openLB([s]);break;}
  }
});
setupChatFooter();
applyChatLang();
