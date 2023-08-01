import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const AddQuestionPage = () => {
  const navigate = useNavigate();
  const host = 'http://localhost:8080';
  const qid = window.location.href.split('/')[5];
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('warning');
  const [data, setData] = useState({
    question: '',
    image: '',
    option1: '',
    option2: '',
    option3: '',
    option4: '',
    answer: '',
  });
  const [optionsFilled, setOptionsFilled] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setData((prevDetails) => ({ ...prevDetails, [name]: value }));
  };

  const handleQuestionChange = (value) => {
    setData((prevDetails) => ({ ...prevDetails, question: value }));
  };

  const handleSnackbarOpen = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (
      data.question === '' ||
      data.answer === '' ||
      data.option1 === '' ||
      data.option2 === '' ||
      data.option3 === '' ||
      data.option4 === ''
    ) {
      handleSnackbarOpen('Please fill all the fields', 'error');
      return;
    }

    try {
      const response = await fetch(host + '/generate-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'devesh18',
          password: 'devesh',
        }),
      });
      if (response.status === 200) {
        const tmp = await response.json();
        const token = tmp.token;
        console.log(token);

        const resp = await fetch(host + '/question/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
          },
          body: JSON.stringify({
            question: data.question,
            option1: data.option1,
            option2: data.option2,
            option3: data.option3,
            option4: data.option4,
            answer: data.answer,
            image: '',
            quiz: {
              qid: qid,
            },
          }),
        }).then((res) => {
          if (res.status === 200) {
            navigate('/admin');
          } else {
            console.log(res.data);
            handleSnackbarOpen(res.data, 'error');
          }
        });
      }
    } catch (error) {
      handleSnackbarOpen(error, 'error');
      console.log(error);
    }
    console.log(data);
  };

  useEffect(() => {
    if (
      data.option1 !== '' &&
      data.option2 !== '' &&
      data.option3 !== '' &&
      data.option4 !== ''
    ) {
      setOptionsFilled(true);
    } else {
      setOptionsFilled(false);
    }
  }, [data.option1, data.option2, data.option3, data.option4]);

  return (
    <form onSubmit={handleSubmit}>
      <ReactQuill
        value={data.question}
        onChange={handleQuestionChange}
        placeholder="Enter your question"
      />

      <TextField
        label="Image"
        name="image"
        value={data.image}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Option 1"
        name="option1"
        value={data.option1}
        onChange={handleChange}
        required
        fullWidth
        margin="normal"
      />
      <TextField
        label="Option 2"
        name="option2"
        value={data.option2}
        onChange={handleChange}
        required
        fullWidth
        margin="normal"
      />
      <TextField
        label="Option 3"
        name="option3"
        value={data.option3}
        onChange={handleChange}
        required
        fullWidth
        margin="normal"
      />
      <TextField
        label="Option 4"
        name="option4"
        value={data.option4}
        onChange={handleChange}
        required
        fullWidth
        margin="normal"
      />
      <FormControl fullWidth margin="normal" required>
        <InputLabel>Select Answer</InputLabel>
        <Select
          name="answer"
          value={data.answer}
          onChange={handleChange}
          disabled={!optionsFilled}
        >
          <MenuItem value={data.option1}>{data.option1}</MenuItem>
          <MenuItem value={data.option2}>{data.option2}</MenuItem>
          <MenuItem value={data.option3}>{data.option3}</MenuItem>
          <MenuItem value={data.option4}>{data.option4}</MenuItem>
        </Select>
      </FormControl>
      <Box mt={2}>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={!optionsFilled}
        >
          Add Question
        </Button>
      </Box>
    </form>
  );
};

export default AddQuestionPage;
