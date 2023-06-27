import axios from 'axios'
import { useState, useEffect } from 'react'

const Country = ({ country }) => {
	const key = process.env.REACT_APP_API_KEY

	const [weather, setWeather] = useState(null)

	useEffect(() => {
		axios
			.get(
				`https://api.openweathermap.org/data/2.5/weather?q=${country.capital}&appid=${key}`
			)
			.then((response) => response.data)
			.then((weatherData) => {
				const weatherObject = {
					temperature: weatherData.main.temp - 273.15,
					weatherIcon: ` https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`,
					windSpeed: weatherData.wind.speed,
				}
				setWeather(weatherObject)
			})
			.catch((error) => console.log(error))
	}, [country])

	return (
		<div>
			<h1>{country.name.common}</h1>
			<p>capital {country.capital}</p>
			<p>area {country.area}</p>
			<h3>languages:</h3>
			<ul>
				{Object.values(country.languages).map((language) => (
					<li key={language}>{language}</li>
				))}
			</ul>
			<img
				src={country.flags.png}
				alt={`${country.name.common} flag`}
			/>
			<h2>Weather in {country.capital}</h2>
			{weather && (
				<>
					<p>temperature {weather.temperature.toFixed(2)} Celcius</p>
					<img
						src={weather.weatherIcon}
						alt='Weather icon'
					/>
					<p>wind {weather.windSpeed} m/s</p>
				</>
			)}
		</div>
	)
}

export default Country
