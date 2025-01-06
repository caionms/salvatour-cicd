import { useEffect, useState } from "react";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import {
  Button,
  TextField,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  OutlinedInput,
  FormHelperText,
  Tooltip,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import DeleteFilledIcon from "@mui/icons-material/DeleteOutlined";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import { useNavigate } from "react-router-dom";
import { Modal } from "react-bootstrap";
import Header from "../home/Header";
import EditUser from "./EditUser";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

export default function Admin({
  users,
  name,
  nameHelperText,
  email,
  emailHelperText,
  city,
  cityHelperText,
  state,
  stateHelperText,
  password,
  passwordHelperText,
  showCreateUser,
  showEditUser,
  setName,
  setEmail,
  setCity,
  setState,
  setPassword,
  setShowCreateUser,
  setShowEditUser,
  onGetAllUsers,
  onCreateUser,
  onDeleteUser,
  onDeleteMultipleUsers,
  onUpdateUser,
}) {
  const [selection, setSelection] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const isSelectionEmpty = () => selection.length == 0;
  const token = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("isAdmin");
  const [selectedUser, setSelectedUser] = useState(null);
  const [warning, setWarning] = useState(false);
  const navigate = useNavigate();

  const processRowUpdate = (newRow) => {
    onUpdateUser(newRow);
    return newRow;
  };

  useEffect(() => {
    if (isAdmin == "false" && warning == false) {
      setWarning(true);
      window.alert("Voce não é um administrador.");
      navigate("/");
      return;
    }

    if (!token && warning == false) {
      setWarning(true);
      window.alert("Voce não está autenticado.");
      navigate("/");
      return;
    }

    onGetAllUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function confirmDeleteRow(id) {
    if (window.confirm(`Você deseja deletar o registro de id:${id}`)) {
      console.log(id);
      onDeleteUser(id);
    }
  }

  function confirmDeleteRows() {
    if (window.confirm(`Você deseja deletar ${selection.length} registros?`)) {
      onDeleteMultipleUsers(selection);
    }
  }

  const columns = [
    { field: "id", headerName: "ID", width: window.innerWidth / 6 },
    {
      field: "name",
      headerName: "Nome",
      width: window.innerWidth / 6,
      editable: true,
    },
    {
      field: "email",
      headerName: "E-mail",
      width: window.innerWidth / 6,
      editable: true,
    },
    {
      field: "city",
      headerName: "Cidade",
      width: window.innerWidth / 6,
      editable: true,
    },
    {
      field: "state",
      headerName: "Estado",
      width: window.innerWidth / 6,
      editable: true,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Ações",
      width: 80,
      cellClassName: "Actions",
      getActions: ({ id }) => {
        return [
          <Tooltip title="Editar usuário" key={`edit-${id}`}>
            <GridActionsCellItem
              key={1}
              icon={<ModeEditOutlineIcon />}
              label="Edit"
              onClick={() => {
                const user = users.find((user) => user.id == id);
                console.log(user);
                setSelectedUser(user);
                setShowEditUser(!showEditUser);
              }}
            />
          </Tooltip>,
          <Tooltip title="Deletar usuário" key={`delete-${id}`}>
            <GridActionsCellItem
              key={0}
              icon={<DeleteFilledIcon />}
              label="Delete"
              onClick={() => {
                confirmDeleteRow(id);
              }}
              color="error"
            />
          </Tooltip>,
        ];
      },
    },
  ];

  return (
    <>
      <Header />
      <div
        className="root"
        style={{
          display: "flex",
          flexDirection: "column",
          padding: 15,
          width: "100%",
          alignItems: "center",
        }}
      >
        <div
          className="button-group"
          style={{
            display: "flex",
            flexDirection: "row",
            marginBottom: 7,
            width: "100%",
            justifyContent: "flex-end",
          }}
        >
          <Button
            variant="contained"
            style={{ marginRight: 15 }}
            onClick={() => {
              setShowCreateUser(!showCreateUser);
            }}
          >
            Adicionar usuário
          </Button>
          <Button
            variant="contained"
            disabled={isSelectionEmpty()}
            color="error"
            onClick={() => {
              confirmDeleteRows();
            }}
          >
            Deletar
          </Button>
        </div>
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <DataGrid
            rows={users}
            columns={columns}
            checkboxSelection
            onRowSelectionModelChange={(newSelection) => {
              setSelection(newSelection);
              console.log("selection", selection);
            }}
            processRowUpdate={processRowUpdate}
          />
        </div>
        <Modal
          show={showCreateUser}
          onHide={() => setShowCreateUser(!showCreateUser)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Novo usuário</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form
              onSubmit={(event) => {
                onCreateUser(event);
              }}
              style={{ paddingTop: "15px", textAlign: "center" }}
            >
              <TextField
                id="name"
                label="Nome"
                variant="outlined"
                required
                value={name}
                helperText={nameHelperText}
                error={nameHelperText != ""}
                onChange={(event) => {
                  setName(event.target.value);
                }}
                style={{ width: "100%" }}
              />

              <br />
              <br />

              <TextField
                id="email"
                label="E-mail"
                variant="outlined"
                required
                value={email}
                helperText={emailHelperText}
                error={emailHelperText != ""}
                onChange={(event) => {
                  setEmail(event.target.value);
                }}
                style={{ width: "100%" }}
              />

              <br />
              <br />

              <TextField
                id="city"
                label="Cidade"
                variant="outlined"
                required
                value={city}
                helperText={cityHelperText}
                error={cityHelperText != ""}
                onChange={(event) => {
                  setCity(event.target.value);
                }}
                style={{ width: "100%" }}
              />

              <br />
              <br />

              <TextField
                id="state"
                label="Estado"
                variant="outlined"
                required
                value={state}
                helperText={stateHelperText}
                error={stateHelperText != ""}
                onChange={(event) => {
                  setState(event.target.value);
                }}
                style={{ width: "100%" }}
              />

              <br />
              <br />

              <FormControl
                variant="outlined"
                style={{ width: "100%" }}
                helperText={passwordHelperText}
                error={passwordHelperText != ""}
              >
                <InputLabel htmlFor="password">Senha</InputLabel>
                <OutlinedInput
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        onMouseDown={(event) => event.preventDefault}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
                <FormHelperText id="password">
                  {passwordHelperText}
                </FormHelperText>
              </FormControl>

              <br />
              <br />

              <Button
                style={{ width: "100%" }}
                type="submit"
                variant="contained"
              >
                Enviar
              </Button>
            </form>
          </Modal.Body>
        </Modal>

        {selectedUser ? (
          <EditUser
            user={selectedUser}
            showEditUser={showEditUser}
            setShowEditUser={setShowEditUser}
            onUpdateUser={onUpdateUser}
          />
        ) : (
          <div></div>
        )}
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover={false}
          theme="colored"
        />
      </div>
    </>
  );
}
