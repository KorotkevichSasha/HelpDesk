/**
 * Temperature — отображение температуры с единицей измерения
 */
export default function Temperature({ value, unit = '°C', className = '' }) {
  return (
    <span className={`temperature ${className}`}>
      {value > 0 ? `+${value}` : value}
      <span className="temperature__unit">{unit}</span>
    </span>
  );
}
