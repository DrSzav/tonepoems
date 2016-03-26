var arrayGainNodes = [];
var arrayGainNodesIndex = 0;
var SynthPad = (function() {
  var myAudioContext;
  var notesArray = {};
  // Constructor
  var SynthPad = function() {

    // Create an audio context.
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    myAudioContext = new window.AudioContext();

    SynthPad.playSequence();
  };

  SynthPad.playSequence = function(){
    SynthPad.sequence = [0,1,2,3,4,5,6,7,8,9];
    SynthPad.index = 0;
    SynthPad.playNextNote();
  };

  SynthPad.playNextNote = function (){
     new playNote(myAudioContext,SynthPad.sequence[SynthPad.index],10);
    SynthPad.index++;
    if(SynthPad.index < SynthPad.sequence.length){
    setTimeout(function () {
      SynthPad.playNextNote();
    }, 100);
    }
  };
  // Export SynthPad.
  return SynthPad;
})();

  function playNote(myAudioContext,midinote,duration){
  var PN = this;
  PN.noteLevel = .1;


  //Constructor
  freq = noteToFrequency(midinote);

  PN.gainNode = myAudioContext.createGain();
  arrayGainNodes[arrayGainNodesIndex] = PN.gainNode;
  arrayGainNodesIndex++;
  PN.gainNode.gain.value = 0;

  PN.oscillator = myAudioContext.createOscillator();
  PN.oscillator.type = 'sine';
  PN.oscillator.frequency.value = freq
  PN.gainNode.connect(myAudioContext.destination);
  PN.oscillator.connect(PN.gainNode);
  PN.attackEnvelope(PN);
  PN.oscillator.start(0);
   setTimeout(
     function(){
        PN.decayEnvelope(PN)},2000);
};


playNote.prototype.attackEnvelope = function(parent){

  attackRate = .0001;
  attackLevel = 0;
  var self = this;
  self.currentLevel = 0;
   var attackID = setInterval(function(){

   self.currentLevel = Math.sqrt(attackLevel);
   if(self.currentLevel < self.noteLevel){


     self.gainNode.gain.value = self.currentLevel;
     attackLevel = attackLevel + attackRate;
   }
   else{
     self.gainNode.gain.value = self.noteLevel;
     clearInterval(self.attackID);
   }

 },10);

 self.attackID = attackID;

 }

 playNote.prototype.decayEnvelope = function(parent){
   decayRate = .001;
   decayLevel = 0;
   var self = this;
   var decayID = setInterval(function(){
     if(self.currentLevel > 0 ){
       self.currentLevel = self.currentLevel - Math.sqrt(decayLevel);

       self.gainNode.gain.value = self.currentLevel;
       decayLevel = decayLevel + decayRate;
     }
     else{
       self.gainNode.gain.value = 0;
       self.oscillator.stop();
       clearInterval(self.decayID);

     }

   },10);
   self.decayID = decayID;

 };

   playNote.prototype.stop = function(){
     self.oscillator.stop();
   };


function noteToFrequency(note){
  note = note - 65; // zero semitone difference at A;
  note = note + 60;
  return Math.pow(2,note/12)*440;
}

// Initialize the page.
window.onload = function() {
  var synthPad = new SynthPad();
}
