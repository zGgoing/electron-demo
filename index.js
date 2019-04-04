const fs = require('fs')
const xlsx = require('node-xlsx')
const data = [
  [1, 2, 3],
  [true, false, null, 'sheetjs'],
  ['foo', 'bar', new Date('2014-02-19T14:30Z'), '.3'],
  ['baz', null, 'qux']
]
var buffer = xlsx.build([{name: 'mySheetName', data: data}])// Returns a buffer
fs.writeFile('/Users/gz/myProject/electron-vue/test.xlsx', buffer, (e) => {
  console.log(e)
})