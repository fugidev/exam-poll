import type { FormEventHandler } from 'react'

type Props = {
  onSubmit?: FormEventHandler<HTMLFormElement>
  className?: string
  voteOptions: string[]
}

const CastVoteForm: React.FC<Props> = ({
  onSubmit = () => {},
  className,
  voteOptions,
}) => {
  const options = voteOptions.map((item, i) => (
    <div key={i} className="radio">
      <input type="radio" name="vote" id={`option_${item}`} value={item} />
      <label htmlFor={`option_${item}`}>{item}</label>
    </div>
  ))

  return (
    <form onSubmit={onSubmit} className={className}>
      <div>{options}</div>
      <button type="submit">Vote</button>
    </form>
  )
}

export default CastVoteForm
