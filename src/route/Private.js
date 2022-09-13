import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/Auth";

export default function Private({Component}) {
    const { user } = useContext(AuthContext);
  return (
    <>{user ? <Component /> : <Navigate to="/login" />}</>
  )
}