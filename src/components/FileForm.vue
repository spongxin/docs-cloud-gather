<template>
  <v-container fluid style="width: 45%;min-width: 370px;margin: auto;">
    <v-alert border="top" colored-border type="info" elevation="2">
      {{ packages.description }}
    </v-alert>
    <v-card class="mx-auto">
      <v-card-title class="text-h6 font-weight-regular justify-space-between">
        <span>{{ packages.title }}</span>
        <v-avatar color="primary lighten-2" class="subheading white--text" size="24" v-text="1" />
      </v-card-title>
      <div v-for="item in items" :key="item.id">
        <v-card-text>
          <v-text-field :label="item.title" :type="item.type" :value="item.value" />
          <span v-if="item.description" class="text-caption grey--text text--darken-1">
            {{ item.description }}
          </span>
        </v-card-text>
      </div>
      <v-card-text>
        <v-file-input v-model="files" counter multiple prepend-icon="mdi-paperclip" truncate-length="30" placeholder="选择文件" label="文件输入" @change="filepaths.clear">
          <template v-slot:selection="{ index, text }">
            <v-chip v-if="index < 3" color="blue accent-4" dark label small>{{ text }}
            </v-chip>
            <span v-else-if="index === 3" class="text-overline grey--text text--darken-3 mx-2">
              +{{ files.length - 3 }} 个文件
            </span>
          </template>
        </v-file-input>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-btn text>
          清空
        </v-btn>
        <v-spacer />
        <v-btn v-if="files.length === filepaths.length" :disabled="false" color="primary" depressed @click="submit">
          提交
        </v-btn>
        <v-btn v-if="files.length != filepaths.length" color="primary" depressed @click="upload">
          上传
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>
<script>
import * as qiniu from 'qiniu-js'

export default {
  data: () => ({
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
        'value': '',
      },
      {
        'title': '姓名',
        'description': '',
        'type': 'text',
        'value': '',
      },
      {
        'title': '密码',
        'description': 'Please enter a password for your account',
        'type': 'password',
        'value': '',
      },
    ],
    files: [],
    filepaths: [],
    token: 'AXQ_kgGwAC1sBnZkwUGpgFDF0PFNNX6o7y6yAkpG:VfW4efclMdnXJk801IS0GigPnuY=:eyJzY29wZSI6InNwb25neGluIiwiZGVhZGxpbmUiOjE2NTAwNDEwNDR9',
    uploading: false,
    submitting: false,
  }),

  props: {
    identifier: String,
  },

  methods: {
    submit() {
      console.log(this.identifier);
    },
    upload_single_file(file, key) {
      let observable = qiniu.upload(file, key, this.token);
      let that = this;
      observable.subscribe({
        next(res) {
          console.log(file, res.total);
        },
        error(res) {
          console.log(file, 'upload error', res);
        },
        complete(res) {
          that.filepaths.push(res.key);
          console.log(res);
        }
      });
    },
    upload() {
      //todo 设置上传动画
      for (var i = 0; i < this.files.length; i++) {
        this.upload_single_file(this.files[i], this.files[i]);
      }
    }
  }
}
</script>