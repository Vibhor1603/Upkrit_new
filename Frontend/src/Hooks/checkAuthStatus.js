// import { useEffect, useState } from "react";

// const checkAuthStatus = () => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [isLoading, setLoading] = useState(true);
//   const [userRole, setUserRole] = useState("");
//   useEffect(() => {
//     async function userAuth() {
//       try {
//         const response = await fetch(
//           "http://localhost:3000/api/v1/user/session",
//           {
//             method: "GET",
//             credentials: "include",
//           }
//         );
//         if (response.ok) {
//           const data = await response.json();

//           // localStorage.setItem("username", data.username);
//           localStorage.setItem("ROLE", data.userRole);
//           localStorage.setItem("username", data.username);
//           setIsAuthenticated(data.isAuthenticated); // Set based on server response
//           setUserRole(data.userRole);
//           console.log(data.userRole);
//           setLoading(false);
//         } else {
//           setIsAuthenticated(false);
//           setLoading(false);
//         }
//       } catch (error) {
//         console.error("Error checking session:", error);
//         setIsAuthenticated(false);
//         setLoading(false);
//       }
//     }
//     userAuth();
//   }, []);
//   return { isAuthenticated, isLoading, userRole };
// };

// export default checkAuthStatus;
