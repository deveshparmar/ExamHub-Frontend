import React, { useEffect, useState } from "react";
import AspectRatio from '@mui/joy/AspectRatio';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CardOverflow from '@mui/joy/CardOverflow';
import Divider from '@mui/joy/Divider';
import Typography from '@mui/joy/Typography';
import ResponsiveAppBar from "./AppBar";
import { Button } from "@mui/material";


export function ProfilePage() {
    const user = JSON.parse(localStorage.getItem("user"));
    return (
        <>
            <center><h1>Profile</h1></center>
            <center>
                <Card variant="outlined" sx={{ width: 300 }}>
                    <CardOverflow>
                        <AspectRatio ratio="2">
                            <img
                                src="https://cdn-icons-png.flaticon.com/512/1165/1165674.png"
                                srcSet=" https://cdn-icons-png.flaticon.com/512/1165/1165674.png"
                                loading="lazy"
                                alt=""
                            />
                        </AspectRatio>
                    </CardOverflow>
                    <CardContent>
                    </CardContent>
                    <CardOverflow variant="soft" sx={{ bgcolor: 'background.level1' }}>
                        <Divider inset="context" />
                        <CardContent orientation="horizontal">
                            <Typography level="body3" fontWeight="md" textColor="text.secondary">
                                Username
                            </Typography>
                            <Divider orientation="vertical" />
                            <Typography level="body3" fontWeight="md" textColor="text.secondary" >
                                {user.username}
                            </Typography>
                        </CardContent>
                        <CardContent orientation="horizontal">
                            <Typography level="body3" fontWeight="md" textColor="text.secondary">
                                First Name
                            </Typography>
                            <Divider orientation="vertical" />
                            <Typography level="body3" fontWeight="md" textColor="text.secondary" >
                                {user.firstName}
                            </Typography>
                        </CardContent>
                        <CardContent orientation="horizontal">
                            <Typography level="body3" fontWeight="md" textColor="text.secondary">
                                Last Name
                            </Typography>
                            <Divider orientation="vertical" />
                            <Typography level="body3" fontWeight="md" textColor="text.secondary" >
                                {user.lastName}
                            </Typography>
                        </CardContent>
                        <CardContent orientation="horizontal">
                            <Typography level="body3" fontWeight="md" textColor="text.secondary">
                                Email
                            </Typography>
                            <Divider orientation="vertical" />
                            <Typography level="body3" fontWeight="md" textColor="text.secondary" >
                                {user.email}
                            </Typography>
                        </CardContent>
                        <CardContent orientation="horizontal">
                            <Typography level="body3" fontWeight="md" textColor="text.secondary">
                                Phone No
                            </Typography>
                            <Divider orientation="vertical" />
                            <Typography level="body3" fontWeight="md" textColor="text.secondary" >
                                {user.phone}
                            </Typography>
                        </CardContent>
                    </CardOverflow>
                    
                </Card>
            <Button sx={{mx:2,my:2}}variant="contained" size="medium">
                Update
            </Button>
            <Button sx={{mx:2,my:2}} variant="outlined" size="medium">
                Share
            </Button>
            </center>
        </>
    )
}