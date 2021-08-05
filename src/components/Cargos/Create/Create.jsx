import React, { useState, useContext, useEffect } from "react";

import apiCargos from "../../../services/api.cargos";
import apiUsuarios from "../../../services/api.usuarios";

//TODO: Alterar o alerta
import {
	Typography,
	Button,
	Fade,
	Backdrop,
	Modal,
	makeStyles,
	TextField,
	Input,
	Paper,
	Card,
} from "@material-ui/core";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

import { withStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import Favorite from "@material-ui/icons/Favorite";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";

import { UserContext } from "../../../context/UserContext";

function Alert(props) {
	return <MuiAlert elevation={6} variant="filled" {...props} />;
}

//TODO: tirar o ALERT

function Create({
	handleClose,
	api,
	handleOpenExistentes,
	contextApi,
	apiUsuario,
}) {
	const context = useContext(UserContext);
	const [onChecked, setOnChecked] = useState(true);
	const [checked, setChecked] = useState(true);
	const [nome, setNome] = useState("");
	const [imagem, setImagem] = useState(null);
	const [caminho, setCaminho] = useState(null);
	const [usuario, setUsuario] = useState("");
	const [msg, setMsg] = useState("");

	useEffect(() => {
		apiUsuarios
			.obterUsuarioPorId(context.usuarioAtual)
			.then((res) => setUsuario(res.nome));
	}, []);

	const handleChange = (e) => {
		onChecked ? setOnChecked(false) : setOnChecked(true);
		setChecked(e.target.checked);
	};

	const handleCriate = () => {
		const formData = new FormData();

		formData.append("nome", nome.trim());
		formData.append("img", imagem);

		if (nome.length > 0 && imagem !== null) {
			apiCargos.adicionarCargo(formData).then((res) => {
				if (res.status === 201) {
					setOpenAlert(true);
					if (checked) {
						apiUsuarios.editarPapel(context.usuarioAtual, res.data.idCargo);
						setMsg(" e atribuído com sucesso");
						contextApi();
						handleOpenExistentes();
					}
				} else {
					setOpenAlertError(true);
				}
			});
			api();
			apiUsuario();
		} else {
			alert("Algo deu errado!");
		}
	};

	const handleFile = (e) => {
		setImagem(e.target.files[0]);
		setCaminho(URL.createObjectURL(e.target.files[0]));
	};

	//Snackbar/Alert
	//AlertSucess

	const [openAlert, setOpenAlert] = React.useState(false);

	const handleClickAlert = () => {
		setOpenAlert(true);
	};

	const handleCloseAlert = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}

		setOpenAlert(false);
	};

	//

	//Alert Error

	const [openAlertError, setOpenAlertError] = React.useState(false);

	const handleClickAlertError = () => {
		setOpenAlertError(true);
	};

	const handleCloseAlertError = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}

		setOpenAlertError(false);
	};

	//

	const classes = useStyles();
	return (
		<Card elevation={0} className={classes.paper}>
			<Snackbar
				open={openAlert}
				autoHideDuration={3000}
				onClose={handleCloseAlert}
			>
				<Alert onClose={handleCloseAlert} severity="success">
					Cargo criado com sucesso{msg}!!!
				</Alert>
			</Snackbar>
			<Snackbar
				open={openAlertError}
				autoHideDuration={4000}
				onClose={handleCloseAlertError}
			>
				<Alert onClose={handleCloseAlertError} severity="error">
					Houve algum erro ao criar cargo.
				</Alert>
			</Snackbar>
			<div
				className={classes.paper}
				style={{
					alignSelf: "center",
					flexDirection: "column",
					display: "flex",
					justifyContent: "center",
				}}
			>
				<div style={{ marginLeft: "auto", marginRight: "auto" }}>
					<img
						src={caminho}
						style={{
							width: 100,
							height: 100,
							borderRadius: 400 / 2,
							borderStyle: "solid",
							borderColor: "#0083C1",
							borderWidth: 5,
							backgroundColor: "#F5F3F4",
						}}
					/>
				</div>
				<Input type="file" onChange={handleFile} />
				<TextField
					required
					id="filled-required"
					label="Nome (MAX. 20)"
					defaultValue=""
					variant="filled"
					onChange={(e) => setNome(e.target.value)}
					value={nome}
					type="text"
					inputProps={{ maxLength: 20 }}
					style={{ width: "auto" }}
					className={classes.inputText}
				/>
				<FormControlLabel
					control={
						<Checkbox
							checked={onChecked}
							onChange={handleChange}
							name="checkedB"
							color="primary"
						/>
					}
					label={`Atribuir cargo a ${usuario}.`}
				/>
				<div>
					<Button
						variant="contained"
						color="primary"
						className={classes.button}
						onClick={handleCriate}
					>
						Criar
					</Button>
				</div>
				<div>
					<Button
						variant="contained"
						color="secondary"
						onClick={handleOpenExistentes}
						className={classes.button}
					>
						Cancelar
					</Button>
				</div>
			</div>
		</Card>
	);
}

export default Create;

const useStyles = makeStyles((theme) => ({
	modal: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
	},
	paper: {
		borderRadius: 20,
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		textAlign: "center",
	},
	button: {
		marginTop: 15,
	},
	buttonCancel: {
		margin: 5,
		backgroundColor: "#F22",
		"&:hover": {
			backgroundColor: "#F00",
		},
	},
	inputText: {
		marginTop: 7,
		marginBottom: 7,
	},
}));

const papercss = {
	padding: "25px 20px",
	width: 400,
	margin: "30px auto",
	borderRadius: 20,
};
