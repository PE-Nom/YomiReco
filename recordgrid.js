// register the grid component
Vue.component('demo-grid', {
  template: '#grid-template',
  props: {
    data: Array,
    columns: Array,
    filterKey: String,
  },
  data: function () {
    var sortOrders = {}
    this.columns.forEach(function (key) {
      sortOrders[key] = 1
    })
    return {
      sortKey: '',
      sortOrders: sortOrders
    }
  },
  computed: {
    filteredData: function () {
      var sortKey = this.sortKey
      var filterKey = this.filterKey && this.filterKey.toLowerCase()
      var order = this.sortOrders[sortKey] || 1
      var data = this.data
      if (filterKey) {
//        console.log('filterData by filterKey changed');
        data = data.filter(function (row) {
          return Object.keys(row).some(function (key) {
            return String(row[key]).toLowerCase().indexOf(filterKey) > -1
          })
        })
      }
      if (sortKey) {
//        console.log('filterData by sortKey changed');
        data = data.slice().sort(function (a, b) {
          a = a[sortKey]
          b = b[sortKey]
          return (a === b ? 0 : a > b ? 1 : -1) * order
        })
      }
      return data
    }
  },
  filters: {
    capitalize: function (str) {
      var ret = str.charAt(0).toUpperCase() + str.slice(1);
//      console.log('capitalize filters : ' + str + ' to ' + ret);
      return ret
    }
  },
  methods: {
    sortBy: function (key) {
      this.sortKey = key
      this.sortOrders[key] = this.sortOrders[key] * -1
    },
    asyncFuncCall: function (cb) {
      return new Promise((resolve,reject) => { return cb(resolve,reject) });
    },
    createBooksRecords: function (books) {
      var records = [];
      books.Items.forEach(function(element,index,array){
        var buy = element.Buy.B ? '購入':'貸出';
        var comp = element.ReadComplete.B ? '完読' : '未読';
        var rec = '{'
                + ' "BookTitle" : "' + element.BookTitle.S + '"'
                + ',"RegistrationDateTime" : "' + element.RegistrationDateTime.S +'"'
                + ',"Buy" : "' + buy + '"'
                + ',"ReadComplete" : "' + comp + '"'
                + ',"BookImagePath" : "' + element.BookImagePath.S + '"'
                + ' }';
        var obj = JSON.parse(rec);
        records.push(obj);
      });
      return records;
    },
    loadData: async function() {
      try {
        await this.asyncFuncCall(upsample.checkSession);
        await this.asyncFuncCall(upsample.listObjects);
        var books = await this.asyncFuncCall(upsample.listBooks);
        var records = await this.createBooksRecords(books);
        this.$emit('updatedata', records);
        console.log('emit dataloaded event');
      }
      catch(err){
        console.log(err);
//        $(location).attr('href', 'login.html');
      }
    }
  },
  //追加
  mounted () {
    console.log('upsample.checkSession() @ recordgrid.js');
    this.loadData()
  }
});

// bootstrap the demo
var demo = new Vue({
  el: '#demo',
  data: {
    searchQuery: '',
    gridColumns: [ 'BookTitle', 'RegistrationDateTime', 'Buy', 'ReadComplete', 'BookImagePath'],
    gridData: [
//     { BookTitle:'aa', RegistrationDateTime:'bb', Buy:'cc', ReadComplete:'dd', BookImagePath:'ee'}
    ]
  },
  methods: {
    updateRecords: function (bookRecords) {
      console.log('###updateRecords');
      console.log(bookRecords);
      this.gridData = bookRecords;
    }
  }
})