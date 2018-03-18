<template>
  <div id="app">
    <div class="container-fluid" style="margin-top: 10px">
        <div class="table-row header">
            <div class="wrapper attributes">
                <div v-for="(val, idx) in columns" v-bind:key=idx @click="sortBy(val)" :class="[{ active: sortKey == val }, val]">
                    {{ val | capitalize }}
                    <span class="arrow" :class="sortOrders[val] > 0 ? 'asc' : 'dsc'"></span>
                </div>
            </div>
        </div>
        <div v-for="(entry,idx) in filteredData" v-bind:key=idx>
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
                ',"BookImagePath" : "' + element.BookImagePath.S + '"' +
                ' }'
        var obj = JSON.parse(rec)
        records.push(obj)
      })
      return records
    },
    asyncFuncCall: function (cb, params) {
      return new Promise((resolve, reject) => { return cb(resolve, reject, params) })
    },
    checkSession: async function (onSuccessCb, onFailureCb) {
      console.log('checkSession')
      try {
        await this.asyncFuncCall(dbmodel.getSession)
        await this.asyncFuncCall(dbmodel.getUserAttribute)
        await this.asyncFuncCall(dbmodel.getCredentials)
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
        var books = await this.asyncFuncCall(dbmodel.listBooks)
        var records = await this.createBooksRecords(books)
        this.$emit('updatedata', records)
      } catch (err) {
        console.log('loadData catch error !!')
        console.log(err)
      }
    },
    redirectTologin: function () {
      console.log('redirect to login 画面')
      this.$router.push('Login')
    }
  },
  // 追加
  mounted () {
    this.checkSession(this.loadData, this.redirectTologin)
  }
}
</script>

<style>
/*
  * Define the widths: play around with these
  * to get a best fit.
  */
/*
  * Basic styles, good for a large display. Everything fits in
  * one row, no wrapping. All text based cells grow equally.
  */
  .search {
    padding-left: 15px;
  }
  .logout-button {
    /* 高さを指定 */
    height:25px;
    /* 文字サイズを1.4emに指定 */
    font-size: 0.8em;
    /* 文字の太さをboldに指定 */
    font-weight: bold;
    /* 縦方向に10px、
     * 横方向に30pxの余白を指定 */
    padding: 0px 10px;
    /* 背景色を濃い青色に指定 */
    background-color: rgb(19, 134, 241);
    /* 文字色を白色に指定 */
    color: #fff;
    /* ボーダーをなくす */
    border-style: none;
    /* ボタンの影の指定
     * 影の横幅を2px
     * 縦長を2px
     * ぼかしを3px
     * 広がりを1px
     * 色を#666（グレー）に指定 */
    box-shadow: 2px 2px 3px 1px #248;
    -moz-box-shadow: 2px 2px 3px 1px #248;
    -webkit-box-shadow: 2px 2px 3px 1px #248;
  }
  .table-row {
    display: flex;
    display: -webkit-flex;
    flex-direction: row;
    -webkit-flex-direction: row;
    flex-wrap: no-wrap;
    -webkit-flex-wrap: no-wrap;
    width: 100%;
    padding-left: 15px;
    padding-right: 15px;
  }
  .wrapper {
    display: flex;
    display: -webkit-flex;
    flex-direction: row;
    -webkit-flex-direction: row;
  }
  .column {
    flex-grow: 0;
    -webkit-flex-grow: 0;
    flex-shrink: 0;
    -webkit-flex-shrink: 0;
    vertical-align: top;
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
  /*
   * Media breaks.
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
    padding-top: 2px;
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

  div.active .arrow {
    opacity: 1;
  }
  .arrow {
    display: inline-block;
    vertical-align: middle;
    width: 0;
    height: 0;
    margin-left: 5px;
    opacity: 0.66;
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