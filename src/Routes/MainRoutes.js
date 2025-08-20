import React, { lazy } from "react";
import { Navigate } from "react-router-dom";
import AppLayout from './../componnets/Applayout';
import AuthGuard from "../componnets/Auth/AuthGuard";
import GuestGuard from "../componnets/Auth/GuestGuard";
import ForgotPassword from "../pages/authPages/ForgotPassword";
import VerifyOtp from "../pages/authPages/VerifyOtp";
import ResetPassword from "../pages/authPages/ResetPassword";
import LoginPage from "../pages/authPages/Login";



const IncidentDashboard = lazy(() => import('./../pages/IncidentDashboard'));
const Incident = lazy(() => import('./../pages/incidents/Incident'));
const CreateIncident = lazy(() => import('./../pages/incidents/CreateIncident'));
const IncidentDetails = lazy(() => import('./../pages/incidents/IncidentDetails'));
const User = lazy(() => import('./../pages/users/User'));
const AddUser = lazy(() => import('./../pages/users/AddUser'));
const DocumentRepository = lazy(() => import('./../pages/incidents/DocumentRepository'));
const AISearchDashboard = lazy(() => import('./../componnets/incidents/AISearch'));

export const privateRoutes = [
  {
    path: "/",
    element: (
      <AuthGuard>
        <AppLayout />
      </AuthGuard>
    ),
    children: [
      { index: true, element: <Navigate to="/home" replace /> },

      { path: "incident/dashboard", element: <IncidentDashboard/> },
      { path: "incident", element: <Incident /> },
      { path: "incident/create", element: <CreateIncident /> },
      { path: "incident/details/:id", element: <IncidentDetails /> },

      { path: "admin/pannel", element: <User /> },
      { path: "admin/pannel/adduser", element: <AddUser /> },

      { path: "home", element: <DocumentRepository /> },
      { path: "document/aiSearch", element: <AISearchDashboard /> },
    ],
  },
];

export const publicRoutes = [
  {
    path: "/login",
    element: (
      <GuestGuard>
        <LoginPage />
      </GuestGuard>
    ),
  },
  { path: "/resetPassword", element: <GuestGuard><ResetPassword /></GuestGuard> },
  { path: "/forgotPassword", element: <GuestGuard><ForgotPassword /></GuestGuard> },
  { path: "/verify-otp", element: <GuestGuard><VerifyOtp /></GuestGuard> },
];


export const appRoutes = [...privateRoutes, ...publicRoutes];
