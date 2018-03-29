<template>
  <div id="app">
    <div id="header-container">
      <div id="user-info">
        <p id="user-name">ユーザー：{{userName}}</p>
        <form id="sign-out" v-on:submit.prevent="signOut">
          <input type='submit' id="logout-button" value='サインアウト'>
        </form>
        <form id="add-item" v-on:submit.prevent="addItem">
          <input type='submit' id="add-item-button" value='追加'>
        </form>
      </div>
      <div id="query-box">
        <form id="search">
          <input name="query" id="searchQuery" v-model="searchQuery" placeholder="検索文字列">
        </form>
      </div>
    </div>
    <Table v-on:updatedata="updateRecords" @editItem="editItem" @deleteItem="deleteItem"
      :data="gridData"
      :columns="gridColumns"
      :filter-key="searchQuery">
    </Table>
    <AddDialog v-if="showAddDialog" @cancelClose="cancelClose" @addClose="addClose">
      <h3 slot="header">読書録の追加</h3>
    </AddDialog>
    <EditDialog v-if="showEditDialog" @cancelClose="cancelClose" @editClose="editClose"
      :record="editRecord">
      <h3 slot="header">読書録の更新</h3>
    </EditDialog>
    <DeleteDialog v-if="showDeleteDialog" @cancelClose="cancelClose" @deleteClose="deleteClose"
      :record="deleteRecord">
      <h3 slot="header">読書録の削除</h3>
    </DeleteDialog>
  </div>
</template>

<script>
import dbmodel from '../models/dbmodel.js'
import PropertyStore from '../models/store.js'
import Table from './Table.vue'
import SignIn from './SignIn.vue'
import AddDialog from './AddDialog.vue'
import EditDialog from './EditDialog.vue'
import DeleteDialog from './DeleteDialog.vue'

export default {
  name: 'List',
  components: {
    SignIn,
    Table,
    AddDialog,
    EditDialog,
    DeleteDialog
  },
  data: function () {
    return {
      userName: PropertyStore.state.property.name,
      showAddDialog: false,
      showEditDialog: false,
      showDeleteDialog: false,
      editRecord: null,
      deleteRecord: null,
      searchQuery: '',
      gridColumns: ['BookTitle', 'RegistrationDateTime', 'Buy', 'ReadComplete', 'ReviewComment', 'BookImagePath'],
      gridData: []
    }
  },
  methods: {
    // Show Dialog
    addItem: function () {
      console.log('## addItem')
      this.showAddDialog = true
    },
    editItem: function (rec) {
      console.log('## editItem')
      console.log(rec)
      this.editRecord = Object.assign({}, rec)
      this.showEditDialog = true
    },
    deleteItem: function (rec) {
      console.log('## deleteItem')
      console.log(rec)
      this.deleteRecord = Object.assign({}, rec)
      this.showDeleteDialog = true
    },
    // Dialog Close Event Listener
    addClose: async function (rec) {
      console.log('## addClose')
      this.showAddDialog = false
      var records = await Table.methods.addRecord(rec)
      this.updateRecords(records)
    },
    editClose: async function (rec) {
      console.log('## editClose')
      this.showEditDialog = false
      var records = await Table.methods.updateRecord(rec)
      this.updateRecords(records)
    },
    deleteClose: async function (rec) {
      console.log('## deleteClose')
      this.showDeleteDialog = false
      var records = await Table.methods.deleteRecord(rec)
      this.updateRecords(records)
    },
    cancelClose: function () {
      this.showAddDialog = false
      this.showEditDialog = false
      this.showDeleteDialog = false
      console.log('closeDialog')
    },
    updateRecords: function (bookRecords) {
      console.log('###updateRecords')
      console.log(bookRecords)
      this.gridData = bookRecords
    },
    signOut: async function (event) {
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
  #header-container {
    display: flex;
    display: -webkit-flex;
    flex-direction: column;
    -webkit-flex-direction: column;
    width:100%
  }
  /* -------------- */
  /* user-info part */
  #user-info {
    display: flex;
    display: -webkit-flex;
    flex-direction: row;
    -webkit-flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
    width:30%;
  }
  #user-name {
    padding: 5px;
    margin-bottom: 0;
  }
  #sign-out, #add-item {
    padding: 5px;
  }
  #logout-button, #add-item-button {
    white-space: nowrap;
    text-overflow: ellipsis;
    text-align: left;
    /* 文字サイズを1.4emに指定 */
    font-size: 0.8em;
    /* 文字の太さをboldに指定 */
    font-weight: bold;
    /* 背景色を濃い青色に指定 */
    background-color: rgb(19, 134, 241);
    /* 文字色を白色に指定 */
    color: #fff;
    /* ボーダーをなくす */
    border-style: none;
    border-radius: 3px;
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
  #logout-button:hover, #add-item-button:hover {
    color: rgb(1, 78, 165);
  }
  /* --------------- */
  /* query text part */
  #query-box {
    display: flex;
    display: -webkit-flex;
    flex-direction: row;
    -webkit-flex-direction: row;
    justify-content: flex-start;
    width:30%;
  }
  #search {
    padding: 5px;
    width:100%;
  }
  #searchQuery {
    width: 100%;
    -moz-box-shadow: inset 1px 4px 9px -6px rgba(0,0,0,0.5);
    -webkit-box-shadow: inset 1px 4px 9px -6px rgba(0, 0, 0, 0.5);
    box-shadow: inset 1px 4px 9px -6px rgba(0,0,0,0.5);
  }
  /*
   * Media queries: optimize for different screen widths.
   */
  @media screen and (max-device-width: 768px),screen and (max-width: 768px)
  {
    #user-info {
      width:60%;
    }
    #query-box {
      width:60%;
    }
  }
  @media screen and (max-width: 468px)
  {
    #user-info {
      width:100%;
    }
    #query-box {
      width:100%;
    }
  }
</style>
