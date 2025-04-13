import React from 'react'

const Search = ({ searchTerm, setSearchTerm }) => {
console.log(searchTerm)
  
  return (
    <div className='search'>
      <div>
        <img src="./search.svg" alt="search" />
      <input
      type='text'
      placeholder='Search a Ton of movies'
      value={searchTerm}
      onChange={(event) => setSearchTerm(event.target.value)} />
      </div>
      
    </div>

  )
}

export default Search
