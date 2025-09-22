const askCFO = async () => {
  if (!question.trim()) return
  
  setAskingCFO(true)
  setCfoResponse('Analizando tus datos...')
  
  try {
    const response = await fetch('/api/cfo/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question })
    })
    
    const data = await response.json()
    
    if (data.success) {
      setCfoResponse(data.response)
    } else {
      setCfoResponse('Error al analizar la pregunta')
    }
  } catch (error) {
    setCfoResponse('Error de conexión')
  } finally {
    setAskingCFO(false)
  }
}
