<template>
    <div class="flex flex-col overflow-x-hidden my-6">
        <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div class="inline-flex justify-center min-w-full sm:px-6 lg:px-8">
                <div class="overflow-hidden border border-gray-200 sm:rounded">
                    <table class="mx-auto">
                        <slot></slot>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>
