import { $, toast } from './utils.js';
import { byId } from './omdb.js';

const out = $('#compareOut');

function panel(data){
  const div = document.createElement('div');
  div.className = 'glass pad';
  div.innerHTML = `
    <h3>${data.Title} <small>(${data.Year})</small></h3>
    <p>${data.Genre} • ${data.Runtime} • imdb ${data.imdbRating}</p>
    <p>${data.Plot}</p>
  `;
  return div;
}

$('#btnCompare').onclick = async ()=>{
  out.innerHTML='';
  const a = $('#cmpA').value.trim();
  const b = $('#cmpB').value.trim();
  if(!a || !b){ toast('Informe dois IMDb IDs'); return; }
  try{
    const [da, db] = await Promise.all([byId({ i: a, plot: 'full' }), byId({ i: b, plot: 'full' })]);
    out.append(panel(da), panel(db));
  }catch(e){
    out.textContent = 'Erro: ' + e.message;
  }
};