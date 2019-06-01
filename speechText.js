'use strict';
const moment=require('moment');
var speechToTextV1 = require ('watson-developer-cloud/speech-to-text/v1');
var fs = require('fs');
const express = require('express'); 
require('dotenv').config({silent: true});
var Throttle = require('throttle');

var throttle = new Throttle(16000);
const app = express();
app.use(express.static('./public'));

console.log(moment().format());

var speechToText =  new speechToTextV1({
});

var transcripts = fs.createWriteStream('./transcripts');

/*
fs.writeFile('transcript.txt', 'Start', function (err) {
    if (err) throw err;
    console.log('File Created!');
  });
*/

var params ={
    objectMode: true,
    //content_type: 'audio/webm;codecs=opus',
    content_type: 'audio/mp3',
    model: 'en-US_BroadbandModel',
    keywords: ['NASA'],
    keywords_threshold: 0.5,
    max_alternatives:1,
    smart_formatting: true,
    interim_results:true
};
console.log(params);

//create the stream
var recognizeStream = speechToText.recognizeUsingWebSocket(params);
//pipe in the audio
fs.createReadStream('SpaceShuttle.mp3').pipe(throttle).pipe(recognizeStream);
//fs.createReadStream('video.webm').pipe(recognizeStream);

//recognizeStream.pipe(fs.createWriteStream('transcription.txt'));




//Listen for events
recognizeStream.on('data',function(event){ onEvent('data:', event,transcripts);});
recognizeStream.on('error', function(event){ onEvent('error:', event,transcripts);})
recognizeStream.on('close', function(event) { closeEvent('close:', event,transcripts); });

//Displays event on the console
function onEvent(name,event,transcripts){
    let transcript = (name, JSON.stringify(event,null,2));
    transcript = moment().format() + '\n' + transcript;
    transcripts.write(transcript,'utf8')
    console.log('files written')
};

function closeEvent(name,event,transcript){
    transcripts.end();
    console.log('files closed')
};
module.exports = app;