var Discord = require('discord.io');
var nodeSpotifyWebHelper = require('node-spotify-webhelper');

var spotify = new nodeSpotifyWebHelper.SpotifyWebHelper();
var config = require("./config");
var bot = new Discord.Client({
    autorun: true,
    email: config.email,
    password: config.password,
    username: config.username,
    token: config.token
});

bot.on('ready', function () {
    console.log(bot.username + " - (" + bot.id + ")");
    bot.on('disconnected', function () {
        setTimeout(function () {
            bot.connect();
        }, 5000);
    });

});

var curr = "";
// get the name of the song which is currently playing
setInterval(function () {
    spotify.getStatus(function (err, res) {
        if (err) {
            return console.error(err);
        }
        if (res.playing) {
            var next = "♪" + res.track.track_resource.name + " - " + res.track.artist_resource.name + "♪";
            if (next == curr) return;
            //console.log(next);
            bot.setPresence({
                game: next
            });
            curr = next;
        } else {
            curr = "";
            bot.setPresence({
                game: ""
            });
        }
    })
}, 3000);

bot.on('message', function (_user, userID, channelID, message, rawEvent) {
    if (message == (bot.username + ", music link?")) {
        spotify.getStatus(function (err, res) {
            if (err) {
                return console.error(err);
            }
            bot.sendMessage({
                to: channelID,
                message: "http://open.spotify.com/" + res.track.track_resource.uri.split(":").slice(1).join("/")
            })
        });
    }
});
