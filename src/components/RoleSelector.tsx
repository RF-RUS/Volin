

interface RoleSelectorProps {
  onRoleSelect: (role: 'manager' | 'executor') => void;
}

export function RoleSelector({ onRoleSelect }: RoleSelectorProps) {
  return (
    <div style={{
      height: '100vh',
      width: '100vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #348ECC 0%, #1B80C5 100%)',
      padding: '20px',
      boxSizing: 'border-box',
      margin: 0,
      overflow: 'auto'
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '16px',
        padding: '48px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
        textAlign: 'center',
        maxWidth: '500px',
        width: '100%'
      }}>
        <h1 style={{
          margin: '0 0 16px 0',
          color: '#348ECC',
          fontSize: '2.5rem',
          fontWeight: '800',
          fontFamily: 'Montserrat, sans-serif'
        }}>
          Электронный диагностический лист
        </h1>
        
        <p style={{
          margin: '0 0 48px 0',
          color: '#666',
          fontSize: '1.1rem',
          lineHeight: '1.6'
        }}>
          Выберите вашу роль для продолжения работы
        </p>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}>
          <button
            onClick={() => onRoleSelect('manager')}
            style={{
              padding: '20px 32px',
              fontSize: '1.3rem',
              fontWeight: '600',
              color: '#fff',
              background: 'linear-gradient(135deg, #348ECC 0%, #3C9CDD 100%)',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 16px rgba(52, 142, 204, 0.3)',
              fontFamily: 'Montserrat, sans-serif'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(52, 142, 204, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(52, 142, 204, 0.3)';
            }}
          >
            👨‍💼 Менеджер
            <div style={{
              fontSize: '0.9rem',
              opacity: 0.9,
              marginTop: '4px',
              fontWeight: '400'
            }}>
              Создание заказов • Компьютер
            </div>
          </button>

          <button
            onClick={() => onRoleSelect('executor')}
            style={{
              padding: '20px 32px',
              fontSize: '1.3rem',
              fontWeight: '600',
              color: '#fff',
              background: 'linear-gradient(135deg, #ff6900 0%, #ffa079 100%)',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 16px rgba(255, 105, 0, 0.3)',
              fontFamily: 'Montserrat, sans-serif'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(255, 105, 0, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(255, 105, 0, 0.3)';
            }}
          >
            🔧 Мастер
            <div style={{
              fontSize: '0.9rem',
              opacity: 0.9,
              marginTop: '4px',
              fontWeight: '400'
            }}>
              Диагностика автомобилей • Планшет
            </div>
          </button>
        </div>

        <div style={{
          marginTop: '32px',
          padding: '16px',
          background: '#f8f9fa',
          borderRadius: '8px',
          fontSize: '0.9rem',
          color: '#666',
          lineHeight: '1.5'
        }}>
          <strong>Как это работает:</strong><br/>
          Менеджер создает заказ → Мастер получает уведомление → Проводит диагностику
        </div>
      </div>
    </div>
  );
} 