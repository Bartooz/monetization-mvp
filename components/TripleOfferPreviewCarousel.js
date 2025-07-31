import React, { useState } from "react";

export default function TripleOfferPreviewCarousel({ slots = [], title, design_data }) {

    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "1rem", // Optional to prevent tight fit
                boxSizing: "border-box",
            }}
        >
            <div
                style={{
                    width: "300px",
                    height: "400px",
                    border: "2px solid #ccc",
                    borderRadius: "12px",
                    padding: "0.5rem",
                    backgroundImage: design_data?.imageUrl ? `url(${design_data.imageUrl})` : "none",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    boxSizing: "border-box",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <h3
                    style={{
                        marginBottom: "1rem",
                        textAlign: "center",
                        fontFamily: design_data?.titleFont || "inherit",
                        color: design_data?.titleColor || "#000"
                    }}
                >
                    {title || "Untitled Offer"}
                </h3>

                <div
                    style={{
                        width: "100%",
                        flexGrow: 1,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        position: "relative",
                    }}
                >
                    {slots.length === 0 ? (
                        <div style={{ textAlign: "center", color: "#888" }}>
                            No slots configured
                        </div>
                    ) : (
                        slots.map((slot, index) => {
                            const offset =
                                (index - activeIndex + slots.length) % slots.length;

                            let transform = "translate(-50%, -50%)";
                            let zIndex = 2;
                            let filter = "blur(2px)";
                            let opacity = 0.6;
                            let pointerEvents = "none";

                            if (offset === 0) {
                                transform += " translateX(0px) scale(1)";
                                zIndex = 3;
                                filter = "none";
                                opacity = 1;
                                pointerEvents = "auto";
                            } else if (offset === 1) {
                                transform += " translateX(60px) scale(0.85)";
                            } else if (offset === 2) {
                                transform += " translateX(-60px) scale(0.85)";
                            } else {
                                return null;
                            }

                            return (
                                <div
                                    key={index}
                                    style={{
                                        position: "absolute",
                                        top: "50%",
                                        left: "50%",
                                        transform,
                                        transition:
                                            "transform 0.4s ease, filter 0.4s ease, opacity 0.4s ease",
                                        width: "160px",
                                        height: "160px",
                                        padding: "16px",
                                        border: "1px solid #ccc",
                                        borderRadius: "10px",
                                        ...(design_data?.slotBackgroundColor
                                            ? {
                                              backgroundColor: design_data.slotBackgroundColor,
                                              border: "1px solid #ccc",
                                            }
                                            : {
                                              backgroundColor: "rgba(255,255,255,0.1)",
                                              backdropFilter: "blur(6px)",
                                              WebkitBackdropFilter: "blur(6px)",
                                              border: "1px solid rgba(255,255,255,0.2)",
                                              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.25)"
                                            }),
                                        fontFamily: design_data?.slotFont || "inherit",
                                        color: design_data?.slotFontColor || "#000",
                                        textAlign: "center",
                                        zIndex,
                                        filter,
                                        opacity,
                                        pointerEvents,
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        alignItems: "center",
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
                                    <button
                                        style={{
                                            padding: "6px 16px",
                                            backgroundColor: design_data?.ctaColor || "#00cc66",
                                            color: "#fff",
                                            border: "none",
                                            borderRadius: "4px",
                                            cursor: "pointer",
                                          }}
                                        onClick={() =>
                                            setActiveIndex((activeIndex + 1) % slots.length)
                                        }
                                    >
                                        {slot.paid ? `${slot.value} Only!` : "Free!"}
                                    </button>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}





