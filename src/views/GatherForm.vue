<template>
  <v-container fluid style="width: 40%;min-width: 380px;max-width: 95%;">
    <v-card class="mx-auto" style="padding: 20px 30px 20px 30px;">
      <v-card-title>
        <div class="text-h5 font-weight-regular">创建文档仓库</div>
      </v-card-title>
      <v-form lazy-validation>
        <v-card-text>
          <v-text-field v-model="gather.title" counter="20" label="标题" hint="文档仓库显示的名称，将作为打包文件的默认名称" prepend-icon="mdi-map-marker" required></v-text-field>
          <v-textarea v-model="gather.description" counter maxlength="100" hint="文档收集仓库的描述" label="描述(选填)" prepend-icon="mdi-map-marker" rows="2" clearable></v-textarea>
          <v-checkbox v-model="gather.deadline" label="设置截止时间" />
          <v-row v-if="gather.deadline">
            <v-col cols="12" lg="6">
              <v-menu ref="menuDate" v-model="menuDate" :close-on-content-click="false" :return-value.sync="gather.date" transition="scale-transition" offset-y min-width="auto">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field v-model="gather.date" label="截止日期" prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"></v-text-field>
                </template>
                <v-date-picker v-model="gather.date" no-title scrollable>
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="menuDate = false">
                    取消
                  </v-btn>
                  <v-btn text color="primary" @click="$refs.menuDate.save(gather.date)">
                    确认
                  </v-btn>
                </v-date-picker>
              </v-menu>
            </v-col>
            <v-spacer></v-spacer>
            <v-col cols="12" lg="6">
              <v-menu ref="menuTime" v-model="menuTime" :close-on-content-click="false" :nudge-right="40" :return-value.sync="gather.time" transition="scale-transition" offset-y max-width="290px" min-width="290px">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field v-model="gather.time" label="截止时间" prepend-icon="mdi-clock-time-four-outline" readonly v-bind="attrs" v-on="on"></v-text-field>
                </template>
                <v-time-picker v-if="menuTime" v-model="gather.time" full-width @click:minute="$refs.menuTime.save(gather.time)" scrollable></v-time-picker>
              </v-menu>
            </v-col>
          </v-row>
          <v-divider />
        </v-card-text>
        <v-card-text>
          <v-data-table :headers="headers" :items="gather.items" sort-by="title">
            <template v-slot:top>
              <v-toolbar flat>
                <v-toolbar-title>用户填写信息</v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-spacer></v-spacer>
                <v-dialog v-model="dialog" max-width="500px">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                      添加项目
                    </v-btn>
                  </template>
                  <v-card>
                    <v-card-title>
                      <span class="text-h5">添加项目</span>
                    </v-card-title>
                    <v-card-text>
                      <v-container>
                        <v-row>
                          <v-col cols="12" lg="6">
                            <v-text-field v-model="editedItem.title" label="名称(必填)" :rules="[value => !!value || '该项为必填项.', ]" counter="10" clearable></v-text-field>
                          </v-col>
                          <v-col cols="12" lg="6">
                            <v-select v-model="editedItem.type" item-text="text" item-value="value" :items="typeItems" label="类型"></v-select>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="12" lg="12">
                            <v-text-field v-model="editedItem.description" label="描述" counter="30" clearable></v-text-field>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="12" lg="4">
                            <v-switch v-model="editedItem.required" label="禁止空值"></v-switch>
                          </v-col>
                          <v-col cols="12" lg="8">
                            <v-text-field v-model="editedItem.value" label="默认值" clearable></v-text-field>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="blue darken-1" text @click="close">
                        取消
                      </v-btn>
                      <v-btn color="blue darken-1" text @click="save">
                        保存
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
                <v-dialog v-model="dialogDelete" max-width="500px">
                  <v-card>
                    <v-card-title class="text-h7 ">确定删除该项吗？</v-card-title>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="blue darken-1" text @click="closeDelete">取消</v-btn>
                      <v-btn color="blue darken-1" text @click="deleteItemConfirm">删除</v-btn>
                      <v-spacer></v-spacer>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-toolbar>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <v-icon small class="mr-2" @click="editItem(item)">
                mdi-pencil
              </v-icon>
              <v-icon small @click="deleteItem(item)">
                mdi-delete
              </v-icon>
            </template>
            <template v-slot:no-data>
              无填写项目
            </template>
          </v-data-table>
          <v-tooltip top color="primary">
            <template v-slot:activator="{ on, attrs }">
              <v-combobox v-model="gather.formats" :items="itemTitles()" formats clearable label="重命名格式" multiple prepend-icon="mdi-filter-variant" v-bind="attrs" v-on="on">
                <template v-slot:selection="{ attrs, item, select, selected }">
                  <v-chip v-bind="attrs" :input-value="selected" close @click="select" @click:close="chipRemove(item)">
                    <strong>{{ item }}</strong>
                  </v-chip>
                </template>
              </v-combobox>
            </template>
            <span>回车保存自定义文字</span>
          </v-tooltip>
          <span class="text-caption grey--text text--darken-1">
            将根据该格式重命名已收集文件，用户填写的信息将替换对应标签
          </span>
        </v-card-text>
        <v-card-text>
          <v-checkbox v-model="gather.limitsize" label="限制文件大小(MB)"></v-checkbox>
          <v-slider v-if="gather.limitsize" v-model="gather.maxsize" step="10" min="10" thumb-label prepend-icon="mdi-volume-high"></v-slider>
        </v-card-text>
        <v-divider />
        <v-card-actions style="margin-top: 10px;">
          <v-btn text @click="clear">
            取消
          </v-btn>
          <v-spacer />
          <v-btn color="primary" depressed @click="submit">
            提交
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-container>
</template>
<script>
export default {
  data: () => ({
    gather: {
      title: '',
      description: '',
      deadline: false,
      limitsize: false,
      items: [{
        'title': '班级',
        'description': '专业名称与班级',
        'type': 'text',
        'value': '',
        'required': true,
      }, ],
      date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      time: '23:59',
      formats: [],
      maxsize: 20,
    },
    menuDate: false,
    menuTime: false,
    modalDate: false,
    modalTime: false,
    headers: [
      { text: '名称', value: 'title' },
      { text: '类型', value: 'type' },
      { text: '描述', value: 'description', sortable: false },
      { text: '默认值', value: 'value', sortable: false },
      { text: '操作', value: 'actions', sortable: false },
    ],
    dialog: false,
    dialogDelete: false,
    editedIndex: -1,
    editedItem: {
      'title': '',
      'description': '',
      'type': 'text',
      'value': '',
      'requeired': true,
    },
    defaultItem: {
      'title': '',
      'description': '',
      'type': 'text',
      'value': '',
      'requeired': true,
    },
    typeItems: [
      { text: '文本', value: 'text' },
      { text: '数字', value: 'number' },
      { text: '密码', value: 'password' },
    ]

  }),
  methods: {
    appendItem() {
      this.gather.push({
        'title': '',
        'description': '',
        'type': 'text',
        'value': '',
        'requeired': true,
      })
    },
    editItem(item) {
      this.editedIndex = this.gather.items.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
    deleteItem(item) {
      this.editedIndex = this.gather.items.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },
    deleteItemConfirm() {
      this.gather.items.splice(this.editedIndex, 1)
      this.closeDelete()
    },
    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.gather.items[this.editedIndex], this.editedItem)
      } else {
        this.gather.items.push(this.editedItem)
      }
      this.close()
    },
    chipRemove(item) {
      this.gather.formats.splice(this.gather.formats.indexOf(item), 1)
      this.gather.formats = [...this.gather.formats]
    },
    itemTitles() {
      let titles = [];
      for (var i = 0; i < this.gather.items.length; i++) {
        titles.push(this.gather.items[i].title);
      }
      return titles;
    },
    debug(msg) {
      console.log(msg);
    }
  }
}
</script>