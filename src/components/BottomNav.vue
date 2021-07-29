<template>

  <v-bottom-navigation
    app
    fixed
    grow
    v-model="activeItem"
  >
    <v-btn value="summary" :to="{ path: '/'}">
      <span>Summary</span>
      <v-icon>table_chart</v-icon>
    </v-btn>

    <v-btn value="transactions" :to="{ name: 'transactions' }">
      <span>Transactions</span>
      <v-icon>receipt</v-icon>
    </v-btn>

    <v-btn value="chart" :to="{ name: 'graph' }">
      <span>Progress</span>
      <v-icon>stacked_line_chart</v-icon>
    </v-btn>
  </v-bottom-navigation>

</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class BottomNav extends Vue {
  activeItem = 'summary'
}

</script>

<style scoped>
  .v-btn {
    letter-spacing: normal;
  }
</style>
