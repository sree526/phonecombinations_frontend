import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TextField from '@material-ui/core/TextField';
import TableRow from '@material-ui/core/TableRow';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import Fade from '@material-ui/core/Fade';
import {useState} from 'react';
import axios from "axios";
const COMBINATIONS_URL = "http://localhost:8080/combinations/";
const columns = [
    { id: 'phone number', label: 'Combination of phoneNumbers', minWidth: 100,align: 'center' }
];

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    placeholder: {
        height: 40,
    },
    paper: {
        padding: theme.spacing(2),
        margin: 'auto',
        maxWidth: 500,
    }
}));

export default function App() {
    const classes = useStyles();
    const [rows, setRows] = useState([]);
    const [rowCount,setRowCount] = useState(0);
    const [page, setPage] = React.useState(0);
    const [loading, setLoading] = React.useState(false);
    const [phonenumber, setPhoneNumber]= useState('');
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [error,setError] = useState(false);
    const [errorMessage,setErrorMessage]= useState('');
    const handleChangePage = async(event, newPage) => {
        setPage(newPage);
        console.log(newPage);
        let res = await axios.post(COMBINATIONS_URL+'/'+newPage,{
            phonenumber:phonenumber
        });
        setRows(combinations => ([...combinations, ...res.data.combinations]));
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const handleInputChange = async(event) => {

        if(event.target.value.length === 10){
            setError(false);
            setErrorMessage('');
            setRows([]);
            setLoading((prevLoading) => !prevLoading);
            console.log(event.target.value);
            setPhoneNumber(event.target.value);
            let res = await axios.post(COMBINATIONS_URL+'/0',{
                phonenumber:event.target.value
            });
            setLoading((prevLoading) => !prevLoading);
            setRows(combinations => ([...combinations, ...res.data.combinations]));
            setRowCount(res.data.totalCombinations)
        } else {
            setError(true);
            setErrorMessage('Phone number length should be equal to 10');
        }
    };

    return (
        <div className={classes.root}>

            <div className={classes.placeholder}>
                <Fade
                    in={loading}
                    style={{
                        transitionDelay: loading ? '800ms' : '0ms',
                    }}
                    unmountOnExit
                >
                    <CircularProgress />
                </Fade>
            </div>
            <Paper className={classes.paper}>
                <Grid container spacing={2}>
                    <TextField id="outlined-search"  error={error} helperText={errorMessage} fullWidth label="Enter Phone Number" type="search" variant="outlined" onChange={handleInputChange}/>
                    {rows.length>0?<TableContainer>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    {columns.map((column) => (
                                        <TableCell
                                            key={column.id}
                                            align={column.align}
                                            style={{ minWidth: column.minWidth }}
                                        >
                                            {column.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                                    return (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                            {columns.map((column,index2) => {
                                                const value = row;
                                                return (
                                                    <TableCell key={index+'unique'+index2} align={column.align}>
                                                        {value}
                                                    </TableCell>
                                                );
                                            })}
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>:null}
                    {rows.length>0?
                        <Grid
                            container
                            direction="row"
                            justify="center"
                            alignItems="center"
                        ><TablePagination
                        rowsPerPageOptions={[10]}
                        component="div"
                        count={rowCount}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onChangePage={handleChangePage}
                        onChangeRowsPerPage={handleChangeRowsPerPage}
                        /></Grid>:null}
                </Grid>
            </Paper>
        </div>
    );
}
