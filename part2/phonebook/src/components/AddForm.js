const AddForm = ({
	addPerson,
	handleChangeName,
	handleChangeNumber,
	newName,
	newNumber,
}) => {
	return (
		<form onSubmit={addPerson}>
			<div>
				name:{' '}
				<input
					value={newName}
					onChange={handleChangeName}
				/>
			</div>
			<div>
				number:{' '}
				<input
					value={newNumber}
					onChange={handleChangeNumber}
				/>
			</div>
			<div>
				<button type='submit'>add</button>
			</div>
		</form>
	)
}

export default AddForm
