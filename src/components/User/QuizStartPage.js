import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ResponsiveAppBar from "../AppBar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import RadioGroup from "@mui/material/RadioGroup";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";


export function QuizStartPage() {
    const containerStyle = {
        padding: "20px",
    };

    const quizCardStyle = {
        marginTop: "70px",
        padding: "16px",
    };

    const questionsCardStyle = {
        marginTop: "10px",
        padding: "16px",
    };

    const progressCardStyle = {
        marginTop: "70px",
        padding: "16px",
    };

    const resultCardStyle = {
        marginTop: "20px",
        padding: "16px",
        textAlign: "center",
    };
    const printButtonStyle = {
        marginTop: "20px",
    };

    const [timeRemaining, setTimeRemaining] = useState(60);
    const [timerInterval, setTimerInterval] = useState(null);
    const [isTimeUp, setIsTimeUp] = useState(false);
    const [questions, setQuestions] = useState([]);
    const { qid } = useParams();
    const [isSubmit, setIsSubmit] = useState(false);
    const [marksGot, setMarksGot] = useState(null);
    const [corrrectAns, setCorrectAns] = useState(null);
    const [attempted, setAttempted] = useState(null);
    const [percentage, setPercentage] = useState(null);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [openDialog, setOpenDialog] = useState(false);
    const [allQuestionsAttempted, setAllQuestionsAttempted] = useState(false);

    const host = "http://localhost:8080";

    const handleChange = (event, questionId) => {
        setSelectedAnswers({
            ...selectedAnswers,
            [questionId]: event.target.value,
        });

        setQuestions((prevQuestions) =>
            prevQuestions.map((question) =>
                question.quesId === questionId
                    ? { ...question, givenAnswer: event.target.value } : question))
    };


    useEffect(() => {

        timerInterval && clearInterval(timerInterval);
        if(!isTimeUp){
        const interval = setInterval(() => {
            setTimeRemaining((prevTime) => {
                if (prevTime === 0) {
                    clearInterval(interval);
                    setIsTimeUp(true);
                    handleSubmit();
                }
                return prevTime > 0 ? prevTime - 1 : 0;
            });
        }, 1000);

        setTimerInterval(interval);
        return () => clearInterval(interval);
        }
    }, [isTimeUp]);

    useEffect(() => {
        const fetchQuestion = async () => {
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

                    const resp = await fetch(host + "/question/quiz/" + qid, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': "Bearer " + token,
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
        }
        fetchQuestion();
    }, [qid]);

    const handleSubmit = () => {
        const areAllQuestionsAttempted = questions.every((q) => selectedAnswers.hasOwnProperty(q.quesId));
        setAllQuestionsAttempted(areAllQuestionsAttempted);
        setOpenDialog(true);
        setIsTimeUp(true);
        console.log(selectedAnswers);
    }
    const getFormattedTime = () => {
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleDialogSubmit = () => {
        setOpenDialog(false);
        handleResults();
        setIsSubmit(true);
    };

    const handleResults = async() => {
        const quizData = questions.map((q) => ({
            ...q,
            givenAnswer: selectedAnswers[q.quesId] || null,
        }));

        console.log(quizData);

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
      
              const resp = await fetch(host + "/question/eval-quiz", {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': "Bearer " + token,
                },
                body: JSON.stringify(quizData),
              });
      
              if (resp.status === 200) {
                const data = await resp.json();
                const { marksGot, correctAnswers, attempted, percentage } = data;
                
            setMarksGot(marksGot);
            setCorrectAns(correctAnswers);
            setAttempted(attempted);
            setPercentage(percentage);
              }
            } else {
              // handleSnackbarOpen("Invalid Details No user found!","error");
            }
          } catch (error) {
            console.error(error);
          }        
        
    };


    return (
            <>
                <ResponsiveAppBar />
                <Box style={containerStyle}>
                    {/* Quiz Content */}
                    <Box className="bootstrap-wrapper">
                        <Box className="container-fluid">
                            <Box className="row">
                                {!isTimeUp && (
                                <Box className="col-md-2">
                                    <Card style={containerStyle}>
                                        <CardContent style={{ padding: 0, textAlign: "center" }}>
                                            <Typography variant="h5" gutterBottom>
                                                Progress
                                            </Typography>
                                            <Typography variant="subtitle1" gutterBottom>
                                                Quiz will automatically submit when the timer reaches <b>0:0</b>
                                            </Typography>
                                            <Typography variant="h4" className="text-center">
                                                {getFormattedTime()}
                                            </Typography>
                                            {/* Use CircularProgress component */}
                                            <center><Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 100, height: 100 }}>
                                                <CircularProgress variant="determinate" value={((60 - timeRemaining) / 60) * 100} color="primary" />
                                            </Box>
                                            </center>
                                        </CardContent>
                                    </Card>
                                </Box>
                                )}
                                {questions.length > 0 ? (
                                    <center>
                                        <h2>On going Quiz - {questions[0].quiz.title}</h2>
                                    </center>
                                ) :
                                    <center>
                                        <h2>On going Quiz - Loading...</h2>
                                    </center>}
                                {/* <Box className="col-md-2">
                
                <Card style={quizCardStyle}>
                  <CardContent>
                    <Typography variant="h5" gutterBottom>
                      <b>Instructions</b>
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      Do not refresh the page otherwise you will get new questions in this quiz.
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      Do not switch the tabs.
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      Do not minimize the window.
                    </Typography>
                  </CardContent>
                </Card>
              </Box>  */}
                                <Box className="col-md-8">
                                    {!isSubmit && questions.length > 0 ? (
                                        questions.map((q, i) => (
                                            <Card key={i} style={questionsCardStyle}>
                                                <CardContent>
                                                    <Typography variant="body1" gutterBottom>
                                                        <b>Q{i + 1}) </b>
                                                        {/* {q.question} */}
                                                        <span dangerouslySetInnerHTML={{ __html: q.question }} />
                                                    </Typography>
                                                    <Divider />
                                                    <FormControl component="fieldset">
                                                        <RadioGroup name={`question_${q.quesId}`}
                                                            row
                                                            value={selectedAnswers[q.quesId] || ""}
                                                            onChange={(event) => handleChange(event, q.quesId)}>
                                                            <FormControlLabel
                                                                value={q.option1}
                                                                control={<Radio />}
                                                                label={q.option1}
                                                                style={{ marginRight: "20px" }}
                                                            />
                                                            <FormControlLabel
                                                                value={q.option2}
                                                                control={<Radio />}
                                                                label={q.option2}
                                                                style={{ marginRight: "20px" }}
                                                            />
                                                            <FormControlLabel
                                                                value={q.option3}
                                                                control={<Radio />}
                                                                label={q.option3}
                                                                style={{ marginRight: "20px" }}
                                                            />
                                                            <FormControlLabel
                                                                value={q.option4}
                                                                control={<Radio />}
                                                                label={q.option4}
                                                                style={{ marginRight: "20px" }}
                                                            />
                                                        </RadioGroup>
                                                    </FormControl>
                                                </CardContent>
                                            </Card>
                                        ))) : (
                                        <Typography variant="body1"></Typography>
                                    )}
                                </Box>


                            </Box>
                        </Box>
                    </Box>
                    <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                        <DialogTitle>Quiz Submission</DialogTitle>
                        <DialogContent>
                            {allQuestionsAttempted ? (
                                <>
                                    <DialogContentText>
                                        Are you sure you want to submit the quiz?
                                    </DialogContentText>
                                    {/* Additional content or details can be added here */}
                                </>
                            ) : (
                                <DialogContentText>
                                    Please attempt all the questions before submitting the quiz.
                                </DialogContentText>
                            )}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                            {allQuestionsAttempted && (
                                <Button color="primary" onClick={handleDialogSubmit}>
                                    Submit
                                </Button>
                            )}
                        </DialogActions>
                    </Dialog>


                    {/* Result Content */}
                    {isSubmit && (
                        <Box className="bootstrap-wrapper">
                            <Box className="row mt20">
                                <Box className="col-md-6 offset-md-3">
                                    <Card style={resultCardStyle}>
                                        <CardContent>
                                            <Typography variant="h5" gutterBottom>
                                                Quiz Result - {qid}
                                            </Typography>
                                            <Typography variant="h5">
                                                Marks Got : <b>{marksGot}</b>
                                            </Typography>
                                            <Typography variant="h5">
                                                Correct Answers : <b>{corrrectAns}</b>
                                            </Typography>
                                            <Typography variant="h5">
                                                Questions Attempted : <b>{attempted}</b>
                                            </Typography>
                                            <Typography variant="h5">
                                                Percentage : <b>{percentage}</b>
                                            </Typography>
                                        </CardContent>
                                        <Button
                                            variant="contained"
                                            size="large"
                                            color="primary"
                                            sx={printButtonStyle}
                                            onClick={() => window.print()}
                                        >
                                            Print
                                        </Button>
                                    </Card>
                                </Box>
                            </Box>
                        </Box>
                    )}

                    {!isSubmit && questions.length > 0 && (
                        <center>
                            <Button
                                variant="contained"
                                size="large"
                                sx={{ justifyContent: "center", mt: 2 }}
                                color="primary"
                                onClick={handleSubmit}
                            >
                                Submit
                            </Button>
                        </center>
                    )}
                    {!isSubmit && questions.length === 0 && (
                        <center>
                            <Typography variant="body1">Loading...</Typography>
                        </center>
                    )}
                </Box>
            </>
        );
    }

