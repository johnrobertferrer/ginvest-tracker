<template>
  <div>
    <v-row class="mx-1 my-1">
      <v-col
        cols="12"
        sm="12"
      >
        <v-sheet
          rounded="lg"
        >
          <datatable
            :data="rebuildDatatableData()"
            :headers="datatable.headers"
            :settings="datatable.settings"
            :investment-funds="investmentFunds"
          />
        </v-sheet>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import TransactionsDatatable from '../components/datatables/TransactionsDatatable.vue'

export default {
  name: 'Transactions',

  components: {
    datatable: TransactionsDatatable
  },

  data () {
    return {
      datatable: {
        headers: [
          { text: 'Date', align: 'start', value: 'date' },
          { text: 'Fund Name', align: 'start', value: 'fundName' },
          { text: 'Shares', value: 'shares', align: 'end' },
          { text: 'NAVPU', value: 'navpu', align: 'end' },
          { text: 'Amount', value: 'amount', align: 'end' },
          { text: 'Actions', value: 'actions', sortable: false }
        ],
        data: [
          {
            date: '2021-06-05',
            fundId: 385,
            shares: 25.4424,
            navpu: 102.2021,
            amount: 497.7680
          },
          {
            date: '2021-06-05',
            fundId: 385,
            shares: 24.5322,
            navpu: 101.5451,
            amount: 489.7608
          }
        ],
        settings: {
          itemsPerPage: 10
        }
      },
      investmentFunds: [
        { fundId: 385, bankId: 31, name: 'ATRAM Global Consumer Trends Feeder Fund' },
        { fundId: 384, bankId: 31, name: 'ATRAM Global Technology Feeder Fund' }
      ]
    }
  },

  methods: {
    formatNumeric (number) {
      return number.toLocaleString('en', { minimumFractionDigits: 4 })
    },
    getFundName (fundId) {
      const index = this.investmentFunds.findIndex(data => data.fundId === fundId)

      if (index === -1) { return '' }

      return this.investmentFunds[index].name
    },
    rebuildDatatableData () {
      const data = this.datatable.data

      data.forEach(element => {
        element.shares = this.formatNumeric(element.shares)
        element.navpu = this.formatNumeric(element.navpu)
        element.amount = this.formatNumeric(element.amount)
        element.fundName = this.getFundName(element.fundId)
      })

      return data
    }
  }
}
</script>
