import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
// Mengambil komponen dan loader dari file yang baru kamu buat
import WilayahPage, { wilayahLoader } from './WilayahPage'

const router = createBrowserRouter([
  {
    path: "/",
    element: <WilayahPage />,
    loader: wilayahLoader, // Ini yang menjalankan logika filter data
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)