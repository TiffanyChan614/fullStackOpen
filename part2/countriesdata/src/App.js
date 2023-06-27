import { useState, useEffect } from 'react'
import axios from 'axios'
import Result from './components/Result'

const App = () => {
	const [findValue, setFindValue] = useState('')
	const [countries, setCountries] = useState([])
	const [matchedCountries, setMatchedCountries] = useState([])

	useEffect(() => {
		axios
			.get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
			.then((response) => response.data)
			.then((countriesData) => {
				setCountries(countriesData)
			})
			.catch((error) => console.log(error))
	}, [])

	useEffect(() => {
		if (findValue) {
			const matches = countries.filter((country) =>
				country.name.common.toLowerCase().includes(findValue.toLowerCase())
			)
			setMatchedCountries(matches)
		}
	}, [findValue, countries])

	const handleChange = (event) => {
		setFindValue(event.target.value)
	}

	return (
		<div>
			<div>
				find countries
				<input
					type='text'
					onChange={handleChange}
				/>
			</div>
			{findValue && <Result countries={matchedCountries} />}
		</div>
	)
}

export default App
