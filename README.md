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
const mic = new PresetMic();

mic.on('start', () => console.log('Gravação iniciada'));
mic.on('data', (chunk) => console.log('Chunk recebido', chunk));
mic.on('stop', (blob) => {
  const url = URL.createObjectURL(blob);
  // Faça algo com a URL ou o blob
});
mic.on('error', (err) => console.error('Erro:', err));

// Para iniciar
await mic.start();
// Para pausar: mic.pause();
// Para retomar: mic.resume();
// Para parar: mic.stop();
```

## Exemplo de uso em React
```jsx
import React, { useRef } from 'react';
import PresetMic from 'preset-mic';

export default function AudioRecorder() {
  const micRef = useRef(null);

  const start = async () => {
    if (!micRef.current) {
      micRef.current = new PresetMic();
      micRef.current.on('stop', (blob) => {
        const url = URL.createObjectURL(blob);
        // Faça algo com a URL
      });
    }
    await micRef.current.start();
  };

  return (
    <div>
      <button onClick={start}>Gravar</button>
      <button onClick={() => micRef.current && micRef.current.pause()}>Pausar</button>
      <button onClick={() => micRef.current && micRef.current.resume()}>Retomar</button>
      <button onClick={() => micRef.current && micRef.current.stop()}>Parar</button>
    </div>
  );
}
```

## Exemplo de uso em Vue 3
```vue
<template>
  <div>
    <button @click="start">Gravar</button>
    <button @click="pause">Pausar</button>
    <button @click="resume">Retomar</button>
    <button @click="stop">Parar</button>
  </div>
</template>
<script setup>
import { ref } from 'vue';
import PresetMic from 'preset-mic';

const mic = ref(null);

const start = async () => {
  if (!mic.value) {
    mic.value = new PresetMic();
    mic.value.on('stop', (blob) => {
      const url = URL.createObjectURL(blob);
      // Faça algo com a URL
    });
  }
  await mic.value.start();
};
const pause = () => mic.value && mic.value.pause();
const resume = () => mic.value && mic.value.resume();
const stop = () => mic.value && mic.value.stop();
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
