<template>
    <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <slot name="header">
              default header
            </slot>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label for="inputTitle" class="col-md-2 control-label">タイトル</label>
              <div class="col-md-10">
                <input type="text" class="form-control" id="inputTitle" placeholder="書籍タイトル" v-model="record.BookTitle">
              </div>
            </div>
            <div class="form-group">
              <label for="inputComment" class="col-md-2 control-label">書評</label>
              <div class="col-md-10">
                <textarea class="form-control" rows="3" id="inputComment" v-model="record.ReviewComment"></textarea>
              </div>
            </div>
            <div class="complete-checkbox">
              <label><input type="checkbox" value="" v-model="complete">読み終えた？</label><label class="check-explain">（Yes:チェックを入れる）</label>
            </div>
            <div class="buy-checkbox">
              <label><input type="checkbox" value="" v-model="buy">購入？</label><label class="check-explain">（Yes:チェックを入れる）</label>
            </div>
          </div>
          <div class="modal-footer">
            <button class="modal-default-button" @click='editRecord'>OK</button>
            <button class="modal-default-button" @click='cancel'>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import utilities from '../utilities/utilities.js'

export default {
  name: 'EditDialog',
  props: {
    record: Object
  },
  data: function () {
    return {
      complete: false,
      buy: false
    }
  },
  methods: {
    editRecord: function () {
      var date = utilities.formatDate(new Date())
      var buy = this.buy ? '購入' : '貸出'
      var comp = this.complete ? '完読' : '未読'
      var rec = '{' +
                ' "BookTitle" : "' + this.record.BookTitle + '"' +
                ',"RegistrationDateTime" : "' + date.toString() + '"' +
                ',"Buy" : "' + buy + '"' +
                ',"ReadComplete" : "' + comp + '"' +
                ',"ReviewComment" : "' + this.record.ReviewComment + '"' +
                ',"BookImagePath" : "' + this.record.BookImagePath + '"' +
                ' }'
      var obj = JSON.parse(rec)
      this.$emit('editClose', obj)
    },
    cancel: function () {
      console.log('close @ editDialog')
      this.$emit('cancelClose')
    }
  },
  mounted () {
    console.log('editDialog mounted')
    this.complete = (this.record.ReadComplete === '完読')
    this.but = (this.record.Buy === '購入')
  }
}
</script>

<style>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  display: table;
  transition: opacity .3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 50%;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
  font-family: Helvetica, Arial, sans-serif;
    display: flex;
    display: -webkit-flex;
    flex-direction: column;
    -webkit-flex-direction: column;
}
.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
}
.modal-footer {
  margin: 20px 0;
}
.modal-default-button {
  float: right;
  width: 100px;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-align: center;
  /* 文字サイズを1.4emに指定 */
  font-size: 1.0em;
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

.check-explain {
  /* 文字サイズを1.4emに指定 */
  font-size: 0.8em;
}

  @media screen and (max-device-width: 768px),screen and (max-width: 768px)
  {
    .modal-container  {
      width:70%;
    }
  }
  @media screen and (max-width: 468px)
  {
    .modal-container  {
      width:90%;
    }
  }

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */
.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
