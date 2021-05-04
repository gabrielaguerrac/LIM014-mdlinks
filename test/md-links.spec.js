/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

const fetch = require('node-fetch');
const index = require('../index.js');

jest.mock('node-fetch');

const objA = [
  {
    href: 'http://google.com',
    text: 'Google',
    file: '/Users/gabrielaguerra/Desktop/Laboratoria/LIM014-mdlinks/archivosPrueba/file2.md',
  },
];

const objAValidation = [
  {
    href: 'http://google.com',
    text: 'Google',
    file: '/Users/gabrielaguerra/Desktop/Laboratoria/LIM014-mdlinks/archivosPrueba/file2.md',
    status: 200,
    message: 'OK',
  },
];

const objResolve = {
  status: 200,
  message: 'OK',
};

const objB = [
  {
    href: 'https://shop.mango.com/pe/ujer',
    text: 'Este enlace tiene mas de cincuenta caracteres o no abcdefghijklmnopqrstuvwxyz',
    file: '/Users/gabrielaguerra/Desktop/Laboratoria/LIM014-mdlinks/archivosPrueba/file3.md',
  },
];

const objBRejection = [
  {
    href: 'https://shop.mango.com/pe/ujer',
    text: 'Este enlace tiene mas de cincuenta caracteres o no abcdefghijklmnopqrstuvwxyz',
    file: '/Users/gabrielaguerra/Desktop/Laboratoria/LIM014-mdlinks/archivosPrueba/file3.md',
    status: 404,
    message: 'FAIL',
  },
];

const objRejectB = {
  status: 404,
  message: 'FAIL',
};

const objC = [
  {
    href: 'https://hola.xj',
    text: 'algo is broken',
    file: '/Users/gabrielaguerra/Desktop/Laboratoria/LIM014-mdlinks/archivosPrueba/file4.md',
  },
];

const objCRejection = [
  {
    href: 'https://hola.xj',
    text: 'algo is broken',
    file: '/Users/gabrielaguerra/Desktop/Laboratoria/LIM014-mdlinks/archivosPrueba/file4.md',
    status: 500,
    message: 'BROKEN',
  },
];

const objRejectC = {
  status: 500,
  message: 'BROKEN',
};

describe('This function returns an absolute path', () => {
  it('is a function', () => {
    expect(typeof index.absolutePath).toBe('function');
  });

  it('should return a string', () => {
    expect(typeof index.absolutePath('archivosPrueba/pruebaFile.md')).toBe('string');
  });

  it('should return an abosulute path if the input is a relative one', () => {
    expect(index.absolutePath('archivosPrueba/pruebaFile.md')).toBe('/Users/gabrielaguerra/Desktop/Laboratoria/LIM014-mdlinks/archivosPrueba/pruebaFile.md');
  });

  it('should return an abosulute path if the input is an absolute one', () => {
    expect(index.absolutePath('/Users/gabrielaguerra/Desktop/Laboratoria/LIM014-mdlinks/archivosPrueba/pruebaFile.md')).toBe('/Users/gabrielaguerra/Desktop/Laboratoria/LIM014-mdlinks/archivosPrueba/pruebaFile.md');
  });
});

describe('This function reads a directory', () => {
  it('is a function', () => {
    expect(typeof index.readDirectory).toBe('function');
  });

  it('should return a string', () => {
    expect(typeof index.readDirectory('/Users/gabrielaguerra/Desktop/Laboratoria/LIM014-mdlinks/archivosPrueba')).toBe('object');
  });
});

describe('This function identifies wether a file is .md or not', () => {
  it('is a function', () => {
    expect(typeof index.isMd).toBe('function');
  });

  it('should return a boolean', () => {
    expect(typeof index.isMd('/Users/gabrielaguerra/Desktop/Laboratoria/LIM014-mdlinks/archivosPrueba')).toBe('boolean');
  });

  it('should return true', () => {
    expect(index.isMd('/Users/gabrielaguerra/Desktop/Laboratoria/LIM014-mdlinks/archivosPrueba/pruebaFile.md')).toBe(true);
  });
});

describe('This function get all the links inside a .md file', () => {
  it('is a function', () => {
    expect(typeof index.getLinks).toBe('function');
  });

  it('should return an object with all links detail in .md file', () => {
    expect(typeof index.getLinks('/Users/gabrielaguerra/Desktop/Laboratoria/LIM014-mdlinks/archivosPrueba/pruebaFile.md')).toBe('object');
  });

  it('should return an empty object', () => {
    expect(typeof index.getLinks('/Users/gabrielaguerra/Desktop/Laboratoria/LIM014-mdlinks/archivosPrueba/file5.md')).toBe('object');
  });
});

describe('This function get all files inside a directory', () => {
  it('is a function', () => {
    expect(typeof index.getIntoDirectory).toBe('function');
  });

  it('should return an array of files', () => {
    expect(typeof index.getIntoDirectory('/Users/gabrielaguerra/Desktop/Laboratoria/LIM014-mdlinks/archivosPrueba')).toBe('object');
  });

  it('should return an array of nothing', () => {
    expect(typeof index.getIntoDirectory('/Users/gabrielaguerra/Desktop/Laboratoria/LIM014-mdlinks/archivosPrueba')).toBe('object');
  });
});

test('mock promise resolution 200', async () => {
  fetch.mockResolvedValue(objResolve);
  return Promise.all(index.validateLinks(objA)).then((data) => {
    expect(data.message).toEqual(objAValidation.message);
  });
});

test('mock promise rejection 400', async () => {
  fetch.mockResolvedValue(objRejectB);
  return Promise.all(index.validateLinks(objB)).then((data) => {
    expect(data).toEqual(objBRejection);
  });
});

test('mock promise catch 500', async () => {
  fetch.mockImplementation(() => Promise.reject());
  return Promise.all(index.validateLinks(objC))
    .then((data) => {
      expect(data).toEqual(objCRejection);
    });
});
