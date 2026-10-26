const express = require("express");
const os = require("os");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, "public");

function getStatus(precision) {
  return {
    uptimeSeconds: Number(process.uptime().toFixed(precision)),
    memoryUsageMB: Number((process.memoryUsage().rss / 1024 / 1024).toFixed(precision)),
    cpuCount: os.cpus().length,
    timestamp: new Date().toISOString()
  };
}

function getPrecision(value) {
  const precision = Number(value);
  return Number.isInteger(precision) && precision >= 0 && precision <= 3 ? precision : 2;
}

app.get("/", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

app.get("/about", (req, res) => {
  res.sendFile(path.join(publicPath, "about.html"));
});

app.get("/api/status", (req, res) => {
  const precision = getPrecision(req.query.precision);
  res.json(getStatus(precision));
});

app.get("/api/status/:metric", (req, res) => {
  const precision = getPrecision(req.query.precision);
  const status = getStatus(precision);
  const metric = req.params.metric;

  if (!Object.hasOwn(status, metric)) {
    return res.status(404).json({ message: "Метрика не найдена" });
  }

  res.json({ [metric]: status[metric] });
});

app.use(express.static(publicPath));

app.listen(port, () => {
  console.log("Сервер запущен: http://localhost:" + port);
});
