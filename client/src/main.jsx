import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {createBrowserRouter, RouterProvider } from 'react-router-dom'
import Homepage from "./routes/homepage/Homepage"
import Dashboardpage from "./routes/dashboardPage/Dashboardpage"
import Chatpage from "./routes/chatPage/Chatpage"
import RootLayout from './layouts/rootLayout/RootLayout'
import DashboardLayout from './layouts/dashboardLayout/DashboardLayout'
import SignInPage from './routes/signInPage/SignInPage'
import SignUpPage from './routes/signUpPage/SignUpPage'


const router = createBrowserRouter([
  { 
    element: <RootLayout/>,
    children:[
      {
        path:"/", element:<Homepage/>
      },
      {
        path:"/sign-in/*", element:<SignInPage/>
      },
      {
        path:"/sign-up/*", element:<SignUpPage/>
      },
      {
        element:<DashboardLayout/>,
        children:[
          {
            path:"/dashboard",
            element:<Dashboardpage/>,
          },
          {
            path:"/dashboard/chats/:id",
            element:<Chatpage/>
          }
        ]
      }
    ]
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
