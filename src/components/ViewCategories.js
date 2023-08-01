import React, { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Fab from '@mui/material/Fab';
import { Stack, Avatar } from '@mui/material';
import { Link } from 'react-router-dom';

export function ViewCategoryPage() {
  const host = "http://localhost:8080";
  const [categories, setCategories] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

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
        localStorage.setItem('token', token);
        console.log(token);

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
      } else {
        // handleSnackbarOpen("Invalid Details No user found!","error");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();

    return () => {
      // Cleanup logic here
    };
  }, []);

  return (
    <>
      <Link to="/admin/add-category" style={{textDecoration:"none"}}>
        <Fab variant="extended" color="primary" aria-label="add" sx={{ justifyContent: "end", display: "flex", mx: 2 }}>
          Add Category
        </Fab>
      </Link>

      {categories.map(category => (
        <Card
          key={category.id}
          sx={{
            display: 'flex',
            mr: 20,
            backgroundColor: "#f5f5f5",
            boxShadow: 5,
            mx: 2,
            my: 2
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Stack direction="row" spacing={3}>
                        <Avatar
                            sx={{ width: 64, height: 64, my: 2, ml: 2 }}
                            alt="Category Image"
                            src="https://cdn-icons-png.flaticon.com/512/9458/9458876.png"
                        />
            <CardContent>
              <Typography component="div" variant="h6">
                {category.title}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" component="div">
                {category.description}
              </Typography>
            </CardContent>
            </Stack>
          </Box>
        </Card>
      ))}
    </>
  );
}
