import React from 'react';
import { getCityFromBrowser } from '../api/LocationApi';
import { getForecastByCity } from '../api/ForecastApi';

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
        getCityFromBrowser().then((city) => {
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
        getForecastByCity(this.state.city).then((data) => {
            this.setState(data);
        });
    }
}