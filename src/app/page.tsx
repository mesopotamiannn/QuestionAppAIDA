export default function Home() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      gap: '2rem'
    }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>
        Question App
      </h1>
      <p>Setup Complete.</p>
    </div>
  );
}
