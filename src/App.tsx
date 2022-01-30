import { InformationCircleIcon } from '@heroicons/react/outline'
import { ChartBarIcon } from '@heroicons/react/outline'
import { useState, useEffect } from 'react'
import ReactGA from 'react-ga'
import { Alert } from './components/alerts/Alert'
import { Grid } from './components/grid/Grid'
import { Keyboard } from './components/keyboard/Keyboard'
import { AboutModal } from './components/modals/AboutModal'
import { InfoModal } from './components/modals/InfoModal'
import { StatsModal } from './components/modals/StatsModal'
import { WIN_MESSAGES } from './constants/strings'
import {
  isWordInWordList,
  isWinningWord,
  solution,
  splitWord,
} from './lib/words'
import { addStatsForCompletedGame, loadStats } from './lib/stats'
import { generateRedundancyWarning } from './lib/statuses'
import { WORDLEN } from './constants/wordlist'
import { GLOSSES } from './constants/glosses'
import {
  loadGameStateFromLocalStorage,
  saveGameStateToLocalStorage,
} from './lib/localStorage'

const ALERT_TIME_MS = 2100

function App() {
  const [currentGuess, setCurrentGuess] = useState('')
  const [isGameWon, setIsGameWon] = useState(false)
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false)
  const [infoMessage, setInfoMessage] = useState('')
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false)
  const [isNotEnoughLetters, setIsNotEnoughLetters] = useState(false)
  const [redundancyWarning, setRedundancyWarning] = useState('')
  const [justWarnedWord, setJustWarnedWord] = useState('')
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false)
  const [isWordNotFoundAlertOpen, setIsWordNotFoundAlertOpen] = useState(false)
  const [isGameLost, setIsGameLost] = useState(false)
  const [successAlert, setSuccessAlert] = useState('')
  const [winAlert, setWinAlert] = useState(false)
  const [guesses, setGuesses] = useState<string[]>(() => {
    const loaded = loadGameStateFromLocalStorage()
    if (loaded === null) {
      setIsInfoModalOpen(true)
    }
    if (loaded?.solution !== solution) {
      return []
    }
    const gameWasWon = loaded.guesses.includes(solution)
    if (gameWasWon) {
      setIsGameWon(true)
    }
    if (loaded.guesses.length === 6 && !gameWasWon) {
      setIsGameLost(true)
    }
    return loaded.guesses
  })

  const [stats, setStats] = useState(() => loadStats())

  useEffect(() => {
    saveGameStateToLocalStorage({ guesses, solution })
  }, [guesses])

  useEffect(() => {
    if (isGameWon) {
      setWinAlert(true)
      setTimeout(() => {
        setIsStatsModalOpen(true)
      }, ALERT_TIME_MS * 2)
      setTimeout(() => {
        setWinAlert(false)
      }, ALERT_TIME_MS * 4)
    }
    if (isGameLost) {
      setInfoMessage(
        `Today's word was "${solution}"` +
          (GLOSSES.hasOwnProperty(solution)
            ? `, meaning "${GLOSSES[solution]}"`
            : '') +
          '. Better luck tomorrow!'
      )
      setTimeout(() => {
        setIsStatsModalOpen(true)
      }, ALERT_TIME_MS)
    }
  }, [isGameWon, isGameLost])

  const onChar = (value: string) => {
    var nextGuess = currentGuess + value
    const p = currentGuess[currentGuess.length - 1]
    if (value === '~' && p === 'n') {
      nextGuess = currentGuess.slice(0, -1) + 'ñ'
    }
    if (value === '.' && 'ntdl'.includes(p)) {
      nextGuess = (currentGuess + '\u0323').normalize()
    }
    if (value === '.' && p === 'm') {
      nextGuess = (currentGuess + '\u0307').normalize()
    }
    if ('gk'.includes(value) && p === 'ṇ') {
      nextGuess =
        currentGuess.substring(0, currentGuess.length - 1) + 'ṅ' + value
    }
    if ('-_'.includes(value) && 'aiu'.includes(p)) {
      nextGuess = (currentGuess + '̄').normalize()
    }
    if ('.-_~'.includes(nextGuess[nextGuess.length - 1])) return
    var splitGuess = splitWord(nextGuess)
    if (splitGuess.length <= WORDLEN && guesses.length < 6 && !isGameWon) {
      setCurrentGuess(nextGuess)
    }
  }

  const onDelete = () => {
    if (justWarnedWord) {
      setJustWarnedWord('')
      setRedundancyWarning('')
    }
    if (currentGuess[currentGuess.length - 2] === 'ṅ')
      setCurrentGuess(currentGuess.slice(0, -2) + 'ṇ')
    else setCurrentGuess(currentGuess.slice(0, -1))
  }

  const onInfoModal = () => {
    setIsInfoModalOpen(true)
    ReactGA.event({
      category: 'modals',
      action: 'open',
      label: 'info',
    })
  }

  const onEnter = () => {
    if (isGameWon || isGameLost) {
      return
    }
    var splitGuess = splitWord(currentGuess)
    var ga_event = {
      category: 'gameplay',
      action: 'submit',
      label: currentGuess,
      metric1: guesses.length,
    }
    if (!(splitGuess.length === WORDLEN)) {
      setIsNotEnoughLetters(true)
      setJustWarnedWord('')
      setRedundancyWarning('')
      ga_event.action = 'short-submit'
      ReactGA.event(ga_event)
      return setTimeout(() => {
        setIsNotEnoughLetters(false)
      }, ALERT_TIME_MS)
    }

    if (!isWordInWordList(currentGuess)) {
      setIsWordNotFoundAlertOpen(true)
      ga_event.action = 'unfound-submit'
      ReactGA.event(ga_event)
      setJustWarnedWord('')
      setRedundancyWarning('')
      return setTimeout(() => {
        setIsWordNotFoundAlertOpen(false)
      }, ALERT_TIME_MS)
    }

    if (justWarnedWord !== currentGuess && stats.bestStreak <= 0) {
      var redundancy = generateRedundancyWarning(currentGuess, guesses)
      if (redundancy) {
        setRedundancyWarning(redundancy)
        setJustWarnedWord(currentGuess)
        ga_event.action = 'redundant-submit'
        ReactGA.event(ga_event)
        setTimeout(() => {
          setJustWarnedWord('')
        }, ALERT_TIME_MS * 2 + 500)
        return setTimeout(() => {
          setRedundancyWarning('')
        }, ALERT_TIME_MS * 2)
      }
    }
    setJustWarnedWord('')
    setRedundancyWarning('')

    const winningWord = isWinningWord(currentGuess)

    ga_event.action = 'valid-submit'
    ReactGA.event(ga_event)
    if (guesses.length < 6 && !isGameWon) {
      setGuesses([...guesses, currentGuess])
      setCurrentGuess('')

      if (winningWord) {
        setStats(addStatsForCompletedGame(stats, guesses.length))
        ReactGA.event({
          category: 'gameplay',
          action: 'win',
          metric1: guesses.length,
        })
        return setIsGameWon(true)
      }

      if (guesses.length === 5) {
        setStats(addStatsForCompletedGame(stats, guesses.length + 1))
        ReactGA.event({
          category: 'gameplay',
          action: 'loss',
          label: currentGuess,
          metric1: guesses.length,
        })
        setIsGameLost(true)
      } else if (!winningWord && GLOSSES.hasOwnProperty(currentGuess)) {
        setInfoMessage(`${currentGuess}: ${GLOSSES[currentGuess]}`)
        setTimeout(() => setInfoMessage(''), ALERT_TIME_MS * 2)
      }
    }
  }

  return (
    <div className="py-8 max-w-7xl mx-auto sm:px-6 lg:px-8">
      <div className="flex w-80 mx-auto items-center mb-8">
        <h1 className="text-xl grow font-bold">Pali Wordle</h1>
        <InformationCircleIcon
          className="mx-2 h-6 w-6 cursor-pointer"
          onClick={() => onInfoModal()}
        />
        <ChartBarIcon
          className="mx-2 h-6 w-6 cursor-pointer"
          onClick={() => {
            setIsStatsModalOpen(true)
            ReactGA.event({
              category: 'modals',
              action: 'open',
              label: 'stats',
            })
          }}
        />
      </div>
      <Grid guesses={guesses} currentGuess={currentGuess} />
      <Keyboard
        onChar={onChar}
        onDelete={onDelete}
        onEnter={onEnter}
        guesses={guesses}
      />
      <InfoModal
        isOpen={isInfoModalOpen}
        handleClose={() => {
          setIsInfoModalOpen(false)
          ReactGA.event({
            category: 'modals',
            action: 'close',
            label: 'info',
          })
        }}
      />
      <StatsModal
        isOpen={isStatsModalOpen}
        guesses={guesses}
        handleClose={() => {
          setIsStatsModalOpen(false)
          ReactGA.event({
            category: 'modals',
            action: 'close',
            label: 'stats',
          })
        }}
        gameStats={stats}
        isGameLost={isGameLost}
        isGameWon={isGameWon}
        handleShare={() => {
          ReactGA.event({
            category: 'social',
            action: 'share',
            label: 'clipboard',
          })
          setSuccessAlert('Game copied to clipboard')
          return setTimeout(() => setSuccessAlert(''), ALERT_TIME_MS)
        }}
      />
      <AboutModal
        isOpen={isAboutModalOpen}
        handleClose={() => {
          setIsAboutModalOpen(false)
          ReactGA.event({
            category: 'modals',
            action: 'close',
            label: 'about',
          })
        }}
      />

      <button
        type="button"
        className="mx-auto mt-8 flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 select-none"
        onClick={() => {
          setIsAboutModalOpen(true)
          ReactGA.event({
            category: 'modals',
            action: 'open',
            label: 'about',
          })
        }}
      >
        About
      </button>

      <Alert message="Too short!" isOpen={isNotEnoughLetters} />
      <Alert message={redundancyWarning} isOpen={redundancyWarning !== ''} />
      <Alert
        message="That isn't in the PED..."
        isOpen={isWordNotFoundAlertOpen}
      />
      <Alert message={infoMessage} isOpen={infoMessage !== ''} variant="info" />
      <Alert
        message={successAlert}
        isOpen={successAlert !== ''}
        variant="success"
      />
      <Alert
        message={
          WIN_MESSAGES[Math.floor(Math.random() * WIN_MESSAGES.length)] +
          ` Today's word was "${solution}"` +
          (GLOSSES.hasOwnProperty(solution)
            ? `, meaning "${GLOSSES[solution]}"`
            : '') +
          '.'
        }
        isOpen={winAlert}
        variant="win"
      />
    </div>
  )
}

ReactGA.initialize('UA-159403467-2')
ReactGA.pageview('/wordle-pali')

export default App
