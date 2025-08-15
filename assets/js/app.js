import { $, $$, State, toast } from './utils.js';
import * as API from './omdb.js';
import * as UI from './ui.js';
import './builder.js';
import './series.js';
import './compare.js';
import * as store from './storage.js';


$$('.links a').forEach(a => a.addEventListener('click', (e)=>{
  e.preventDefault();
  const view = a.dataset.view;
  $$('.links a').forEach(x=>x.classList.toggle('active', x===a));
  $$('.view').forEach(v=> v.classList.toggle('hidden', v.id !== 'view-'+view));
  if(view==='watchlist') UI.renderWatchlist();
}));

$('#btnSettings').onclick = UI.showSettings;

let currentPage = 1, currentQuery = '';
async function doSearch(page=1){
  const s = $('#q').value.trim();
  if(!s){ toast('Digite um título para buscar'); return; }
  currentQuery = s;
  currentPage = page;
  const type = $('#type').value;
  const y = $('#year').value;
  try{
    const data = await API.search({ s, type, y, page });
    const wrap = $('#results');
    wrap.innerHTML = '';
    if(data?.Search){
      data.Search.forEach(item => wrap.append(UI.card(item, openDetails)));
      UI.renderPager(data.totalResults, page, doSearch);
    }else{
      wrap.textContent = data?.Error || 'Sem resultados';
    }
  }catch(e){
    $('#results').textContent = 'Erro: ' + e.message;
  }
}
$('#btnSearch').onclick = ()=> doSearch(1);

async function openDetails(item){
  const full = $('#fullPlot').checked ? 'full' : 'short';
  const data = await API.byId({ i: item.imdbID, plot: full });
  const m = document.createElement('div');
  m.className='modal';
  m.innerHTML = `<div class="modal-content">
    <div class="row-between">
      <h3>${data.Title} <small>(${data.Year})</small></h3>
      <button class="btn ghost js-close">Fechar</button>
    </div>
    <div class="grid two">
      <div>
        <img style="width:100%;border-radius:12px" src="${API.posterUrl(data.imdbID) || (data.Poster!=='N/A'?data.Poster:'assets/img/placeholder.svg')}" alt="Poster">
      </div>
      <div class="stack">
        <p><strong>${data.Genre || ''}</strong> • ${data.Runtime || ''} • imdb ${data.imdbRating || '-'}</p>
        <p>${data.Plot || ''}</p>
        <p><strong>Diretor:</strong> ${data.Director || '-'}</p>
        <p><strong>Elenco:</strong> ${data.Actors || '-'}</p>
        <p><strong>Idioma:</strong> ${data.Language || '-'}</p>
        <p><strong>País:</strong> ${data.Country || '-'}</p>
        <div class="buttons">
          <button class="btn small js-save">Salvar</button>
          <a class="btn small ghost" target="_blank" href="https://www.imdb.com/title/${data.imdbID}/">Ver no IMDb</a>
        </div>
      </div>
    </div>
  </div>`;
  document.body.appendChild(m);
  m.querySelector('.js-close').onclick = ()=> m.remove();
  m.addEventListener('click', (e)=>{ if(e.target===m) m.remove(); });
  m.querySelector('.js-save').onclick = ()=>{ store.save(item); toast('Adicionado à Watchlist'); };
}

$('#btnExport')?.addEventListener('click', ()=>{
  const blob = new Blob([JSON.stringify(store.all(), null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'watchlist.json'; a.click();
  URL.revokeObjectURL(url);
});
$('#importFile')?.addEventListener('change', async (e)=>{
  const f = e.target.files[0]; if(!f) return;
  const text = await f.text();
  try{
    const arr = JSON.parse(text);
    arr.forEach(x => store.save(x));
    toast('Importado!');
    UI.renderWatchlist();
  }catch{ toast('JSON inválido'); }
});

if(!State.key){ UI.showSettings(); }