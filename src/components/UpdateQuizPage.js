import React from 'react'
import { Stack, TextField, Button, Switch, FormControlLabel, MenuItem } from '@mui/material'
import MuiAlert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Snackbar from '@mui/material/Snackbar';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});



export default function UpdateQuizPage(){
    const navigate = useNavigate();
    const host = "http://localhost:8080";
    const token = localStorage.getItem("token");

    const qid = window.location.href.split("/")[5];
    console.log(qid)
    const [data, setData] = useState({
        title: "",
        description: "",
        maxMarks: "",
        numberOfQuestions: "",
        active: false,
        category: {
            cid: '',

        },
    });

    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        
        const response = await fetch(host+"/quiz/"+qid,{
            method: "GET",
            headers:{
                "Content-Type": "application/json",
                'Authorization': "Bearer " + token,
            },
        });

        if(response.status===200){
            const data = await response.json();
            setData(data)

            const resp = await fetch(host + "/category/", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer " + token,
                },
            });

            if (resp.status === 200) {
                const data = await resp.json();
                setCategories(data);
            }
           
            
        }
    };


    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("warning")
    const user = JSON.parse(localStorage.getItem("user"));

    const handleSnackbarOpen = (message, severity) => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleChange = (event) => {

        const { name, value, checked } = event.target;
        const newValue = name === 'active' ? checked : value;

        setData((prevData) => ({
            ...prevData,
            [name]: newValue,
        }));

        console.log(data)
    };

    const handleCategoryChange = (event) => {
        const selectedCategoryId = event.target.value;
        const selectedCategory = categories.find((category) => category.cid === selectedCategoryId);

        setData((prevData) => ({
            ...prevData,
            category: {
              cid: selectedCategory.cid,
            },
          }));
        
          setSelectedCategory(selectedCategoryId);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (data.title === "" ||
            data.description === "" ||
            data.numberOfQuestions === "" ||
            data.maxMarks === "" ||
            data.category.cid === "") {
            handleSnackbarOpen("Please fill all the fields", "error");
            return;
        }
        try {
                const resp = await fetch(host + "/quiz/", {
                    method: "PUT",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': "Bearer " + token,
                    },
                    body: JSON.stringify({
                        qid: qid,
                        title: data.title,
                        description: data.description,
                        maxMarks: data.maxMarks,
                        numberOfQuestions: data.numberOfQuestions,
                        category: data.category,
                        active: data.active
                    })
                }).then((res) => {
                    if (res.status === 200) {
                        navigate("/admin");
                    } else {
                        console.log(res.data);
                        handleSnackbarOpen(res.data, "error");
                    }
                });
        } catch (error) {
            handleSnackbarOpen(error, "error");
            console.log(error);
        }
    }
    return(
        <>
            <Stack >
                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={6000}
                    onClose={handleSnackbarClose}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                >
                    <Alert severity={snackbarSeverity}>{snackbarMessage}</Alert>
                </Snackbar>
                <center><h1>Update Quiz</h1></center>
                <TextField
                    sx={{ mx: 5, my: 2 }}
                    id="title"
                    label="Title"
                    
                    name='title'
                    onChange={handleChange}
                    required
                    value={data.title}
                    multiline
                    maxRows={2}
                />
                <TextField
                    id="description"
                    sx={{ mx: 5 }}
                    label="Description"
                    name="description"
                    onChange={handleChange}
                    multiline
                    
                    value={data.description}
                    required
                    rows={6}
                />
                <Stack direction="row">
                    <TextField
                        sx={{ mx: 5, my: 2, width: 200 }}
                        id="maxMarks"
                        label="Maximum Marks"
                        type='number'
                        
                        required
                        name='maxMarks'
                        value={data.maxMarks}
                        onChange={handleChange}
                    />
                    <TextField
                        sx={{ mr: 5, my: 2, width: 200 }}
                        id="numberOfQuestions"
                        label="Number Of Questions"
                        type='number'
                        required
                       
                        value={data.numberOfQuestions}
                        name='numberOfQuestions'
                        onChange={handleChange}
                    />
                    <TextField
                        id="category"
                        name='catgeory'
                        sx={{ mr: 5, my: 2, width: 400 }}
                        select
                        required
                        label="Category"
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                    >
                        {categories.map((option) => (
                            <MenuItem key={option.cid} value={option.cid} >
                                {option.title}
                            </MenuItem>
                        ))}
                    </TextField>
                </Stack>
                <FormControlLabel sx={{ mx: 3, my: 1 }}control={<Switch checked={data.active} onChange={handleChange} name="active" />} label="Publish Quiz" />
                <center>
                    <Button
                        sx={{ mx: 5, my: 3, width: 100 }}
                        variant="contained"
                        size="large"
                        type="submit"
                        onClick={handleSubmit}>
                        Add
                    </Button>
                </center>

            </Stack>
        </>
    )
}