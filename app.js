'use strict';

var speechToTextV1 = require ('watson-developer-cloud/speech-to-text/v1');
var fs = require('fs');
const express = require('express'); 
require('dotenv').config({silent: true});

const app = express();
app.use(express.static('./public'));


var speechToText =  new speechToTextV1({
});

console.log(speechToText);

var params ={
    objectMode: true,
    //content_type: 'audio/webm;codecs=opus',
    content_type: 'audio/wav',
    model: 'en-US_BroadbandModel',
    keywords: ['NASA'],
    keywords_threshold: 0.5,
    max_alternatives:3 
};
console.log(params);

//create the stream
var recognizeStream = speechToText.recognizeUsingWebSocket(params);
//pipe in the audio
fs.createReadStream('SpaceShuttle.wav').pipe(recognizeStream);

//Listen for events
recognizeStream.on('data',function(event){ onEvent('data:', event);});
recognizeStream.on('error', function(event){ onEvent('error:', event);})


//Displays event on the console
function onEvent(name,event){
    let transcript = (name, JSON.stringify(event,null,2));
    fs.writeFile('transcript.txt', transcript, (err)=>{
        if(err) throw (err);
        console.log('The file has been saved!');
    });

};

module.exports = app;