import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getCountryByCode } from '../services/countriesApi'

function DetailPage() {
    const { code } = useParams()
    const [country, setCountry] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        loadCountry()
    }, [code])

    async function loadCountry() {
        try {
            setLoading(true)
            setError('')
            const data = await getCountryByCode(code)
            setCountry(data)
        } catch {
            setError('Nao foi possivel carregar os detalhes do pais.')
        } finally {
            setLoading(false)
        }
    }

    function formatPopulation(value) {
        return new Intl.NumberFormat('pt-BR').format(value ?? 0)
    }

    function formatArea(value) {
        return new Intl.NumberFormat('pt-BR').format(value ?? 0) + ' km2'
    }

    const languages = country?.languages
        ? Object.values(country.languages).join(', ')
        : 'N/A'

    const currencies = country?.currencies
        ? Object.entries(country.currencies)
            .map(([currencyCode, currency]) => {
                const name = currency?.name || 'Moeda'
                const symbol = currency?.symbol ? ' ' + currency.symbol : ''
                return name + ' (' + currencyCode + ')' + symbol
            })
            .join(', ')
        : 'N/A'

    return (
        <main style={{
            padding: '32px 24px 48px',
            fontFamily: 'Arial, sans-serif',
            textAlign: 'left',
            maxWidth: '1100px',
            margin: '0 auto'
        }}>
            <Link to="/" style={{ display: 'inline-block', marginBottom: '16px' }}>
                Voltar para a lista
            </Link>

            {loading && <p>Carregando detalhes...</p>}
            {error && <p>{error}</p>}

            {!loading && !error && country && (
                <>
                    <img
                        src={country.flags?.png}
                        alt={'Bandeira de ' + (country.name?.common || 'pais')}
                        style={{ width: '100%', maxWidth: '520px', borderRadius: '12px', marginBottom: '16px' }}
                    />

                    <h1 style={{ marginBottom: '8px' }}>{country.name?.official || 'N/A'}</h1>
                    <p style={{ marginTop: 0, marginBottom: '20px' }}>
                        Nome comum: {country.name?.common || 'N/A'}
                    </p>

                    <section
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                            gap: '12px',
                            marginBottom: '20px'
                        }}
                    >
                        <InfoBlock label="Capital" value={country.capital?.[0] || 'N/A'} />
                        <InfoBlock label="Continente" value={country.region || 'N/A'} />
                        <InfoBlock label="Sub-regiao" value={country.subregion || 'N/A'} />
                        <InfoBlock label="Area" value={formatArea(country.area)} />
                        <InfoBlock label="Populacao" value={formatPopulation(country.population)} />
                        <InfoBlock label="Idiomas" value={languages} />
                        <InfoBlock label="Moeda" value={currencies} />
                        <InfoBlock label="Codigo do pais" value={country.cca3 || 'N/A'} />
                    </section>

                    <section>
                        <h2>Sobre o pais</h2>
                        <p>
                            Este pais possui rica diversidade cultural, historica e geografica.
                        </p>
                    </section>
                </>
            )}
        </main>
    )
}

function InfoBlock({ label, value }) {
    return (
        <article
            style={{
                border: '1px solid #d9d9d9',
                borderRadius: '10px',
                padding: '12px',
                background: '#fff'
            }}
        >
            <h3 style={{ margin: '0 0 6px', fontSize: '15px' }}>{label}</h3>
            <p style={{ margin: 0 }}>{value}</p>
        </article>
    )
}

export default DetailPage
