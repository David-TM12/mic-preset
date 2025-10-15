# PresetMic

Biblioteca JavaScript para gravação de áudio no navegador, pronta para uso, sem necessidade de configuração.

## Principais características
- Usa MediaRecorder e getUserMedia com sampleRate 44100Hz, mono, Opus (audio/webm)
- API simples: start, pause, resume, stop
- Exporta áudio como Blob ou ArrayBuffer
- Fornece eventos/callbacks para status e dados
- Compatível com React, Vue, Angular e JS puro


## Como testar localmente
1. Instale a biblioteca via npm:
  ```bash
  npm install preset-mic
  ```
2. Importe e utilize a classe conforme os exemplos abaixo.

## Exemplo de uso em JavaScript puro
```js
import PresetMic from 'preset-mic';
// Para texto parcial em tempo real (padrão)
const mic = new PresetMic({ lang: 'pt-BR' });

mic.on('transcription', (texto) => {
  // Chamado em tempo real enquanto fala
  console.log('Transcrição parcial/final:', texto);
});
mic.on('error', (err) => console.error('Erro:', err));

// Para iniciar
await mic.start();
// Para parar: mic.stop();

// Para receber apenas o texto final ao parar:
const micFinal = new PresetMic({ lang: 'en-US', onlyFinal: true });
let textoFinal = '';
micFinal.on('transcription', (texto) => {
  // Só será chamado ao parar (micFinal.stop())
  textoFinal = texto;
  console.log('Transcrição final:', textoFinal);
});
await micFinal.start();
// ...fale algo...
micFinal.stop(); // textoFinal terá o texto completo
```

## Exemplo de uso em React
```jsx
import React, { useRef, useState } from 'react';
import PresetMic from 'preset-mic';

export default function AudioRecorder() {
  const micRef = useRef(null);
  const [transcript, setTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);


  // Exemplo: texto parcial/final em tempo real (padrão)
  const start = async () => {
    if (!micRef.current) {
      micRef.current = new PresetMic({ lang: 'pt-BR' });
      micRef.current.on('transcription', (texto) => setTranscript(texto));
      micRef.current.on('start', () => setIsRecording(true));
      micRef.current.on('stop', () => setIsRecording(false));
    }
    setTranscript('');
    await micRef.current.start();
  };

  // Para texto final apenas ao parar:
  // const start = async () => {
  //   if (!micRef.current) {
  //     micRef.current = new PresetMic({ lang: 'en-US', onlyFinal: true });
  //     micRef.current.on('transcription', (texto) => setTranscript(texto)); // Só será chamado ao parar
  //     micRef.current.on('start', () => setIsRecording(true));
  //     micRef.current.on('stop', () => setIsRecording(false));
  //   }
  //   setTranscript('');
  //   await micRef.current.start();
  // };

  const stop = () => {
    if (micRef.current) {
      micRef.current.stop();
    }
  };

  return (
    <div>
      <button onClick={start} disabled={isRecording}>Falar</button>
      <button onClick={stop} disabled={!isRecording}>Parar</button>
      {isRecording && <p>Ouvindo...</p>}
      <p>Transcrição: {transcript}</p>
    </div>
  );
}
```

## Exemplo de uso em Vue 3
```vue
<template>
  <div>
    <button @click="start" :disabled="isRecording">Falar</button>
    <button @click="stop" :disabled="!isRecording">Parar</button>
    <p v-if="isRecording">Ouvindo...</p>
    <p>Transcrição: {{ transcript }}</p>
  </div>
</template>
<script setup>
import { ref } from 'vue';
import PresetMic from 'preset-mic';

const mic = ref(null);
const transcript = ref('');
const isRecording = ref(false);

// Exemplo: texto parcial/final em tempo real (padrão)
const start = async () => {
  if (!mic.value) {
    mic.value = new PresetMic({ lang: 'pt-BR' });
    mic.value.on('transcription', (texto) => transcript.value = texto); // Chamado em tempo real
    mic.value.on('start', () => isRecording.value = true);
    mic.value.on('stop', () => isRecording.value = false);
  }
  transcript.value = '';
  await mic.value.start();
};
const stop = () => mic.value && mic.value.stop();

// Para texto final apenas ao parar:
// const start = async () => {
//   if (!mic.value) {
//     mic.value = new PresetMic({ lang: 'en-US', onlyFinal: true });
//     mic.value.on('transcription', (texto) => transcript.value = texto); // Só será chamado ao parar
//     mic.value.on('start', () => isRecording.value = true);
//     mic.value.on('stop', () => isRecording.value = false);
//   }
//   transcript.value = '';
//   await mic.value.start();
// };
</script>
```


## Exemplo de uso em Angular
```typescript
// audio-recorder.component.ts
import { Component } from '@angular/core';
import PresetMic from 'preset-mic';

@Component({
  selector: 'app-audio-recorder',
  template: `
    <button (click)="start()">Gravar</button>
    <button (click)="pause()">Pausar</button>
    <button (click)="resume()">Retomar</button>
    <button (click)="stop()">Parar</button>
  `
})
export class AudioRecorderComponent {
  mic: any;

  async start() {
    if (!this.mic) {
      this.mic = new PresetMic();
      this.mic.on('stop', (blob: Blob) => {
        const url = URL.createObjectURL(blob);
        // Faça algo com a URL
      });
    }
    await this.mic.start();
  }
  pause() { this.mic && this.mic.pause(); }
  resume() { this.mic && this.mic.resume(); }
  stop() { this.mic && this.mic.stop(); }
}
```

## Melhores práticas e recomendações
- Grave em ambiente silencioso para melhor qualidade.
- Use microfone de boa qualidade se possível.
- O áudio é exportado em formato Opus (audio/webm), ideal para voz.
- Não é necessário configurar nada: basta instanciar e usar.

## Como contribuir
1. Faça um fork do projeto.
2. Crie uma branch: `git checkout -b minha-feature`.
3. Faça suas alterações e commit: `git commit -m 'Minha nova feature'`.
4. Envie para o seu fork: `git push origin minha-feature`.
5. Abra um Pull Request.

## Licença
MIT

---

## Como clonar e instalar dependências
```bash
git clone https://github.com/seu-usuario/preset-mic.git
cd preset-mic
npm install
```

---
Sinta-se à vontade para abrir issues e contribuir!
