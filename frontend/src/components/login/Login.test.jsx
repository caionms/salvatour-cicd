import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter as Router } from "react-router-dom";
import Login from "./Login";
import { LoginProvider } from "../../contexts/loginContext";
import { AlertProvider } from "../../contexts/alertContext";
import { AlertTypeProvider } from "../../contexts/alertTypeContext";
import {AlertColorProvider} from '../../contexts/alertColorContext'

describe("Login Component", () => {

  let setShowAlert = vi.fn();
  let alert = true;
  function renderLogin() {
    render(
      <Router>
        <AlertColorProvider>
          <AlertTypeProvider>
            <AlertProvider>
              <Login />
            </AlertProvider>
          </AlertTypeProvider>
        </AlertColorProvider>
      </Router>
    );
  }

  it("renders the SALVATOUR title", () => {
    renderLogin();
    expect(screen.getByText(/SALVATOUR/i)).toBeInTheDocument();
  });

  test("renders the form input fields and buttons", () => {
    renderLogin();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/senha/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /fazer login/i })).toBeInTheDocument();
  });

  test("renders the forgot password and signup links", () => {
    renderLogin();
    expect(screen.getByText(/esqueci minha senha/i)).toHaveAttribute("href", "/recovery");
    expect(screen.getByText(/cadastre-se/i)).toHaveAttribute("href", "/cadastro");
  });

  test("alerts are rendered but hidden initially", () => {
    renderLogin();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  test("allows typing in the email and password fields", async () => {
    renderLogin();

    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/senha/i);

    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "password123");

    expect(emailInput).toHaveValue("test@example.com");
    expect(passwordInput).toHaveValue("password123");
  });

  test("clicking the login button triggers form submission", async () => {
    renderLogin();
    const loginButton = screen.getByRole("button", { name: /fazer login/i });

    await userEvent.click(loginButton);

    // Further assertions can be added here based on form submission behavior
  });
});
