import React from 'react'
import { Stack, TextField, Button } from '@mui/material'
import MuiAlert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Snackbar from '@mui/material/Snackbar';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function AddCategoryPage() {
  const navigate = useNavigate();
  const host = "http://localhost:8080";

  const [data, setData] = useState({
    title: "",
    description: "",
  });

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
    setData({
        ...data,
        [event.target.name]: event.target.value,
    });
};

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      data.title === "" ||
      data.description === ""
    ) {
      handleSnackbarOpen("Please fill all the fields", "error");
      return;
    }
    try {
      const response = await fetch(host + "/generate-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "devesh18",
          password: "devesh",
        }),
      });
      if (response.status === 200) {
        const tmp = await response.json();
        const token = tmp.token;
        console.log(token);

        const resp = await fetch(host + "/category/", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + token,
          },
          body: JSON.stringify({
            title: data.title,
            description: data.description,
          })
        }).then((res) => {
          if (res.status === 200) {
            navigate("/admin");
          } else {
            console.log(res.data);
            handleSnackbarOpen(res.data,"error");
          }
        });
      }
    } catch (error) {
      handleSnackbarOpen(error,"error");
      console.log(error);
    }
  }

  return (
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
        <center><h1>Add Category</h1></center>
        <TextField
          sx={{ mx: 5, my: 5 }}
          id="title"
          label="Title"
          name='title'
          onChange={handleChange}
          multiline
          maxRows={4}
        />
        <TextField
          id="description"
          sx={{ mx: 5 }}
          label="Description"
          name="description"
          onChange={handleChange}
          multiline
          rows={10}
        />
        <Button 
        sx={{ mx: 5, my: 5 }} 
        variant="contained" 
        size="medium" 
        type="submit"
        onClick={handleSubmit}>
          Add
        </Button>

      </Stack>
    </>
  )
}
