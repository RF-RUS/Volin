import type { CarModel, CarMake } from '../types/car';

export const carsDatabase: CarMake[] = [
  {
    name: 'Toyota',
    models: [
      { make: 'Toyota', model: 'Camry', yearStart: 2018, frontSuspension: 'mcpherson', rearSuspension: 'independent' },
      { make: 'Toyota', model: 'Corolla', yearStart: 2019, frontSuspension: 'mcpherson', rearSuspension: 'torsion-beam' },
      { make: 'Toyota', model: 'RAV4', yearStart: 2019, frontSuspension: 'mcpherson', rearSuspension: 'independent' },
      { make: 'Toyota', model: 'Land Cruiser', yearStart: 2016, frontSuspension: 'independent', rearSuspension: 'dependent' },
      { make: 'Toyota', model: 'Prius', yearStart: 2016, frontSuspension: 'mcpherson', rearSuspension: 'torsion-beam' },
    ]
  },
  {
    name: 'BMW',
    models: [
      { make: 'BMW', model: '3 Series', yearStart: 2019, frontSuspension: 'double-wishbone', rearSuspension: 'multi-link' },
      { make: 'BMW', model: '5 Series', yearStart: 2017, frontSuspension: 'double-wishbone', rearSuspension: 'multi-link' },
      { make: 'BMW', model: 'X3', yearStart: 2018, frontSuspension: 'double-wishbone', rearSuspension: 'multi-link' },
      { make: 'BMW', model: 'X5', yearStart: 2019, frontSuspension: 'double-wishbone', rearSuspension: 'multi-link' },
    ]
  },
  {
    name: 'Mercedes-Benz',
    models: [
      { make: 'Mercedes-Benz', model: 'C-Class', yearStart: 2021, frontSuspension: 'multi-link', rearSuspension: 'multi-link' },
      { make: 'Mercedes-Benz', model: 'E-Class', yearStart: 2020, frontSuspension: 'multi-link', rearSuspension: 'multi-link' },
      { make: 'Mercedes-Benz', model: 'GLC', yearStart: 2019, frontSuspension: 'multi-link', rearSuspension: 'multi-link' },
    ]
  },
  {
    name: 'Volkswagen',
    models: [
      { make: 'Volkswagen', model: 'Golf', yearStart: 2020, frontSuspension: 'mcpherson', rearSuspension: 'multi-link' },
      { make: 'Volkswagen', model: 'Passat', yearStart: 2019, frontSuspension: 'mcpherson', rearSuspension: 'multi-link' },
      { make: 'Volkswagen', model: 'Tiguan', yearStart: 2018, frontSuspension: 'mcpherson', rearSuspension: 'multi-link' },
    ]
  },
  {
    name: 'Audi',
    models: [
      { make: 'Audi', model: 'A4', yearStart: 2020, frontSuspension: 'multi-link', rearSuspension: 'multi-link' },
      { make: 'Audi', model: 'A6', yearStart: 2019, frontSuspension: 'multi-link', rearSuspension: 'multi-link' },
      { make: 'Audi', model: 'Q5', yearStart: 2018, frontSuspension: 'multi-link', rearSuspension: 'multi-link' },
    ]
  },
  {
    name: 'Hyundai',
    models: [
      { make: 'Hyundai', model: 'Elantra', yearStart: 2021, frontSuspension: 'mcpherson', rearSuspension: 'torsion-beam' },
      { make: 'Hyundai', model: 'Sonata', yearStart: 2020, frontSuspension: 'mcpherson', rearSuspension: 'multi-link' },
      { make: 'Hyundai', model: 'Tucson', yearStart: 2021, frontSuspension: 'mcpherson', rearSuspension: 'multi-link' },
    ]
  },
  {
    name: 'Kia',
    models: [
      { make: 'Kia', model: 'Rio', yearStart: 2020, frontSuspension: 'mcpherson', rearSuspension: 'torsion-beam' },
      { make: 'Kia', model: 'Optima', yearStart: 2019, frontSuspension: 'mcpherson', rearSuspension: 'multi-link' },
      { make: 'Kia', model: 'Sportage', yearStart: 2022, frontSuspension: 'mcpherson', rearSuspension: 'multi-link' },
    ]
  },
  {
    name: 'Ford',
    models: [
      { make: 'Ford', model: 'Focus', yearStart: 2018, frontSuspension: 'mcpherson', rearSuspension: 'torsion-beam' },
      { make: 'Ford', model: 'Mondeo', yearStart: 2019, frontSuspension: 'mcpherson', rearSuspension: 'multi-link' },
      { make: 'Ford', model: 'Kuga', yearStart: 2020, frontSuspension: 'mcpherson', rearSuspension: 'multi-link' },
    ]
  },
  {
    name: 'Nissan',
    models: [
      { make: 'Nissan', model: 'Sentra', yearStart: 2020, frontSuspension: 'mcpherson', rearSuspension: 'torsion-beam' },
      { make: 'Nissan', model: 'Altima', yearStart: 2019, frontSuspension: 'mcpherson', rearSuspension: 'multi-link' },
      { make: 'Nissan', model: 'X-Trail', yearStart: 2021, frontSuspension: 'mcpherson', rearSuspension: 'multi-link' },
    ]
  },
  {
    name: 'Honda',
    models: [
      { make: 'Honda', model: 'Civic', yearStart: 2022, frontSuspension: 'mcpherson', rearSuspension: 'multi-link' },
      { make: 'Honda', model: 'Accord', yearStart: 2018, frontSuspension: 'mcpherson', rearSuspension: 'multi-link' },
      { make: 'Honda', model: 'CR-V', yearStart: 2020, frontSuspension: 'mcpherson', rearSuspension: 'multi-link' },
    ]
  }
];

