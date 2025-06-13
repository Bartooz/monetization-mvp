import React, { useState } from "react";

export default function TripleOfferPreviewCarousel({ slots = [], title }) {
    const [activeIndex, setActiveIndex] = useState(0);



    return (
        <div
          style={{
            border: '10px solid black',
            borderRadius: '30px',
            width: '375px',
            height: '667px',
            margin: '0 auto',
            backgroundColor: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <div
            style={{
              display: 'flex',
              overflowX: 'auto',
              scrollSnapType: 'x mandatory',
              width: '80%',
              height: '100%',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {slots.map((slot, index) => (
              <div
                key={index}
                style={{
                  flex: '0 0 100%',
                  scrollSnapAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '20px',
                }}
              >
                <h3 style={{ marginBottom: '10px' }}>Untitled Offer</h3>
                <div
                  style={{
                    border: '2px solid #ccc',
                    borderRadius: '10px',
                    padding: '10px 20px',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontWeight: 'bold' }}>
                    {slot.paid ? `${slot.value}$ + ${slot.bonus}$ 💰` : slot.value}
                  </div>
                  <button style={{ marginTop: '5px' }}>
                    {slot.paid ? `${slot.value}$ Only!` : 'Free!'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
      
      

}

