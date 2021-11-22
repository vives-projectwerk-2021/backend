import client from "prom-client"

const MetricRoute = {
  get: async (req, res) =>{
    res.set('Content-Type', client.register.contentType)
    const m = await client.register.metrics()
    res.end(m)
  }
}

const custom_metric = new client.Gauge({
  name: 'custom_value',
  help: 'this is some random value',
  collect() {
    this.set(5);
  },
});

export default MetricRoute
