import FormCadastro from "./FormCadastro";
import SubmitCadastro from "./SubmitCadastro";
import Alert from "../login/Alert";
import { FormCadastroProvider } from "../../contexts/formCadastroContext";
import "../../styles/global.css";
import "../../styles/cadastro.css";

/**
 * Componente Cadastro
 *
 * Este componente representa a página de Cadastro
 *
 */

function Cadastro() {
  return (
    <>
      <Alert></Alert>
      <div className="mainContainerCadastro background">
        <FormCadastroProvider>
          <FormCadastro></FormCadastro>

          <SubmitCadastro></SubmitCadastro>
        </FormCadastroProvider>
      </div>
    </>
  );
}

export default Cadastro;
