importScripts('https://verovio-script.humdrum.org/scripts/verovio-toolkit-wasm.js');

const createVerovioModule = verovio.module;
const VerovioToolkit = verovio.toolkit;
const enableLog = verovio.enableLog;
const logLevel = verovio.LOG_OFF;

class Deferred {
    constructor() {
        this.promise = new Promise((resolve, reject) => {
            this.reject = reject;
            this.resolve = resolve;
        });
    }
}

const verovioToolkits = {};
let verovioModulePromise;

if (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope) {

    if (typeof createVerovioModule === 'function') {
        verovioModulePromise = createVerovioModule();
    } else {
        const verovioModuleIsReady = new Deferred();
        verovioModulePromise = verovioModuleIsReady.promise;
        createVerovioModule.onRuntimeInitialized = function () {
            verovioModuleIsReady.resolve(createVerovioModule);
        };
    }

    verovioModulePromise.then((VerovioModule) => {
        if (enableLog) {
            enableLog(logLevel, VerovioModule);
        }
    });

    async function getVerovioToolkit(id) {
        if (verovioToolkits[id]) return verovioToolkits[id];
        const VerovioModule = await verovioModulePromise;
        verovioToolkits[id] = new VerovioToolkit(VerovioModule);
        return verovioToolkits[id];
    }

    function removeToolkit(id) {
        if (verovioToolkits[id]) {
            verovioToolkits[id].destroy();
            delete verovioToolkits[id];
        }
    }

    addEventListener('message', async (event) => {
        const { id, method, args, toolkitId } = event.data;

        if (method === 'moduleIsReady') {
            verovioModulePromise.then(() => {
                postMessage({
                    id,
                    method,
                    args,
                    result: null,
                }, event);
            });
            return;
        }

        if (method === 'removeToolkit') {
            removeToolkit(toolkitId);
            postMessage({
                id,
                method,
                args,
                result: Object.keys(verovioToolkits).length,
            }, event);
            return;
        }

        const verovioToolkit = await getVerovioToolkit(toolkitId);

        const fn = verovioToolkit[method];
        let result;
        if (fn) {
            result = fn.apply(verovioToolkit, args || []);
        }

        postMessage({
            id,
            method,
            args,
            result,
        }, event);
    });

}
