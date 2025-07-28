import React, { useState, useRef } from 'react';
import { CarSelector } from './CarSelector';

interface Order {
  id: string;
  date: string;
  client: string;
  contacts: string;
  car: string;
  vin: string;
  regnum: string;
  executor: string;
  orderNumber: string;
  frontSuspensionType: string;
  rearSuspensionType: string;
  status: 'pending' | 'in_progress' | 'completed';
  created: string;
  completedAt?: string;
}

interface ManagerInterfaceProps {
  onBackToRoles: () => void;
}

export function ManagerInterface({ onBackToRoles }: ManagerInterfaceProps) {
  const [activeTab, setActiveTab] = useState<'create' | 'orders' | 'completed'>('create');
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('orders');
    return saved ? JSON.parse(saved) : [];
  });
  const [carData, setCarData] = useState({
    car: '',
    frontSuspensionType: '',
    rearSuspensionType: ''
  });
  const [showNotification, setShowNotification] = useState(false);
  const [completedOrdersCount, setCompletedOrdersCount] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);

  const executors = [
    'Иванов И.И.',
    'Петров П.П.',
    'Сидоров С.С.',
    'Козлов К.К.'
  ];

  // Отслеживание завершенных заказов для уведомлений
  React.useEffect(() => {
    function loadOrders() {
      const saved = localStorage.getItem('orders');
      const loadedOrders: Order[] = saved ? JSON.parse(saved) : [];
      
      const completedOrders = loadedOrders.filter(o => o.status === 'completed');
      const newCompletedCount = completedOrders.length - orders.filter(o => o.status === 'completed').length;
      
      if (newCompletedCount > 0 && orders.length > 0) {
        setShowNotification(true);
        setCompletedOrdersCount(newCompletedCount);
        // Звуковое уведомление
        playNotificationSound();
        // Скрываем уведомление через 10 секунд
        setTimeout(() => setShowNotification(false), 10000);
      }
      
      setOrders(loadedOrders);
    }

    // Проверяем каждые 3 секунды на завершенные заказы
    const interval = setInterval(loadOrders, 3000);
    
    return () => clearInterval(interval);
  }, [orders]);

  function playNotificationSound() {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.3);
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.6);
      
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.8);
    } catch (error) {
      console.log('Звук недоступен:', error);
    }
  }

  function handleCarSelect(selectedCarData: { car: string; frontSuspensionType: string; rearSuspensionType: string }) {
    setCarData(selectedCarData);
  }

  function handleCreateOrder(e: React.FormEvent) {
    e.preventDefault();
    const form = formRef.current;
    if (!form) return;

    const formData = new FormData(form);
    const newOrder: Order = {
      id: Date.now().toString(),
      date: formData.get('date') as string,
      client: formData.get('client') as string,
      contacts: formData.get('contacts') as string,
      car: carData.car,
      vin: formData.get('vin') as string,
      regnum: formData.get('regnum') as string,
      executor: formData.get('executor') as string,
      orderNumber: formData.get('orderNumber') as string,
      frontSuspensionType: carData.frontSuspensionType,
      rearSuspensionType: carData.rearSuspensionType,
      status: 'pending',
      created: new Date().toISOString()
    };

    const updatedOrders = [...orders, newOrder];
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));

    // Имитация отправки уведомления исполнителю
    alert(`✅ Заказ ${newOrder.orderNumber} создан!\n🔔 Уведомление отправлено исполнителю: ${newOrder.executor}`);
    
    form.reset();
    setCarData({ car: '', frontSuspensionType: '', rearSuspensionType: '' });
    setActiveTab('orders');
  }

  // Параметры подвесок для печати
  const FRONT_PARAMS = [
    'Передние амортизаторы', 'Пыльники / отбойники', 'Опоры амортизаторов', 
    'Подшипники амортизаторов', 'Пружины амортизаторов', 'Привод / ШРУС / Пыльник', 
    'Рулевой наконечник/пыльник', 'Рулевая тяга/пыльник', 'Рулевая рейка', 
    'Рычаги подвески нижние/верхние', 'Сайлентблоки перед/задние', 'Стойки/втулки стабилизатора', 
    'Ступичный подшипник', 'Тормозные диски', 'Тормозные колодки', 'Тормозные шланги/трубки', 
    'Рем-комплект суппортов/профилактика', 'Трос ручного тормоза', 'Шины/колесный диск (состояние)', 
    'Шины/колесный диск (соответствие)', 'Фактическая толщина диска (мм), минимум (мм)', 
    'Фактическая толщина колодки (мм), минимум (мм)'
  ];

  const REAR_PARAMS = [
    'Задние амортизаторы', 'Пыльники / отбойники', 'Опоры амортизаторов', 
    'Пружины / рессоры', 'Стойки/втулки стабилизатора', 'Рычаги подвески вверх/низ', 
    'Шаровые опоры нижние/верхние', 'Ступичный подшипник', 'Сайлентблоки подрамника', 
    'Тяги поперечные/продольные', 'Кардан-вал / крестовины / ШРУС', 'Тормозные диски/барабаны', 
    'Тормозные колодки', 'Тормозные шланги/трубки', 'Рем-комплект суппортов/профилактика', 
    'Трос ручного тормоза', 'Шины/колесный диск (состояние)', 'Шины/колесный диск (соответствие)', 
    'Фактическая толщина диска (мм), минимум (мм)', 'Фактическая толщина колодки (мм), минимум (мм)'
  ];

  function getStatusText(status: string) {
    switch (status) {
      case 'ok': return '✅ ОК';
      case 'recommendation': return '⚠️ Рекомендация';
      case 'replacement': return '❌ Замена';
      default: return '—';
    }
  }

  function getFrontSuspensionRows(orderDiag: any) {
    return FRONT_PARAMS.map((param, idx) => `
      <tr>
        <td>${param}</td>
        <td>${getStatusText(orderDiag[`front_left_${idx}`] || '')}</td>
        <td>${getStatusText(orderDiag[`front_right_${idx}`] || '')}</td>
        <td>${orderDiag[`front_comment_${idx}`] || '—'}</td>
      </tr>
    `).join('');
  }

  function getRearSuspensionRows(orderDiag: any) {
    return REAR_PARAMS.map((param, idx) => `
      <tr>
        <td>${param}</td>
        <td>${getStatusText(orderDiag[`rear_left_${idx}`] || '')}</td>
        <td>${getStatusText(orderDiag[`rear_right_${idx}`] || '')}</td>
        <td>${orderDiag[`rear_comment_${idx}`] || '—'}</td>
      </tr>
    `).join('');
  }

  function handlePrintDiagnostics(order: Order) {
    // Получаем данные диагностики из localStorage
    const diagHistory = JSON.parse(localStorage.getItem('diag_history') || '[]');
    const orderDiag = diagHistory.find((diag: any) => 
      diag.client === order.client && diag.car === order.car
    );
    
    if (orderDiag) {
      // Создаем окно для печати с полным диагностическим листом
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Диагностический лист - ${order.orderNumber}</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #348ECC; padding-bottom: 20px; }
                .order-info { background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
                .section { margin-bottom: 25px; }
                .section-title { font-size: 1.2em; font-weight: bold; color: #348ECC; margin-bottom: 10px; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
                table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background: #f8f9fa; font-weight: bold; }
                .status-ok { color: #28a745; }
                .status-recommendation { color: #ffc107; }
                .status-replacement { color: #dc3545; }
                @media print { body { margin: 0; } }
              </style>
            </head>
            <body>
              <div class="header">
                <h1>ДИАГНОСТИЧЕСКИЙ ЛИСТ</h1>
                <h2>Заказ №${order.orderNumber}</h2>
              </div>
              
              <div class="order-info">
                <div><strong>Дата:</strong> ${order.date}</div>
                <div><strong>Клиент:</strong> ${order.client}</div>
                <div><strong>Контакты:</strong> ${order.contacts}</div>
                <div><strong>Автомобиль:</strong> ${order.car}</div>
                <div><strong>VIN:</strong> ${order.vin || '-'}</div>
                <div><strong>Госномер:</strong> ${order.regnum || '-'}</div>
                <div><strong>Исполнитель:</strong> ${order.executor}</div>
                <div><strong>Завершено:</strong> ${order.completedAt ? new Date(order.completedAt).toLocaleString() : '-'}</div>
              </div>

              <div class="section">
                <div class="section-title">Типы подвески</div>
                <div><strong>Передняя подвеска:</strong> ${order.frontSuspensionType || '-'}</div>
                <div><strong>Задняя подвеска:</strong> ${order.rearSuspensionType || '-'}</div>
              </div>

              <div class="section">
                <div class="section-title">Передняя подвеска</div>
                <table>
                  <thead>
                    <tr>
                      <th>Параметр</th>
                      <th>Левая сторона</th>
                      <th>Правая сторона</th>
                      <th>Комментарий</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${getFrontSuspensionRows(orderDiag)}
                  </tbody>
                </table>
              </div>

              <div class="section">
                <div class="section-title">Задняя подвеска</div>
                <table>
                  <thead>
                    <tr>
                      <th>Параметр</th>
                      <th>Левая сторона</th>
                      <th>Правая сторона</th>
                      <th>Комментарий</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${getRearSuspensionRows(orderDiag)}
                  </tbody>
                </table>
              </div>

              <div class="section">
                <div class="section-title">Технические жидкости</div>
                <div>Уровень масла ДВС: ${orderDiag.oil === 'on' ? '✅ Норма' : '❌ Требует внимания'}</div>
                <div>Тормозная жидкость: ${orderDiag.brake === 'on' ? '✅ Норма' : '❌ Требует внимания'}</div>
                <div>Жидкость ГУР: ${orderDiag.gur === 'on' ? '✅ Норма' : '❌ Требует внимания'}</div>
                <div>Антифриз: ${orderDiag.antifreeze === 'on' ? '✅ Норма' : '❌ Требует внимания'}</div>
              </div>

              ${orderDiag.special_notes ? `
                <div class="section">
                  <div class="section-title">Специальные отметки</div>
                  <p>${orderDiag.special_notes}</p>
                </div>
              ` : ''}

              ${orderDiag.signature ? `
                <div class="section">
                  <div class="section-title">Подпись исполнителя</div>
                  <p>${orderDiag.signature}</p>
                </div>
              ` : ''}

              <div style="margin-top: 40px; text-align: center; font-size: 0.9em; color: #666;">
                Диагностический лист сформирован ${new Date().toLocaleString()}
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    } else {
      alert('❌ Диагностические данные не найдены для этого заказа');
    }
  }

  function getStatusLabel(status: Order['status']) {
    switch (status) {
      case 'pending': return '⏳ Ожидает';
      case 'in_progress': return '🔧 В работе';
      case 'completed': return '✅ Завершен';
    }
  }

  function getStatusColor(status: Order['status']) {
    switch (status) {
      case 'pending': return '#ff6900';
      case 'in_progress': return '#348ECC';
      case 'completed': return '#28a745';
    }
  }

  const activeOrders = orders.filter(o => o.status !== 'completed');
  const completedOrders = orders.filter(o => o.status === 'completed');

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      {/* Уведомление о завершенных заказах */}
      {showNotification && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: '#28a745',
          color: '#fff',
          padding: '16px 20px',
          borderRadius: '12px',
          boxShadow: '0 8px 24px rgba(40, 167, 69, 0.4)',
          zIndex: 1000,
          animation: 'slideIn 0.3s ease-out',
          maxWidth: '350px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ fontSize: '1.5rem' }}>📋</div>
            <div>
              <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                Диагностика завершена!
              </div>
              <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                Завершено заказов: {completedOrdersCount}
              </div>
              <button
                onClick={() => setActiveTab('completed')}
                style={{
                  marginTop: '8px',
                  padding: '4px 8px',
                  background: 'rgba(255,255,255,0.3)',
                  border: 'none',
                  borderRadius: '4px',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '0.8rem'
                }}
              >
                Перейти к печати →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, #348ECC 0%, #1B80C5 100%)',
        color: '#fff',
        padding: '16px 24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <h1 style={{
            margin: 0,
            fontSize: '1.5rem',
            fontWeight: '700',
            fontFamily: 'Montserrat, sans-serif'
          }}>
            👨‍💼 Панель менеджера
          </h1>
          
          <button
            onClick={onBackToRoles}
            style={{
              padding: '8px 16px',
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '6px',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            ← Сменить роль
          </button>
        </div>
      </header>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '24px',
          borderBottom: '2px solid #eee'
        }}>
          <button
            onClick={() => setActiveTab('create')}
            style={{
              padding: '12px 24px',
              border: 'none',
              background: activeTab === 'create' ? '#348ECC' : 'transparent',
              color: activeTab === 'create' ? '#fff' : '#666',
              borderRadius: '8px 8px 0 0',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              transition: 'all 0.2s'
            }}
          >
            📝 Создать заказ
          </button>
          
          <button
            onClick={() => setActiveTab('orders')}
            style={{
              padding: '12px 24px',
              border: 'none',
              background: activeTab === 'orders' ? '#348ECC' : 'transparent',
              color: activeTab === 'orders' ? '#fff' : '#666',
              borderRadius: '8px 8px 0 0',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              transition: 'all 0.2s'
            }}
          >
            📋 Активные заказы ({activeOrders.length})
          </button>

          <button
            onClick={() => setActiveTab('completed')}
            style={{
              padding: '12px 24px',
              border: 'none',
              background: activeTab === 'completed' ? '#28a745' : 'transparent',
              color: activeTab === 'completed' ? '#fff' : '#666',
              borderRadius: '8px 8px 0 0',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              transition: 'all 0.2s',
              position: 'relative'
            }}
          >
            🖨️ Завершенные ({completedOrders.length})
            {completedOrders.some(o => !o.completedAt || new Date(o.completedAt).getTime() > Date.now() - 300000) && (
              <span style={{
                position: 'absolute',
                top: '-5px',
                right: '-5px',
                background: '#dc3545',
                color: '#fff',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                fontSize: '0.7rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                !
              </span>
            )}
          </button>
        </div>

        {/* Create Order Tab */}
        {activeTab === 'create' && (
          <div style={{
            background: '#fff',
            borderRadius: '12px',
            padding: '32px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{
              margin: '0 0 24px 0',
              color: '#348ECC',
              fontSize: '1.5rem',
              fontWeight: '700'
            }}>
              Создание нового заказа
            </h2>

            <form ref={formRef} onSubmit={handleCreateOrder}>
              {/* Основные данные */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '20px',
                marginBottom: '32px'
              }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
                    Дата *
                    <input
                      type="date"
                      name="date"
                      required
                      defaultValue={new Date().toISOString().split('T')[0]}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #ddd',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        marginTop: '4px'
                      }}
                    />
                  </label>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
                    ФИО клиента *
                    <input
                      type="text"
                      name="client"
                      required
                      placeholder="Иванов Иван Иванович"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #ddd',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        marginTop: '4px'
                      }}
                    />
                  </label>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
                    Контакты *
                    <input
                      type="text"
                      name="contacts"
                      required
                      placeholder="+7 (900) 123-45-67"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #ddd',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        marginTop: '4px'
                      }}
                    />
                  </label>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
                    VIN
                    <input
                      type="text"
                      name="vin"
                      placeholder="1HGBH41JXMN109186"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #ddd',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        marginTop: '4px'
                      }}
                    />
                  </label>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
                    Госномер
                    <input
                      type="text"
                      name="regnum"
                      placeholder="А123БВ199"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #ddd',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        marginTop: '4px'
                      }}
                    />
                  </label>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
                    Исполнитель *
                    <select
                      name="executor"
                      required
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #ddd',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        marginTop: '4px'
                      }}
                    >
                      <option value="">Выберите исполнителя</option>
                      {executors.map(executor => (
                        <option key={executor} value={executor}>{executor}</option>
                      ))}
                    </select>
                  </label>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
                    Номер заказа *
                    <input
                      type="text"
                      name="orderNumber"
                      required
                      placeholder={`ORD-${Date.now().toString().slice(-6)}`}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #ddd',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        marginTop: '4px'
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* Выбор автомобиля */}
              <div style={{
                border: '2px solid #348ECC',
                borderRadius: '12px',
                padding: '24px',
                marginBottom: '32px',
                background: '#f8f9fa'
              }}>
                <h3 style={{
                  margin: '0 0 20px 0',
                  color: '#348ECC',
                  fontSize: '1.3rem',
                  fontWeight: '600'
                }}>
                  🚗 Выбор автомобиля и типа подвески
                </h3>
                <CarSelector 
                  onCarSelect={handleCarSelect}
                  initialCar={carData.car}
                  initialFrontSuspension={carData.frontSuspensionType}
                  initialRearSuspension={carData.rearSuspensionType}
                />
              </div>

              {/* Кнопка создания */}
              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '16px',
                  fontSize: '1.2rem',
                  fontWeight: '600',
                  color: '#fff',
                  background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 16px rgba(40, 167, 69, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(40, 167, 69, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(40, 167, 69, 0.3)';
                }}
              >
                🔔 Создать заказ и уведомить исполнителя
              </button>
            </form>
          </div>
        )}

        {/* Active Orders Tab */}
        {activeTab === 'orders' && (
          <div style={{
            background: '#fff',
            borderRadius: '12px',
            padding: '32px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{
              margin: '0 0 24px 0',
              color: '#348ECC',
              fontSize: '1.5rem',
              fontWeight: '700'
            }}>
              Активные заказы
            </h2>

            {activeOrders.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '48px 0',
                color: '#666'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📋</div>
                <p>Нет активных заказов</p>
                <button
                  onClick={() => setActiveTab('create')}
                  style={{
                    marginTop: '16px',
                    padding: '12px 24px',
                    background: '#348ECC',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  Создать заказ
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {activeOrders.map(order => (
                  <div
                    key={order.id}
                    style={{
                      border: '2px solid #eee',
                      borderRadius: '12px',
                      padding: '20px',
                      background: '#fff',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '12px'
                    }}>
                      <h3 style={{
                        margin: 0,
                        color: '#333',
                        fontSize: '1.2rem'
                      }}>
                        Заказ #{order.orderNumber}
                      </h3>
                      
                      <span style={{
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        background: getStatusColor(order.status),
                        color: '#fff'
                      }}>
                        {getStatusLabel(order.status)}
                      </span>
                    </div>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '12px',
                      fontSize: '0.95rem',
                      color: '#666'
                    }}>
                      <div><strong>Клиент:</strong> {order.client}</div>
                      <div><strong>Автомобиль:</strong> {order.car}</div>
                      <div><strong>Исполнитель:</strong> {order.executor}</div>
                      <div><strong>Дата:</strong> {order.date}</div>
                      <div><strong>Создан:</strong> {new Date(order.created).toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Completed Orders Tab */}
        {activeTab === 'completed' && (
          <div style={{
            background: '#fff',
            borderRadius: '12px',
            padding: '32px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{
              margin: '0 0 24px 0',
              color: '#28a745',
              fontSize: '1.5rem',
              fontWeight: '700'
            }}>
              🖨️ Завершенные заказы - Готовы к печати
            </h2>

            {completedOrders.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '48px 0',
                color: '#666'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📋</div>
                <p>Нет завершенных заказов</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {completedOrders.map(order => (
                  <div
                    key={order.id}
                    style={{
                      border: '2px solid #28a745',
                      borderRadius: '12px',
                      padding: '20px',
                      background: '#f8fff8',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '12px'
                    }}>
                      <h3 style={{
                        margin: 0,
                        color: '#333',
                        fontSize: '1.2rem'
                      }}>
                        Заказ #{order.orderNumber}
                      </h3>
                      
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span style={{
                          padding: '6px 12px',
                          borderRadius: '20px',
                          fontSize: '0.9rem',
                          fontWeight: '600',
                          background: '#28a745',
                          color: '#fff'
                        }}>
                          ✅ Завершен
                        </span>
                        
                        <button
                          onClick={() => handlePrintDiagnostics(order)}
                          style={{
                            padding: '8px 16px',
                            background: '#17a2b8',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '0.9rem'
                          }}
                        >
                          🖨️ Печать диагностики
                        </button>
                      </div>
                    </div>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '12px',
                      fontSize: '0.95rem',
                      color: '#666'
                    }}>
                      <div><strong>Клиент:</strong> {order.client}</div>
                      <div><strong>Автомобиль:</strong> {order.car}</div>
                      <div><strong>Исполнитель:</strong> {order.executor}</div>
                      <div><strong>Дата:</strong> {order.date}</div>
                      <div><strong>Завершен:</strong> {order.completedAt ? new Date(order.completedAt).toLocaleString() : 'Недавно'}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
} 