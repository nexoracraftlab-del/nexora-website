
function updateContactLabels(lang) {
  document.querySelectorAll('[data-contact-icons]').forEach(group => group.setAttribute('aria-label',lang === 'fa' ? 'راه‌های ارتباطی' : 'Contact links'));
  const names = lang === 'fa' ? {email:'ایمیل بده',instagram:'در اینستاگرام دایرکت بده',github:'گیت‌هاب Nexora'} : {email:'Send an email',instagram:'DM on Instagram',github:'Nexora on GitHub'};
  document.querySelectorAll('[data-contact]').forEach(icon => {
    const label = names[icon.dataset.contact];
    icon.setAttribute('aria-label', label);
    icon.title = label;
    const caption = icon.querySelector('[data-contact-caption]');
    if (caption) caption.textContent = label;
  });
}
const translations={skip:'Skip to content',home:'Home',about:'About',services:'Services',projects:'Projects',contact:'Contact',talk:'Let’s talk ↗',menu:'Menu',heroFirst:'Your ideas.',heroSecond:'Digital possibilities.',heroDesc:'Nexora designs and develops websites, digital menus and lightweight automation tools around your business needs. From presenting your services and showcasing products to simplifying repetitive tasks, the focus is on clear design, responsive layouts and practical features that are easy to use on mobile and desktop.',viewProjects:'Explore projects',startProject:'Let’s talk',explore:'Discover Nexora',aboutLabel:'ABOUT NEXORA',aboutTitle:'Digital products for everyday business needs.',aboutIntro:'Present your business, showcase your products and simplify your workflows.',storyTitle:'Websites, digital menus and practical tools.',storyText:'Nexora designs and develops business websites and landing pages, digital menus and catalogs, and lightweight automation tools. Each product focuses on ease of use, a clear mobile experience and features suited to your business.',storyNote:'This portfolio grows as demonstration projects are completed. Every project is presented with its actual status.',feature1:'Designed for mobile',feature1Text:'Readable layouts and straightforward interactions for everyday use.',feature2:'Clear communication',feature2Text:'A defined scope, design reviews and feedback throughout the build.',feature3:'A considered solution',feature3Text:'Features and tools chosen around the actual needs of the project.',servicesLabel:'WHAT WE BUILD',servicesTitle:'Start small. Build thoughtfully.',servicesIntro:'Three ways to shape your business’s digital presence.',service1:'Websites & landing pages',service1Text:'Introduce your business and services with responsive design, clear content and a direct way to connect.',service2:'Digital menus & catalogs',service2Text:'Organized product collections, café menus and simple experiences for browsing and choosing.',service3:'Practical digital tools',service3Text:'Explore repetitive workflows and create lightweight tools to simplify everyday tasks.',projectsLabel:'THE PROJECT LAB',projectsTitle:'Ideas, one step closer to reality.',projectsIntro:"An implemented live demo alongside two planned concepts, each shown with its actual status.",concept:'Concept / Planned',project1:"NOIR Coffee — Interactive Digital Menu",project1Text:"A bilingual digital menu with 28 products, search, category filters and interactive details. The café, products and prices are fictional.",menuFeature1:'Persian interface with RTL support',menuFeature2:'Product categories and search',menuFeature3:'Structured data editing',scope:'Explore project scope ↗',project2:'E-commerce storefront',project2Text:'Product listings and details, category filters and a demo shopping cart. No live payments.',project3:'Service business landing page',project3Text:'A presentation page for a fictional business, with services, a process and a clear contact section.',processLabel:'HOW WE WORK',processTitle:'From the first conversation to delivery.',step1:'Discover & define',step1Text:'Clarify the goal, audience and project scope.',step2:'Design & build',step2Text:'Review the design and develop the working experience.',step3:'Review & deliver',step3Text:'Check key interactions and prepare the usage guide.',contactLabel:'LET’S CONNECT',contactTitle:'Have an idea? Let’s talk about it.',contactIntro:'A new website, a digital menu or a practical tool.',emailPending:'Verified email details will be added soon.',instagramPending:'Account created; the link will be added after confirmation.',githubPending:'Project repositories will be linked when ready.',footer:'Web design, development & digital solutions',dialogNote:'This project has not been implemented yet. Card images are concept previews only.'};
Object.assign(translations, {"heroLabel": "WEB DESIGN & DIGITAL DEVELOPMENT", "location": "WEBSITES / DIGITAL MENUS / AUTOMATION", "preview": "CONCEPT PREVIEW / 01", "discoverLabel": "01 / DISCOVER", "buildLabel": "02 / BUILD", "deliverLabel": "03 / DELIVER", "scopeLabel": "NEXORA / PROJECT SCOPE", "emailLabel": "Email", "instagramLabel": "Instagram", "githubLabel": "GitHub", "webTag": "WEB", "designTag": "DESIGN", "automationTag": "AUTOMATION", "responsiveTag": "Responsive", "digitalMenuTag": "Digital menu", "catalogTag": "Catalog", "automationChip": "Automation", "utilitiesTag": "Utilities", "cafeKicker": "COFFEE / DAILY", "cafeBottom": "ESPRESSO · LATTE · FILTER", "shopKicker": "EVERYDAY ESSENTIALS", "landingKicker": "SPACES THAT WORK", "cafeHeadline": "Good coffee. Better moments.", "shopHeadline": "Less, but considered.", "landingHeadline": "Room for possibilities."});
Object.assign(translations, {emailAddressLabel:'Email address:',copyEmail:'Copy email address',emailApp:'Open email app',emailHelp:'“Send an email” opens a new message in Gmail. For other providers, copy the address or use your email app.'});
Object.assign(translations, {demoStatus:'Live demo / Demonstration project',viewDemo:'View demo ↗'});
const nodes=[...document.querySelectorAll('[data-i]')];const persian={};nodes.forEach(el=>{persian[el.dataset.i]=el.textContent});let language='fa';try{if(localStorage.getItem('nexora-language')==='en')language='en'}catch{}
const scopes={fa:{shop:['ویترین فروشگاهی','محدودهٔ برنامه‌ریزی‌شده: فهرست و جزئیات محصول، فیلتر دسته‌بندی و سبد خرید نمایشی در مرورگر. هیچ درگاه یا پرداخت واقعی متصل نمی‌شود.'],landing:['لندینگ خدمات','محدودهٔ برنامه‌ریزی‌شده: صفحهٔ معرفی یک کسب‌وکار خدماتی فرضی شامل خدمات، فرایند همکاری و مسیر تماس. اطلاعات یا سابقهٔ مشتری واقعی به آن نسبت داده نمی‌شود.']},en:{shop:['E-commerce storefront','Planned scope: product listings and details, category filters and a browser-local demo shopping cart. No live payment gateway or transactions.'],landing:['Service business landing page','Planned scope: a page for a fictional service business, featuring services, the collaboration process and a contact section. No real client history is implied.']}};
let activeProject=null;const dialog=document.getElementById('project-dialog');function updateDialog(){if(!activeProject)return;const data=scopes[language][activeProject];document.getElementById('dialog-title').textContent=data[0];document.getElementById('dialog-body').textContent=data[1]}
function setLanguage(next){language=next;const copyStatus=document.getElementById('email-copy-status');if(copyStatus)copyStatus.textContent='';document.documentElement.lang=next;document.documentElement.dir=next==='fa'?'rtl':'ltr';nodes.forEach(el=>{el.textContent=(next==='fa'?persian:translations)[el.dataset.i]||persian[el.dataset.i]});document.querySelectorAll('[data-language]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.language===next)));document.querySelector('.portrait img').alt=next==='fa'?'نشان Nexora':'Nexora logo';document.getElementById('close-dialog').setAttribute('aria-label',next==='fa'?'بستن':'Close');document.title=next==='fa'?'Nexora — طراحی و توسعه دیجیتال':'Nexora — Web & Digital Development';document.getElementById('navigation').setAttribute('aria-label',next==='fa'?'منوی اصلی':'Main navigation');updateContactLabels(next);updateDialog();try{localStorage.setItem('nexora-language',next)}catch{}}
document.querySelectorAll('[data-language]').forEach(b=>b.addEventListener('click',()=>setLanguage(b.dataset.language)));setLanguage(language);const menu=document.querySelector('.menu');const nav=document.getElementById('navigation');menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open)});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menu.setAttribute('aria-expanded','false');nav.classList.remove('open')}));document.querySelectorAll('[data-project]').forEach(button=>button.addEventListener('click',()=>{activeProject=button.dataset.project;updateDialog();dialog.showModal()}));document.getElementById('close-dialog').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});document.getElementById('year').textContent=new Date().getFullYear();const contact=window.NEXORA_CONTACT||{};for(const key of ['email','instagram','github']){const value=(contact[key]||'').trim();if(!value)continue;const link=document.getElementById(key+'-link');if(!link)continue;if(key==='email'){if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))continue;link.href='mailto:'+value;link.textContent=value}else{if(!/^[a-zA-Z0-9_.-]+$/.test(value))continue;link.href=key==='instagram'?'https://www.instagram.com/'+encodeURIComponent(value)+'/':'https://github.com/'+encodeURIComponent(value);link.textContent='@'+value}link.hidden=false;document.getElementById(key+'-pending').hidden=true}
// One-time section entrances; content stays visible if observation is unavailable.
if('IntersectionObserver' in window){const entrance=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('reveal-in');entrance.unobserve(entry.target)}})},{threshold:.12});document.querySelectorAll('.section-heading,.story,.about-features,.service,.featured,.project-card,.steps,.contact-grid').forEach(el=>entrance.observe(el));const links=[...nav.querySelectorAll('a')];const sections=links.map(link=>document.querySelector(link.getAttribute('href')));let scheduled=false;function markSection(){let selected=sections[0];for(const section of sections){if(section.getBoundingClientRect().top<=150)selected=section}links.forEach(link=>{const active=link.getAttribute('href')==='#'+selected.id;link.classList.toggle('active',active);if(active)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current')});scheduled=false}addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(markSection)}},{passive:true});markSection()}

// Close mobile navigation predictably and return keyboard focus on Escape.
function closeMenu(returnFocus = false) {
  menu.setAttribute('aria-expanded', 'false');
  nav.classList.remove('open');
  if (returnFocus) menu.focus();
}
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') closeMenu(true);
});
document.addEventListener('click', event => {
  if (!event.target.closest('header')) closeMenu();
});
document.addEventListener('focusin', event => {
  if (!event.target.closest('header')) closeMenu();
});
const desktopQuery = matchMedia('(min-width:781px)');
desktopQuery.addEventListener('change', () => closeMenu());
dialog.addEventListener('close', () => { activeProject = null; });
// Keep Tab navigation inside the modal, including its single-control case.
dialog.addEventListener('keydown', event => {
  if (event.key !== 'Tab') return;
  const controls = [...dialog.querySelectorAll('a[href], button, input, select, textarea, [tabindex]')]
    .filter(element => !element.disabled && element.tabIndex >= 0 && element.getClientRects().length);
  const first = controls[0];
  const last = controls[controls.length - 1];
  if (!first) { event.preventDefault(); return; }
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault(); last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault(); first.focus();
  }
});

