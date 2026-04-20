import { useEffect, useState } from 'react'
import { getAllCountries } from '../services/countriesApi'

function HomePage() {
    const [countries, setCountries] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [search, setSearch] = useState('')

    useEffect(() => {
        loadCountries()
    }, [])

    async function loadCountries() {
        const data = await getAllCountries()
        setCountries(data)
    }

    function formatPopulation(value) {
        return new Intl.NumberFormat('pt-BR').format(value ?? 0)
    }
    const filteredCountries = countries.filter((country) => {
        const countryName = country.name?.common?.toLowerCase() || ''
        return countryName.includes(search.toLowerCase())
    })


    return (
        <main style={{ padding: '24px', fontFamily: 'Arial, sans-serif' }}>
            <h1>Wiki-Países</h1>
            <div style={{ marginBottom: '16px' }}>
                <input
                    type="text"
                    placeholder="Buscar país..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{
                        padding: '8px',
                        border: '1px solid #ccc',
                        borderRadius: '4px'
                    }}
                />
            </div>
            {/* <ul>
          {countries.map((country) => (
            <li key={country.cca3}>
              {country.name?.common}
            </li>
          ))}
        </ul> */}
            {loading && <p>Carregando paises...</p>}
            {error && <p>{error}</p>}

            {!loading && !error && (
                <section
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                        gap: '16px'
                    }}
                >
                    {filteredCountries.map((country) => (
                        <article
                            key={country.cca3}
                            style={{
                                border: '1px solid #d9d9d9',
                                borderRadius: '10px',
                                overflow: 'hidden',
                                background: '#fff'
                            }}
                        >
                            <img
                                src={country.flags?.png}
                                alt={'Bandeira de ' + (country.name?.common || 'pais')}
                                style={{
                                    width: '100%',
                                    height: '140px',
                                    objectFit: 'cover',
                                }}
                            />

                            <div style={{ padding: '12px' }}>
                                <h2 style={{ margin: '0 0 8px', fontSize: '18px', color: '#333', fontWeight: 'bold' }}>
                                    {country.name?.common || 'Sem nome'}
                                </h2>

                                <p style={{ margin: '0 0 6px' }}>
                                    Capital: {country.capital?.[0] || 'N/A'}
                                </p>

                                <p style={{ margin: '0 0 6px' }}>
                                    Regiao: {country.region || 'N/A'}
                                </p>

                                <p style={{ margin: 0 }}>
                                    Populacao: {formatPopulation(country.population)}
                                </p>
                            </div>
                        </article>
                    ))}
                </section>
            )}
        </main>
    )
}

export default HomePage