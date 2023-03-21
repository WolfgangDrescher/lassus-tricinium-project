<script setup>
const { t } = useI18n();
const localePath = useLocalePath();

useHead({
    title: t('criticalReport'),
});

defineI18nRoute({
    paths: {
        de: '/kritischer-bericht',
    },
});
</script>

<template>
    <Container>
        <SectionContainer>
            <section>
                <Heading>{{ $t('editorialComments') }}</Heading>
                <FormattedText>
                    <ol class="flex flex-col list-none pl-0 gap-4">
                        <li>
                            Vorlage ist das Digitalisat des Drucks von 1588 der Bayerischen Staatsbibliothek München:
                            <HyperLink
                            href="https://mdz-nbn-resolving.de/details:bsb00075346">https://mdz-nbn-resolving.de/details:bsb00075346</HyperLink>.
                        </li>
                        <li>
                            Taktstriche wurden gemäss der Taktart hinzugefügt, weil Verovio ohne Taktstriche keine
                            Zeilenumbrüche darstellen kann. Die Taktstriche können in Verovio aber mit einem
                            Humdrum-Filter visuell ausgeblendet werden (<code>shed -e "s/^([^-]*)$/$1-/B"</code>).
                        </li>
                        <li>
                            Bei den Taktstrichen wurde das im Druck mit einem Doppelstrich gesetzte Ende eines Stücks
                            mit einem Schlussstrich ersetzt.
                        </li>
                        <li>
                            Die Orthographie der gesungenen Texte folgt dem Druck von 1588. Wörter wie z.B.
                            <i>warumb</i>, <i>trewer</i>, <i>maystat</i> oder <i>uñ</i> (anstatt <i>und</i>) wurden so
                            belassen, auch wenn sie im Druck in den anderen Stimmen unterschiedlich geschrieben wurden.
                            Offensichtliche Fehler wie <i>dß</i> anstelle von <i>daß</i> wurden angepasst.
                        </li>
                        <li>
                            Orthographische oder sprachliche Unterschiede in den gesungenen Texten der jeweiligen
                            Stimmen wurden nicht angeglichen und sind wie im Druck dargestellt. Dies gilt auch für
                            Gross- und Kleinschreibung.
                        </li>
                        <li>
                            Vorzeichen werden nur dann im Notentext angezeigt, wenn diese auch im Druck vorhanden sind.
                            Alle vom Herausgeber hinzugefügten Vorzeichen werden mit dem <code>i</code> Marker innerhalb
                            der <code>**kern</code> Spines gekennzeichnet (<code>!!!RDF**kern: i = editorial
                            accidental</code>) und sind oberhalb der Noten positioniert.
                        </li>
                        <li>
                            Vorzeichen – vor allem Kreuze – , die als Auflösungszeichen zu lesen sind, wurden
                            entsprechend angepasst, ohne <code>i</code> Marker für ein <i>editorial accidental</i>.
                        </li>
                        <li>
                            In den Liedtexten wurden ausschliesslich solche Schriftzeichen modernisiert, die nicht mit
                            der Standardschrift für Verovio (Times) dargestellt werden können, wie z.B <code>uͤ</code>
                            zu <code>ü</code>.
                        </li>
                        <li>
                            TODO: Es wurden fehlende Schrägstriche bei den Zeilenenden sowie bei einer Textwiederholung
                            hinzugefügt.
                        </li>
                        <li>
                            TODO: Der <i>cantus firmus</i> ist mit <i>c.f.</i> in der entsprechenden Stimme
                            gekennzeichnet.
                        </li>
                        <li>
                            Bei Textwiederholungen, die im Druck mit <i>ij</i> gekennzeichnet sind, wird der Text kursiv
                            ausgeschrieben.
                        </li>
                        <li>
                            Ligaturen in der Musik wurden mit den entsprechenden Noten ersetzt.
                        </li>
                        <li>
                            Für Worte die mehrere Silben auf mehreren Noten haben, im Druck aber ohne Silbentrennung
                            notiert sind, wurde Silbentrennung eingeführt. Die Silbentrennung wurde aus dem Druck
                            übernommen.
                        </li>
                        <li>
                            Ligaturen werden mit einer eckigen Klammer dargestellt.
                        </li>
                    </ol>
                </FormattedText>
            </section>
            <section>
                <Heading>{{ $t('criticalReport') }}</Heading>
                <FormattedText>
                    <div class="flex flex-col gap-4">
                        <div>
                            <Subheading>
                                <NuxtLink :to="localePath({ name: 'tricinium-id', params: { id: '01-beatus-vir' }})">
                                    1. Beatus vir
                                </NuxtLink>
                            </Subheading>
                            <ol class="flex flex-col list-none pl-0 gap-4">
                                <li>
                                    Takt 1-6: Die ausgefüllten Noten in den ersten zwei Zeilen des Cantus wurden
                                    angeglichen. Vergleiche mit <HyperLink
                                    href="https://www.digitale-sammlungen.de/de/view/bsb00072990?page=11">dieser
                                    Alternative</HyperLink> (<HyperLink
                                    href="https://mdz-nbn-resolving.de/details:bsb00072990">Permalink</HyperLink>).
                                </li>
                            </ol>
                        </div>
                        <div>
                            <Subheading>
                                <NuxtLink :to="localePath({ name: 'tricinium-id', params: { id: '02-quare-fremuerunt-gentes' }})">
                                    2. Quare fremuerunt gentes
                                </NuxtLink>
                            </Subheading>
                            <ol class="flex flex-col list-none pl-0 gap-4">
                                <li>
                                    Takt 21: Das Wort <code>dß</code> im Cantus wurde zu <code>daß</code> geändert.
                                </li>
                            </ol>
                        </div>
                        <div>
                            <Subheading>
                                <NuxtLink :to="localePath({ name: 'tricinium-id', params: { id: '06-domine-ne-in-furore' }})">
                                    6. Domine ne in furore
                                </NuxtLink>
                            </Subheading>
                            <ol class="flex flex-col list-none pl-0 gap-4">
                                <li>
                                    Takt 25: Die ausgefüllten Noten bei der Triole wurden rhythmisch angepasst.
                                </li>
                            </ol>
                        </div>
                        <div>
                            <Subheading>
                                <NuxtLink :to="localePath({ name: 'tricinium-id', params: { id: '08-domine-dominus-noster' }})">
                                    8. Domine Dominus noster
                                </NuxtLink>
                            </Subheading>
                            <ol class="flex flex-col list-none pl-0 gap-4">
                                <li>
                                    Takt 11-12: Fehlende Textwiederholung (<code>ij</code>) im Cantus ergänzt bei
                                    <code>durchauß in aller welt</code>.
                                </li>
                            </ol>
                        </div>
                        <div>
                            <Subheading>
                                <NuxtLink :to="localePath({ name: 'tricinium-id', params: { id: '10-in-domino-confido' } })">
                                    10. In Domino confido
                                </NuxtLink>
                            </Subheading>
                            <ol class="flex flex-col list-none pl-0 gap-4">
                                <li>
                                    Takt 4: Falschen Schrägstrich im Cantus nach der Silbe <code>thut/</code> vorgezogen
                                    zu <code>trawen/</code>.
                                </li>
                            </ol>
                        </div>
                        <div>
                            <Subheading>
                                <NuxtLink :to="localePath({ name: 'tricinium-id', params: { id: '11-salvum-me-fac-deus' } })">
                                    11. Salvum me fac Deus
                                </NuxtLink>
                            </Subheading>
                            <ol class="flex flex-col list-none pl-0 gap-4">
                                <li>
                                    Takt 15: Falschen Schrägstrich im Bassus nach der Silbe <code>in/</code> vorgezogen
                                    zu <code>zeit/</code>.
                                </li>
                            </ol>
                        </div>
                        <div>
                            <Subheading>
                                <NuxtLink :to="localePath({ name: 'tricinium-id', params: { id: '12-usquequo-domine' } })">
                                    12. Usquequo Domine
                                </NuxtLink>
                            </Subheading>
                            <ol class="flex flex-col list-none pl-0 gap-4">
                                <li>
                                    Takt 8: Die ausgefüllten Noten im Cantus bei der Triole wurden rhythmisch angepasst.
                                </li>
                            </ol>
                        </div>
                        <div>
                            <Subheading>
                                <NuxtLink :to="localePath({ name: 'tricinium-id', params: { id: '16-exaudi-domine-iustitiam' } })">
                                    16. Exaudi Domine iustitiam
                                </NuxtLink>
                            </Subheading>
                            <ol class="flex flex-col list-none pl-0 gap-4">
                                <li>
                                    Takt 21-23: Der falsche Text im Bassus <code>auß losem munde</code> wurde angepasst
                                    zu <code>auß losem grunde</code>.
                                </li>
                            </ol>
                        </div>
                        <div>
                            <Subheading>
                                <NuxtLink :to="localePath({ name: 'tricinium-id', params: { id: '17-diligam-te-domine' } })">
                                    17. Diligam te Domine
                                </NuxtLink>
                            </Subheading>
                            <ol class="flex flex-col list-none pl-0 gap-4">
                                <li>
                                    Takt 21-22: Die eigenartige Textwiederholung im Bassus <code>weñ not mein
                                    schutz</code> wurde so belassen.
                                </li>
                            </ol>
                        </div>
                        <div>
                            <Subheading>
                                <NuxtLink :to="localePath({ name: 'tricinium-id', params: { id: '22-dominus-regit-me' } })">
                                    22. Dominus regit me
                                </NuxtLink>
                            </Subheading>
                            <ol class="flex flex-col list-none pl-0 gap-4">
                                <li>
                                    Takt 8: Die ausgefüllten Noten im Bassus bei der Triole wurden rhythmisch angepasst.
                                </li>
                            </ol>
                        </div>
                        <div>
                            <Subheading>
                                <NuxtLink :to="localePath({ name: 'tricinium-id', params: { id: '28-afferte-domino' } })">
                                    28. Afferte Domino
                                </NuxtLink>
                            </Subheading>
                            <ol class="flex flex-col list-none pl-0 gap-4">
                                <li>
                                    Takt 13-15: Der Text <code>bringet dem Herren wolgemut</code> beinhaltet mehr Silben
                                    als für diese Textwiederholung Noten zur Verfügung stehen. Deswegen wurde beginnt
                                    <code>Wider und Böck zum opffer</code> in dieser Edition eine Minima später als im
                                    Druck.
                                </li>
                                <li>
                                    Takt 28: Die ausgefüllten Noten im Tenor bei der Triole wurden rhythmisch angepasst.
                                </li>
                            </ol>
                        </div>
                        <div>
                            <Subheading>
                                <NuxtLink :to="localePath({ name: 'tricinium-id', params: { id: '38-dixi-custodiam' } })">
                                    38. Dixi custodiam
                                </NuxtLink>
                            </Subheading>
                            <ol class="flex flex-col list-none pl-0 gap-4">
                                <li>
                                    Takt 14: Im Cantus wurde <code>mich</code> belassen, obwohl im den beiden anderen
                                    Stimmen <code>nicht</code> steht.
                                </li>
                                <li>
                                    Takt 20: Im Cantus wurde <code>lassen</code> belassen, obwohl im den beiden anderen
                                    Stimmen <code>habe</code> steht.
                                </li>
                            </ol>
                        </div>
                        <div>
                            <Subheading>
                                <NuxtLink :to="localePath({ name: 'tricinium-id', params: { id: '39-expectans-expectavi' } })">
                                    39. Expectans expectavi
                                </NuxtLink>
                            </Subheading>
                            <ol class="flex flex-col list-none pl-0 gap-4">
                                <li>
                                    Takt 2: Im Cantus sollte die dritte Minima bei <code>gan-</code> die Note a sein.
                                    Sie ist im Druck an dierser Stelle offenbar falsch gesetzt. Bei der Wiederholung in
                                    Takt 8 bei <code>sich</code> ist an dieser Stelle ein a gesetzt. Die Stelle wurde in
                                    der Partitur mit <code>!LO:SIC:o</code> markiert und ist in Verovio mit einem grünen
                                    <code>S</code> erkenntlich.
                                </li>
                            </ol>
                        </div>
                    </div>
                </FormattedText>
            </section>
        </SectionContainer>
    </Container>
</template>
