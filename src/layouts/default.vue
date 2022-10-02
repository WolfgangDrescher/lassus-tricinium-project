<template>
    <header>
        <TheNavigation />
    </header>
    <main class="py-8">
        <slot></slot>
    </main>
</template>

<style>
html {
        font-size: 18px;
    }

    @screen sm {
        html {
            font-size: 18px;
        }
    }

    @screen md {
        html {
            font-size: 19px;
        }
    }

    @screen lg {
        html {
            font-size: 19px;
        }
    }

    @screen xl {
        html {
            font-size: 20px;
        }
    }

    @screen 2xl {
        html {
            font-size: 20px;
        }
    }
</style>
