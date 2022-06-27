import './index.css';
import React from 'react';
import ReactDOM from 'react-dom';

/**
 * Select file(s).
 * @param {String} contentType The content type of files you wish to select. For instance, use "image/*" to select all types of images.
 * @param {Boolean} multiple Indicates if the user can select multiple files.
 * @returns {Promise<File|File[]>} A promise of a file or array of files in case the multiple parameter is true.
 */
 function selectFile(contentType, multiple){
  return new Promise(resolve => {
      let input = document.createElement('input');
      input.type = 'file';
      input.multiple = multiple;
      input.accept = contentType;

      input.onchange = () => {
          let files = Array.from(input.files);
          if (multiple)
              resolve(files);
          else
              resolve(files[0]);
      };

      input.click();
  });
}

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioCtx.createAnalyser();

function playAudio(audioBuffer) {
  const source = audioCtx.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(audioCtx.destination);
  source.start();
}

async function processAudio() {
  const file = await selectFile('audio/*', false);
  console.log(`file: ${file}`);
  const arrayBuffer = await file.arrayBuffer();
  const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
  console.log(`
  sample count: ${audioBuffer.length},
  rate: ${audioBuffer.sampleRate},
  duration (s): ${audioBuffer.duration},
  channel count: ${audioBuffer.numberOfChannels}`);
  
  const chanData = audioBuffer.getChannelData(1);
  console.log(`contents: ${chanData.join(',')}`);
  playAudio(audioBuffer);
}

class StartForm extends React.Component {
  constructor(props) {
    super(props);
    //this.state = {url: '', sections: []}; 
    //this.handleVideoUrlInputChange = this.handleVideoUrlInputChange.bind(this);
  }

  render() {
    return (
      <div className="App">
        <button onClick={processAudio}>Pick file</button>
        
      </div>
    );
  }
}

ReactDOM.render(
  <React.StrictMode>
    <StartForm />
  </React.StrictMode>,
  document.getElementById('root')
);