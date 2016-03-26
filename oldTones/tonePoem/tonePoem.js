ko.observableArray.fn.find = function(prop, data) {
    var valueToMatch = data[prop];
    return ko.utils.arrayFirst(this(), function(item) {
        return item[prop] === valueToMatch;
    });
};

ko.bindingHandlers.wordInput = {
    init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        // This will be called when the binding is first applied to an element
        // Set up any initial state, event handlers, etc. here
    },
    update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        // This will be called once when the binding is first applied to an element,
        // and again whenever any observables/computeds that are accessed change
        // Update the DOM element based on the supplied values here.
    }
};

noteMap = {'a':33,	'h':45,	'o':57,	'v':69,
'A':34,	'H':46,	'O':58,	'V':70,
'b':35,	'i':47,	'p':59,	'w':71,
'B':36,	'I':48,	'P':60,	'W':72,
'c':36,	'j':48,	'q':60,	'x':72,
'C':37,	'J':49,	'Q':61,	'X':73,
'd':38,	'k':50,	'r':62,	'y':74,
'D':39,	'K':51,	'R':63,	'Y':75,
'e':40,	'l':52,	's':64,	'z':76,
'E':41,	'L':53,	'S':65,	'Z':77,
'f':41,	'm':53,	't':65,
'F':42,	'M':54,	'T':66,
'g':43,	'n':55,	'u':67,
'G':44,	'N':56,	'U':68};
noteMap2 =
{'a':33,	'h':45,	'o':57,	'v':69,
'A':34,	'H':46,	'O':58,	'V':70,
'b':35,	'i':47,	'p':59,	'w':71,
'B':36,	'I':48,	'P':60,	'W':72,
'c':36,	'j':48,	'q':60,	'x':72,
'C':37,	'J':49,	'Q':61,	'X':73,
'd':38,	'k':50,	'r':62,	'y':74,
'D':39,	'K':51,	'R':63,	'Y':75,
'e':40,	'l':52,	's':64,	'z':76,
'E':41,	'L':53,	'S':65,	'Z':77,
'f':41,	'm':53,	't':65,
'F':42,	'M':54,	'T':66,
'g':43,	'n':55,	'u':67,
'G':44,	'N':56,	'U':68};

var Keys = ['A','A#','B','C','C#','D','D#','E','F','F#','G','G#'];
var Scales = {'Chromatic':[0,1,2,3,4,5,6,7,8,9,10,11],
'Pentatonic':[0,2,4,7,9],
'Octave':[0],
'Minor Pentatonic':[0,3,5,7,10],
'Blues':[0,3,5,6,7,10],
'Gypsy':[0,2,3,6,7,8,10],
'Yo':[0,3,5,7,11],
'Whole Tone':[0,2,4,6,8,10],
'Acoustic':[0,2,4,6,7,9,10],
'Aeolian':[0,2,3,5,7,8,10],
'Algerian':[0,2,3,6,7,8,11],
'Minor Bepop':[0,2,4,5,7,9,10,11],
'Dorian':[0,2,3,5,7,9,10],
'Hirajoshi':[0,2,3,7,8],
'In':[0,1,5,7,8],
'Insen':[0,1,5,7,10],
'Iwato':[0,1,5,6,10],
'Major':[0,2,4,5,7,9,11],
'Lydian':[0,2,4,6,7,9,11],
'Persian':[0,1,4,5,6,8,11],
'Prometheus':[0,2,4,6,9,10],
'Tritone':[0,1,4,6,7,10],
'Original':[0,2,3,5,7,10],
'Maj 6th':[0,4,7,9],
'Min 7th':[0,3,7,10],
'Maj 7th':[0,4,7,11]

};
var SpecialCharacters = [" ",".",",","\n"];
var SpecialCharCodes = [];

for(var i = 0; i < SpecialCharacters.length; i++){
  SpecialCharCodes[i] = SpecialCharacters[i].charCodeAt(0); //specialCharCodes
}



