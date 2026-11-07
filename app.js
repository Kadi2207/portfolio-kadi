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
IMG.ready.then(()=>document.querySelectorAll('img[data-img]').forEach(el=>{if(!imgApply(el,el.dataset.img))el.remove();}));

/* ===== QUESTIONS SUGGÉRÉES ===== */
const CANNED={fr:{why:`Kadidiatou relie la data, l'IA et le développement pour livrer des solutions concrètes. Elle analyse un besoin, conçoit la réponse et participe à sa réalisation technique. Chez Skills4Mind, elle a coordonné une équipe de 4 sur un projet IA noté **19,75/20**. Au Consulat du Mali, elle a audité des services et défendu ses recommandations. **Major de promotion en B2**, elle apprend vite et avec rigueur.`,
exp:`Kadidiatou compte trois expériences complémentaires. Chez **Skills4Mind** (2026), elle a conçu une solution IA de protection des données sensibles, notée 19,75/20, en coordonnant une équipe de 4. Au **Consulat général du Mali** (2026), elle a audité le site et analysé plus de 200 réponses d'usagers. Chez **Femmes Audacieuses** (2025), elle a contribué à une hausse estimée de 30 % de l'engagement.`,
tcim:`Chez Skills4Mind, Kadidiatou a piloté le projet TCIM : détecter et protéger des données médicales sensibles. Elle a coordonné une équipe de 4 en méthode Agile. Son modèle TF-IDF + Random Forest atteint **82,5 % de précision**. Les données sensibles sont classées et chiffrées automatiquement, et un dashboard en temps réel suit la conformité. Le projet a obtenu **19,75/20**.`,
team:`Oui. Chez Skills4Mind, Kadidiatou a coordonné une **équipe de 4** en méthode Agile sur le projet TCIM. Pour son projet de fin d'études, elle est **cheffe de projet** d'une équipe de 5, avec Scrum et Jira. Elle est aussi déléguée adjointe de sa promotion B3. En robotique, son équipe a remporté la première place du défi de conception.`,
ia:`Kadidiatou couvre l'IA du machine learning à l'IA générative. En NLP, elle a construit un classifieur TF-IDF + Random Forest à **82,5 % de précision**. Elle a évalué la robustesse de **6 LLMs open source** avec 250 prompts adversariaux. Avec Embedding Lab, en cours, elle approfondit les embeddings et les agents IA. Elle travaille en Python, Scikit-learn, Hugging Face, Flask et Docker.`,
ecom:`Kadidiatou a créé un dashboard d'analyse des ventes à partir du jeu UCI Online Retail. Elle a nettoyé 541 909 lignes brutes avec Python et Pandas pour en garder **397 884**. Son outil Streamlit et Plotly réunit 6 KPI et 6 graphiques interactifs. L'analyse révèle **8,91 millions de livres sterling** de chiffre d'affaires, dont 82 % au Royaume-Uni.`,
dispo:`Oui ! Kadidiatou recherche une **alternance de 10 à 12 mois en Data & IA**, et elle est **disponible dès maintenant**. Le rythme est de 3 semaines en entreprise et 2 semaines à l'école. À partir de mars 2027, elle sera presque à temps plein en entreprise. Elle est mobile dans toute la France. Contact : kadibaga22@gmail.com.`,
consulat:`Au Consulat général du Mali à Paris (avril à juin 2026), Kadidiatou a travaillé en immersion dans **sept services consulaires**. Elle a audité le site web et proposé une refonte complète. Elle a conçu une solution de gestion centralisée des associations. Elle a analysé plus de **200 réponses** à une enquête avec Google Sheets. Elle a présenté ses recommandations au Consul général et aux conseillers consulaires.`,
awards:`Kadidiatou est **major de promotion des B2** (2025-2026). Elle a remporté la **1ère place** d'un concours de robotique par équipe. OMNES Education l'a invitée à une interview en anglais sur l'IA et l'IA générative. Orbite Média l'a mise à l'honneur parmi les talents africains rencontrés à VivaTech. Ambassadrice de l'ECE, elle représente l'école aux portes ouvertes et aux forums.`,
edu:`Kadidiatou prépare un **Bachelor Intelligence Artificielle à l'ECE Paris** (2024-2027), spécialisation Data & IA. Elle est **major de promotion des B2** (2025-2026). Elle dirige son projet de fin d'études, une plateforme explicable d'analyse des écarts de compétences. Elle mène aussi Embedding Lab, un projet IA en solo sur les embeddings. Elle prévoit de poursuivre en Bac+5 en alternance.`},
en:{why:`Kadidiatou connects data, AI and development to deliver concrete solutions. She analyzes a need, designs the answer and helps build it. At Skills4Mind, she coordinated a team of 4 on an AI project graded **19.75/20**. At the Consulate of Mali, she audited services and defended her recommendations. **Top of the B2 class**, she learns fast and works with rigor.`,
exp:`Kadidiatou has three complementary experiences. At **Skills4Mind** (2026), she designed an AI solution to protect sensitive data, graded 19.75/20, while coordinating a team of 4. At the **Consulate General of Mali** (2026), she audited the website and analyzed more than 200 user responses. At **Femmes Audacieuses** (2025), she contributed to an estimated 30% increase in engagement.`,
tcim:`At Skills4Mind, Kadidiatou led the TCIM project: detecting and protecting sensitive medical data. She coordinated a team of 4 in Agile. Her TF-IDF + Random Forest model reaches **82.5% precision**. Sensitive data is classified and encrypted automatically, and a real-time dashboard tracks compliance. The project was graded **19.75/20**.`,
team:`Yes. At Skills4Mind, Kadidiatou coordinated a **team of 4** in Agile on the TCIM project. For her final-year project, she is **project lead** of a team of 5, using Scrum and Jira. She is also deputy class representative of her B3 class. In robotics, her team won first place in the robot design challenge.`,
ia:`Kadidiatou covers AI from machine learning to generative AI. In NLP, she built a TF-IDF + Random Forest classifier with **82.5% precision**. She evaluated the robustness of **6 open-source LLMs** with 250 adversarial prompts. With Embedding Lab, in progress, she is deepening embeddings and AI agents. She works with Python, Scikit-learn, Hugging Face, Flask and Docker.`,
ecom:`Kadidiatou built a sales analysis dashboard from the UCI Online Retail dataset. She cleaned 541,909 raw rows with Python and Pandas to keep **397,884**. Her Streamlit and Plotly tool brings together 6 KPIs and 6 interactive charts. The analysis reveals **£8.91 million** in revenue, 82% of it in the United Kingdom.`,
dispo:`Yes! Kadidiatou is looking for a **10 to 12-month apprenticeship in Data & AI**, and she is **available now**. The schedule is 3 weeks at the company and 2 weeks at school. From March 2027, she will be at the company almost full-time. She is mobile anywhere in France. Contact: kadibaga22@gmail.com.`,
consulat:`At the Consulate General of Mali in Paris (April to June 2026), Kadidiatou worked in immersion across **seven consular services**. She audited the website and proposed a full redesign. She designed a centralized management solution for associations. She analyzed more than **200 survey responses** with Google Sheets. She presented her recommendations to the Consul General and consular advisors.`,
awards:`Kadidiatou is **top of the B2 class** (2025-2026). She won **1st place** in a team robotics competition. OMNES Education invited her to an interview in English on AI and generative AI. Orbite Média featured her among the African talents met at VivaTech. As an ECE ambassador, she represents the school at open days and forums.`,
edu:`Kadidiatou is studying for a **Bachelor in Artificial Intelligence at ECE Paris** (2024-2027), Data & AI specialization. She is **top of the B2 class** (2025-2026). She leads her final-year project, an explainable platform analyzing skill gaps. She is also running Embedding Lab, a solo AI project on embeddings. She plans to continue to a Master's level (Bac+5) through apprenticeship.`}};
const SUGGESTIONS={fr:[["why", "Pourquoi la recruter ?"], ["exp", "Parle-moi de ses expériences"], ["tcim", "Son projet TCIM ?"], ["team", "A-t-elle dirigé une équipe ?"], ["ia", "Ses compétences en IA ?"], ["ecom", "Son projet e-commerce ?"], ["dispo", "Est-elle disponible ?"], ["consulat", "Son travail au Consulat du Mali ?"], ["awards", "Distinctions et engagement ?"], ["edu", "Sa formation ?"]],en:[["why", "Why hire her?"], ["exp", "Tell me about her experience"], ["tcim", "Her TCIM project?"], ["team", "Has she led a team?"], ["ia", "Her AI skills?"], ["ecom", "Her e-commerce project?"], ["dispo", "Is she available?"], ["consulat", "Her work at the Consulate of Mali?"], ["awards", "Awards and engagement?"], ["edu", "Her education?"]]};



