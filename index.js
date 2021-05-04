const path = require('path');
const fs = require('fs');
const marked = require('marked');
const fetch = require('node-fetch');
// eslint-disable-next-line no-unused-vars
const { title } = require('process');

// FUNCION ABSOLUTA O RELATIVA
const absolutePath = (route) => ((path.isAbsolute(route) === true)
  ? route : path.resolve(__dirname, route));

// FUNCION EVALUA SI EXISTE EL PATH
const isExistingPath = (route) => ((fs.existsSync(route) === true));

// FUNCION PARA SABER SI ES ARCHIVO O DIRECTORIO
const isDirect = (route) => fs.statSync(route).isDirectory();
// console.log(isDirectory(routeDir));

const isFile = (route) => fs.statSync(route).isFile();

// FUNCION PARA LEER UN DIRECTORIO
const readDirectory = (route) => {
  const insideDir = fs.readdirSync(route);
  return insideDir;
};

// FUNCION PARA INDICAR SI ES ARCHIVO MD
const isMd = (route) => {
  const extention = path.extname(route);
  if (extention === '.md' || extention === '.MD') {
    return true;
  }
  return false;
};

// FUNCION PARA LEER UN ARCHIVO
const readFile = (route) => {
  const insideFile = fs.readFileSync(route, 'utf-8');
  return insideFile;
};

// FUNCION PARA OBTENER LINKS dentro de un archivo md
const getLinks = (route) => {
  const arrayLinks = [];
  const renderer = new marked.Renderer();
  renderer.link = (href, title, text) => {
    // eslint-disable-next-line no-useless-escape
    const validateLink = /^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/;
    if (validateLink.test(href) === true) {
      const linkDetail = {
        href,
        text,
        file: route,
      };
      arrayLinks.push(linkDetail);
    }
  };
  marked(readFile(route), { renderer });
  return arrayLinks;
};

// console.log(typeof(getLinks(process.argv[2])));

// FUNCION PARA LEER UN DIRECTORIO Y ARCHIVOS MD

const getIntoDirectory = (route) => { // devuelve un array de rutas de files md
  const arrayFile = [];
  readDirectory(route).forEach((elem) => {
    if ((isDirect(`${route}/${elem}`))) {
      getIntoDirectory(`${route}/${elem}`);
    } else if (isMd(`${route}/${elem}`)) {
      arrayFile.push(`${route}/${elem}`);
    }
  });
  return arrayFile;
};
// console.log(getIntoDirectory(process.argv[2]));

// USANDO FETCH PARA EL STATUS

const validateLinks = (arrayL) => arrayL.map((obj) => fetch(obj.href)
  .then((res) => ({
    href: obj.href,
    text: obj.text,
    file: obj.file,
    status: res.status,
    message: res.status === 200 ? 'OK' : 'FAIL',
  }))
  .catch(() => ({
    href: obj.href,
    text: obj.text,
    file: obj.file,
    status: 500,
    message: 'BROKEN',
  })));

module.exports = {
  absolutePath,
  isExistingPath,
  isDirect,
  isFile,
  readDirectory,
  isMd,
  readFile,
  getLinks,
  getIntoDirectory,
  validateLinks,
};
