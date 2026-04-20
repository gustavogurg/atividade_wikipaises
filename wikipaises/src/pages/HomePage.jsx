import { useEffect, useState } from 'react'
import { getAllCountries } from '../services/countriesApi'
import { Link } from 'react-router-dom'

function HomePage() {
    const [countries, setCountries] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [search, setSearch] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const ITEMS_PER_PAGE = 24
    const [region, setRegion] = useState('')

    useEffect(() => {
        loadCountries()
    }, [])

    useEffect(() => {
        setCurrentPage(1)
    }, [search, region])

    async function loadCountries() {
        const data = await getAllCountries()
        setCountries(data)
    }

    function formatPopulation(value) {
        return new Intl.NumberFormat('pt-BR').format(value ?? 0)
    }
    const filteredCountries = countries.filter((country) => {
        const countryName = country.name?.common?.toLowerCase() || ''
        const matchesSearch = countryName.includes(search.toLowerCase())
        const matchesRegion = region ? country.region === region : true
        return matchesSearch && matchesRegion
    })

    const totalPages = Math.max(1, Math.ceil(filteredCountries.length / ITEMS_PER_PAGE))
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    const paginatedCountries = filteredCountries.slice(startIndex, endIndex)


    return (
        <main style={{ padding: '24px', fontFamily: 'Arial, sans-serif' }}>
            <h1>Wiki-Países</h1>
            <div style={{ marginBottom: '16px' }}>
                <input
                    type="text"
                    placeholder="Buscar país"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{
                        padding: '8px',
                        border: '1px solid #ccc',
                        borderRadius: '4px'
                    }}
                />
            </div>
            <div style={{ marginBottom: '16px' }}>
                <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    style={{
                        padding: '8px',
                        border: '1px solid #ccc',
                        borderRadius: '4px'
                    }}
                >
                    <option value="">Todos os continentes</option>
                    <option value="Americas">Americas</option>
                    <option value="Europe">Europe</option>
                    <option value="Asia">Asia</option>
                    <option value="Africa">Africa</option>
                    <option value="Oceania">Oceania</option>
                </select>
            </div>
            <div style={{ marginTop: '16px', marginBottom: '16px', display: 'flex', gap: '10px', alignItems: 'center' }}> <button onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))} disabled={currentPage === 1} style={{ padding: '8px 12px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }} > Anterior </button>
                <button onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages} style={{ padding: '8px 12px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }} > Próximo </button>
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
                    }}>
                    {/* <div style={{ marginTop: '16px', display: 'flex', gap: '10px', alignItems: 'center' }}> <button onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))} disabled={currentPage === 1} style={{ padding: '8px 12px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }} > Anterior </button>
                        <button onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages} style={{ padding: '8px 12px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }} > Próximo </button>
                    </div> */}
                    {paginatedCountries.map((country) => (
                        <Link
                            key={country.cca3}
                            to={'/country/' + country.cca3}
                            style={{ textDecoration: 'none', color: 'inherit' }}
                        >
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
                                    src={country.flags.png}
                                    alt={'Bandeira de ' + (country.name.common)}
                                    style={{
                                        width: '100%',
                                        height: '140px',
                                        objectFit: 'cover',
                                    }}
                                />

                                <div style={{ padding: '12px' }}>
                                    <h2 style={{ margin: '0 0 8px', fontSize: '18px', color: '#333', fontWeight: 'bold' }}>
                                        {country.name.common}
                                    </h2>

                                    <p style={{ margin: '0 0 6px' }}>
                                        Capital: {country.capital}
                                    </p>

                                    <p style={{ margin: '0 0 6px' }}>
                                        Regiao: {country.region}
                                    </p>

                                    <p style={{ margin: 0 }}>
                                        Populacao: {formatPopulation(country.population)}
                                    </p>
                                </div>
                            </article>
                        </Link>

                    ))}
                </section>


            )}
            <div
                style={{
                    marginTop: '16px',
                    marginBottom: '16px',
                    display: 'flex',
                    gap: '10px',
                    alignItems: 'center'
                }}
            >
                <button
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    style={{ padding: '8px 12px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
                >
                    Anterior
                </button>

                <span style={{ fontWeight: 600 }}>
                    Pagina {currentPage} de {totalPages}
                </span>

                <button
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    style={{ padding: '8px 12px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
                >
                    Proximo
                </button>
            </div>
        </main>

    )
}

export default HomePage

