
const BASE_URL = 'http://localhost:8081/api/resources';

const mainSides = ['A', 'B'];
const mainFloors = [3, 4, 5, 6];

const newSides = ['F', 'G'];
const newFloors = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

const labCaps = [25, 60];
const hallCaps = [250, 175, 100];

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateLocationDetails(isMain) {
  const side = isMain ? randomChoice(mainSides) : randomChoice(newSides);
  const floor = isMain ? randomChoice(mainFloors) : randomChoice(newFloors);
  const number = String(Math.floor(Math.random() * 20) + 1).padStart(2, '0');
  const code = `${side}${floor}${number}`;
  const buildingName = isMain ? 'Main Building' : 'New Building';
  const locationString = `${buildingName}, Side ${side}, Floor ${floor}, Room ${number}`;
  
  return { code, locationString };
}

async function createResource(resourceData) {
  try {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(resourceData)
    });
    if (!res.ok) {
      console.log('Error:', res.status, res.statusText);
    } else {
      console.log('Created:', resourceData.name);
    }
  } catch (err) {
    console.log('Error:', res.status, res.statusText);
  }
}

async function run() {
  console.log('Starting seed process...');
  const unusedSet = new Set();
  
  // Create 20 Lecture Halls
  for(let i = 0; i < 20; i++) {
    let loc;
    do {
      loc = generateLocationDetails(Math.random() > 0.5);
    } while(unusedSet.has(loc.code));
    unusedSet.add(loc.code);

    await createResource({
      name: `Lecture Hall ${loc.code}`,
      type: 'LECTURE_HALL',
      status: 'ACTIVE',
      capacity: randomChoice(hallCaps),
      location: loc.locationString,
      availabilityWindows: 'Mon-Sun 08:00-17:30',
      description: `A standard lecture hall located in the ${loc.locationString.split(',')[0]}. Equipped with a projector and sound system.`
    });
  }

  // Create 15 Labs
  for(let i = 0; i < 15; i++) {
    let loc;
    do {
      loc = generateLocationDetails(Math.random() > 0.5);
    } while(unusedSet.has(loc.code));
    unusedSet.add(loc.code);

    await createResource({
      name: `Lab ${loc.code}`,
      type: 'LAB',
      status: 'ACTIVE',
      capacity: randomChoice(labCaps),
      location: loc.locationString,
      availabilityWindows: 'Mon-Sun 08:00-20:30',
      description: `A teaching laboratory located in the ${loc.locationString.split(',')[0]}. Contains specialized equipment and workstations.`
    });
  }
  
  console.log('Finished creating resources. Now randomly setting 3 to OUT_OF_SERVICE...');
  
  // Set 3 to OUT_OF_SERVICE
  try {
    const listRes = await fetch(BASE_URL);
    if (!listRes.ok) {
       console.log('Error:', res.status, res.statusText);
       return;
    }
    const resources = await listRes.json();
    for (let i = 0; i < 3 && i < resources.length; i++) {
      const target = resources[i]; // just pick first 3 since they are newly added or random
      await fetch(`${BASE_URL}/${target.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'OUT_OF_SERVICE' })
      });
      console.log(`Set ${target.name} to OUT_OF_SERVICE`);
    }
  } catch(e) {
    console.log('Error:', res.status, res.statusText);
  }
}

run();