// One shared underline follows the menu, including keyboard focus and RTL layout.
const navIndicator = document.createElement('span');
navIndicator.className = 'nav-indicator';
navIndicator.setAttribute('aria-hidden','true');
nav.append(navIndicator);
function positionNavIndicator(target = nav.querySelector('a:hover') || (nav.contains(document.activeElement) && document.activeElement.matches('a') ? document.activeElement : nav.querySelector('a.active'))) {
  if (!target || !nav.getClientRects().length) { navIndicator.style.opacity = '0'; return; }
  navIndicator.style.width = target.offsetWidth + 'px';
  navIndicator.style.transform = 'translateX(' + target.offsetLeft + 'px)';
  navIndicator.style.opacity = '1';
}
nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('pointerenter', () => positionNavIndicator(link));
  link.addEventListener('focus', () => positionNavIndicator(link));
});
nav.addEventListener('pointerleave', () => positionNavIndicator());
nav.addEventListener('focusout', () => requestAnimationFrame(() => positionNavIndicator(nav.contains(document.activeElement) ? document.activeElement : undefined)));
new MutationObserver(() => positionNavIndicator()).observe(nav,{subtree:true,attributes:true,attributeFilter:['aria-current']});
new ResizeObserver(() => positionNavIndicator()).observe(nav);
document.querySelectorAll('[data-language],.menu').forEach(button => button.addEventListener('click', () => requestAnimationFrame(() => positionNavIndicator())));
positionNavIndicator();


// Local fonts can change menu widths after the first layout.
document.fonts.ready.then(() => positionNavIndicator());

// Copy is a fallback when the visitor has no registered mailto handler.
document.getElementById('copy-email').addEventListener('click', async () => {
  const status = document.getElementById('email-copy-status');
  try {
    await navigator.clipboard.writeText('nexoracraftlab@gmail.com');
    status.textContent = language === 'fa' ? 'آدرس ایمیل کپی شد.' : 'Email address copied.';
  } catch {
    status.textContent = language === 'fa' ? 'کپی خودکار ممکن نشد؛ آدرس بالا را انتخاب و کپی کن.' : 'Automatic copy was unavailable; select and copy the address above.';
  }
});
