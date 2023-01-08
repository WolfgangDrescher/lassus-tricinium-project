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
                <Heading>{{ $t('criticalReport') }}</Heading>
                <ol class="flex flex-col list-none pl-0 gap-4">
                    <li>
                        Vorlage ist das Digitalisat des Drucks von 1588 der Bayerische Staatsbibliothek: <HyperLink href="https://mdz-nbn-resolving.de/details:bsb00075346">https://mdz-nbn-resolving.de/details:bsb00075346</HyperLink>.
                    </li>
                    <li>
                        Taktstriche wurden gemäss der Taktart hinzugefügt weil
                        Verovio ohne Taktstriche keine Zeilenumbrüche darstellen
                        kann.
                    </li>
                    <li>
                        Der Liedtext orientiert sich so weit wie möglich am
                        Druck von 1588.
                    </li>
                    <li>
                        Vorzeichen werden ausschliesslich innerhalb des
                        Notentextes angezeigt, wenn diese auch im Druck
                        vorhanden sind. Alle vom Herausgeber hinzugefügten Vorzeichen werden mit dem <code>i</code>
                        Marker innerhalb der <code>**kern</code> Spines
                        gekennzeichnet (<code>!!!RDF**kern: i = editorial
                        accidental</code>) und sind standardmässig oberhalb der
                        Noten dargestellt.
                    </li>
                    <li>
                        Vorzeichen die im Druck z.B. mit einem Kreuz erhöht
                        werden aber wegen Tonartenvorzeichen eigentlich ein
                        Auflösungszeichen sein sollten wurden entsprechend
                        angepasst ohne <code>i</code> Marker für ein
                        <i>editorial accidental</i>.
                    </li>
                    <li>
                        Im Liedtext wurden ausschliesslich Symbole modernisiert
                        die nicht mit der Standardschrift (Times) für Text in
                        Verovio dargestellt werden können. So wurde z.B.
                        <code>uͤ</code> zu <code>ü</code> angepasst.
                    </li>
                    <li>
                        Unterschiede im Liedtext der jeweiligen Stimmen wurden
                        nicht angepasst und sind wie im Druck dargestellt. Dies
                        gilt auch für Gross- und Kleinschreibung.
                    </li>
                    <li>
                        TODO: Es wurden fehlende Schrägstriche bei den
                        Zeilenenden sowie bei Textwiederholung hinzugefügt.
                    </li>
                    <li>
                        TODO: Der <i>cantus firmus</i> ist mit <i>c.f.</i> in der jeweiligen Stimme gekennzeichnet.
                    </li>
                    <li>
                        Bei <i>ij</i>-Passagen wird der Text ausgeschrieben, er ist aber in den Noten kurisv dargestellt.
                    </li>
                    <li>
                        <HyperLink :href="localePath({ name: 'tricinium-id',
                        params: { id: '01-beatus-vir' }})">1. Beatus
                        vir</HyperLink> Takt 1-6: Die ausgefüllten Noten im Cantus in
                        der ersten zwei Zeilen wurden angeglichen. Vergleiche
                        mit
                        <HyperLink
                        href="https://www.digitale-sammlungen.de/de/view/bsb00072990?page=11">dieser
                        Alternative</HyperLink> (Permalink: <HyperLink href="https://mdz-nbn-resolving.de/details:bsb00072990">https://mdz-nbn-resolving.de/details:bsb00072990</HyperLink>).
                    </li>
                    <li>
                        <HyperLink :href="localePath({ name: 'tricinium-id',
                        params: { id: '06-domine-ne-in-furore' }})">6. Domine ne
                        in furore</HyperLink> Takt 25: Die ausgefüllten Noten
                        bei der Triole wurden rhythmisch angepasst.
                    </li>
                </ol>
            </section>
        </SectionContainer>
    </Container>
</template>
