import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Card, CardContent, Typography, Fab, Box, Button, Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

const ViewQuestionPage = () => {
  const host = 'http://localhost:8080';
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedQuesId, setSelectedQuesId] = useState(null);
  const qid = window.location.href.split('/')[5];
  const title = window.location.href.split('/')[6];
  console.log(title);

  const fetchData = async () => {
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
        const data = await response.json();
        const token = data.token;
        localStorage.setItem('token', token);

        const resp = await fetch(host + '/question/quiz/all/' + qid, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
          },
        });

        if (resp.status === 200) {
          const data = await resp.json();
          console.log(data);
          setQuestions(data);
        }
      } else {
        // handleSnackbarOpen("Invalid Details No user found!","error");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdate = (quesId) => {
    navigate(`/admin/${title}/question/${quesId}`);
  }
 
  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteDialogOpen = (quesId) => {
    setSelectedQuesId(quesId)
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
  };

  const handleDeleteQuiz = async(quesId) => {

    try{
    // Perform deletion logic here

    const resp = await fetch(host + "/question/"+quesId, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      
      if (resp.status === 200) {
        console.log("Deleting question with ID:", quesId);
        // const data = await resp.text;
        // console.log(data);
       setQuestions(questions.filter((question)=> question.quesId!==quesId))
        
      }else{
        console.log("error")
      }
    }catch(error){
        console.log(error);
    }finally{
        handleDeleteDialogClose();
    }

    
    // ...
  };

  return (
    <>
      <Fab
        variant="extended"
        color="primary"
        onClick={() => navigate("/admin/add-question/" + qid)}
        aria-label="add"
        sx={{ justifyContent: "end", display: "flex", mx: 2 }}
      >
        Add Questions
      </Fab>

      <div>
        <h4>{decodeURIComponent(title)} Questions</h4>
        {questions.map((question) => (
          <Card style={{ backgroundColor: '#ffffff', border: '1px solid #ccc', width: 1000 }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography variant="h1" component="div" style={{ color: '#333333', fontSize: '1rem' }}>
                    {question.question}
                  </Typography>
                  <div style={{ marginTop: '0.5rem' }}>
                    <Typography variant="body1" style={{ color: '#333333', fontSize: '1rem', marginBottom: '0.5rem' }}>
                      a) {question.option1}
                    </Typography>
                    <Typography variant="body1" style={{ color: '#333333', fontSize: '1rem', marginBottom: '0.5rem' }}>
                      b) {question.option2}
                    </Typography>
                    <Typography variant="body1" style={{ color: '#333333', fontSize: '1rem', marginBottom: '0.5rem' }}>
                      c) {question.option3}
                    </Typography>
                    <Typography variant="body1" style={{ color: '#333333', fontSize: '1rem', marginBottom: '0.5rem' }}>
                      d) {question.option4}
                    </Typography>
                  </div>
                  <Typography variant="body1" fontStyle="italic" style={{ color: '#000000' }}>
                    Correct Answer: {question.answer}
                  </Typography>
                </Box>
                <Box>
                  <Box display="flex">
                    <Button variant="contained" color="primary" onClick={() => handleUpdate(question.quesId)}>
                      Update
                    </Button>
                    <Box ml={1} />
                    <Button variant="outlined" startIcon={<DeleteIcon/>} color="secondary" onClick={() => handleDeleteDialogOpen(question.quesId)}>
                      Delete
                    </Button>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose}>
        <DialogTitle>Delete Quiz</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this quiz?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose}>Cancel</Button>
          <Button onClick={() => handleDeleteQuiz(selectedQuesId)} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

    </>
  );
};

export default ViewQuestionPage;
