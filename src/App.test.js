import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";

test("Renders the questions correctly in the feedback form", () => {
  render(<App />);
  expect(screen.getByText(/1. Understanding of JSX/i)).toBeInTheDocument();
  expect(
    screen.getByText(/2. Understanding of Functional Components/i)
  ).toBeInTheDocument();
  expect(screen.getByText(/3. Understanding of State/i)).toBeInTheDocument();
  expect(screen.getByText(/4. Understanding of Props/i)).toBeInTheDocument();
  expect(screen.getByText(/5. Understanding of Hooks/i)).toBeInTheDocument();
});

test("submits feedback, calculates and displays results", () => {
  jest.spyOn(window, "alert").mockImplementation(() => {});
  render(<App />);
  fireEvent.click(screen.getAllByLabelText("Understood")[0]);
  fireEvent.click(screen.getAllByLabelText("Not Understood")[1]);
  fireEvent.click(screen.getAllByLabelText("Understood")[2]);
  fireEvent.click(screen.getAllByLabelText("Not Understood")[3]);
  fireEvent.click(screen.getAllByLabelText("Understood")[4]);

  fireEvent.click(screen.getByText(/Submit Feedback/i));
  expect(window.alert).toHaveBeenCalledWith("Feedback Submitted");

  fireEvent.click(screen.getAllByLabelText("Understood")[0]);
  fireEvent.click(screen.getAllByLabelText("Understood")[1]);
  fireEvent.click(screen.getAllByLabelText("Understood")[2]);
  fireEvent.click(screen.getAllByLabelText("Understood")[3]);
  fireEvent.click(screen.getAllByLabelText("Understood")[4]);

  fireEvent.click(screen.getByText(/Submit Feedback/i));
  expect(window.alert).toHaveBeenCalledWith("Feedback Submitted");

  fireEvent.click(screen.getByText(/Feedback Results/i));

  expect(screen.getByText(/Feedback Results/i)).toBeInTheDocument();
  expect(screen.getByText(/Total Submissions: 2/i)).toBeInTheDocument();

  const results = [
    screen.getByText(/Understanding of JSX/i),
    screen.getByText(/Understanding of Functional Components/i),
    screen.getByText(/Understanding of State/i),
    screen.getByText(/Understanding of Props/i),
    screen.getByText(/Understanding of Hooks/i),
  ];

  expect(results[0].textContent).toContain("100.00%");
  expect(results[1].textContent).toContain("50.00%");
  expect(results[2].textContent).toContain("100.00%");
  expect(results[3].textContent).toContain("50.00%");
  expect(results[4].textContent).toContain("100.00%");
});

test("displays error on incomplete feedback submission", () => {
  jest.spyOn(window, "alert").mockImplementation(() => {});
  render(<App />);

  fireEvent.click(screen.getAllByLabelText("Understood")[0]);
  fireEvent.click(screen.getAllByLabelText("Not Understood")[1]);

  fireEvent.click(screen.getByText(/Submit Feedback/i));
  expect(window.alert).toHaveBeenCalledWith("Please fill all the fields");
});

test("Sets value to progressbar, resets feedback data on clicking reset button", () => {
  jest.spyOn(window, "alert").mockImplementation(() => {});
  render(<App />);
  fireEvent.click(screen.getAllByLabelText("Understood")[0]);
  fireEvent.click(screen.getAllByLabelText("Understood")[1]);
  fireEvent.click(screen.getAllByLabelText("Understood")[2]);
  fireEvent.click(screen.getAllByLabelText("Understood")[3]);
  fireEvent.click(screen.getAllByLabelText("Not Understood")[4]);

  fireEvent.click(screen.getByText(/Submit Feedback/i));
  expect(window.alert).toHaveBeenCalledWith("Feedback Submitted");

  fireEvent.click(screen.getByText(/Feedback Results/i));
  expect(screen.getByText(/Feedback Results/i)).toBeInTheDocument();

  expect(screen.getByText(/Total Submissions: 1/i)).toBeInTheDocument();
  const results = [
    screen.getByText(/Understanding of JSX/i),
    screen.getByText(/Understanding of Functional Components/i),
    screen.getByText(/Understanding of State/i),
    screen.getByText(/Understanding of Props/i),
    screen.getByText(/Understanding of Hooks/i),
  ];

  expect(results[0].textContent).toContain("100.00%");
  expect(results[1].textContent).toContain("100.00%");
  expect(results[2].textContent).toContain("100.00%");
  expect(results[3].textContent).toContain("100.00%");
  expect(results[4].textContent).toContain("0.00%");

  // Testing Values assigned to progress bar
  expect(results[0].nextSibling.getAttribute("aria-valuenow")).toBe("100");
  expect(results[1].nextSibling.getAttribute("aria-valuenow")).toBe("100");
  expect(results[2].nextSibling.getAttribute("aria-valuenow")).toBe("100");
  expect(results[3].nextSibling.getAttribute("aria-valuenow")).toBe("100");
  expect(results[4].nextSibling.getAttribute("aria-valuenow")).toBe("0");

  fireEvent.click(screen.getByText(/Reset/i));
  expect(screen.getByText(/Total Submissions: 0/i)).toBeInTheDocument();
  results.forEach((result) => {
    expect(result.textContent).toContain("0%");
  });

  fireEvent.click(screen.getByText(/Back to Feedback/i));
  expect(screen.getByText(/Submit Feedback/i)).toBeInTheDocument();
});
