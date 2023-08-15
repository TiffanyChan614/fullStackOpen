import { useSelector, useDispatch } from 'react-redux'
import VisibilityFilter from './VisibilityFilter'
import { voteChange } from '../reducers/anecdoteReducer'
import { notificationChange } from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const anecdotes = useSelector((state) => state.anecdotes)
  const filter = useSelector((state) => state.filter)
  const orderedAnecdotes = [...anecdotes].sort((a, b) => b.votes - a.votes)
  const filteredAnecdotes =
    filter === ''
      ? orderedAnecdotes
      : orderedAnecdotes.filter((anecdote) => anecdote.content.includes(filter))
  const dispatch = useDispatch()

  const vote = (id) => {
    dispatch(voteChange(id))
    dispatch(
      notificationChange(
        `you voted '${anecdotes.find((n) => n.id === id).content}'`
      )
    )
    setTimeout(() => {
      dispatch(notificationChange(''))
    }, 5000)
  }

  return (
    <>
      <VisibilityFilter />
      {filteredAnecdotes?.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      ))}
    </>
  )
}

export default AnecdoteList
