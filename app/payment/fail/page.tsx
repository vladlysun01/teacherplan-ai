'use client';

export default function FailPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f172a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '500px',
        width: '100%',
        background: '#1e293b',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        borderRadius: '16px',
        padding: '40px',
        textAlign: 'center'
      }}>
        <div style={{
          fontSize: '64px',
          marginBottom: '20px'
        }}>
          ❌
        </div>

        <h1 style={{
          fontSize: '28px',
          fontWeight: 'bold',
          color: 'white',
          marginBottom: '10px'
        }}>
          Оплата не пройшла
        </h1>

        <p style={{
          color: '#94a3b8',
          marginBottom: '30px'
        }}>
          Спробуйте ще раз або зверніться до підтримки
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <a 
            href="/dashboard/billing"
            style={{
              display: 'block',
              padding: '12px 24px',
              background: '#ef4444',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '12px',
              fontWeight: '600'
            }}
          >
            Спробувати знову
          </a>

          <a 
            href="/dashboard"
            style={{
              display: 'block',
              padding: '12px 24px',
              background: '#334155',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '12px',
              fontWeight: '600'
            }}
          >
            Повернутись на головну
          </a>
        </div>
      </div>
    </div>
  );
}
