import client from "prom-client"
import users_db from "../databases/users_db.js"
import values_db from "../databases/values_db.js";

let api = new users_db();



const MetricRoute = {
  get: async (req, res) =>{
    res.set('Content-Type', client.register.contentType)
    const m = await client.register.metrics()
    res.end(m)
  }
}

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ timeout: 5000 });

const mongo_write = new client.Counter({
  name: 'database_writes',
  help: 'The total number database writes'
});

const mongo_read = new client.Counter({
  name: 'mongo_reads',
  help: 'The total number database reads'
});

const custom_metric = new client.Gauge({
  name: 'custom_value',
  help: 'this is some random value',
  collect() {
    this.set(5);
  },
});

const device_count = new client.Gauge({
  name: 'device_count',
  help: 'this is the number of devices on the pulu network',
  collect() {
    api.showAllDevices().then(result => this.set(result.length));
  },
});

const user_count = new client.Gauge({
  name: 'user_count',
  help: 'this is the number of users on the pulu network',
  collect() {
    api.findAllUsers().then(result => this.set(result.length));
  },
});

export  {MetricRoute, mongo_write, mongo_read}

