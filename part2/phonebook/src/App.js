import { useState } from 'react'
import Filter from './components/Filter'
import AddForm from './components/AddForm'
import Numbers from './components/Numbers'

const App = () => {
	const [persons, setPersons] = useState([
		{ name: 'Arto Hellas', number: '040-1234567' },
	])
	const [newName, setNewName] = useState('')
	const [newNumber, setNewNumber] = useState('')
	const [search, setSearch] = useState('')
	const [shownPersons, setShownPersons] = useState(persons)

	const handleChangeName = (event) => {
		setNewName(event.target.value)
	}

	const handleChangeNumber = (event) => {
		setNewNumber(event.target.value)
	}

	const updateShownPersons = (searchValue, personsToShow) => {
		if (searchValue) {
			setShownPersons(
				personsToShow.filter((person) =>
					person.name.toLowerCase().includes(searchValue.toLowerCase())
				)
			)
		} else {
			setShownPersons(personsToShow)
		}
	}

	const handleChangeSearch = (event) => {
		const searchValue = event.target.value
		setSearch(searchValue)
		updateShownPersons(searchValue, persons)
	}

	const addPerson = (event) => {
		event.preventDefault()
		if (persons.find((person) => person.name === newName)) {
			alert(`${newName} is already added to phonebook`)
		} else {
			const updatedPersons = [...persons, { name: newName, number: newNumber }]
			setPersons(updatedPersons)
			updateShownPersons(search, updatedPersons)
		}
	}

	return (
		<div>
			<div>
				<h2>Phonebook</h2>
				<Filter
					searchValue={search}
					handleInput={handleChangeSearch}
				/>
			</div>
			<div>
				<h2>add a new</h2>
				<AddForm
					addPerson={addPerson}
					handleChangeName={handleChangeName}
					handleChangeNumber={handleChangeNumber}
					newName={newName}
					newNumber={newNumber}
				/>
			</div>
			<div>
				<h2>Numbers</h2>
				<Numbers shownPersons={shownPersons} />
			</div>
		</div>
	)
}

export default App
