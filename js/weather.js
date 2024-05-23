const API_URL_BASE = 'https://api.openweathermap.org/data/2.5/';
const API_URL_IMG = 'https://openweathermap.org/img/wn/';
const API_APP_ID = '';

const borderStyle = '1px solid #000';
const backgroundColorStyle = 'rgba(50,181,250, 0.8)';

function validateForm(city) {
    if (city == null || city == '') {
        alert('Please enter a city');
        return false;
    }
    return true;
}

async function getIcon(iconId) {
    try {
        const response = await axios.get(`${API_URL_IMG}${iconId}@2x.png`);
        return new URL(response.config.url).toString();
    } catch (error) {
        console.log(error);
        return 'https://cdn-icons-png.flaticon.com/512/6134/6134065.png';
    }
}

function hideResultElements() {
    const resultCity = document.getElementById('city_search_type');
    resultCity.innerHTML = '';

    for (let i = 1; i <= 5; i++) {
        const dayDiv = document.getElementById('day' + i);
        const imgDay = document.getElementById('img_day_' + i);
        const dayTitle = document.getElementById('day' + i + '_title');
        const tempMinDay = document.getElementById('temp_min_day_' + i);
        const tempMaxDay = document.getElementById('temp_max_day_' + i);

        dayDiv.style.border = 'none';
        dayDiv.style.backgroundColor = 'transparent';
        dayTitle.innerHTML = '';
        imgDay.hidden = true;
        tempMinDay.innerHTML = '';
        tempMaxDay.innerHTML = '';
    }
}

async function getCurrentWeather() {
    const city = document.getElementById('txt_city');
    const resultCity = document.getElementById('city_search_type');
    const divDay3 = document.getElementById('day3');
    const imgDay3 = document.getElementById('img_day_3');
    const tempMinDay3 = document.getElementById('temp_min_day_3');
    const tempMaxDay3 = document.getElementById('temp_max_day_3');
    const day3Title = document.getElementById('day3_title');

    if (validateForm(city)) {
        hideResultElements();
        
        try {
            const weatherResponse = await axios.get(
                `${API_URL_BASE}weather?q=${city.value}&appid=${API_APP_ID}&units=metric`
            );
            
            const weatherData = weatherResponse.data;
            resultCity.innerHTML = `Current Weather in ${weatherData.name}`;
            divDay3.style.border = borderStyle;
            divDay3.style.backgroundColor = backgroundColorStyle;
            day3Title.innerHTML = 'Today';
            imgDay3.src = await getIcon(weatherData.weather[0].icon);
            imgDay3.hidden = false;
            tempMinDay3.innerHTML = `<b>Lowest temp:</b> ${weatherData.main.temp_min}°C`;
            tempMaxDay3.innerHTML = `<b>Max. temp:</b> ${weatherData.main.temp_max}°C`;

            city.value = '';
        } catch (error) {
            if (error.response && error.response.status === 404) {
                alert('City not found');
            } else {
                console.log(error);
                alert('Error when consulting the weather');
            }
        }
    }
}

async function getWeatherForecast() {
    const city = document.getElementById('txt_city');
    const resultCity = document.getElementById('city_search_type');

    if (validateForm(city)) {
        hideResultElements();

        try {
            const weatherResponse = await axios.get(
                `${API_URL_BASE}forecast?q=${city.value}&appid=${API_APP_ID}&units=metric`
            );
            
            const weatherData = weatherResponse.data;
            resultCity.innerHTML = `Weather Forecast in ${weatherData.city.name}`;

            for (let i = 1; i <= 5; i++) {
                const dayDiv = document.getElementById(`day${i}`);
                const imgDay = document.getElementById(`img_day_${i}`);
                const dayTitle = document.getElementById(`day${i}_title`);
                const tempMinDay = document.getElementById(`temp_min_day_${i}`);
                const tempMaxDay = document.getElementById(`temp_max_day_${i}`);

                // It's multiplied by 8 because the API returns the weather every 3 hours
                const weatherDay = weatherData.list[(i - 1) * 8];

                dayDiv.style.border = borderStyle;
                dayDiv.style.backgroundColor = backgroundColorStyle;
                dayTitle.innerHTML = weatherDay.dt_txt.split(' ')[0];
                imgDay.src = await getIcon(weatherDay.weather[0].icon);
                imgDay.hidden = false;
                tempMinDay.innerHTML = `<b>Lowest temp:</b> ${weatherDay.main.temp_min}°C`;
                tempMaxDay.innerHTML = `<b>Max. temp:</b> ${weatherDay.main.temp_max}°C`;
            }

            city.value = '';
        } catch (error) {
            if (error.response && error.response.status === 404) {
                alert('City not found');
            } else {
                console.log(error);
                alert('Error when consulting the weather');
            }
        }
    }
}