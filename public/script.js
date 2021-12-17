const date = [];
const temp = [];
const hum = [];
const pres = [];
const wind = [];
const state = [];
let first = true;

getData();
async function getData() {
    const response = await fetch('/api');
    const data = await response.json();
    console.log(data);
    if(first) {
        for (item of data) {
            const root = document.createElement('div');
            const dateString = new Date(item.date * 1000).toLocaleString();
            date.push(dateString);
            const tempVal = item.temp.$numberDecimal;
            temp.push(tempVal - 273.15);
            const humVal = item.humidity.$numberDecimal;
            hum.push(humVal);
            const presVal = item.pressure.$numberDecimal;
            pres.push(presVal/10);
            const windSpeed = item.windSpeed.$numberDecimal;
            wind.push(windSpeed);
            const stateString = item.weatherDetail;
            state.push(stateString);
        }
        console.log(state);
        first = false;
    }
    else {
        return;
    }
}

tempChart();
async function tempChart() {
    await getData();
    const ctx = document.getElementById('tempChart').getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: date,
            datasets: [{
                label: 'Temperature in Celcius',
                data: temp,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        }
    });
};

humChart();
async function humChart() {
    await getData();
    const ctx = document.getElementById('humChart').getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: date,
            datasets: [{
                label: 'Humidity',
                data: hum,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        }
    });
};

presChart();
async function presChart() {
    await getData();
    const ctx = document.getElementById('presChart').getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: date,
            datasets: [{
                label: 'Pressure in kPA',
                data: pres,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        }
    });
};

windChart();
async function windChart() {
    await getData();
    const ctx = document.getElementById('windChart').getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: date,
            datasets: [{
                label: 'Wind Speed in m/s',
                data: wind,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        }
    });
};

getCurrentState();
async function getCurrentState() {
    await getData();
    console.log(state);
    console.log(state.length);
    console.log(state[state.length-1]);
    const currState = state[state.length-1];
    let recString = "";
    const tempString = String(temp[temp.length-1].toFixed(2));
    const humString = String(hum[hum.length-1]);
    const presString = String(pres[pres.length-1]);
    if(currState.includes("rain")) {
        recString = "bring an umbrella!"
    }
    else {
        if(hum[hum.length-1]>=90) {
            recString = "you may need an umbrella."
        }
        else {
            recString = "you don't need an umbrella."
        }
    }
    document.getElementById("status").textContent = tempString + "°C, " + humString + "% humidity, " + presString + "kPA, and " + currState + ", ";
    document.getElementById("recommendation").textContent = recString;
    recString = "";
}

// getCurrent();
// async function getCurrent() {
//     const curr_response = await fetch('/current');
//     const curr_data = await curr_response.json();
//     console.log(curr_data);
// }