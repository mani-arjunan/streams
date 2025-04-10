const { Client } = require('pg')
const QueryStream = require('pg-query-stream')
const { Transform, Writable } = require('stream')
const { pipeline } = require('stream/promises');
const format = require('pg-format')

let rows = []

const insertClient = new Client({
  host: 'localhost',
  port: 5432,
  user: 'mani',
  password: 'password',
  database: 'test'
})
const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'mani',
  password: 'password',
  database: 'test'
})

const transform = Transform({
  objectMode: true,
  transform(chunk, _, cb) {
    try {
      const data = JSON.parse(JSON.stringify(chunk));
      const [fn, ln] = data.name.split(" ")
      const normalizedData = {
        id: data.id,
        fn,
        ln
      }
      cb(null, normalizedData);
    } catch (err) {
      console.log(err)
      cb(err);
    }
  }
})

async function insertBatch() {
  if (rows.length === 0) return;

  const values = rows.map(({ id, fn, ln }) => { return [id, fn, ln] })
  const query = format('INSERT INTO normalized_user (id, firstname, lastname) VALUES %L', values);

  await insertClient.query(query);
}

async function main() {
  console.time("TIME")
  try {
    await client.connect()
    await insertClient.connect()
    const query = new QueryStream('SELECT * FROM "user"')
    const stream = client.query(query)

    stream.on('error', e => {
      console.log(e)
    })

    await pipeline(
      stream,
      transform,
      Writable({
        objectMode: true,
        async write(row, _, cb) {
          rows.push(row);
          if (rows.length >= 100000) {
            try {
              await insertBatch()
              rows = []
              cb();
            } catch (err) {
              console.error('Batch insert error:', err);
              cb(err);
            }
          } else {
            cb();
          }
        },
      }))
  } catch (err) {
    console.log("ERR!!!!!", err)
  } finally {
    await client.end()
    await insertClient.end()
    console.timeEnd("TIME")
    console.info("Total Memory Used for this => ", process.memoryUsage().rss / 1024 / 1024, "in MB")
  }

}

(async () => {
  await main()
})()
