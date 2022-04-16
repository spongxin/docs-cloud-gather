<template>
  <v-list-item>
    <v-list-item-icon>
      <v-icon v-text="icon" :color="color" />
    </v-list-item-icon>
    <v-list-item-content>
      <v-list-item-title v-text="keys" style="margin-bottom: 10px;" />
      <v-progress-linear color="primary" :buffer-value="buffer" :value="value" stream reverse />
    </v-list-item-content>
  </v-list-item>
</template>
<script>
import * as qiniu from 'qiniu-js'

export default {
  name: 'UploadProcess',
  data() {
    return {
      value: 0,
      buffer: 0,
      icon: 'mdi-upload',
      color: 'primary',
    }
  },
  methods: {
    upload() {
      const observable = qiniu.upload(this.file, this.keys, this.token);
      let that = this;
      observable.subscribe({
        next(res) {
          that.value = res.total.percent;
        },
        error(res) {
          that.file.err = res;
          that.buffer = 100;
          that.icon = 'mdi-alert-circle';
          that.color = 'error';
        },
        complete(res) {
          that.file.res = res;
          that.icon = 'mdi-check-circle';
          that.color = 'primary';
        }
      });
    }
  },
  props: {
    file: File,
    keys: String,
    token: String,
  },
}
</script>