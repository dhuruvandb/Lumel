import { useState } from "react";

const Row = ({ row, depth, onUpdate, originalValues }) => {
  const [inputValue, setInputValue] = useState("");
  const originalValue = originalValues[row.id] || row.value;

  const handleAllocationPercentage = () => {
    const percentage = parseFloat(inputValue);
    if (!isNaN(percentage)) {
      const newValue = row.value + (row.value * percentage) / 100;
      onUpdate(row.id, newValue);
    }
    setInputValue("");
  };

  const handleAllocationValue = () => {
    const newValue = parseFloat(inputValue);
    if (!isNaN(newValue)) {
      onUpdate(row.id, newValue);
    }
    setInputValue("");
  };

  const variance = ((row.value - originalValue) / originalValue) * 100;

  return (
    <>
      <tr>
        <td style={{ paddingLeft: `${depth * 20}px` }}>
          {depth > 0 ? "-- ".repeat(depth) + row.label : row.label}
        </td>
        <td>{row.value.toFixed(2)}</td>
        <td>
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </td>
        <td>
          <button onClick={handleAllocationPercentage}>Allocation %</button>
        </td>
        <td>
          <button onClick={handleAllocationValue}>Allocation Val</button>
        </td>
        <td>{variance.toFixed(2)}%</td>
      </tr>
      {row.children &&
        row.children.map((child) => (
          <Row
            key={child.id}
            row={child}
            depth={depth + 1}
            onUpdate={onUpdate}
            originalValues={originalValues}
          />
        ))}
    </>
  );
};

export default Row;
