


export default function () {
    return ( 
      <footer style={{
        padding: '40px 20px',
        background: 'rgba(15, 23, 42, 0.9)',
        borderTop: '1px solid rgba(148, 163, 184, 0.1)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div style={{
            color: '#cbd5e1',
            fontSize: '14px'
          }}>
            © 2024 Banking Professional Portfolio. All rights reserved.
          </div>
          <div style={{
            display: 'flex',
            gap: '20px'
          }}>
            {['LinkedIn', 'Email', 'Phone'].map((contact) => (
              <button
                key={contact}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'color 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.color = '#3b82f6'}
                onMouseLeave={(e) => e.target.style.color = '#94a3b8'}
              >
                {contact}
              </button>
            ))}
          </div>
        </div>
      </footer>
      );
}