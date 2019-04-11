<template>
  <div class="compare">
    <Spin size="large" fix v-if="spinShow"></Spin>
    <div class="content">
      <ReadXlsx
        :id="1"
        @showMatched="showMatch"
        @setAllData="setLeftData"
        @toggleSpin="toggleSpin"></ReadXlsx>
      <div class="match">
        <div class="legend">
          <div class="back" @click="backIndex">回到首页</div>
          <div class="legend-item">
            未匹配：<div class="color-box un-matched"></div>
          </div>
          <div class="legend-item">
            已匹配：<div class="color-box matched"></div>
          </div>
          <div class="legend-item">
            已选中：<div class="color-box current"></div>
          </div>
          <div class="legend-item">
            已匹配组：<div class="color-box group"></div>
          </div>
        </div>
        <Button
          size="small"
          :disabled="firstTime || !leftData || !rightData"
          @click="autoMatch"
          style="marginBottom: 20px">自动匹配</Button>
        <Button
          :disabled="!leftData || !rightData"
          size="small"
          @click="selfMatch"
          style="marginBottom: 20px">手动匹配</Button>
        <Button
          :disabled="!leftData || !rightData"
          size="small"
          @click="cancelMatch"
          style="marginBottom: 20px">取消匹配</Button>
        <Button
          :disabled="!leftData || !rightData"
          size="small"
          @click="help"
          style="marginBottom: 20px;width: 64px">提示</Button>
        <Poptip
            confirm
            title="重置后，会清除所有的匹配关系。文件数据会保留。"
            ok-text="确认重置"
            transfer
            @on-ok="relaod">
            <Button
              :disabled="!leftData || !rightData"
              style="width: 64px;marginBottom: 20px"
              size="small">重置</Button>
        </Poptip>
        <Poptip
            confirm
            :title="`刷新页面，数据（包括导入的文件）将全部清空。`"
            ok-text="确认刷新"
            transfer
            @on-ok="refresh">
            <Button
              style="width: 64px;marginBotton: 10px;"
              size="small">刷新</Button>
        </Poptip>
      </div>
      <ReadXlsx
        :id="2"
        @showMatched="showMatch"
        @setAllData="setRightData"
        @toggleSpin="toggleSpin"></ReadXlsx>
    </div>
  </div>
