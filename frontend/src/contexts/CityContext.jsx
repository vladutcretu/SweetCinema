// React, dependencies & packages
import { createContext, useState, useContext } from "react";

// Write components here


const CityContext = createContext()

export function CityProvider({ children }) {
  // On component mount: use localStored values if exists, else set default values
  const [selectedCityId, setSelectedCityIdRaw] = useState(() => {
    const storedId = localStorage.getItem("selectedCityId")
    return storedId ? parseInt(localStorage.getItem("selectedCityId")) : 1
  })

  const [selectedCityName, setSelectedCityNameRaw] = useState(() => {
    return localStorage.getItem("selectedCityName") || "City Location"
  })

  // Update react state using raw functions and set values in localStorage
  const setSelectedCityId = (id) => {
    setSelectedCityIdRaw(id)
    if (id !== null) {
      localStorage.setItem("selectedCityId", id)
    } else {
      localStorage.removeItem("selectedCityId")
    }
  }

  const setSelectedCityName = (name) => {
    setSelectedCityNameRaw(name)
    if (name) {
      localStorage.setItem("selectedCityName", name)
    } else {
      localStorage.removeItem("selectedCityName")
    }
  }

  return (
    <CityContext
      value={{
        selectedCityId,
        setSelectedCityId,
        selectedCityName,
        setSelectedCityName
      }}
    >
      {children}
    </CityContext>
    )
}

export function useCityContext() {
  return useContext(CityContext)
}