function AppViewModel() {
  var self = this;
  self.pianoMode = false;
  self.keys = ko.observable(Keys);
  self.keyOffset = 0;
  self.scaleMap = [];
  self.scaleOptions = ko.observableArray();
  self.titleSave = ko.observable("");
  self.poemTitle = ko.observable("Tone Poem");
  self.shareLink = ko.observable("");
  for(var i in Scales){
    if (Scales.hasOwnProperty(i)) {
      self.scaleOptions.push(i);
    }
  }
  self.scaleOptions.sort();
  self.currentScale = ko.observable('Original');
  self.currentKey = ko.observable('C');
  self.currentKey.subscribe(function() {
    self.genScale();
  });
  self.currentScale.subscribe(function(){
    self.genScale();
  });

  self.savePoem = function(){
  //  $( "#mainBlock" ).hide("puff");

   //$('#blackout').show();
   self.shareLink("");
    flickerOff('#blackout',self.showSaveBlock);

  };

  self.loadMain = function(){
  //  $( "#mainBlock" ).hide("puff");
  if(!self.playState){
    self.playPause();
  }
   $('#blackout').show();
    flickerOff('#blackout',self.showMainBlock);
  };

  self.showMainBlock = function(){
    $('#saveScreen').hide();
    $('#homeScreen').show();
    $('#blackout').fadeOut();

  };

  self.showSaveBlock = function(){
    if(self.playState){
      self.playPause();
    }
    $('#homeScreen').hide();
    $('#saveScreen').show();
    $('#blackout').fadeOut();
  };

  self.randomizeNotes = function(){
    if(self.playState){
      self.playPause();
    }
    var oldScale = self.scaleMap;
    var newScale = [];
    while(oldScale.length > 0){
      var index = Math.random() * oldScale.length;
      index = Math.floor(index);
      newScale.push(oldScale[index]);
      oldScale.splice(index,1);
    }
    self.scaleMap = newScale;
    flickerOff('#blackout', self.finishedRandom);
  }
  self.finishedRandom = function(){
    if(!self.playState){
      self.playPause();
    }
    $('#blackout').fadeOut();
  }

  self.genScale = function(){
    scale = Scales[self.currentScale()];
    key = Keys.indexOf(self.currentKey());
    for(var i = 0,j = 0; i < 256; i++){
        while(SpecialCharCodes.indexOf(i) != -1){
          i++;
        }
        self.scaleMap[i] = noteToScale(j,scale,key);
        j++;
    }
  }
  self.genScale();
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  self.myAudioContext = new window.AudioContext();
  window.AudioContext = self.myAudioContext;

/*  MIDI.loadPlugin({
    soundfontUrl: "./soundfont/",
    instrument: "acoustic_grand_piano",
    onprogress: function(state, progress) {
      console.log(state, progress);
    },
    onsuccess: function() {
      self.delay = 0; // play one note every quarter second
      self.note = 50; // the MIDI note
      self.velocity = 127; // how hard the note hits
      // play the note
      MIDI.setVolume(0, 127);

    }
  });
*/
    var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    if(iOS){
      self.playState = ko.observable(false);
      self.pauseButton = ko.observable('play');
    }
    else{
        self.playState = ko.observable(true);
        self.pauseButton = ko.observable('pause');
      }

    self.volume = ko.observable(7);
    self.playPause = function(){
      if(self.playState){
        self.playState = false;
        self.pauseButton("play");
        clearInterval(self.playID);
      }
      else{
        self.playState = true;
        self.pauseButton("pause");
        self.startPlay();
      }
    }

    self.words = ko.observable("");
    self.tempo = ko.observable(120);
    self.noteIndex = 0;
    self.prevNote = 0;
    self.tempo.subscribe(function() {
      self.updateTempo();
    });
    self.letters = ko.observableArray([]);
    self.currentIndex = ko.observable();
    //regArray = [];
    self.words.subscribe(function() {
            var tempArray = self.words();

            self.letters([]);

            for(i = 0; i < tempArray.length; i++){
              self.letters.push({'letter':tempArray[i],'on':ko.observable(false), 'ind':i})
            }

             if(self.playState){
                self.startPlay();
             }

             //update textarea size
              var inputFont = $('#poemInput').css('fontSize').replace("px","");
              var displayFont = $('#poemDisplay').css('fontSize').replace("px","");
              var ratio = displayFont/inputFont;
              var height = $('#poemDisplay').css('height').replace("px","");
              height = height / ratio;
              height = (height + inputFont * 2 );
            // $('#poemInput').css('height',height + "px" );
        });

    self.updateTempo = function(){
      if(self.tempo() > 1 && self.tempo() < 1000 && self.tempo() != ""){
      if(self.playID){clearInterval(self.playID);}
      self.playID = setInterval(self.playNextNote,60000 /self.tempo());
    }
    };

    self.startPlay = function(){
        var wordLen = self.words().length;
      //  wordLen = wordLen.length();.length
        if(wordLen > 0){
          if(self.playID){clearInterval(self.playID);}
          if(self.noteIndex > wordLen){
          self.noteIndex = 0;
          self.prevNote = 0;
        }
          self.playID = setInterval(self.playNextNote,60000 /self.tempo());
        }
        else{
          clearInterval(self.playID);
        }


    }

    self.finalSave = function(){
      //var str_json = JSON.stringify(myObject)
      var mapStr = self.scaleMap.join(",")
      flickerOff('#blackout');
      $.post("/tonepoem/php/savePoem.php",
      {
        title:self.titleSave(),
        newPoem:self.words(),
        BPM:self.tempo(),
        scale:self.currentScale(),
        iKey:self.currentKey(),
        noteMap: mapStr
      },
      self.saveCallback
      )

    }



    self.loadPoem = function(poemID){
      flickerOff('#blackout');
      $.post("/tonepoem/php/getPoemById.php",
      {
        id:poemID
      },
      self.loadCallback
      )
    }



    self.saveCallback = function(data,status){
      $('#blackout').fadeOut();
      data = JSON.parse(data);
      if(data[0]["LAST_INSERT_ID()"]){
        self.poemTitle(self.titleSave());
        self.titleSave("");
        var url = scrubURL(location.href);
        self.shareLink(url + "?id=" + data[0]["LAST_INSERT_ID()"]);
        window.history.pushState("object or string", self.poemTitle(), self.shareLink());

      }
    };

    self.loadCallback = function(data,status){
      $('#blackout').fadeOut();
      data = JSON.parse(data);
      data = data[0];
      self.poemTitle(data['title']);
      self.words(data['poem']);
      self.tempo(data['BPM']);
      self.currentScale(data['scale']);
      self.currentKey(data['iKey']);
      self.scaleMap = data['nodemap'].split(","); //should be nodeMap lol
    };

    self.playNextNote = function(){
      //MIDI middle c is 60
      var tempWords = self.words();
      //char = tempWords.charAt(self.noteIndex);
      if(self.noteIndex > tempWords.length - 1){
        self.noteIndex = 0;
        return;
      }
      charCode = tempWords.charCodeAt(self.noteIndex);
      if(SpecialCharCodes.indexOf(charCode) != -1){
        //specialCase
      }
      else{
          var note = self.scaleMap[charCode] % 72;
          var note = note + 36;

          if(self.prevNote != null && self.letters()[self.prevNote]){
             self.letters()[self.prevNote]['on'](false);
          }
          self.prevNote = self.noteIndex;

          if(self.pianoMode){
        //    MIDI.noteOn(0, note, self.velocity, self.delay);
       //     MIDI.noteOff(0, note, self.delay + 0.75);
          }
          else{
            new playNote(self.myAudioContext,note,self.volume());
          }
          var color = randomDarkColor();
          self.letters()[self.noteIndex]['on'](true);
        //  $('.letterNote').css('color','#110');

           $('.nowPlaying').css({'color':color });
           $('.nowPlaying').css('text-shadow',"0 0 1px #fff, 0 0 2px #fff, 0 0 3px #fff, 0 0 4px "+color+", 0 0 7px "+color+", 0 0 8px "+color+", 0 0 10px "+color+", 0 0 15px "+color);
           $( ".nowPlaying" ).css({opacity: 1});
        //  $( ".nowPlaying" ).animate({color: "#110"});
          $( ".nowPlaying" ).animate({opacity: .6});
        }


      var len = tempWords.length;
        self.noteIndex++;
        if(self.noteIndex >= len){
            self.noteIndex = 0;
        }


    }

  //  self.words("i\nlove\nu");
   // Ensure that "this" is always this view model

}

