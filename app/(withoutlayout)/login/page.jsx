import React, { Suspense } from 'react' // १. Suspense इंपोर्ट करा
import Login from '../../Screens/Login'

const LoginPage = () => {
  return (
    <div>
      {/* २. Login कंपोनंटला Suspense मध्ये रॅप करा */}
      <Suspense fallback={<div>Loading...</div>}>
        <Login />
      </Suspense>
    </div>
  )
}

export default LoginPage