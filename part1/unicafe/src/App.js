import { useState } from 'react'
import Button from './components/Button'
import StatisticLine from './components/StatisticLine'

const Statistics = (props) => {
	const all = props.good + props.neutral + props.bad
	const average = (props.good - props.bad) / all
	const positive = (props.good / all) * 100

	return (
		<div>
			<h1>statistics</h1>
			{all === 0 ? (
				<p>No feedback given</p>
			) : (
				<table>
					<tbody>
						<StatisticLine
							text='good'
							value={props.good}
						/>
						<StatisticLine
							text='neutral'
							value={props.neutral}
						/>
						<StatisticLine
							text='bad'
							value={props.bad}
						/>
						<StatisticLine
							text='all'
							value={all}
						/>
						<StatisticLine
							text='average'
							value={average}
						/>
						<StatisticLine
							text='positive'
							value={positive}
						/>
					</tbody>
				</table>
			)}
		</div>
	)
}

const App = () => {
	const [good, setGood] = useState(0)
	const [neutral, setNeutral] = useState(0)
	const [bad, setBad] = useState(0)

	const handleGoodClick = () => {
		setGood((prevGood) => prevGood + 1)
	}

	const handleNeutralClick = () => {
		setNeutral((prevNeutral) => prevNeutral + 1)
	}

	const handleBadClick = () => {
		setBad((prevBad) => prevBad + 1)
	}

	const all = good + neutral + bad
	const average = (good - bad) / all
	const positive = (good / all) * 100

	return (
		<div>
			<h1>give feedback</h1>
			<Button
				handleClick={handleGoodClick}
				text='good'
			/>
			<Button
				handleClick={handleNeutralClick}
				text='neutral'
			/>
			<Button
				handleClick={handleBadClick}
				text='bad'
			/>
			<Statistics
				good={good}
				neutral={neutral}
				bad={bad}
			/>
		</div>
	)
}

export default App
