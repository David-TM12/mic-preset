// preset-mic.js
// Biblioteca para gravação de áudio no navegador com configuração otimizada para voz
// Compatível com qualquer framework frontend

class PresetMic {
  constructor() {
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.stream = null;
    this.isRecording = false;
    this.callbacks = {
      onStart: null,
      onPause: null,
      onResume: null,
      onStop: null,
      onData: null,
      onError: null
    };
  }

  async start() {
    if (this.isRecording) return;
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 44100,
          channelCount: 1,
          noiseSuppression: true,
          echoCancellation: true
        }
      });
      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType: 'audio/webm;codecs=opus',
        audioBitsPerSecond: 128000
      });
      this.audioChunks = [];
      this.mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          this.audioChunks.push(e.data);
          if (this.callbacks.onData) this.callbacks.onData(e.data);
        }
      };
      this.mediaRecorder.onstart = () => {
        this.isRecording = true;
        if (this.callbacks.onStart) this.callbacks.onStart();
      };
      this.mediaRecorder.onpause = () => {
        if (this.callbacks.onPause) this.callbacks.onPause();
      };
      this.mediaRecorder.onresume = () => {
        if (this.callbacks.onResume) this.callbacks.onResume();
      };
      this.mediaRecorder.onstop = () => {
        this.isRecording = false;
        if (this.callbacks.onStop) this.callbacks.onStop(this.getAudioBlob());
        this._cleanup();
      };
      this.mediaRecorder.onerror = (e) => {
        if (this.callbacks.onError) this.callbacks.onError(e);
      };
      this.mediaRecorder.start();
    } catch (e) {
      if (this.callbacks.onError) this.callbacks.onError(e);
    }
  }

  pause() {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.pause();
    }
  }

  resume() {
    if (this.mediaRecorder && this.mediaRecorder.state === 'paused') {
      this.mediaRecorder.resume();
    }
  }

  stop() {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
    }
  }

  getAudioBlob() {
    return new Blob(this.audioChunks, { type: 'audio/webm;codecs=opus' });
  }

  getAudioArrayBuffer() {
    return this.getAudioBlob().arrayBuffer();
  }

  on(event, callback) {
    if (this.callbacks.hasOwnProperty('on' + event.charAt(0).toUpperCase() + event.slice(1))) {
      this.callbacks['on' + event.charAt(0).toUpperCase() + event.slice(1)] = callback;
    }
  }

  _cleanup() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    this.mediaRecorder = null;
    this.audioChunks = [];
  }
}

// Exporta para uso em qualquer ambiente
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = PresetMic;
} else {
  window.PresetMic = PresetMic;
}
