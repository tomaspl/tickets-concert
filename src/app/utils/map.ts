import { Family } from '../model/Family';
import { Seat } from '../model/Seat';
import { SectionStage } from '../model/SectionStage';

export function sanitizeMap(toJSON: any) {
  const stageMap: SectionStage[] = [];
  Object.keys(toJSON).forEach((section) => {
    let seats: Seat[][] = [];
    let currentRow = 0;
    Object.keys(toJSON[section]).forEach((seat) => {
      if (currentRow !== toJSON[section][seat].row) {
        //seats=[];
        const data: Seat[] = [
          {
            row: toJSON[section][seat].row,
            seat: toJSON[section][seat].seat,
            familyCode: toJSON[section][seat].familyCode,
            lastName: toJSON[section][seat].lastName,
            familyId: toJSON[section][seat].familyId,
            enabled: toJSON[section][seat].enabled,
            id: seat,
          },
        ];
        seats.push(data);
      } else {
        const data: Seat = {
          row: toJSON[section][seat].row,
          seat: toJSON[section][seat].seat,
          familyCode: toJSON[section][seat].familyCode,
          lastName: toJSON[section][seat].lastName,
          familyId: toJSON[section][seat].familyId,
          enabled: toJSON[section][seat].enabled,
          id: seat,
        };
        const currentIndex = seats.length - 1;
        seats[currentIndex].push(data);
      }
      currentRow = toJSON[section][seat].row;
    });
    const sectionObject: SectionStage = {
      sectionName: section,
      seats,
    };
    stageMap.push(sectionObject);
  });
  return stageMap;
}

export function sanitizeFamily(toJSON: any) {
  const families: Family[] = [];
  Object.keys(toJSON).forEach((familyId) => {
    const familyData: Family = {
      familyId: familyId,
      familyCode: toJSON[familyId].familyCode,
      lastName: toJSON[familyId].lastName,
      availableSeats: toJSON[familyId].availableSeats,
      preventa: toJSON[familyId].preventa,
    };
    families.push(familyData);
  });
  return families;
}
