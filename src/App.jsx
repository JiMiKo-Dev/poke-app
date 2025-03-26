import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'

// Component
import FavPoke from './components/FavPoke'

function App() {
  const [poke, setPoke] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [number, setNumber] = useState(1)
  const [fav, setFav] = useState([])


  useEffect(() => {
    let abortController = new AbortController();

    const loadPoke = async () => {
      try {
        setLoading(true);
        let response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${number}`, {
          signal: abortController.signal
        });

        setPoke(response.data)
        setError('')

      } catch (err) {
        setError(`Something went wrong`, err)

      } finally {
        setLoading(false)
      }
    }

    loadPoke();

    return () => abortController.abort();
  }, [number])

  const prevPoke = () => {
    setNumber((number => Math.max(number - 1, 1)))
  }

  const nextPoke = () => {
    setNumber((number => number + 1))
  }

  const addFav = () => {
    if (!fav.some(p => p.name === poke.name)) { // ป้องกันการเพิ่มซ้ำ
      setFav((oldFav) => [...oldFav, poke])
    }
  }

  console.log("My Fav: ", fav)

  return (
    <>
      <div className="">
        {loading ?
          <p>Loading...</p>
          :
          <>
            {poke && (
              <>
                <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:cols-2 border rounded-lg p-4 border-gray-200">
                  <div className="">
                    <h1 className='mb-4'>{poke?.name}</h1>
                    <button onClick={addFav}>Add to Favorite</button>
                    <img
                      src={poke?.sprites?.other?.home?.front_default}
                      alt={poke?.name}
                    />
                    <ul>
                      {poke?.abilities?.map((abli, idx) => (
                        <li key={idx}>{abli.ability.name}</li>
                      ))}
                    </ul>
                    <button className='m-2' onClick={prevPoke} disabled={number === 1}>
                      Previous
                    </button>
                    <button className='m-2' onClick={nextPoke}>Next</button>
                  </div>


                  <div className="">
                    <h2 className='mb-10 font-bold text-lg'>Your favourite Pokemon</h2>
                    <FavPoke fav={fav} />
                  </div>
                </div>
              </>
            )}
          </>}

      </div >


    </>
  )
}

export default App
