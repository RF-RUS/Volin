import React, { useRef, useState } from 'react';
import { CarSelector } from './CarSelector';

const FRONT_PARAMS = [
  'Передние амортизаторы',
  'Пыльники / отбойники',
  'Опоры амортизаторов',
  'Подшипники амортизаторов',
  'Пружины амортизаторов',
  'Привод / ШРУС / Пыльник',
  'Рулевой наконечник/пыльник',
  'Рулевая тяга/пыльник',
  'Рулевая рейка',
  'Рычаги подвески нижние/верхние',
  'Сайлентблоки перед/задние',
  'Стойки/втулки стабилизатора',
  'Ступичный подшипник',
  'Тормозные диски',
  'Тормозные колодки',
  'Тормозные шланги/трубки',
  'Рем-комплект суппортов/профилактика',
  'Трос ручного тормоза',
  'Шины/колесный диск (состояние)',
  'Шины/колесный диск (соответствие)',
  'Фактическая толщина диска (мм), минимум (мм)',
  'Фактическая толщина колодки (мм), минимум (мм)',
];

const REAR_PARAMS = [
  'Задние амортизаторы',
  'Пыльники / отбойники',
  'Опоры амортизаторов',
  'Пружины / рессоры',
  'Стойки/втулки стабилизатора',
  'Рычаги подвески вверх/низ',
  'Шаровые опоры нижние/верхние',
  'Ступичный подшипник',
  'Сайлентблоки подрамника',
  'Тяги поперечные/продольные',
  'Кардан-вал / крестовины / ШРУС',
  'Тормозные диски/барабаны',
  'Тормозные колодки',
  'Тормозные шланги/трубки',
  'Рем-комплект суппортов/профилактика',
  'Трос ручного тормоза',
  'Шины/колесный диск (состояние)',
  'Шины/колесный диск (соответствие)',
  'Фактическая толщина диска (мм), минимум (мм)',
  'Фактическая толщина колодки (мм), минимум (мм)',
];

const STATE_OPTIONS = [
  { value: '', label: '—' },
  { value: 'ok', label: 'ОК' },
  { value: 'recommend', label: 'Рекомендация' },
  { value: 'replace', label: 'Замена' },
];

interface DiagFormProps {
  prefilledData?: {
    date?: string;
    client?: string;
    contacts?: string;
    car?: string;
    vin?: string;
    regnum?: string;
    executor?: string;
    ordernum?: string;
    frontSuspensionType?: string;
    rearSuspensionType?: string;
  };
  isEditing?: boolean;
}

