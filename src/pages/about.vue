<template>
    <Container>
        <SectionContainer>
            <section>
                <Heading>About</Heading>
            </section>
            <section>
                <TwoCols reverse>
                    <template #first>
                        <Subheading :level="2">Verovio</Subheading>
                        <FormattedText>
                            <p>
                                Die Humdrum-Parituren werden mit dem <code>npm</code> Package von
                                <HyperLink href="https://www.verovio.org/">Verovio</HyperLink>
                                in lesbare Partituren konvertiert. Um Verovio bequem mit dem JavaScript Framework Vue.js
                                verwenden zu können wird <HyperLink
                                href="https://github.com/WolfgangDrescher/vue-verovio-canvas">vue-verovio-canvas</HyperLink>
                                als Dependency eingebunden.
                            </p>
                        </FormattedText>
                    </template>
                    <template #second>
                        <img src="/verovio-logo.png" class="mw-full" alt="Verovio" />
                        <ImageCaption no-mx>
                            <p>
                                Verovio – A music notation engraving library
                            </p>
                            <HyperLink href="https://www.verovio.org/">verovio.org</HyperLink>
                        </ImageCaption>
                    </template>
                </TwoCols>
            </section>
            <section>
                <TwoCols>
                    <template #first>
                        <Subheading :level="2">
                            Vue.js / Nuxt
                        </Subheading>
                        <p>
                            Als technische Basis wird für diese Website das JavaScript Framework <HyperLink
                            href="https://nuxt.com/">Nuxt</HyperLink>
                            verwendet das wiederum auf dem Framework <HyperLink
                            href="https://vuejs.org/">Vue.js</HyperLink>
                            aufbaut. Der Quellcode dieser Website ist ebenfall auf GitHub verfügbar: <HyperLink
                            href="https://github.com/WolfgangDrescher/lassus-tricinium-project">lassus-tricinium-project</HyperLink>.
                        </p>
                    </template>
                    <template #second>
                        <div class="flex justify-center gap-4">
                            <div>
                                <svg viewBox="0 0 128 128" width="128" height="128">
                                    <path fill="#42b883" d="M78.8,10L64,35.4L49.2,10H0l64,110l64-110C128,10,78.8,10,78.8,10z" />
                                    <path fill="#35495e" d="M78.8,10L64,35.4L49.2,10H25.6L64,76l38.4-66H78.8z" />
                                </svg>
                                <ImageCaption no-mx>
                                    <HyperLink href="https://vuejs.org/">
                                        vuejs.org
                                    </HyperLink>
                                </ImageCaption>
                            </div>
                            <div>
                                <svg width="195.2" height="128" viewBox="0 0 61 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M33.9971 39.539H56.5247C57.2402 39.539 57.9432 39.3564 58.5628 39.0093C59.1825 38.6623 59.697 38.1631 60.0546 37.5619C60.4122 36.9608 60.6003 36.2789 60.6 35.5849C60.5997 34.8908 60.411 34.2091 60.0528 33.6083L44.9239 8.1904C44.5663 7.5894 44.0519 7.09032 43.4324 6.74332C42.8129 6.39632 42.1101 6.21363 41.3947 6.21363C40.6793 6.21363 39.9766 6.39632 39.357 6.74332C38.7375 7.09032 38.2231 7.5894 37.8655 8.1904L33.9971 14.6939L26.4338 1.97648C26.0759 1.37553 25.5613 0.876518 24.9416 0.52958C24.3219 0.182643 23.619 0 22.9035 0C22.188 0 21.4851 0.182643 20.8654 0.52958C20.2457 0.876518 19.7311 1.37553 19.3732 1.97648L0.547184 33.6083C0.189033 34.2091 0.00031171 34.8908 3.85805e-07 35.5849C-0.000310938 36.2789 0.187799 36.9608 0.54541 37.5619C0.903021 38.1631 1.41752 38.6623 2.03717 39.0093C2.65681 39.3564 3.35975 39.539 4.07528 39.539H18.2162C23.819 39.539 27.9509 37.1518 30.794 32.4945L37.6965 20.8993L41.3936 14.6939L52.4895 33.3335H37.6965L33.9971 39.539ZM17.9857 33.3272L8.11711 33.325L22.9101 8.47362L30.2912 20.8993L25.3492 29.2044C23.4611 32.2262 21.3162 33.3272 17.9857 33.3272Z" fill="#00DC82" />
                                </svg>
                                <ImageCaption no-mx>
                                    <HyperLink href="https://nuxt.com/">
                                        nuxt.com
                                    </HyperLink>
                                </ImageCaption>
                            </div>
                        </div>
                    </template>
                </TwoCols>
            </section>
            <section>
                <Subheading :level="2">Literatur</Subheading>
                <ul class="grid gap-4">
                    <li>
                        Lipphardt, Walther: «Vorwort», in: <i>Geistliche Psalmen mit dreyen Stimmen</i>, hrsg. von Walther Lipphardt, Kassel und Basel: Bärenreiter-Verlag, 1942, S. 2.
                    </li>
                    <li>
                        Menke, Johannes: «Kontrapunkt I: Die Musik der Renaissance», in: <i>Grundlagen der Musik</i>, hrsg. von Felix Diergarten und Manuel Gervink, Bd. 2, Laaber: Laaber-Verlag, 2015.
                    </li>
                    <li>
                        Orlandus und Rudolphus Lassus: <i>Geistliche Psalmen mit dreyen Stimmen. welche nit allain lieblich zu singen sondern auch auff aller hand art Instrumenten zu gebrauchen</i>, hrsg. von Walther Lipphardt, Kassel und Basel: Bärenreiter-Verlag, 1928, url: <HyperLink href="https://mdz-nbn-resolving.de/details:bsb00075346">https://mdz-nbn-resolving.de/details:bsb00075346</HyperLink> (besucht am 21.11.2022).
                    </li>
                    <li>
                        Osthoff, Helmuth: <i>Die Niederländer und das deutsche Lied (1400–1640)</i>, Tutzing: Hans Schneider Verlag, 1967.
                    </li>
                    <li>
                        Ulenberg, Caspar: <i>Die Psalmen Davids. in allerlei Teutsche gesangreimen bracht</i>, Cöln: Calenius & Quentel, 1582, url: <HyperLink href="https://mdz-nbn-resolving.de/details:bsb11116252">https://mdz-nbn-resolving.de/details:bsb11116252</HyperLink> (besucht am 21.11.2022).
                    </li>
                </ul>
            </section>
        </SectionContainer>
    </Container>
</template>
