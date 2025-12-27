/* ===================== CONFIG ===================== */
const API_KEY = "0324cb15a52ee9ba46b29e6991ec1b02";
let unit = "metric";
const city = "Kolkata";

/* ===================== DOM ELEMENTS ===================== */
const tempEl = document.querySelector(".temp");
const feelsEl = document.querySelector(".feels");
const conditionEl = document.querySelector(".condition");
const rangeEl = document.querySelector(".range");

const windEl = document.getElementById("wind");
const rainEl = document.getElementById("rain");
const visEl = document.getElementById("visibility");
const sunriseEl = document.getElementById("sunrise");
const sunsetEl = document.getElementById("sunset");
const aqiEl = document.getElementById("aqi");

const cBtn = document.querySelector(".unit-toggle span:first-child");
const fBtn = document.querySelector(".unit-toggle span:last-child");

/* ===================== UNIT TOGGLE ===================== */
cBtn.onclick = () => switchUnit("metric");
fBtn.onclick = () => switchUnit("imperial");

function switchUnit(u) {
  if (unit === u) return;
  unit = u;

  cBtn.classList.toggle("active", u === "metric");
  fBtn.classList.toggle("active", u === "imperial");

  loadWeather();
}

/* ===================== LOAD WEATHER ===================== */
async function loadWeather() {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${API_KEY}`
    );
    const data = await res.json();

    tempEl.textContent =
      Math.round(data.main.temp) + (unit === "metric" ? "°C" : "°F");

    feelsEl.textContent =
      "Feels like " +
      Math.round(data.main.feels_like) +
      (unit === "metric" ? "°C" : "°F");

    conditionEl.textContent = data.weather[0].main;

    rangeEl.textContent =
      `High: ${Math.round(data.main.temp_max)} | Low: ${Math.round(data.main.temp_min)}`;

    if (windEl)
      windEl.textContent =
        Math.round(data.wind.speed) +
        (unit === "metric" ? " km/h" : " mph");

    if (visEl)
      visEl.textContent =
        Math.round(data.visibility / 1000) + " km";

    if (rainEl)
      rainEl.textContent =
        data.rain && data.rain["1h"]
          ? data.rain["1h"] + " mm"
          : "0 mm";

    const sunrise = new Date(data.sys.sunrise * 1000);
    const sunset = new Date(data.sys.sunset * 1000);

    if (sunriseEl)
      sunriseEl.textContent = sunrise.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      });

    if (sunsetEl)
      sunsetEl.textContent = sunset.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      });

    loadAQI(data.coord.lat, data.coord.lon);

  } catch (err) {
    console.error("Weather load failed", err);
  }
}

/* ===================== LOAD AQI ===================== */
async function loadAQI(lat, lon) {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    );
    const data = await res.json();

    const aqiValue = data.list[0].main.aqi;
    const aqiText = ["Good","Fair","Moderate","Poor","Very Poor"][aqiValue - 1];

    if (aqiEl)
      aqiEl.textContent = `${aqiValue} – ${aqiText}`;

  } catch (err) {
    console.error("AQI load failed", err);
  }
}

/* ===================== INIT ===================== */
loadWeather();
/* ===================== WEATHER CURSOR LOGIC ===================== */

let cursorTimeout = null;

function resetToCloud() {
  document.body.classList.remove("sun-cursor", "rain-cursor");
}

/* Left click → Sun */
document.addEventListener("click", () => {
  document.body.classList.add("sun-cursor");
  document.body.classList.remove("rain-cursor");

  clearTimeout(cursorTimeout);
  cursorTimeout = setTimeout(resetToCloud, 500);
});

/* Right click → Rain */
document.addEventListener("contextmenu", (e) => {
  e.preventDefault();

  document.body.classList.add("rain-cursor");
  document.body.classList.remove("sun-cursor");

  clearTimeout(cursorTimeout);
  cursorTimeout = setTimeout(resetToCloud, 500);
});
