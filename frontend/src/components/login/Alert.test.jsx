// Importa as dependências necessárias
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Alert from "./Alert";
import { AlertContext } from "../../contexts/alertContext";
import { AlertTypeContext } from "../../contexts/alertTypeContext";
import { AlertColorContext } from "../../contexts/alertColorContext";

describe("Alert Component", () => {
  it("deve renderizar o alerta com mensagem e botão de fechar", () => {
    const setShowAlert = vi.fn();

    const { container } = render(
      <AlertContext.Provider value={[true, setShowAlert]}>
        <AlertTypeContext.Provider value={["Mensagem de erro"]}>
          <AlertColorContext.Provider value={["danger"]}>
            <Alert />
          </AlertColorContext.Provider>
        </AlertTypeContext.Provider>
      </AlertContext.Provider>
    );

    expect(screen.getByText("Mensagem de erro")).toBeInTheDocument();
    expect(container.querySelector(".btn-close")).toBeInTheDocument();
  });

  it("não deve renderizar o alerta quando showAlert for false", () => {
    const setShowAlert = vi.fn();

    render(
      <AlertContext.Provider value={[false, setShowAlert]}>
        <AlertTypeContext.Provider value={["Mensagem de erro"]}>
          <AlertColorContext.Provider value={["danger"]}>
            <Alert />
          </AlertColorContext.Provider>
        </AlertTypeContext.Provider>
      </AlertContext.Provider>
    );

    expect(screen.queryByText("Mensagem de erro")).not.toBeInTheDocument();
  });

  it("deve executar a função de fechar ao clicar no botão de fechar", () => {
    const setShowAlert = vi.fn();

    const { container } = render(
      <AlertContext.Provider value={[true, setShowAlert]}>
        <AlertTypeContext.Provider value={["Mensagem de erro"]}>
          <AlertColorContext.Provider value={["danger"]}>
            <Alert />
          </AlertColorContext.Provider>
        </AlertTypeContext.Provider>
      </AlertContext.Provider>
    );

    const closeButton = container.querySelector(".btn-close");
    fireEvent.click(closeButton);

    expect(setShowAlert).toHaveBeenCalledWith(false);
  });

  it("deve aplicar a classe de estilo correta para sucesso", () => {
    const setShowAlert = vi.fn();

    render(
      <AlertContext.Provider value={[true, setShowAlert]}>
        <AlertTypeContext.Provider value={["Mensagem de sucesso"]}>
          <AlertColorContext.Provider value={["success"]}>
            <Alert />
          </AlertColorContext.Provider>
        </AlertTypeContext.Provider>
      </AlertContext.Provider>
    );

    const alertElement = screen.getByText("Mensagem de sucesso").parentElement;
    expect(alertElement).toHaveClass("alert-success");
  });

  it("deve aplicar a classe de estilo correta para erro", () => {
    const setShowAlert = vi.fn();

    render(
      <AlertContext.Provider value={[true, setShowAlert]}>
        <AlertTypeContext.Provider value={["Mensagem de erro"]}>
          <AlertColorContext.Provider value={["danger"]}>
            <Alert />
          </AlertColorContext.Provider>
        </AlertTypeContext.Provider>
      </AlertContext.Provider>
    );

    const alertElement = screen.getByText("Mensagem de erro").parentElement;
    expect(alertElement).toHaveClass("alert-danger");
  });
});
