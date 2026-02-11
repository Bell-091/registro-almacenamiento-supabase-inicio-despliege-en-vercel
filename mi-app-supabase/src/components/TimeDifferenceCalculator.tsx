import React, { useState } from 'react'

type InputMode = '12h' | '24h' | 'datetime'
type Period = 'AM' | 'PM'

interface TimeState {
  hour?: string
  minute?: string
  period?: Period
  datetime?: string
}

const TimeDifferenceCalculator: React.FC = () => {
  const [mode, setMode] = useState<InputMode>('12h')
  const [time1, setTime1] = useState<TimeState>({})
  const [time2, setTime2] = useState<TimeState>({})
  const [result, setResult] = useState('')
  const [error, setError] = useState('')
  const [showResult, setShowResult] = useState(false)

  const convert12hTo24h = (hour: number, period: Period): number => {
    if (period === 'AM') return hour === 12 ? 0 : hour
    return hour === 12 ? 12 : hour + 12
  }

  const convertToSeconds = (mode: InputMode, val: TimeState): number => {
    if (mode === 'datetime') {
      if (!val.datetime) throw new Error('Fecha inválida')
      const date = new Date(val.datetime)
      if (isNaN(date.getTime())) throw new Error('Fecha inválida')
      return Math.floor(date.getTime() / 1000)
    }

    const h = Number(val.hour)
    const m = Number(val.minute)

    if (isNaN(h) || isNaN(m)) throw new Error('Ingrese valores válidos')
    if (m < 0 || m > 59) throw new Error('Minutos deben ser 0-59')

    if (mode === '12h') {
      if (h < 1 || h > 12) throw new Error('Hora debe ser 1-12')
      const h24 = convert12hTo24h(h, val.period || 'AM')
      return h24 * 3600 + m * 60
    }

    if (h < 0 || h > 23) throw new Error('Hora debe ser 0-23')
    return h * 3600 + m * 60
  }

  const formatSeconds = (total: number) => {
    const hours = Math.floor(total / 3600)
    const minutes = Math.floor((total % 3600) / 60)
    const seconds = total % 60
    return `${hours}h ${minutes}m ${seconds}s`
  }

  const calculate = () => {
    try {
      setError('')
      const s1 = convertToSeconds(mode, time1)
      const s2 = convertToSeconds(mode, time2)
      const diff = Math.abs(s2 - s1)

      setResult(formatSeconds(diff))
      setShowResult(true)
    } catch (err: any) {
      setError(err.message)
      setShowResult(false)
    }
  }

  return (
    <div className="p-6 bg-white rounded shadow max-w-2xl mx-auto my-4">
      <h2 className="text-xl font-bold mb-4">Aplicación calculadora de diferencia de tiempos</h2>
      <h3 className="mb-2">Calcula las diferencias de tiempo entre dos horas o fechas distintas ingresadas por el usuario:</h3>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Modo de entrada:</label>
        <select
          value={mode}
          onChange={(e) => {
            setMode(e.target.value as InputMode)
            setShowResult(false)
            setError('')
          }}
          className="border p-2 rounded w-full sm:w-auto"
        >
          <option value="12h">12h (AM/PM)</option>
          <option value="24h">24h</option>
          <option value="datetime">Fecha y Hora</option>
        </select>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Tiempo 1 */}
        <div>
            <h4 className="font-semibold mb-2">Tiempo 1</h4>
            {mode !== 'datetime' ? (
                <div className="flex gap-2">
                    <input
                    type="number"
                    placeholder="HH"
                    onChange={(e) => setTime1({ ...time1, hour: e.target.value })}
                    className="border p-2 w-20 rounded"
                    />
                    <input
                    type="number"
                    placeholder="MM"
                    onChange={(e) => setTime1({ ...time1, minute: e.target.value })}
                    className="border p-2 w-20 rounded"
                    />
                    {mode === '12h' && (
                    <select
                        onChange={(e) => setTime1({ ...time1, period: e.target.value as Period })}
                        className="border p-2 rounded"
                    >
                        <option>AM</option>
                        <option>PM</option>
                    </select>
                    )}
                </div>
            ) : (
                <input
                    type="datetime-local"
                    onChange={(e) => setTime1({ ...time1, datetime: e.target.value })}
                    className="border p-2 w-full rounded"
                />
            )}
        </div>

        {/* Tiempo 2 */}
        <div>
            <h4 className="font-semibold mb-2">Tiempo 2</h4>
            {mode !== 'datetime' ? (
                <div className="flex gap-2">
                    <input
                    type="number"
                    placeholder="HH"
                    onChange={(e) => setTime2({ ...time2, hour: e.target.value })}
                    className="border p-2 w-20 rounded"
                    />
                    <input
                    type="number"
                    placeholder="MM"
                    onChange={(e) => setTime2({ ...time2, minute: e.target.value })}
                    className="border p-2 w-20 rounded"
                    />
                    {mode === '12h' && (
                    <select
                        onChange={(e) => setTime2({ ...time2, period: e.target.value as Period })}
                        className="border p-2 rounded"
                    >
                        <option>AM</option>
                        <option>PM</option>
                    </select>
                    )}
                </div>
            ) : (
                <input
                    type="datetime-local"
                    onChange={(e) => setTime2({ ...time2, datetime: e.target.value })}
                    className="border p-2 w-full rounded"
                />
            )}
        </div>
      </div>

      <button
        onClick={calculate}
        className="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors w-full sm:w-auto"
      >
        Calcular Diferencia
      </button>

      {error && <p className="text-red-500 mt-4 font-medium">{error}</p>}

      {showResult && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded text-green-800">
          <strong className="block text-lg">Resultado:</strong> 
          <span className="text-xl">{result}</span>
        </div>
      )}
    </div>
  )
}

export default TimeDifferenceCalculator;