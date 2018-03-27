<template>
    <div class="container-fluid">
        <div class="table-row header">
            <div class="wrapper attributes">
                <div v-for="(val, idx) in columns" v-bind:key=idx @click="sortBy(val)" :class="[{ active: sortKey == val }, val]">
                    {{ val | capitalize }}
                    <span class="arrow" :class="sortOrders[val] > 0 ? 'asc' : 'dsc'"></span>
                </div>
            </div>
        </div>
        <div v-for="(entry,idx) in filteredData" v-bind:key=idx @click.exact="editItem(idx, entry)" @click.ctrl="deleteItem(idx, entry)">
            <div class="table-row data">
                <div class="wrapper attributes">
                <div v-for="(val, idx) in columns" v-bind:key=idx :class="[val]">
                        <b-badge variant='primary' v-if="val==='Buy' && entry[val]==='貸出'">
                          {{entry[val]}}
                        </b-badge>
                        <b-badge variant='success' v-else-if="val==='Buy' && entry[val]==='購入'">
                          {{entry[val]}}
                        </b-badge>
                        <b-badge variant='info' v-else-if="val==='ReadComplete' && entry[val]==='完読'">
                          {{entry[val]}}
                        </b-badge>
                        <b-badge variant='danger' v-else-if="val==='ReadComplete' && entry[val]==='未読'">
                          {{entry[val]}}
                        </b-badge>
                        <span v-else>
                          {{entry[val]}}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import dbmodel from '../models/dbmodel.js'

export default {
  name: 'Table',
  props: {
    data: Array,
    columns: Array,
    filterKey: String
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
        // console.log('filterData by filterKey changed');
        data = data.filter(function (row) {
          return Object.keys(row).some(function (key) {
            return String(row[key]).toLowerCase().indexOf(filterKey) > -1
          })
        })
      }
      if (sortKey) {
        // console.log('filterData by sortKey changed');
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
      var ret = str.charAt(0).toUpperCase() + str.slice(1)
      // console.log('capitalize filters : ' + str + ' to ' + ret);
      return ret
    }
  },
  methods: {
    sortBy: function (key) {
      this.sortKey = key
      this.sortOrders[key] = this.sortOrders[key] * -1
    },
    addRecord: function (rec) {
      console.log('addRecord')
      console.log(rec)
      // @@@
      // ここに dbmodels.addRecord(rec) を追加する
    },
    updateRecord: function (rec) {
      console.log('updateRecord')
      console.log(rec)
      // @@@
      // ここに dbmodels.updateRecord(rec) を追加する
    },
    deleteRecord: function (rec) {
      console.log('deleteRecord')
      console.log(rec)
      // @@@
      // ここに dbmodels.deleteRecord(rec) を追加する
    },
    editItem: function (idx, entry) {
      console.log('edtiItem: idx=' + idx)
      console.log(entry)
      this.$emit('editItem', entry)
    },
    deleteItem: function (idx, entry) {
      console.log('deleteItem: idx=' + idx)
      console.log(entry)
      this.$emit('deleteItem', entry)
    },
    createBooksRecords: function (books) {
      var records = []
      books.Items.forEach(function (element, index, array) {
        var buy = element.Buy.B ? '購入' : '貸出'
        var comp = element.ReadComplete.B ? '完読' : '未読'
        var rec = '{' +
                ' "BookTitle" : "' + element.BookTitle.S + '"' +
                ',"RegistrationDateTime" : "' + element.RegistrationDateTime.S + '"' +
                ',"Buy" : "' + buy + '"' +
                ',"ReadComplete" : "' + comp + '"' +
                ',"ReviewComment" : "' + element.ReviewComment.S + '"' +
                ',"BookImagePath" : "' + element.BookImagePath.S + '"' +
                ' }'
        var obj = JSON.parse(rec)
        records.push(obj)
      })
      return records
    },
    checkSession: async function (onSuccessCb, onFailureCb) {
      console.log('checkSession')
      try {
        await dbmodel.getSession()
        await dbmodel.getUserAttribute()
        await dbmodel.getCredentials()
        await onSuccessCb()
      } catch (err) {
        // loginにリダイレクトする
        onFailureCb()
        console.log(err)
      }
    },
    loadData: async function () {
      console.log('loadData')
      try {
        var books = await dbmodel.listBooks()
        var records = await this.createBooksRecords(books)
        this.$emit('updatedata', records)
      } catch (err) {
        console.log('loadData catch error !!')
        console.log(err)
      }
    },
    redirectTologin: function () {
      console.log('redirect to login 画面')
      this.$router.push('/SignIn')
    }
  },
  // 追加
  mounted () {
    this.checkSession(this.loadData, this.redirectTologin)
  }
}
</script>

<style>
  .container-fluid{
    padding: 5px;
    width: 100%;
  }
  .wrapper {
    display: flex;
    display: -webkit-flex;
    flex-direction: row;
    -webkit-flex-direction: row;
  }
  .BookTitle {
    width: 200px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-align: left;
  }
  .RegistrationDateTime {
    width: 300px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-align: left;
  }
  .Buy {
    width: 100px;
    height: 20px;
    display:flex;
    align-items: center;
    text-align: left;
  }
  .ReadComplete {
    width: 200px;
    height: 20px;
    display:flex;
    align-items: center;
    text-align: left;
  }
  .ReviewComment {
    width: 200px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-align: left;
  }
  .BookImagePath {
    width: 200px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-align: left;
  }
  /* growable wrappers */
  .attributes {
    flex-grow: 0;
    -webkit-flex-grow: 0;
  }
  /*
   * Media queries: optimize for different screen widths.
   */
   @media screen and (max-device-width: 768px),screen and (max-width: 768px)
   {
    .attributes {
      flex-direction: column;
      -webkit-flex-direction: column;
    }
    .attributes div {
      flex-grow: 0;
      -webkit-flex-grow: 0;
    }
    .attributes > div {
      width: 100%;
    }
  }
  /*
   * General good-look styles
   */
  .table-row {
    border-bottom: 1px solid #e0e0e0;
    border-collapse: collapse;
  }
  .table-row.header {
    background-color: rgb(229, 255, 219);
    font-weight: bold;
    padding-top: 6px;
    padding-bottom: 6px;
  }
  div.active {
    color: rgb(55, 11, 177);
  }
  .arrow {
    display: inline-block;
    vertical-align: middle;
    width: 0;
    height: 0;
    margin-left: 5px;
    opacity: 0.0;
  }
  .arrow.asc {
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-bottom: 4px solid #000;
  }
  .arrow.dsc {
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 4px solid #000;
  }
  div.active .arrow {
    opacity: 1;
  }
  div.active .arrow.asc {
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-bottom: 4px solid rgb(55, 11, 177);
  }
  div.active .arrow.dsc {
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 4px solid rgb(55, 11, 177);
  }
</style>
