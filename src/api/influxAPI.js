const {InfluxDB} = require('@influxdata/influxdb-client')

class influxAPI {
    // Constructor for the influx class
    constructor() {
<<<<<<< HEAD
        this.token = `${process.env.INFLUX_API_CONNECTION_TOKEN}`;
        this.org = `${process.env.INFLUX_API_CONNECTION_ORG}`;
        this.bucket = `${process.env.INFLUX_API_CONNECTION_BUCKET}`;
        console.log(this.token + this.org + this.bucket);
=======
        this.token = `${process.env.INFLUX_API_CONNECTION_TOKEN}`
        this.org = `${process.env.INFLUX_API_CONNECTION_ORG}`
        this.bucket = `${process.env.INFLUX_API_CONNECTION_BUCKET}`
>>>>>>> 3f36f29cb6a2378eab776a6925eb0fb8a46343c2
    }

    async connector() {
        console.log("Connecting to the influxDB: " + this.org);
<<<<<<< HEAD
        this.client = new InfluxDB({url: 'http://localhost:8086', token: this.token});
=======
        this.client = new InfluxDB({url: process.env.INFLUX_API_CONNECTION_BASE_URL, token: this.token});
>>>>>>> 3f36f29cb6a2378eab776a6925eb0fb8a46343c2
        this.queryApi = this.client.getQueryApi(this.org);
    }

    async writeData() {
        await this.connector();
        const {Point} = require('@influxdata/influxdb-client')
        const writeApi = this.client.getWriteApi(this.org, this.bucket)
        writeApi.useDefaultTags({host: 'host1'})

        const point = new Point('mem')
        .floatField('used_percent', 23.43234543)
        writeApi.writePoint(point)
        writeApi
            .close()
            .then(() => {
                console.log('FINISHED')
            })
            .catch(e => {
                console.error(e)
                console.log('\\nFinished ERROR')
            })
    }

    async readData() {
        await this.connector();
        const getRows = (query) => {
            return new Promise((resolve, reject) => {
              let rows = []
              queryApi.queryRows(query, {
                next(row, tableMeta) {
                  rows.push(tableMeta.toObject(row))
                },
                error(err) {
                  reject(err)
                },
                complete() {
                  resolve(rows)
                }
              })
            })
          }
    }
    
}

module.exports = influxAPI;