export function getCityFromBrowser() {
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