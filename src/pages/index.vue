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
                                Das «Lassus Tricinium Project» ist eine digitale Editon der Tricinien «Geistliche
                                Psalmen» von Orlando di Lasso und seinem Sohn Rudolph. Die Kompositionen basieren auf
                                den «Psalmen Davids» von Caspar Ulenberg. Die Tricinien wurden im <code>**kern</code>
                                Format ediert und sind auf GitHub einsehbar. Mehr dazu auf der Seite <HyperLink
                                :href="localePath({name: 'about'})">Über das Projekt</HyperLink>. 
                            </p>
                            <p>
                                Da die Partituren im <code>**kern</code>-Format gesetzt sind ermöglicht dies auf dieser
                                Website einen interaktiven Gebruach um bestimmte Aspekte so leichter zugänglich machen
                                zu können. So ist es z.B. möglich die alten Schlüssel per Knopfdruck in moderne
                                Schlüssel umzuwandeln, einen Intervallsatz anzuzeigen, die Skalenstufen (z.B. als
                                Bassstufen) anzuzeigen, den Liedtext auszublenden, Kadenzen isoliert zu analysieren oder
                                die Klauseln nach bestimmten Kadenzfluchten zu durchsuchen, uvm.
                            </p>
                            <p>
                                Für Studentinnen und Studenten an der <HyperLink href="https://mh-freiburg.de"
                                target="_blank">Hochschule für Musik Freiburg</HyperLink> gehört es zum festen
                                Curriculum im zweiten Semester im Fach Kontrapunkt in der Modulprüfung eine Stilkopie
                                mit einem Tricinium im Renaissance-Stil zu komponieren. Dieses Projekt soll dazu
                                beitragen, dass Studentinnen und Studenten sich dieses Genere mit den spezifischen
                                Stücken von Orlandus und Rudolphus Lassus mit den digitalen Möglichkeiten dieser Website
                                aneignen können. Unter dem Menüpunkt <HyperLink :href="localePath({name:
                                'canon'})">Canon</HyperLink> gibt es zusätzliche Materialien mit den wichtigsten
                                Informationen zu Modi, Imitationen, Ambitus, Stimmendisposition und Textbehandlung sowie
                                einer Liste mit Stücken die sich besonders für das Selbststudium eignen.
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
