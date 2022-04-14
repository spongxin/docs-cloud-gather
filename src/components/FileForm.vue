<template>
  <v-container fluid>
    <v-alert
      border="top"
      colored-border
      type="info"
      elevation="2"
    >
      Vestibulum ullamcorper mauris at ligula. Nam pretium turpis et arcu. Ut varius tincidunt libero. Curabitur ligula sapien, tincidunt non, euismod vitae, posuere imperdiet, leo. Morbi nec metus.
    </v-alert>
    <ol>
      <li v-for="item in items" :key="item.id">{{ item }}</li>
    </ol>
  </v-container>
</template>

<script>
  export default {
    data: () => ({ 
      items: ['title', 'type'] 
    }), 
}
</script>