/* ===== TRADUCTION ===== */
function toggleLang(){
  currentLang = currentLang==='fr'?'en':'fr';
  document.querySelectorAll('.lang-btn').forEach(b=>b.textContent = currentLang==='fr'?'EN':'FR');
  document.documentElement.lang = currentLang;
  chatHistory=[];
  document.querySelectorAll('[data-fr]').forEach(el=>{
    if(el.tagName==='INPUT'){el.placeholder = currentLang==='fr'?'Posez votre question...':'Ask your question...';}
    else{el.innerHTML = el.getAttribute('data-'+currentLang);}
  });
  renderSuggestions();
  updateMailto();
  setHeadLang();
}
/* Titre, description et libelles ARIA dans la langue choisie */
function setHeadLang(){
  const t=document.querySelector('title'),d=document.querySelector('meta[name="description"]');
  if(t){if(!t.dataset.frContent)t.dataset.frContent=t.textContent;document.title=t.dataset[currentLang+'Content']||document.title;}
  if(d){if(!d.dataset.frContent)d.dataset.frContent=d.content;d.content=d.dataset[currentLang+'Content']||d.content;}
  document.querySelectorAll('[data-fr-aria]').forEach(el=>{const v=el.getAttribute('data-'+currentLang+'-aria');if(v)el.setAttribute('aria-label',v);});
}

