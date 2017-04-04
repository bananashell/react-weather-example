export function getForecastByCity(city) {
    const query = `select * from weather.forecast
                   where woeid in (
                       select woeid from geo.places(1)
                       where text="${city}")
                   and u='c'`;

    const forecastApiUrl = `https://query.yahooapis.com/v1/public/yql?q=${escape(query)}&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=`

    return fetch(forecastApiUrl)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
        }).then(data => {
            return {
                city: data.query.results.channel.location.city,
                temperature: data.query.results.channel.item.condition.temp,
                country: data.query.results.channel.location.country,
                scale: data.query.results.channel.units.temperature
            }
        });
}