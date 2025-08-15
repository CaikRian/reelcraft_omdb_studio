import { $, $$, State, toast } from './utils.js';
import { posterUrl } from './omdb.js';
import * as store from './storage.js';

export function card(item, onDetails){
  const tpl = $('#cardT');
  const node = tpl.content.cloneNode(true);
  const el = node.querySelector('.card');
  const img = node.querySelector('.poster');
  const type = node.querySelector('.type');
  const title = node.querySelector('.title');
  const meta = node.querySelector('.meta');
  const btnD = node.querySelector('.js-details');
  const btnS = node.querySelector('.js-save');

  const poster = posterUrl(item.imdbID) || item.Poster;
  img.src = (poster && poster !== 'N/A') ? poster : 'assets/img/placeholder.svg';
  img.alt = `Poster de ${item.Title}`;
  type.textContent = item.Type?.toUpperCase() || '';
  title.textContent = item.Title;
  meta.textContent = `${item.Year || ''} ${item.imdbID ? ' • '+item.imdbID : ''}`;

  btnD.addEventListener('click', ()=> onDetails(item));
  btnS.addEventListener('click', ()=>{ store.save(item); toast('Adicionado à Watchlist'); });

  return el;
}

export function renderPager(totalResults, page, onGo){
  const pager = $('#pager');
  pager.innerHTML = '';
  const total = Math.min(Math.ceil((+totalResults || 0)/10), 100);
  if(total <= 1) return;
  const prev = document.createElement('button'); prev.className='btn'; prev.textContent='‹'; prev.disabled = page<=1;
  const next = document.createElement('button'); next.className='btn'; next.textContent='›'; next.disabled = page>=total;
  prev.onclick = ()=> onGo(page-1); next.onclick = ()=> onGo(page+1);
  pager.append(prev);
  for(let p of [1, page-1, page, page+1, total]){
    if(p<1||p>total) continue;
    const b = document.createElement('button'); b.className='btn'; b.textContent=String(p);
    if(p===page) b.classList.add('active');
    b.onclick = ()=> onGo(p);
    pager.append(b);
  }
  pager.append(next);
}

export function showSettings(){
  const m = $('#settings');
  $('#apiKey').value = State.key;
  $('#posterKey').value = State.posterKey;
  $('#usePoster').checked = State.usePoster;
  m.classList.remove('hidden');
  $('#stClose').onclick = ()=>{
    State.key = $('#apiKey').value.trim();
    State.posterKey = $('#posterKey').value.trim();
    State.usePoster = $('#usePoster').checked;
    m.classList.add('hidden');
  };
  m.addEventListener('click', (e)=>{ if(e.target===m) m.classList.add('hidden'); }, { once:true });
}

export function renderWatchlist(){
  const list = store.all();
  const wrap = $('#watchlistOut');
  wrap.innerHTML = '';
  list.forEach(it => wrap.append(card(it, ()=>{})));
}