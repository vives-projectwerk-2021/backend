import config from "../config/config.js"

function buildQuery(id, defaultTime) {
    const fluxQuery = `
    tempValues = () => {
        tempAir = from(bucket: \"${config.values_db.bucket}\")
          |> range(start: ${defaultTime.start})
          |> filter(fn: (r) => r["_measurement"] == "sensors")
          |> filter(fn: (r) => r["_field"] == "value")
          |> filter(fn: (r) => r["host"] == "${id}")
          |> filter(fn: (r) => r["temperature"] == "air")
          |> aggregateWindow(every: ${defaultTime.per}, fn: mean, createEmpty: false)
      
        tempGround = from(bucket: \"${config.values_db.bucket}\")
          |> range(start: ${defaultTime.start})
          |> filter(fn: (r) => r["_measurement"] == "sensors")
          |> filter(fn: (r) => r["_field"] == "value")
          |> filter(fn: (r) => r["host"] == "${id}")
          |> filter(fn: (r) => r["temperature"] == "ground")
          |> aggregateWindow(every: ${defaultTime.per}, fn: mean, createEmpty: false)
    
        return join(tables: {tAir:tempAir, tGround:tempGround}, on: ["_time", "_stop", "_start", "_field", "_measurement", "host"])
    
    }
    
    moisValues12 = () => {
      moisture1 = from(bucket: \"${config.values_db.bucket}\")
        |> range(start: ${defaultTime.start})
        |> filter(fn: (r) => r["_measurement"] == "sensors")
        |> filter(fn: (r) => r["_field"] == "value")
        |> filter(fn: (r) => r["host"] == "${id}")
        |> filter(fn: (r) => r["moisture"] == "level1")
        |> aggregateWindow(every: ${defaultTime.per}, fn: mean, createEmpty: false)
    
      moisture2 = from(bucket: \"${config.values_db.bucket}\")
        |> range(start: ${defaultTime.start})
        |> filter(fn: (r) => r["_measurement"] == "sensors")
        |> filter(fn: (r) => r["_field"] == "value")
        |> filter(fn: (r) => r["host"] == "${id}")
        |> filter(fn: (r) => r["moisture"] == "level2")
        |> aggregateWindow(every: ${defaultTime.per}, fn: mean, createEmpty: false)
    
        return join(tables: {mLevel1:moisture1, mLevel2:moisture2}, on: ["_time", "_stop", "_start", "_field", "_measurement", "host"])
    }
    
    moisValues34 = () => {
      moisture3 = from(bucket: \"${config.values_db.bucket}\")
        |> range(start: ${defaultTime.start})
        |> filter(fn: (r) => r["_measurement"] == "sensors")
        |> filter(fn: (r) => r["_field"] == "value")
        |> filter(fn: (r) => r["host"] == "${id}")
        |> filter(fn: (r) => r["moisture"] == "level3")
        |> aggregateWindow(every: ${defaultTime.per}, fn: mean, createEmpty: false)
    
      moisture4 = from(bucket: \"${config.values_db.bucket}\")
        |> range(start: ${defaultTime.start})
        |> filter(fn: (r) => r["_measurement"] == "sensors")
        |> filter(fn: (r) => r["_field"] == "value")
        |> filter(fn: (r) => r["host"] == "${id}")
        |> filter(fn: (r) => r["moisture"] == "level4")
        |> aggregateWindow(every: ${defaultTime.per}, fn: mean, createEmpty: false)
    
        return join(tables: {mLevel3:moisture3, mLevel4:moisture4}, on: ["_time", "_stop", "_start", "_field", "_measurement", "host"])
    }
    
    lightBattVolt = () => {
      lightValue = from(bucket: \"${config.values_db.bucket}\")
        |> range(start: ${defaultTime.start})
        |> filter(fn: (r) => r["_measurement"] == "sensors")
        |> filter(fn: (r) => r["_field"] == "value")
        |> filter(fn: (r) => r["host"] == "${id}")
        |> filter(fn: (r) => r["type"] == "light")
        |> aggregateWindow(every: ${defaultTime.per}, fn: mean, createEmpty: false)
    
      battVoltValue = from(bucket: \"${config.values_db.bucket}\")
        |> range(start: ${defaultTime.start})
        |> filter(fn: (r) => r["_measurement"] == "sensors")
        |> filter(fn: (r) => r["_field"] == "value")
        |> filter(fn: (r) => r["host"] == "${id}")
        |> filter(fn: (r) => r["voltage"] == "battery")
        |> aggregateWindow(every: ${defaultTime.per}, fn: mean, createEmpty: false)
    
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