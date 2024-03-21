
import { useState } from 'react'
import { ReactComponent as Logo } from './logo.svg'
import Navbar from './components/Navbar'
import {ToastContainer} from 'react-toastify'
import {Routes,Route} from 'react-router-dom'
import Home from './components/Home'
import Login from './components/Login'
import {AuthProvider} from './context/authcontext'
import './app.css'

export function App () {
  return (
	<AuthProvider>
		<div className="App">
			<Navbar />
			<ToastContainer />
			<div className="container mt-4">
				<Routes>
				  <Route exact path="/" element={<Home />} />
				  <Route exact path="/login" element={<Login />} />
				</Routes>
			</div>
			<footer className="text-center text-lg-start bg-light text-muted mt-4">
					<div className="text-center p-4">
					© Copyright - 
					<a target="_blank" className="text-reset fw-bold text-decoration-none" href="https://twitter.com" >
						Paramanand Kumar
					</a>
				</div>
			</footer>
		</div>
	</AuthProvider>
  )
}