/* ===== CHATBOT ===== */
/* Questions libres : desactivees. Pour les rouvrir, mettre CHAT_FREE a true ici ET CHAT_FREE_ENABLED=true sur Vercel
   (sinon /api/chat repond 503). Voir MAINTENANCE.md, "Rouvrir les questions libres". */
const CHAT_FREE=false;
const MAIL={to:'kadibaga22@gmail.com',
  fr:{subject:'Question depuis votre portfolio',body:"Bonjour Kadi,\n\nJ'ai consulté votre portfolio et j'aimerais vous poser une question :\n\n"},
  en:{subject:'Question from your portfolio',body:'Hello Kadi,\n\nI visited your portfolio and would like to ask you a question:\n\n'}};
function mailtoHref(lang){const m=MAIL[lang];return 'mailto:'+MAIL.to+'?subject='+encodeURIComponent(m.subject)+'&body='+encodeURIComponent(m.body);}
function updateMailto(){const a=document.getElementById('chatMail');if(a)a.href=mailtoHref(currentLang);}
function setupChatFooter(){
  updateMailto();
  if(!CHAT_FREE)return;
  const box=document.getElementById('chatContact');
  const row=document.createElement('div');row.className='chat-input-row';
  row.innerHTML='<input class="chat-input" id="chatInput" maxlength="1000" data-fr="" data-en="" aria-label="Question"><button class="chat-send" data-act="chat-send" data-fr="Envoyer" data-en="Send"></button>';
  box.replaceWith(row);
  const input=row.querySelector('input'),btn=row.querySelector('button');
  input.placeholder=currentLang==='fr'?'Posez votre question...':'Ask your question...';btn.textContent=currentLang==='fr'?'Envoyer':'Send';
  input.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.isComposing)sendMessage();});
}
function renderSuggestions(){
  const row=document.getElementById('suggestionsRow');
  row.innerHTML='';
  SUGGESTIONS[currentLang].forEach(([id,q])=>{
    const sp=document.createElement('span');
    sp.className='suggestion';sp.textContent=q;
    sp.onclick=()=>askCanned(id,q);
    row.appendChild(sp);
  });
}
function askCanned(id,q){
  addMessage(q,'user');
  const bot=addMessage('…','bot');
  chatHistory.push({role:'user',content:q},{role:'assistant',content:CANNED[currentLang][id]});
  setTimeout(()=>{bot.innerHTML=mdToHtml(CANNED[currentLang][id]);const m=document.getElementById('chatMessages');m.scrollTop=m.scrollHeight;},550);
}
function openChat(){document.getElementById('chatModal').classList.add('open');}
function closeChat(){document.getElementById('chatModal').classList.remove('open');}

