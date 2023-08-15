import { useSelector, useDispatch } from 'react-redux'
import VisibilityFilter from './VisibilityFilter'

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
    console.log('vote', id)
    dispatch({ type: 'VOTE', payload: { id } })
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
