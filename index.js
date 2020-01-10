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
${{googleAPIKey}};

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

const launch = async () => {
    try {
        const data = await questions();
        const githubURL = `https://api.github.com/users/${data.username}`;

        axios
            .get(githubURL)
            .then(function (response) {
                // console.log(response.data);
                avatar = response.data.avatar_url;
                name = response.data.name;
                location = response.data.location;
                gitHubUrl = response.data.html_url;
                blog = response.data.blog;
                bio = response.data.bio;
                repos = response.data.public_repos;
                followers = response.data.followers;
                // stars = response.data.starred_url;
                following = response.data.following;

                axios
                    .get(githubURL + "/starred")
                    .then(function (response) {
                        // console.log(response.data.length);
                        stars = response.data.length;


                        googleMaps = `https://maps.googleapis.com/maps/api/staticmap?center=${location}&zoom=12&size=400x400&key=${googleAPIKey}`;

                        let pdf = html.generateHTML(data, avatar, name, location, gitHubUrl, blog, repos, followers, stars, following, googleMaps);
                        asyncWriteFile("index.html", pdf);
                        conversion({
                            file: "index.html",
                            html: pdf
                        },
                            function (err, result) {
                                if (err) {
                                    return console.log(err);
                                }
                                result.stream.pipe(fs.createWriteStream('profile.pdf'));
                                conversion.kill();
                            }
                        )
                    });
            });
        console.log("Portfolio created!")
    }
    catch (error) {
        console.log(error);
    }

}

launch()