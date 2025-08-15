const KEY = 'reelcraft_watchlist';
export function all(){ try{ return JSON.parse(localStorage.getItem(KEY) || '[]'); }catch{return [];} }
export function save(item){
  const list = all();
  if(!list.find(x => x.imdbID === item.imdbID)){
    list.push(item);
    localStorage.setItem(KEY, JSON.stringify(list));
  }
}
export function remove(imdbID){
  const list = all().filter(x => x.imdbID !== imdbID);
  localStorage.setItem(KEY, JSON.stringify(list));
}
export function clear(){ localStorage.removeItem(KEY); }