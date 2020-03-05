import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import AddIcon from '@material-ui/icons/Add';
import AddCateringDialog from './AddCateringDialog';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    toolbar: {
        paddingRight: 24, // keep right padding when drawer closed
    },
    toolbarIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: 36,
    },
    menuButtonHidden: {
        display: 'none',
    },
    title: {
        flexGrow: 1,
    },
    drawerPaper: {
        position: 'relative',
        whiteSpace: 'nowrap',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerPaperClose: {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9),
        },
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
    },
    container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    },
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
    fixedHeight: {
        height: 240,
    },
    biggerText: {
        fontSize:"1.5em",
    }
}));




export default function Caterings() {
    const classes = useStyles();
    const [open, setOpen] = React.useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [users, setUsers] = useState(null);
    const [caterings, setCaterings] = useState(null);
    const handleDrawerOpen = () => {
        setOpen(true);
    };
    const handleDrawerClose = () => {
        setOpen(false);
    };

    const handleDialogClose = () =>{
        setDialogOpen(false);
    }

    const handleDialogOpen = () => {
        setDialogOpen(true);
    }

    const fetchCaterings = async () => {
        const apiCall = await fetch("/api/catering/all");
        const cateringsRes = await apiCall.json();
        console.log(cateringsRes)
        setCaterings(cateringsRes);
    }

    useState(() => {
        fetchCaterings();
    }, []);

    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);    

    return (
        <main className={classes.content}> 
            <div className={classes.appBarSpacer} />

            <Container className={classes.container} maxWidth="xl">
                <Grid container spacing={3}>
                    <Grid item xs={12} md={12} lg={12}>
                        <div className={classes.appBarSpacer}>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<AddIcon />}
                                onClick={handleDialogOpen}
                                className={classes.biggerText}
                            >
                                Dodaj
                            </Button>
                        </div>
                        <Paper className={fixedHeightPaper}>
                            <Grid item lg={12}>
                                <h4>Popis Cateringa</h4>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>R. br.</TableCell>
                                            <TableCell>Naziv eventa</TableCell>
                                            <TableCell>Naziv klijenta</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {caterings != null ? caterings.map((item, index) => {
                                            return(
                                                <TableRow key={item.cateringTitle}>
                                                    <TableCell>{index + 1}</TableCell>
                                                    <TableCell>{item.cateringTitle}</TableCell>
                                                    <TableCell>{item.clientName}</TableCell>
                                                </TableRow>
                                            )
                                        }) : null}
                                    </TableBody>
                                </Table>
                            </Grid>
                        </Paper>
                    </Grid>
                    
                </Grid>
                
            </Container>
            <AddCateringDialog open={dialogOpen} handleClose={handleDialogClose} />
        </main>    
    )
}