<template>
  <div id="app">
    <router-link class="nav-link" to="/List">Home</router-link>
    <router-view></router-view>
    <form id="search" class="search">
      Search <input name="query" v-model="searchQuery">
    </form>
    <List v-on:updatedata="updateRecords"
      :data="gridData"
      :columns="gridColumns"
      :filter-key="searchQuery">
    </List>
  </div>
</template>

<script>
import List from './components/List.vue'

export default {
  name: 'App',
  components: {
    List
  },
  data: function () {
    return {
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
