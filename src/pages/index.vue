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
        </SectionContainer>
    </Container>
</template>
