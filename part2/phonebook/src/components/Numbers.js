const Numbers = ({ shownPersons, deletePerson }) => {
	return (
		<>
			{shownPersons.map((person) => (
				<p key={person.name}>
					{person.name} {person.number}
					<button onClick={() => deletePerson(person.id)}>delete</button>
				</p>
			))}
		</>
	)
}

export default Numbers