</template>
<script>
import ReadXlsx from './ReadXlsx'
export default {
  components: {
    ReadXlsx
  },
  data () {
    return {
      firstTime: false,
      spinShow: false,
      leftData: null,
      rightData: null,
      matchId: 1,
      BrowserWindow: null,
      helpList: []
    }
  },
  methods: {
    backIndex () {
      this.$router.push('/')
    },
    lcs (str1, str2) {
      str1 = str1 ? String(str1).trim() : ''
      str2 = str2 ? String(str2).trim() : ''
      let m = str1.length
      let n = str2.length
      let dp = [new Array(n + 1).fill(0)] // 第一行全是0
      for (let i = 1; i <= m; i++) { // 一共有m+1行
        dp[i] = [0] // 第一列全是0
        for (let j = 1; j <= n; j++) { // 一共有n+1列
          if (str1[i - 1] === str2[j - 1]) { // 注意这里，str1的第一个字符是在第二列中，因此要减1，str2同理
            dp[i][j] = dp[i - 1][j - 1] + 1 // 对角＋1
          } else {
            dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
          }
        }
      }
      // dp[m][n] 为匹配上的字符数
      return dp[m][n] / Math.max(str1.length, str2.length)
    },
    refresh () {
      location.reload()
    },
    relaod () {
      this.matchId = 1
      this.leftData.forEach(item => {
        item.matchId = null
        item.clicked = false
        item.groupShow = false
      })
      this.rightData.forEach(item => {
        item.matchId = null
        item.clicked = false
        item.groupShow = false
      })
      this.firstTime = false
    },
    help () {
      this.leftData.forEach(item => {
        item.help = false
      })
      this.rightData.forEach(item => {
        item.help = false
      })
      if (this.leftData.find(item => item.clicked) && this.rightData.find(item => item.clicked)) {
        return this.$Message.error('提示不可同时选择左右两侧的数据')
      } else if (!this.leftData.find(item => item.clicked) && !this.rightData.find(item => item.clicked)) {
        return this.$Message.error('提示需选择某条数据')
      } else {
        let leftClickedData = this.leftData.find(item => item.clicked)
        let rightClickedData = this.rightData.find(item => item.clicked)
        let flag = ''
        if (leftClickedData) {
          // 选的左边
          flag = 'right'
        }
        if (rightClickedData) {
          // 选的右边
          flag = 'left'
        }
        this[`${flag}Data`].forEach(item => {
          if (!item.matchId) {
            if ((this.lcs(item.detail, [`${flag}ClickData`]['detail']) > 0.5) ||
              (item.income === leftClickedData.income && item.income && leftClickedData.income) ||
              (item.expand === leftClickedData.expand && item.expand && leftClickedData.expand) ||
              (item.income === -leftClickedData.expand && item.income && leftClickedData.expand) ||
              (item.expand === -leftClickedData.income && item.expand && leftClickedData.income)) {
              // 摘要匹配度大于50%；或收入相等；或支出相等；或收入等于支出的负值；或支出等于收入的负值
              item.help = true
            }
          }
        })
      }
    },
    showMatch (matchId) {
      // 展示与点击项相匹配的
      let leftCounts = 0
      let rightCounts = 0
      let flag = false // 是关掉还是打开
      this.leftData.forEach(item => {
        if (item.matchId === matchId) {
          if (item.groupShow) {
            flag = false
          } else {
            flag = true
          }
          item.groupShow = !item.groupShow
          leftCounts++
        } else {
          item.groupShow = false
        }
      })
      this.rightData.forEach(item => {
        if (item.matchId === matchId) {
          item.groupShow = !item.groupShow
          rightCounts++
        } else {
          item.groupShow = false
        }
      })
      if (flag) {
        this.$Message.info(`左边匹配${leftCounts}项，右边匹配${rightCounts}项`)
      }
    },
    cancelMatch () {
      this.leftData.forEach(item => {
        if (item.groupShow) {
          item.matchId = 0
          item.groupShow = false
        }
      })
      this.rightData.forEach(item => {
        if (item.groupShow) {
          item.matchId = 0
          item.groupShow = false
        }
      })
    },
    selfMatch () {
      this.leftData.forEach(item => {
        item.help = false
      })
      this.rightData.forEach(item => {
        item.help = false
      })
      this.getLeftClicked.forEach(item => {
        item.clicked = false
        item.matchId = this.matchId
      })
      this.getRightClicked.forEach(item => {
        item.clicked = false
        item.matchId = this.matchId
      })
      this.matchId++
    },
    autoMatch () {
      this.spinShow = true
      setTimeout(() => {
        this.matchData(this.leftData, this.rightData)
        this.spinShow = false
        this.firstTime = true
      }, 0)
    },
    matchData (rootData, targetData) {
      rootData.forEach((leftItem, leftIndex) => {
        let tempMatchData = targetData.find((rightItem, rightIndex) => {
          return (this.lcs(leftItem.detail || '', rightItem.detail || '') >= 0.8) &&
            !rightItem.matchId && ((leftItem.income === rightItem.income && leftItem.income !== 0 && rightItem.income !== 0) ||
            (leftItem.expand === rightItem.expand && leftItem.expand !== 0 && rightItem.expand !== 0))
        })
        if (tempMatchData) {
          leftItem.matchId = tempMatchData.matchId = this.matchId
          this.matchId++
        }
      })
    },
    setLeftData (data) {
      this.$set(this, 'leftData', data)
    },
    setRightData (data) {
      this.$set(this, 'rightData', data)
    },
    toggleSpin () {
      this.spinShow = !this.spinShow
    }
  },
  computed: {
    getLeftClicked () {
      return this.leftData.filter(item => item.clicked)
    },
    getRightClicked () {
      return this.rightData.filter(item => item.clicked)
    }
  }
}
</script>
<style lang="scss" scoped>
.compare {
  width: 100%;
  min-height: 100%;
  position: relative;
  .content {
    width: 100%;
    height: 100vh;
    overflow: hidden;
    display: flex;
    justify-content: space-between;
    position: relative;
    >div {
      flex: 1;
      max-width: 45%;
      min-width: 45%;
    }
    .match {
      position: fixed;
      top: 0;
      left: 45%;
      max-width: 10%;
      min-width: 10%;
      text-align: center;
      height: 100%;
      padding: 0 5px;
      padding-top: 30vh;
      .legend {
        position: absolute;
        width: 100%;
        height: 100px;
        top: 20px;
        left: 0;
        padding-left: 2px;
        .back {
          cursor: pointer;
          margin-bottom: 10px;
          position: relative;
          top: -5px;
          &:hover {
            color: skyblue;
          }
        }
        .legend-item {
          display: flex;
          align-items: center;
          .color-box {
            width: 20px;
            height: 10px;
            &.un-matched {
              border: 1px solid #ccc;
            }
            &.matched {
              background: rgba(0,255,0,0.2);
            }
            &.current {
              background: rgba(0,0,0,0.1);
            }
            &.group {
              background: rgba(255,0,0,.1);
            }
          }
        }
      }
    }
  }
}
</style>
