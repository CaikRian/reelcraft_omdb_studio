export const $ = (q, el=document) => el.querySelector(q);
export const $$ = (q, el=document) => Array.from(el.querySelectorAll(q));
export const State = {
  get key(){ return localStorage.getItem('omdb_key') || ''; },
  set key(v){ localStorage.setItem('omdb_key', v || ''); },
  get posterKey(){ return localStorage.getItem('poster_key') || ''; },
  set posterKey(v){ localStorage.setItem('poster_key', v || ''); },
  get usePoster(){ return localStorage.getItem('use_poster') === '1'; },
  set usePoster(b){ localStorage.setItem('use_poster', b ? '1' : '0'); },
};
export function copyToClipboard(text){
  navigator.clipboard?.writeText(text);
}
export function toast(msg){
  const t = document.createElement('div');
  t.textContent = msg;
  Object.assign(t.style, {position:'fixed', bottom:'16px', left:'50%', transform:'translateX(-50%)', background:'rgba(12,18,36,.9)', color:'#fff', padding:'10px 14px', borderRadius:'12px', border:'1px solid rgba(255,255,255,.1)', zIndex:9999});
  document.body.appendChild(t);
  setTimeout(()=> t.remove(), 1200);
}