const Filter = ({ handleInput, searchValue }) => {
	return (
		<div>
			filter shown with{' '}
			<input
				value={searchValue}
				onChange={handleInput}
			/>
		</div>
	)
}

export default Filter
