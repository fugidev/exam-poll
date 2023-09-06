import type { NextPage, GetServerSidePropsContext } from 'next'
import Head from 'next/head'
import Error from 'next/error'
import Moment from 'react-moment'
import React, { useState, useEffect } from 'react'
import ReactDOMServer from 'react-dom/server'
import { use100vh } from 'react-div-100vh'
import { nanoid } from 'nanoid'
import { FaPencilAlt } from 'react-icons/fa'
import styles from 'styles/Poll.module.scss'
import type { GetPoll, GetPollData } from 'types/getPoll'
import CastVoteForm from 'components/castVoteForm'
import VoteResults from 'components/voteResults'
import ShareLink from 'components/shareLink'
import EditDialog, { useEditDialog } from 'components/editDialog'


type Props = { data: GetPollData, idt?: string } & { errorCode: number, errorMsg?: string }

const Poll: NextPage<Props> = ({ data, idt, errorCode, errorMsg }) => {
  const checkTimerFinished = () => {
    if (!timerFinished && end_date < new Date()) setTimerFinished(true);
  }

  const castVote = async (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();

    const form = e.target as typeof e.target & {
      vote: { value: string };
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASEURL}/castVote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        idt: data.idt,
        // hack until fingerprint check is removed on the server side
        fingerprint: nanoid(),
        grade: form.vote.value
      })
    });

    const res: GetPoll = await response.json();
    console.log(res);

    if (res.Type == "failure") {
      const timeOfError = new Date();
      if (confirm(res.Error + "\n\nSend report?")) {
        let body = "timestamp: " + timeOfError.getTime();
        body += "\npollData: " + JSON.stringify(pollData);
        body += "\nres: " + JSON.stringify(res);
        window.open("mailto:me@fugi.dev?subject=Bug%20Report&body=" + encodeURI(body));
      }
      return
    }

    if (res.Type == "success") {
      window.localStorage.setItem(res.Data.idt, form.vote.value);
      setPollData(res.Data);
      setShowResults("focus");
      return
    }
  }

  const momentFn = (props: React.ComponentPropsWithoutRef<typeof Moment>) => {
    const comp = <Moment {...props} element="time" />
    return ReactDOMServer.renderToString(comp).replace(/<[^>]*>/g, '')
  }

  const [pollData, setPollData] = useState(data);
  const [timerFinished, setTimerFinished] = useState(false);
  const [editCode, setEditCode] = useState("");
  const [showResults, setShowResults] = useState<"no"|"yes"|"focus">("no");
  const [dialogRef, openDialog] = useEditDialog();
  const height = use100vh();
  const screenHeight = height ? `${height}px` : '100vh';

  /* componentDidMount */
  useEffect(() => {
    // check for edit code in url
    if (window.location.hash) setEditCode(window.location.hash.replace('#', ''));

    // check if user has already voted
    if (idt) {
      const vote = window.localStorage.getItem(idt);
      if (vote) setShowResults("yes");
    }
  }, [idt])

  if (errorCode) return <Error statusCode={errorCode} title={errorMsg} />

  const end_date = new Date(data.end_time * 1000);
  checkTimerFinished();

  return (
    <>
      <Head>
        <title>{pollData.title + ' | Exam Poll'}</title>
        <meta name="description" content={pollData.description} />
      </Head>

      <style jsx>{`
        main {
          --screen-height: ${screenHeight};
        }
      `}</style>

      {!!editCode && (
        <EditDialog
          dialogRef={dialogRef}
          pollData={pollData}
          setPollData={setPollData}
          editCode={editCode}
          idt={idt}
        />
      )}

      <main className={styles.main}>
        <div className={styles.headingWrapper}>
          <h1>{pollData.title}</h1>

          {!!editCode && (
            <a
              role="button"
              title="Edit Poll"
              className={styles.editButton}
              onClick={() => openDialog()}
              tabIndex={0}
            >
              <FaPencilAlt />
            </a>
          )}
        </div>

        {pollData.description.length > 0 && <p>{pollData.description}</p>}

        {timerFinished ? (
          <p>This poll has ended.</p>
        ) : (
          <p>
            {'This poll ends ' +
              momentFn({
                fromNow: true,
                date: end_date,
                onChange: checkTimerFinished,
              }) +
              '.'}
          </p>
        )}

        {editCode && typeof window.location !== 'undefined' && <ShareLink />}

        {!timerFinished && showResults === "no" ? (
          <>
            <CastVoteForm
              onSubmit={castVote}
              className={styles.voteForm}
              voteOptions={Object.keys(data.results)}
            />
            <button
              className={styles.resultButton}
              onClick={() => setShowResults("focus")}
            >
              Show Results
            </button>
          </>
        ) : (
          <VoteResults results={pollData.results} initalFocus={showResults === "focus"} />
        )}
      </main>
    </>
  )
}

export async function getServerSideProps({ res, params }: GetServerSidePropsContext<{ idt: string }>) {

  let errorCode: number = 500;
  let errorMsg: string = "";

  if (params) {
    const request = await fetch(`${process.env.API_BASEURL}/getPoll/${params.idt}`);
    const resp: GetPoll = await request.json();
    // console.log(resp);

    if (resp.Type === "success") {
      const data = resp.Data;

      return {
        props: { data, idt: params.idt },
      }
    } else {
      errorCode = resp.ErrorCode;
      errorMsg = resp.Error;
    }
  } else {
    errorCode = 404;
  }

  res.statusCode = errorCode;

  if (errorMsg) return {
    props: { errorCode, errorMsg },
  }

  return {
    props: { errorCode },
  }
}

export default Poll
