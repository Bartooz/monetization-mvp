return (
    <div style={{ textAlign: "center", padding: "1rem", position: "relative" }}>
      <h3 style={{ marginBottom: "1rem" }}>{title || "Untitled Offer"}</h3>
  
      <div
        style={{
          position: "relative",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "260px",
          perspective: "1000px",
        }}
      >
        {/* Left Arrow */}
        <button
          onClick={rotateLeft}
          style={{
            position: "absolute",
            left: 0,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 5,
            fontSize: "1.5rem",
          }}
        >
          ◀
        </button>
  
        {/* Carousel Slots */}
        <div style={{ position: "relative", width: "300px", height: "100%" }}>
          {slots.map((slot, index) => (
            <div
              key={index}
              style={{
                position: "absolute",
                top: 0,
                left: "50%",
                transform: "translateX(-50%)",
                transition: "transform 0.4s ease, filter 0.4s ease, opacity 0.4s ease",
                width: "250px",
                padding: "16px",
                border: "1px solid #ccc",
                borderRadius: "10px",
                background: "#fff",
                textAlign: "center",
                ...getTransformStyle(index),
              }}
            >
              <div style={{ fontWeight: "bold", marginBottom: 8 }}>
                {slot.value} {slot.bonus ? `+ ${slot.bonus}` : ""}{" "}
                {slot.currency === "Cash"
                  ? "💵"
                  : slot.currency === "Gold Bars"
                  ? "🪙"
                  : "💎"}
              </div>
              <button style={{ padding: "6px 16px" }}>
                {slot.paid ? `${slot.value} Only!` : "Free!"}
              </button>
            </div>
          ))}
        </div>
  
        {/* Right Arrow */}
        <button
          onClick={rotateRight}
          style={{
            position: "absolute",
            right: 0,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 5,
            fontSize: "1.5rem",
          }}
        >
          ▶
        </button>
      </div>
    </div>
  );
  

