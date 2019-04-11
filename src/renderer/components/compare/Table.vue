<template>
	<div class="table">
    <div class="tab-handle">
      <div
      class="tab"
      @click="hideTabs = !hideTabs">{{this.hideTabs ? '展开日期筛选' : '收起日期筛选'}}</div>
      <div
      @click="showAll"
      :class="{
        active: currentTab === 'all'
      }"
      class="tab">
        全部
        <span class="tips" v-if="getTips(this.originData)">{{getTips(this.originData)}}</span>
      </div>
      <div
      @click="unMatched"
      :class="{
        active: currentTab === 'unMatched'
      }"
      class="tab">
        未匹配
        <span class="tips" v-if="getTips(this.originData)">{{getTips(this.originData)}}</span>
      </div>
    </div>
    <div
      class="tab-content"
      v-if="!hideTabs">
      <div
        @click="changeTab(item)"
        v-for="(item, index) in data"
        :key="index"
        :class="{
          active: item.name === currentTab
        }"
        class="tab">
          {{item.name}}
        <span class="tips" v-if="getTips(item.data)">{{getTips(item.data)}}</span>
      </div>
    </div>
    <div class="table-content">
      <!-- 期初余额：<input type="text" v-model="start" style="width: 80px"> -->
      <p>当{{this.currentTab === 'all' ? '月' : '日'}}总收入：{{this.sumExpand}}</p>
      <p>当{{this.currentTab === 'all' ? '月' : '日'}}总支出：{{this.sumIncome}}</p>
      <div class="header">
        <div class="header-tab detail">摘要</div>
        <div class="header-tab">收入</div>
        <div class="header-tab">支出</div>
        <div class="header-tab">单据号</div>
      </div>
      <div class="inner" :id="`table-inner${id}`">
        <div class="table-wrapper">
          <div
            :class="{
              matched: item.matchId,
              current: item.clicked,
              group: item.groupShow,
              help: item.help
            }"
            class="row"
            @click="clickRow(item)"
            :key="index"
            v-for="(item, index) in currentData">
            <div class="row-tab detail">{{item.detail}}</div>
            <div class="row-tab">{{item.income}}</div>
            <div class="row-tab">{{item.expand}}</div>
            <div class="row-tab">{{item.number}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      currentData: [],
      currentTab: '',
      sumExpand: 0,
      sumIncome: 0,
      start: 0,
      hideTabs: false,
      originData: [],
      first: true
    }
  },
  props: {
    data: {
      type: Array,
      required: true
    },
    id: {
      type: Number,
      default: 0
    }
  },
  watch: {
    data: {
      handler () {
        if (this.currentTab === 'unMatched') {
          this.currentData = this.originData.filter(item => !item.matchId)
        }
      },
      deep: true
    }
  },
  methods: {
    showAll () {
      this.currentTab = 'all'
      let tempArr = []
      this.data.forEach(item => {
        tempArr = tempArr.concat(item.data)
      })
      this.currentData = tempArr
      this.sumExpand = this.currentData.map(item => item.expand).reduce((a, b) => a + b)
      this.sumIncome = this.currentData.map(item => item.income).reduce((a, b) => a + b)
      this.originData = this.currentData
      if (this.first) {
        this.$emit('setAllData', this.originData)
        this.first = false
      }
    },
    unMatched () {
      this.currentTab = 'unMatched'
      this.currentData = this.originData.filter(item => !item.matchId)
    },
    changeTab (data) {
      this.currentTab = data.name
      this.currentData = data.data
      this.sumExpand = data.data.map(item => item.expand).reduce((a, b) => a + b)
      this.sumIncome = data.data.map(item => item.income).reduce((a, b) => a + b)
    },
    getTips (data) {
      return data.filter(item => !item.matchId).length
    },
    clickRow (data) {
      if (data.matchId) {
        this.$emit('showMatched', data.matchId)
      } else {
        data.clicked = !data.clicked
      }
    }
  },
  mounted () {
    this.showAll()
  }
}
</script>
<style scoped lang="scss">
.table {
  display: flex;
  flex-wrap: wrap;
  .tab-content {
    display: flex;
    flex-wrap: wrap;
  }
  .tab-handle {
    display: flex;
  }
  .tab {
    cursor: pointer;
    width: 100px;
    text-align: center;
    border: 1px solid #ccc;
    margin: 5px;
    position: relative;
    &.active {
      background: #eee;
    }
    .tips {
      position: absolute;
      width: 18px;
      height: 18px;
      background: yellow;
      right: -5px;
      top: -10px;
      border-radius: 50%;
      font-size: 12px;
    }
  }
  .table-content {
    position: relative;
    width: 100%;
  }
  .header {
    border: 1px solid #ccc;
    margin-top: 10px;
    display: flex;
    width: 90%;
    margin-left: 5%;
    .header-tab {
      flex: 1;
      text-align: center;
      border-right: 1px solid #ccc;
      height: 30px;
      line-height: 30px;
      font-weight: bold ;
      &:last-child {
        border: 0 none;
      }
    }
    .detail {
      flex: 2;
      max-width: 40%;
      min-width: 40%;
      box-sizing: border-box;
    }
  }
  .inner {
    width: 90%;
    margin-left: 5%;
    margin-top: 5px;
    border: 1px solid #ccc;
    .row {
      border-bottom: 1px solid #ccc;
      width: 100%;
      display: flex;
      cursor: pointer;
      &:last-child {
        border: 0 none;
      }
      &.matched {
        background: rgba(0,255,0,0.1);
      }
      &.current {
        background: rgba(0,0,0,0.1);
      }
      &.group {
        background: rgba(255,0,0,.1);
      }
      &.help {
        color: red;
      }
      >div {
        flex: 1;
        border-right: 1px solid #ccc;
        padding: 5px 0;
        text-align: center;
        &:last-child {
          border: 0 none;
        }
      }
      .detail {
        flex: 2;
        text-align: left !important;
        padding-left: 5px;
        max-width: 40%;
        min-width: 40%;
        box-sizing: border-box;
      }
    }
  }
}
</style>
