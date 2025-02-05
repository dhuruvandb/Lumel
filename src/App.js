import "./App.css";
import Table from "./Table";

const initialData = {
  rows: [
    {
      id: "electronics",
      label: "Electronics",
      value: 1500,
      children: [
        {
          id: "phones",
          label: "Phones",
          value: 800,
        },
        {
          id: "laptops",
          label: "Laptops",
          value: 700,
        },
      ],
    },
    {
      id: "furniture",
      label: "Furniture",
      value: 1000,
      children: [
        {
          id: "tables",
          label: "Tables",
          value: 300,
        },
        {
          id: "chairs",
          label: "Chairs",
          value: 700,
        },
      ],
    },
  ],
};

const App = () => {
  return (
    <div className="App">
      <h1>Hierarchical Table</h1>
      <Table data={initialData} />
    </div>
  );
};

export default App;
