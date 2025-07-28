import React, { useState, useEffect } from 'react';
import { 
  getAllMakes, 
  getModelsByMake, 
  findCarByMakeAndModel, 
  addNewCar, 
  searchCars, 
  suspensionTypes
} from '../data/carsDatabase';
import type { CarModel } from '../types/car';

interface CarSelectorProps {
  onCarSelect: (carData: {
    car: string;
    frontSuspensionType: string;
    rearSuspensionType: string;
  }) => void;
  initialCar?: string;
  initialFrontSuspension?: string;
  initialRearSuspension?: string;
}

export function CarSelector({ 
  onCarSelect, 
  initialCar = '', 
  initialFrontSuspension = '', 
  initialRearSuspension = '' 
}: CarSelectorProps) {
  const [selectedMake, setSelectedMake] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [carInput, setCarInput] = useState(initialCar);
  const [frontSuspension, setFrontSuspension] = useState(initialFrontSuspension);
  const [rearSuspension, setRearSuspension] = useState(initialRearSuspension);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchResults, setSearchResults] = useState<CarModel[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const makes = getAllMakes();

  // Поиск автомобилей при вводе
  useEffect(() => {
    if (searchQuery.length > 1) {
      const results = searchCars(searchQuery);
      setSearchResults(results.slice(0, 5)); // Показываем только первые 5 результатов
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  // Автоподстановка типов подвески при выборе модели
  useEffect(() => {
    if (selectedMake && selectedModel) {
      const carData = findCarByMakeAndModel(selectedMake, selectedModel);
      if (carData) {
        setFrontSuspension(carData.frontSuspension);
        setRearSuspension(carData.rearSuspension);
        setCarInput(`${selectedMake} ${selectedModel}`);
        
        onCarSelect({
          car: `${selectedMake} ${selectedModel}`,
          frontSuspensionType: carData.frontSuspension,
          rearSuspensionType: carData.rearSuspension
        });
      }
    }
  }, [selectedMake, selectedModel, onCarSelect]);

  // Уведомление родительского компонента об изменениях
  useEffect(() => {
    if (carInput || frontSuspension || rearSuspension) {
      onCarSelect({
        car: carInput,
        frontSuspensionType: frontSuspension,
        rearSuspensionType: rearSuspension
      });
    }
  }, [carInput, frontSuspension, rearSuspension, onCarSelect]);

  const handleMakeChange = (make: string) => {
    setSelectedMake(make);
    setSelectedModel('');
    setCarInput(make ? `${make} ` : '');
  };

  const handleModelChange = (model: string) => {
    setSelectedModel(model);
  };

  const handleSearchResultSelect = (car: CarModel) => {
    setSelectedMake(car.make);
    setSelectedModel(car.model);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleAddNewCar = (newCarData: CarModel) => {
    addNewCar(newCarData);
    setSelectedMake(newCarData.make);
    setSelectedModel(newCarData.model);
    setShowAddForm(false);
  };

  const modelsForSelectedMake = selectedMake ? getModelsByMake(selectedMake) : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Поиск автомобилей */}
      <div style={{ position: 'relative' }}>
        <label>
          Поиск автомобиля
          <input
            type="text"
            placeholder="Введите марку или модель..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%' }}
          />
        </label>
        
        {searchResults.length > 0 && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: '#fff',
            border: '1px solid #ddd',
            borderRadius: '4px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            zIndex: 1000,
            maxHeight: '200px',
            overflowY: 'auto'
          }}>
            {searchResults.map((car, idx) => (
              <div
                key={idx}
                style={{
                  padding: '8px 12px',
                  cursor: 'pointer',
                  borderBottom: '1px solid #eee'
                }}
                onClick={() => handleSearchResultSelect(car)}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}
              >
                <strong>{car.make} {car.model}</strong>
                <div style={{ fontSize: '0.9em', color: '#666' }}>
                  Передняя: {suspensionTypes.front.find(s => s.value === car.frontSuspension)?.label} | 
                  Задняя: {suspensionTypes.rear.find(s => s.value === car.rearSuspension)?.label}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Выбор марки и модели */}
      <div style={{ display: 'flex', gap: '16px' }}>
        <div style={{ flex: 1 }}>
          <label>
            Марка автомобиля
            <select 
              value={selectedMake} 
              onChange={(e) => handleMakeChange(e.target.value)}
              style={{ width: '100%' }}
            >
              <option value="">Выберите марку</option>
              {makes.map(make => (
                <option key={make} value={make}>{make}</option>
              ))}
            </select>
          </label>
        </div>

        <div style={{ flex: 1 }}>
          <label>
            Модель
            <select 
              value={selectedModel} 
              onChange={(e) => handleModelChange(e.target.value)}
              disabled={!selectedMake}
              style={{ width: '100%' }}
            >
              <option value="">Выберите модель</option>
              {modelsForSelectedMake.map(model => (
                <option key={model.model} value={model.model}>{model.model}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {/* Ручной ввод автомобиля */}
      <div>
        <label>
          Автомобиль (ручной ввод)
          <input
            type="text"
            placeholder="Марка Модель"
            value={carInput}
            onChange={(e) => setCarInput(e.target.value)}
            style={{ width: '100%' }}
          />
        </label>
      </div>

      {/* Типы подвески */}
      <div style={{ display: 'flex', gap: '16px' }}>
        <div style={{ flex: 1 }}>
          <label>
            Тип передней подвески
            <select 
              value={frontSuspension} 
              onChange={(e) => setFrontSuspension(e.target.value)}
              style={{ width: '100%' }}
            >
              <option value="">Выберите тип</option>
              {suspensionTypes.front.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </label>
        </div>

        <div style={{ flex: 1 }}>
          <label>
            Тип задней подвески
            <select 
              value={rearSuspension} 
              onChange={(e) => setRearSuspension(e.target.value)}
              style={{ width: '100%' }}
            >
              <option value="">Выберите тип</option>
              {suspensionTypes.rear.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {/* Кнопка добавления нового автомобиля */}
      <div>
        <button 
          type="button" 
          className="button"
          onClick={() => setShowAddForm(!showAddForm)}
          style={{ backgroundColor: '#28a745', marginTop: '8px' }}
        >
          {showAddForm ? 'Скрыть форму' : 'Добавить новый автомобиль'}
        </button>
      </div>

      {/* Форма добавления нового автомобиля */}
      {showAddForm && (
        <AddCarForm onAdd={handleAddNewCar} onCancel={() => setShowAddForm(false)} />
      )}
    </div>
  );
}

// Компонент для добавления нового автомобиля
function AddCarForm({ 
  onAdd, 
  onCancel 
}: { 
  onAdd: (car: CarModel) => void; 
  onCancel: () => void; 
}) {
  const [newCar, setNewCar] = useState<CarModel>({
    make: '',
    model: '',
    frontSuspension: 'mcpherson',
    rearSuspension: 'independent'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCar.make && newCar.model) {
      onAdd(newCar);
      setNewCar({
        make: '',
        model: '',
        frontSuspension: 'mcpherson',
        rearSuspension: 'independent'
      });
    }
  };

  return (
    <div style={{
      border: '2px solid #28a745',
      borderRadius: '8px',
      padding: '16px',
      backgroundColor: '#f8f9fa'
    }}>
      <h3 style={{ marginTop: 0, color: '#28a745' }}>Добавить новый автомобиль</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
          <div style={{ flex: 1 }}>
            <label>
              Марка *
              <input
                type="text"
                required
                value={newCar.make}
                onChange={(e) => setNewCar({...newCar, make: e.target.value})}
                style={{ width: '100%' }}
              />
            </label>
          </div>
          <div style={{ flex: 1 }}>
            <label>
              Модель *
              <input
                type="text"
                required
                value={newCar.model}
                onChange={(e) => setNewCar({...newCar, model: e.target.value})}
                style={{ width: '100%' }}
              />
            </label>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
          <div style={{ flex: 1 }}>
            <label>
              Передняя подвеска
              <select
                value={newCar.frontSuspension}
                onChange={(e) => setNewCar({...newCar, frontSuspension: e.target.value as any})}
                style={{ width: '100%' }}
              >
                {suspensionTypes.front.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </label>
          </div>
          <div style={{ flex: 1 }}>
            <label>
              Задняя подвеска
              <select
                value={newCar.rearSuspension}
                onChange={(e) => setNewCar({...newCar, rearSuspension: e.target.value as any})}
                style={{ width: '100%' }}
              >
                {suspensionTypes.rear.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button type="submit" className="button" style={{ backgroundColor: '#28a745' }}>
            Добавить
          </button>
          <button type="button" className="button" onClick={onCancel}>
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
} 