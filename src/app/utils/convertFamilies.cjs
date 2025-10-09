const fs = require('fs')
const path = require('path')

// La función para transformar el objeto
function transformarObjeto(obj) {
  const nuevoObjeto = {}

  for (let key in obj) {
    const familyCode = obj[key].familyCode
    nuevoObjeto[familyCode] = {
      familyId: key,
      lastName: obj[key].lastName,
    }
  }

  return nuevoObjeto
}

// Leer el archivo JSON (data.json)
const jsonFilePath = path.join(__dirname, 'families.json')
const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'))

// Transformar el objeto
const resultadoTransformado = transformarObjeto(jsonData)

// Crear el archivo TypeScript para exportar el objeto
const tsFilePath = path.join(__dirname, 'familyData.ts')
const tsContent = `export const familyData = ${JSON.stringify(resultadoTransformado, null, 2)};`

// Escribir el archivo familyData.ts
fs.writeFileSync(tsFilePath, tsContent)

console.log('familyData.ts ha sido generado exitosamente.')
