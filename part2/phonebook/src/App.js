import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import AddForm from './components/AddForm'
import Numbers from './components/Numbers'
import phonebookService from './services/phonebook'
import Notification from './components/Notification'

const App = () => {
	const [persons, setPersons] = useState([])
	const [newName, setNewName] = useState('')
	const [newNumber, setNewNumber] = useState('')
	const [search, setSearch] = useState('')
	const [shownPersons, setShownPersons] = useState(persons)
	const [message, setMessage] = useState({ text: null, status: null })

	useEffect(() => {
		phonebookService.getAll().then((initialPersons) => {
			setPersons(initialPersons)
			updateShownPersons('', initialPersons)
		})
	}, [])

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
		const personToUpdate = persons.find((person) => person.name === newName)
		if (personToUpdate) {
			if (
				window.confirm(
					`${newName} is already added to phonebook, replace the old number with a new one?`
				)
			) {
				const personObject = {
					...personToUpdate,
					number: newNumber,
				}
				phonebookService
					.update(personToUpdate.id, personObject)
					.then((returnPerson) => {
						const newPersons = persons
							.filter((person) => person.name !== personToUpdate.name)
							.concat(returnPerson)
						setPersons(newPersons)
						updateShownPersons('', newPersons)
					})
				setMessage({
					text: `Updated ${newName}'s contact`,
					status: 1,
				})
			}
		} else {
			const personObject = {
				name: newName,
				number: newNumber,
			}
			phonebookService.create(personObject).then((returnPerson) => {
				setPersons(persons.concat(returnPerson))
				updateShownPersons('', persons.concat(returnPerson))
			})
			setMessage({ text: `Added ${newName}`, status: 1 })
		}
		setNewName('')
		setNewNumber('')
		setSearch('')
	}

	const deletePerson = (id) => {
		const personToDelete = persons.find((person) => person.id === id)
		if (personToDelete) {
			if (window.confirm(`Delete ${personToDelete.name}?`)) {
				phonebookService
					.deleteContact(personToDelete.id)
					.then(() => {
						const newPersons = persons.filter(
							(person) => person.id !== personToDelete.id
						)
						setPersons(newPersons)
						updateShownPersons(search, newPersons)
						setMessage({ text: `Deleted ${personToDelete.name}`, status: 1 })
					})
					.catch(() =>
						setMessage({
							text: `Information of ${personToDelete.name} has already been removed from server`,
							status: 0,
						})
					)
			}
		}
	}

	return (
		<div>
			<div>
				<h2>Phonebook</h2>
				<Notification
					text={message.text}
					status={message.status}
				/>
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
				<Numbers
					shownPersons={shownPersons}
					deletePerson={deletePerson}
				/>
			</div>
		</div>
	)
}

export default App
