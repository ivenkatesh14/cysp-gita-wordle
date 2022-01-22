import { solution, splitWord } from './words'
import { WORDLEN } from '../constants/wordlist'

export type CharStatus = 'absent' | 'present' | 'mismarked' | 'correct'

export type CharValue =
  | 'ฎ'
  | 'ฑ'
  | 'ธ'
  | 'ณ'
  | 'ญ'
  | 'ฐ'
  | 'ฅ'
  | 'ฤ'
  | 'ฆ'
  | 'ฏ'
  | 'โ'
  | 'ฌ'
  | 'ษ'
  | 'ศ'
  | 'ซ'
  | 'ฉ'
  | 'ฮ'
  | 'ฒ'
  | 'ฬ'
  | 'ฦ'
  | 'ภ'
  | 'ถ'
  | 'ค'
  | 'ต'
  | 'จ'
  | 'ข'
  | 'ช'
  | 'ไ'
  | 'ำ'
  | 'พ'
  | 'ะ'
  | 'ร'
  | 'น'
  | 'ย'
  | 'บ'
  | 'ล'
  | 'ฃ'
  | 'ฟ'
  | 'ห'
  | 'ก'
  | 'ด'
  | 'เ'
  | 'า'
  | 'ส'
  | 'ว'
  | 'ง'
  | 'ผ'
  | 'ป'
  | 'แ'
  | 'อ'
  | 'ท'
  | 'ม'
  | 'ใ'
  | 'ฝ'
  | 'ุ'
  | 'ึ'
  | 'ั'
  | 'ี'
  | '้'
  | '่'
  | 'ิ'
  | 'ื'
  | 'ู'
  | '๊'
  | '็'
  | '๋'
  | '์';
  
export const statusForLetter = (
  letter: string,
  position: number,
  split_solution: string[]
): CharStatus => {
  if (split_solution[position] === letter) return 'correct';
  if (split_solution[position][0] === letter[0]) return 'mismarked';
  if (split_solution.join('').includes(letter[0])) return 'present';
  return 'absent';
}

export const getStatuses = (
  guesses: string[]
): { [key: string]: CharStatus } => {
  const split_solution = splitWord(solution)
  const charObj: { [key: string]: CharStatus } = {}
  for (const guess of guesses) {
    if (!guess) break;
    const word = splitWord(guess);
    for (var i = 0; i < word.length; i++) {
      const letter = word[i];
      const status = statusForLetter(letter, i, split_solution);
      switch(status) {
        case 'absent':
          charObj[letter[0]] = 'absent';
          continue;
        case 'correct':
          for (const c of letter) { charObj[c] = 'correct'; }
          continue;
        case 'mismarked':
          if (charObj[letter[0]] !== 'correct') {
            charObj[letter[0]] = 'mismarked';
          }
          continue;
        case 'present':
          if (!charObj[letter[0]]) {
            charObj[letter[0]] = 'present';
          }
      }
    }
  }

  return charObj
}

export const getGuessStatuses = (guess: string): CharStatus[] => {
   var answer = splitWord(solution);
   const splitguess = splitWord(guess);
   var placed = splitguess.map((letter, i) => statusForLetter(letter, i, answer));
   for(var i = 0; i < answer.length; i++) {
     if (placed[i] === 'mismarked' || placed[i] === 'correct') {
       answer[i] = "counted";
     }
   }
   var statuses = splitguess.map((letter, i) => { 
      var ret = statusForLetter(letter, i, answer);
      if (ret === 'present') {
        answer[answer.findIndex(l => l[0]===letter[0])] = "accounted for";
      }
      return ret;
   });
   for (i = 0; i < statuses.length; i++) {
     if (answer[i] === "counted") {
       statuses[i] = placed[i];
     }
   }
   return statuses;
}

export const generateRedundancyWarning = (current_guess: string, past_guesses: string[]): string => {
  var ret = '';
  const splitguess = splitWord(current_guess);
  const answer = splitWord(solution);
  for (const past_guess of past_guesses) {
    const splitpast = splitWord(past_guess);
    for (var i = WORDLEN-1; i>=0; i--) {
        if (!solution.includes(splitpast[i][0]) && current_guess.includes(splitpast[i][0])) {
            ret = "รู้ว่า \"" + splitpast[i][0] + "\" ไม่อยู่ในคำแล้ว";
        }
        if (solution.includes(splitpast[i][0]) && answer[i][0] !== splitpast[i][0] && splitguess[i][0] === splitpast[i][0]) {
            ret = "\"" + splitguess[i][0] + "\" ควรจะอยู่ที่อื่น";
        }
        // Hard Mode Checks
        if (!ret && answer[i] === splitpast[i] && splitguess[i] !== answer[i]) {
            ret = "อักขระที่ " + (i+1) + " จำเป็น \"" + answer[i] + "\"";
        }
        if (!ret && answer[i][0] === splitpast[i][0] && splitguess[i][0] !== answer[i][0]){
            ret = "อักขระที่ " + (i+1) + " ต้องมี \"" + answer[i][0] + "\"";
        }
        if (!ret && solution.includes(splitpast[i][0]) && !current_guess.includes(splitpast[i][0])) {
            ret = "การเดาควรมี \"" + splitpast[i][0] + "\"";
        }
    }
  }
  if (!ret) return '';
  return 'ระวัง! ' + ret + ' กด ⏎ อีกครั้งเพื่อส่งถึงกระนั้น';
}

