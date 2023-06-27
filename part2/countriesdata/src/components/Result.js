import { useState, useEffect } from 'react'
import Country from './Country'

const Result = ({ countries }) => {
	const [countriesDisplay, setCountriesDisplay] = useState(
		countries.map((country) => ({ ...country, show: false }))
	)

	useEffect(() => {
		setCountriesDisplay(
			countries.map((country) => ({ ...country, show: false }))
		)
	}, [countries])

	const toggleShow = (countryToToggle) => {
		setCountriesDisplay((prevCountries) =>
			prevCountries.map((country) =>
				country.name.common === countryToToggle.name.common
					? { ...countryToToggle, show: !countryToToggle.show }
					: country
			)
		)
	}

	let content

	if (countries.length === 1) {
		content = <Country country={countries[0]} />
	} else if (countries.length <= 10) {
		content = (
			<>
				{countriesDisplay.map((country) => {
					return (
						<div key={country.name.common}>
							{country.name.common}
							<button onClick={() => toggleShow(country)}>
								{country.show ? 'hide' : 'show'}
							</button>
							{country.show && <Country country={country} />}
						</div>
					)
				})}
			</>
		)
	} else {
		content = <p>Too many matches, specify another filter</p>
	}

	return <div>{content}</div>
}

export default Result
