import type { FormEventHandler } from 'react'

type Props = {
  onSubmit?: FormEventHandler<HTMLFormElement>
  className?: string
  edit?: boolean
  title?: string
  description?: string
  duration?: string
}

const CreatePollForm: React.FC<Props> = ({
  onSubmit = () => {},
  className,
  edit = false,
  title,
  description,
  duration = '',
}) => (
  <form onSubmit={onSubmit} className={className}>
    {edit && <label htmlFor="poll_title">Title</label>}
    <input
      type="text"
      id="poll_title"
      name="title"
      defaultValue={title}
      placeholder={!edit ? 'Title' : ''}
      required
    />

    {edit && <label htmlFor="poll_description">Description</label>}
    <input
      type="text"
      id="poll_description"
      name="description"
      defaultValue={description}
      placeholder={!edit ? 'Description' : ''}
    />

    {!edit && (
      <select
        id="poll_duration"
        name="duration"
        defaultValue={duration}
        disabled={edit}
        required
      >
        <option value="" disabled hidden>
          Duration
        </option>
        <option value="4h">4 hours</option>
        <option value="8h">8 hours</option>
        <option value="12h">12 hours</option>
        <option value="1d">1 day</option>
        <option value="2d">2 days</option>
        <option value="4d">4 days</option>
        <option value="7d">7 days</option>
      </select>
    )}

    <button type="submit">{edit ? 'Save' : 'Create Poll'}</button>
  </form>
)

export default CreatePollForm
