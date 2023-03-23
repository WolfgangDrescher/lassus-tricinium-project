# Lassus Tricinium Project

Das «Lassus Tricinium Project» ist eine digitale Edition der «Geistlichen
Psalmen» von Orlando di Lasso und seinem Sohn Rudolph. Die Kompositionen
basieren auf den «Psalmen Davids» von Caspar Ulenberg. Vorlage dieser Edition
ist das Digitalisat des Drucks von 1588 der Bayerischen Staatsbibliothek
München. Die Tricinien wurden im `**kern` Format mit der Humdrum Syntax ediert
und sind auf GitHub veröffentlicht.


## Repositories

* https://github.com/WolfgangDrescher/lassus-tricinium-project
* https://github.com/WolfgangDrescher/lassus-geistliche-psalmen
* https://github.com/WolfgangDrescher/ulenberg-psalmen-davids
* https://github.com/WolfgangDrescher/vue-verovio-canvas


## Project Setup

```sh
git clone --recurse-submodules https://github.com/WolfgangDrescher/lassus-tricinium-project.git
npm install
npm run dev
```


## Deployment on VM

```sh
docker image pull ghcr.io/wolfgangdrescher/lassus-tricinium-project:latest
# docker build -t lassus-tricinium-project .
docker stop lassus-tricinium-project
docker rm lassus-tricinium-project
docker run --name lassus-tricinium-project -d --restart always -p 80:3000 ghcr.io/wolfgangdrescher/lassus-tricinium-project
docker image prune --force
```
