<script setup>
const { t } = useI18n();
const localePath = useLocalePath();

useHead({
    title: t('legalNotice'),
});

defineI18nRoute({
    paths: {
        de: '/impressum',
    },
});
</script>

<template>
    <Container>
        <SectionContainer>
            <section>
                <Heading>{{ $t('legalNotice') }}</Heading>
                <div class="flex flex-col gap-12 my-12">
                    <div>
                        <Subheading>Angaben gemäß § 5 TMG</Subheading>
                        <address>
                            Hochschule für Musik Freiburg<br>
                            Mendelssohn-Bartholdy-Platz 1<br>
                            79102 Freiburg
                        </address>
                    </div>
                    <div>
                        <Subheading>Kontaktdaten</Subheading>
                        <div>
                            Telefon:
                            <HyperLink to="tel:0049761319150">+49 761 319150</HyperLink>
                        </div>
                        <div>
                            E-Mail:
                            <HyperLink to="mailto:kontakt@mh-freiburg.de">kontakt@mh-freiburg.de</HyperLink>
                        </div>
                    </div>
                    <div>
                        <Subheading>Haftung für Inhalte</Subheading>
                        <p>
                            Im Sinne von § 7 Absatz 1 TMG sind wir für die eigenen Inhalte auf dieser Webseite
                            verantwortlich. Durch §§ 8 bis einschließlich 10 TMG sind wir aber nicht verpflichtet,
                            gespeicherte oder übermittelte fremde Inhalte zu überwachen oder diese auf Rechtswidrigkeit zu
                            prüfen. Das befreit uns jedoch nicht von der Pflicht, der Sperrung und Entfernung von
                            Informationen nach geltenden Gesetzen nachzukommen.
                        </p>
                    </div>
                </div>
            </section>
        </SectionContainer>
    </Container>
</template>