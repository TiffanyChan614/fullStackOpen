const Numbers = ({ shownPersons }) => {
	return (
		<>
			{shownPersons.map((person) => (
				<p key={person.name}>
					{person.name} {person.number}
				</p>
			))}
		</>
	)
}

export default Numbers