let chatHistory=[];
async function sendMessage(){
  const input=document.getElementById('chatInput');
  const msg=input.value.trim();
  if(!msg)return;
  input.value='';
  const hit=SUGGESTIONS[currentLang].find(x=>x[1].toLowerCase()===msg.toLowerCase());
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
      body:JSON.stringify({lang:currentLang,message:msg.slice(0,1000),history:hist})
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
    typing.textContent=currentLang==='fr'
      ?(quota?"Beaucoup de questions en ce moment, réessayez dans une minute.":slow?"La réponse met trop de temps, réessayez.":"Le chat est momentanément indisponible. Les questions suggérées ci-dessous fonctionnent toujours. Pour toute autre question, contactez Kadidiatou directement : kadibaga22@gmail.com")
      :(quota?"Lots of questions right now, please try again in a minute.":slow?"The answer is taking too long, please try again.":"The chat is temporarily unavailable. The suggested questions below still work. For anything else, contact Kadidiatou directly: kadibaga22@gmail.com");
  }
  const m=document.getElementById('chatMessages');m.scrollTop=m.scrollHeight;
}
function addMessage(text,type){
  const m=document.getElementById('chatMessages');
  const d=document.createElement('div');
  d.className='msg '+type;d.textContent=text;
  m.appendChild(d);m.scrollTop=m.scrollHeight;return d;
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
  'tcim':{title:{fr:'Protection de données par IA : TCIM',en:'AI Data Protection: TCIM'},img:'projet-tcim',link:'',linkLabel:{fr:'Voir la démo →',en:'Watch the demo →'},desc:{fr:"Coordination et pilotage d'une équipe de 4 en méthode agile, du besoin à la restitution. Solution de protection de données intégrant automatisation et IA : modèle de classification TF-IDF + Random Forest (300 arbres) détectant les données sensibles à 82,5% de précision. Application complète développée : API Flask, base PostgreSQL, dashboard temps réel (Chart.js), score de conformité RGPD pondéré, chiffrement automatique (Fernet) et reporting PDF.",en:"Led and coordinated a team of 4 (agile), from needs to delivery. Data-protection solution combining automation and AI: TF-IDF + Random Forest classification model (300 trees) detecting sensitive data at 82.5% precision. Full application built: Flask API, PostgreSQL database, real-time dashboard (Chart.js), weighted GDPR compliance score, automatic encryption (Fernet) and PDF reporting."},tags:['Python','Scikit-learn','Flask','PostgreSQL','Chart.js']},
  'ecommerce':{title:{fr:'Dashboard E-commerce Analytics',en:'E-commerce Analytics Dashboard'},img:'projet-ecommerce',link:'https://github.com/Kadi2207/ecommerce-dashboard-analytics',linkLabel:{fr:'Voir sur GitHub →',en:'View on GitHub →'},desc:{fr:"Projet personnel d'analyse de 397 884 lignes de transactions (18 532 factures, 4 338 clients, 37 pays). Nettoyage, exploration et restitution de 6 indicateurs et 6 graphiques dans un dashboard interactif pour dégager les leviers de croissance : produits phares, panier moyen (481£), poids du Royaume-Uni (82%), pour un chiffre d'affaires de 8,91M£.",en:"Personal project analyzing 397,884 transaction rows (18,532 invoices, 4,338 customers, 37 countries). Cleaning, exploration and delivery of 6 indicators and 6 charts in an interactive dashboard to reveal growth levers: top products, average basket (£481), UK share (82%), for £8.91M revenue."},tags:['Python','Pandas','Streamlit','Plotly']},
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
  document.getElementById('projDesc').textContent=p.desc[currentLang];
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
  'aws':{name:'AWS Cloud Foundations',org:'Amazon Web Services',id:'ID: f4bb5cf1-902a-4336-9372-0b41a9ac4d16',link:'https://www.credly.com/badges/f4bb5cf1-902a-4336-9372-0b41a9ac4d16',bg:'linear-gradient(135deg,#FF9900,#FF6600)',img:'cert-aws'},
  'aigenai':{name:'AI & GenAI : Level 2',org:'Liora.io',id:'ID: b790e3cd-ee26-4cde-9efb-8b29a1a328ec',link:'https://files.datascientest.com/certification/b790e3cd-ee26-4cde-9efb-8b29a1a328ec.pdf',bg:'linear-gradient(135deg,#667eea,#764ba2)',img:'cert-aigenai'},
  'prompt':{name:'Prompt Engineering Fundamentals',org:'Datascientest',id:'ID: 7ea44b89-fdaf-42fc-accb-836379ef2ef5',link:'https://files.datascientest.com/certification/7ea44b89-fdaf-42fc-accb-836379ef2ef5.pdf',bg:'linear-gradient(135deg,#06b6d4,#0284c7)',img:'cert-prompt'},
  'structuring':{name:'Structuring Data & GenAI Tools',org:'OMNES Education',id:'OMNES Education, 2025',link:'#',bg:'linear-gradient(135deg,#8b5cf6,#6d28d9)',img:'cert-structuring'},
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
  document.getElementById('cModalLink').href=c.link;
  const iframe=document.getElementById('cModalIframe'),cimg=document.getElementById('cModalImg');
  iframe.style.display='none';cimg.style.display='none';
  const showPdf=()=>{cimg.style.display='none';if(c.link&&c.link!=='#'){iframe.src=c.link;iframe.style.display='block';}};
  // image pleine taille chargee seulement a l'ouverture ; PDF officiel en secours
  cimg.onerror=showPdf;cimg.onload=null;
  if(imgGet(c.img)&&imgApply(cimg,c.img)){cimg.style.display='block';}else{showPdf();}
  document.getElementById('cModalLink').style.display=(c.link&&c.link!=='#')?'':'none';
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
  document.querySelectorAll('.strip').forEach(x=>x.classList.remove('active'));el.classList.add('active');
}
(function(){
  const strips=document.querySelectorAll('.strip');
  if(matchMedia('(hover:hover)').matches){strips.forEach(el=>el.addEventListener('mouseenter',()=>{strips.forEach(x=>x.classList.remove('active'));el.classList.add('active');}));}
  strips.forEach(el=>el.addEventListener('keydown',e=>{if(e.key==='Enter')el.click();}));
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

/* ===== ANIMATIONS : compteurs ===== */
const countObs=new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){animateCount(e.target);countObs.unobserve(e.target);}
  });
},{threshold:0.5});
document.querySelectorAll('[data-count]').forEach(el=>countObs.observe(el));

function animateCount(el){
  const target=parseFloat(el.dataset.count);
  const suffix=el.dataset.suffix||'';
  const plain=el.dataset.plain;
  const decimals=(el.dataset.count.split('.')[1]||'').length;
  let start=0;const dur=1400;const t0=performance.now();
  function step(now){
    const prog=Math.min((now-t0)/dur,1);
    const eased=1-Math.pow(1-prog,3);
    const val=target*eased;
    if(plain){el.textContent=Math.floor(val).toLocaleString('fr-FR');}
    else{el.textContent=val.toFixed(decimals).replace('.',',')+suffix;}
    if(prog<1)requestAnimationFrame(step);
    else{el.textContent=plain?target.toLocaleString('fr-FR'):target.toFixed(decimals).replace('.',',')+suffix;}
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
    case 'chat-send':if(CHAT_FREE)sendMessage();break;
    case 'project':openProject(k);break;
    case 'strip':stripClick(el,k);break;
    case 'project-overlay':if(e.target===el)closeProject();break;
    case 'project-close':closeProject();break;
    case 'cert-overlay':if(e.target===el)closeCert();break;
    case 'cert-close':closeCert();break;
    case 'light-close':closeLight();break;
  }
});
setupChatFooter();
