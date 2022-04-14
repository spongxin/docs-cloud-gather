<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://file.greenisland.work/static/img/favicon.svg"
          transition="scale-transition"
          width="40"
        />

        <div style="font-weight: bold;font-size: 20px;margin-left: 15px;">
          <a href="/" style="text-decoration: none;color: white;">Portal Service
          </a>
        </div>
      </div>

      <v-spacer></v-spacer>

      <v-btn
        href="https://github.com/spongxin/docs-cloud-gather"
        target="_blank"
        text
      >
        <span class="mr-2">GitHub</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <FileForm/>
    </v-main>

    <v-footer app>
      <div class="footer">Copyright © <a href="https://github.com/spongxin" style="text-decoration: none;color: black;">SpongXin</a> 2022.</div>
    </v-footer>
  </v-app>
</template>

<style type="text/css">
  .footer {
    margin: auto;
    font-size: 14px;
    color: #757575;
  }
</style>

<script>
import FileForm from './components/FileForm';

export default {
  name: 'App',

  components: {
    FileForm,
  },

  data: () => ({
    //
  }),
};
</script>
