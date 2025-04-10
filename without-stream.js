const { Client } = require('pg')
const format = require('pg-format');

const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'mani',
  password: 'password',
  database: 'test'
})

async function main() {
  console.time("TIME")
  try {
    await client.connect()
    const { rows: users } = await client.query('SELECT * FROM "user"')
    const values = users.map(user => {
      const [fn, ln] = user.name.split(" ");
      return [user.id, fn, ln];
    });
    const query = format('INSERT INTO normalized_user (id, firstname, lastname) VALUES %L', values);

    await client.query(query);
  } catch (err) {
    console.log("ERR!!!!!", err)
  } finally {
    await client.end()
    console.timeEnd("TIME")
    console.info("Total Memory Used for this => ", process.memoryUsage().rss / 1024 / 1024, "in MB")
  }
}

(async () => {
  await main()
})()
