// Loader: fetch productos/data.json and set window.productos
(function(){
  function setProductos(data){
    var list = (data && data.productos) ? data.productos : (Array.isArray(data) ? data : []);
    window.productos = list;
    try{ window.dispatchEvent(new CustomEvent('productosLoaded')); }catch(e){}
  }

  if (typeof fetch === 'function'){
    fetch('productos/data.json', {cache: 'no-store'})
      .then(function(r){ if (!r.ok) throw new Error('Fetch error'); return r.json(); })
      .then(setProductos)
      .catch(function(){ setProductos([]); });
  } else {
    var xhr = new XMLHttpRequest();
    xhr.open('GET','productos/data.json', true);
    xhr.onreadystatechange = function(){
      if (xhr.readyState === 4){
        if (xhr.status >= 200 && xhr.status < 400){
          try{ setProductos(JSON.parse(xhr.responseText)); }catch(e){ setProductos([]); }
        } else setProductos([]);
      }
    };
    try{ xhr.send(); }catch(e){ setProductos([]); }
  }
})();
