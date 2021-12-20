import { def } from "@vue/shared";
import config from "../config/config.js"

class queryBuilder {
  // Constructor
  constructor(ID, defaultTime, lastInfo) {
    this.ID = ID;
    this.defaultTime = defaultTime;
    this.lastInfo = lastInfo;    
  }

  buildQuery() {
    // TODO increase performance of these queries!!
    if (this.lastInfo) {
      
      this.defaultTime = { start: '-7d', per: '30m' };
    }
    const fluxQuery = `
    tempValues = () => {
        tempAir = from(bucket: \"${config.values_db.bucket}\")
          |> range(start: ${this.defaultTime.start})
          |> filter(fn: (r) => r["_measurement"] == "sensors")
          |> filter(fn: (r) => r["_field"] == "value")
          |> filter(fn: (r) => r["host"] == "${this.ID}")
          |> filter(fn: (r) => r["temperature"] == "air")
          |> aggregateWindow(every: ${this.defaultTime.per}, fn: mean, createEmpty: false)
      
        tempGround = from(bucket: \"${config.values_db.bucket}\")
          |> range(start: ${this.defaultTime.start})
          |> filter(fn: (r) => r["_measurement"] == "sensors")
          |> filter(fn: (r) => r["_field"] == "value")
          |> filter(fn: (r) => r["host"] == "${this.ID}")
          |> filter(fn: (r) => r["temperature"] == "ground")
          |> aggregateWindow(every: ${this.defaultTime.per}, fn: mean, createEmpty: false)
    
        return join(tables: {tAir:tempAir, tGround:tempGround}, on: ["_time", "_stop", "_start", "_field", "_measurement", "host"])
    }
    
    moisValues12 = () => {
      moisture1 = from(bucket: \"${config.values_db.bucket}\")
        |> range(start: ${this.defaultTime.start})
        |> filter(fn: (r) => r["_measurement"] == "sensors")
        |> filter(fn: (r) => r["_field"] == "value")
        |> filter(fn: (r) => r["host"] == "${this.ID}")
        |> filter(fn: (r) => r["moisture"] == "level1")
        |> aggregateWindow(every: ${this.defaultTime.per}, fn: mean, createEmpty: false)
    
      moisture2 = from(bucket: \"${config.values_db.bucket}\")
        |> range(start: ${this.defaultTime.start})
        |> filter(fn: (r) => r["_measurement"] == "sensors")
        |> filter(fn: (r) => r["_field"] == "value")
        |> filter(fn: (r) => r["host"] == "${this.ID}")
        |> filter(fn: (r) => r["moisture"] == "level2")
        |> aggregateWindow(every: ${this.defaultTime.per}, fn: mean, createEmpty: false)
    
        return join(tables: {mLevel1:moisture1, mLevel2:moisture2}, on: ["_time", "_stop", "_start", "_field", "_measurement", "host"])
    }
    
    moisValues34 = () => {
      moisture3 = from(bucket: \"${config.values_db.bucket}\")
        |> range(start: ${this.defaultTime.start})
        |> filter(fn: (r) => r["_measurement"] == "sensors")
        |> filter(fn: (r) => r["_field"] == "value")
        |> filter(fn: (r) => r["host"] == "${this.ID}")
        |> filter(fn: (r) => r["moisture"] == "level3")
        |> aggregateWindow(every: ${this.defaultTime.per}, fn: mean, createEmpty: false)
    
      moisture4 = from(bucket: \"${config.values_db.bucket}\")
        |> range(start: ${this.defaultTime.start})
        |> filter(fn: (r) => r["_measurement"] == "sensors")
        |> filter(fn: (r) => r["_field"] == "value")
        |> filter(fn: (r) => r["host"] == "${this.ID}")
        |> filter(fn: (r) => r["moisture"] == "level4")
        |> aggregateWindow(every: ${this.defaultTime.per}, fn: mean, createEmpty: false)
    
        return join(tables: {mLevel3:moisture3, mLevel4:moisture4}, on: ["_time", "_stop", "_start", "_field", "_measurement", "host"])
    }
    
    lightBattVolt = () => {
      lightValue = from(bucket: \"${config.values_db.bucket}\")
        |> range(start: ${this.defaultTime.start})
        |> filter(fn: (r) => r["_measurement"] == "sensors")
        |> filter(fn: (r) => r["_field"] == "value")
        |> filter(fn: (r) => r["host"] == "${this.ID}")
        |> filter(fn: (r) => r["type"] == "light")
        |> aggregateWindow(every: ${this.defaultTime.per}, fn: mean, createEmpty: false)
    
      battVoltValue = from(bucket: \"${config.values_db.bucket}\")
        |> range(start: ${this.defaultTime.start})
        |> filter(fn: (r) => r["_measurement"] == "sensors")
        |> filter(fn: (r) => r["_field"] == "value")
        |> filter(fn: (r) => r["host"] == "${this.ID}")
        |> filter(fn: (r) => r["voltage"] == "battery")
        |> aggregateWindow(every: ${this.defaultTime.per}, fn: mean, createEmpty: false)
    
        return join(tables: {light:lightValue, battVoltage:battVoltValue}, on: ["_time", "_stop", "_start", "_field", "_measurement", "host"])
    }
    
    joinMoistureLevels = () => {
      return join(tables: {mois12:moisValues12(), mois34:moisValues34()}, on: ["_time", "_stop", "_start", "_field", "_measurement", "host"])
    }
    
    joinTempLightBattValues = () => {
      return join(tables: {temp:tempValues(), lightBatt:lightBattVolt()}, on: ["_time", "_stop", "_start", "_field", "_measurement", "host"])
    }
    
    
    join(tables: {moisLevels:joinMoistureLevels(), other:joinTempLightBattValues()}, on: ["_time", "_stop", "_start", "_field", "_measurement", "host"])
      |> drop(columns: ["_field","_start","_stop","moisture_mLevel1","moisture_mLevel2", "moisture_mLevel3","moisture_mLevel4", "type", "voltage", "temperature_tAir", "temperature_tGround"])`;
    
      return fluxQuery
}
}

export default queryBuilder;