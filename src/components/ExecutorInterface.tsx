import { useState, useEffect } from 'react';
import { DiagForm } from './DiagForm';

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

interface ExecutorInterfaceProps {
  onBackToRoles: () => void;
}

export function ExecutorInterface({ onBackToRoles }: ExecutorInterfaceProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [newOrdersCount, setNewOrdersCount] = useState(0);

  // Загружаем заказы и отслеживаем новые
  useEffect(() => {
    function loadOrders() {
      const saved = localStorage.getItem('orders');
      const loadedOrders: Order[] = saved ? JSON.parse(saved) : [];
      
      const pendingOrders = loadedOrders.filter(o => o.status === 'pending');
      const newCount = pendingOrders.length - orders.filter(o => o.status === 'pending').length;
      
      if (newCount > 0 && orders.length > 0) {
        setShowNotification(true);
        setNewOrdersCount(newCount);
        // Звуковое уведомление
        playNotificationSound();
        // Скрываем уведомление через 5 секунд
        setTimeout(() => setShowNotification(false), 5000);
      }
      
      setOrders(loadedOrders);
    }

    // Загружаем сразу
    loadOrders();
    
    // Проверяем каждые 2 секунды на новые заказы
    const interval = setInterval(loadOrders, 2000);
    
    return () => clearInterval(interval);
  }, [orders]);

  function playNotificationSound() {
    try {
      // Создаем простой звуковой сигнал
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.2);
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.log('Звук недоступен:', error);
    }
  }

  function handleStartDiagnosis(order: Order) {
    // Обновляем статус заказа
    const updatedOrders = orders.map(o => 
      o.id === order.id ? { ...o, status: 'in_progress' as const } : o
    );
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    
    setSelectedOrder(order);
  }

  function handleCompleteDiagnosis() {
    if (!selectedOrder) return;
    
    // Обновляем статус заказа с временем завершения
    const updatedOrders = orders.map(o => 
      o.id === selectedOrder.id ? { 
        ...o, 
        status: 'completed' as const,
        completedAt: new Date().toISOString()
      } : o
    );
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    
    alert('✅ Диагностика завершена и сохранена!\n🔔 Менеджер получит уведомление о готовности к печати.');
    setSelectedOrder(null);
  }

  const pendingOrders = orders.filter(o => o.status === 'pending');
  const inProgressOrders = orders.filter(o => o.status === 'in_progress');
  const completedOrders = orders.filter(o => o.status === 'completed');

  // Если выбран заказ для диагностики
  if (selectedOrder) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
        {/* Header для диагностики */}
        <header style={{
          background: 'linear-gradient(135deg, #ff6900 0%, #ffa079 100%)',
          color: '#fff',
          padding: '12px 16px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <h1 style={{
                margin: 0,
                fontSize: '1.3rem',
                fontWeight: '700'
              }}>
                {selectedOrder.status === 'completed' ? '✏️ Редактирование' : '🔧 Диагностика'} #{selectedOrder.orderNumber}
              </h1>
              <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                {selectedOrder.client} • {selectedOrder.car}
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              {selectedOrder.status !== 'completed' && (
                <button
                  onClick={handleCompleteDiagnosis}
                  style={{
                    padding: '8px 16px',
                    background: '#28a745',
                    border: 'none',
                    borderRadius: '6px',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: '600'
                  }}
                >
                  ✅ Завершить
                </button>
              )}
              
              <button
                onClick={() => setSelectedOrder(null)}
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
                ← Назад
              </button>
            </div>
          </div>
        </header>

        {/* Форма диагностики */}
        <div style={{ padding: '16px' }}>
          <DiagForm 
            prefilledData={{
              date: selectedOrder.date,
              client: selectedOrder.client,
              contacts: selectedOrder.contacts,
              car: selectedOrder.car,
              vin: selectedOrder.vin,
              regnum: selectedOrder.regnum,
              executor: selectedOrder.executor,
              ordernum: selectedOrder.orderNumber,
              frontSuspensionType: selectedOrder.frontSuspensionType,
              rearSuspensionType: selectedOrder.rearSuspensionType
            }}
            isEditing={selectedOrder.status === 'completed'}
          />
        </div>
      </div>
    );
  }

  // Основной интерфейс исполнителя
  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      {/* Уведомление о новых заказах */}
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
          maxWidth: '300px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ fontSize: '1.5rem' }}>🔔</div>
            <div>
              <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                Новый заказ!
              </div>
              <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                Получено заказов: {newOrdersCount}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, #ff6900 0%, #ffa079 100%)',
        color: '#fff',
        padding: '16px 20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '1000px',
          margin: '0 auto'
        }}>
          <h1 style={{
            margin: 0,
            fontSize: '1.5rem',
            fontWeight: '700',
            fontFamily: 'Montserrat, sans-serif'
          }}>
            🔧 Панель мастера
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

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
        {/* Статистика */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}>
          <div style={{
            background: '#fff',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
            textAlign: 'center',
            border: pendingOrders.length > 0 ? '2px solid #ff6900' : '2px solid #eee'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>⏳</div>
            <div style={{ fontSize: '1.8rem', fontWeight: '700', color: '#ff6900' }}>
              {pendingOrders.length}
            </div>
            <div style={{ color: '#666', fontSize: '0.9rem' }}>Ожидают диагностики</div>
          </div>

          <div style={{
            background: '#fff',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🔧</div>
            <div style={{ fontSize: '1.8rem', fontWeight: '700', color: '#348ECC' }}>
              {inProgressOrders.length}
            </div>
            <div style={{ color: '#666', fontSize: '0.9rem' }}>В работе</div>
          </div>

          <div style={{
            background: '#fff',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>✅</div>
            <div style={{ fontSize: '1.8rem', fontWeight: '700', color: '#28a745' }}>
              {completedOrders.length}
            </div>
            <div style={{ color: '#666', fontSize: '0.9rem' }}>Завершено</div>
          </div>
        </div>

        {/* Новые заказы */}
        {pendingOrders.length > 0 && (
          <div style={{
            background: '#fff',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
            marginBottom: '24px',
            border: '2px solid #ff6900'
          }}>
            <h2 style={{
              margin: '0 0 20px 0',
              color: '#ff6900',
              fontSize: '1.3rem',
              fontWeight: '700'
            }}>
              🔔 Новые заказы ({pendingOrders.length})
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {pendingOrders.map(order => (
                <div
                  key={order.id}
                  style={{
                    border: '2px solid #ff6900',
                    borderRadius: '12px',
                    padding: '16px',
                    background: '#fff8f0'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '12px'
                  }}>
                    <h3 style={{ margin: 0, color: '#333' }}>
                      Заказ #{order.orderNumber}
                    </h3>
                    
                    <button
                      onClick={() => handleStartDiagnosis(order)}
                      style={{
                        padding: '8px 16px',
                        background: '#ff6900',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '0.9rem'
                      }}
                    >
                      🔧 Начать диагностику
                    </button>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '8px',
                    fontSize: '0.9rem',
                    color: '#666'
                  }}>
                    <div><strong>Клиент:</strong> {order.client}</div>
                    <div><strong>Автомобиль:</strong> {order.car}</div>
                    <div><strong>Дата:</strong> {order.date}</div>
                    <div><strong>Контакты:</strong> {order.contacts}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Заказы в работе */}
        {inProgressOrders.length > 0 && (
          <div style={{
            background: '#fff',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
            marginBottom: '24px'
          }}>
            <h2 style={{
              margin: '0 0 20px 0',
              color: '#348ECC',
              fontSize: '1.3rem',
              fontWeight: '700'
            }}>
              🔧 В работе ({inProgressOrders.length})
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {inProgressOrders.map(order => (
                <div
                  key={order.id}
                  style={{
                    border: '2px solid #348ECC',
                    borderRadius: '12px',
                    padding: '16px',
                    background: '#f0f8ff'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '12px'
                  }}>
                    <h3 style={{ margin: 0, color: '#333' }}>
                      Заказ #{order.orderNumber}
                    </h3>
                    
                    <button
                      onClick={() => setSelectedOrder(order)}
                      style={{
                        padding: '8px 16px',
                        background: '#348ECC',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '0.9rem'
                      }}
                    >
                      📝 Продолжить
                    </button>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '8px',
                    fontSize: '0.9rem',
                    color: '#666'
                  }}>
                    <div><strong>Клиент:</strong> {order.client}</div>
                    <div><strong>Автомобиль:</strong> {order.car}</div>
                    <div><strong>Дата:</strong> {order.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Завершенные заказы - возможность редактирования */}
        {completedOrders.length > 0 && (
          <div style={{
            background: '#fff',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
            marginBottom: '24px'
          }}>
            <h2 style={{
              margin: '0 0 20px 0',
              color: '#28a745',
              fontSize: '1.3rem',
              fontWeight: '700'
            }}>
              ✅ Завершенные заказы ({completedOrders.length})
            </h2>
            <p style={{ color: '#666', marginBottom: '20px', fontSize: '0.95rem' }}>
              💡 Вы можете вернуться к завершенным заказам для редактирования диагностических данных
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {completedOrders.map(order => (
                <div
                  key={order.id}
                  style={{
                    border: '2px solid #28a745',
                    borderRadius: '12px',
                    padding: '16px',
                    background: '#f8fff8'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '12px'
                  }}>
                    <h3 style={{ margin: 0, color: '#333' }}>
                      Заказ #{order.orderNumber}
                    </h3>
                    
                    <button
                      onClick={() => setSelectedOrder(order)}
                      style={{
                        padding: '8px 16px',
                        background: '#ffc107',
                        color: '#000',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '0.9rem'
                      }}
                    >
                      ✏️ Редактировать
                    </button>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '8px',
                    fontSize: '0.9rem',
                    color: '#666'
                  }}>
                    <div><strong>Клиент:</strong> {order.client}</div>
                    <div><strong>Автомобиль:</strong> {order.car}</div>
                    <div><strong>Завершен:</strong> {order.completedAt ? new Date(order.completedAt).toLocaleString() : '-'}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Пустое состояние */}
        {orders.length === 0 && (
          <div style={{
            background: '#fff',
            borderRadius: '12px',
            padding: '48px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🔧</div>
            <h3 style={{ color: '#666', marginBottom: '8px' }}>Ожидание заказов</h3>
            <p style={{ color: '#999', margin: 0 }}>
              Пока нет заказов для диагностики.<br/>
              Вы получите уведомление, когда менеджер создаст новый заказ.
            </p>
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