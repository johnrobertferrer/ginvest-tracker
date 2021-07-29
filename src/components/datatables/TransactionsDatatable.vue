<template>
  <v-data-table
    dense
    :headers="headers"
    :items="items"
    :search="search"
    :items-per-page="settings.items_per_page"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar
        flat
      >
        <v-dialog
          v-model="dialog"
          max-width="700px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="blue"
              dark
              class="mr-4"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>add</v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col
                    cols="12"
                    sm="12"
                    md="12"
                  >
                    <v-menu
                      v-model="datePicker"
                      :close-on-content-click="false"
                      max-width="290"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          :value="formattedDate"
                          :rules="[ rules.required ]"
                          clearable
                          readonly
                          v-bind="attrs"
                          label="Date"
                          v-on="on"
                          @click:clear="editedItem.date = null"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="editedItem.date"
                        @change="datePicker = false"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="12"
                    md="12"
                  >
                    <template>
                      <v-select
                        :items="getInvestmentFunds()"
                        v-model="editedItem.fundId"
                        label="Fund Name"
                      ></v-select>
                    </template>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="12"
                    md="12"
                  >
                    <v-text-field
                      v-model.number="formattedAmount"
                      type="number"
                      label="Amount"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                text
                @click="close"
              >
                Cancel
              </v-btn>
              <v-btn
                color="blue darken-1"
                text
                @click="save"
              >
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">Are you sure you want to delete this row?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon
        small
        class="mr-2"
        @click="editItem(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        small
        @click="deleteItem(item)"
      >
        mdi-delete
      </v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn
        color="#ff5722"
        dark
        @click="initialize"
      >
        Refresh
      </v-btn>
    </template>
  </v-data-table>
</template>

<script>
import moment from 'moment'
import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(VueAxios, axios)

export default {
  name: 'TransactionsDatatable',

  props: [
    'data',
    'headers',
    'settings',
    'investmentFunds'
  ],

  data () {
    return {
      dialog: false,
      dialogDelete: false,
      search: '',
      editedIndex: -1,
      editedItem: {
        date: moment(new Date()).format('YYYY-MM-DD'),
        fundId: 385,
        shares: 0,
        navpu: 0,
        amount: 0
      },
      datePicker: false,
      defaultItem: {
        date: moment(new Date()).format('YYYY-MM-DD'),
        fundId: 385,
        shares: 0,
        navpu: 0,
        amount: 0
      },
      rules: {
        required: value => !!value || 'Required.',
        counter: value => value.length <= 25 || 'Max 25 characters'
      }
    }
  },

  watch: {
    dialog (val) {
      val || this.close()
    },
    dialogDelete (val) {
      val || this.closeDelete()
    }
  },

  created () {
    this.rebuildDatatable()
  },

  methods: {
    rebuildDatatable () {
      this.items = this.data
    },

    getNAVPU (date) {
      const api = 'https://www.uitf.com.ph/daily_navpu_details_json.php'

      this.axios.get(api, {
        params: {
          from: date,
          to: date,
          bank_id: 31,
          fund_id: 385,
          verification_id: 1,
          btn: 'Filter'
        }
      })
      .then((response) => {
        console.log(response.data)
      })
      .catch((error) => {
        console.log(error)
      })
    },

    editItem (item) {
      this.editedIndex = this.items.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem (item) {
      this.editedIndex = this.items.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteItemConfirm () {
      this.items.splice(this.editedIndex, 1)
      this.closeDelete()
    },

    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeDelete () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    validate (data) {
      this.getNAVPU('2021-07-13')
      if (data.date === null) {
        return true
      }

      return false
    },

    save () {
      const callback = this.validate(this.editedItem)

      if (callback !== undefined && callback) {
        return false
      }

      if (this.editedIndex > -1) {
        Object.assign(this.items[this.editedIndex], this.editedItem)
      } else {
        this.items.push(this.editedItem)
      }
      this.close()
    },

    getInvestmentFunds () {
      const funds = []
      let data = {}

      this.investmentFunds.forEach(fund => {
        data = {}
        data.value = fund.fundId
        data.text = fund.name
        funds.push(data)
      })

      return funds
    }
  },

  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'New Transaction' : 'Edit Transaction'
    },
    formattedDate () {
      return this.editedItem.date ? moment(this.editedItem.date).format('YYYY-MM-DD') : ''
    },
    formattedAmount: {
      get () { return this.editedItem.amount },
      set (newVal) { this.editedItem.amount = newVal }
    }
  }
}
</script>

<style scoped>
</style>
