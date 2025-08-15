import { $, toast } from './utils.js';
import { byId, byTitle, bySeason, byEpisode } from './omdb.js';

const out = $('#seriesOut');

function renderSeason(data){
  const box = document.createElement('div');
  box.className = 'stack';
  const head = document.createElement('div');
  head.className='item';
  head.innerHTML = `<strong>${data.Title}</strong> — Season ${data.Season} / ${data.totalSeasons}`;
  box.append(head);
  for(const ep of data.Episodes || []){
    const row = document.createElement('div');
    row.className='item';
    row.textContent = `E${ep.Episode.padStart ? ep.Episode.padStart(2,'0') : ep.Episode} • ${ep.Title} • ${ep.Released} • imdb ${ep.imdbRating}`;
    box.append(row);
  }
  out.append(box);
}

function renderEpisode(data){
  const box = document.createElement('div');
  box.className='item';
  box.innerHTML = `<strong>${data.Title}</strong> — S${data.Season}E${data.Episode} • ${data.Released} • ${data.Runtime} • ${data.imdbRating}`;
  out.append(box);
}

$('#btnSeries').onclick = async ()=>{
  out.innerHTML='';
  const idOrTitle = $('#seriesId').value.trim();
  const s = $('#seasonNum').value.trim();
  const e = $('#episodeNum').value.trim();
  if(!idOrTitle){ toast('Informe um IMDb ID ou título'); return; }

  try{
    if(s && e){
      const data = await byEpisode({ i: idOrTitle.startsWith('tt') ? idOrTitle : undefined, t: idOrTitle.startsWith('tt') ? undefined : idOrTitle, Season: s, Episode: e });
      renderEpisode(data);
      return;
    }
    if(s){
      const data = await bySeason({ i: idOrTitle.startsWith('tt') ? idOrTitle : undefined, t: idOrTitle.startsWith('tt') ? undefined : idOrTitle, Season: s });
      renderSeason(data);
      return;
    }
    const detail = idOrTitle.startsWith('tt')
      ? await byId({ i: idOrTitle })
      : await byTitle({ t: idOrTitle });
    if(detail.totalSeasons){
      for(let n=1;n<=Number(detail.totalSeasons);n++){
        const data = await bySeason({ i: detail.imdbID, Season: n });
        renderSeason(data);
      }
    }else{
      out.textContent = 'Não é uma série (sem totalSeasons).';
    }
  }catch(e){
    out.textContent = 'Erro: ' + e.message;
  }
};