'use client'

const LoginButton: React.FC = () => {
  const googleLogin = () => {
    window.location.href = '/api/auth/login'
  }
  return <button onClick={googleLogin}>Login With Google</button>
}

export default LoginButton
