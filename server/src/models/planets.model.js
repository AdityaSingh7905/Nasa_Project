const path = require("path");
const fs = require("fs");
const planets = require("./planets.mongo");

const { parse } = require("csv-parse");

// const habitablePlanets = [];

const isPlanetsHabitable = (planetData) => {
  if (
    planetData["koi_disposition"] === "CONFIRMED" &&
    planetData["koi_insol"] > 0.36 &&
    planetData["koi_insol"] < 1.1 &&
    planetData["koi_prad"] < 1.6
  ) {
    return true;
  }
  return false;
};
/*
  const promise = new Promise((resolve, reject) => {
    resolve(42);
  })
  promise.then((result) => {

  })
  const result = await promise();
*/

function loadAllPlanets() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(
      path.join(__dirname, "..", "..", "data", "Keplers_data.csv")
    )
      .pipe(
        parse({
          comment: "#",
          columns: true,
        })
      )
      .on("data", async (data) => {
        if (isPlanetsHabitable(data)) {
          // habitablePlanets.push(data);
          savePlanet(data);
        }
      })
      .on("error", (err) => {
        console.log(err);
        reject();
      })
      .on("end", async () => {
        const countPlanetFound = (await getAllPlanets()).length;
        console.log(`${countPlanetFound} habitable planets found!!`);
        console.log("Task Done!!");
        resolve();
      });
  });
}

async function getAllPlanets() {
  return await planets.find(
    {},
    {
      _id: 0,
      __v: 0,
    }
  );
}
async function savePlanet(planet) {
  try {
    await planets.updateOne(
      {
        kepler_name: planet.kepler_name,
      },
      {
        kepler_name: planet.kepler_name,
      },
      {
        upsert: true,
      }
    );
  } catch (err) {
    console.log(`Couldn't save planet ${err}`);
  }
}
module.exports = {
  getAllPlanets,
  loadAllPlanets,
};
