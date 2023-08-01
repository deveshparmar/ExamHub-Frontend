import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Dialog,DialogActions,DialogContent,DialogContentText,DialogTitle } from "@mui/material";
import Divider from "@mui/material/Divider";
import { useParams, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";

export function QuizInstructionPage() {
   const{qid} = useParams();
   const navigate = useNavigate();
   const host = "http://localhost:8080";
   const [quiz, setQuiz] = useState([]);
   const [openDialog, setOpenDialog] = useState(false);
   const handleStartQuiz = () => {
    setOpenDialog(true);
  };
   useEffect(()=>{
    const fetchQuiz = async () =>{
        try {
            const response = await fetch(host + "/generate-token", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                username: "user1",
                password: "password",
              }),
            });
      
            if (response.status === 200) {
              const data = await response.json();
              const token = data.token;
              localStorage.setItem('token', token);
      
              const resp = await fetch(host + "/quiz/" + qid, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': "Bearer " + token,
                },
              });
      
              if (resp.status === 200) {
                const data = await resp.json();
                setQuiz(data);
              }
            } else {
              // handleSnackbarOpen("Invalid Details No user found!","error");
            }
          } catch (error) {
            console.error(error);
          }
    }
    fetchQuiz();
   })
  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  };

  const cardStyle = {
    maxWidth: 800,
    padding: "16px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
  };

  const headingStyle = {
    marginBottom: "16px",
  };

  const subtitleStyle = {
    marginBottom: "16px",
  };

  const importantInstructionsStyle = {
    marginBottom: "16px",
  };

  const listItemStyle = {
    marginBottom: "8px",
  };

  const attemptingQuizStyle = {
    marginBottom: "16px",
  };

  const startQuiz = (qid) =>()=>{
    navigate(`/startQuiz/${qid}`);
  }

  return (
    <div style={containerStyle}>
      <Card style={cardStyle}>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom style={headingStyle}>
            Read the instructions of this page carefully
          </Typography>
          <Typography variant="subtitle1" gutterBottom style={subtitleStyle}>
            One step more to go
          </Typography>

          <Typography variant="h4" gutterBottom>
            {quiz.title}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {quiz.description}
          </Typography>

          <Divider />

          <Typography variant="h5" gutterBottom style={headingStyle}>
            Important Instructions
          </Typography>
          <ul style={importantInstructionsStyle}>
            <li style={listItemStyle}>This quiz is only for practice purposes.</li>
            <li style={listItemStyle}>
              You have to submit the quiz within <b>{quiz.numberOfQuestions * 2} Minutes.</b>
            </li>
            <li style={listItemStyle}>You can attempt the quiz any number of times.</li>
            <li style={listItemStyle}>
              There are <b>{quiz.numberOfQuestions} questions</b> in this quiz.
            </li>
            <li style={listItemStyle}>
              Each question carries <b>{quiz.maxMarks / quiz.numberOfQuestions} marks</b>. No negative marking for wrong ones.
            </li>
            <li style={listItemStyle}>All questions are of MCQ types.</li>
          </ul>

          <Divider />

          <Typography variant="h5" gutterBottom style={headingStyle}>
            Attempting Quiz
          </Typography>
          <ul style={attemptingQuizStyle}>
            <li style={listItemStyle}>Click <b>Start Quiz</b> button to start the quiz.</li>
            <li style={listItemStyle}>The time will start the moment you click the Start Test button.</li>
            <li style={listItemStyle}>You cannot resume this quiz if interrupted due to any reason.</li>
            <li style={listItemStyle}>Scroll down to move to the next question.</li>
            <li style={listItemStyle}>Click on the Submit Quiz button on completion of the quiz.</li>
            <li style={listItemStyle}>The report of the test is automatically generated in the form of a PDF copy.</li>
          </ul>
        </CardContent>
        <div className="text-center" >
          <center><Button variant="contained" sx={{justifyContent:"center"}} color="primary" onClick={handleStartQuiz}>
            Start Quiz
          </Button>
          </center>
        </div>
      </Card>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Start Quiz Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to start the quiz?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={startQuiz(qid)} color="primary">
            Start
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
