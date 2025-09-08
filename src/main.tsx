import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<form action="." method="GET"> <input type="text" name="console" placeholder="Console" id="consoleSearch"/> </form>
		<h1>ROM-DB</h1>
		<App/>
	</React.StrictMode>,
)