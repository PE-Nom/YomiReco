<template>
  <div id="app">
    <form id="search" class="search">
      Search <input name="query" v-model="searchQuery">
    </form>
    <form v-on:submit.prevent="logout">
      <input type='submit' value='ログアウト'>
    </form>
    <!-- <button v-on:click='logout'>ログアウト</button> -->
    <Table v-on:updatedata="updateRecords"
      :data="gridData"
      :columns="gridColumns"
      :filter-key="searchQuery">
    </Table>
  </div>
</template>

<script>
import dbmodel from '../models/dbmodel.js'
import Table from './Table.vue'
import Login from './Login.vue'

export default {
  name: 'List',
  components: {
    Login,
    Table
  },
  data: function () {
    return {
      searchQuery: '',
      gridColumns: ['BookTitle', 'RegistrationDateTime', 'Buy', 'ReadComplete', 'BookImagePath'],
      gridData: []
    }
  },
  methods: {
    asyncFuncCall: function (cb, params) {
      return new Promise((resolve, reject) => { return cb(resolve, reject, params) })
    },
    updateRecords: function (bookRecords) {
      console.log('###updateRecords')
      console.log(bookRecords)
      this.gridData = bookRecords
    },
    logout: async function (event) {
      console.log('logout')
      try {
        await this.asyncFuncCall(dbmodel.logout)
        await this.$router.push('Login')
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
