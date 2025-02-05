import { useEffect, useState } from "react";
import Row from "./Row";

const Table = ({ data }) => {
  const [rows, setRows] = useState(data.rows);
  const [originalValues, setOriginalValues] = useState({});

  useEffect(() => {
    const calculateOriginalValues = (rows) => {
      const values = {};
      const traverse = (rows) => {
        rows.forEach((row) => {
          values[row.id] = row.value;
          if (row.children) traverse(row.children);
        });
      };
      traverse(rows);
      return values;
    };
    setOriginalValues(calculateOriginalValues(rows));
  }, []);

  useEffect(() => {
    const calculateSubtotals = (rows) => {
      return rows.map((row) => {
        if (row.children) {
          const children = calculateSubtotals(row.children);
          const subtotal = children.reduce(
            (sum, child) => sum + child.value,
            0
          );
          return { ...row, children, value: subtotal };
        }
        return row;
      });
    };
    setRows(calculateSubtotals(rows));
  }, [rows]);

  const handleUpdate = (id, newValue) => {
    const updateRow = (rows) => {
      return rows.map((row) => {
        if (row.id === id) {
          if (row.children) {
            const totalChildValue = row.children.reduce(
              (sum, child) => sum + child.value,
              0
            );
            const updatedChildren = row.children.map((child) => ({
              ...child,
              value: (child.value / totalChildValue) * newValue,
            }));
            return { ...row, value: newValue, children: updatedChildren };
          }
          return { ...row, value: newValue };
        }
        if (row.children) {
          return { ...row, children: updateRow(row.children) };
        }
        return row;
      });
    };
    setRows(updateRow(rows));
  };

  return (
    <table>
      <thead>
        <tr>
          <th>Label</th>
          <th>Value</th>
          <th>Input</th>
          <th>Allocation %</th>
          <th>Allocation Val</th>
          <th>Variance %</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <Row
            key={row.id}
            row={row}
            depth={0}
            onUpdate={handleUpdate}
            originalValues={originalValues}
          />
        ))}
      </tbody>
    </table>
  );
};

export default Table;
