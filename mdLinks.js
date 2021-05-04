/* eslint-disable no-console */
/* eslint-disable prefer-promise-reject-errors */
const base = require('./index.js');

// FUNCION GRANDE
function mdlinks(route, options) {
  return new Promise((res, rej) => {
    const completeRoute = base.absolutePath(route);
    if (base.isExistingPath(completeRoute)) {
      if (base.isDirect(completeRoute)) {
        const arrayMdFiles = base.getIntoDirectory(completeRoute);
        if (!arrayMdFiles.length) {
          rej('No existen archivos md dentro del directorio');
        } else if (options && options.validate === true) {
          let arrayLinks = [];
          arrayMdFiles.forEach((elem) => {
            arrayLinks = base.getLinks(elem).concat(arrayLinks);
          });
          Promise.all(base.validateLinks(arrayLinks))
            .then((resolve) => {
              console.log(resolve);
            })
            .catch(() => console.log('Ups, ocurrió un error'));
        } else {
          let arrayLinks = [];
          arrayMdFiles.forEach((elem) => {
            arrayLinks = base.getLinks(elem).concat(arrayLinks);
          });
          res(arrayLinks);
        }
      } else if (base.isMd(completeRoute)) {
        if (options && options.validate === true) {
          const arrLinks = base.getLinks(completeRoute);
          Promise.all(base.validateLinks(arrLinks))
            .then((resolve) => {
              res(resolve);
            })
            .catch(() => console.log('Error de PROMISE'));
        } else {
          res(base.getLinks(completeRoute));
        }
      } else rej('No es un archivo md. Ingrese path nuevamente');
    } else rej('Path no existe. Ingrese path nuevamente');
  });
}

// mdlinks(process.argv[2], { validate: true })
//   .then((response) => { console.log(response); })
//   .catch((error) => { console.log(error); });

// mdlinks('/Users/gabrielaguerra/Desktop/Laboratoria/LIM014-mdlinks/README.md');
// exports.mdlinks = mdlinks;

module.exports = {
  mdlinks,
};
