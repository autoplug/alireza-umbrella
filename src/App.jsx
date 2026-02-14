import './App.css';

function App() {
  return (
    <div>
      <h1>قیمت ارزها</h1>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>نماد</th>
            <th>خرید</th>
            <th>فروش</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.symbol}>
              <td>{item.symbol}</td>
              <td>{item.buy}</td>
              <td>{item.sell}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
