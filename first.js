const maxApi = require("max-api");
const tonal = require("tonal");

//using the tonal library to generate chords
maxApi.addHandler("root", (midiNote) => {
  maxApi.post("receivedNote" + midiNote);
  let noteName = tonal.Note.fromMidi(midiNote);
  // maxApi.post(noteName);
  let chordNotes = tonal.Chord.notes(noteName +"m7add11");
  // maxApi.post(chordNotes);
  let midiChordNotes = chordNotes.map((noteName) => {
    return tonal.Note.midi(noteName);
  });
  maxApi.post(midiChordNotes);
  maxApi.outlet(midiChordNotes);
});

//receiving bangs
const bangHandlerFunction = () => {
  maxApi.post("received Bang");
};

maxApi.addHandler("bang", bangHandlerFunction);


//receiving messages, outputting integers
maxApi.addHandler("sponge", (numTimes) => {
  maxApi.post("received sponge");
  maxApi.post(numTimes);
  let i = 0;
  while (i < numTimes) {
    maxApi.outlet(80);
    i += 1;
  }
  maxApi.post("loop ended");
});

console.log("test");


// //support
// cassie@cycling74.com
