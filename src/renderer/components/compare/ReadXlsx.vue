<template>
  <div class="wrapper">
    <div class="inner">
      <input
        type="file"
        @change="fileChange"
        ref="file">
      <h2 class="table-name">{{tableName}}</h2>
      <Modal
        v-model="tableDetailShow"
        title="填详情"
        @on-ok="build"
        @on-cancel="cancelDetail">
        <div class="form">
          日期列数：<InputNumber :min="1" v-model="dateCol" size="small"></InputNumber>
          摘要列数：<InputNumber :min="1" v-model="detailCol" size="small"></InputNumber>
          <br>
          支出列数：<InputNumber :min="1" v-model="expandCol" size="small"></InputNumber>
          收入列数：<InputNumber :min="1" v-model="incomeCol" size="small"></InputNumber>
          <br>
          单据号列数：<InputNumber :min="1" v-model="numberCol" size="small"></InputNumber>
          <br>
          数据行范围（始）：<InputNumber :min="1" v-model="start" size="small"></InputNumber>
          <br>
          数据行范围（终）：<InputNumber :min="1" v-model="end" size="small"></InputNumber>
        </div>
      </Modal>
      <Modal
        v-model="tableShow"
        title="选择表"
        @on-ok="tableConfirm"
        @on-cancel="cancelTable">
          <div class="table-content">
            <div
              :class="{active: currentTable.data.name === item.name}"
              class="table-name"
              @click="chooseTable(item, index)"
              v-for="(item, index) in originData">{{item.name}}</div>
          </div>
      </Modal>
      <Table
        :id="id"
        :data="monthData"
        @showMatched="showMatched"
        @setAllData="setAllData"
        v-if="monthData.length"></Table>
    </div>
  </div>
</template>
<script>
  import Table from './Table.vue'
  const xlsx = require('node-xlsx').default
  // const fs = require('fs')
  export default {
    name: 'read-xlsx',
    components: {
      Table
    },
    props: {
      id: {
        type: Number,
        default: 0
      }
    },
    data () {
      return {
        monthData: [],
        dateCol: 0,
        detailCol: 0,
        expandCol: 0,
        incomeCol: 0,
        numberCol: 0,
        start: 0,
        end: 0,
        tableName: '',
        filePath: null,
        tableShow: false,
        tableDetailShow: false,
        originData: [],
        currentTable: {
          data: {},
          index: 0
        }
      }
    },
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      },
      showMatched (matchId) {
        this.$emit('showMatched', matchId)
      },
      setAllData (data) {
        this.$emit('setAllData', data)
      },
      chooseTable (data, index) {
        this.currentTable.data = data
        this.currentTable.index = index
      },
      tableConfirm () {
        this.tableShow = false
        this.$nextTick(() => {
          this.tableDetailShow = true
        })
      },
      cancelTable () {
        this.tableShow = false
      },
      cancelDetail () {
        this.dateCol = 0
        this.detailCol = 0
        this.expandCol = 0
        this.incomeCol = 0
        this.tableCol = 0
        this.numberCol = 0
        this.start = 0
        this.end = 0
      },
      fileChange () {
        this.$emit('toggleSpin')
        this.filePath = this.$refs.file.files[0].path
        setTimeout(() => {
          this.originData = xlsx.parse(this.filePath)
          this.$emit('toggleSpin')
          this.tableShow = true
        }, 500)
      },
      build () {
        const data = this.originData[this.currentTable.index]
        this.tableName = data.name
        let id = 0
        data.data.slice(this.start - 1, this.end).forEach(item => {
          let key = new Date(this.fixTime(item[this.dateCol - 1])).toLocaleDateString()
          if (key === 'Invalid Date') return // 非法时间
          let current = this.monthData.find(item => item.name === key)
          let params = {
            expand: item[this.expandCol - 1] ? Number(item[this.expandCol - 1]) : 0,
            income: item[this.incomeCol - 1] ? Number(item[this.incomeCol - 1]) : 0,
            detail: item[this.detailCol - 1],
            number: item[this.numberCol - 1],
            id,
            matchId: null,
            clicked: false,
            groupShow: false,
            help: false
          }
          id++
          if (!current) {
            this.monthData.push({
              name: key,
              data: [params]
            })
          } else {
            current.data.push(params)
          }
        })
        console.log(this.currentData)
      },
      fixTime (time) {
        let start = new Date('1989-12-30').getTime()
        return time * 24 * 3600 * 1000 + start
      }
    }
  }
</script>
<style scoped lang="scss">
  * {
    margin: 0;
    padding: 0;
  }
  ::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.2);
    border-radius: 10px;
    width: 10px;
  }
  ::-webkit-scrollbar {
    width: 5px;
    height: 5px;
  }
  ::-webkit-scrollbar-thumb {
    border-radius: 2px;
    background: #bbb;
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.4);
  }
  .wrapper {
    padding: 10px;
    box-sizing: border-box;
    height: 100%;
    min-height: 100vh;
    max-height: 100vh;
    position: relative;
    overflow: auto;
    border-left: 1px solid #ccc;
    border-right: 1px solid #ccc;
  }
  .table-content {
    .table-name {
      cursor: pointer;
      &:hover {
        color: rgba(0,0,255,.5)
      }
      &.active {
        color: rgba(0,0,255,.5)
      }
    }
  }
</style>
