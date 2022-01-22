import { InformationCircleIcon } from '@heroicons/react/outline'
import { ChartBarIcon } from '@heroicons/react/outline'
import { useState, useEffect } from 'react'
import ReactGA from 'react-ga4'
import { Alert } from './components/alerts/Alert'
import { Grid } from './components/grid/Grid'
import { Keyboard } from './components/keyboard/Keyboard'
import { AboutModal } from './components/modals/AboutModal'
import { InfoModal } from './components/modals/InfoModal'
import { StatsModal } from './components/modals/StatsModal'
import { WIN_MESSAGES } from './constants/strings'
import { isWordInWordList, isWinningWord, solution, splitWord } from './lib/words'
import { addStatsForCompletedGame, loadStats } from './lib/stats'
import { generateRedundancyWarning } from './lib/statuses'
import { WORDLEN } from './constants/wordlist'
import {
  loadGameStateFromLocalStorage,
  saveGameStateToLocalStorage,
} from './lib/localStorage'

const ALERT_TIME_MS = 2100

function App() {
  const [currentGuess, setCurrentGuess] = useState('')
  const [isGameWon, setIsGameWon] = useState(false)
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false)
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false)
  const [isNotEnoughLetters, setIsNotEnoughLetters] = useState(false)
  const [redundancyWarning, setRedundancyWarning] = useState('')
  const [justWarnedWord, setJustWarnedWord] = useState('')
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false)
  const [isShifted, setIsShifted] = useState(false)
  const [isWordNotFoundAlertOpen, setIsWordNotFoundAlertOpen] = useState(false)
  const [isGameLost, setIsGameLost] = useState(false)
  const [successAlert, setSuccessAlert] = useState('')
  const [guesses, setGuesses] = useState<string[]>(() => {
    const loaded = loadGameStateFromLocalStorage()
    if (loaded === null) {
      setIsInfoModalOpen(true);
      ReactGA.event('tutorial_begin');
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
      setSuccessAlert(
        WIN_MESSAGES[Math.floor(Math.random() * WIN_MESSAGES.length)]
      )
      setTimeout(() => {
        setSuccessAlert('')
        setIsStatsModalOpen(true)
      }, ALERT_TIME_MS)
    }
    if (isGameLost) {
      setTimeout(() => {
        setIsStatsModalOpen(true)
      }, ALERT_TIME_MS)
    }
  }, [isGameWon, isGameLost])

  const onChar = (value: string) => {
    var splitGuess = splitWord(currentGuess+value);
    if (splitGuess.length <= WORDLEN && guesses.length < 6 && !isGameWon) {
      setCurrentGuess(`${currentGuess}${value}`)
    }
  }

  const onDelete = () => {
    if (justWarnedWord) {
      setJustWarnedWord('')
      setRedundancyWarning('')
    }
    setCurrentGuess(currentGuess.slice(0, -1))
  }

  const onShift = () => {
    setIsShifted(!isShifted)
  }

  const onInfoModal = () => {
    setIsInfoModalOpen(true);
    ReactGA.event({
      category: "modals",
      action: "open",
      label: "info"
    });
  }

  const onEnter = () => {
    if (isGameWon || isGameLost) {
      return
    }
    var splitGuess = splitWord(currentGuess);
    var ga_event = {
        category: "gameplay",
        action: "submit",
        label: currentGuess,
        dimension: {
            "guess_number": guesses.length
        }
    };
    if (!(splitGuess.length === WORDLEN)) {
      setIsNotEnoughLetters(true);
      setJustWarnedWord('')
      setRedundancyWarning('')
      ga_event.action = 'short-submit';
      ReactGA.event(ga_event);
      return setTimeout(() => {
        setIsNotEnoughLetters(false)
      }, ALERT_TIME_MS)
    }

    if (!isWordInWordList(currentGuess)) {
      setIsWordNotFoundAlertOpen(true)
      ga_event.action = 'unfound-submit';
      ReactGA.event(ga_event);
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

    ga_event.action = 'valid-submit';
    ReactGA.event(ga_event);
    if (guesses.length < 6 && !isGameWon) {
      setGuesses([...guesses, currentGuess])
      setCurrentGuess('')

      if (winningWord) {
        setStats(addStatsForCompletedGame(stats, guesses.length))
        ReactGA.event('level_end', { success: true });
        return setIsGameWon(true)
      }

      if (guesses.length === 5) {
        setStats(addStatsForCompletedGame(stats, guesses.length + 1))
        ReactGA.event("level_end", { success: false });
        setIsGameLost(true)
      }
    }
  }

  return (
    <div className="py-8 max-w-7xl mx-auto sm:px-6 lg:px-8">
      <div className="flex w-80 mx-auto items-center mb-8">
        <h1 className="text-xl grow font-bold">Wordle ไทย</h1>
        <InformationCircleIcon
          className="mx-2 h-6 w-6 cursor-pointer"
          onClick={() => onInfoModal()}
        />
        <ChartBarIcon
          className="mx-2 h-6 w-6 cursor-pointer"
          onClick={() => {
            setIsStatsModalOpen(true);
            ReactGA.event({
              category: "modals",
              action: "open",
              label: "stats"
            });
          }}
        />
      </div>
      <Grid guesses={guesses} currentGuess={currentGuess} />
      <Keyboard
        onChar={onChar}
        onDelete={onDelete}
        onEnter={onEnter}
        onShift={onShift}
        guesses={guesses}
        isShifted={isShifted}
      />
      <InfoModal
        isOpen={isInfoModalOpen}
        handleClose={() => {
          setIsInfoModalOpen(false);
          ReactGA.event({
            category: "modals",
            action: "close",
            label: "info"
          });
        }}
      />
      <StatsModal
        isOpen={isStatsModalOpen}
        guesses={guesses}
        handleClose={() => {
          setIsStatsModalOpen(false);
          ReactGA.event({
            category: "modals",
            action: "close",
            label: "stats"
          });
        }}
        gameStats={stats}
        isGameLost={isGameLost}
        isGameWon={isGameWon}
        handleShare={() => {
            ReactGA.event("share");
            setSuccessAlert("คัดลอกแล้ว");
            return setTimeout(() => setSuccessAlert(''), ALERT_TIME_MS);
        }}
      />
      <AboutModal
        isOpen={isAboutModalOpen}
        handleClose={() => {
          setIsAboutModalOpen(false);
          ReactGA.event({
            category: "modals",
            action: "close",
            label: "about"
          });
        }}
      />

      <button
        type="button"
        className="mx-auto mt-8 flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 select-none"
        onClick={() => {
          setIsAboutModalOpen(true);
          ReactGA.event({
            category: "modals",
            action: "open",
            label: "about"
          });
        }}
      >
        เกี่ยวกับเกมนี้
      </button>

      <Alert message="ตัวหนังสือไม่ครบ" isOpen={isNotEnoughLetters} />
      <Alert message={redundancyWarning} isOpen={redundancyWarning !== ''} />
      <Alert message="ไม่มีคำนี้" isOpen={isWordNotFoundAlertOpen} />
      <Alert
        message={`วั้ย อ่อนจุง คำตอบคือ  "${solution}"`}
        isOpen={isGameLost}
        variant="info"
      />
      <Alert
        message={successAlert}
        isOpen={successAlert !== ''}
        variant="success"
      />
    </div>
  )
}

ReactGA.initialize("G-FSN024QQN6");
ReactGA.send("pageview");

export default App
