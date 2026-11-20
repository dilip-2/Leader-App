import Navbar from "./components/Navbar"

function App() {
  return (
    <div style={{ 
      backgroundColor: "#ffffff", 
      minHeight: "100vh",
    }}>
      {/* Welcome Header */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "auto",
          padding: "5px 5px",
          background: "#ffffff",
          borderBottom: "3px solid #ff6b00",
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        }}
      >
        <h1
          style={{
            fontSize: "40px",
            fontWeight: "bold",
            textAlign: "center",
            margin: 0,
            color: "#ff6b00",
            letterSpacing: "1px",
          }}
        >
          Welcome to Leader Portal
        </h1>
        
        {/* Horizontal Line with Hover Effect - Orange */}
        <hr
          style={{
            width: "20%",
            margin: "10px auto",
            border: "none",
            height: "3px",
            backgroundColor: "#ff6b00",
            borderRadius: "2px",
            transition: "width 0.5s ease-in-out",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.target.style.width = "80%";
          }}
          onMouseLeave={(e) => {
            e.target.style.width = "20%";
          }}
        />
      </div>

      {/* Navbar Container */}
      <div style={{ 
        backgroundColor: "#ffffff",
        padding: "0",
        margin: "0",
        borderRadius: "0",
        boxShadow: "none",
      }}>
        <Navbar />
      </div>
    </div>
  )
}

export default App