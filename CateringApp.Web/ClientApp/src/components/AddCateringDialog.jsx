import React, {useState} from 'react';
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






export default function AddCateringDialog(props) {
    let users = [];

    console.log();

    const [usersState, setUsersState] = useState({});

    fetch("/api/catering/users")
    .then(res => res.json())
    .then(data => {
        users = data;
        //setUsersState(data);
        console.log(data);
    });

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

    

    const handleCateringNameChange = (event) => {
        setCateringName(event.target.value);
        setIsValidCateringName(cateringName != ""  );
        console.log(isValidCateringName);
    }

    const handleClientNameChange = (event) => {
        setClientName(event.target.value);
    }

    const onSaveHandler = () => {
        if(isValidCateringName && cateringName != ""){
            const data = {
                cateringName:cateringName,
                clientName:clientName,
                user: [selectedUser]
            };

            console.log(data);
    
            fetch("/api/catering", {
                method: "post",
                body: JSON.stringify(data)
            }).then(props.handleClose);
        }
        else if (cateringName == ""){
            setIsValidCateringName(false);
        }
        
    }

    return (
        <Dialog open={props.open} onClose={props.handleClose} fullWidth={true} maxWidth="md">
            <DialogTitle id="catering-dialog-title" style={labelFontSize} disableTypography>Unos novog Cateringa</DialogTitle>
            <DialogContent>
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
                    
                    {/* <Autocomplete 
                        id="users-dropdown"
                        options={users}
                        getOptionLabel={option => option.userFullName}
                        value={val => val.userId}
                        renderInput={params => <TextField {...params} label="Odabir zaposlenika" variant="outlined" />}
                    /> */}
                    <Divider />

                    <Select onChange={(event) => setSelectedUser(event.target.value)} >
                        <MenuItem value="" disabled>Zaposlenik...</MenuItem>
                        {users.map(item =>(
                            
                            <MenuItem value={item.userId} key={item.userId}>{item.userFullName}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                
            </DialogContent>
            <DialogActions>
                <Button onClick={props.handleClose} color="default" variant="contained" style={buttonFontSize} >Odustani</Button>
                <Button onClick={onSaveHandler} color="primary" variant="contained" style={buttonFontSize} >Spremi</Button>
            </DialogActions>
        </Dialog>
    )
}