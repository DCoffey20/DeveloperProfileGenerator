const html = require('./generateHTML');
const fs = require('fs'),
    convertFactory = require('electron-html-to');
    
const conversion = convertFactory({
    converterPath: convertFactory.converters.PDF
});
const inquirer = require('inquirer');
const axios = require('axios');
const util = require('util');
const asyncWriteFile = util.promisify(fs.writeFile);

const questions = () => {
    return inquirer.prompt([{
        type: "input",
        name: "username",
        message: "What is your Github username?"
    },
    {
        type: "list",
        name: "color",
        choices: ["green", "blue", "pink", "red"],
        message: "Pick your color theme from the following options."
    }])
}