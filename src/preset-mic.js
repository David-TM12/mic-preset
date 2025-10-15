// preset-mic.js
// Biblioteca para gravação de áudio no navegador com configuração otimizada para voz
// Compatível com qualquer framework frontend


class PresetMic {
  /**
   * @param {Object} [options]
   * @param {boolean} [options.onlyFinal=false] - Se true, retorna apenas o texto final ao parar. Se false, retorna parcial+final em tempo real.
   * @param {string} [options.lang='pt-BR'] - Idioma da transcrição.
   */
  constructor(options = {}) {
    this.isRecording = false;
    this.callbacks = {
      onStart: null,
      onStop: null,
      onError: null,
      onTranscription: null
    };
    this.speechRecognition = null;
    this._isSpeechRecognitionSupported =
      typeof window !== 'undefined' &&
      (window.SpeechRecognition || window.webkitSpeechRecognition);
    this._onlyFinal = options.onlyFinal || false;
    this._lang = options.lang || 'pt-BR';
    this._finalTranscript = '';
    this._lastTranscript = '';
  }


  async start() {
    if (this.isRecording) return;
    if (!this._isSpeechRecognitionSupported) {
      if (this.callbacks.onError) this.callbacks.onError(new Error('SpeechRecognition API não suportada neste navegador.'));
      return;
    }
    this._finalTranscript = '';
    this._lastTranscript = '';
    this._startSpeechRecognition();
    this.isRecording = true;
    if (this.callbacks.onStart) this.callbacks.onStart();
  }


  stop() {
    if (this.isRecording) {
      this._stopSpeechRecognition();
      this.isRecording = false;
      if (this.callbacks.onStop) this.callbacks.onStop();
    }
  }


  on(event, callback) {
    if (this.callbacks.hasOwnProperty('on' + event.charAt(0).toUpperCase() + event.slice(1))) {
      this.callbacks['on' + event.charAt(0).toUpperCase() + event.slice(1)] = callback;
    }
  }


  _cleanup() {
    this._stopSpeechRecognition();
  }


  _startSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.speechRecognition = new SpeechRecognition();
    this.speechRecognition.lang = this._lang;
    this.speechRecognition.continuous = true;
    this.speechRecognition.interimResults = true;
    this._finalTranscript = '';
    this._lastTranscript = '';
    this.speechRecognition.onresult = (event) => {
      // Segue o padrão do exemplo fornecido: concatena todos os resultados
      const transcription = Array.from(event.results)
        .map(result => result[0].transcript)
        .join('');
      this._lastTranscript = transcription;
      // Atualiza o finalTranscript apenas com os resultados finais
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          this._finalTranscript += event.results[i][0].transcript;
        }
      }
      if (this.callbacks.onTranscription) {
        if (this._onlyFinal) {
          // Só chama ao parar
        } else {
          this.callbacks.onTranscription(transcription, event);
        }
      }
    };
    this.speechRecognition.onerror = (e) => {
      if (this.callbacks.onError) this.callbacks.onError(e);
    };
    this.speechRecognition.start();
  }


  _stopSpeechRecognition() {
    if (this.speechRecognition) {
      this.speechRecognition.onend = () => {
        if (this.callbacks.onTranscription && this._onlyFinal) {
          // Retorna o texto final (tudo que foi reconhecido)
          this.callbacks.onTranscription(this._lastTranscript || this._finalTranscript);
        }
      };
      this.speechRecognition.stop();
      this.speechRecognition = null;
    }
  }
}

// Exporta para uso em qualquer ambiente
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = PresetMic;
} else {
  window.PresetMic = PresetMic;
}
