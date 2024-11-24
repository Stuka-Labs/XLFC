import { View, Text } from 'react-native'
import { useState } from 'react'

import Feather from '@expo/vector-icons/Feather'

import DefaultInput from '../../components/inputs/DefaultInput'

const SearchBar = () => {

  const [query, setQuery] = useState('')
  
  return (
    <View>
      <DefaultInput 
        style="mx-4"
        placeholder="Search for a participant"
        text={query}
        setText={setQuery}
        rightView={
          <Feather name="search" size={24} color="black" />
        }
      />
    </View>
  )
}

export default SearchBar