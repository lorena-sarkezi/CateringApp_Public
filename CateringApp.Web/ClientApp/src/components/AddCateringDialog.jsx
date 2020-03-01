import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const fontSize = {
    fontSize:"2em"
};

export default function AddCateringDialog(props) {
    return (
        <Dialog open={props.open} onClose={props.handleClose} maxWidth="lg">
            <DialogTitle id="catering-dialog-title" style={fontSize} disableTypography>Unos novog Cateringa</DialogTitle>
            <DialogContent>
                <TextField 
                    autoFocus
                    id="catering-title"
                    label="Naziv"
                    type="text"
                    fullWidth={true}
                    required
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={props.handleClose} color="default">Odustani</Button>
                <Button onclick={props.onsavehandler} color="primary">Spremi</Button>
            </DialogActions>
        </Dialog>
    )
}