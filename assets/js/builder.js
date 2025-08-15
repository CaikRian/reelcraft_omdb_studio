import { $, copyToClipboard, State, toast } from './utils.js';
import { buildUrl, byId, byTitle, search, jsonp } from './omdb.js';

const out = $('#builderOut');
const urlBox = $('#builtUrl');

function execWith(mode){
  const params = {};
  if(mode==='it'){
    const i = $('#b_i').value.trim();
    const t = $('#b_t').value.trim();
    if(i) params.i = i; if(t) params.t = t;
    if($('#b_type').value) params.type = $('#b_type').value;
    if($('#b_y').value) params.y = $('#b_y').value;
    params.plot = $('#b_plot').value;
    const r = $('#b_r').value;
    const cb = $('#b_callback').value.trim();
    if(r) params.r = r;
    if($('#b_v').value) params.v = $('#b_v').value;
    urlBox.textContent = buildUrl(params);
    run(params, r, cb, mode);
  } else {
    const s = $('#b_s').value.trim();
    if(s) params.s = s;
    if($('#b_type2').value) params.type = $('#b_type2').value;
    if($('#b_y2').value) params.y = $('#b_y2').value;
    if($('#b_page').value) params.page = $('#b_page').value;
    const r = $('#b_r2').value;
    const cb = $('#b_callback2').value.trim();
    if(r) params.r = r;
    if($('#b_v2').value) params.v = $('#b_v2').value;
    urlBox.textContent = buildUrl(params);
    run(params, r, cb, mode);
  }
}

async function run(params, r, cb, mode){
  out.textContent='Carregando...';
  try{
    if(cb){
      const data = await jsonp({ ...params });
      out.textContent = JSON.stringify(data, null, 2);
      return;
    }
    if(r==='xml'){
      const txt = mode==='it' ? await byId({ ...params }) : await search({ ...params });
      out.textContent = typeof txt === 'string' ? txt : JSON.stringify(txt, null, 2);
    } else {
      const data = mode==='it'
        ? (params.i ? await byId(params) : await byTitle(params))
        : await search(params);
      out.textContent = JSON.stringify(data, null, 2);
    }
  }catch(e){
    out.textContent = 'Erro: ' + e.message;
  }
}

$('#btnBuildIT').onclick = ()=> execWith('it');
$('#btnBuildS').onclick = ()=> execWith('s');
$('#btnCopy').onclick = ()=>{ copyToClipboard(urlBox.textContent); toast('URL copiada'); };