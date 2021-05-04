#!/usr/bin/env node
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
const { progress } = require('cli');
const program = require('commander');
const chalk = require('chalk');
const mdlinks = require('./mdLinks.js');

const error = chalk.bold.rgb(229, 57, 53);

const title = () => {
  console.log(chalk.rgb(233, 30, 99)(' __  __   ____    _       ___   _   _   _  __  ____ '));
  console.log(chalk.rgb(233, 30, 99)('|  \\/  | |  _ \\  | |     |_ _| | \\ | | | |/ / / ___|'));
  console.log(chalk.rgb(233, 30, 99)('| |\\/| | | | | | | |      | |  |  \\| | |   /  \\___ \\ '));
  console.log(chalk.rgb(255, 112, 67)('| |  | | | |_| | | |___   | |  | |\\  | | . \\   ___) |'));
  console.log(chalk.rgb(255, 112, 67)('|_|  |_| |____/  |_____| |___| |_| \\_| |_|\\_\\ |____/'));
  console.log('');
  console.log('');
};
title();

program
  .option('-s, --stats', 'muestra cantidad de links en el archivo .md')
  .option('-v, --validate', 'muestra los links y status del link')
  .option('-s -v, --stats --validate', 'muestra cantidad de links, links unicos, y rotos')
  .parse(process.argv);

// console.log(program);
const options = program.opts();

function cli(path, option) {
  if (!option.validateb && !option.stats) {
    mdlinks.mdlinks(path, { validate: false })
      .then((res) => {
        res.forEach((obj) => {
          console.log(chalk`{bold.rgb(187, 222, 251) File:} {rgb(255, 204, 188) ${obj.file}}`);
          console.log(chalk`{bold.rgb(187, 222, 251) Link:} {rgb(255, 204, 188) ${obj.href}}`);
          console.log(chalk`{bold.rgb(187, 222, 251) Text:} {rgb(255, 204, 188) ${obj.text}}`);
          console.log('');
        });
      })
      .catch(() => {
        console.log(error('Ups, hubo un error'));
      });
  }
  if (option.validate && !option.stats) {
    // mostrar el resultado de validateLinks los 200 y los 404
    mdlinks.mdlinks(path, { validate: true })
      .then((res) => {
        // console.log(res);
        res.forEach((obj) => {
          console.log(chalk`{bold.rgb(187, 222, 251) File:} {rgb(255, 204, 188) ${obj.file}}`);
          console.log(chalk`{bold.rgb(187, 222, 251) Link:} {rgb(255, 204, 188) ${obj.href}}`);
          console.log(chalk`{bold.rgb(144, 202, 249) Status:} {rgb(255, 138, 101) ${obj.message}}`);
          console.log(chalk`{bold.rgb(144, 202, 249) Status Code:} {rgb(255, 138, 101) ${obj.status}}`);
          console.log(chalk`{bold.rgb(187, 222, 251) Text:} {rgb(255, 204, 188) ${obj.text}}`);
          console.log('');
        });
      })
      .catch(() => {
        console.log(error('Ups, hubo un error'));
      });
  }

  if (option.stats && !option.validate) {
    // mostrar Total:4 Unique:3
    mdlinks.mdlinks(path, { validate: true })
      .then((res) => {
        const unique = res.map((obj) => obj.href);
        const resSet = new Set(unique);
        console.log(chalk`{bold.rgb(149, 117, 205) Total:} {rgb(179, 157, 219) ${res.length}}`);
        console.log(chalk`{bold.rgb(100, 181, 246) Unique:} {rgb(187, 222, 251) ${resSet.size}}`);
      })
      .catch(() => {
        console.log(error('Ups, hubo un error'));
      });
  }

  if (option.stats && option.validate) {
    // mostrar Total:4 Unique:3 Broken:1
    mdlinks.mdlinks(path, { validate: true })
      .then((res) => {
        const unique = res.map((obj) => obj.href);
        const roto = res.map((obj) => obj.status);
        const otro = roto.filter((obj) => obj === 500);
        const resSet = new Set(unique);
        console.log(chalk`{bold.rgb(149, 117, 205) Total:} {rgb(179, 157, 219) ${res.length}}`);
        console.log(chalk`{bold.rgb(100, 181, 246) Unique:} {rgb(187, 222, 251) ${resSet.size}}`);
        console.log(chalk`{bold.rgb(233, 30, 99) Bronken:} {rgb(244, 143, 177) ${otro.length}}`);
      })
      .catch(() => {
        console.log(error('Ups, hubo un error'));
      });
  }
}
cli('archivosPrueba/pruebaFile.md', options);
