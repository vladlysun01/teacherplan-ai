'use client';

export default function SuccessPage() {
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
        border: '1px solid rgba(34, 197, 94, 0.3)',
        borderRadius: '16px',
        padding: '40px',
        textAlign: 'center'
      }}>
        <div style={{
          fontSize: '64px',
          marginBottom: '20px'
        }}>
          ✅
        </div>

        <h1 style={{
          fontSize: '28px',
          fontWeight: 'bold',
          color: 'white',
          marginBottom: '10px'
        }}>
          Оплата успішна!
        </h1>

        <p style={{
          color: '#94a3b8',
          marginBottom: '30px'
        }}>
          Кредити додано на ваш рахунок
        </p>

        <a 
          href="/dashboard"
          style={{
            display: 'block',
            padding: '12px 24px',
            background: '#22c55e',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '12px',
            fontWeight: '600',
            transition: 'all 0.3s'
          }}
        >
          Повернутись на головну
        </a>
      </div>
    </div>
  );
}
