import React, {useState, useEffect} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Autocomplete } from '@material-ui/lab';
import { InputLabel } from '@material-ui/core';
import Select from '@material-ui/core/Select';
import {FormControl} from '@material-ui/core';
import {Divider} from '@material-ui/core';
import { MenuItem} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {Container} from "@material-ui/core";


const useStyles = makeStyles(theme => ({
    root: {
      '& > *': {
        margin: theme.spacing(1),
        width: 200,
      },
    },
  }));


export default function AddCateringDialog(props) {

    const [users, setUsers] = useState(null);

    const fetchUsers = async () => {
        const apiCall = await fetch("/api/catering/users");
        const usersRes = await apiCall.json();
        console.log(usersRes)
        setUsers(usersRes);
    }

    useEffect(() => {
        fetchUsers();
    }, []);

    //const userOptions = 

    const labelFontSize = {
        fontSize:"2em"
    };
    
    const buttonFontSize = {
        fontSize:"1.5em"
    }

    const [isValidCateringName, setIsValidCateringName] = useState(true);
    const [cateringName, setCateringName] = useState(null);
    const [clientName, setClientName] = useState(null);

    const [selectedUser, setSelectedUser] = useState(null);

    

    const classes = useStyles();
    

    const handleCateringNameChange = (event) => {
        setCateringName(event.target.value);
        setIsValidCateringName(cateringName != ""  );
        console.log(isValidCateringName);
    }

    const handleClientNameChange = (event) => {
        setClientName(event.target.value);
    }

    const onSaveHandler = async () => {
        if(isValidCateringName && cateringName != ""){
            const data = {
                cateringTitle:cateringName,
                clientName:clientName,
                assignedUsersIds: [selectedUser]
            };
            console.log(data);
    
            const postData = await fetch("/api/catering",{
                method: "post",
                body: JSON.stringify(data),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  }
            }).catch((error) => {
                console.log(error)
            });
                
            
        }
        else if (cateringName == ""){
            setIsValidCateringName(false);
        }
        
    }

    return (
        <Dialog open={props.open} onClose={props.handleClose} fullWidth={true} maxWidth="md">
            <DialogTitle id="catering-dialog-title" style={labelFontSize} disableTypography>Unos novog Cateringa</DialogTitle>
            <DialogContent>

                <Container fixed>
                    <form noValidate classname={classes.root}>
                        <FormControl 
                            fullWidth={true}
                        >
                            <TextField 
                                autoFocus
                                
                                label="Naziv Cateringa"
                                type="text"
                                fullWidth={true}
                                onChange={handleCateringNameChange}
                                required
                                error={isValidCateringName == false}
                                helperText={isValidCateringName==false ? "Obavezno polje" : ""}
                                style={labelFontSize}
                                autoFocus={false}
                                inputProps={{
                                    style: {labelFontSize}
                                }}
                            />
                            <Divider />
                            <TextField 
                                autoFocus
                                
                                label="Naziv klijenta"
                                type="text"
                                fullWidth={true}
                                onChange={handleClientNameChange}
                                required
                                error={isValidCateringName == false}
                                helperText={isValidCateringName==false ? "Obavezno polje" : ""}
                                style={labelFontSize}
                                autoFocus={false}
                                inputProps={{
                                    style: {labelFontSize}
                                }}
                            />
                            
                            
                            <Divider />
        
                            <Select onChange={(event) => setSelectedUser(event.target.value)} >
                                <MenuItem value="" disabled>Zaposlenik...</MenuItem>
                                {users != null ? users.map(item =>{
                                    
                                    return <MenuItem value={item.userId} key={item.userId}>{item.userFullName}</MenuItem>;
                                }) : null}
                            </Select>
                        </FormControl>
                    </form>
                </Container>
                
            </DialogContent>
            <DialogActions>
                <Button onClick={props.handleClose} color="default" variant="contained" style={buttonFontSize} >Odustani</Button>
                <Button onClick={onSaveHandler} color="primary" variant="contained" style={buttonFontSize} >Spremi</Button>
            </DialogActions>
        </Dialog>
    )
}