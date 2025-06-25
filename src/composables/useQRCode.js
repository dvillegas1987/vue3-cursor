import QRCode from 'qrcode'

export function useQRCode() {
  // Generar código QR como URL de datos
  const generarQRDataURL = async (texto) => {
    try {
      console.log('Iniciando generación de QR para:', texto)
      
      if (!texto || typeof texto !== 'string') {
        throw new Error('El texto para generar el QR es requerido y debe ser una cadena')
      }
      
      const qrDataURL = await QRCode.toDataURL(texto, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'M'
      })
      
      console.log('QR generado exitosamente')
      return qrDataURL
    } catch (err) {
      console.error('Error al generar QR:', err)
      throw new Error(`Error al generar código QR: ${err.message}`)
    }
  }

  // Generar código QR como canvas
  const generarQRCanvas = async (texto, canvasElement) => {
    try {
      console.log('Iniciando generación de QR en canvas para:', texto)
      
      if (!texto || typeof texto !== 'string') {
        throw new Error('El texto para generar el QR es requerido y debe ser una cadena')
      }
      
      if (!canvasElement) {
        throw new Error('El elemento canvas es requerido')
      }
      
      await QRCode.toCanvas(canvasElement, texto, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'M'
      })
      
      console.log('QR en canvas generado exitosamente')
    } catch (err) {
      console.error('Error al generar QR en canvas:', err)
      throw new Error(`Error al generar código QR en canvas: ${err.message}`)
    }
  }

  // Descargar código QR como imagen
  const descargarQR = async (texto, nombreArchivo = 'qr-code.png') => {
    try {
      console.log('Iniciando descarga de QR para:', texto)
      
      if (!texto || typeof texto !== 'string') {
        throw new Error('El texto para generar el QR es requerido y debe ser una cadena')
      }
      
      const qrDataURL = await generarQRDataURL(texto)
      
      // Crear enlace de descarga
      const link = document.createElement('a')
      link.href = qrDataURL
      link.download = nombreArchivo
      link.style.display = 'none'
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      console.log('QR descargado exitosamente como:', nombreArchivo)
    } catch (err) {
      console.error('Error al descargar QR:', err)
      throw new Error(`Error al descargar código QR: ${err.message}`)
    }
  }

  return {
    generarQRDataURL,
    generarQRCanvas,
    descargarQR
  }
} 