const Notification = ({ message, status }) => {
  if (message === null) {
    return null
  }

  const styles = {
    borderColor: status === 'error' ? 'red' : 'green',
    color: status === 'error' ? 'red' : 'green',
    backgroundColor: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    borderWidth: 3,
    padding: 10,
    marginBottom: 10,
  }

  return (
    <div
      className='Notification'
      style={styles}>
      {message}
    </div>
  )
}

export default Notification
