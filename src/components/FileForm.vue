<template>
  <v-container fluid style="width: 40%;min-width: 380px;max-width: 100%;margin: auto;">
    <v-alert border="top" colored-border type="info" elevation="2" icon="mdi-fire">
      <div class="text-h6 font-weight-regular">
        {{ packages.title }}
      </div>
      <v-divider class="my-4 info" style="opacity: 0.22"></v-divider>
      {{ packages.description }}
    </v-alert>
    <v-stepper v-model="step" style="margin-top: 0px;">
      <v-stepper-header>
        <v-stepper-step :complete="step > 1" step="1">Edit
        </v-stepper-step>
        <v-divider />
        <v-stepper-step :complete="step > 2" step="2">Upload
        </v-stepper-step>
        <v-divider />
        <v-stepper-step :complete="step > 3" step="3">Complete
        </v-stepper-step>
      </v-stepper-header>
      <v-stepper-items>
        <v-stepper-content step="1">
          <v-card class="mx-auto">
            <v-form ref="form" v-model="valid">
              <v-card-text v-for="item in items" :key="item.id">
                <v-text-field :label="item.title" :type="item.type" v-model="item.value" :rules="rules" />
                <span v-if="item.description" class="text-caption grey--text text--darken-1">
                  {{ item.description }}
                </span>
              </v-card-text>
            </v-form>
            <v-card-text>
              <v-file-input v-model="files" counter multiple prepend-icon="mdi-paperclip" truncate-length="20" placeholder="选择文件" label="文件输入">
                <template v-slot:selection="{ index, text }">
                  <v-chip v-if="index < 2" color="blue accent-4" dark label>{{ text }}
                  </v-chip>
                  <span v-else-if="index === 2" class="text-overline grey--text text--darken-3 mx-2">
                    +{{ files.length - 2 }} 个文件
                  </span>
                </template>
              </v-file-input>
            </v-card-text>
            <v-divider />
            <v-card-actions style="margin-top: 10px;">
              <v-btn text @click="clear">
                Clear
              </v-btn>
              <v-spacer />
              <v-btn color="primary" depressed @click="upload">
                Continue
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-stepper-content>
      </v-stepper-items>
      <v-stepper-items>
        <v-stepper-content step="2">
          <v-card class="mx-auto">
            <v-card-text>
              <v-list disabled>
                <v-subheader><strong>文件上传</strong></v-subheader>
                <v-list-item-group v-model="files" color="primary">
                  <div v-for="item in files" :key="item.id">
                    <UploadProcess ref="uploader" :token="token" :file="item" :keys="item.name" />
                  </div>
                </v-list-item-group>
              </v-list>
            </v-card-text>
            <v-divider />
            <v-card-actions style="margin-top: 10px;">
              <v-btn text @click="step -= 1">
                Cancel
              </v-btn>
              <v-spacer />
              <v-btn color="primary" depressed @click="submit">
                Submit
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-stepper-content>
      </v-stepper-items>
      <v-stepper-items>
        <v-stepper-content step="3">
          <v-card class="mx-auto">
            <v-card-text>
            </v-card-text>
            <v-divider />
            <v-card-actions style="margin-top: 10px;">
              <v-btn text @click="step = 1">
                Cancel
              </v-btn>
              <v-spacer />
            </v-card-actions>
          </v-card>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
    <v-snackbar v-model="snackbar" timeout="3000">
      <strong>{{ message }}</strong>
      <template v-slot:action="{ attrs }">
        <v-btn color="pink" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>
<script>
import UploadProcess from './UploadProcess';

export default {
  data: () => ({
    valid: false,
    rules: [
      v => !!v || '此项为必填项',
    ],
    packages: {
      'title': 'Sign 工程注册文件',
      'description': 'Vestibulum ullamcorper mauris at ligula. Nam pretium turpis et arcu. Ut varius tincidunt libero. Curabitur ligula sapien, tincidunt non, euismod vitae, posuere imperdiet, leo. Morbi nec metus.',
      'deadline': '',
      'identifier': '16a8w9f44a85fhui',
      'status': true
    },
    items: [{
        'title': '邮箱',
        'description': 'This is the email you will use to login to your Vuetify account',
        'type': 'text',
        'value': 'yourmail@host.com',
        'requeired': false,
      },
      {
        'title': '密码',
        'description': 'Please enter a password for your account',
        'type': 'password',
        'value': '',
        'requeired': true,
      },
    ],
    files: [],
    token: 'AXQ_kgGwAC1sBnZkwUGpgFDF0PFNNX6o7y6yAkpG:F4yLvXhDotft8JDP4wGcz7THXzs=:eyJzY29wZSI6InNwb25neGluIiwiZGVhZGxpbmUiOjE2NTAxMjA3NDl9',
    step: 1,
    snackbar: false,
    message: '',
  }),

  props: {
    identifier: String,
  },

  components: {
    UploadProcess,
  },

  methods: {
    uploadState() {
      for (var i = this.files.length - 1; i >= 0; i--) {
        if (Object.hasOwnProperty.call(this.files[i], 'err') || !Object.hasOwnProperty.call(this.files[i], 'res')) {
          return false;
        }
      }
      return true;
    },
    upload() {
      if (!this.$refs.form.validate()) {
        return;
      }
      this.step += 1;
      let uploaders = this.$refs.uploader;
      if (uploaders) {
        for (var i = uploaders.length - 1; i >= 0; i--) {
          uploaders[i].upload();
        }
      }
    },
    submit() {
      if (!this.uploadState()) {
        this.message = "请上传文件后再试！";
        this.snackbar = true;
        return;
      }
      this.step += 1;
    },
    clear() {
      /*for (var i = this.items.length - 1; i >= 0; i--) {
        this.items[i].value = '';
      }*/
      this.$refs.form.reset();
      this.files = [];
    }
  }
}
</script>