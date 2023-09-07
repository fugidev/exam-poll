import ResultBarChart from 'components/resultsBarChart'

type Props = {
  results: {
    [option: string]: number
  }
  initalFocus: boolean
}

const VoteResults: React.FC<Props> = ({ results, initalFocus }) => {
  const voteCount = Object.values(results).reduce((a, b) => a + b, 0)

  const failureRate = Math.round((results['5.0'] / voteCount) * 100)

  if (voteCount === 0) {
    return <p>Nobody has voted (yet).</p>
  }

  return (
    <>
      <ResultBarChart results={results} initialFocus={initalFocus} />

      <p>{`Total Votes: ${voteCount}`}</p>
      <p>{`Failure Rate: ${failureRate}%`}</p>
    </>
  )
}

export default VoteResults