function playNote(myAudioContext,midinote,volume){
  var PN = this;
  PN.noteLevel = volume / 100;
  //Constructor
  freq = noteToFrequency(midinote);

  PN.gainNode = myAudioContext.createGain();
  PN.gainNode.gain.value = 0;

  PN.oscillator = myAudioContext.createOscillator();
  PN.oscillator.type = 'sine';
  PN.oscillator.frequency.value = freq;
  PN.oscillator2 = myAudioContext.createOscillator();
  PN.oscillator2.type = 'triangle';
  PN.oscillator2.frequency.value = freq;
  PN.gainNode.connect(myAudioContext.destination);
  PN.oscillator2.connect(PN.gainNode);
  PN.oscillator.connect(PN.gainNode);
  PN.attackEnvelope(PN);
  PN.oscillator.start(0);
  PN.oscillator2.start(0);
   setTimeout(
     function(){
        PN.decayEnvelope(PN)
      },300);
};


playNote.prototype.attackEnvelope = function(parent){
  attackRate = .005;
  attackLevel = 0;
  var self = this;
  self.currentLevel = 0;
   var attackID = setInterval(function(){

   self.currentLevel = self.currentLevel + attackRate;
   if(self.currentLevel < self.noteLevel){


     self.gainNode.gain.value = self.currentLevel;
     attackLevel = attackLevel + attackRate;
   }
   else{
     self.gainNode.gain.value = self.noteLevel;
     clearInterval(self.attackID);
   }
 },1);
 self.attackID = attackID;
 }

 playNote.prototype.decayEnvelope = function(parent){
   decayRate = .00001;
   decayLevel = 0;
   var self = this;
   var decayID = setInterval(function(){
     if(self.currentLevel > 0 ){
       self.currentLevel = self.currentLevel - decayLevel;

       self.gainNode.gain.value = self.currentLevel;
       decayLevel = decayLevel + decayRate;
     }
     else{
       self.gainNode.gain.value = 0;
       self.oscillator.stop();
       self.oscillator2.stop();
       clearInterval(self.decayID);

     }

   },1);
   self.decayID = decayID;

 };

   playNote.prototype.stop = function(){
     self.oscillator.stop();
   };


