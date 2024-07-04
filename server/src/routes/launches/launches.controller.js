const {
  getAllLaunches,
  scheduleNewLaunch,
  existLaunchWithId,
  abortLaunchWithId,
} = require("../../models/launches.model");

const { getPagination } = require("../../services/query");

async function httpGetAllLaunches(req, res) {
  const { skip, limit } = getPagination(req.query);
  const launches = await getAllLaunches(skip, limit);
  res.status(200).json(launches);
}

async function httpAddNewLaunch(req, res) {
  const launchData = req.body;
  if (
    !launchData.mission ||
    !launchData.rocket ||
    !launchData.target ||
    !launchData.launchDate
  ) {
    return res.status(400).json({
      error: "Missing required launch property!!",
    });
  }
  launchData.launchDate = new Date(launchData.launchDate);
  if (isNaN(launchData.launchDate)) {
    return res.status(400).json({
      error: "Invalid Date",
    });
  }
  await scheduleNewLaunch(launchData);
  return res.status(201).json(launchData);
}

async function httpAbortLaunch(req, res) {
  const launchId = Number(req.params.id);
  // if id doesn't exist
  const existsLaunch = await existLaunchWithId(launchId);
  if (!existsLaunch) {
    return res.status(400).json({
      error: "Launch does not exist",
    });
  }

  // if id is matched
  const aborted = await abortLaunchWithId(launchId);
  if (!aborted) {
    return res.status(400).json({
      error: "Launch not aborted!!",
    });
  }
  return res.status(200).json({
    ok: true,
  });
}

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
};
