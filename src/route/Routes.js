import React from "react";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/Profile";
import Private from "./Private";
import { Route, Routes as RouterRoutes } from "react-router-dom";

export default function Routes() {
  return (
    <RouterRoutes>
      <Route exact path="/register" element={<Register />} />
      <Route exact path="/login" element={<Login />} />
      <Route exact path="/profile" element={<Private Component={Profile} />} />
      <Route exact path="/" element={<Private Component={Home} />} />
    </RouterRoutes>
  );
}
