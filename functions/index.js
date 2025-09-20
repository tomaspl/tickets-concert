const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.testScheduler = functions.pubsub
  .schedule("every 1 minutes")
  .onRun(async (context) => {
    const db = admin.database();
    const now = Date.now();
    const twoMinutes = 2 * 60 * 1000;
    const queueRef = db.ref('queue');
    const snapshot = await queueRef.once('value');
    let expelledCount = 0;
    const updates = {};
    snapshot.forEach(child => {
      const data = child.val();
      // Si no hay enteredAt, no se expulsa
      if (data.enteredAt && (now - data.enteredAt) > twoMinutes) {
        updates[child.key] = null; // Eliminar este nodo
        expelledCount++;
      }
    });
    if (expelledCount > 0) {
      await queueRef.update(updates);
      console.log(`🚪 Expulsados ${expelledCount} usuarios de 'queue' por exceder 2 minutos.`);
    } else {
      console.log('⏰ No hay usuarios para expulsar en este ciclo.');
    }
    return null;
  });
