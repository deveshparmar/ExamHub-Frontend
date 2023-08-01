import React from "react";
import { useState, useEffect } from "react";
import DeleteIcon from "@mui/icons-material/Delete";

import {
  Avatar,
  Typography,
  CardContent,
  Box,
  Card,
  Fab,
  Stack,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export function ViewQuizPage() {
  const host = "http://localhost:8080";
  const navigate = useNavigate();
  const [quizes, setQuizes] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedQuizId, setSelectedQuizId] = useState(null);

  const fetchData = async () => {
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
        const data = await response.json();
        const token = data.token;
        localStorage.setItem("token", token);

        const resp = await fetch(host + "/quiz/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        });

        if (resp.status === 200) {
          const data = await resp.json();
          setQuizes(data);
        }
      } else {
        // handleSnackbarOpen("Invalid Details No user found!","error");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteDialogOpen = (quizId) => {
    setSelectedQuizId(quizId);
    setDeleteDialogOpen(true);
  };

  const handleUpdate = (qid) =>{
    navigate(`/admin/quiz/${qid}`);
  }

  const handleViewQustions=(qid,name)=>{
  const decodedName = decodeURIComponent(name);
  navigate(`/admin/view-questions/${qid}/${decodedName}`);
  }

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
  };

  const handleDeleteQuiz = async(quizId) => {

    try{
    // Perform deletion logic here

    const resp = await fetch(host + "/quiz/"+quizId, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      
      if (resp.status === 200) {
        console.log("Deleting quiz with ID:", quizId);
        // const data = await resp.text;
        // console.log(data);
       setQuizes(quizes.filter((quiz)=> quiz.qid!==quizId))
        
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
          onClick={()=> navigate("/admin/add-quiz")}
          aria-label="add"
          sx={{ justifyContent: "end", display: "flex", mx: 2 }}
        >
          Add Quiz
        </Fab>

      {quizes.map((quiz) => (
        <Card
          // key={}
          sx={{
            display: "flex",
            mr: 20,
            backgroundColor: "#f5f5f5",
            boxShadow: 5,
            mx: 1,
            my: 1,
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Stack direction="row" spacing={1}>
              <Avatar
                sx={{ width: 64, height: 64, my: 2, ml: 2 }}
                alt="Category Image"
                src="https://cdn-icons-png.flaticon.com/512/3874/3874176.png"
              />
              <CardContent>
                <Typography component="div" variant="h7" sx={{ fontWeight: "bold" }}>
                  {quiz.title}
                </Typography>
                <Typography sx={{ mt: 0.5 }} variant="subtitle2" color="text.secondary" component="div">
                  Category - {quiz.category.title}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary" component="div">
                  {quiz.description}
                </Typography>
                <Stack spacing={2} sx={{ mt: 1 }} direction="row">
                  <Button variant="contained" size="small" onClick={()=> handleViewQustions(quiz.qid,quiz.title)}>
                    Questions
                  </Button>
                  <Button variant="contained" size="small" onClick={()=>handleUpdate(quiz.qid)}>
                    Update
                  </Button>
                  <Button variant="contained" size="small">
                    Attempts
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<DeleteIcon />}
                    size="small"
                    onClick={() => handleDeleteDialogOpen(quiz.qid)}
                  >
                    Delete
                  </Button>
                  <Button variant="secondary" size="small">
                    Max-Marks: {quiz.maxMarks}
                  </Button>
                  <Button variant="secondary" size="small">
                    Questions: {quiz.numberOfQuestions}
                  </Button>
                </Stack>
              </CardContent>
            </Stack>
           
          </Box>
        </Card>
      ))}

     
      <Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose}>
        <DialogTitle>Delete Quiz</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this quiz?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose}>Cancel</Button>
          <Button onClick={() => handleDeleteQuiz(selectedQuizId)} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
