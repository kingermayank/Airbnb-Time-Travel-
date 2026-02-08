import './TransactionLoader.css';

export function TransactionLoader() {
  return (
    <div className="transaction-loader-container">
      <div className="bouncing-dots-container">
        <div className="bouncing-dot bouncing-dot-1 transaction-dot" />
        <div className="bouncing-dot bouncing-dot-2 transaction-dot" />
        <div className="bouncing-dot bouncing-dot-3 transaction-dot" />
      </div>
    </div>
  );
}

