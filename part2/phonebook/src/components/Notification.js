const Notification = ({ text, status }) => {
	const notificationStyle = {
		color: status === 1 ? 'green' : 'red',
		background: 'lightgrey',
		fontSize: 20,
		borderStyle: 'solid',
		borderRadius: 5,
		padding: 10,
		marginBottom: 10,
	}

	if (text === null) {
		return null
	}

	return (
		<div
			className='msg'
			style={notificationStyle}>
			{text}
		</div>
	)
}

export default Notification
