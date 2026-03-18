"use client"
import React, { useState } from 'react'
import { IoSearchOutline } from 'react-icons/io5'
import { useRouter } from 'next/navigation'

const Search = (props) => {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (props.onSearch) {
      props.onSearch(search.trim());
    } else {
      if (search.trim()) {
        router.push(`/products?search=${search.trim()}`);
      }
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }

  const handleChange = (e) => {
    const val = e.target.value;
    setSearch(val);
    if (props.onChange) {
      props.onChange(val);
    }
  }

  return (
    <div 
      className="search w-full h-[50px] md:h-[56px] relative group"
      style={{ maxWidth: props.width ? props.width : '100%' }}
    >
      <div className="absolute inset-x-0 inset-y-0 bg-gray-50/50 rounded-[20px] border-2 border-transparent group-focus-within:border-primary/10 group-focus-within:bg-white group-hover:bg-gray-100/50 transition-all duration-300"></div>
      
      <input
        type="text"
        placeholder={props.placeholder}
        className="w-full h-full bg-transparent outline-none px-6 text-[15px] font-bold text-gray-700 placeholder:text-gray-300 relative z-10"
        value={search}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      
      <div className="absolute top-1/2 -translate-y-1/2 right-2 z-20 flex items-center gap-1">
        <button 
          className="w-[42px] h-[42px] md:w-[48px] md:h-[48px] rounded-[16px] bg-white shadow-sm border border-gray-100 flex items-center justify-center cursor-pointer hover:bg-primary group/btn transition-all duration-300 active:scale-95"
          onClick={handleSearch}
        >
          <IoSearchOutline size={22} className="text-gray-400 group-hover/btn:text-white transition-colors" />
        </button>      
      </div>
    </div>
  )
}

export default Search