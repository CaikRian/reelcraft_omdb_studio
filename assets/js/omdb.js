import { State } from './utils.js';

const API = 'https://www.omdbapi.com/';
const IMG = 'http://img.omdbapi.com/';

function withKey(params){
  const key = State.key;
  if(!key) throw new Error('Configure sua OMDb API Key (⚙️).');
  const sp = new URLSearchParams({ apikey: key, ...params });
  return `${API}?${sp}`;
}

export async function search({ s, type='', y='', page=1, r='json' }){
  const url = withKey({ s, type, y, page, r });
  const res = await fetch(url);
  return r === 'xml' ? res.text() : res.json();
}

export async function byId({ i, plot='short', r='json', type='', y='', v='' }){
  const url = withKey({ i, plot, r, type, y, v });
  const res = await fetch(url);
  return r === 'xml' ? res.text() : res.json();
}

export async function byTitle({ t, plot='short', r='json', type='', y='', v='' }){
  const url = withKey({ t, plot, r, type, y, v });
  const res = await fetch(url);
  return r === 'xml' ? res.text() : res.json();
}

export function buildUrl(params){ return withKey(params); }

export function jsonp(params){
  return new Promise((resolve, reject)=>{
    const cb = 'cb' + Math.random().toString(36).slice(2);
    const url = withKey({ ...params, callback: cb });
    window[cb] = (data)=>{ resolve(data); cleanup(); };
    function cleanup(){ delete window[cb]; document.body.removeChild(scr); }
    const scr = document.createElement('script');
    scr.src = url;
    scr.onerror = ()=>{ reject(new Error('JSONP failed')); cleanup(); };
    document.body.appendChild(scr);
  });
}

// Series: Season/Episode
export async function bySeason({ i, t, Season }){
  const params = i ? { i, Season } : { t, Season };
  const url = withKey(params);
  const res = await fetch(url);
  return res.json();
}
export async function byEpisode({ i, t, Season, Episode }){
  const params = i ? { i, Season, Episode } : { t, Season, Episode };
  const url = withKey(params);
  const res = await fetch(url);
  return res.json();
}

// Poster API helper (patron)
export function posterUrl(imdbID, h=600){
  if(State.usePoster && State.posterKey){
    const sp = new URLSearchParams({ apikey: State.posterKey, i: imdbID, h });
    return `${IMG}?${sp}`;
  }
  return null; // fallback: use JSON 'Poster' field
}