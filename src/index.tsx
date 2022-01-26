import React from 'react'
import ReactDOM from 'react-dom'
import ReactGA from 'react-ga'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'

function round(num: number): number {
  const f = Math.floor(num)
  return Math.random() + f < num ? Math.ceil(num) : f
}

const REPORT = Math.random() < 0.05

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(({ id, name, value }) => {
  if (REPORT)
    ReactGA.event({
      category: 'Web Vitals',
      action: name,
      label: id,
      nonInteraction: true,
      value: round(name === 'CLS' ? value * 1000 : value),
    })
})
