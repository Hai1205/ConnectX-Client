import React from 'react'
import Posts from '../../components/common/Posts'

export default function BookmarkPage() {
  return (
    <div className='flex-[4_4_0] mr-auto border-r border-gray-700 min-h-screen'>
      <Posts feedType={"bookmarkedPost"} />
    </div>
  )
}
