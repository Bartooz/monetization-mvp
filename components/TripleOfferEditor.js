import React, { useState, useEffect } from "react";
import TripleOfferPreviewVertical from "./TripleOfferPreviewVertical";
import TripleOfferPreviewHorizontal from "./TripleOfferPreviewHorizontal";
import TripleOfferPreviewCarousel from "./TripleOfferPreviewCarousel";
import TripleOfferPreviewVerticalCarousel from "./TripleOfferPreviewVerticalCarousel";
import PhonePreviewWrapper from "./PhonePreviewWrapper";

const USE_BACKEND = false; // Toggle to true to re-enable API
const FONT_OPTIONS = [
  "Arial",
  "Verdana",
  "Roboto",
  "Orbitron",
  "Chakra Petch",
  "Bangers",
  "Comic Neue",
];


const layoutComponents = {
  Horizontal: TripleOfferPreviewHorizontal,
  Vertical: TripleOfferPreviewVertical,
  Carousel: TripleOfferPreviewCarousel,
  "Vertical Carousel": TripleOfferPreviewVerticalCarousel,
};

const layouts = Object.keys(layoutComponents);

export default function TripleOfferEditor({ template, onSave, onCancel }) {
  const [templateName, setTemplateName] = useState("");
  const [offerTitle, setOfferTitle] = useState("");
  const [configuration, setConfiguration] = useState("");
  const [eventType, setEventType] = useState("Offer");
  const [offerType, setOfferType] = useState("Triple Offer");
  const [layout, setLayout] = useState(layouts[0]);
  const [configurations, setConfigurations] = useState([]);
  const [editingTemplate, setEditingTemplate] = useState({
    design_prompt: "",
    design_data: null,
  });
  const [activeTab, setActiveTab] = useState("info"); // "info" | "tweaks"


  useEffect(() => {
    if (!USE_BACKEND) {
      try {
        const savedConfigs = localStorage.getItem("configurations");
        const parsed = savedConfigs ? JSON.parse(savedConfigs) : [];
        setConfigurations(parsed);
      } catch (error) {
        console.error("Failed to load configurations from localStorage", error);
        setConfigurations([]);
      }
    } else {
      const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      fetch(`${BASE_URL}/api/configurations`)
        .then((res) => res.json())
        .then(setConfigurations)
        .catch((err) => {
          console.error("Failed to fetch configurations", err);
          setConfigurations([]);
        });
    }
  }, []);


  useEffect(() => {
    if (template) {
      setTemplateName(template.template_name || "");
      setOfferTitle(template.title || "");
      setConfiguration(template.configuration || "");
      setLayout(template.layout || layouts[0]);
      setEventType(template.event_type || "Offer");
      setOfferType(template.offer_type || "Triple Offer");
      setEditingTemplate({
        design_prompt: template.design_prompt || "",
        design_data: template.design_data || null,
      });
    } else {
      setTemplateName("");
      setOfferTitle("");
      setConfiguration("");
      setLayout("Vertical");
      setEventType("Offer");
      setOfferType("Triple Offer");
      setEditingTemplate({
        design_prompt: "",
        design_data: null,
      });
    }
  }, [template]);

  const filteredConfigurations = configurations.filter(
    (c) => c.event_type === eventType && c.offer_type === offerType
  );

  const handleSave = () => {
    const configObj = configurations.find((c) => c.config_name === configuration);
    const payload = {
      template_name: templateName.trim(),
      title: offerTitle.trim(),
      configuration: configuration || "",
      layout: layout || "Vertical",
      event_type: eventType || "Offer",
      offer_type: offerType || "Triple Offer",
      slots: configObj?.slots || [
        { value: "", bonus: "", currency: "Cash", paid: true },
        { value: "", bonus: "", currency: "Cash", paid: true },
        { value: "", bonus: "", currency: "Cash", paid: true },
      ],
      design_prompt: editingTemplate?.design_prompt || "",
      design_data: editingTemplate?.design_data || null,
    };
    onSave(payload);
  };

  const handleCancel = () => {
    onCancel();
  };

  const handleLayoutSwitch = (dir) => {
    const index = layouts.indexOf(layout);
    const newIndex = dir === "next" ? (index + 1) % layouts.length : (index - 1 + layouts.length) % layouts.length;
    setLayout(layouts[newIndex]);
  };

  const LayoutPreview = layoutComponents[layout];
  const selectedConfig = configurations.find((c) => c.config_name === configuration);
  const slots = selectedConfig?.slots || [
    { value: "", bonus: "", currency: "", paid: false },
    { value: "", bonus: "", currency: "", paid: false },
    { value: "", bonus: "", currency: "", paid: false },
  ];

  return (
    <div className="tpl-editor-two">
      <section className="card editor-left">
        <div className="editor-tabs">
          <button
            type="button"
            className={`tab ${activeTab === "info" ? "active" : ""}`}
            onClick={() => setActiveTab("info")}
          >
            Main Info
          </button>
          <button
            type="button"
            className={`tab ${activeTab === "tweaks" ? "active" : ""}`}
            onClick={() => setActiveTab("tweaks")}
          >
            Design Tweaks
          </button>
        </div>
        {activeTab === "info" && (
          <div className="editor-pane">

            <section className="card editor-panel">

              <div className="field">
                <div className="label">
                  Event Type:{" "}
                  <select className="select" value={eventType} onChange={(e) => setEventType(e.target.value)}>
                    <option>Offer</option>
                  </select>
                </div>
              </div>

              <div className="field">
                <div className="label">
                  Offer Type:{" "}
                  <select className="select" value={offerType} onChange={(e) => setOfferType(e.target.value)}>
                    <option>Triple Offer</option>
                  </select>
                </div>
              </div>

              <div className="field">
                <div className="label">
                  Template Name:
                  <input
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    disabled={!!template}
                    className="input"
                  />
                </div>
              </div>

              <div className="field">
                <div className="label">
                  Offer Title:
                  <input
                    value={offerTitle}
                    onChange={(e) => setOfferTitle(e.target.value)}
                    className="input"
                  />
                </div>
              </div>

              <div className="field">
                <div className="label">
                  Configuration:
                  <select
                    value={configuration}
                    onChange={(e) => setConfiguration(e.target.value)}
                    className="select"
                  >
                    <option value="">Select</option>
                    {filteredConfigurations.map((c) => (
                      <option key={c.config_name} value={c.config_name}>
                        {c.config_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="field">
                <div className="label">
                  Design Prompt (for AI-generated layout)
                </div>
                <textarea
                  value={editingTemplate?.design_prompt || ""}
                  onChange={(e) =>
                    setEditingTemplate((prev) => ({
                      ...prev,
                      design_prompt: e.target.value,
                    }))
                  }
                  placeholder="Describe the visual theme, art style, or mood of this offer (e.g. retro neon, fantasy forest, space-themed)"
                  style={{
                    width: "100%",
                    height: "100px",
                    padding: 10,
                    fontSize: 14,
                    borderRadius: 6,
                    border: "1px solid #ccc",
                    resize: "vertical",
                  }}
                />
                <button
                  type="button" className="btn btn-secondary"
                  onClick={() => {
                    const predefinedBackgrounds = [
                      { label: "Fantasy Forest", url: "/backgrounds/fantasy_forest.png" },
                      { label: "Magic Shop", url: "/backgrounds/magic_shop.png" },
                      { label: "Cartoon Space", url: "/backgrounds/cartoon_space.png" },
                      { label: "Pirate Island", url: "/backgrounds/pirate_island.png" },
                      { label: "Halloween", url: "/backgrounds/halloween.png" },
                      { label: "Christmas", url: "/backgrounds/christmas.png" },
                      { label: "4th of July", url: "/backgrounds/4th_of_july.png" },
                    ];

                    const randomDesign = predefinedBackgrounds[Math.floor(Math.random() * predefinedBackgrounds.length)];



                    setEditingTemplate((prev) => ({
                      ...prev,
                      design_data: {
                        imageUrl: randomDesign.url,
                        slotBackgroundColor: "",  // dark background for slots
                        ctaColor: "#00cc66",             // always green CTA
                        titleFont: "Orbitron",           // futuristic for title
                        slotFont: "Chakra Petch"         // consistent style for slot text
                      }
                    }));
                  }}
                >
                  🧠 Generate Design (Simulated)
                </button>
              </div>




            </section>
          </div>
        )}

        {activeTab === "tweaks" && (
          <div className="editor-pane">
            {/* PASTE the whole tweaks block here, but change ONLY the wrapper tag: */}
            <div className="tweaks-panel">

              <section className="card editor-tweaks">





                <div className="field">
                  <div className="label">
                    Slot Background Color:
                    <input
                      className="input"
                      type="color"
                      value={editingTemplate.design_data?.slotBackgroundColor || ""}
                      onChange={(e) =>
                        setEditingTemplate((prev) => ({
                          ...prev,
                          design_data: { ...prev.design_data, slotBackgroundColor: e.target.value },
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="field">
                  <div className="label">
                    CTA Button Color:
                    <input
                      className="input"
                      type="color"
                      value={editingTemplate.design_data?.ctaColor || "#00cc66"}
                      onChange={(e) =>
                        setEditingTemplate((prev) => ({
                          ...prev,
                          design_data: { ...prev.design_data, ctaColor: e.target.value },
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="field">
                  <div className="label">
                    Title Font:
                    <select
                      value={editingTemplate.design_data?.titleFont || ""}
                      onChange={(e) =>
                        setEditingTemplate((prev) => ({
                          ...prev,
                          design_data: { ...prev.design_data, titleFont: e.target.value },
                        }))
                      }
                      className="select"
                    >
                      <option value="">Default</option>
                      {FONT_OPTIONS.map((font) => (
                        <option key={font} value={font}>
                          {font}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>


                <div className="field">
                  <div className="label">
                    Slot Font:
                    <select
                      value={editingTemplate.design_data?.slotFont || ""}
                      onChange={(e) =>
                        setEditingTemplate((prev) => ({
                          ...prev,
                          design_data: { ...prev.design_data, slotFont: e.target.value },
                        }))
                      }
                      className="select"
                    >
                      <option value="">Default</option>
                      {FONT_OPTIONS.map((font) => (
                        <option key={font} value={font}>
                          {font}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="field">

                  <div className="label">
                    Title Font Color:
                    <input
                      className="input"
                      type="color"
                      value={editingTemplate.design_data?.titleColor || "#000000"}
                      onChange={(e) =>
                        setEditingTemplate((prev) => ({
                          ...prev,
                          design_data: { ...prev.design_data, titleColor: e.target.value },
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="field">

                  <div className="label">
                    Slot Font Color:
                    <input
                      className="input"
                      type="color"
                      value={editingTemplate.design_data?.slotFontColor || "#000000"}
                      onChange={(e) =>
                        setEditingTemplate((prev) => ({
                          ...prev,
                          design_data: { ...prev.design_data, slotFontColor: e.target.value },
                        }))
                      }
                    />
                  </div>
                </div>




              </section>
            </div>
          </div>
        )}




        <div className="editor-footer">
          {template && (
            <button type="button" className="btn btn-secondary" onClick={handleCancel}>
              Cancel
            </button>
          )}
          <button onClick={handleSave} type="button" className="btn btn-primary">
            {template ? "Update Template" : "Save Template"}
          </button>
        </div>

      </section>
      <section className="editor-right">

        <div style={{ flex: 1 }}>
          <div className="layout-switcher">
            <button className="ghost-btn" onClick={() => handleLayoutSwitch("prev")} aria-label="Previous layout">◀</button>
            <div className="layout-label">{layout} Layout</div>
            <button className="ghost-btn" onClick={() => handleLayoutSwitch("next")} aria-label="Next layout">▶</button>
          </div>

          <PhonePreviewWrapper>
            <LayoutPreview
              title={offerTitle}
              slots={slots}
              design_data={editingTemplate?.design_data}
            />
          </PhonePreviewWrapper>
        </div>
      </section>
    </div>
  );
}

















