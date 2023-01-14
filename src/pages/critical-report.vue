<script setup>
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
                    </div>
                </FormattedText>
            </section>
        </SectionContainer>
    </Container>
</template>