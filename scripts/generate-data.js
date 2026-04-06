const fs = require('fs');
const path = require('path');

const contenidoDir = path.join(__dirname, '..', 'productos', 'contenido');
const outFile = path.join(__dirname, '..', 'productos', 'data.json');

function readJson(file) {
  try {
    const content = fs.readFileSync(file, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    console.error('Error leyendo o parseando', file, err.message);
    return null;
  }
}

function main() {
  if (!fs.existsSync(contenidoDir)) {
    console.error('No existe la carpeta:', contenidoDir);
    process.exit(1);
  }

  const files = fs.readdirSync(contenidoDir).filter(f => f.endsWith('.json'));
  const productos = [];

  files.sort(); // orden alfabético por nombre de archivo
  for (const file of files) {
    const full = path.join(contenidoDir, file);
    const data = readJson(full);
    if (data) {
      // Si el JSON ya es el objeto del producto, añádelo.
      // Si el archivo contiene { productos: [...] } lo aplanamos.
      if (Array.isArray(data.productos)) {
        productos.push(...data.productos);
      } else if (data && typeof data === 'object') {
        productos.push(data);
      }
    }
  }

  const out = { productos };
  try {
    fs.writeFileSync(outFile, JSON.stringify(out, null, 2), 'utf8');
    console.log('Escrito', outFile, 'con', productos.length, 'productos');
  } catch (err) {
    console.error('Error escribiendo', outFile, err.message);
    process.exit(1);
  }
}

main();
