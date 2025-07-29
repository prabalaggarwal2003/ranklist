import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router'
import Home from './pages/Home.jsx'
import DSA from './pages/DSA.jsx'
import Dev from './pages/Dev.jsx'
import Opensource from './pages/Opensource.jsx'

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <App />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/dsa",
          element: <DSA/>,
        },
        {
          path: "/dev",
          element: <Dev/>,
        },
        {
          path: "/opensource",
          element: <Opensource/>,
        },
        
      ]
    }
  ]
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
