import { useRef } from 'react';
import { IoMdClose } from 'react-icons/io';
import { GetPoll, GetPollData } from 'types/getPoll';
import styles from 'styles/EditDialog.module.scss';
import CreatePollForm from './createPollForm';

export const useEditDialog = (): [
  ref: React.MutableRefObject<HTMLDialogElement>,
  open: () => void,
  close: () => void,
] => {
  const ref = useRef<HTMLDialogElement>(null);

  const open = () => ref.current.showModal();
  const close = () => ref.current;

  return [ref, open, close];
};

type EditDialogProps = {
  dialogRef: React.MutableRefObject<HTMLDialogElement>;
  pollData: GetPollData;
  setPollData: React.Dispatch<React.SetStateAction<GetPollData>>;
  editCode: string;
  idt: string;
};

const EditDialog: React.FC<EditDialogProps> = (props) => {
  const { dialogRef, pollData, setPollData, editCode, idt } = props;

  const submit = async (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();

    const form = e.target as typeof e.target & {
      title: { value: string };
      description: { value: string };
      duration: { value: string };
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASEURL}/editPoll`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        idt,
        title: form.title.value,
        description: form.description.value,
        edit: editCode
      })
    });

    const res: GetPoll = await response.json();

    if (res.Type == "failure") {
      alert(res.Error);
      return;
    }

    if (res.Type == "success") {
      setPollData(res.Data);
      dialogRef.current.close();
    }
  }

  return (
    <dialog
      ref={dialogRef}
      id={styles.editDialog}
      onClick={(e) => e.stopPropagation()}
    >
      <div className={styles.content}>
        <a
          role="button"
          tabIndex={0}
          title="close"
          className={styles.closeButton}
          onClick={() => dialogRef.current.close()}
        >
          <IoMdClose />
        </a>

        <div className={styles.wrapper}>
          <h3>Edit Poll</h3>

          <CreatePollForm
            edit
            onSubmit={submit}
            className={styles.form}
            title={pollData.title}
            description={pollData.description}
            duration={pollData.duration}
          />
        </div>
      </div>
    </dialog>
  )
};

export default EditDialog;
