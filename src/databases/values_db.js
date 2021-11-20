import config from "../config/config.js"
import { Point } from "@influxdata/influxdb-client";
import { InfluxDB } from "@influxdata/influxdb-client";

class values_db {
    // Constructor for the influx class
    constructor() {
        this.token = `${config.values_db.token}`;
        this.org = `${config.values_db.organization}`;
        this.bucket = `${config.values_db.bucket}`;
    }

    async connector() {
        console.log("Connecting to the influxDB: " + this.org);
        this.client = new InfluxDB({url: `${config.values_db.baseURL}`, token: this.token});
        this.queryApi = this.client.getQueryApi(this.org);
    }

    async writeData(data) {
        await this.connector();
        const writeApi = this.client.getWriteApi(this.org, this.bucket)
        writeApi.useDefaultTags({host: data.data.device_id })

        const point = new Point('sensors')
        .floatField('light', data.data.sensors.light.value)
        writeApi.writePoint(point)
        writeApi
            .close()
            .then(() => {
                console.log('FINISHED')
            })
            .catch(e => {
                console.log('\\nFinished ERROR')
                console.error(e)
            })
    }

    async readData() {
        await this.connector();
        const getRows = (query) => {
            return new Promise((resolve, reject) => {
              let rows = []
              this.queryApi.queryRows(query, {
                next(row, tableMeta) {
                  console.log(row);
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
        const fluxQuery = `from(bucket: \"${config.values_db.bucket}\") |> range(start: -1h)`;
        let rows = getRows(fluxQuery);
        console.log(rows);
    }
    
}

export default values_db;