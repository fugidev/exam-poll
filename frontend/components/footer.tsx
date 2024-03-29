import { FaCodeBranch } from 'react-icons/fa'

import styles from 'styles/Footer.module.scss'

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <span>
        Exam Poll is{' '}
        <a
          href="https://codeberg.org/fugi/exam-poll"
          target="_blank"
          rel="noreferrer"
          className={styles.sourceLink}
        >
          Open Source
          <FaCodeBranch />
        </a>
      </span>
    </footer>
  )
}

export default Footer
