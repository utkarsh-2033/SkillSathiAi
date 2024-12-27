import React from 'react'
import { Outlet , Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectUser } from '../../redux/slices/userSlice'

const PrivateProfile = () => {
    const user=useSelector(selectUser)
  return (
    <div>
      {user?<Outlet/> : <Navigate to={'/signin'}/>}
    </div>
  )
}

export default PrivateProfile;
