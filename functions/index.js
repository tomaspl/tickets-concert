const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp()

exports.testScheduler = functions.pubsub
  .schedule('every 1 minutes')
  .onRun(async (context) => {
    const db = admin.database()
    const now = Date.now()
    const twoMinutes = 2 * 60 * 1000
    //const twoMinutes = 45 * 1000;
    const queueRef = db.ref('queue')
    const snapshot = await queueRef.once('value')
    if (!snapshot.exists()) {
      console.log('⏰ Cola vacía. Nada que procesar.')
      return null
    }

    // Construir array ordenado por enteredAt
    const items = []
    snapshot.forEach((child) => {
      const data = child.val()
      const key = child.key
      let enteredAt = data && data.enteredAt ? data.enteredAt : null
      let onStageAt = data && data.onStageAt ? data.onStageAt : null
      let familyId = data && data.familyId ? data.familyId : null
      // soportar formato antiguo { <familyId>: true, enteredAt }
      if (!familyId && data) {
        const keys = Object.keys(data).filter(
          (k) => k !== 'enteredAt' && k !== 'onStageAt',
        )
        if (keys.length > 0) familyId = keys[0]
      }
      items.push({ key, familyId, enteredAt, onStageAt })
    })
    items.sort((a, b) => (a.enteredAt || 0) - (b.enteredAt || 0))

    const updates = {}
    const expelledFamilies = []

    // Encontrar el índice del que está en stage (primer elemento con onStageAt)
    let stageIndex = items.findIndex((it) => it.onStageAt)
    // Si no hay ninguno marcado como onStage, marcar al primero como onStage
    if (stageIndex === -1 && items.length > 0) {
      updates[`${items[0].key}/onStageAt`] = now
      console.log(
        `ℹ️ No había nadie en en mapa de teatro. Ingresando a la familia ${items[0].familyId || items[0].key} al mapa del teatro.`,
      )
      await queueRef.update(updates)
      return null
    }

    if (stageIndex !== -1) {
      const current = items[stageIndex]
      if (current.onStageAt && now - current.onStageAt > twoMinutes) {
        // expulsar al actual en stage
        updates[current.key] = null
        if (current.familyId) expelledFamilies.push(current.familyId)

        // encontrar siguiente candidato para asignar onStageAt
        let nextIndex = stageIndex + 1
        while (nextIndex < items.length) {
          const candidate = items[nextIndex]
          // si el candidato ya tiene onStageAt (caso raro), saltarlo
          if (!candidate.onStageAt) {
            updates[`${candidate.key}/onStageAt`] = now
            break
          }
          nextIndex++
        }

        await queueRef.update(updates)
        // Obtener apellido de la familia expulsada
        let lastName = null
        if (current.familyId) {
          try {
            const famSnap = await db
              .ref('families/' + current.familyId)
              .once('value')
            if (famSnap.exists() && famSnap.val().lastName) {
              lastName = famSnap.val().lastName
            }
          } catch (e) {}
        }
        const titulo = lastName
          ? `Removida familia ${lastName}. Pasa al mapa del teatro el siguiente en cola (si existía).`
          : `Removida familia ${current.familyId}. Pasa al mapa del teatro el siguiente en cola (si existía).`
        // Escribir en log
        try {
          await db.ref('log').push({ time: now, titulo })
        } catch (e) {
          console.error('Error escribiendo en log:', e)
        }
        console.log(
          `🚪 Removida familia ${expelledFamilies.join(',')}. Pasa al mapa del teatro el siguiente en cola (si existía).`,
        )
        return null
      } else {
        console.log(
          '⏳ Familia en mapa de teatro, aún no ha terminado su tiempo.',
        )
        return null
      }
    }
    // No hay más acciones en este ciclo
    return null
  })
