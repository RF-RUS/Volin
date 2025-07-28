export interface CarModel {
  make: string;
  model: string;
  yearStart?: number;
  yearEnd?: number;
  frontSuspension: 'mcpherson' | 'independent' | 'dependent' | 'double-wishbone' | 'multi-link';
  rearSuspension: 'independent' | 'dependent' | 'multi-link' | 'torsion-beam' | 'leaf-spring';
}

export interface CarMake {
  name: string;
  models: CarModel[];
} 