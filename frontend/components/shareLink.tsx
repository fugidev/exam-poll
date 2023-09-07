import { useRef, useState } from 'react'
import { FaCheck, FaCopy } from 'react-icons/fa'

import styles from 'styles/ShareLink.module.scss'

const ShareLink: React.FC = () => {
  const [copyConfirmationTimeout, setCopyConfirmationTimeout] =
    useState<ReturnType<typeof setTimeout>>(null)
  const shareRef = useRef<HTMLInputElement>(null)

  const copyURL: React.MouseEventHandler<
    HTMLInputElement | HTMLAnchorElement
  > = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    const input = shareRef.current

    input.select()

    navigator.clipboard.writeText(input.value).then(() => {
      if (copyConfirmationTimeout !== null)
        clearTimeout(copyConfirmationTimeout)

      const timeoutId = setTimeout(() => {
        setCopyConfirmationTimeout(null)
      }, 4000)

      setCopyConfirmationTimeout(timeoutId)
    })
  }

  return (
    <div>
      <label htmlFor="sharePollLink">Share a link to this poll:</label>
      <div className={styles.sharePollWrapper}>
        <a
          role="button"
          className={styles.copyButton}
          title={
            copyConfirmationTimeout ? 'Link copied' : 'Copy link to clipboard'
          }
          onClick={copyURL}
          style={{
            color: copyConfirmationTimeout && 'limegreen',
          }}
        >
          {copyConfirmationTimeout ? <FaCheck /> : <FaCopy />}
        </a>

        <input
          type="text"
          id="sharePollLink"
          className={styles.shareURL}
          ref={shareRef}
          readOnly
          defaultValue={window.location.href.replace(location.hash, '')}
          onClick={copyURL}
        />
      </div>
    </div>
  )
}

export default ShareLink
