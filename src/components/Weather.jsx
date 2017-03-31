import React from 'react';

export default class Weather extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            city: '',
            country: '',
            temperature: '',
            scale: ''
        };
    }

    componentDidMount = () => {
        this.getCityByBrowser().then((city) => {
            this.state.city = city;
            console.log(this.state.city);
            this.handleFetchWeather();
        });
    }

    render = () => {
        return (
            <div>
                <form onSubmit={this.onFormSubmit}>
                    <input type="text" onChange={this.handleCity} />
                    <button type="submit">Fetch weather</button>
                </form>
                <h1>{`${this.state.city}, ${this.state.country}`}</h1>
                <span className="temperature">{this.state.temperature}</span>
                <span>{this.state.scale}</span>
            </div>
        );
    }

    handleCity = (event) => {
        let newValue = event.target.value;
        if (this.state.city.toLowerCase() === newValue.toLowerCase()) {
            return;
        }

        this.state.city = newValue;
    }

    onFormSubmit = (event) => {
        event.preventDefault();
        this.handleFetchWeather();
    }

    handleFetchWeather = () => {
        this.callForecastApi(this.state.city).then((data) => {
            this.setState(data);
        });
    }


    callForecastApi = (city) => {
        const query = `select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="${city}") and u='c'`;
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

    getCityByBrowser = () => {
        return new Promise((resolve) => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    //fetch current city

                    let url = `http://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&sensor=true`;
                    return fetch(url)
                        .then(response => {
                            if (response.ok) {
                                return response.json();
                            }
                        }).then(mapsData => {
                            let { long_name } = mapsData.results.filter(x => x.types.includes('locality'))[0].address_components[0];
                            resolve(long_name);
                        });
                }, () => {
                    //Use default city on error
                    resolve('Auckland');
                });
        });

    }
}