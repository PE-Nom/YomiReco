<template>
  <div id="app">
    <p id="user-name">ユーザー：{{userName}}  </p>
    <form class="form-inline">
      <form id="search" class="search">
        Search <input name="query" v-model="searchQuery">
      </form>
      <form v-on:submit.prevent="SignOut">
        <input type='submit' value='サインアウト'>
      </form>
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
import PropertyStore from '../models/store.js'
import Table from './Table.vue'
import SignIn from './SignIn.vue'

export default {
  name: 'List',
  components: {
    SignIn,
    Table
  },
  data: function () {
    return {
      userName: PropertyStore.state.property.name,
      searchQuery: '',
      gridColumns: ['BookTitle', 'RegistrationDateTime', 'Buy', 'ReadComplete', 'BookImagePath'],
      gridData: []
    }
  },
  methods: {
    updateRecords: function (bookRecords) {
      console.log('###updateRecords')
      console.log(bookRecords)
      this.gridData = bookRecords
    },
    SignOut: async function (event) {
      console.log('logout')
      try {
        await dbmodel.SignOut()
        await this.$router.push('/SignIn')
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
.user-name {
  margin-top: 60px;
  text-align: left;
  vertical-align: bottom;
}
</style>
