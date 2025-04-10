const { Client } = require('pg')

const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'mani',
  password: 'password',
  database: 'test'
})

async function main() {
  try {
    await client.connect()
    await client.query('DELETE FROM normalized_user')
  } catch (err) {
    console.log("ERR!!!!!", err)
  } finally {
    await client.end()
  }
}

(async () => {
  await main()
})()
