<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <v-img alt="Vuetify Logo" class="shrink mr-2" contain src="https://file.greenisland.work/static/img/favicon.svg" transition="scale-transition" width="40" />
        <div style="font-weight: bold;font-size: 20px;margin-left: 15px;">
          <a href="/" style="text-decoration: none;color: white;">Portal Service
          </a>
        </div>
      </div>
      <v-spacer></v-spacer>
      <v-btn href="https://github.com/spongxin/docs-cloud-gather" target="_blank" text>
        <span class="mr-2">GitHub</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>
    <v-footer app>
      <div class="mx-auto footer">
        Copyright © <a href="https://github.com/spongxin" style="text-decoration: none;color: black;">SpongXin</a> 2022.
      </div>
    </v-footer>
  </v-app>
</template>
<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

footer {
  font-size: 14px;
}
</style>