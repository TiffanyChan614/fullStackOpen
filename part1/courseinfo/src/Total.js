const Sum = ({ parts }) => {
	const total = parts.reduce((sum, part) => (sum += part.exercises), 0)
	return (
		<p>
			<b>total of {total} exercises</b>
		</p>
	)
}

export default Sum
