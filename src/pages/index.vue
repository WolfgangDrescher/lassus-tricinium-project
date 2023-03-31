<script setup>
const { data } = await useFetch(`/api/tricinium/01-beatus-vir`);
const tricinium = useTricinium(data.value);
const localePath = useLocalePath();
</script>

<template>
    <Container>
        <SectionContainer>
            <section>
                <Heading>Home</Heading>
                <img src="/lasso-geistliche-psalmen-cover.jpg" class="w-full shadow" alt="Geistliche Psalmen / mit dreyen stimmen / welche nit allain lieblich zu singen / sondern auch auff aller hand art Instrumenten zugebrauchen." />
                <ImageCaption>
                    Geistliche Psalmen / mit dreyen stimmen / welche nit allain lieblich zu singen / sondern auch auff
                    aller hand art Instrumenten zugebrauchen. Durch Orlandum de Lasso, Fürst: Bay: Obristen Capelmeister
                    / und seinem Sohn Rudolphum newlich componirt / und in Truck verfertiget.
                </ImageCaption>
            </section>
            <section>
                <TwoCols>
                    <template v-slot:first>
                        <img src="/mhfr-logo.svg" class="max-h-[150px] mx-auto" alt="Hochschule für Musik Freiburg" />
                    </template>
                    <template v-slot:second>
                        <img src="/fzm-logo.jpg" class="max-h-[150px] mx-auto" alt="FZM – Freiburger Forschungs- und Lehrzentrum Musik" />
                    </template>
                </TwoCols>
            </section>
            <section>
                <TwoCols>
                    <template v-slot:first>
                        <FormattedText>
                            <p>
                                Das «Lassus Tricinium Project» ist eine digitale Edition der «Geistlichen Psalmen» von
                                Orlando di Lasso und seinem Sohn Rudolph. Die Kompositionen basieren auf den «Psalmen
                                Davids» von Caspar Ulenberg. Vorlage dieser Edition ist das Digitalisat des Drucks von
                                1588 der Bayerischen Staatsbibliothek München. Die Tricinien wurden im
                                <code>**kern</code> Format mit der Humdrum Syntax ediert und sind auf GitHub
                                veröffentlicht. Mehr dazu auf der Seite
                                <HyperLink :href="localePath({name: 'about'})">Über das Projekt</HyperLink>. 
                            </p>
                            <p>
                                Dieses Format ermöglicht es, die Tricinien auf einer Website interaktiv zu betrachten,
                                wobei gewisse Parameter durch eine vorgängige fachliche Analyse integriert wurden.
                                Bestimmte Eigenschaften und Merkmale können auf diese Weise auf der Website einfach
                                abgerufen werden. So ist es z.B. möglich die alte Schlüsselung per Knopfdruck in eine
                                heute übliche umzuwandeln, einen Intervallsatz und die Skalenstufen anzuzeigen, den
                                Liedtext aus- und einzublenden, Kadenzen isoliert zu analysieren oder die Klauseln nach
                                bestimmten Kadenzfluchten zu durchsuchen, uvm. Ausserdem ist über IIIF und mit dem
                                Verovio Humdrum Viewer eine direkte Integration der Scans des Münchener
                                DigitalisierungsZentrums gegeben. So kann per Doppelklick auf einzelne Noten die
                                entsprechende Zeile des originalen Drucks angezeigt werden.
                            </p>
                            <p>
                                Die 50 Tricinien werden damit in einer dynamischen und vor allem interaktiven Art und
                                Weise aufbereitet, die es Forschenden und Studierenden ermöglicht, die Antworten auf
                                spezifische Fragestellungen schnell zu finden und für die Analyse zu nutzen. Studierende
                                beispielsweise, die im Laufe ihrer Ausbildung mit dem Renaissance-Kontrapunkt in
                                Berührung kommen, können mit Hilfe der digitalen Werkzeuge auf dieser Website die
                                wichtigsten Parameter – wie die Verwendung der Modi, der Imitationen, der Ambitus und
                                der Textbehandlung – schnell erfassen, um sie in eigene Stilkopien einzubeziehen. Unter
                                dem Menüpunkt <HyperLink :href="localePath({name: 'learn'})">Lernen</HyperLink> gibt es
                                zusätzliche Materialien mit den wichtigsten Informationen zu den Modi, Imitationen,
                                Ambitus, Stimmendisposition und der Textbehandlung sowie einer Liste mit Stücken die
                                sich besonders für das Selbststudium eignen.
                            </p>
                        </FormattedText>
                    </template>
                    <template v-slot:second>
                        <TriciniumListItem :tricinium="tricinium" />
                    </template>
                </TwoCols>
            </section>
        </SectionContainer>
    </Container>
</template>
