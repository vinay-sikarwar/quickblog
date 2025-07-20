import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { Link } from 'react-router-dom'

const Login = () => {
    const { login } = useAuth()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handlesubmit = async(e)=>{
        e.preventDefault()
        setError('')
        setIsLoading(true)
        
        const result = await login(email, password)
        
        if (!result.success) {
            setError(result.error)
        }
        
        setIsLoading(false)
    }
    return (
    <div className='flex justify-center items-center h-screen'> 
        <div className=' w-full max-w-sm p-6 max-md:m-6 border border-primary/30 shadow-xl shadow-primary/15 rounded-lg'>
            <div className=' flex flex-col items-center justify-center'>
                <div className=' w-full py-6 text-center'>
                    <h1 className=' text-3xl font-bold'><span className=' text-primary'>Admin</span> Login</h1>
                    <p className=' font-light'>Enter your credentials to access the admin panel</p>
                </div>
                {error && (
                    <div className=' w-full p-3 mb-4 text-sm text-red-700 bg-red-100 border border-red-300 rounded'>
                        {error}
                    </div>
                )}
                <form onSubmit={handlesubmit} className=' mt-6 w-full sm:max-w-md text-gray-600'>
                    <div className=' flex flex-col'>
                        <label> Email </label>
                        <input type="email" required placeholder='Your email id' className=' border-b-2 border-gray-300 p-2 outline-none mb-6' onChange={e=>setEmail(e.target.value)} value={email}/>
                    </div>
                    <div className=' flex flex-col'>
                        <label> Password </label>
                        <input type="password" required placeholder='Your password' className=' border-b-2 border-gray-300 p-2 outline-none mb-6' onChange={e=>setPassword(e.target.value)} value={password}/>
                    </div>
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className=' w-full py-3 font-medium bg-primary text-white rounded cursor-pointer hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed'
                    > 
                        {isLoading ? 'Logging in...' : 'Login'} 
                    </button>
                </form>
                <div className=' mt-4 text-center text-sm text-gray-600'>
                    Don't have an account? <Link to="/signup" className=' text-primary hover:underline'>Sign up here</Link>
                </div>
            </div>
        </div>
    </div>
)
}

export default Login
