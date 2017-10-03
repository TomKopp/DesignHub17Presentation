const csv = require('fast-csv')

csv
  .fromPath('my.csv')
  .on('data', (data) => {
    process.stdout(data)
  })
  .on('end', () => {
    process.stdout('done')
  })