export const suspensionTypes = {
  front: [
    { value: 'mcpherson', label: 'McPherson' },
    { value: 'independent', label: 'Независимая' },
    { value: 'dependent', label: 'Зависимая' },
    { value: 'double-wishbone', label: 'Двухрычажная' },
    { value: 'multi-link', label: 'Многорычажная' }
  ],
  rear: [
    { value: 'independent', label: 'Независимая' },
    { value: 'dependent', label: 'Зависимая' },
    { value: 'multi-link', label: 'Многорычажная' },
    { value: 'torsion-beam', label: 'Торсионная балка' },
    { value: 'leaf-spring', label: 'Рессорная' }
  ]
};

// Функции для работы с базой данных
export function getAllMakes(): string[] {
  return carsDatabase.map(make => make.name).sort();
}

export function getModelsByMake(makeName: string): CarModel[] {
  const make = carsDatabase.find(m => m.name.toLowerCase() === makeName.toLowerCase());
  return make ? make.models : [];
}

export function findCarByMakeAndModel(makeName: string, modelName: string): CarModel | null {
  const make = carsDatabase.find(m => m.name.toLowerCase() === makeName.toLowerCase());
  if (!make) return null;
  
  const model = make.models.find(m => m.model.toLowerCase() === modelName.toLowerCase());
  return model || null;
}

export function addNewCar(carData: CarModel): void {
  let make = carsDatabase.find(m => m.name.toLowerCase() === carData.make.toLowerCase());
  
  if (!make) {
    // Создаем новую марку
    make = { name: carData.make, models: [] };
    carsDatabase.push(make);
  }
  
  // Проверяем, что модель еще не существует
  const existingModel = make.models.find(m => m.model.toLowerCase() === carData.model.toLowerCase());
  if (!existingModel) {
    make.models.push(carData);
  }
}

export function searchCars(query: string): CarModel[] {
  const lowerQuery = query.toLowerCase();
  const results: CarModel[] = [];
  
  carsDatabase.forEach(make => {
    make.models.forEach(model => {
      if (
        make.name.toLowerCase().includes(lowerQuery) ||
        model.model.toLowerCase().includes(lowerQuery)
      ) {
        results.push(model);
      }
    });
  });
  
  return results;
} 