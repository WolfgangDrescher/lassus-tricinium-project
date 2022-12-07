import createVerovioModule from 'verovio/wasm-hum';
import { VerovioToolkit, enableLog, LOG_OFF as logLevel } from 'verovio/esm';
import { createVerovioWorker } from 'vue-verovio-canvas';

createVerovioWorker(createVerovioModule, VerovioToolkit, enableLog, logLevel);