function noteToFrequency(note){
  note = note - 72; // zero semitone difference at A;
  return Math.pow(2,note/12)*440;
}


function noteToScale(note,scale,key){ //note as original note, scale as an array of intervals, and key as int a = 0
  var octave = 12 * Math.floor(note / scale.length);
  var offset = note % scale.length;
  return octave + scale[offset] + key;
}

function randomDarkColor(){
  var cutoff = 200;
  var r = Math.floor(Math.random() * cutoff + 55);
  var g = Math.floor(Math.random() * cutoff + 55);
  var b = Math.floor(Math.random() * cutoff + 55);
  return "rgb(" + r + "," + g + "," + b + ")";
}

// Activates knockout.js
var viewModel = new AppViewModel()
ko.applyBindings(viewModel);

if(location.search.split('id=')[1]){
  viewModel.loadPoem(location.search.split('id=')[1]);
}

window.addEventListener('touchend', function() {

	// create empty buffer
  myContext = window.AudioContext;
	var buffer = myContext.createBuffer(1, 1, 22050);
	var source = myContext.createBufferSource();
	source.buffer = buffer;

	// connect to output (your speakers)
	source.connect(myContext.destination);

	// play the file
	source.noteOn(0);

}, false);


 function flickerOff(selector,callback){
  var self = this;
  self.currentLevel = 0;
  self.slideRate = 1;
  $(selector).show();
   var slideID = setInterval(function(){
     self.currentLevel = self.currentLevel + self.slideRate;
     if(self.currentLevel < 35){
      $(selector).css('background-color','rgba(0,0,0,'+Math.random() + ')');
     }
     else{
       $(selector).css('background-color','rgba(1,1,0,1)');
       clearInterval(self.slideID);
       if(callback){
         callback();
       }
     }
 },10);
 self.slideID = slideID;
 }

 function scrubURL(oldURL){
   var index = 0;
   var newURL = oldURL;
   index = oldURL.indexOf('?');
   if(index == -1){
     index = oldURL.indexOf('#');
   }
   if(index != -1){
     newURL = oldURL.substring(0, index);
   }
   return newURL;
 }


$('*').each(function(){
if($(this).hasClass("textGlow")){
  var textColor = randomDarkColor();

  $(this).css('color',textColor);

  $(this).css('text-shadow',"0 0 1px #fff, 0 0 2px #fff, 0 0 3px #fff, 0 0 4px "+textColor+", 0 0 7px "+textColor+", 0 0 8px "+textColor+", 0 0 10px "+textColor+", 0 0 15px "+textColor);
}
  if($(this).hasClass("boxGlow")){
    var boxColor = randomDarkColor();
    $(this).css('border-color',boxColor);
    $(this).css('box-shadow',"0 0 1px #fff, 0 0 2px #fff, 0 0 3px #fff, 0 0 4px "+boxColor+", 0 0 7px "+boxColor+", 0 0 8px "+boxColor+", 0 0 10px "+boxColor+", 0 0 15px "+boxColor);
}
});

$('option').each(function(){
  var textColor = randomDarkColor();
  $(this).css('color',textColor);
  $(this).css('text-shadow',"0 0 1px #fff, 0 0 2px #fff, 0 0 3px #fff, 0 0 4px "+textColor+", 0 0 7px "+textColor+", 0 0 8px "+textColor+", 0 0 10px "+textColor+", 0 0 15px "+textColor);
});
