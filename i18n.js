// Onemark website i18n engine
const LANGS = ['en','zh','es','ar','ja','ko','ru'];
const LANG_NAMES = {en:'English', zh:'中文', es:'Español (AR)', ar:'العربية', ja:'日本語', ko:'한국어', ru:'Русский'};
function setLang(l){
  document.documentElement.lang = l;
  document.documentElement.dir = (l === 'ar') ? 'rtl' : 'ltr';
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const t = window.I18N[el.dataset.i18n];
    if (t && t[l]) el.textContent = t[l];
  });
  document.querySelectorAll('.lang-menu button').forEach(b=>{
    b.classList.toggle('active', b.dataset.lang === l);
  });
  const btn = document.getElementById('lang-btn');
  if (btn) btn.textContent = LANG_NAMES[l];
  localStorage.setItem('onemark_lang', l);
}
function toggleLangMenu(){ document.getElementById('lang-menu').classList.toggle('open'); }
document.addEventListener('click', function(e){
  const menu = document.getElementById('lang-menu');
  if (menu && !e.target.closest('.lang-select')) menu.classList.remove('open');
});
(function(){ const l = localStorage.getItem('onemark_lang') || 'en'; setLang(l); })();
