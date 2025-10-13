"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformData = transformData;
var fs_1 = require("fs");
var inputData = {
    list: [
        {
            familia: '8668',
            grado: 'K2-TM',
            nombre: 'AGUSTONI ACETO, JERONIMO',
        },
        {
            familia: '8579',
            grado: 'K2-TM',
            nombre: 'BOUZADA MENDEZ, RAMON',
        },
        {
            familia: '8628',
            grado: 'K2-TM',
            nombre: 'CASTAÑO, SALVADOR',
        },
        {
            familia: '8670',
            grado: 'K2-TM',
            nombre: 'DURRIE, FELIX',
        },
        {
            familia: '8630',
            grado: 'K2-TM',
            nombre: 'FREIXAS, LOLA MARIA',
        },
        {
            familia: '8480',
            grado: 'K2-TM',
            nombre: 'GALARCE, NICANOR',
        },
        {
            familia: '8518',
            grado: 'K2-TM',
            nombre: 'GARROCHO, OLIVERIO',
        },
        {
            familia: '8688',
            grado: 'K2-TM',
            nombre: 'HERRMANN, BELTRAN',
        },
        {
            familia: '8688',
            grado: 'K2-TM',
            nombre: 'HERRMANN, LORENZO',
        },
        {
            familia: '8660',
            grado: 'K2-TM',
            nombre: 'LARRE ARBOLEDA, VALERIA',
        },
        {
            familia: '8494',
            grado: 'K2-TM',
            nombre: 'LOPEZ VINCI, FELIX',
        },
        {
            familia: '8702',
            grado: 'K2-TM',
            nombre: 'MARTINEZ, ANTONIA',
        },
        {
            familia: '8699',
            grado: 'K2-TM',
            nombre: 'MONSERRAT, CATALINA VICTORIA',
        },
        {
            familia: '8650',
            grado: 'K2-TM',
            nombre: 'PERFARE, JUSTO',
        },
        {
            familia: '8520',
            grado: 'K2-TM',
            nombre: 'ROJO VIVOT, LUISA',
        },
        {
            familia: '8693',
            grado: 'K2-TT',
            nombre: 'ALFONSIN, DANTE',
        },
        {
            familia: '8690',
            grado: 'K2-TT',
            nombre: 'BUSCAGLIA, RAFAEL',
        },
        {
            familia: '8460',
            grado: 'K2-TT',
            nombre: 'GONZALEZ MAYA, RAMON ANTONIO',
        },
        {
            familia: '8577',
            grado: 'K2-TT',
            nombre: 'LAGOS, FEDERICA',
        },
        {
            familia: '8685',
            grado: 'K2-TT',
            nombre: 'LO BIANCO, ANTONIO',
        },
        {
            familia: '8692',
            grado: 'K2-TT',
            nombre: 'POZO GOWLAND, FILIPA',
        },
        {
            familia: '8697',
            grado: 'K2-TT',
            nombre: 'RICHARDS, UMA',
        },
        {
            familia: '8661',
            grado: 'K3-TM',
            nombre: 'AGUSTI POBLET, TOMAS',
        },
        {
            familia: '8658',
            grado: 'K3-TM',
            nombre: 'ALIAGA, RENATA',
        },
        {
            familia: '8592',
            grado: 'K3-TM',
            nombre: 'CALVIÑO, ISIDRO',
        },
        {
            familia: '8634',
            grado: 'K3-TM',
            nombre: 'CEREIJO, SILVESTRE',
        },
        {
            familia: '8525',
            grado: 'K3-TM',
            nombre: 'CHARRO, MAITE',
        },
        {
            familia: '8657',
            grado: 'K3-TM',
            nombre: 'DUBOIS SPERONI, BAUTISTA',
        },
        {
            familia: '8623',
            grado: 'K3-TM',
            nombre: 'GARCIA BALCARCE, LUISA',
        },
        {
            familia: '8698',
            grado: 'K3-TM',
            nombre: 'GUADALUPE, LUCAS',
        },
        {
            familia: '8651',
            grado: 'K3-TM',
            nombre: 'LASALA, ISABELLA',
        },
        {
            familia: '8648',
            grado: 'K3-TM',
            nombre: 'MARTINO, JOAQUIN JOSE',
        },
        {
            familia: '8676',
            grado: 'K3-TM',
            nombre: 'MILLON CALERO, ANTONIO',
        },
        {
            familia: '8663',
            grado: 'K3-TM',
            nombre: 'PETERSEN, JACINTA',
        },
        {
            familia: '8589',
            grado: 'K3-TM',
            nombre: 'PRUNEDA PERDOMO, AMELIA',
        },
        {
            familia: '8649',
            grado: 'K3-TM',
            nombre: 'RIVAS MAGGI, VICENTE',
        },
        {
            familia: '8656',
            grado: 'K3-TM',
            nombre: 'TASSI, AMANDA',
        },
        {
            familia: '8647',
            grado: 'K3-TM',
            nombre: 'VIALE, BELTRAN',
        },
        {
            familia: '8652',
            grado: 'K3-TM',
            nombre: 'VIZENTAL, HELENA',
        },
        {
            familia: '8517',
            grado: 'K3-TT',
            nombre: 'CARRACEDO, SARA',
        },
        {
            familia: '8444',
            grado: 'K3-TT',
            nombre: 'DANERI, LUISA',
        },
        {
            familia: '8683',
            grado: 'K3-TT',
            nombre: 'GOMEZ DE ALZAGA, FELIX BOSCO',
        },
        {
            familia: '8547',
            grado: 'K3-TT',
            nombre: 'GOÑI, SANTOS',
        },
        {
            familia: '8612',
            grado: 'K3-TT',
            nombre: 'GUEMES, ALINA',
        },
        {
            familia: '8655',
            grado: 'K3-TT',
            nombre: 'KATZMAN QUINTANA, MATEO',
        },
        {
            familia: '8578',
            grado: 'K3-TT',
            nombre: 'LIBERATORE, EMILIA',
        },
        {
            familia: '8654',
            grado: 'K3-TT',
            nombre: 'PEDACE, VICENTE',
        },
        {
            familia: '8608',
            grado: 'K3-TT',
            nombre: 'RESANO SCHINONI, PILAR',
        },
        {
            familia: '8624',
            grado: 'K3-TT',
            nombre: 'SANCHEZ SUED, EMMA',
        },
        {
            familia: '8499',
            grado: 'K3-TT',
            nombre: 'SARRABAYROUSE, RUFINO',
        },
        {
            familia: '8487',
            grado: 'K3-TT',
            nombre: 'SOLARI, SANTIAGO',
        },
        {
            familia: '8662',
            grado: 'K3-TT',
            nombre: 'WERNER BIAUS, CALA',
        },
        {
            familia: '8668',
            grado: 'K4-TM',
            nombre: 'AGUSTONI ACETO, BAUTISTA',
        },
        {
            familia: '8620',
            grado: 'K4-TM',
            nombre: 'ANGIOLINI CERVIÑO, GINES',
        },
        {
            familia: '8626',
            grado: 'K4-TM',
            nombre: 'ARILLO, VALENTIN',
        },
        {
            familia: '8631',
            grado: 'K4-TM',
            nombre: 'BISCAISAQUE HARGUINDEGUY, IGNACIO',
        },
        {
            familia: '8628',
            grado: 'K4-TM',
            nombre: 'CASTAÑO, JUSTINA',
        },
        {
            familia: '8666',
            grado: 'K4-TM',
            nombre: 'ETCHEGOYHEN, JUSTO',
        },
        {
            familia: '8513',
            grado: 'K4-TM',
            nombre: 'FATTORI, MARTINA',
        },
        {
            familia: '8653',
            grado: 'K4-TM',
            nombre: 'FERNANDEZ PEZZANO, VICENTE',
        },
        {
            familia: '8630',
            grado: 'K4-TM',
            nombre: 'FREIXAS, OLIVIA MARIA',
        },
        {
            familia: '8480',
            grado: 'K4-TM',
            nombre: 'GALARCE, DOMINGA',
        },
        {
            familia: '8617',
            grado: 'K4-TM',
            nombre: 'GATTI BEIZE, FACUNDO',
        },
        {
            familia: '8616',
            grado: 'K4-TM',
            nombre: 'GUTMAN, FRANCISCO',
        },
        {
            familia: '8660',
            grado: 'K4-TM',
            nombre: 'LARRE ARBOLEDA, AMELIE',
        },
        {
            familia: '8686',
            grado: 'K4-TM',
            nombre: 'PATRON COSTA, ROBUSTIANO',
        },
        {
            familia: '8665',
            grado: 'K4-TM',
            nombre: 'REBORATTI, LUCIA CALA',
        },
        {
            familia: '8672',
            grado: 'K4-TM',
            nombre: 'VILARULLO VIANO, LUISA',
        },
        {
            familia: '8680',
            grado: 'K4-TT',
            nombre: 'BERNAL, ALFONSO MARIA',
        },
        {
            familia: '8684',
            grado: 'K4-TT',
            nombre: 'DOMINGUEZ LOZANO, TOMAS',
        },
        {
            familia: '8515',
            grado: 'K4-TT',
            nombre: 'GAYNOR ROSSELL, MAX',
        },
        {
            familia: '8618',
            grado: 'K4-TT',
            nombre: 'JAUREGUI, MANUELA',
        },
        {
            familia: '8582',
            grado: 'K4-TT',
            nombre: 'MAYA, JUAN JOSE',
        },
        {
            familia: '8622',
            grado: 'K4-TT',
            nombre: 'SANTIVAÑEZ RIAVEC, ROSARIO MARIA',
        },
        {
            familia: '8633',
            grado: 'K4-TT',
            nombre: 'SCARCASALE, FRANCESCA',
        },
        {
            familia: '8490',
            grado: 'K4-TT',
            nombre: 'SOLER PUJOL, ELENA',
        },
        {
            familia: '8619',
            grado: 'K4-TT',
            nombre: 'SUNDBLAD, BELTRAN',
        },
        {
            familia: '8677',
            grado: 'K4-TT',
            nombre: 'WACHS, LUCAS',
        },
        {
            familia: '8689',
            grado: 'K4-TT',
            nombre: 'de ZAVALIA, IÑAKI',
        },
        {
            familia: '8576',
            grado: 'K5',
            nombre: 'AGUILAR, CAMILA',
        },
        {
            familia: '8639',
            grado: 'K5',
            nombre: 'ANNECCA JONAS MACKINLAY, SALVADOR',
        },
        {
            familia: '8581',
            grado: 'K5',
            nombre: 'CABRERA VIERA, BENJAMIN',
        },
        {
            familia: '8592',
            grado: 'K5',
            nombre: 'CALVIÑO, MARTINA',
        },
        {
            familia: '8634',
            grado: 'K5',
            nombre: 'CEREIJO, CAMILO',
        },
        {
            familia: '8470',
            grado: 'K5',
            nombre: 'CHIARADIA, FRANCISCA',
        },
        {
            familia: '8470',
            grado: 'K5',
            nombre: 'CHIARADIA, JUSTINA',
        },
        {
            familia: '8458',
            grado: 'K5',
            nombre: 'CILLEY RUIVAL, FEDERICA',
        },
        {
            familia: '8602',
            grado: 'K5',
            nombre: 'CONTAL, ALFONSINA',
        },
        {
            familia: '8467',
            grado: 'K5',
            nombre: 'DE ALL, FEDERICA',
        },
        {
            familia: '8486',
            grado: 'K5',
            nombre: 'DIAZ SAUBIDET, FELIPE',
        },
        {
            familia: '8657',
            grado: 'K5',
            nombre: 'DUBOIS SPERONI, JOSEFINA',
        },
        {
            familia: '8559',
            grado: 'K5',
            nombre: 'ESPECTOR, CATALINA',
        },
        {
            familia: '8606',
            grado: 'K5',
            nombre: 'ESTEVEZ, FRANCO',
        },
        {
            familia: '8583',
            grado: 'K5',
            nombre: 'GARRIDO OCHOA, ISIDRO',
        },
        {
            familia: '8577',
            grado: 'K5',
            nombre: 'LAGOS, FRANCISCA',
        },
        {
            familia: '8596',
            grado: 'K5',
            nombre: 'MANEIRO, JERONIMO',
        },
        {
            familia: '8703',
            grado: 'K5',
            nombre: 'MAZZONI, FRANCO',
        },
        {
            familia: '8591',
            grado: 'K5',
            nombre: 'MORGAN, ANA',
        },
        {
            familia: '8601',
            grado: 'K5',
            nombre: 'PAPALIA, FELIPE',
        },
        {
            familia: '8568',
            grado: 'K5',
            nombre: 'PASTORI, GUADALUPE',
        },
        {
            familia: '8650',
            grado: 'K5',
            nombre: 'PERFARE, MILO',
        },
        {
            familia: '8692',
            grado: 'K5',
            nombre: 'POZO GOWLAND, RUFINA',
        },
        {
            familia: '8629',
            grado: 'K5',
            nombre: 'RIOBO ARAOZ, FELIPE',
        },
        {
            familia: '8624',
            grado: 'K5',
            nombre: 'SANCHEZ SUED, FRANCISCO',
        },
        {
            familia: '8574',
            grado: 'K5',
            nombre: 'SANTOS IVULIC, MARTINA',
        },
        {
            familia: '8598',
            grado: 'K5',
            nombre: 'STEFANI, SOFIA',
        },
        {
            familia: '8512',
            grado: 'K5',
            nombre: 'TESTA, MARTIN NICOLAS',
        },
        {
            familia: '8588',
            grado: '1',
            nombre: 'ALSOGARAY, IÑAKI GUILLERMO',
        },
        {
            familia: '8695',
            grado: '1',
            nombre: 'ANDRADE, BARTOLOME',
        },
        {
            familia: '8541',
            grado: '1',
            nombre: 'BENEGAS, JACINTA',
        },
        {
            familia: '8700',
            grado: '1',
            nombre: 'BONILLA, BELISARIO',
        },
        {
            familia: '8579',
            grado: '1',
            nombre: 'BOUZADA MENDEZ, MARGARITA',
        },
        {
            familia: '8548',
            grado: '1',
            nombre: 'DABOS ESTEVEZ CAMBRA, FERMIN',
        },
        {
            familia: '8162',
            grado: '1',
            nombre: 'ELIZALDE, RENATA',
        },
        {
            familia: '8539',
            grado: '1',
            nombre: 'FERNANDEZ OCAMPO, INES',
        },
        {
            familia: '8611',
            grado: '1',
            nombre: 'GAVIÑA NAON, JUSTO',
        },
        {
            familia: '8460',
            grado: '1',
            nombre: 'GONZALEZ MAYA, ESMERALDA MARIA',
        },
        {
            familia: '8547',
            grado: '1',
            nombre: 'GOÑI, IGNACIO JOSE',
        },
        {
            familia: '8612',
            grado: '1',
            nombre: 'GUEMES, AZUL',
        },
        {
            familia: '8540',
            grado: '1',
            nombre: 'HASSOUN, FELIX OMAR',
        },
        {
            familia: '8562',
            grado: '1',
            nombre: 'HERZ, ALBERTINA',
        },
        {
            familia: '8481',
            grado: '1',
            nombre: 'LAURENCE, FELIX',
        },
        {
            familia: '8578',
            grado: '1',
            nombre: 'LIBERATORE, OLIVIA',
        },
        {
            familia: '8582',
            grado: '1',
            nombre: 'MAYA, BERNARDO JOSE',
        },
        {
            familia: '8251',
            grado: '1',
            nombre: 'MUR, CATALINA',
        },
        {
            familia: '8605',
            grado: '1',
            nombre: 'PICCIONI, TIMOTEO',
        },
        {
            familia: '8550',
            grado: '1',
            nombre: 'PRUNEDA LANDGRAF, JORGE MARIA',
        },
        {
            familia: '8553',
            grado: '1',
            nombre: 'RAYBAUD, JACINTA',
        },
        {
            familia: '8571',
            grado: '1',
            nombre: 'SABANES LAMBRE, TEO',
        },
        {
            familia: '8499',
            grado: '1',
            nombre: 'SARRABAYROUSE, IÑAKI',
        },
        {
            familia: '8567',
            grado: '1',
            nombre: 'SERVENTE, FACUNDO',
        },
        {
            familia: '8556',
            grado: '1',
            nombre: 'VACAREZZA CARLEVARO, DELFINA',
        },
        {
            familia: '8556',
            grado: '1',
            nombre: 'VACAREZZA CARLEVARO, FELICITAS',
        },
        {
            familia: '8580',
            grado: '1',
            nombre: 'VILLAMAYOR OTERO, TOMAS',
        },
        {
            familia: '8662',
            grado: '1',
            nombre: 'WERNER BIAUS, RUFINA',
        },
        {
            familia: '8496',
            grado: '1',
            nombre: 'ZICIS, SILVESTRE ALEJANDRO',
        },
        {
            familia: '8441',
            grado: '2',
            nombre: 'ALMEIDA RISOLO, SOFIA',
        },
        {
            familia: '8160',
            grado: '2',
            nombre: 'BASSANI LAXAGUE, JUAN MARIA',
        },
        {
            familia: '8224',
            grado: '2',
            nombre: 'BENSON, FILIPPA',
        },
        {
            familia: '8519',
            grado: '2',
            nombre: 'BRETON GIL, MANUEL',
        },
        {
            familia: '8142',
            grado: '2',
            nombre: 'BUSTILLO, SOFIA',
        },
        {
            familia: '8517',
            grado: '2',
            nombre: 'CARRACEDO, LOLA',
        },
        {
            familia: '8450',
            grado: '2',
            nombre: 'CONDOMI ALCORTA, LUCIA',
        },
        {
            familia: '8444',
            grado: '2',
            nombre: 'DANERI, TORIBIO',
        },
        {
            familia: '8467',
            grado: '2',
            nombre: 'DE ALL, EMILIA',
        },
        {
            familia: '8559',
            grado: '2',
            nombre: 'ESPECTOR, IVAN',
        },
        {
            familia: '8513',
            grado: '2',
            nombre: 'FATTORI, BAUTISTA',
        },
        {
            familia: '8623',
            grado: '2',
            nombre: 'GARCIA BALCARCE, LIBERTAD',
        },
        {
            familia: '8122',
            grado: '2',
            nombre: 'GARINO, LUISA',
        },
        {
            familia: '8518',
            grado: '2',
            nombre: 'GARROCHO, LORENZO',
        },
        {
            familia: '8515',
            grado: '2',
            nombre: 'GAYNOR ROSELL, LUISA MARIA',
        },
        {
            familia: '8698',
            grado: '2',
            nombre: 'GUADALUPE, MATIAS',
        },
        {
            familia: '8461',
            grado: '2',
            nombre: 'MAIDANA SPERANZA, TOMAS',
        },
        {
            familia: '8150',
            grado: '2',
            nombre: 'NOVOA, OLIVERIO',
        },
        {
            familia: '8141',
            grado: '2',
            nombre: 'ORTIZ DE ROZAS, ESMERALDA MARIA',
        },
        {
            familia: '8568',
            grado: '2',
            nombre: 'PASTORI, JOAQUIN',
        },
        {
            familia: '8609',
            grado: '2',
            nombre: 'PERROTAT, JULIA',
        },
        {
            familia: '8589',
            grado: '2',
            nombre: 'PRUNEDA PERDOMO, MANUEL JOSE',
        },
        {
            familia: '8549',
            grado: '2',
            nombre: 'RESANO BOTHAMLEY, CIRILO',
        },
        {
            familia: '8629',
            grado: '2',
            nombre: 'RIOBO ARAOZ, OLIVIA',
        },
        {
            familia: '8242',
            grado: '2',
            nombre: 'RODRIGUEZ LARA, MARCOS',
        },
        {
            familia: '8520',
            grado: '2',
            nombre: 'ROJO VIVOT, TOMAS',
        },
        {
            familia: '8514',
            grado: '2',
            nombre: 'ROSSI, JOAQUINA',
        },
        {
            familia: '8564',
            grado: '2',
            nombre: 'ROZAS, DANTE FRANCISCO',
        },
        {
            familia: '8512',
            grado: '2',
            nombre: 'TESTA, SEBASTIAN LUCA',
        },
        {
            familia: '8491',
            grado: '3',
            nombre: 'BERTELLA, PEDRO',
        },
        {
            familia: '8484',
            grado: '3',
            nombre: 'BRAVO SUISSIS, ALFONSO',
        },
        {
            familia: '8158',
            grado: '3',
            nombre: 'CALP, GUADALUPE',
        },
        {
            familia: '8453',
            grado: '3',
            nombre: 'CANESE, SERAFIN',
        },
        {
            familia: '8492',
            grado: '3',
            nombre: 'CASTRO, MERCEDES',
        },
        {
            familia: '8497',
            grado: '3',
            nombre: 'COROAS, SIMON',
        },
        {
            familia: '8483',
            grado: '3',
            nombre: 'CUETO MERCIER, ARANZAZU MARIA',
        },
        {
            familia: '8486',
            grado: '3',
            nombre: 'DIAZ SAUBIDET, SIMON',
        },
        {
            familia: '8485',
            grado: '3',
            nombre: 'FIJTMAN, HELENA MARIA',
        },
        {
            familia: '8480',
            grado: '3',
            nombre: 'GALARCE, ANTONIO',
        },
        {
            familia: '8489',
            grado: '3',
            nombre: 'GONZALEZ CORREAS, MARTIN',
        },
        {
            familia: '8482',
            grado: '3',
            nombre: 'GONZALEZ GUNSKI, SOFIA',
        },
        {
            familia: '8245',
            grado: '3',
            nombre: 'GONZALEZ LARSSEN, MANUELA',
        },
        {
            familia: '8488',
            grado: '3',
            nombre: 'IRRERA, AMELIA',
        },
        {
            familia: '8481',
            grado: '3',
            nombre: 'LAURENCE, EMMA',
        },
        {
            familia: '8340',
            grado: '3',
            nombre: 'LO BIANCO, ALINA',
        },
        {
            familia: '8494',
            grado: '3',
            nombre: 'LOPEZ VINCI, LUCIO',
        },
        {
            familia: '8342',
            grado: '3',
            nombre: 'LUGONES, RUFINO',
        },
        {
            familia: '8659',
            grado: '3',
            nombre: 'MANZITTI, BRUNO',
        },
        {
            familia: '8557',
            grado: '3',
            nombre: 'MARTINEZ JONES, ISABEL',
        },
        {
            familia: '8307',
            grado: '3',
            nombre: 'MAS FERNANDEZ NUÑEZ, ANTONIA',
        },
        {
            familia: '8558',
            grado: '3',
            nombre: 'PEREIRA, ANTONIA',
        },
        {
            familia: '8605',
            grado: '3',
            nombre: 'PICCIONI, TORIBIO',
        },
        {
            familia: '8051',
            grado: '3',
            nombre: 'PONCIO RUIVAL, RAMON',
        },
        {
            familia: '8499',
            grado: '3',
            nombre: 'SARRABAYROUSE, JOAQUIN',
        },
        {
            familia: '8487',
            grado: '3',
            nombre: 'SOLARI, FAUSTINO',
        },
        {
            familia: '8490',
            grado: '3',
            nombre: 'SOLER PUJOL, FAUSTINA',
        },
        {
            familia: '8493',
            grado: '3',
            nombre: 'STRASSERA, JULIA',
        },
        {
            familia: '8493',
            grado: '3',
            nombre: 'STRASSERA, OLIVIA',
        },
        {
            familia: '8496',
            grado: '3',
            nombre: 'ZICIS, ANA',
        },
        {
            familia: '8473',
            grado: '4',
            nombre: 'ALIAGA, CATALINA',
        },
        {
            familia: '8459',
            grado: '4',
            nombre: 'ANTONIETTI, SOFIA',
        },
        {
            familia: '8308',
            grado: '4',
            nombre: 'APRAIZ, SANTIAGO',
        },
        {
            familia: '8100',
            grado: '4',
            nombre: 'BIETTI, DELFINA',
        },
        {
            familia: '8225',
            grado: '4',
            nombre: 'BORDA, FELICITAS',
        },
        {
            familia: '8243',
            grado: '4',
            nombre: 'CAMPLONE, AURORA',
        },
        {
            familia: '8469',
            grado: '4',
            nombre: 'CASTELNUOVO CAMBIASSO, FAUSTINO',
        },
        {
            familia: '8470',
            grado: '4',
            nombre: 'CHIARADIA, VICENTE',
        },
        {
            familia: '8458',
            grado: '4',
            nombre: 'CILLEY RUIVAL, JUANA',
        },
        {
            familia: '8467',
            grado: '4',
            nombre: 'DE ALL, BALDOMERO',
        },
        {
            familia: '8197',
            grado: '4',
            nombre: 'DIMET, BAUTISTA',
        },
        {
            familia: '8022',
            grado: '4',
            nombre: 'GARCIA LLANO, PAZ',
        },
        {
            familia: '8460',
            grado: '4',
            nombre: 'GONZALEZ MAYA, BALTASAR TABARE',
        },
        {
            familia: '8612',
            grado: '4',
            nombre: 'GUEMES, RUFINO',
        },
        {
            familia: '8562',
            grado: '4',
            nombre: 'HERZ, ANTONIA',
        },
        {
            familia: '8457',
            grado: '4',
            nombre: 'MACHIAVELLO, IGNACIO',
        },
        {
            familia: '8461',
            grado: '4',
            nombre: 'MAIDANA SPERANZA, SOFIA',
        },
        {
            familia: '8659',
            grado: '4',
            nombre: 'MANZITTI, FRANCO',
        },
        {
            familia: '8464',
            grado: '4',
            nombre: 'MARINO, OLIVIA',
        },
        {
            familia: '8466',
            grado: '4',
            nombre: 'MARTIN BONITO, FRANCISCA',
        },
        {
            familia: '8338',
            grado: '4',
            nombre: 'MASSOT, SANTOS MARIA',
        },
        {
            familia: '8251',
            grado: '4',
            nombre: 'MUR, FRANCISCO',
        },
        {
            familia: '8607',
            grado: '4',
            nombre: 'POLLEDO, SERENA',
        },
        {
            familia: '8608',
            grado: '4',
            nombre: 'RESANO SCHINONI, AGUSTIN',
        },
        {
            familia: '8587',
            grado: '4',
            nombre: 'ROSPIDE GORTARI, IKER',
        },
        {
            familia: '8504',
            grado: '4',
            nombre: 'STEGMANN, GREGORIO',
        },
        {
            familia: '8147',
            grado: '4',
            nombre: 'SUMMERS, ALINE',
        },
        {
            familia: '7025',
            grado: '4',
            nombre: 'TESAN, MANUELA',
        },
        {
            familia: '8448',
            grado: '4',
            nombre: 'VITALITI BARE, TOMAS',
        },
        {
            familia: '8441',
            grado: '5',
            nombre: 'ALMEIDA RISOLO, LOLA',
        },
        {
            familia: '8320',
            grado: '5',
            nombre: 'ARAOZ, CAMILA',
        },
        {
            familia: '8314',
            grado: '5',
            nombre: 'BALSELLS, CATALINA',
        },
        {
            familia: '8244',
            grado: '5',
            nombre: 'BENEDIT, FRANCISCA',
        },
        {
            familia: '8491',
            grado: '5',
            nombre: 'BERTELLA, CIRO',
        },
        {
            familia: '8463',
            grado: '5',
            nombre: 'CALDERON SCHKAIR, FAUSTINA',
        },
        {
            familia: '8453',
            grado: '5',
            nombre: 'CANESE, ELENA',
        },
        {
            familia: '8136',
            grado: '5',
            nombre: 'CARVERI PASTORINO, FELICITAS',
        },
        {
            familia: '8525',
            grado: '5',
            nombre: 'CHARRÓ, IÑAKI',
        },
        {
            familia: '8450',
            grado: '5',
            nombre: 'CONDOMI ALCORTA, INES',
        },
        {
            familia: '8444',
            grado: '5',
            nombre: 'DANERI, HILARIO',
        },
        {
            familia: '8261',
            grado: '5',
            nombre: 'GARRAHAN, ALLEGRA',
        },
        {
            familia: '8130',
            grado: '5',
            nombre: 'HUERGO, MARGARITA',
        },
        {
            familia: '8343',
            grado: '5',
            nombre: 'IRIGOYEN, LUIS',
        },
        {
            familia: '8207',
            grado: '5',
            nombre: 'LANDGRAF, ANTONIO SANTIAGO',
        },
        {
            familia: '8115',
            grado: '5',
            nombre: 'LE BOURGEOIS, FELIPE',
        },
        {
            familia: '8340',
            grado: '5',
            nombre: 'LO BIANCO, FRANCISCO',
        },
        {
            familia: '8674',
            grado: '5',
            nombre: 'LUCERO SCHMIDT, SANTIAGO',
        },
        {
            familia: '8342',
            grado: '5',
            nombre: 'LUGONES, DELFINA',
        },
        {
            familia: '8338',
            grado: '5',
            nombre: 'MASSOT, SILVESTRE MARIA',
        },
        {
            familia: '8582',
            grado: '5',
            nombre: 'MAYA, LOURDES',
        },
        {
            familia: '8344',
            grado: '5',
            nombre: 'OLAZABAL, TEODELINA',
        },
        {
            familia: '8344',
            grado: '5',
            nombre: 'OLAZABAL, TOBIAS',
        },
        {
            familia: '6094',
            grado: '5',
            nombre: 'ORTIZ PANDO, VICTORIA',
        },
        {
            familia: '8242',
            grado: '5',
            nombre: 'RODRIGUEZ LARA, MIGUEL',
        },
        {
            familia: '8337',
            grado: '5',
            nombre: 'RODRIGUEZ, BELTRAN',
        },
        {
            familia: '8640',
            grado: '5',
            nombre: 'SCHKAIR, ROSARIO',
        },
        {
            familia: '8448',
            grado: '5',
            nombre: 'VITALITI BARE, MATEO',
        },
        {
            familia: '8315',
            grado: '6',
            nombre: 'ALVAREZ PASTORINO, LOLA',
        },
        {
            familia: '8308',
            grado: '6',
            nombre: 'APRAIZ, FELIPE',
        },
        {
            familia: '8160',
            grado: '6',
            nombre: 'BASSANI LAXAGUE, BERNARDO',
        },
        {
            familia: '8224',
            grado: '6',
            nombre: 'BENSON, LUISA',
        },
        {
            familia: '8177',
            grado: '6',
            nombre: 'BORGMANN, FERMIN',
        },
        {
            familia: '4023',
            grado: '6',
            nombre: 'BRAVO, PEDRO',
        },
        {
            familia: '8171',
            grado: '6',
            nombre: 'BRAVO, RAMON',
        },
        {
            familia: '8645',
            grado: '6',
            nombre: 'BUCHANAN, OLIVIA',
        },
        {
            familia: '8088',
            grado: '6',
            nombre: 'CARERI, MARIA PAZ',
        },
        {
            familia: '8124',
            grado: '6',
            nombre: 'DE CICCO, MIGUEL',
        },
        {
            familia: '8162',
            grado: '6',
            nombre: 'ELIZALDE, PIA',
        },
        {
            familia: '8446',
            grado: '6',
            nombre: 'FRAGUEIRO FRIAS, SANTOS',
        },
        {
            familia: '8022',
            grado: '6',
            nombre: 'GARCIA LLANO, CAMILA',
        },
        {
            familia: '8217',
            grado: '6',
            nombre: 'LANUS, EMILIA',
        },
        {
            familia: '8674',
            grado: '6',
            nombre: 'LUCERO SCHMIDT, MARTIN',
        },
        {
            familia: '8255',
            grado: '6',
            nombre: 'MAIZ CASAS, MIA',
        },
        {
            familia: '8317',
            grado: '6',
            nombre: 'MARIN, JOAQUINA',
        },
        {
            familia: '8307',
            grado: '6',
            nombre: 'MAS FERNANDEZ NUÑEZ, MARGARITA',
        },
        {
            familia: '8538',
            grado: '6',
            nombre: 'POPPE, PHILO',
        },
        {
            familia: '8306',
            grado: '6',
            nombre: 'PRIETO CANE, BELTRAN',
        },
        {
            familia: '8613',
            grado: '6',
            nombre: 'QUINTANA, FELICITAS',
        },
        {
            familia: '8565',
            grado: '6',
            nombre: 'RODRIGUEZ BRIZUELA, FEDERICO',
        },
        {
            familia: '8093',
            grado: '6',
            nombre: 'RODRIGUEZ PUJOL, SOFIA',
        },
        {
            familia: '8502',
            grado: '6',
            nombre: 'SARAVIA, JUSTINA',
        },
        {
            familia: '6071',
            grado: '6',
            nombre: 'STURLA, OLIVIA',
        },
        {
            familia: '8305',
            grado: '6',
            nombre: 'TUPA, MATEO FRANCISCO',
        },
        {
            familia: '8471',
            grado: '6',
            nombre: 'ZORRAQUIN, JUANA',
        },
        {
            familia: '8320',
            grado: '7',
            nombre: 'ARAOZ, JUANA',
        },
        {
            familia: '8314',
            grado: '7',
            nombre: 'BALSELLS, FRANCISCA',
        },
        {
            familia: '8700',
            grado: '7',
            nombre: 'BONILLA, BAUTISTA',
        },
        {
            familia: '8193',
            grado: '7',
            nombre: 'BOTHAMLEY, CRUZ',
        },
        {
            familia: '8142',
            grado: '7',
            nombre: 'BUSTILLO, CARLOS',
        },
        {
            familia: '8243',
            grado: '7',
            nombre: 'CAMPLONE, MARGARITA',
        },
        {
            familia: '8450',
            grado: '7',
            nombre: 'CONDOMI ALCORTA, JOSE',
        },
        {
            familia: '8122',
            grado: '7',
            nombre: 'GARINO, RAMON',
        },
        {
            familia: '8611',
            grado: '7',
            nombre: 'GAVIÑA NAON, ISABEL',
        },
        {
            familia: '8245',
            grado: '7',
            nombre: 'GONZALEZ LARSSEN, LUZ',
        },
        {
            familia: '8593',
            grado: '7',
            nombre: 'LANUSSE, VICTORIA',
        },
        {
            familia: '8253',
            grado: '7',
            nombre: 'LOPEZ ALFARO, FRANCISCO',
        },
        {
            familia: '8255',
            grado: '7',
            nombre: 'MAIZ CASAS, BENJAMIN',
        },
        {
            familia: '8659',
            grado: '7',
            nombre: 'MANZITTI, ROCCO',
        },
        {
            familia: '8582',
            grado: '7',
            nombre: 'MAYA, ALFONSO JOSE',
        },
        {
            familia: '6074',
            grado: '7',
            nombre: 'MOYANO, CATALINA ANA',
        },
        {
            familia: '8251',
            grado: '7',
            nombre: 'MUR, FELICITAS',
        },
        {
            familia: '8150',
            grado: '7',
            nombre: 'NOVOA, JACINTO',
        },
        {
            familia: '8344',
            grado: '7',
            nombre: 'OLAZABAL, FELIX',
        },
        {
            familia: '8501',
            grado: '7',
            nombre: 'POLO, ALFONSO',
        },
        {
            familia: '8108',
            grado: '7',
            nombre: 'POSE BAZTERRICA, SOL',
        },
        {
            familia: '8643',
            grado: '7',
            nombre: 'RAGGIO, TERESA',
        },
        {
            familia: '8565',
            grado: '7',
            nombre: 'RODRIGUEZ BRIZUELA, SANTIAGO',
        },
        {
            familia: '8242',
            grado: '7',
            nombre: 'RODRIGUEZ LARA, DELFINA',
        },
        {
            familia: '8208',
            grado: '7',
            nombre: 'RUIZ POSSE, PEDRO',
        },
        {
            familia: '8502',
            grado: '7',
            nombre: 'SARAVIA, ADOLFO',
        },
        {
            familia: '8691',
            grado: '7',
            nombre: 'VILLAMAYOR, SALVADOR',
        },
        {
            familia: '8704',
            grado: '6',
            nombre: 'TORRICO, FELIPE',
        },
        {
            familia: '8708',
            grado: '3',
            nombre: 'CARRABS, FACUNDO',
        },
    ],
};
function transformData(data) {
    return data.list.map(function (item) {
        var lastName = item.nombre.split(',').map(function (str) { return str.trim(); })[0];
        return {
            lastName: lastName,
            familyCode: item.familia,
        };
    });
}
// --- Ejecutar la función y escribir el resultado ---
var result = transformData(inputData);
// Escribir el resultado en un archivo .json
(0, fs_1.writeFileSync)('output.json', JSON.stringify(result, null, 2), 'utf-8');
console.log('✅ Archivo "output.json" generado correctamente.');