export function DiagForm({ prefilledData, isEditing = false }: DiagFormProps = {}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [vinLoading, setVinLoading] = useState(false);
  const [vinError, setVinError] = useState('');
  const [carData, setCarData] = useState({
    car: prefilledData?.car || '',
    frontSuspensionType: prefilledData?.frontSuspensionType || '',
    rearSuspensionType: prefilledData?.rearSuspensionType || ''
  });

  // Загружаем существующие данные диагностики при редактировании
  const [existingDiagData, setExistingDiagData] = useState<any>(null);
  
  React.useEffect(() => {
    if (isEditing && prefilledData) {
      const history = JSON.parse(localStorage.getItem('diag_history') || '[]');
      const existing = history.find((item: any) => 
        item.client === prefilledData.client && 
        item.car === prefilledData.car &&
        item.order === prefilledData.ordernum
      );
      if (existing) {
        setExistingDiagData(existing);
      }
    }
  }, [isEditing, prefilledData]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const form = formRef.current;
    if (!form) return;
    const data = new FormData(form);
    
    // Собираем все данные в объект
    const diag: Record<string, any> = {};
    data.forEach((value, key) => {
      diag[key] = value;
    });
    
    // Добавляем данные автомобиля из CarSelector
    diag.car = carData.car;
    diag.frontSuspensionType = carData.frontSuspensionType;
    diag.rearSuspensionType = carData.rearSuspensionType;
    
    // Сохраняем в localStorage (MVP)
    const history = JSON.parse(localStorage.getItem('diag_history') || '[]');
    
    if (isEditing && prefilledData) {
      // Режим редактирования - обновляем существующую запись
      const index = history.findIndex((item: any) => 
        item.client === prefilledData.client && 
        item.car === prefilledData.car &&
        item.order === prefilledData.ordernum
      );
      
      if (index !== -1) {
        // Обновляем существующую запись
        history[index] = { 
          ...history[index], 
          ...diag, 
          updated: new Date().toISOString() 
        };
      } else {
        // Если не найдена, создаем новую
        history.push({ 
          ...diag, 
          created: new Date().toISOString() 
        });
      }
    } else {
      // Обычное сохранение новой записи
      history.push({ 
        ...diag, 
        created: new Date().toISOString() 
      });
    }
    
    localStorage.setItem('diag_history', JSON.stringify(history));
    
    if (!isEditing) {
      // Сброс формы только если это не редактирование
      form.reset();
      setCarData({ car: '', frontSuspensionType: '', rearSuspensionType: '' });
    }
    
    alert(isEditing ? '✅ Изменения сохранены!' : '✅ Диагностический лист сохранён локально!');
  }

  function handleCarSelect(selectedCarData: { car: string; frontSuspensionType: string; rearSuspensionType: string }) {
    setCarData(selectedCarData);
  }

  async function handleVinDecode() {
    setVinError('');
    setVinLoading(true);
    const form = formRef.current;
    if (!form) return;
    const vin = (form.elements.namedItem('vin') as HTMLInputElement)?.value.trim();
    if (!vin || vin.length < 10) {
      setVinError('Введите корректный VIN (минимум 10 символов)');
      setVinLoading(false);
      return;
    }
    try {
      const res = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/${vin}?format=json`);
      const data = await res.json();
      const results = data.Results || [];
      const get = (field: string) => results.find((r: any) => r.Variable === field)?.Value || '';
      const make = get('Make');
      const model = get('Model');
      
      setVinError(make || model ? '' : 'Данные по VIN не найдены');
      
      if (make || model) {
        const bodyClass = get('Body Class')?.toLowerCase() || '';
        const driveType = get('Drive Type')?.toLowerCase() || '';
        
        // Автозаполнение типа передней подвески
        let frontType = '';
        if (bodyClass.includes('mcpherson')) frontType = 'mcpherson';
        else if (bodyClass.includes('independent')) frontType = 'independent';
        else if (bodyClass.includes('dependent')) frontType = 'dependent';
        
        // Автозаполнение типа задней подвески
        let rearType = '';
        if (driveType.includes('rear') && bodyClass.includes('independent')) rearType = 'independent';
        else if (bodyClass.includes('dependent')) rearType = 'dependent';
        
        // Обновляем данные через CarSelector
        setCarData({
          car: `${make} ${model}`.trim(),
          frontSuspensionType: frontType,
          rearSuspensionType: rearType
        });
      }
    } catch {
      setVinError('Ошибка запроса к VIN API');
    } finally {
      setVinLoading(false);
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <div className="section-title">Общие данные</div>
      <div style={{display: 'flex', flexWrap: 'wrap', gap: 16}}>
        <div style={{flex: 1, minWidth: 220}}>
          <label>Дата
            <input type="date" name="date" required defaultValue={prefilledData?.date} />
          </label>
        </div>
        <div style={{flex: 2, minWidth: 220}}>
          <label>ФИО клиента
            <input type="text" name="client" required defaultValue={prefilledData?.client} />
          </label>
        </div>
        <div style={{flex: 2, minWidth: 220}}>
          <label>Контакты
            <input type="text" name="contacts" required defaultValue={prefilledData?.contacts} />
          </label>
        </div>
      </div>
      <div style={{display: 'flex', flexWrap: 'wrap', gap: 16}}>
        <div style={{flex: 1, minWidth: 120, display: 'flex', flexDirection: 'column'}}>
          <label>VIN
            <div style={{display: 'flex', gap: 8}}>
              <input type="text" name="vin" style={{flex: 1}} defaultValue={prefilledData?.vin} />
              <button type="button" className="button" style={{padding: '8px 12px', fontSize: '1rem'}} onClick={handleVinDecode} disabled={vinLoading}>
                {vinLoading ? '...' : 'Определить по VIN'}
              </button>
            </div>
          </label>
          {vinError && <div style={{color: 'red', fontSize: '0.95em', marginTop: 4}}>{vinError}</div>}
        </div>
        <div style={{flex: 1, minWidth: 120}}>
          <label>Госномер
            <input type="text" name="regnum" defaultValue={prefilledData?.regnum} />
          </label>
        </div>
      </div>
      
      {/* Компонент выбора автомобиля с автоподстановкой */}
      <div style={{border: '1px solid #ddd', borderRadius: '8px', padding: '16px', marginTop: '16px', backgroundColor: '#f8f9fa'}}>
        <h3 style={{marginTop: 0, marginBottom: '16px', color: '#348ECC'}}>Выбор автомобиля и типа подвески</h3>
        <CarSelector 
          onCarSelect={handleCarSelect}
          initialCar={carData.car}
          initialFrontSuspension={carData.frontSuspensionType}
          initialRearSuspension={carData.rearSuspensionType}
        />
        {/* Скрытые поля для передачи данных в форму */}
        <input type="hidden" name="car" value={carData.car} />
        <input type="hidden" name="frontSuspensionType" value={carData.frontSuspensionType} />
        <input type="hidden" name="rearSuspensionType" value={carData.rearSuspensionType} />
      </div>
      <div style={{display: 'flex', flexWrap: 'wrap', gap: 16}}>
        <div style={{flex: 1, minWidth: 180}}>
          <label>Исполнитель
            <input type="text" name="executor" defaultValue={prefilledData?.executor} />
          </label>
        </div>
        <div style={{flex: 1, minWidth: 120}}>
          <label>Номер заказа
            <input type="text" name="order" defaultValue={prefilledData?.ordernum} />
          </label>
        </div>
      </div>
      <div className="section-title">Передняя подвеска</div>
      <div style={{overflowX: 'auto'}}>
        <table style={{width: '100%', borderCollapse: 'collapse', minWidth: 600}}>
          <thead>
            <tr style={{background: '#f5f5f5'}}>
              <th style={{padding: 8, fontWeight: 600}}>Параметр</th>
              <th style={{padding: 8}}>Левая сторона</th>
              <th style={{padding: 8}}>Правая сторона</th>
              <th style={{padding: 8}}>Комментарий</th>
            </tr>
          </thead>
          <tbody>
            {FRONT_PARAMS.map((param, idx) => (
              <tr key={param} style={{borderBottom: '1px solid #eee'}}>
                <td style={{padding: 8}}>{param}</td>
                <td style={{padding: 8}}>
                  <select 
                    name={`front_left_${idx}`} 
                    style={{fontSize: '1.1rem', padding: 8}}
                    defaultValue={existingDiagData?.[`front_left_${idx}`] || ''}
                  >
                    {STATE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </td>
                <td style={{padding: 8}}>
                  <select 
                    name={`front_right_${idx}`} 
                    style={{fontSize: '1.1rem', padding: 8}}
                    defaultValue={existingDiagData?.[`front_right_${idx}`] || ''}
                  >
                    {STATE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </td>
                <td style={{padding: 8}}>
                  <input 
                    type="text" 
                    name={`front_comment_${idx}`} 
                    style={{fontSize: '1.1rem', padding: 8}}
                    defaultValue={existingDiagData?.[`front_comment_${idx}`] || ''}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="section-title">Задняя подвеска</div>
      <div style={{overflowX: 'auto'}}>
        <table style={{width: '100%', borderCollapse: 'collapse', minWidth: 600}}>
          <thead>
            <tr style={{background: '#f5f5f5'}}>
              <th style={{padding: 8, fontWeight: 600}}>Параметр</th>
              <th style={{padding: 8}}>Левая сторона</th>
              <th style={{padding: 8}}>Правая сторона</th>
              <th style={{padding: 8}}>Комментарий</th>
            </tr>
          </thead>
          <tbody>
            {REAR_PARAMS.map((param, idx) => (
              <tr key={param} style={{borderBottom: '1px solid #eee'}}>
                <td style={{padding: 8}}>{param}</td>
                <td style={{padding: 8}}>
                  <select 
                    name={`rear_left_${idx}`} 
                    style={{fontSize: '1.1rem', padding: 8}}
                    defaultValue={existingDiagData?.[`rear_left_${idx}`] || ''}
                  >
                    {STATE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </td>
                <td style={{padding: 8}}>
                  <select 
                    name={`rear_right_${idx}`} 
                    style={{fontSize: '1.1rem', padding: 8}}
                    defaultValue={existingDiagData?.[`rear_right_${idx}`] || ''}
                  >
                    {STATE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </td>
                <td style={{padding: 8}}>
                  <input 
                    type="text" 
                    name={`rear_comment_${idx}`} 
                    style={{fontSize: '1.1rem', padding: 8}}
                    defaultValue={existingDiagData?.[`rear_comment_${idx}`] || ''}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="section-title">Технические жидкости</div>
      <div style={{display: 'flex', flexWrap: 'wrap', gap: 24, marginBottom: 24}}>
        <label style={{flex: 1, minWidth: 180}}>
          <input 
            type="checkbox" 
            name="oil" 
            style={{marginRight: 8, width: 24, height: 24}} 
            defaultChecked={existingDiagData?.oil === 'on'}
          />
          Уровень масла ДВС
        </label>
        <label style={{flex: 1, minWidth: 180}}>
          <input 
            type="checkbox" 
            name="brake" 
            style={{marginRight: 8, width: 24, height: 24}} 
            defaultChecked={existingDiagData?.brake === 'on'}
          />
          Тормозная жидкость
        </label>
        <label style={{flex: 1, minWidth: 180}}>
          <input 
            type="checkbox" 
            name="gur" 
            style={{marginRight: 8, width: 24, height: 24}} 
            defaultChecked={existingDiagData?.gur === 'on'}
          />
          Жидкость ГУР
        </label>
        <label style={{flex: 1, minWidth: 180}}>
          <input 
            type="checkbox" 
            name="antifreeze" 
            style={{marginRight: 8, width: 24, height: 24}} 
            defaultChecked={existingDiagData?.antifreeze === 'on'}
          />
          Антифриз
        </label>
      </div>
      <div className="section-title">Специальные отметки</div>
      <textarea 
        name="special_notes" 
        rows={3} 
        placeholder="Особые замечания, рекомендации и т.д." 
        style={{marginBottom: 24}}
        defaultValue={existingDiagData?.special_notes || ''}
      />
      <div className="section-title">Подпись</div>
      <input 
        type="text" 
        name="signature" 
        placeholder="ФИО или электронная подпись" 
        style={{marginBottom: 32}}
        defaultValue={existingDiagData?.signature || ''}
      />
      <div style={{textAlign: 'center'}}>
        <button className="button" type="submit">Сохранить</button>
      </div>
    </form>
  );
} 