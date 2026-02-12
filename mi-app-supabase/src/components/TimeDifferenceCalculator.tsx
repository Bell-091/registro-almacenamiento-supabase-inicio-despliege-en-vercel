import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabaseClient'

type InputMode = '12h' | '24h' | 'datetime'
type Period = 'AM' | 'PM'

interface TimeState {
  hour?: string
  minute?: string
  period?: Period
  datetime?: string
}

interface HistorialItem {
  id: number
  nombre: string
  resultado: string
  prioridad: string
  created_at: string
}

const TimeDifferenceCalculator: React.FC = () => {
  const { user } = useAuth()
  const [mode, setMode] = useState<InputMode>('12h')
  const [time1, setTime1] = useState<TimeState>({})
  const [time2, setTime2] = useState<TimeState>({})
  const [result, setResult] = useState('')
  const [error, setError] = useState('')
  const [showResult, setShowResult] = useState(false)

  // Estados para el historial
  const [historial, setHistorial] = useState<HistorialItem[]>([])
  const [nombreCalculo, setNombreCalculo] = useState('')
  const [prioridad, setPrioridad] = useState('Media')
  const [orden, setOrden] = useState<'fecha' | 'prioridad'>('fecha')

  // Estados para edición
  const [editandoId, setEditandoId] = useState<number | null>(null)
  const [nombreEditado, setNombreEditado] = useState('')
  const [prioridadEditada, setPrioridadEditada] = useState('')

  useEffect(() => {
    if (user) fetchHistorial()
  }, [user])

  const fetchHistorial = async () => {
    try {
      const { data, error } = await supabase
        .from('historial_calculos')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      if (data) setHistorial(data)
    } catch (error) {
      console.error('Error cargando historial:', error)
    }
  }

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

  const guardarEnHistorial = async () => {
    if (!user || !result || !nombreCalculo.trim()) {
      setError('Debes estar logueado, tener un resultado y un nombre para guardar.')
      return
    }

    try {
      const { data, error } = await supabase
        .from('historial_calculos')
        .insert([
          {
            user_id: user.id,
            nombre: nombreCalculo,
            resultado: result,
            prioridad: prioridad
          }
        ])
        .select()

      if (error) throw error
      if (data) {
        setHistorial([data[0], ...historial])
        setNombreCalculo('')
        alert('Guardado en el historial')
      }
    } catch (err: any) {
      setError(err.message)
    }
  }

  const eliminarDelHistorial = async (id: number) => {
    if (!window.confirm('¿Estás seguro de eliminar este registro?')) return
    try {
      const { error } = await supabase.from('historial_calculos').delete().eq('id', id)
      if (error) throw error
      setHistorial(historial.filter((item) => item.id !== id))
    } catch (err: any) {
      console.error('Error eliminando:', err)
    }
  }

  const iniciarEdicion = (item: HistorialItem) => {
    setEditandoId(item.id)
    setNombreEditado(item.nombre)
    setPrioridadEditada(item.prioridad)
  }

  const guardarEdicion = async (id: number) => {
    try {
      const { error } = await supabase
        .from('historial_calculos')
        .update({ nombre: nombreEditado, prioridad: prioridadEditada })
        .eq('id', id)

      if (error) throw error

      setHistorial(historial.map(item => 
        item.id === id ? { ...item, nombre: nombreEditado, prioridad: prioridadEditada } : item
      ))
      setEditandoId(null)
    } catch (err: any) {
      console.error('Error actualizando:', err)
    }
  }

  const historialOrdenado = [...historial].sort((a, b) => {
    if (orden === 'prioridad') {
      const mapPrioridad: Record<string, number> = { 'Alta': 3, 'Media': 2, 'Baja': 1 }
      return (mapPrioridad[b.prioridad] || 0) - (mapPrioridad[a.prioridad] || 0)
    }
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })

  return (
    <div className="p-6 bg-white rounded shadow max-w-2xl mx-auto my-4">
      <h2 className="text-xl font-bold mb-4">Aplicación calculadora de diferencia de tiempos</h2>
      <h3 className="mb-2">Calcula las diferencias de tiempo entre dos horas o fechas distintas ingresadas por el usuario:</h3>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Metodo de ingreso de datos:</label>
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
          <span className="text-xl font-bold">{result}</span>
          
          {/* Formulario para guardar */}
          <div className="mt-4 pt-4 border-t border-green-200 flex flex-col sm:flex-row gap-2 items-end sm:items-center">
            <div className="flex-1 w-full">
              <label className="block text-xs font-bold text-green-700 mb-1">Nombre del cálculo:</label>
              <input 
                type="text" 
                value={nombreCalculo}
                onChange={(e) => setNombreCalculo(e.target.value)}
                placeholder="Ej: Tiempo de clases"
                className="border p-2 rounded w-full text-sm text-black"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-green-700 mb-1">Prioridad:</label>
              <select 
                value={prioridad} 
                onChange={(e) => setPrioridad(e.target.value)}
                className="border p-2 rounded text-sm text-black"
              >
                <option value="Alta">Alta</option>
                <option value="Media">Media</option>
                <option value="Baja">Baja</option>
              </select>
            </div>
            <button 
              onClick={guardarEnHistorial}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm w-full sm:w-auto"
            >
              Guardar
            </button>
          </div>
        </div>
      )}

      {/* Sección Historial */}
      {user && (
        <div className="mt-10 border-t pt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">📜 Historial</h3>
            <select 
              value={orden} 
              onChange={(e) => setOrden(e.target.value as any)}
              className="border p-1 rounded text-sm"
            >
              <option value="fecha">Ordenar por Fecha</option>
              <option value="prioridad">Ordenar por Prioridad</option>
            </select>
          </div>

          {historial.length === 0 ? (
            <p className="text-gray-500 text-sm">No hay cálculos guardados.</p>
          ) : (
            <ul className="space-y-3">
              {historialOrdenado.map((item) => (
                <li key={item.id} className="p-3 bg-gray-50 rounded border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  {editandoId === item.id ? (
                    <div className="flex gap-2 w-full">
                      <input 
                        value={nombreEditado} 
                        onChange={(e) => setNombreEditado(e.target.value)} 
                        className="border p-1 rounded flex-1"
                      />
                      <select 
                        value={prioridadEditada} 
                        onChange={(e) => setPrioridadEditada(e.target.value)}
                        className="border p-1 rounded"
                      >
                        <option value="Alta">Alta</option>
                        <option value="Media">Media</option>
                        <option value="Baja">Baja</option>
                      </select>
                      <button onClick={() => guardarEdicion(item.id)} className="text-green-600 font-bold text-sm">OK</button>
                      <button onClick={() => setEditandoId(null)} className="text-gray-500 text-sm">X</button>
                    </div>
                  ) : (
                    <>
                      <div>
                        <p className="font-semibold">{item.nombre} <span className={`text-xs px-2 py-0.5 rounded-full ${item.prioridad === 'Alta' ? 'bg-red-100 text-red-800' : item.prioridad === 'Media' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>{item.prioridad}</span></p>
                        <p className="text-sm text-gray-600">Resultado: <span className="font-mono font-bold">{item.resultado}</span></p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => iniciarEdicion(item)} className="text-blue-600 hover:underline text-sm">Editar</button>
                        <button onClick={() => eliminarDelHistorial(item.id)} className="text-red-600 hover:underline text-sm">Eliminar</button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

export default TimeDifferenceCalculator;