import { LoginProvider } from "../../contexts/loginContext.jsx";
import Form from "./Form.jsx";
import Button from "./Button.jsx";
import Alert from "./Alert.jsx";
import { Link } from "react-router-dom";
import "../../styles/global.css";
import "../../styles/login.css";

/**
 * Componente Login
 *
 * Este componente representa a página de login da aplicação. Ele utiliza vários provedores de contexto
 * para gerenciar o estado global relacionado ao login e aos alertas. A página inclui um formulário de login,
 * um botão de envio, um link para recuperação de senha e um link para cadastro.
 */

function Login() {
  return (
    // <AlertTypeProvider>
    // <AlertProvider>
    <>
      <Alert></Alert>
      <div className="mainContainer backgroundLogin">
        <div className="loginContainer">
          <h1 className="title">SALVATOUR</h1>

          <LoginProvider>
            <Form></Form>

            <Link className="links" to="/recovery">
              Esqueci minha senha
            </Link>

            <Button></Button>

            <p className="text-cadastro">
              Ainda não possui acesso?
              <Link className="link-cadastro" to="/cadastro">
                {" "}
                Cadastre-se
              </Link>
            </p>
          </LoginProvider>
        </div>
      </div>
    </>
    // </AlertProvider>
    // </AlertTypeProvider>
  );
}

export default Login;
