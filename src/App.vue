<template>
  <v-app>
    <v-app-bar color="primary" dark app>
      <v-app-bar-title>Resume Builder</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn to="/" text>Home</v-btn>
      <v-btn to="/documents" text>My Resumes</v-btn>
      <v-btn to="/editor" text>Editor</v-btn>
      <v-btn to="/templates" text>Templates</v-btn>
      <v-btn to="/export" text>Export</v-btn>
      <v-btn to="/about" text>About</v-btn>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>

    <v-footer app padless>
      <v-col class="text-center" cols="12">
        {{ new Date().getFullYear() }} — <strong>Resume Builder</strong>
      </v-col>
    </v-footer>
  </v-app>
</template>

<script setup lang="ts">
// Composition API
</script>

<style lang="scss">
// Import global styles
</style>
