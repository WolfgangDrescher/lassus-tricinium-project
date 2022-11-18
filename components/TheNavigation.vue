<template>
    <nav class="bg-gray-100 px-2 sm:px-4 py-5">
        <Container>
            <div class="flex flex-wrap justify-between items-center mx-auto">
                <a href="/" class="flex">
                    <span class="self-center text-2xl font-bold whitespace-nowrap">Lassus Tricinium Project</span>
                </a>
                <button
                    data-collapse-toggle="navbar-navigation"
                    type="button"
                    class="inline-flex items-center p-2 ml-3 text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
                    aria-controls="navbar-navigation"
                    aria-expanded="false"
                >
                    Open navigation
                </button>
                <div class="hidden w-full md:block md:w-auto" id="navbar-navigation">
                    <ul class="flex flex-col mt-4 md:flex-row md:space-x-8 md:mt-0">
                        <NavigationItem href="/">{{ $t('home') }}</NavigationItem>
                        <NavigationItem href="/about">{{ $t('about') }}</NavigationItem>
                        <NavigationItem href="/tricinium">{{ $t('tricinia') }}</NavigationItem>
                        <NavigationItem href="/statistics">{{ $t('statistics') }}</NavigationItem>
                    </ul>
                </div>
            </div>
        </Container>
    </nav>
</template>
