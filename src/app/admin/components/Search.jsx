import React from 'react'
import {IoSearchOutline} from 'react-icons/io5'

const Search = (props) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && props.onClick) {
      props.onClick();
    }
  }

  return (
    <div 
      className={`search bg-gray-200 w-full h-[45px] md:h-[50px] rounded-md flex px-4 relative border border-[rgba(0,0,0,0.1)] hover:border-[rgba(0,0,0,0.3)]`}
      style={{ maxWidth: props.width || '400px' }}
    >
      <input
        type="text"
        placeholder={props.placeholder}
        className="w-full h-full bg-transparent outline-none pr-10"
        onChange={props.onChange}
        value={props.value}
        onKeyDown={handleKeyDown}
      />
      <button className='w-10 h-10 rounded-full absolute top-1/2 -translate-y-1/2 right-2 z-50 flex items-center justify-center cursor-pointer hover:bg-gray-300' onClick={props.onClick}>
        <IoSearchOutline size={22} />
      </button>      
    </div>
  )
}


export default Search